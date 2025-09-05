/**
 * Google Apps Script to add unique row IDs to the Portfolio sheet
 * This will add a new column K for unique identifiers
 */

function addUniqueRowIds() {
  console.log('🆔 Starting unique row ID addition...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return;
    }
    
    // First, add the header for the new column K if it doesn't exist
    const headerRange = sheet.getRange(1, 11); // Column K
    if (headerRange.getValue() !== 'Unique ID') {
      headerRange.setValue('Unique ID');
      console.log('📝 Added "Unique ID" header to column K');
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row (row 0) and process each asset row
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const symbol = row[1] || '';      // Column B: Symbol
      const location = row[8] || '';    // Column I: Location
      const existingId = row[10] || ''; // Column K: Unique ID
      
      // Only generate ID if it doesn't exist
      if (!existingId || existingId.trim() === '') {
        // Generate unique ID: symbol-location-rowindex
        const cleanLocation = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const uniqueId = `${symbol.toLowerCase()}-${cleanLocation}-${i-1}`; // i-1 because we skip header
        
        console.log(`📝 Adding unique ID for row ${i + 1}: ${uniqueId}`);
        sheet.getRange(i + 1, 11).setValue(uniqueId); // Column K (11th column)
      }
    }
    
    console.log('✅ Unique row ID addition completed');
    
  } catch (error) {
    console.error('❌ Error adding unique row IDs:', error);
  }
}

/**
 * Updated main webhook handler that includes unique ID support
 */
function doPost(e) {
  console.log('📨 Received POST request');
  console.log('📦 Full request object:', e);
  
  try {
    let data = {};
    
    // Try to parse from postData first
    if (e.postData && e.postData.contents) {
      console.log('📄 POST data contents:', e.postData.contents);
      try {
        data = JSON.parse(e.postData.contents);
        console.log('✅ Successfully parsed JSON from POST data');
      } catch (parseError) {
        console.log('❌ Failed to parse JSON from POST data:', parseError);
        // Fallback to form data
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      console.log('📝 Using form parameters');
      data = e.parameter;
    }
    
    console.log('🔍 Parsed data:', data);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return createCorsResponse({success: false, error: 'Portfolio sheet not found'});
    }
    
    if (data.action === 'update') {
      console.log('🔄 Handling UPDATE request');
      return handleUpdateAsset(sheet, data);
    } else {
      console.log('➕ Handling ADD request (default)');
      return handleAddAsset(sheet, data);
    }
    
  } catch (error) {
    console.error('💥 Error in doPost:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function handleAddAsset(sheet, data) {
  console.log('➕ Adding new asset with data:', data);
  
  try {
    // Get the next row number for unique ID generation
    const lastRow = sheet.getLastRow();
    const rowIndex = lastRow; // This will be the index for the new row
    
    // Generate unique ID for the new asset
    const symbol = data.symbol || '';
    const location = data.location || '';
    const cleanLocation = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uniqueId = `${symbol.toLowerCase()}-${cleanLocation}-${rowIndex}`;
    
    // Prepare the row data for adding new asset - NOW WITH 11 COLUMNS (A-K)
    const rowData = [
      data.name || '',           // Column A: Asset Name
      data.symbol || '',         // Column B: Symbol  
      data.chain || '',          // Column C: Chain
      parseFloat(data.quantity) || 0,      // Column D: Quantity
      parseFloat(data.currentPrice) || 0,  // Column E: Current Price
      parseFloat(data.totalValue) || 0,    // Column F: Total Value
      data.imageUrl || '',       // Column G: Image URL
      data.riskLevel || '',      // Column H: Risk Level
      data.location || '',       // Column I: Location
      data.coinType || '',       // Column J: Coin Type
      uniqueId                   // Column K: Unique ID
    ];
    
    console.log('📝 Adding new asset row with unique ID:', uniqueId);
    console.log('📝 Row data:', rowData);
    sheet.appendRow(rowData);
    console.log('✅ Successfully added asset to Portfolio sheet');
    
    return createCorsResponse({
      success: true, 
      message: 'Asset added successfully',
      data: rowData,
      uniqueId: uniqueId
    });
    
  } catch (error) {
    console.error('❌ Error adding asset:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function handleUpdateAsset(sheet, data) {
  console.log('🔄 Updating asset with data:', data);
  
  try {
    const symbol = data.symbol;
    if (!symbol) {
      return createCorsResponse({success: false, error: 'Symbol is required for update'});
    }
    
    // Find the row with this symbol (Column B)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) { // Start from 1 to skip header
      if (values[i][1] === symbol) { // Column B contains the symbol
        console.log(`🎯 Found asset ${symbol} in row ${i + 1}`);
        
        // Update quantity (Column D) and recalculate total value (Column F)
        const newQuantity = parseFloat(data.quantity) || values[i][3];
        const currentPrice = parseFloat(values[i][4]) || 0; // Column E
        const newTotalValue = newQuantity * currentPrice;
        
        sheet.getRange(i + 1, 4).setValue(newQuantity);     // Column D: Quantity
        sheet.getRange(i + 1, 6).setValue(newTotalValue);   // Column F: Total Value
        
        console.log(`✅ Updated ${symbol}: quantity=${newQuantity}, totalValue=${newTotalValue}`);
        
        return createCorsResponse({
          success: true, 
          message: 'Asset updated successfully',
          data: {symbol, quantity: newQuantity, totalValue: newTotalValue}
        });
      }
    }
    
    console.log(`❌ Asset ${symbol} not found`);
    return createCorsResponse({success: false, error: `Asset ${symbol} not found`});
    
  } catch (error) {
    console.error('❌ Error updating asset:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function handleDeleteAsset(sheet, data) {
  console.log('🗑️ Deleting asset with data:', data);
  
  try {
    const symbol = data.symbol;
    if (!symbol) {
      return createCorsResponse({success: false, error: 'Symbol is required for delete'});
    }
    
    // Find the row with this symbol (Column B)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) { // Start from 1 to skip header
      if (values[i][1] === symbol) { // Column B contains the symbol
        console.log(`🎯 Found asset ${symbol} in row ${i + 1}, deleting...`);
        
        // Delete the entire row
        sheet.deleteRow(i + 1);
        
        console.log(`✅ Deleted ${symbol} from Portfolio sheet`);
        
        return createCorsResponse({
          success: true, 
          message: 'Asset deleted successfully',
          data: {symbol}
        });
      }
    }
    
    console.log(`❌ Asset ${symbol} not found`);
    return createCorsResponse({success: false, error: `Asset ${symbol} not found`});
    
  } catch (error) {
    console.error('❌ Error deleting asset:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function handleUpdateAssetFields(sheet, data) {
  console.log('🔄 Updating asset fields with data:', data);
  
  try {
    const symbol = data.symbol;
    if (!symbol) {
      return createCorsResponse({success: false, error: 'Symbol is required for update'});
    }
    
    // Find the row with this symbol (Column B)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) { // Start from 1 to skip header
      if (values[i][1] === symbol) { // Column B contains the symbol
        console.log(`🎯 Found asset ${symbol} in row ${i + 1}`);
        
        // Update multiple fields
        const newQuantity = parseFloat(data.quantity) || values[i][3];
        const currentPrice = parseFloat(values[i][4]) || 0; // Column E
        const newTotalValue = newQuantity * currentPrice;
        const newRiskLevel = data.riskLevel || values[i][7];
        const newLocation = data.location || values[i][8];
        const newCoinType = data.coinType || values[i][9];
        
        // Update all the fields
        sheet.getRange(i + 1, 4).setValue(newQuantity);     // Column D: Quantity
        sheet.getRange(i + 1, 6).setValue(newTotalValue);   // Column F: Total Value
        sheet.getRange(i + 1, 8).setValue(newRiskLevel);    // Column H: Risk Level
        sheet.getRange(i + 1, 9).setValue(newLocation);     // Column I: Location
        sheet.getRange(i + 1, 10).setValue(newCoinType);    // Column J: Coin Type
        
        console.log(`✅ Updated ${symbol} fields: quantity=${newQuantity}, risk=${newRiskLevel}, location=${newLocation}, coinType=${newCoinType}`);
        
        return createCorsResponse({
          success: true, 
          message: 'Asset fields updated successfully',
          data: {symbol, quantity: newQuantity, riskLevel: newRiskLevel, location: newLocation, coinType: newCoinType}
        });
      }
    }
    
    console.log(`❌ Asset ${symbol} not found`);
    return createCorsResponse({success: false, error: `Asset ${symbol} not found`});
    
  } catch (error) {
    console.error('❌ Error updating asset fields:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function doGet(e) {
  console.log('📨 Received GET request');
  console.log('📦 Request parameters:', e.parameter);

  try {
    // Check if this is an add asset request
    if (e.parameter && e.parameter.action === 'add') {
      console.log('➕ Handling ADD ASSET request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('Portfolio');
      if (!sheet) { 
        return createCorsResponse({success: false, error: 'Portfolio sheet not found'}); 
      }
      
      return handleAddAsset(sheet, e.parameter);
    }

    // Check if this is an updateFields request
    if (e.parameter && e.parameter.action === 'updateFields') {
      console.log('🔄 Handling UPDATE FIELDS request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('Portfolio');
      if (!sheet) { 
        return createCorsResponse({success: false, error: 'Portfolio sheet not found'}); 
      }
      return handleUpdateAssetFields(sheet, e.parameter);
    }

    // Check if this is a delete request
    if (e.parameter && e.parameter.action === 'delete') {
      console.log('🗑️ Handling DELETE request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('Portfolio');
      if (!sheet) { 
        return createCorsResponse({success: false, error: 'Portfolio sheet not found'}); 
      }
      return handleDeleteAsset(sheet, e.parameter);
    }

    // Check if this is a portfolio history request
    if (e.parameter && e.parameter.action === 'history') {
      console.log('📈 Handling PORTFOLIO HISTORY request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      let historySheet = spreadsheet.getSheetByName('Portfolio History');
      
      if (!historySheet) {
        console.log('📊 Creating Portfolio History sheet...');
        historySheet = spreadsheet.insertSheet('Portfolio History');
        // Add headers
        historySheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Total Value', 'Reason']]);
      }
      
      const timestamp = new Date();
      const totalValue = parseFloat(e.parameter.totalValue) || 0;
      const reason = e.parameter.reason || 'Manual update';
      
      const rowData = [timestamp, totalValue, reason];
      
      console.log('📈 Adding history record:', rowData);
      historySheet.appendRow(rowData);
      
      return createCorsResponse({
        success: true, 
        message: 'Portfolio history saved successfully',
        data: rowData
      });
    }

    // Check if this is an update request (legacy - quantity only)
    if (e.parameter && e.parameter.action === 'update') {
      console.log('🔄 Handling UPDATE request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('Portfolio');
      if (!sheet) { 
        return createCorsResponse({success: false, error: 'Portfolio sheet not found'}); 
      }
      return handleUpdateAsset(sheet, e.parameter);
    }

    // Default GET response
    return createCorsResponse({
      success: true, 
      message: 'Google Apps Script is running', 
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Error in doGet:', error);
    return createCorsResponse({success: false, error: error.toString()});
  }
}

function createCorsResponse(data) {
  const jsonResponse = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
    
  // Add CORS headers
  return jsonResponse;
}

function testFunction() {
  console.log('🧪 Test function executed successfully');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('📊 Spreadsheet accessible:', spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName('Portfolio');
    if (sheet) {
      console.log('✅ Portfolio sheet found');
      const dataRange = sheet.getDataRange();
      console.log('📏 Data range:', dataRange.getA1Notation());
      console.log('🔢 Number of rows:', dataRange.getNumRows());
      
      // Check if unique ID column exists
      const headerRange = sheet.getRange(1, 11);
      const header = headerRange.getValue();
      console.log('📋 Column K header:', header);
    } else {
      console.log('❌ Portfolio sheet not found');
    }
    
    return 'Test completed successfully';
  } catch (error) {
    console.error('❌ Test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}

/**
 * Function to regenerate all unique IDs (useful if you need to reset them)
 */
function regenerateAllUniqueIds() {
  console.log('🔄 Regenerating all unique IDs...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return;
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row and regenerate IDs for all rows
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const symbol = row[1] || '';      // Column B: Symbol
      const location = row[8] || '';    // Column I: Location
      
      // Generate new unique ID
      const cleanLocation = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const uniqueId = `${symbol.toLowerCase()}-${cleanLocation}-${i-1}`;
      
      console.log(`📝 Updating row ${i + 1} with new unique ID: ${uniqueId}`);
      sheet.getRange(i + 1, 11).setValue(uniqueId); // Column K
    }
    
    console.log('✅ All unique IDs regenerated successfully');
    
  } catch (error) {
    console.error('❌ Error regenerating unique IDs:', error);
  }
}
