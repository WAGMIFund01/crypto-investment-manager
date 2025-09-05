/**
 * Google Apps Script for Target Portfolio Allocation (Read-Only)
 * This script provides read-only access to target allocation data
 * Target allocation is managed manually in the TargetAllocation sheet
 */

// ===================================================================
// TARGET ALLOCATION READ-ONLY FUNCTIONS
// ===================================================================

/**
 * Get Target Allocation Data
 * Returns the current target allocation as a JSON object
 */
function getTargetAllocation() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const targetSheet = spreadsheet.getSheetByName('TargetAllocation');
    
    if (!targetSheet) {
      console.log('⚠️ TargetAllocation sheet not found');
      // Return default allocation
      return {
        'Low risk': 20,
        'Medium risk': 29,
        'High risk': 40,
        'Degen': 1,
        'Stablecoin': 10
      };
    }
    
    const dataRange = targetSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      console.log('⚠️ No target allocation data found');
      // Return default allocation
      return {
        'Low risk': 20,
        'Medium risk': 29,
        'High risk': 40,
        'Degen': 1,
        'Stablecoin': 10
      };
    }
    
    const targetAllocation = {};
    
    // Skip header row (index 0)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const riskCategory = row[0];
      const targetPercentage = parseFloat(row[1]) || 0;
      
      if (riskCategory && targetPercentage > 0) {
        targetAllocation[riskCategory] = targetPercentage;
      }
    }
    
    console.log('✅ Target allocation retrieved:', targetAllocation);
    return targetAllocation;
    
  } catch (error) {
    console.error('❌ Error getting target allocation:', error);
    
    // Return default allocation if there's an error
    return {
      'Low risk': 20,
      'Medium risk': 29,
      'High risk': 40,
      'Degen': 1,
      'Stablecoin': 10
    };
  }
}

/**
 * Web App Handler for Target Allocation API (Read-Only)
 * Handles GET requests for target allocation data
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getTargetAllocation') {
    const targetAllocation = getTargetAllocation();
    return createCorsResponse({ 
      success: true, 
      data: targetAllocation 
    });
  }
  
  return createCorsResponse({ 
    success: false, 
    error: 'Invalid action. Only getTargetAllocation is supported.' 
  });
}

/**
 * Create CORS-enabled response
 */
function createCorsResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ===================================================================
// UTILITY FUNCTIONS FOR TESTING
// ===================================================================

/**
 * Test function to verify target allocation reading
 */
function testTargetAllocation() {
  console.log('🧪 Testing target allocation read function...');
  
  const allocation = getTargetAllocation();
  console.log('Target allocation:', allocation);
  
  // Verify totals
  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  console.log('Total percentage:', total);
  
  if (Math.abs(total - 100) < 0.01) {
    console.log('✅ Target allocation totals 100%');
  } else {
    console.log(`⚠️ Target allocation totals ${total}% (should be 100%)`);
  }
  
  console.log('✅ Target allocation test completed');
}

/**
 * Validate TargetAllocation sheet structure
 */
function validateTargetAllocationSheet() {
  console.log('🔍 Validating TargetAllocation sheet structure...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheet = spreadsheet.getSheetByName('TargetAllocation');
  
  if (!targetSheet) {
    console.log('❌ TargetAllocation sheet not found');
    console.log('📋 Please create a sheet named "TargetAllocation" with:');
    console.log('   Column A: Risk Category');
    console.log('   Column B: Target Percentage');
    return false;
  }
  
  const dataRange = targetSheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length <= 1) {
    console.log('❌ No data found in TargetAllocation sheet');
    return false;
  }
  
  // Check headers
  const headers = values[0];
  if (headers[0] !== 'Risk Category' || headers[1] !== 'Target Percentage') {
    console.log('⚠️ Headers may be incorrect. Expected: "Risk Category", "Target Percentage"');
    console.log('   Found:', headers[0], ',', headers[1]);
  }
  
  // Check data
  let totalPercentage = 0;
  const categories = [];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const category = row[0];
    const percentage = parseFloat(row[1]) || 0;
    
    if (category && percentage > 0) {
      categories.push(category);
      totalPercentage += percentage;
    }
  }
  
  console.log(`✅ Found ${categories.length} risk categories:`, categories);
  console.log(`📊 Total percentage: ${totalPercentage}%`);
  
  if (Math.abs(totalPercentage - 100) > 1) {
    console.log(`⚠️ Total percentage is ${totalPercentage}%, should be close to 100%`);
  }
  
  console.log('✅ Validation completed');
  return true;
}