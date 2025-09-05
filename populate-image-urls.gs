/**
 * Google Apps Script to populate missing image URLs in the Portfolio sheet
 * Run this once to update existing assets with proper image URLs
 */

function populateImageUrls() {
  console.log('🖼️ Starting image URL population...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return;
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row (row 0)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const assetName = row[0]; // Column A
      const symbol = row[1];    // Column B
      const imageUrl = row[6];  // Column G
      
      // Only update if image URL is empty
      if (!imageUrl || imageUrl.trim() === '') {
        const newImageUrl = getImageUrlForAsset(symbol, assetName);
        if (newImageUrl) {
          console.log(`📝 Updating ${symbol} with image URL: ${newImageUrl}`);
          sheet.getRange(i + 1, 7).setValue(newImageUrl); // Column G (7th column)
        }
      }
    }
    
    console.log('✅ Image URL population completed');
    
  } catch (error) {
    console.error('❌ Error populating image URLs:', error);
  }
}

function getImageUrlForAsset(symbol, assetName) {
  const symbolLower = symbol.toLowerCase();
  const nameLower = assetName.toLowerCase();
  
  // Define image URLs for known assets
  const imageUrls = {
    'aura': 'https://assets.coingecko.com/coins/images/25942/small/aura-logo-square.png',
    'eth': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'jitosol': 'https://assets.coingecko.com/coins/images/32455/small/jito.png',
    'jito': 'https://assets.coingecko.com/coins/images/32455/small/jito.png',
    'jup': 'https://assets.coingecko.com/coins/images/33544/small/jupiter.png',
    'jupiter': 'https://assets.coingecko.com/coins/images/33544/small/jupiter.png',
    'mystery': 'https://assets.coingecko.com/coins/images/31967/small/mystery.png',
    'hype': 'https://assets.coingecko.com/coins/images/36056/small/hyperliquid.png',
    'hyperliquid': 'https://assets.coingecko.com/coins/images/36056/small/hyperliquid.png',
    'sol': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'solana': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'btc': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'bitcoin': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'buddy': 'https://via.placeholder.com/64/00ff64/ffffff?text=BUDDY'
  };
  
  // Check symbol first, then asset name
  if (imageUrls[symbolLower]) {
    return imageUrls[symbolLower];
  }
  
  if (imageUrls[nameLower]) {
    return imageUrls[nameLower];
  }
  
  // Check if asset name contains any known keywords
  for (const [key, url] of Object.entries(imageUrls)) {
    if (nameLower.includes(key) || symbolLower.includes(key)) {
      return url;
    }
  }
  
  return null; // No image URL found
}

/**
 * Test function to see what assets need image URLs
 */
function checkMissingImageUrls() {
  console.log('🔍 Checking for missing image URLs...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Portfolio');
    
    if (!sheet) {
      console.error('❌ Portfolio sheet not found');
      return;
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    console.log('📊 Assets missing image URLs:');
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const assetName = row[0];
      const symbol = row[1];
      const imageUrl = row[6];
      
      if (!imageUrl || imageUrl.trim() === '') {
        console.log(`- ${symbol} (${assetName})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking image URLs:', error);
  }
}
