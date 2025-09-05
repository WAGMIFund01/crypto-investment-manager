# Google Sheets Master Database Setup

## 📊 Required Google Sheets Structure

Create a new Google Sheet with these 3 tabs:

### 1. **Investors** Tab
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| investor_id | name | email | join_date | current_value | share_percentage |
| LK1 | Leke Karunwi | leke@example.com | 2023-10-08 | 2000.00 | 7.95 |
| MO2 | Mariam Oyawoye | mummy@example.com | 2023-10-10 | 1050.06 | 4.18 |
| FO3 | Fifehanmi Oyawoye | fifehanmi@example.com | 2023-10-14 | 1823.91 | 7.26 |
| RA4 | Rinsola Aminu | rinsola@example.com | 2023-11-19 | 828.30 | 3.30 |
| OK5 | Oyinkan Karunwi | oyinkan@example.com | 2023-11-19 | 991.57 | 3.94 |
| OA6 | Omair Ansari | omair@example.com | 2023-11-26 | 20212.46 | 80.37 |

### 2. **Transactions** Tab  
| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| transaction_id | investor_id | type | amount | date |
| 1 | LK1 | Investment | 2000.00 | 2023-10-08 |
| 2 | MO2 | Investment | 1050.06 | 2023-10-10 |
| 3 | FO3 | Investment | 1823.91 | 2023-10-14 |
| 4 | RA4 | Investment | 142.97 | 2023-11-19 |
| 5 | OK5 | Investment | 991.57 | 2023-11-19 |
| 6 | OA6 | Investment | 1418.82 | 2023-11-26 |
| 7 | OA6 | Investment | 8774.88 | 2023-11-28 |
| 8 | RA4 | Investment | 685.33 | 2024-02-10 |
| 9 | OA6 | Investment | 10018.76 | 2024-06-15 |

### 3. **Wallets** Tab
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| wallet_name | address | chain | active |
| Main Solana Wallet | AHpp7u8rV8LyX9gGEYH1ivnx1qHe2wAiGfVod9uTaXUd | solana | TRUE |
| Ethereum Wallet 1 | 0x39f8602c7DeA377506D1872968FE8857fb78370f | ethereum | TRUE |
| Ethereum Wallet 2 | 0xd07947276c65bc5035797c986f97456702400793 | ethereum | TRUE |

## 🔧 Setup Steps

1. **Create the Google Sheet** with the above structure
2. **Make it publicly readable** (Share → Anyone with link can view)
3. **Get the Sheet ID** from the URL
4. **Update the app** to use Google Sheets API

## 🔗 Google Sheets API Integration

The app will use the Google Sheets API to:
- **Read data** on app load
- **Write new investors** when added
- **Write new transactions** when investments are made
- **Sync across devices** (phone + laptop)

Would you like me to:
1. Create a template Google Sheet for you?
2. Implement the Google Sheets API integration?
3. Show you how to set up the API credentials?
