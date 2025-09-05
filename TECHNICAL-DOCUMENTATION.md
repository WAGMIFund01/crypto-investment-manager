# Technical Documentation - WAGMI Investment Manager

## Overview

This document provides comprehensive technical documentation for the WAGMI Investment Manager application, focusing on the recently implemented timestamp and refresh systems.

## Architecture

### Frontend (index.html)
- **Single Page Application** built with vanilla HTML, CSS, and JavaScript
- **Responsive Design** with mobile-first approach
- **Modular JavaScript** with namespaced functions and systems

### Backend (Google Apps Script)
- **Serverless Backend** using Google Apps Script
- **Google Sheets Integration** for data persistence
- **CoinGecko API Integration** for live cryptocurrency prices
- **Automated Triggers** for scheduled price updates

## Recent Implementations

### 1. Smart Timestamp System

#### Overview
The Smart Timestamp System provides accurate "Last updated" information across all portfolio overview widgets by fetching real database timestamps instead of using page refresh times.

#### Key Features
- **Real Database Timestamps**: Fetches actual update times from Google Sheets
- **Toronto Timezone**: Displays times in Toronto timezone for user convenience
- **Automatic Updates**: Refreshes every minute without user intervention
- **Error Handling**: Graceful fallback to user-friendly error messages
- **Multi-tab Support**: Works consistently across Dashboard, Investors, and Portfolio tabs

#### Technical Implementation

```javascript
window.lastUpdatedSystem = {
    formatTimestamp: function(timestamp) {
        // Converts ISO timestamp to "Time | Date" format
        // Shows "Today" for same-day timestamps
    },
    
    updateTimestamp: async function() {
        // Fetches latest timestamp from Google Apps Script
        // Updates all timestamp displays across the app
    },
    
    updateAllTimestamps: function(message) {
        // Helper function for consistent error/loading states
    },
    
    init: function() {
        // Initializes system and sets up automatic updates
    }
}
```

#### Dependencies
- **Google Apps Script**: `getLastPriceUpdate` action
- **Google Sheets**: "Last Update" sheet with timestamp in cell A2
- **Frontend Elements**: `dashboardLastUpdated`, `investorsLastUpdated`, `portfolioLastUpdated`

### 2. Portfolio Refresh System

#### Overview
The Portfolio Refresh System handles manual price updates triggered by user actions, providing real-time feedback and error handling.

#### Key Features
- **Multi-button Support**: Updates all refresh buttons simultaneously
- **Loading States**: Visual feedback during refresh operations
- **Error Handling**: User-friendly error messages and recovery
- **Automatic UI Updates**: Refreshes page after successful update

#### Technical Implementation

```javascript
window.refreshPortfolioData = async function() {
    // 1. Update all refresh buttons to loading state
    // 2. Call Google Apps Script for price refresh
    // 3. Handle success/error responses
    // 4. Restore button states
    // 5. Reload page for fresh data
}
```

#### Button Integration
- **Small Refresh Buttons**: Compact buttons next to timestamp displays
- **Consistent Placement**: Available on all portfolio overview widgets
- **Responsive Design**: Adapts to different screen sizes

### 3. Google Apps Script Backend

#### Key Functions

##### `getLastPriceUpdateTime()`
- **Purpose**: Retrieves the most recent timestamp from the "Last Update" sheet
- **Returns**: ISO timestamp string or error message
- **Usage**: Called by frontend timestamp system

##### `updateLastUpdateTime()`
- **Purpose**: Updates the "Last Update" sheet with current Toronto time
- **Trigger**: Called after successful price refresh operations
- **Location**: Cell A2 in "Last Update" sheet

##### `fetchLivePrices()`
- **Purpose**: Fetches live cryptocurrency prices from CoinGecko API
- **Features**: Batch API calls, rate limit handling, error recovery
- **Integration**: Updates portfolio prices and timestamps

#### API Endpoints

| Action | Purpose | Response |
|--------|---------|----------|
| `getLastPriceUpdate` | Get latest timestamp | `{success: true, timestamp: "ISO"}` |
| `testPriceRefresh` | Manual price refresh | `{success: true, message: "..."}` |
| `setupAutomation` | Set up automated triggers | `{success: true, message: "..."}` |
| `checkTriggers` | Check automation status | `{success: true, triggers: [...]}` |

## Data Flow

### Timestamp Update Flow
1. **User Action** → Manual refresh or automatic trigger
2. **Google Apps Script** → Updates prices and timestamps
3. **"Last Update" Sheet** → Stores latest timestamp
4. **Frontend Request** → Calls `getLastPriceUpdate`
5. **UI Update** → Displays formatted timestamp

### Price Refresh Flow
1. **User Clicks Refresh** → Button shows loading state
2. **API Call** → `testPriceRefresh` action
3. **Price Update** → CoinGecko API integration
4. **Timestamp Update** → "Last Update" sheet updated
5. **UI Refresh** → Page reloads with new data

## Configuration

### Google Apps Script Settings
- **Deployment URL**: `https://script.google.com/macros/s/AKfycbyR5aSLuZhoFL0X-igNyVdifZDzbdi29EhGzcpFRLBaZe3bDgK1QVOiWCZO3hfRSFla/exec`
- **API Key**: `CG-QgGwi5RiGpRpircAtdTcYTvk` (CoinGecko)
- **Automation**: 30-minute intervals
- **Access**: Anyone with link

### Frontend Configuration
- **Script URL**: Updated to match Google Apps Script deployment
- **Update Interval**: 60 seconds for timestamp checks
- **Error Handling**: Graceful fallbacks for all operations

## Error Handling

### Frontend Error States
- **Connection Error**: "Last updated: Connection error"
- **No Data**: "Last updated: No data available"
- **Loading**: "Last updated: Loading..."

### Backend Error Handling
- **API Rate Limits**: Automatic retry with exponential backoff
- **Missing Data**: Graceful fallbacks and user notifications
- **Network Issues**: Timeout handling and error logging

## Performance Considerations

### Optimization Strategies
- **Batch API Calls**: Multiple assets in single CoinGecko request
- **Smart Mapping**: Only discover mappings for new assets
- **Efficient Updates**: Update only changed data
- **Caching**: Timestamp caching to reduce API calls

### Rate Limiting
- **CoinGecko API**: 30 calls/minute with API key
- **Automation**: 30-minute intervals to stay within limits
- **Manual Refresh**: No restrictions for user-initiated updates

## Security

### Current Implementation
- **Public Access**: Google Apps Script deployed as web app
- **API Key**: CoinGecko API key in script (consider environment variables)
- **Data Access**: Read/write access to Google Sheets

### Future Improvements
- **OAuth 2.0**: Replace web app deployment with proper authentication
- **User Authentication**: Multi-user support with access controls
- **API Key Security**: Environment variable management

## Testing

### Manual Testing
1. **Timestamp System**: Verify real database times display correctly
2. **Refresh Functionality**: Test manual refresh across all tabs
3. **Error Handling**: Test with network issues and API failures
4. **UI Consistency**: Verify buttons and timestamps work on all tabs

### Automated Testing
- **Google Apps Script**: Built-in execution logs and error reporting
- **Frontend**: Browser console logging for debugging
- **API Integration**: CoinGecko API response validation

## Maintenance

### Regular Tasks
- **Monitor API Usage**: Check CoinGecko API rate limits
- **Update Dependencies**: Keep Google Apps Script and APIs current
- **Backup Data**: Regular Google Sheets backups
- **Performance Monitoring**: Track response times and error rates

### Troubleshooting
- **Timestamp Issues**: Check "Last Update" sheet and Google Apps Script logs
- **Refresh Problems**: Verify API key and network connectivity
- **UI Issues**: Check browser console for JavaScript errors

## Future Enhancements

### Planned Improvements
1. **Dynamic Performance Metrics**: Replace hardcoded returns with real calculations
2. **Dynamic Investor Count**: Calculate from actual database records
3. **OAuth 2.0 Implementation**: Professional authentication system
4. **Advanced Analytics**: Risk analysis and performance reporting
5. **Multi-user Support**: User authentication and data isolation

### Technical Debt
- **Code Organization**: Consider modular JavaScript architecture
- **Error Handling**: Implement comprehensive error reporting system
- **Testing**: Add automated test suite
- **Documentation**: API documentation and user guides

---

*Last Updated: September 4, 2025*
*Version: 1.0.0*
