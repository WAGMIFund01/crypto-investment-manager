# 🚀 WAGMI Automated Price Refresh - Deployment Guide

## 📋 Prerequisites
- ✅ Google Account
- ✅ Access to your WAGMI Portfolio Google Sheet
- ✅ The `updated-apps-script.gs` file ready

## 🔧 Step 1: Deploy to Google Apps Script

### 1.1 Open Google Apps Script
- Go to [script.google.com](https://script.google.com/)
- Sign in with your Google account
- Click **"New Project"**

### 1.2 Replace Default Code
- Delete the default `Code.gs` content
- Copy the **ENTIRE** content from `updated-apps-script.gs`
- Paste it into the Apps Script editor
- **Save** the project (Ctrl+S or Cmd+S)

### 1.3 Name Your Project
- Click on **"Untitled project"** at the top
- Rename it to: **"WAGMI Portfolio Automation"**
- Click **"Rename"**

### 1.4 Deploy as Web App
- Click **"Deploy"** → **"New deployment"**
- Choose **"Web app"** as type
- Set **Execute as**: **"Me"**
- Set **Who has access**: **"Anyone"**
- Click **"Deploy"**
- **Copy the Web App URL** (you'll need this!)

## 🧪 Step 2: Test the System

### 2.1 Update Test Page
- Open `test-automation.html`
- Find this line: `const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
- Replace with your actual Web App URL from Step 1.4

### 2.2 Test Basic Functions
- Click **"Test Price Refresh"** - should show success
- Click **"Check Triggers"** - should show no triggers yet

### 2.3 Setup Automation
- Click **"Setup Automation"** - this creates 5-minute triggers
- Wait for success message
- Click **"Check Triggers"** again - should show 1 active trigger

## 📊 Step 3: Verify Automation

### 3.1 Check Google Sheets
- Open your WAGMI Portfolio Google Sheet
- Look for a new sheet called **"Portfolio History"**
- Check that prices are updating in the Portfolio sheet

### 3.2 Monitor Execution Logs
- Go back to Google Apps Script
- Click **"Executions"** in the left sidebar
- You should see `refreshPortfolioPrices` running every 5 minutes
- Check for any error messages

### 3.3 Test Manual Refresh
- In Google Apps Script, go to **"Editor"**
- Select the `testPriceRefresh` function
- Click the **"Run"** button (▶️)
- Check your Google Sheets for updates

## 🔍 Step 4: Troubleshooting

### Common Issues & Solutions

#### ❌ "Portfolio sheet not found"
- **Solution**: Make sure your Google Sheet has a sheet named exactly **"Portfolio"**
- **Check**: Sheet names are case-sensitive

#### ❌ "No live prices received from CoinGecko"
- **Solution**: Check your internet connection
- **Check**: CoinGecko API might be temporarily down
- **Check**: Your asset symbols match the mapping in the code

#### ❌ "Error setting up automated triggers"
- **Solution**: Make sure you're signed in with the correct Google account
- **Solution**: Try refreshing the page and running again

#### ❌ Function not found errors
- **Solution**: Make sure you copied the ENTIRE script content
- **Solution**: Check that all functions are present in the editor

## 📱 Step 5: Integration with Main App

### 5.1 Update Main App (Optional)
- Your main `index.html` app will continue to work
- The automation runs independently in the background
- Both systems can coexist without conflicts

### 5.2 Monitor Performance
- Check execution logs every few hours initially
- Verify that prices are updating correctly
- Monitor CoinGecko API usage (stays within free limits)

## 🎯 Success Indicators

✅ **Automation Active**: 1 trigger shows in "Check Triggers"
✅ **Prices Updating**: Portfolio sheet shows fresh prices every 5 minutes
✅ **History Tracking**: "Portfolio History" sheet is created and populated
✅ **No Errors**: Execution logs show successful runs
✅ **Real-time Data**: Your portfolio always reflects current market prices

## 🚨 Important Notes

- **Backup First**: Always backup your Google Sheet before major changes
- **API Limits**: CoinGecko free tier allows 50 calls/minute (we use ~1 call/5 minutes)
- **Triggers**: Automation runs every 5 minutes, even when you're offline
- **Cost**: This system is completely free to run
- **Security**: Only you can access your Google Sheets data

## 📞 Need Help?

If you encounter issues:
1. Check the execution logs in Google Apps Script
2. Verify your Google Sheet structure matches the expected format
3. Ensure all functions are properly copied
4. Check that your Google account has necessary permissions

---

**🎉 Congratulations! You now have a professional-grade, 24/7 automated portfolio management system!**
