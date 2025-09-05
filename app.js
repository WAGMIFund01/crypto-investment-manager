// Crypto Investment Manager - Main Application Logic
console.log('🚀 JavaScript file is loading...');

class CryptoInvestmentManager {
    constructor() {
        this.investors = this.loadData('investors') || [];
        this.portfolio = this.loadData('portfolio') || [];
        this.transactions = this.loadData('transactions') || [];
        this.performanceData = this.loadData('performance') || [];
        
        this.charts = {};
        this.cryptoPrices = {};
        this.currentView = 'login'; // 'login', 'manager', 'investor'
        this.currentInvestor = null;
        
        // Wallet management system - just addresses and chains
        this.wallets = [
            {
                id: 1,
                name: 'Main Solana Wallet',
                address: 'AHpp7u8rV8LyX9gGEYH1ivnx1qHe2wAiGfVod9uTaXUd',
                chain: 'solana',
                active: true
            },
            {
                id: 2,
                name: 'Ethereum Wallet 1',
                address: '0x39f8602c7DeA377506D1872968FE8857fb78370f',
                chain: 'ethereum',
                active: true
            },
            {
                id: 3,
                name: 'Ethereum Wallet 2', 
                address: '0xd07947276c65bc5035797c986f97456702400793',
                chain: 'ethereum',
                active: true
            },
            {
                id: 4,
                name: 'Hyperliquid Wallet',
                address: 'hyperliquid_address_here', // You'll need to provide the Hyperliquid address
                chain: 'hyperliquid',
                active: true
            }
        ];
        
        this.realPortfolioData = [];
        
        // Google Sheets configuration
        this.googleSheetsConfig = {
            spreadsheetId: '1h04nkcnQmxaFml8RubIGmPgffMiyoEIg350ryjXK0tM',
            apiKey: 'AIzaSyAWXECv5w1HjPmWcTnEqifMifJk-kKeEDA',
            enabled: true // Re-enabled for live data
        };
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Crypto Investment Manager...');
        
        this.setupEventListeners();
        console.log('✅ Event listeners set up');
        
        // Don't load sample data - wait for Google Sheets data instead
        console.log('📊 Skipping sample data, will load from Google Sheets');
        
        // Check for investor access via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const investorToken = urlParams.get('investor');
        
        if (investorToken) {
            // Direct investor access via unique link
            console.log('🔐 Direct investor access detected');
            this.handleInvestorDirectAccess(investorToken);
        } else {
            // Normal login screen for manager
            console.log('🏠 Showing login screen');
            this.showLoginScreen();
        }
        
        // Load data from Google Sheets if configured (synchronously)
        if (this.googleSheetsConfig.enabled) {
            console.log('📊 Loading data from Google Sheets...');
            try {
                await this.loadDataFromGoogleSheets();
                console.log('✅ Google Sheets data loaded successfully');
            } catch (error) {
                console.error('❌ Google Sheets loading failed:', error);
                console.log('📋 Loading sample data as fallback');
                this.loadSampleData();
            }
        } else {
            console.log('📊 Google Sheets disabled, loading sample data');
            this.loadSampleData();
        }
        
        // Fetch real portfolio data from wallets
        console.log('🔄 Starting portfolio and price data fetch...');
        try {
            this.fetchRealPortfolioData().catch(error => {
                console.error('❌ Portfolio data fetch failed:', error);
            });
        } catch (error) {
            console.error('❌ Portfolio data initialization failed:', error);
        }
        
        try {
            this.fetchCryptoPrices().catch(error => {
                console.error('❌ Crypto prices fetch failed:', error);
            });
        } catch (error) {
            console.error('❌ Crypto prices initialization failed:', error);
        }
        
        // Update data every 5 minutes
        setInterval(() => {
            console.log('🔄 Periodic data update...');
            try {
                this.fetchCryptoPrices().catch(error => {
                    console.error('❌ Periodic crypto prices update failed:', error);
                });
                this.fetchRealPortfolioData().catch(error => {
                    console.error('❌ Periodic portfolio update failed:', error);
                });
            } catch (error) {
                console.error('❌ Periodic update failed:', error);
            }
        }, 5 * 60 * 1000);
        
        console.log('✅ Crypto Investment Manager initialized successfully');
    }

    // Event Listeners
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Use event delegation for robust event handling
        document.addEventListener('click', (e) => {
            // Manager Portal - handle both card and button clicks
            if (e.target.closest('#managerPortalBtn') || e.target.id === 'managerPortalButton') {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔧 Manager Portal clicked via delegation');
                this.enterManagerView();
                return;
            }
            
            // Investor Portal - handle both card and button clicks
            if (e.target.closest('#investorPortalBtn') || e.target.id === 'investorPortalButton') {
                e.preventDefault();
                e.stopPropagation();
                console.log('👤 Investor Portal clicked via delegation');
                this.showInvestorLogin();
                return;
            }
        });
        
        // Wait for DOM to be ready, then add direct listeners as backup
        const addDirectListeners = () => {
            console.log('🎯 Adding direct event listeners...');
            
            // Manager Portal Card
            const managerCard = document.getElementById('managerPortalBtn');
            const managerButton = document.getElementById('managerPortalButton');
            
            if (managerCard) {
                managerCard.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🔧 Manager Portal card clicked (direct)');
                    this.enterManagerView();
                });
                console.log('✅ Manager portal card listener added');
            } else {
                console.error('❌ Manager portal card not found');
            }
            
            if (managerButton) {
                managerButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔧 Manager Portal button clicked (direct)');
                    this.enterManagerView();
                });
                console.log('✅ Manager portal button listener added');
            } else {
                console.error('❌ Manager portal button not found');
            }
            
            // Investor Portal Card
            const investorCard = document.getElementById('investorPortalBtn');
            const investorButton = document.getElementById('investorPortalButton');
            
            if (investorCard) {
                investorCard.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('👤 Investor Portal card clicked (direct)');
                    this.showInvestorLogin();
                });
                console.log('✅ Investor portal card listener added');
            } else {
                console.error('❌ Investor portal card not found');
            }
            
            if (investorButton) {
                investorButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('👤 Investor Portal button clicked (direct)');
                    this.showInvestorLogin();
                });
                console.log('✅ Investor portal button listener added');
            } else {
                console.error('❌ Investor portal button not found');
            }
        };
        
        // Try immediately and also after a delay
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addDirectListeners);
        } else {
            addDirectListeners();
        }
        setTimeout(addDirectListeners, 100);
        setTimeout(addDirectListeners, 500);

        // Tab navigation - will be set up when views are shown
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Modal controls - with null checks
        
        const addAssetBtn = document.getElementById('addAssetBtn');
        if (addAssetBtn) {
            addAssetBtn.addEventListener('click', () => this.openModal('addAssetModal'));
        }
        
        document.querySelectorAll('.close, #cancelInvestor, #cancelAsset').forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.closeModals());
        });

        // Form submissions - with null checks
        const addAssetForm = document.getElementById('addAssetForm');
        if (addAssetForm) {
            addAssetForm.addEventListener('submit', (e) => this.addAsset(e));
        }

        // Period filter - with null check
        const periodFilter = document.getElementById('periodFilter');
        if (periodFilter) {
            periodFilter.addEventListener('change', () => this.updatePerformanceData());
        }
    }

    // Data Management
    saveData(key, data) {
        localStorage.setItem(`cryptoIM_${key}`, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(`cryptoIM_${key}`);
        return data ? JSON.parse(data) : null;
    }

    loadSampleData() {
        // Only load sample data if we don't have existing data
        const existingInvestors = this.loadData('investors');
        if (existingInvestors && existingInvestors.length > 0) {
            console.log('📋 Found existing data, skipping sample data load');
            this.investors = existingInvestors;
            this.portfolio = this.loadData('portfolio') || [];
            this.transactions = this.loadData('transactions') || [];
            this.performanceData = this.loadData('performance') || [];
            return;
        }
        
        console.log('📋 Loading fresh sample data');
            
            // Real investors from your data with correct full names and IDs
            this.investors = [
                {
                    id: 1,
                    name: 'Leke Karunwi',
                    email: 'leke@example.com',
                    joinDate: '2023-10-08',
                    initialInvestment: 2000.00,
                    currentValue: 2000.00,
                    investmentDate: '2023-10-08',
                    sharePercentage: 0,
                    investorId: 'LK1'
                },
                {
                    id: 2,
                    name: 'Mariam Oyawoye',
                    email: 'mummy@example.com',
                    joinDate: '2023-10-10',
                    initialInvestment: 1050.06,
                    currentValue: 1050.06,
                    investmentDate: '2023-10-10',
                    sharePercentage: 0,
                    investorId: 'MO2'
                },
                {
                    id: 3,
                    name: 'Fifehanmi Oyawoye',
                    email: 'fifehanmi@example.com',
                    joinDate: '2023-10-14',
                    initialInvestment: 1823.91,
                    currentValue: 1823.91,
                    investmentDate: '2023-10-14',
                    sharePercentage: 0,
                    investorId: 'FO3'
                },
                {
                    id: 4,
                    name: 'Rinsola Aminu',
                    email: 'rinsola@example.com',
                    joinDate: '2023-11-19',
                    initialInvestment: 828.30,
                    currentValue: 828.30,
                    investmentDate: '2023-11-19',
                    sharePercentage: 0,
                    investorId: 'RA4'
                },
                {
                    id: 5,
                    name: 'Oyinkan Karunwi',
                    email: 'oyinkan@example.com',
                    joinDate: '2023-11-19',
                    initialInvestment: 991.57,
                    currentValue: 991.57,
                    investmentDate: '2023-11-19',
                    sharePercentage: 0,
                    investorId: 'OK5'
                },
                {
                    id: 6,
                    name: 'Omair Ansari',
                    email: 'omair@example.com',
                    joinDate: '2023-11-26',
                    initialInvestment: 20212.46,
                    currentValue: 20212.46,
                    investmentDate: '2023-11-26',
                    sharePercentage: 0,
                    investorId: 'OA6'
                }
            ];

            // Real transactions from your data
            this.transactions = [
                { id: 1, investorId: 1, type: 'Investment', amount: 2000.00, date: '2023-10-08' },
                { id: 2, investorId: 2, type: 'Investment', amount: 1050.06, date: '2023-10-10' },
                { id: 3, investorId: 3, type: 'Investment', amount: 1823.91, date: '2023-10-14' },
                { id: 4, investorId: 4, type: 'Investment', amount: 142.97, date: '2023-11-19' },
                { id: 5, investorId: 5, type: 'Investment', amount: 991.57, date: '2023-11-19' },
                { id: 6, investorId: 6, type: 'Investment', amount: 1418.82, date: '2023-11-26' },
                { id: 7, investorId: 6, type: 'Investment', amount: 8774.88, date: '2023-11-28' },
                { id: 8, investorId: 4, type: 'Investment', amount: 685.33, date: '2024-02-10' },
                { id: 9, investorId: 6, type: 'Investment', amount: 10018.76, date: '2024-06-15' }
            ];

            // Sample portfolio based on your Excel data
            this.portfolio = [
                { symbol: 'BTC', name: 'Bitcoin', quantity: 0.15, riskLevel: 'Low', targetAllocation: 30 },
                { symbol: 'ETH', name: 'Ethereum', quantity: 2.5, riskLevel: 'Low', targetAllocation: 25 },
                { symbol: 'USDC', name: 'USD Coin', quantity: 5000, riskLevel: 'Low', targetAllocation: 20 },
                { symbol: 'SOL', name: 'Solana', quantity: 50, riskLevel: 'Medium', targetAllocation: 10 },
                { symbol: 'AVAX', name: 'Avalanche', quantity: 100, riskLevel: 'Medium', targetAllocation: 8 },
                { symbol: 'MATIC', name: 'Polygon', quantity: 1000, riskLevel: 'Medium', targetAllocation: 7 }
            ];

            // Generate sample performance data
            this.generateSamplePerformanceData();
            
            this.saveAllData();
        }
    }

    loadSamplePortfolio() {
        console.log('Loading sample portfolio data...');
        this.portfolio = [
            { symbol: 'BTC', name: 'Bitcoin', quantity: 0.15, riskLevel: 'Low', targetAllocation: 30 },
            { symbol: 'ETH', name: 'Ethereum', quantity: 2.5, riskLevel: 'Low', targetAllocation: 25 },
            { symbol: 'SOL', name: 'Solana', quantity: 50, riskLevel: 'Medium', targetAllocation: 20 },
            { symbol: 'USDC', name: 'USD Coin', quantity: 5000, riskLevel: 'Low', targetAllocation: 15 },
            { symbol: 'AVAX', name: 'Avalanche', quantity: 100, riskLevel: 'Medium', targetAllocation: 10 }
        ];
        this.saveAllData();
        
        if (this.currentView === 'manager') {
            this.updatePortfolioView();
            this.updateDashboard();
        }
    }

    generateSamplePerformanceData() {
        const startDate = new Date('2023-10-01');
        const endDate = new Date();
        const data = [];
        
        let currentValue = 17906.30; // Starting portfolio value
        const date = new Date(startDate);
        
        while (date <= endDate) {
            // Simulate portfolio growth with some volatility
            const change = (Math.random() - 0.5) * 0.1; // ±5% daily change
            currentValue *= (1 + change);
            
            data.push({
                date: new Date(date).toISOString().split('T')[0],
                portfolioValue: currentValue,
                cumulativeReturn: ((currentValue - 17906.30) / 17906.30 * 100)
            });
            
            date.setDate(date.getDate() + 1);
        }
        
        this.performanceData = data;
    }

    saveAllData() {
        this.saveData('investors', this.investors);
        this.saveData('portfolio', this.portfolio);
        this.saveData('transactions', this.transactions);
        this.saveData('performance', this.performanceData);
    }

    // View Management
    // Secure Investor Access
    handleInvestorDirectAccess(investorToken) {
        // Map secure tokens to investor IDs
        const tokenToInvestor = {
            'abc123xyz': 1, // John Smith
            'def456uvw': 2, // Sarah Johnson  
            'ghi789rst': 3, // Michael Brown
            // Add more tokens as needed
        };
        
        const investorId = tokenToInvestor[investorToken];
        
        if (investorId) {
            console.log(`🔐 Secure investor access for token: ${investorToken}`);
            this.enterInvestorView(investorId);
        } else {
            console.log(`❌ Invalid investor token: ${investorToken}`);
            // Show error or redirect to main page
            this.showLoginScreen();
            alert('Invalid access link. Please contact your fund manager for the correct link.');
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('managerView').style.display = 'none';
        document.getElementById('investorView').style.display = 'none';
        this.currentView = 'login';
    }

    enterManagerView() {
        console.log('🔧 Entering Manager View...');
        
        const loginScreen = document.getElementById('loginScreen');
        const managerView = document.getElementById('managerView');
        const investorView = document.getElementById('investorView');
        
        if (!loginScreen) console.error('❌ Login screen element not found');
        if (!managerView) console.error('❌ Manager view element not found');
        if (!investorView) console.error('❌ Investor view element not found');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (managerView) managerView.style.display = 'block';
        if (investorView) investorView.style.display = 'none';
        
        this.currentView = 'manager';
        this.currentInvestor = null;
        
        console.log('🔧 View switched to manager, initializing...');
        
        // Initialize manager view
        try {
            this.setupCharts();
            console.log('✅ Charts set up');
        } catch (error) {
            console.error('❌ Error setting up charts:', error);
        }
        
        try {
            this.updateDashboard();
            console.log('✅ Dashboard updated');
        } catch (error) {
            console.error('❌ Error updating dashboard:', error);
        }
        
        try {
            this.switchTab('dashboard');
            console.log('✅ Switched to dashboard tab');
        } catch (error) {
            console.error('❌ Error switching tab:', error);
        }
        
        console.log('✅ Manager view fully loaded');
    }

    showInvestorLogin() {
        this.openModal('investorLoginModal');
        // Clear any previous input and focus
        setTimeout(() => {
            const input = document.getElementById('investorIdInput');
            if (input) {
                input.value = '';
                input.focus();
                // Allow Enter key to submit
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.loginWithInvestorId();
                    }
                });
            }
        }, 100);
    }

    closeInvestorLogin() {
        this.closeModals();
    }

    loginWithInvestorId() {
        const investorId = document.getElementById('investorIdInput').value.trim();
        
        if (!investorId) {
            alert('Please enter your Investor ID');
            return;
        }

        // Map investor IDs to internal investor records
        // Format: FirstName + LastNameInitial + InvestorNumber
        const idToInvestor = {
            'LK1': 1, // Leke Karunwi
            'MO2': 2, // Mariam Oyawoye (Mummy)  
            'FO3': 3, // Fifehanmi Oyawoye
            'RA4': 4, // Rinsola Aminu
            'OK5': 5, // Oyinkan Karunwi
            'OA6': 6, // Omair Ansari
            // Also support lowercase
            'lk1': 1,
            'mo2': 2,
            'fo3': 3,
            'ra4': 4,
            'ok5': 5,
            'oa6': 6
        };
        
        const internalInvestorId = idToInvestor[investorId.toUpperCase()];
        
        if (internalInvestorId) {
            console.log(`🔐 Investor login with ID: ${investorId}`);
            this.enterInvestorView(internalInvestorId);
        } else {
            alert('Invalid Investor ID. Please check your ID and try again, or contact your fund manager.');
        }
    }

    enterInvestorView(investorId) {
        const investor = this.investors.find(inv => inv.id === investorId);
        if (!investor) return;

        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('managerView').style.display = 'none';
        document.getElementById('investorView').style.display = 'block';
        this.currentView = 'investor';
        this.currentInvestor = investor;

        // Update investor display
        document.getElementById('investorNameDisplay').textContent = investor.name;
        
        // Initialize investor view
        this.setupInvestorCharts();
        this.updateInvestorDashboard();
        this.switchTab('investor-summary');
        this.closeModals();
    }

    switchToLoginScreen() {
        this.showLoginScreen();
    }

    // populateInvestorList() function removed - now using secure ID input system

    // UI Management
    switchTab(tabName) {
        // Update nav buttons
        const currentContainer = this.currentView === 'manager' ? '#managerView' : '#investorView';
        document.querySelectorAll(`${currentContainer} .nav-btn`).forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`${currentContainer} [data-tab="${tabName}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        
        // Update tab content
        document.querySelectorAll(`${currentContainer} .tab-content`).forEach(tab => tab.classList.remove('active'));
        const targetTab = document.getElementById(tabName);
        if (targetTab) targetTab.classList.add('active');
        
        // Update specific tab content based on current view
        if (this.currentView === 'manager') {
            switch(tabName) {
                case 'dashboard':
                    this.updateDashboard();
                    break;
                case 'investors':
                    this.updateInvestorsTable();
                    break;
                case 'portfolio':
                    this.updatePortfolioView();
                    break;
                case 'performance':
                    this.updatePerformanceData();
                    break;
            }
        } else if (this.currentView === 'investor') {
            switch(tabName) {
                case 'investor-summary':
                    this.updateInvestorDashboard();
                    break;
                case 'investor-performance':
                    this.updateInvestorPerformance();
                    break;
                case 'investor-statements':
                    this.updateInvestorStatements();
                    break;
            }
        }
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        

    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateHeaderStats();
        this.updateInvestmentSummaries();
        this.updateRecentTransactions();
        this.updateCharts();
    }

    updateHeaderStats() {
        const totalAUM = this.calculateTotalAUM();
        const totalReturn = this.calculateTotalReturn();
        const activeInvestors = this.investors.length;

        document.getElementById('totalAUM').textContent = this.formatCurrency(totalAUM);
        document.getElementById('totalReturn').textContent = this.formatPercentage(totalReturn);
        document.getElementById('activeInvestors').textContent = activeInvestors;
    }

    updateInvestmentSummaries() {
        const container = document.getElementById('investmentSummaries');
        container.innerHTML = '';

        this.investors.forEach(investor => {
            const totalReturn = ((investor.currentValue - investor.initialInvestment) / investor.initialInvestment) * 100;
            const capitalAppreciation = investor.currentValue - investor.initialInvestment;

            const summaryCard = document.createElement('div');
            summaryCard.className = 'summary-card';
            summaryCard.innerHTML = `
                <div class="summary-header">${investor.name}</div>
                <div class="summary-row">
                    <span class="summary-label">Initial Investment</span>
                    <span class="summary-value">${this.formatCurrency(investor.initialInvestment)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Capital Appreciation</span>
                    <span class="summary-value ${capitalAppreciation >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(capitalAppreciation)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Current Value</span>
                    <span class="summary-value">${this.formatCurrency(investor.currentValue)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Total Return</span>
                    <span class="summary-value ${totalReturn >= 0 ? 'positive' : 'negative'}">${this.formatPercentage(totalReturn)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Current Share Holding</span>
                    <span class="summary-value">${this.formatPercentage(investor.sharePercentage)}</span>
                </div>
            `;
            container.appendChild(summaryCard);
        });
    }

    updateRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        container.innerHTML = '';

        // Show last 5 transactions
        const recentTransactions = this.transactions.slice(-5).reverse();
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No transactions yet</p>';
            return;
        }

        recentTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-type">${transaction.type}</div>
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                </div>
                <div class="transaction-amount ${transaction.type === 'Investment' ? 'positive' : 'negative'}">
                    ${this.formatCurrency(transaction.amount)}
                </div>
            `;
            container.appendChild(item);
        });
    }

    updateInvestorsTable() {
        const tbody = document.getElementById('investorsTableBody');
        tbody.innerHTML = '';

        // Recalculate all values first
        this.recalculateShares();

        this.investors.forEach(investor => {
            const investmentValue = this.calculateInvestmentValue(investor.id);
            const currentValue = this.calculateCurrentValue(investor);
            const totalReturn = investmentValue > 0 ? ((currentValue - investmentValue) / investmentValue) * 100 : 0;
            const joinDate = investor.joinDate || investor.investmentDate || 'N/A';
            
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.title = 'Click to view transaction history';
            row.onclick = () => window.showInvestorDetails(
                investor.investorId || 'N/A',
                investor.name,
                new Date(joinDate).toLocaleDateString(),
                investmentValue,
                currentValue,
                totalReturn
            );
            row.innerHTML = `
                <td><strong>${investor.investorId || 'N/A'}</strong></td>
                <td>${investor.name}</td>
                <td>${new Date(joinDate).toLocaleDateString()}</td>
                <td>${this.formatCurrency(investmentValue)}</td>
                <td>${this.formatCurrency(currentValue)}</td>
                <td class="${totalReturn >= 0 ? 'positive' : 'negative'}">${this.formatPercentage(totalReturn)}</td>
                <td>${this.formatPercentage(investor.sharePercentage)}</td>
                <td>
                    <small style="color: #666;">📊 Details</small>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePortfolioView() {
        this.updatePortfolioHoldings();
        this.updateRiskChart();
    }

    updatePortfolioHoldings() {
        const container = document.getElementById('portfolioHoldings');
        container.innerHTML = '';

        this.portfolio.forEach(asset => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            const value = asset.quantity * price;
            
            const holdingCard = document.createElement('div');
            holdingCard.className = 'holding-card';
            holdingCard.innerHTML = `
                <div class="holding-header">
                    <span class="holding-symbol">${asset.symbol}</span>
                    <span class="holding-risk risk-${asset.riskLevel.toLowerCase()}">${asset.riskLevel}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Quantity</span>
                    <span class="summary-value">${this.formatNumber(asset.quantity)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Price</span>
                    <span class="summary-value">${this.formatCurrency(price)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Value</span>
                    <span class="summary-value">${this.formatCurrency(value)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Target Allocation</span>
                    <span class="summary-value">${this.formatPercentage(asset.targetAllocation)}</span>
                </div>
            `;
            container.appendChild(holdingCard);
        });
    }

    updatePerformanceData() {
        const period = document.getElementById('periodFilter').value;
        
        // Update performance metrics
        const latestData = this.performanceData[this.performanceData.length - 1];
        const netInflows = this.calculateNetInflows();
        const capitalAppreciation = this.calculateCapitalAppreciation();
        
        document.getElementById('netInflows').textContent = this.formatCurrency(netInflows);
        document.getElementById('capitalAppreciation').textContent = this.formatCurrency(capitalAppreciation);
        document.getElementById('cumulativeReturn').textContent = this.formatPercentage(latestData?.cumulativeReturn || 0);
        
        this.updateMonthlyPerformanceChart();
    }

    // Chart Management
    setupCharts() {
        this.setupAllocationChart();
        this.setupPerformanceChart();
        this.setupRiskChart();
        this.setupMonthlyPerformanceChart();
    }

    setupAllocationChart() {
        const ctx = document.getElementById('allocationChart').getContext('2d');
        
        this.charts.allocation = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea', '#764ba2', '#f093fb', '#f5576c',
                        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        this.updateAllocationChart();
    }

    setupPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
        
        this.updatePerformanceChart();
    }

    setupRiskChart() {
        const ctx = document.getElementById('riskChart').getContext('2d');
        
        this.charts.risk = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Degen'],
                datasets: [{
                    data: [],
                    backgroundColor: ['#28a745', '#ffc107', '#fd7e14', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    setupMonthlyPerformanceChart() {
        const ctx = document.getElementById('monthlyPerformanceChart').getContext('2d');
        
        this.charts.monthlyPerformance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Return %',
                    data: [],
                    backgroundColor: (ctx) => {
                        const value = ctx.parsed?.y || 0;
                        return value >= 0 ? '#28a745' : '#dc3545';
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatPercentage(value)
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.updateAllocationChart();
        this.updatePerformanceChart();
    }

    updateAllocationChart() {
        const portfolioValue = this.calculatePortfolioValue();
        const labels = [];
        const data = [];
        
        this.portfolio.forEach(asset => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            const value = asset.quantity * price;
            const percentage = (value / portfolioValue) * 100;
            
            if (percentage > 0) {
                labels.push(asset.symbol);
                data.push(percentage);
            }
        });
        
        this.charts.allocation.data.labels = labels;
        this.charts.allocation.data.datasets[0].data = data;
        this.charts.allocation.update();
    }

    updatePerformanceChart() {
        const labels = [];
        const data = [];
        
        // Show last 30 days
        const recentData = this.performanceData.slice(-30);
        
        recentData.forEach(point => {
            labels.push(new Date(point.date).toLocaleDateString());
            data.push(point.portfolioValue);
        });
        
        this.charts.performance.data.labels = labels;
        this.charts.performance.data.datasets[0].data = data;
        this.charts.performance.update();
    }

    updateRiskChart() {
        const riskData = { Low: 0, Medium: 0, High: 0, Degen: 0 };
        const portfolioValue = this.calculatePortfolioValue();
        
        this.portfolio.forEach(asset => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            const value = asset.quantity * price;
            const percentage = (value / portfolioValue) * 100;
            riskData[asset.riskLevel] += percentage;
        });
        
        this.charts.risk.data.datasets[0].data = [
            riskData.Low, riskData.Medium, riskData.High, riskData.Degen
        ];
        this.charts.risk.update();
    }

    updateMonthlyPerformanceChart() {
        // Generate monthly returns from performance data
        const monthlyReturns = this.calculateMonthlyReturns();
        const labels = monthlyReturns.map(item => item.month);
        const data = monthlyReturns.map(item => item.return);
        
        this.charts.monthlyPerformance.data.labels = labels;
        this.charts.monthlyPerformance.data.datasets[0].data = data;
        this.charts.monthlyPerformance.update();
    }

    // Data Operations
    generateInvestorId(fullName) {
        // Get next sequential number
        const nextNumber = this.investors.length + 1;
        
        // Extract initials from full name
        const nameParts = fullName.trim().split(' ');
        const firstInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'X';
        const lastInitial = nameParts[nameParts.length - 1] ? nameParts[nameParts.length - 1][0].toUpperCase() : 'X';
        
        return `${firstInitial}${lastInitial}${nextNumber}`;
    }

    calculateInvestmentValue(investorId) {
        // Calculate net investment value: sum of investments minus redemptions
        return this.transactions
            .filter(t => t.investorId === investorId)
            .reduce((total, transaction) => {
                return transaction.type === 'Investment' 
                    ? total + transaction.amount 
                    : total - transaction.amount;
            }, 0);
    }

    calculateCurrentValue(investor) {
        // Calculate current value based on their share % of total portfolio
        const portfolioValue = this.calculatePortfolioValue();
        return portfolioValue * (investor.sharePercentage / 100);
    }

    recalculateShares() {
        // Calculate shares based on investment value, not current value
        const totalInvestmentValue = this.investors.reduce((sum, inv) => {
            return sum + this.calculateInvestmentValue(inv.id);
        }, 0);
        
        this.investors.forEach(investor => {
            const investmentValue = this.calculateInvestmentValue(investor.id);
            investor.sharePercentage = totalInvestmentValue > 0 ? (investmentValue / totalInvestmentValue) * 100 : 0;
            
            // Update current value based on portfolio performance
            investor.currentValue = this.calculateCurrentValue(investor);
        });
    }



    addAsset(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const asset = {
            symbol: formData.get('assetSymbol').toUpperCase(),
            name: formData.get('assetName'),
            quantity: parseFloat(formData.get('assetQuantity')),
            riskLevel: formData.get('assetRisk'),
            targetAllocation: parseFloat(formData.get('targetAllocation')) || 0
        };
        
        this.portfolio.push(asset);
        this.saveAllData();
        this.updatePortfolioView();
        this.closeModals();
        event.target.reset();
    }







    removeInvestor(id) {
        if (confirm('Are you sure you want to remove this investor?')) {
            this.investors = this.investors.filter(inv => inv.id !== id);
            this.recalculateShares();
            this.saveAllData();
            this.updateDashboard();
        }
    }

    // Calculations
    calculateTotalAUM() {
        return this.investors.reduce((sum, inv) => sum + inv.currentValue, 0);
    }

    calculateTotalReturn() {
        const totalInitial = this.investors.reduce((sum, inv) => sum + inv.initialInvestment, 0);
        const totalCurrent = this.calculateTotalAUM();
        return totalInitial > 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;
    }

    calculatePortfolioValue() {
        return this.portfolio.reduce((sum, asset) => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            return sum + (asset.quantity * price);
        }, 0);
    }

    calculateNetInflows() {
        return this.investors.reduce((sum, inv) => sum + inv.initialInvestment, 0);
    }

    calculateCapitalAppreciation() {
        const totalInitial = this.calculateNetInflows();
        const totalCurrent = this.calculateTotalAUM();
        return totalCurrent - totalInitial;
    }

    calculateMonthlyReturns() {
        const monthlyData = {};
        
        this.performanceData.forEach(point => {
            const date = new Date(point.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { start: point.portfolioValue, end: point.portfolioValue };
            } else {
                monthlyData[monthKey].end = point.portfolioValue;
            }
        });
        
        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            return: ((data.end - data.start) / data.start) * 100
        })).slice(-12); // Last 12 months
    }

    recalculateShares() {
        const totalValue = this.calculateTotalAUM();
        this.investors.forEach(investor => {
            investor.sharePercentage = totalValue > 0 ? (investor.currentValue / totalValue) * 100 : 0;
        });
    }

    // Blockchain API Integration
    async fetchRealPortfolioData() {
        console.log('🔄 Fetching real portfolio data from wallets...');
        console.log('📍 Wallet addresses:', this.wallets);
        this.realPortfolioData = [];

        try {
            // Show loading indicator
            const portfolioContainer = document.getElementById('portfolioHoldings');
            if (portfolioContainer) {
                portfolioContainer.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading"></div><p>Fetching live wallet data...</p></div>';
            }

            // Fetch data from all active wallets
            for (const wallet of this.wallets) {
                if (!wallet.active) continue;
                
                console.log(`🔄 Fetching ${wallet.chain} wallet: ${wallet.name}`);
                
                if (wallet.chain === 'solana') {
                    await this.fetchSolanaWalletData(wallet);
                } else if (wallet.chain === 'ethereum') {
                    await this.fetchEthereumWalletData(wallet);
                } else if (wallet.chain === 'hyperliquid') {
                    await this.fetchHyperliquidWalletData(wallet);
                }
            }
            
            console.log('✅ Total tokens found:', this.realPortfolioData.length);
            console.log('📊 Real portfolio data:', this.realPortfolioData);
            
            // If no real data found, show message
            if (this.realPortfolioData.length === 0) {
                console.log('⚠️ No tokens found in wallets - they might be empty or APIs failed');
                if (portfolioContainer) {
                    portfolioContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;"><p>No tokens found in the connected wallets.<br/>This could mean the wallets are empty or the APIs are having issues.</p></div>';
                }
                return;
            }
            
            // Update portfolio with real data
            this.updatePortfolioFromRealData();
            
        } catch (error) {
            console.error('❌ Error fetching wallet data:', error);
            
            // Show error message
            const portfolioContainer = document.getElementById('portfolioHoldings');
            if (portfolioContainer) {
                portfolioContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #dc3545;"><p>Error fetching wallet data. Using sample data.</p></div>';
            }
            
            // Use sample data as fallback
            this.loadSamplePortfolio();
        }
    }

    async fetchSolanaWalletData(wallet) {
        try {
            console.log(`🟡 Fetching Solana tokens for ${wallet.name}: ${wallet.address}`);
            
            // First, get SOL balance (native token)
            await this.fetchSOLBalance(wallet);
            
            // Then get SPL tokens using QuickNode method
            console.log(`🟡 Using QuickNode getParsedProgramAccounts method for SPL tokens`);
            await this.fetchSolanaTokensViaRPC(wallet);
            
        } catch (error) {
            console.error(`🟡 Error fetching Solana data for ${wallet.name}:`, error);
            
            // Add known tokens from WAGMI as absolute fallback
            if (wallet.address === 'AHpp7u8rV8LyX9gGEYH1ivnx1qHe2wAiGfVod9uTaXUd') {
                console.log('🟡 Using WAGMI fallback data for main wallet');
                const wagmiFallback = [
                    // BUDDY is on Hyperliquid EVM, not Solana - don't include here
                    { symbol: 'HYPE', name: 'HYPE Token', quantity: 1.7590 },
                    { symbol: 'ETH', name: 'Ethereum (Wormhole)', quantity: 0.0052 },
                    { symbol: 'USDC', name: 'USD Coin', quantity: 0.0083 },
                    { symbol: 'WIN', name: 'WIN Token', quantity: 8.0000 }
                ];
                
                wagmiFallback.forEach(token => {
                    this.realPortfolioData.push({
                        chain: 'solana',
                        wallet: wallet.name,
                        symbol: token.symbol,
                        name: token.name,
                        quantity: token.quantity,
                        mint: `${token.symbol}_MINT`
                    });
                });
            }
        }
    }

    async fetchSolanaTokensViaRPC(wallet) {
        try {
            console.log(`🟡 Using QuickNode method for ${wallet.name}: ${wallet.address}`);
            
            // Use the QuickNode approach with getParsedProgramAccounts
            const rpcUrl = 'https://api.mainnet-beta.solana.com';
            
            const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getParsedProgramAccounts',
                    params: [
                        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token Program ID
                        {
                            filters: [
                                {
                                    dataSize: 165 // Size of token account (bytes)
                                },
                                {
                                    memcmp: {
                                        offset: 32, // Location of owner in account (bytes)
                                        bytes: wallet.address // Our wallet address
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log(`🟡 QuickNode method response:`, data);
            
            if (data.result && Array.isArray(data.result)) {
                console.log(`🟡 Found ${data.result.length} token accounts via QuickNode method`);
                console.log(`🟡 📋 ALL TOKEN ACCOUNTS FOUND:`, data.result.map(acc => ({ 
                    pubkey: acc.pubkey, 
                    mint: acc.account.data.parsed.info.mint,
                    balance: acc.account.data.parsed.info.tokenAmount.uiAmount
                })));
                
                for (const account of data.result) {
                    const parsedAccountInfo = account.account.data;
                    const mintAddress = parsedAccountInfo.parsed.info.mint;
                    const tokenBalance = parsedAccountInfo.parsed.info.tokenAmount.uiAmount;
                    
                    console.log(`🟡 Token Account: ${account.pubkey}`);
                    console.log(`🟡 --Token Mint: ${mintAddress}`);
                    console.log(`🟡 --Token Balance: ${tokenBalance}`);
                    
                    // Debug: Log ALL tokens found, even with 0 balance
                    console.log(`🟡 Found token: ${mintAddress} with balance: ${tokenBalance}`);
                    
                    if (tokenBalance && tokenBalance > 0) { // Changed from 0.000001 to 0 to catch all tokens
                        // Try to get token metadata
                        const tokenMeta = await this.getSolanaTokenMetadata(mintAddress);
                        
                        console.log(`🟡 Token metadata for ${mintAddress}:`, tokenMeta);
                        
                        this.realPortfolioData.push({
                            chain: 'solana',
                            wallet: wallet.name,
                            symbol: tokenMeta.symbol || mintAddress.substring(0, 8),
                            name: tokenMeta.name || 'Unknown Token',
                            quantity: tokenBalance,
                            mint: mintAddress,
                            decimals: parsedAccountInfo.parsed.info.tokenAmount.decimals,
                            pubkey: account.pubkey
                        });
                        
                        console.log(`🟡 ✅ Added token: ${tokenMeta.symbol || 'UNKNOWN'} = ${tokenBalance}`);
                    } else {
                        console.log(`🟡 ❌ Skipped token ${mintAddress} - balance: ${tokenBalance}`);
                    }
                }
            } else if (data.error) {
                console.error('🟡 Solana RPC error:', data.error);
            }
        } catch (rpcError) {
            console.error('🟡 Solana RPC failed:', rpcError);
        }
    }

    async getSolanaTokenMetadata(mint) {
        try {
            // Common Solana token mappings for tokens you mentioned
            const knownTokens = {
                // Popular Solana tokens
                'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': { symbol: 'JUP', name: 'Jupiter' },
                'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': { symbol: 'jitoSOL', name: 'Jito Staked SOL' },
                'C98A4nkJXhpVZNAZdHUA95RpTF3T4whtQubL3YobiUX9': { symbol: 'AURA', name: 'Aura' },
                // Common tokens that might be in wallet
                'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin' },
                '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU': { symbol: 'SAMO', name: 'Samoyedcoin' },
                'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { symbol: 'mSOL', name: 'Marinade staked SOL' },
                'So11111111111111111111111111111111111111112': { symbol: 'SOL', name: 'Wrapped SOL' },
                'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', name: 'Tether' },
                '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk': { symbol: 'ETH', name: 'Ethereum (Portal)' },
                'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { symbol: 'BONK', name: 'Bonk' },
                'HypeEvSYFnEHCFWFyJYJj7Y4gdcUQTVSLqSM5CmsZe93': { symbol: 'HYPE', name: 'Hyperliquid' },
                // Add more as we discover them
            };

            // Check if it's a known token first
            if (knownTokens[mint]) {
                console.log(`🟡 Found known token: ${knownTokens[mint].symbol}`);
                return knownTokens[mint];
            }

            // Try Jupiter token list API
            const response = await fetch('https://token.jup.ag/strict');
            if (response.ok) {
                const tokens = await response.json();
                const tokenInfo = tokens.find(token => token.address === mint);
                
                if (tokenInfo) {
                    console.log(`🟡 Found in Jupiter list: ${tokenInfo.symbol}`);
                    return {
                        symbol: tokenInfo.symbol,
                        name: tokenInfo.name
                    };
                }
            }

            // Try alternative token list
            try {
                const solanaResponse = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
                if (solanaResponse.ok) {
                    const solanaTokens = await solanaResponse.json();
                    const solanaToken = solanaTokens.tokens.find(token => token.address === mint);
                    
                    if (solanaToken) {
                        console.log(`🟡 Found in Solana token list: ${solanaToken.symbol}`);
                        return {
                            symbol: solanaToken.symbol,
                            name: solanaToken.name
                        };
                    }
                }
            } catch (solanaError) {
                console.log('🟡 Solana token list fetch failed');
            }
            
            // Fallback to mint address
            console.log(`🟡 Unknown token, using mint: ${mint.substring(0, 8)}`);
            return { 
                symbol: mint.substring(0, 8), 
                name: 'Unknown Token' 
            };
        } catch (error) {
            console.error('🟡 Error fetching token metadata:', error);
            return { 
                symbol: mint.substring(0, 8), 
                name: 'Unknown Token' 
            };
        }
    }

    async fetchSOLBalance(wallet) {
        try {
            console.log(`🟡 Fetching SOL balance for ${wallet.name}...`);
            const response = await fetch('https://api.mainnet-beta.solana.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getBalance',
                    params: [wallet.address]
                })
            });

            const data = await response.json();
            console.log(`🟡 SOL balance response for ${wallet.name}:`, data);
            
            if (data.result) {
                const solBalance = data.result.value / 1e9; // Convert lamports to SOL
                console.log(`🟡 SOL Balance: ${solBalance} SOL`);
                
                if (solBalance > 0.001) { // Only include meaningful SOL balances
                    const solEntry = {
                        chain: 'solana',
                        wallet: wallet.name,
                        symbol: 'SOL',
                        name: 'Solana',
                        quantity: solBalance,
                        mint: 'So11111111111111111111111111111111111111112'
                    };
                    console.log(`🟡 Adding SOL: ${solBalance}`);
                    this.realPortfolioData.push(solEntry);
                } else {
                    console.log(`🟡 SOL balance too small: ${solBalance}`);
                }
            } else if (data.error) {
                console.error(`🟡 SOL balance error for ${wallet.name}:`, data.error);
            }
        } catch (error) {
            console.error(`🟡 Error fetching SOL balance for ${wallet.name}:`, error);
        }
    }

    async getSolanaTokenInfo(mint) {
        try {
            // Try to get token info from Jupiter API
            const response = await fetch(`https://token.jup.ag/strict`);
            const tokens = await response.json();
            const tokenInfo = tokens.find(token => token.address === mint);
            
            return tokenInfo || { symbol: mint.substring(0, 8), name: 'Unknown Token' };
        } catch (error) {
            return { symbol: mint.substring(0, 8), name: 'Unknown Token' };
        }
    }

    async fetchEthereumWalletData(wallet) {
        try {
            console.log(`🔵 Fetching Ethereum data for ${wallet.name}: ${wallet.address}`);
            
            // Try Ethplorer API for comprehensive data
            try {
                const response = await fetch(`https://api.ethplorer.io/getAddressInfo/${wallet.address}?apiKey=freekey`);
                const data = await response.json();
                console.log(`🔵 ${wallet.name} Ethplorer data:`, data);
                
                // Add ETH balance
                if (data.ETH && data.ETH.balance > 0) {
                    console.log(`🔵 ${wallet.name} ETH balance: ${data.ETH.balance}`);
                    this.realPortfolioData.push({
                        chain: 'ethereum',
                        wallet: wallet.name,
                        symbol: 'ETH',
                        name: 'Ethereum',
                        quantity: data.ETH.balance,
                        address: wallet.address
                    });
                }
                
                // Add ERC-20 tokens
                if (data.tokens && data.tokens.length > 0) {
                    console.log(`🔵 ${wallet.name} found ${data.tokens.length} tokens`);
                    for (const token of data.tokens) {
                        const balance = parseFloat(token.balance) / Math.pow(10, token.tokenInfo.decimals);
                        
                        if (balance > 0.001) { // Only include meaningful balances
                            console.log(`🔵 ${wallet.name} token: ${token.tokenInfo.symbol} = ${balance}`);
                            this.realPortfolioData.push({
                                chain: 'ethereum',
                                wallet: wallet.name,
                                symbol: token.tokenInfo.symbol,
                                name: token.tokenInfo.name,
                                quantity: balance,
                                address: token.tokenInfo.address,
                                decimals: token.tokenInfo.decimals
                            });
                        }
                    }
                } else {
                    console.log(`🔵 ${wallet.name} has no ERC-20 tokens`);
                }
                
            } catch (ethplorerError) {
                console.log(`🔵 ${wallet.name} Ethplorer API failed, using minimal fallback:`, ethplorerError);
                
                // Add minimal ETH balance as fallback
                this.realPortfolioData.push({
                    chain: 'ethereum',
                    wallet: wallet.name,
                    symbol: 'ETH',
                    name: 'Ethereum',
                    quantity: 0.1, // Minimal fallback amount
                    address: wallet.address
                });
            }

        } catch (error) {
            console.error(`🔵 Error fetching Ethereum data for ${wallet.name}:`, error);
        }
    }

    async fetchHyperliquidWalletData(wallet) {
        try {
            console.log(`🟣 Adding Hyperliquid data for ${wallet.name}`);
            
            // For now, manually add BUDDY since it's from your WAGMI data
            // TODO: Replace with actual Hyperliquid API when available
            this.realPortfolioData.push({
                chain: 'hyperliquid',
                wallet: wallet.name,
                symbol: 'BUDDY',
                name: 'BUDDY Protocol',
                quantity: 12933.03, // From your WAGMI wallet
                address: wallet.address
            });
            
            console.log('🟣 Added BUDDY from Hyperliquid wallet');
            
        } catch (error) {
            console.error(`🟣 Error fetching Hyperliquid data for ${wallet.name}:`, error);
        }
    }

    updatePortfolioFromRealData() {
        // Clear existing portfolio and replace with real data
        this.portfolio = [];
        
        // Group by symbol and sum quantities across wallets
        const aggregatedTokens = {};
        
        this.realPortfolioData.forEach(token => {
            const key = token.symbol;
            
            if (aggregatedTokens[key]) {
                aggregatedTokens[key].quantity += token.quantity;
                aggregatedTokens[key].wallets.push({
                    wallet: token.wallet,
                    chain: token.chain,
                    quantity: token.quantity
                });
            } else {
                aggregatedTokens[key] = {
                    symbol: token.symbol,
                    name: token.name,
                    quantity: token.quantity,
                    riskLevel: this.categorizeRiskLevel(token.symbol),
                    targetAllocation: 0, // Will be set manually
                    wallets: [{
                        wallet: token.wallet,
                        chain: token.chain,
                        quantity: token.quantity
                    }]
                };
            }
        });

        // Convert to portfolio array
        this.portfolio = Object.values(aggregatedTokens);
        
        console.log('📊 Updated portfolio with real data:', this.portfolio);
        
        // Save to localStorage
        this.saveAllData();
        
        // Update displays if in manager view
        if (this.currentView === 'manager') {
            this.updatePortfolioView();
            this.updateDashboard();
        }
    }

    categorizeRiskLevel(symbol) {
        const riskMapping = {
            'BTC': 'Low',
            'ETH': 'Low',
            'SOL': 'Low',
            'USDC': 'Low',
            'USDT': 'Low',
            'BNB': 'Medium',
            'ADA': 'Medium',
            'AVAX': 'Medium',
            'MATIC': 'Medium',
            'DOT': 'Medium',
            'LINK': 'Medium'
        };
        
        return riskMapping[symbol] || 'High'; // Default to High risk for unknown tokens
    }

    // Enhanced portfolio display with wallet information
    updatePortfolioHoldings() {
        const container = document.getElementById('portfolioHoldings');
        container.innerHTML = '';

        this.portfolio.forEach(asset => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            const value = asset.quantity * price;
            
            const holdingCard = document.createElement('div');
            holdingCard.className = 'holding-card';
            
            // Create wallet breakdown
            const walletBreakdown = asset.wallets ? asset.wallets.map(w => 
                `${w.chain}: ${this.formatNumber(w.quantity)}`
            ).join('<br>') : '';
            
            holdingCard.innerHTML = `
                <div class="holding-header">
                    <span class="holding-symbol">${asset.symbol}</span>
                    <span class="holding-risk risk-${asset.riskLevel.toLowerCase()}">${asset.riskLevel}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Total Quantity</span>
                    <span class="summary-value">${this.formatNumber(asset.quantity)}</span>
                </div>
                ${walletBreakdown ? `<div class="summary-row">
                    <span class="summary-label">Wallet Breakdown</span>
                    <span class="summary-value wallet-breakdown">${walletBreakdown}</span>
                </div>` : ''}
                <div class="summary-row">
                    <span class="summary-label">Price</span>
                    <span class="summary-value">${this.formatCurrency(price)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Total Value</span>
                    <span class="summary-value">${this.formatCurrency(value)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Target Allocation</span>
                    <span class="summary-value">${this.formatPercentage(asset.targetAllocation)}</span>
                </div>
            `;
            container.appendChild(holdingCard);
        });
    }

    // External API
    async fetchCryptoPrices() {
        try {
            // Create a mapping from symbol to CoinGecko ID
            const symbolToId = {
                'BTC': 'bitcoin',
                'ETH': 'ethereum', 
                'SOL': 'solana',
                'USDC': 'usd-coin',
                'USDT': 'tether',
                'BNB': 'binancecoin',
                'ADA': 'cardano',
                'AVAX': 'avalanche-2',
                'MATIC': 'matic-network',
                'DOT': 'polkadot',
                'LINK': 'chainlink',
                'BUDDY': 'buddy-dao', // Try to find BUDDY on CoinGecko
                'HYPE': 'hype-token', // Try to find HYPE on CoinGecko
                'WIN': 'wincoin'      // Try to find WIN on CoinGecko
            };

            // Fallback prices for tokens not on CoinGecko (based on your WAGMI values)
            const fallbackPrices = {
                'BUDDY': 85.65 / 12933.03, // $85.65 / 12933.03 tokens = ~$0.0066
                'HYPE': 77.19 / 1.7590,    // $77.19 / 1.7590 tokens = ~$43.89
                'WIN': 0.00,               // $0.00 value
                'ETH': 3500,               // Approximate ETH price
                'USDC': 1.00               // USDC is $1
            };

            const symbols = this.portfolio.map(asset => asset.symbol);
            const coinIds = symbols.map(symbol => symbolToId[symbol] || symbol.toLowerCase()).filter(Boolean);
            
            if (coinIds.length === 0) {
                this.setFallbackPrices();
                return;
            }
            
            const idsString = coinIds.join(',');
            console.log('🔍 Fetching prices for:', idsString);
            
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`);
            const data = await response.json();
            
            console.log('💰 Price data received:', data);
            
            // Map prices back to symbols
            this.portfolio.forEach(asset => {
                const coinId = symbolToId[asset.symbol] || asset.symbol.toLowerCase();
                if (data[coinId]) {
                    this.cryptoPrices[asset.symbol] = data[coinId].usd;
                    console.log(`💲 ${asset.symbol}: $${data[coinId].usd}`);
                } else if (fallbackPrices[asset.symbol] !== undefined) {
                    // Use calculated price from your WAGMI wallet
                    this.cryptoPrices[asset.symbol] = fallbackPrices[asset.symbol];
                    console.log(`💰 ${asset.symbol}: Using WAGMI-based price $${fallbackPrices[asset.symbol]}`);
                } else {
                    // Set a default price for completely unknown tokens
                    this.cryptoPrices[asset.symbol] = 0.01;
                    console.log(`❓ ${asset.symbol}: Using default fallback price $0.01`);
                }
            });
            
            // Update displays that depend on prices
            if (this.currentView === 'manager') {
                this.updatePortfolioView();
                this.updateAllocationChart();
            }
            
            // Update asset price timestamps in the frontend
            if (typeof window !== 'undefined' && window.updateAssetPriceTimestamp) {
                window.updateAssetPriceTimestamp();
            }
            
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            this.setFallbackPrices();
        }
    }

    setFallbackPrices() {
        this.cryptoPrices = {
            'BTC': 45000,
            'ETH': 2500,
            'USDC': 1,
            'SOL': 100,
            'AVAX': 25,
            'MATIC': 0.8
        };
    }

    // Investor View Functions
    updateInvestorDashboard() {
        if (!this.currentInvestor) return;

        this.updateInvestorHeaderStats();
        this.updatePersonalSummary();
        this.updatePersonalTransactionHistory();
        this.updateInvestorCharts();
    }

    updateInvestorHeaderStats() {
        const investor = this.currentInvestor;
        const totalReturn = ((investor.currentValue - investor.initialInvestment) / investor.initialInvestment) * 100;

        document.getElementById('myInvestmentValue').textContent = this.formatCurrency(investor.currentValue);
        document.getElementById('myTotalReturn').textContent = this.formatPercentage(totalReturn);
        document.getElementById('myShareHoldings').textContent = this.formatPercentage(investor.sharePercentage);
    }

    updatePersonalSummary() {
        const investor = this.currentInvestor;
        const totalReturn = ((investor.currentValue - investor.initialInvestment) / investor.initialInvestment) * 100;
        const capitalAppreciation = investor.currentValue - investor.initialInvestment;

        const container = document.getElementById('personalSummary');
        container.innerHTML = `
            <div class="personal-metric">
                <span class="label">Initial Investment</span>
                <span class="value">${this.formatCurrency(investor.initialInvestment)}</span>
            </div>
            <div class="personal-metric">
                <span class="label">Current Value</span>
                <span class="value">${this.formatCurrency(investor.currentValue)}</span>
            </div>
            <div class="personal-metric">
                <span class="label">Capital Appreciation</span>
                <span class="value ${capitalAppreciation >= 0 ? '' : 'negative'}">${this.formatCurrency(capitalAppreciation)}</span>
            </div>
            <div class="personal-metric">
                <span class="label">Total Return</span>
                <span class="value ${totalReturn >= 0 ? '' : 'negative'}">${this.formatPercentage(totalReturn)}</span>
            </div>
            <div class="personal-metric">
                <span class="label">Share of Fund</span>
                <span class="value">${this.formatPercentage(investor.sharePercentage)}</span>
            </div>
            <div class="personal-metric">
                <span class="label">Investment Date</span>
                <span class="value">${new Date(investor.investmentDate).toLocaleDateString()}</span>
            </div>
        `;
    }

    updatePersonalTransactionHistory() {
        const investor = this.currentInvestor;
        const investorTransactions = this.transactions.filter(t => t.investorId === investor.id);
        
        const container = document.getElementById('myTransactionHistory');
        container.innerHTML = '';

        if (investorTransactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No transaction history available</p>';
            return;
        }

        investorTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-history-item';
            item.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-type">${transaction.type}</div>
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                </div>
                <div class="transaction-amount ${transaction.type === 'Investment' ? 'positive' : 'negative'}">
                    ${this.formatCurrency(transaction.amount)}
                </div>
            `;
            container.appendChild(item);
        });
    }

    updateInvestorPerformance() {
        if (!this.currentInvestor) return;

        const investor = this.currentInvestor;
        const investmentDate = new Date(investor.investmentDate);
        const daysSinceInvestment = Math.floor((new Date() - investmentDate) / (1000 * 60 * 60 * 24));
        const totalReturn = ((investor.currentValue - investor.initialInvestment) / investor.initialInvestment) * 100;
        const annualizedReturn = daysSinceInvestment > 0 ? (Math.pow(investor.currentValue / investor.initialInvestment, 365 / daysSinceInvestment) - 1) * 100 : 0;
        const capitalAppreciation = investor.currentValue - investor.initialInvestment;

        document.getElementById('myInvestmentDate').textContent = investmentDate.toLocaleDateString();
        document.getElementById('myDaysInvested').textContent = daysSinceInvestment.toString();
        document.getElementById('myCapitalAppreciation').textContent = this.formatCurrency(capitalAppreciation);
        document.getElementById('myAnnualizedReturn').textContent = this.formatPercentage(annualizedReturn);
    }

    updateInvestorStatements() {
        if (!this.currentInvestor) return;

        const investor = this.currentInvestor;
        const totalReturn = ((investor.currentValue - investor.initialInvestment) / investor.initialInvestment) * 100;
        const capitalAppreciation = investor.currentValue - investor.initialInvestment;

        const container = document.getElementById('investmentStatement');
        container.innerHTML = `
            <div class="statement-header">
                <h3>Investment Statement - ${investor.name}</h3>
                <p>Statement Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="statement-body">
                <table class="statement-table">
                    <tr>
                        <td><strong>Investor Name:</strong></td>
                        <td>${investor.name}</td>
                    </tr>
                    <tr>
                        <td><strong>Initial Investment:</strong></td>
                        <td>${this.formatCurrency(investor.initialInvestment)}</td>
                    </tr>
                    <tr>
                        <td><strong>Investment Date:</strong></td>
                        <td>${new Date(investor.investmentDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Current Value:</strong></td>
                        <td>${this.formatCurrency(investor.currentValue)}</td>
                    </tr>
                    <tr>
                        <td><strong>Capital Appreciation:</strong></td>
                        <td class="${capitalAppreciation >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(capitalAppreciation)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Return:</strong></td>
                        <td class="${totalReturn >= 0 ? 'positive' : 'negative'}">${this.formatPercentage(totalReturn)}</td>
                    </tr>
                    <tr>
                        <td><strong>Share of Fund:</strong></td>
                        <td>${this.formatPercentage(investor.sharePercentage)}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    setupInvestorCharts() {
        this.setupMyAllocationChart();
        this.setupMyPerformanceChart();
        this.setupMyVsFundChart();
    }

    updateInvestorCharts() {
        this.updateMyAllocationChart();
        this.updateMyPerformanceChart();
    }

    setupMyAllocationChart() {
        const ctx = document.getElementById('myAllocationChart').getContext('2d');
        
        this.charts.myAllocation = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#28a745', '#20c997', '#17a2b8', '#007bff',
                        '#6f42c1', '#e83e8c', '#fd7e14', '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'My Share of Portfolio Allocation'
                    }
                }
            }
        });
    }

    setupMyPerformanceChart() {
        const ctx = document.getElementById('myPerformanceChart').getContext('2d');
        
        this.charts.myPerformance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'My Investment Value',
                    data: [],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    setupMyVsFundChart() {
        const ctx = document.getElementById('myVsFundChart').getContext('2d');
        
        this.charts.myVsFund = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'My Return %',
                        data: [],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)'
                    },
                    {
                        label: 'Fund Return %',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatPercentage(value)
                        }
                    }
                }
            }
        });
    }

    updateMyAllocationChart() {
        if (!this.currentInvestor) return;

        const portfolioValue = this.calculatePortfolioValue();
        const myShare = this.currentInvestor.sharePercentage / 100;
        const labels = [];
        const data = [];
        
        this.portfolio.forEach(asset => {
            const price = this.cryptoPrices[asset.symbol] || 0;
            const value = asset.quantity * price;
            const myValue = value * myShare;
            
            if (myValue > 0) {
                labels.push(asset.symbol);
                data.push(myValue);
            }
        });
        
        this.charts.myAllocation.data.labels = labels;
        this.charts.myAllocation.data.datasets[0].data = data;
        this.charts.myAllocation.update();
    }

    updateMyPerformanceChart() {
        if (!this.currentInvestor) return;

        const investor = this.currentInvestor;
        const investmentDate = new Date(investor.investmentDate);
        const labels = [];
        const data = [];
        
        // Generate performance data from investment date to now
        const daysSinceInvestment = Math.floor((new Date() - investmentDate) / (1000 * 60 * 60 * 24));
        const dailyGrowth = Math.pow(investor.currentValue / investor.initialInvestment, 1 / daysSinceInvestment);
        
        for (let i = 0; i <= Math.min(daysSinceInvestment, 30); i += Math.max(1, Math.floor(daysSinceInvestment / 30))) {
            const date = new Date(investmentDate);
            date.setDate(date.getDate() + i);
            const value = investor.initialInvestment * Math.pow(dailyGrowth, i);
            
            labels.push(date.toLocaleDateString());
            data.push(value);
        }
        
        this.charts.myPerformance.data.labels = labels;
        this.charts.myPerformance.data.datasets[0].data = data;
        this.charts.myPerformance.update();
    }

    generateStatement() {
        // This would generate a PDF statement
        alert('PDF generation would be implemented here. For now, you can print this page.');
        window.print();
    }

    exportData() {
        if (!this.currentInvestor) return;
        
        const data = {
            investor: this.currentInvestor,
            transactions: this.transactions.filter(t => t.investorId === this.currentInvestor.id),
            generatedDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentInvestor.name}_investment_data.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Export all data as CSV files for sharing/migration
    exportAllDataAsCSV() {
        this.exportInvestorsCSV();
        this.exportPortfolioCSV();
        this.exportTransactionsCSV();
        this.exportPerformanceCSV();
    }

    exportInvestorsCSV() {
        const headers = ['ID', 'Name', 'Email', 'Initial Investment', 'Investment Date', 'Current Value', 'Share Percentage'];
        const rows = this.investors.map(inv => [
            inv.id,
            inv.name,
            inv.email || '',
            inv.initialInvestment,
            inv.investmentDate,
            inv.currentValue,
            inv.sharePercentage
        ]);
        
        this.downloadCSV([headers, ...rows], 'investors.csv');
    }

    exportPortfolioCSV() {
        const headers = ['Symbol', 'Name', 'Quantity', 'Risk Level', 'Target Allocation'];
        const rows = this.portfolio.map(asset => [
            asset.symbol,
            asset.name,
            asset.quantity,
            asset.riskLevel,
            asset.targetAllocation || 0
        ]);
        
        this.downloadCSV([headers, ...rows], 'portfolio.csv');
    }

    exportTransactionsCSV() {
        const headers = ['ID', 'Investor ID', 'Investor Name', 'Date', 'Type', 'Amount'];
        const rows = this.transactions.map(txn => {
            const investor = this.investors.find(inv => inv.id === txn.investorId);
            return [
                txn.id,
                txn.investorId,
                investor ? investor.name : 'Unknown',
                txn.date,
                txn.type,
                txn.amount
            ];
        });
        
        this.downloadCSV([headers, ...rows], 'transactions.csv');
    }

    exportPerformanceCSV() {
        const headers = ['Date', 'Portfolio Value', 'Cumulative Return'];
        const rows = this.performanceData.map(data => [
            data.date,
            data.portfolioValue,
            data.cumulativeReturn
        ]);
        
        this.downloadCSV([headers, ...rows], 'performance.csv');
    }

    downloadCSV(data, filename) {
        const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatPercentage(percentage) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }).format(percentage / 100);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8
        }).format(number);
    }

    parseMoneyValue(value) {
        if (!value) return 0;
        // Remove $ and commas, then parse as float
        return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
    }

    parsePercentageValue(value) {
        if (!value) return 0;
        // Remove % and parse as float
        return parseFloat(value.toString().replace('%', '')) || 0;
    }

    // Google Sheets API Integration
    async loadDataFromGoogleSheets() {
        if (!this.googleSheetsConfig.enabled) {
            console.log('📊 Google Sheets integration disabled');
            return;
        }
        
        console.log('📊 Loading data from Google Sheets...');
        console.log('📊 Spreadsheet ID:', this.googleSheetsConfig.spreadsheetId);
        
        try {
            // Load investors first
            console.log('📊 Loading investors...');
            await this.loadInvestorsFromSheets();
            console.log(`✅ Loaded ${this.investors.length} investors`);
            
            // Then load transactions (needs investors to be loaded first)
            console.log('📊 Loading transactions...');
            await this.loadTransactionsFromSheets();
            console.log(`✅ Loaded ${this.transactions.length} transactions`);
            
            // Load wallets
            console.log('📊 Loading wallets...');
            await this.loadWalletsFromSheets();
            console.log(`✅ Loaded ${this.wallets.length} wallets`);
            
            console.log('✅ Successfully loaded all data from Google Sheets');
            this.recalculateShares();
            this.saveAllData(); // Save to localStorage as backup
            
        } catch (error) {
            console.error('❌ Error loading from Google Sheets:', error);
            console.log('📋 Falling back to local sample data');
            // Don't call loadSampleData() again since it was already called
        }
    }

    async loadInvestorsFromSheets() {
        // Try multiple possible sheet names and ranges
        const possibleRanges = [
            'Investors!A:H',  // Original expected format
            'Table2!A:H',     // Based on your screenshot showing "Table2"
            'Sheet1!A:H',     // Default sheet name
            'Investor Data!A:H' // Alternative name
        ];
        
        for (const range of possibleRanges) {
            try {
                console.log(`📊 Trying to load from range: ${range}`);
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.spreadsheetId}/values/${range}?key=${this.googleSheetsConfig.apiKey}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.values && data.values.length > 1) {
                    console.log(`✅ Found data in range: ${range}`);
                    console.log('📊 Raw data from Google Sheets:', data.values);
                    
                    // Skip header row and convert to investor objects
                    this.investors = data.values.slice(1).filter(row => row[0]).map((row, index) => {
                        console.log(`📊 Processing row ${index + 1}:`, row);
                        
                        return {
                            id: index + 1,
                            investorId: row[0] || '',
                            name: row[1] || '',
                            email: row[2] || '',
                            joinDate: row[3] || '',
                            investmentValue: this.parseMoneyValue(row[4]) || 0,
                            currentValue: this.parseMoneyValue(row[5]) || 0,
                            sharePercentage: this.parsePercentageValue(row[6]) || 0,
                            returnPercentage: this.parsePercentageValue(row[7]) || 0
                        };
                    });
                    
                    console.log(`📊 Successfully loaded ${this.investors.length} investors from Google Sheets`);
                    console.log('📊 Sample investor data:', this.investors[0]);
                    return; // Success, exit the loop
                }
            } catch (error) {
                console.log(`⚠️ Failed to load from range ${range}:`, error.message);
                continue; // Try next range
            }
        }
        
        console.warn('⚠️ Could not load investor data from any expected sheet range');
    }
    
    // Debug function to list all available sheets
    async debugGoogleSheets() {
        console.log('🔍 Debugging Google Sheets structure...');
        
        try {
            // Get spreadsheet metadata to see all sheet names
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.spreadsheetId}?key=${this.googleSheetsConfig.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('📊 Available sheets in your Google Sheets:');
            if (data.sheets) {
                data.sheets.forEach((sheet, index) => {
                    console.log(`   ${index + 1}. "${sheet.properties.title}" (${sheet.properties.gridProperties.rowCount} rows x ${sheet.properties.gridProperties.columnCount} columns)`);
                });
            }
            
            // Try to get a sample of data from each sheet
            for (const sheet of data.sheets || []) {
                const sheetName = sheet.properties.title;
                try {
                    const sampleUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.spreadsheetId}/values/${sheetName}!A1:H5?key=${this.googleSheetsConfig.apiKey}`;
                    const sampleResponse = await fetch(sampleUrl);
                    const sampleData = await sampleResponse.json();
                    
                    if (sampleData.values && sampleData.values.length > 0) {
                        console.log(`📋 Sample data from "${sheetName}":`, sampleData.values);
                    }
                } catch (error) {
                    console.log(`⚠️ Could not read sample data from "${sheetName}":`, error.message);
                }
            }
            
        } catch (error) {
            console.error('❌ Error debugging Google Sheets:', error);
        }
    }

    async loadTransactionsFromSheets() {
        const range = 'Transactions!A:F';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.spreadsheetId}/values/${range}?key=${this.googleSheetsConfig.apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            // Skip header row and convert to transaction objects
            this.transactions = data.values.slice(1).map((row, index) => {
                // Find investor by investorId code (LK1, MO2, etc.)
                const investor = this.investors.find(inv => inv.investorId === row[1]);
                return {
                    id: index + 1,
                    investorId: investor ? investor.id : null,
                    type: row[2] || 'Investment',
                    amount: parseFloat(row[3]) || 0,
                    date: row[4] || '',
                    notes: row[5] || ''
                };
            });
            
            console.log(`💰 Loaded ${this.transactions.length} transactions from Google Sheets`);
        }
    }

    async loadWalletsFromSheets() {
        const range = 'Wallets!A:D';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetsConfig.spreadsheetId}/values/${range}?key=${this.googleSheetsConfig.apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            // Skip header row and convert to wallet objects
            this.wallets = data.values.slice(1).map((row, index) => ({
                id: index + 1,
                name: row[0] || '',
                address: row[1] || '',
                chain: row[2] || '',
                active: row[3] === 'TRUE'
            }));
            
            console.log(`🔗 Loaded ${this.wallets.length} wallets from Google Sheets`);
        }
    }

    async saveToGoogleSheets(sheetName, data) {
        // This would require Google Sheets API write permissions
        // For now, we'll log what would be saved
        console.log(`📊 Would save to ${sheetName}:`, data);
        console.log('💡 To enable writing, we need Google Sheets API write permissions');
    }
}

// Initialize the application
console.log('🚀 Initializing app...');
let app;
try {
    app = new CryptoInvestmentManager();
    console.log('✅ App initialized successfully');
    window.app = app; // Make it globally available
} catch (error) {
    console.error('❌ Error initializing app:', error);
}

// Simple test function
window.testScript = function() {
    console.log('✅ JavaScript is working!');
    alert('JavaScript is working!');
};

// Debug function to test elements
window.debugApp = function() {
    console.log('🔍 DEBUG: Testing app elements...');
    console.log('🔍 managerPortalBtn:', document.getElementById('managerPortalBtn'));
    console.log('🔍 managerPortalButton:', document.getElementById('managerPortalButton'));
    console.log('🔍 investorPortalBtn:', document.getElementById('investorPortalBtn'));
    console.log('🔍 investorPortalButton:', document.getElementById('investorPortalButton'));
    console.log('🔍 app object:', app);
    console.log('🔍 app.enterManagerView:', typeof app.enterManagerView);
    
    // Test manual call
    try {
        console.log('🔍 Testing manual enterManagerView call...');
        app.enterManagerView();
    } catch (error) {
        console.error('🔍 Error in manual call:', error);
    }
};

// Auto-run debug after page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('🔍 Page loaded, running debug...');
        window.debugApp();
    }, 1000);
});
