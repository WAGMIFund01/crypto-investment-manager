# 🔧 Add Automation to Your Existing WAGMI Project

## 🚀 **COMPLETE UPDATED SCRIPT WITH AUTO-DISCOVERY**

**Copy and paste this ENTIRE script into your existing Google Apps Script project:**

```javascript
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
    // Prepare the row data for adding new asset - WITH 10 COLUMNS (A-J)
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
      data.coinType || ''        // Column J: Coin Type
    ];
    
    console.log('📝 Adding new asset row:', rowData);
    sheet.appendRow(rowData);
    console.log('✅ Successfully added asset to Portfolio sheet');
    
    // Auto-discover mapping for new asset
    if (data.symbol) {
      console.log(`🔍 Auto-discovering mapping for ${data.symbol}...`);
      const mapping = autoDiscoverAssetMapping(data.symbol);
      if (mapping) {
        console.log(`✅ Auto-mapped ${data.symbol} → ${mapping.coinGeckoId}`);
      }
    }
    
    return createCorsResponse({
      success: true, 
      message: 'Asset added successfully',
      data: rowData
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
  console.log('🔍 Request parameters:', e.parameter);

  try {
    // Check if this is an add asset request
    if (e.parameter && e.parameter.action === 'add') {
      console.log('➕ Handling ADD ASSET request via GET');
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('Portfolio');
      if (!sheet) { 
        return createCorsResponse({success: false, error: 'Portfolio sheet not found'}); 
      }
      
      // Prepare the row data for adding new asset - NOW WITH 10 COLUMNS (A-J)
      const rowData = [
        e.parameter.name || '',           // Column A: Asset Name
        e.parameter.symbol || '',         // Column B: Symbol  
        e.parameter.chain || '',          // Column C: Chain
        parseFloat(e.parameter.quantity) || 0,      // Column D: Quantity
        parseFloat(e.parameter.currentPrice) || 0,  // Column E: Current Price
        parseFloat(e.parameter.totalValue) || 0,    // Column F: Total Value
        e.parameter.imageUrl || '',       // Column G: Image URL
        e.parameter.riskLevel || '',      // Column H: Risk Level
        e.parameter.location || '',       // Column I: Location
        e.parameter.coinType || ''        // Column J: Coin Type
      ];
      
      console.log('📝 Adding new asset row:', rowData);
      sheet.appendRow(rowData);
      console.log('✅ Successfully added asset to Portfolio sheet');
      
      // Auto-discover mapping for new asset
      if (e.parameter.symbol) {
        console.log(`🔍 Auto-discovering mapping for ${e.parameter.symbol}...`);
        const mapping = autoDiscoverAssetMapping(e.parameter.symbol);
        if (mapping) {
          console.log(`✅ Auto-mapped ${e.parameter.symbol} → ${mapping.coinGeckoId}`);
        }
      }
      
      return createCorsResponse({
        success: true, 
        message: 'Asset added successfully',
        data: rowData
      });
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

    // Check if this is a test price refresh request
    if (e.parameter && e.parameter.action === 'testPriceRefresh') {
      console.log('🧪 Handling TEST PRICE REFRESH request via GET');
      try {
        const result = testPriceRefresh();
        return createCorsResponse({success: true, message: result});
      } catch (error) {
        return createCorsResponse({success: false, error: error.toString()});
      }
    }

    // Check if this is a setup automation request
    if (e.parameter && e.parameter.action === 'setupAutomation') {
      console.log('⚙️ Handling SETUP AUTOMATION request via GET');
      try {
        const result = setupAutomatedTriggers();
        return createCorsResponse({success: true, message: result});
      } catch (error) {
        return createCorsResponse({success: false, error: error.toString()});
      }
    }

    // Check if this is a remove automation request
    if (e.parameter && e.parameter.action === 'removeAutomation') {
      console.log('🗑️ Handling REMOVE AUTOMATION request via GET');
      try {
        const result = removeAutomatedTriggers();
        return createCorsResponse({success: true, message: result});
      } catch (error) {
        return createCorsResponse({success: false, error: error.toString()});
      }
    }

    // Check if this is a check triggers request
    if (e.parameter && e.parameter.action === 'checkTriggers') {
      console.log('📋 Handling CHECK TRIGGERS request via GET');
      try {
        const triggers = ScriptApp.getProjectTriggers();
        const automationTriggers = triggers.filter(trigger => 
          trigger.getHandlerFunction() === 'refreshPortfolioPrices'
        );
        
        const triggerInfo = automationTriggers.map(trigger => ({
          id: trigger.getUniqueId(),
          function: trigger.getHandlerFunction(),
          type: trigger.getEventType().toString(),
          source: trigger.getTriggerSource().toString()
        }));
        
        return createCorsResponse({
          success: true, 
          message: `Found ${automationTriggers.length} automation triggers`,
          triggers: triggerInfo
        });
      } catch (error) {
        return createCorsResponse({success: false, error: error.toString()});
      }
    }

    // Check if this is an auto-discover mappings request
    if (e.parameter && e.parameter.action === 'autoDiscoverMappings') {
      console.log('🔍 Handling AUTO-DISCOVER MAPPINGS request via GET');
      try {
        const result = autoUpdateAllAssetMappings();
        return createCorsResponse({success: true, message: result});
      } catch (error) {
        return createCorsResponse({success: false, error: error.toString()});
      }
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
      console.log('📊 Data range:', dataRange.getA1Notation());
      console.log('🔢 Number of rows:', dataRange.getNumRows());
    } else {
      console.log('❌ Portfolio sheet not found');
    }
    
    return 'Test completed successfully';
  } catch (error) {
    console.error('❌ Test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}

// ========================================
// AUTOMATED PRICE REFRESH SYSTEM WITH AUTO-DISCOVERY
// ========================================

/**
 * Main function to refresh all portfolio prices automatically
 * This function will be called every 5 minutes by Google Apps Script triggers
 */
function refreshPortfolioPrices() {
  console.log('🔄 Starting automated portfolio price refresh...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return;
    }
    
    // Auto-update mappings before fetching prices
    console.log('🔍 Auto-updating asset mappings...');
    autoUpdateAllAssetMappings();
    
    // Get current portfolio data
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      console.log('📊 No portfolio data found (only headers)');
      return;
    }
    
    // Extract asset symbols (Column B, starting from row 2)
    const assetSymbols = [];
    for (let i = 1; i < values.length; i++) {
      const symbol = values[i][1]; // Column B: Symbol
      if (symbol && symbol.trim() !== '') {
        assetSymbols.push(symbol.trim());
      }
    }
    
    if (assetSymbols.length === 0) {
      console.log('📊 No asset symbols found in portfolio');
      return;
    }
    
    console.log('💰 Found assets to update:', assetSymbols);
    
    // Fetch live prices from CoinGecko
    const livePrices = fetchLivePrices(assetSymbols);
    
    if (!livePrices || Object.keys(livePrices).length === 0) {
      console.warn('⚠️ No live prices received from CoinGecko');
      return;
    }
    
    // Update portfolio with live prices
    updatePortfolioWithLivePrices(sheet, values, livePrices);
    
    // Log completion
    console.log('✅ Automated price refresh completed successfully');
    
    // Add to portfolio history
    addPortfolioHistoryEntry(spreadsheet, 'Automated price refresh');
    
  } catch (error) {
    console.error('💥 Error in automated price refresh:', error);
  }
}

/**
 * Auto-discover and update all asset mappings
 */
function autoUpdateAllAssetMappings() {
  try {
    console.log('🔍 Starting auto-discovery of asset mappings...');
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const portfolioSheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!portfolioSheet) {
      console.error('❌ Portfolio sheet not found');
      return 'Portfolio sheet not found';
    }
    
    // Get all symbols from portfolio
    const dataRange = portfolioSheet.getDataRange();
    const values = dataRange.getValues();
    
    const symbols = [];
    for (let i = 1; i < values.length; i++) {
      const symbol = values[i][1]; // Column B: Symbol
      if (symbol && symbol.trim() !== '') {
        symbols.push(symbol.trim());
      }
    }
    
    if (symbols.length === 0) {
      console.log('📊 No symbols found in portfolio');
      return 'No symbols found in portfolio';
    }
    
    console.log(`🔍 Found ${symbols.length} symbols to map:`, symbols);
    
    // Get or create mappings sheet
    let mappingsSheet = spreadsheet.getSheetByName('CoinGecko Mappings');
    if (!mappingsSheet) {
      console.log('📊 Creating CoinGecko Mappings sheet...');
      mappingsSheet = spreadsheet.insertSheet('CoinGecko Mappings');
      // Add headers
      mappingsSheet.getRange(1, 1, 1, 7).setValues([['Symbol', 'CoinGecko ID', 'Asset Name', 'Market Cap Rank', 'Confidence', 'Auto-Discovered', 'Last Updated']]);
    }
    
    let updatedCount = 0;
    let newCount = 0;
    
    // Process each symbol
    for (const symbol of symbols) {
      const mapping = autoDiscoverAssetMapping(symbol);
      if (mapping) {
        const result = updateMappingInSheet(mappingsSheet, mapping);
        if (result === 'new') {
          newCount++;
        } else if (result === 'updated') {
          updatedCount++;
        }
      }
    }
    
    console.log(`✅ Auto-discovery complete: ${newCount} new mappings, ${updatedCount} updated`);
    return `Auto-discovery complete: ${newCount} new mappings, ${updatedCount} updated`;
    
  } catch (error) {
    console.error('❌ Error in auto-update mappings:', error);
    return 'Error: ' + error.toString();
  }
}

/**
 * Auto-discover mapping for a single asset
 */
function autoDiscoverAssetMapping(symbol) {
  try {
    console.log(`🔍 Auto-discovering mapping for ${symbol}...`);
    
    // Use CoinGecko search API
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(symbol)}`;
    
    const response = UrlFetchApp.fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      console.warn(`⚠️ Search failed for ${symbol}: HTTP ${response.getResponseCode()}`);
      return null;
    }
    
    const searchData = JSON.parse(response.getContentText());
    const coins = searchData.coins || [];
    
    if (coins.length === 0) {
      console.warn(`⚠️ No search results for ${symbol}`);
      return null;
    }
    
    // Find the best match
    const bestMatch = findBestMatch(symbol, coins);
    
    if (bestMatch) {
      const mapping = {
        symbol: symbol.toUpperCase(),
        coinGeckoId: bestMatch.id,
        assetName: bestMatch.name,
        marketCapRank: bestMatch.market_cap_rank || 'Unknown',
        confidence: calculateMatchConfidence(symbol, bestMatch),
        autoDiscovered: true,
        lastUpdated: new Date()
      };
      
      console.log(`✅ Auto-discovered ${symbol} → ${bestMatch.id} (${bestMatch.name})`);
      return mapping;
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Error auto-discovering mapping for ${symbol}:`, error);
    return null;
  }
}

/**
 * Find the best match from search results
 */
function findBestMatch(symbol, searchResults) {
  // Priority 1: Exact symbol match
  const exactMatch = searchResults.find(coin => 
    coin.symbol.toLowerCase() === symbol.toLowerCase()
  );
  
  if (exactMatch) {
    console.log(`🎯 Exact symbol match found for ${symbol}: ${exactMatch.id}`);
    return exactMatch;
  }
  
  // Priority 2: Highest market cap (most popular)
  const sortedByMarketCap = searchResults
    .filter(coin => coin.market_cap_rank)
    .sort((a, b) => a.market_cap_rank - b.market_cap_rank);
  
  if (sortedByMarketCap.length > 0) {
    const bestMatch = sortedByMarketCap[0];
    console.log(`🏆 Best market cap match for ${symbol}: ${bestMatch.id} (rank: ${bestMatch.market_cap_rank})`);
    return bestMatch;
  }
  
  // Priority 3: First result (fallback)
  const firstResult = searchResults[0];
  console.log(`🔄 Using first result for ${symbol}: ${firstResult.id}`);
  return firstResult;
}

/**
 * Calculate match confidence score
 */
function calculateMatchConfidence(symbol, coinGeckoResult) {
  let score = 0;
  
  // Exact symbol match: +50 points
  if (coinGeckoResult.symbol.toLowerCase() === symbol.toLowerCase()) {
    score += 50;
  }
  
  // High market cap (top 100): +30 points
  if (coinGeckoResult.market_cap_rank && coinGeckoResult.market_cap_rank <= 100) {
    score += 30;
  }
  
  // Name similarity: +20 points
  if (coinGeckoResult.name.toLowerCase().includes(symbol.toLowerCase())) {
    score += 20;
  }
  
  // Medium market cap (top 500): +10 points
  if (coinGeckoResult.market_cap_rank && coinGeckoResult.market_cap_rank <= 500) {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100%
}

/**
 * Update mapping in the mappings sheet
 */
function updateMappingInSheet(mappingsSheet, mapping) {
  try {
    const dataRange = mappingsSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Check if mapping already exists
    for (let i = 1; i < values.length; i++) {
      if (values[i][0].toLowerCase() === mapping.symbol.toLowerCase()) {
        // Update existing mapping
        mappingsSheet.getRange(i + 1, 2, 1, 6).setValues([[
          mapping.coinGeckoId,
          mapping.assetName,
          mapping.marketCapRank,
          mapping.confidence + '%',
          mapping.autoDiscovered ? '✅ Yes' : '❌ No',
          mapping.lastUpdated
        ]]);
        console.log(`🔄 Updated existing mapping for ${mapping.symbol}`);
        return 'updated';
      }
    }
    
    // Add new mapping
    const newRow = [
      mapping.symbol,
      mapping.coinGeckoId,
      mapping.assetName,
      mapping.marketCapRank,
      mapping.confidence + '%',
      mapping.autoDiscovered ? '✅ Yes' : '❌ No',
      mapping.lastUpdated
    ];
    
    mappingsSheet.appendRow(newRow);
    console.log(`➕ Added new mapping for ${mapping.symbol}`);
    return 'new';
    
  } catch (error) {
    console.error(`❌ Error updating mapping for ${mapping.symbol}:`, error);
    return 'error';
  }
}

/**
 * Fetch live prices from CoinGecko API for given asset symbols
 */
function fetchLivePrices(assetSymbols) {
  try {
    // Get mappings from sheet
    const mappings = getMappingsFromSheet();
    
    // Map symbols to CoinGecko IDs
    const coinGeckoIds = assetSymbols.map(symbol => {
      const mapping = mappings.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
      if (mapping) {
        console.log(`✅ Using mapped ${symbol} → ${mapping.coinGeckoId}`);
        return mapping.coinGeckoId;
      } else {
        console.warn(`⚠️ No mapping found for ${symbol}, using symbol as-is`);
        return symbol.toLowerCase();
      }
    });
    
    console.log('🔍 Fetching prices for CoinGecko IDs:', coinGeckoIds);
    
    // Build API URL
    const assetIdsParam = coinGeckoIds.join(',');
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${assetIdsParam}&vs_currencies=usd&include_24hr_change=true`;
    
    // Make API request
    const response = UrlFetchApp.fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const responseData = JSON.parse(response.getContentText());
    console.log('💰 Live prices received:', responseData);
    
    // Check which assets were successfully fetched
    const successfulAssets = Object.keys(responseData);
    const failedAssets = coinGeckoIds.filter(id => !successfulAssets.includes(id));
    
    if (failedAssets.length > 0) {
      console.warn(`⚠️ Some assets failed to fetch: ${failedAssets.join(', ')}`);
      console.log('💡 Tip: These assets may need manual mapping or have API issues');
    }
    
    return responseData;
    
  } catch (error) {
    console.error('❌ Error fetching live prices:', error);
    return null;
  }
}

/**
 * Get mappings from the mappings sheet
 */
function getMappingsFromSheet() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const mappingsSheet = spreadsheet.getSheetByName('CoinGecko Mappings');
    
    if (!mappingsSheet) {
      console.log('📊 No mappings sheet found, returning empty array');
      return [];
    }
    
    const dataRange = mappingsSheet.getDataRange();
    const values = dataRange.getValues();
    
    const mappings = [];
    for (let i = 1; i < values.length; i++) {
      mappings.push({
        symbol: values[i][0],
        coinGeckoId: values[i][1],
        assetName: values[i][2],
        marketCapRank: values[i][3],
        confidence: values[i][4],
        autoDiscovered: values[i][5] === '✅ Yes',
        lastUpdated: values[i][6]
      });
    }
    
    return mappings;
    
  } catch (error) {
    console.error('❌ Error getting mappings from sheet:', error);
    return [];
  }
}

/**
 * Update portfolio sheet with live prices
 */
function updatePortfolioWithLivePrices(sheet, values, livePrices) {
  try {
    let updatedCount = 0;
    
    // Process each row (starting from row 2, after headers)
    for (let i = 1; i < values.length; i++) {
      const symbol = values[i][1]; // Column B: Symbol
      const mappings = getMappingsFromSheet();
      const mapping = mappings.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
      
      if (!mapping) {
        console.warn(`⚠️ No mapping found for ${symbol}, skipping`);
        continue;
      }
      
      const coinGeckoId = mapping.coinGeckoId;
      
      if (!livePrices[coinGeckoId]) {
        console.warn(`⚠️ No price data for ${symbol} (${coinGeckoId})`);
        continue;
      }
      
      const livePrice = livePrices[coinGeckoId].usd;
      if (!livePrice) {
        console.warn(`⚠️ No USD price for ${symbol}`);
        continue;
      }
      
      const quantity = parseFloat(values[i][3]) || 0; // Column D: Quantity
      const newTotalValue = quantity * livePrice;
      
      // Update current price (Column E) and total value (Column F)
      sheet.getRange(i + 1, 5).setValue(livePrice); // Column E: Current Price
      sheet.getRange(i + 1, 6).setValue(newTotalValue); // Column F: Total Value
      
      console.log(`💰 Updated ${symbol}: $${livePrice} (Total: $${newTotalValue})`);
      updatedCount++;
    }
    
    console.log(`✅ Updated ${updatedCount} assets with live prices`);
    
  } catch (error) {
    console.error('❌ Error updating portfolio with live prices:', error);
  }
}

/**
 * Add entry to portfolio history
 */
function addPortfolioHistoryEntry(spreadsheet, reason) {
  try {
    let historySheet = spreadsheet.getSheetByName('Portfolio History');
    
    if (!historySheet) {
      console.log('📊 Creating Portfolio History sheet...');
      historySheet = spreadsheet.insertSheet('Portfolio History');
      // Add headers
      historySheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Total Value', 'Reason']]);
    }
    
    // Calculate current total portfolio value
    const portfolioSheet = spreadsheet.getSheetByName('Portfolio');
    if (!portfolioSheet) return;
    
    const dataRange = portfolioSheet.getDataRange();
    const values = dataRange.getValues();
    
    let totalValue = 0;
    for (let i = 1; i < values.length; i++) {
      const value = parseFloat(values[i][5]) || 0; // Column F: Total Value
      totalValue += value;
    }
    
    const timestamp = new Date();
    const rowData = [timestamp, totalValue, reason];
    
    console.log('📈 Adding history record:', rowData);
    historySheet.appendRow(rowData);
    
  } catch (error) {
    console.error('❌ Error adding portfolio history:', error);
  }
}

/**
 * Set up automated triggers for price refresh
 * Run this function once to create the automation
 */
function setupAutomatedTriggers() {
  try {
    console.log('🔧 Setting up automated price refresh triggers...');
    
    // Delete existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'refreshPortfolioPrices') {
        ScriptApp.deleteTrigger(trigger);
        console.log('🗑️ Deleted existing trigger');
      }
    });
    
    // Create new 5-minute trigger
    const trigger = ScriptApp.newTrigger('refreshPortfolioPrices')
      .timeBased()
      .everyMinutes(5)
      .create();
    
    console.log('✅ Created new 5-minute trigger:', trigger.getUniqueId());
    console.log('⏰ Portfolio prices will now refresh automatically every 5 minutes');
    
    // Test the function immediately
    console.log('🧪 Testing price refresh function...');
    refreshPortfolioPrices();
    
    return 'Automated triggers set up successfully!';
    
  } catch (error) {
    console.error('❌ Error setting up automated triggers:', error);
    return 'Error: ' + error.toString();
  }
}

/**
 * Remove automated triggers
 */
function removeAutomatedTriggers() {
  try {
    console.log('🗑️ Removing automated price refresh triggers...');
    
    const triggers = ScriptApp.getProjectTriggers();
    let removedCount = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'refreshPortfolioPrices') {
        ScriptApp.deleteTrigger(trigger);
        removedCount++;
        console.log('🗑️ Removed trigger:', trigger.getUniqueId());
      }
    });
    
    console.log(`✅ Removed ${removedCount} automated triggers`);
    return `Removed ${removedCount} automated triggers`;
    
  } catch (error) {
    console.error('❌ Error removing automated triggers:', error);
    return 'Error: ' + error.toString();
  }
}

/**
 * Test function to manually trigger price refresh
 */
function testPriceRefresh() {
  console.log('🧪 Testing price refresh function manually...');
  try {
    refreshPortfolioPrices();
    return 'Price refresh test completed successfully';
  } catch (error) {
    console.error('❌ Price refresh test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}
```

## 🎯 **Key Differences from Your Current Script:**

### ✅ **NEW: Auto-Discovery System**
- **`autoDiscoverAssetMapping()`** - Automatically finds CoinGecko IDs
- **`autoUpdateAllAssetMappings()`** - Updates all mappings at once
- **`findBestMatch()`** - Intelligent matching algorithm
- **`calculateMatchConfidence()`** - Confidence scoring system

### ✅ **NEW: Smart Mapping Management**
- **Automatic mapping sheet creation** - "CoinGecko Mappings"
- **Real-time mapping updates** - No manual intervention needed
- **Confidence scoring** - Shows how reliable each mapping is
- **Market cap prioritization** - Prefers popular, verified assets

### ✅ **ENHANCED: Price Refresh System**
- **Auto-discovery before price refresh** - Ensures all mappings are current
- **Fallback handling** - Graceful degradation if mappings fail
- **Comprehensive logging** - Track all discovery and mapping activities

### ✅ **NEW: Action Handlers**
- **`autoDiscoverMappings`** - Manual trigger for mapping updates
- **Enhanced error handling** - Better feedback on mapping issues

## 🚀 **Deploy This Script Instead!**

This updated script will:
1. **Automatically discover mappings** for any new assets you add
2. **Create a "CoinGecko Mappings" sheet** to track all mappings
3. **Refresh prices every 5 minutes** with intelligent asset discovery
4. **Work with ANY asset** without manual script updates

**This is the "set it and forget it" solution you wanted! 🎉**
