# 🚀 WAGMI Investment Manager

A comprehensive web application for managing cryptocurrency investments and tracking portfolio performance, integrated with Google Sheets as a database.

## 📋 Current Features

### 📊 **Dashboard**
- Real-time portfolio overview with live data from Google Sheets
- Portfolio metrics: Total Investors, Total Invested, Current Value, Total P&L
- Monthly return calculations and performance indicators
- Unified portfolio overview widget across all tabs

### 👥 **Investor Management**  
- Live investor data from Google Sheets
- Individual investment tracking with calculated returns
- Automatic join date detection from transaction history
- Real-time share percentage calculations
- Investor table with sortable columns

### 💰 **Portfolio Tracking**
- Real-time crypto asset tracking with live prices via CoinGecko API
- Asset management: Add, edit, delete assets with unique row identification
- Risk level categorization (Low, Medium, High, Degen)
- Location and coin type classification
- Blockchain detection and autocomplete fields
- Portfolio sorting by asset value (descending)

### 📈 **Portfolio Analytics**
- Interactive 100% stacked bar charts for portfolio analysis
- Four visualization categories: Risk Level, Token Allocation, Token Type, Location  
- Risk-based token clustering with largest segments at bottom
- Data labels on segments >5% allocation
- Hover tooltips for detailed information
- Chart.js with datalabels plugin integration

### 🔄 **Data Integration**
- **Google Sheets Backend**: Full integration with Google Apps Script webhook
- **Live Price Updates**: Real-time crypto prices from CoinGecko API
- **Asset Search**: Broad asset search across all blockchains
- **Autocomplete**: Smart autocomplete for Risk Level, Location, Coin Type, Blockchain
- **Unique Row IDs**: Stable identifiers for reliable edit/delete operations

## 🚀 Getting Started

### **Prerequisites**
1. **Google Sheets Setup**: Create a Google Sheet with the portfolio structure
2. **Google Apps Script**: Deploy the provided Apps Script as a web app
3. **API Keys**: Get CoinGecko API access (free tier available)

### **Quick Start**
1. **Clone/Download** this repository
2. **Configure** the Google Apps Script webhook URL in `index.html`
3. **Run Local Server**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```
4. **Open** `http://localhost:8000` in your browser
5. **Login** as Manager or Investor

### **Google Sheets Setup**
See `google-sheets-setup.md` for detailed instructions on:
- Creating the Google Sheet structure
- Setting up Google Apps Script
- Configuring API permissions
- Deploying the web app

## 📊 Data Structure

### **Portfolio Sheet Columns**
- **A**: Asset Name
- **B**: Symbol  
- **C**: Blockchain/Chain
- **D**: Quantity Owned
- **E**: Current Price (auto-updated)
- **F**: Total Value (calculated)
- **G**: Image URL (auto-populated)
- **H**: Risk Level
- **I**: Location
- **J**: Coin Type
- **K**: Unique ID (system-generated)

### **Investor Sheet Columns**
- **A**: Investor ID
- **B**: Name
- **C**: Date Joined (calculated)
- **D**: Initial Investment
- **E**: Current Value
- **F**: Share Percentage (calculated)
- **G**: Total Return (calculated)
- **H**: Status

## 🎨 Design Features

### **Modern UI/UX**
- **Dark Mode**: Professional crypto-native design
- **Responsive**: Works on desktop, tablet, mobile
- **Interactive Charts**: Powered by Chart.js with custom styling
- **Consistent Spacing**: Standardized layout across tabs
- **Icon System**: Unified iconography throughout app

### **User Experience**
- **Tab Navigation**: Dashboard, Investors, Portfolio, Performance
- **Modal Forms**: Clean asset addition/editing interface
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Graceful fallbacks and user feedback
- **Loading States**: Progress indicators for data operations

## 🔧 Technical Architecture

### **Frontend Stack**
- **HTML5/CSS3**: Modern semantic structure
- **Vanilla JavaScript**: ES6+ features, no frameworks
- **Chart.js**: Interactive data visualizations  
- **chartjs-plugin-datalabels**: Chart segment labeling
- **Lucide Icons**: Consistent icon system

### **Backend Integration**
- **Google Apps Script**: Server-side logic and data processing
- **Google Sheets API**: Data storage and retrieval
- **CoinGecko API**: Live cryptocurrency prices
- **CORS Handling**: Cross-origin request support

### **Data Flow**
1. **Frontend** → Google Apps Script webhook → **Google Sheets**
2. **Google Sheets** → Google Apps Script → **Frontend**  
3. **CoinGecko API** → **Frontend** (price updates)
4. **Frontend** → Local calculations → **UI Updates**

## 🔒 Security & Privacy

### **Data Security**
- **Google OAuth 2.0**: Secure authentication (future enhancement)
- **HTTPS Required**: Secure data transmission
- **No Local Storage**: All data in Google Sheets
- **API Rate Limiting**: Respectful API usage

### **Access Control**
- **Manager View**: Full portfolio management access
- **Investor View**: Personal investment data only
- **Login Screen**: Role-based access control

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **JavaScript Required**: ES6+ features used throughout
- **Local Storage**: Used for temporary UI state only

## 🛠 Development & Customization

### **Key Files**
- `index.html`: Main application (HTML, CSS, JavaScript)
- `google-sheets-setup.md`: Backend setup instructions
- `update-with-unique-ids.gs`: Google Apps Script for data management
- `README.md`: This documentation

### **Customization Points**
- **Color Scheme**: CSS custom properties in `:root`
- **Chart Configuration**: Chart.js options in `generateStackedBarChart`
- **Risk Categories**: Modify risk level options and colors
- **Asset Categories**: Customize location and coin type options

### **Adding Features**
1. **New Tabs**: Add tab content and navigation logic
2. **Additional Charts**: Extend chart generation functions
3. **More Data Fields**: Update Google Sheets structure and forms
4. **Enhanced Analytics**: Add new calculation functions

## 🔄 Maintenance

### **Regular Tasks**
- **Data Backup**: Export Google Sheets regularly
- **API Monitoring**: Check CoinGecko API status
- **Performance Review**: Monitor loading times and responsiveness
- **Security Updates**: Keep dependencies current

### **Troubleshooting**
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API requests and responses
- **Google Apps Script Logs**: Check execution logs in Apps Script editor
- **Sheet Permissions**: Verify sharing and access settings

## 🚀 Future Enhancements

### **Planned Features** [[memory:7875903]]
1. **OAuth 2.0 Implementation**: Replace webhook with proper authentication
2. **Purchase Price Tracking**: Add cost basis columns for P&L accuracy  
3. **Multi-user Support**: Individual user authentication and data separation
4. **Advanced Analytics**: More sophisticated performance metrics and risk analysis
5. **PDF Reports**: Exportable portfolio reports
6. **Email Notifications**: Portfolio performance alerts
7. **Mobile App**: React Native or PWA version

### **Technical Improvements**
- **Code Splitting**: Modular JavaScript architecture
- **TypeScript**: Type safety and better development experience  
- **Testing Suite**: Unit and integration tests
- **CI/CD Pipeline**: Automated deployment and testing
- **Performance Optimization**: Lazy loading and caching strategies

## 📞 Support & Contributing

This application is actively maintained and enhanced based on user feedback and requirements.

### **Getting Help**
- Check browser console for error messages
- Verify Google Sheets permissions and structure
- Review Google Apps Script execution logs
- Test API endpoints manually

### **Reporting Issues**
Please provide:
- Browser and version
- Steps to reproduce
- Console error messages  
- Screenshot if applicable

---

**Built for serious crypto investment management. 🚀💎**

*Last Updated: January 2024*