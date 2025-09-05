# WAGMI Investment Manager - Development Roadmap

## 🎯 Current Status
- ✅ **Timestamp System**: Fixed (shows real database time)
- ✅ **Automation Setup**: Running (30-minute intervals)
- 🔄 **API Key Integration**: In progress (Google Apps Script needs API key)

## 🚀 Next Major Priorities (APPROVED)

### **Phase 1: API Integration & Automation (IMMEDIATE)**
**Priority**: HIGH | **Timeline**: Next 1-2 sessions

#### 1.1 Google Apps Script API Key Integration
- **Issue**: Google Apps Script not using API key `CG-QgGwi5RiGpRpircAtdTcYTvk`
- **Impact**: Automation failing due to rate limits (HTTP 429 errors)
- **Solution**: Add `x-cg-demo-api-key` header to all CoinGecko API calls
- **Files**: Google Apps Script `Code.gs`
- **Expected Outcome**: API calls visible in CoinGecko dashboard, automation working

#### 1.2 Refresh Button Integration
- **Issue**: Manual refresh button not updating database prices
- **Impact**: Users can't manually trigger price updates
- **Solution**: Ensure `testPriceRefresh` action properly updates Google Sheets
- **Files**: Google Apps Script `Code.gs`, `index.html` refresh function
- **Expected Outcome**: Manual refresh updates database and UI

### **Phase 2: Data Consistency & Accuracy (HIGH PRIORITY)**
**Priority**: HIGH | **Timeline**: 2-3 sessions

#### 2.1 Portfolio Summary Value Consistency
- **Issue**: Different tabs show different Current Value numbers
  - Dashboard: `$31,002` (hardcoded fallback)
  - Investors: `$22,381` (from investor data)
  - Portfolio: `$22,378.883` (from portfolio data)
- **Solution**: Single source of truth - use portfolio asset data for all tabs
- **Files**: `index.html` (lines 1802-1825, 1887-1890, 2560-2562)
- **Expected Outcome**: All tabs show same Current Value

#### 2.2 Dynamic Performance Metrics
- **Issue**: Hardcoded performance values
  - Monthly Return: Always `+2.8%`
  - Total Return: Always `15.2%`
  - Investor Count: Always `6`
- **Solution**: Calculate from actual data
- **Files**: `index.html` (lines 1811, 1818, 1825, 2017, 2036, etc.)
- **Expected Outcome**: Real performance metrics based on actual data

#### 2.3 Fallback Price System
- **Issue**: Outdated hardcoded crypto prices used when API fails
- **Solution**: Update fallback prices or improve error handling
- **Files**: `index.html` (lines 4666-4676)
- **Expected Outcome**: Accurate prices even during API failures

### **Phase 3: Single Source of Truth (MEDIUM PRIORITY)**
**Priority**: MEDIUM | **Timeline**: 3-4 sessions

#### 3.1 Unified Data Flow
- **Issue**: Multiple functions updating same elements with different data
- **Solution**: Centralized data management system
- **Files**: `index.html` (multiple functions)
- **Expected Outcome**: Consistent data across all components

#### 3.2 Real-time Updates
- **Issue**: Metrics don't update when underlying data changes
- **Solution**: Event-driven updates when data changes
- **Files**: `index.html` (data update functions)
- **Expected Outcome**: All metrics update automatically when data changes

## 🔧 Technical Implementation Notes

### Google Apps Script API Key Integration
```javascript
// Required changes in Google Apps Script
const options = {
  'method': 'GET',
  'headers': {
    'x-cg-demo-api-key': 'CG-QgGwi5RiGpRpircAtdTcYTvk'
  },
  'muteHttpExceptions': true
};
```

### Data Consistency Fixes
- Replace hardcoded fallback values with dynamic calculations
- Ensure all tabs use same data source for Current Value
- Calculate returns from actual historical data
- Count investors from actual data, not hardcoded values

## 📊 Success Metrics
- [ ] API calls visible in CoinGecko dashboard
- [ ] Manual refresh button updates database
- [ ] All tabs show same Current Value
- [ ] Performance metrics reflect real data
- [ ] No hardcoded values in production

## 🎯 Next Session Focus
1. **Google Apps Script API key integration** (Phase 1.1)
2. **Test automation and manual refresh** (Phase 1.2)
3. **Begin data consistency fixes** (Phase 2.1)

---
*Last Updated: September 4, 2025*
*Status: APPROVED - Ready for implementation*
