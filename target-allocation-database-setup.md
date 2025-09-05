# 🎯 Target Allocation Database Setup

## Google Sheets Setup Instructions

### Step 1: Create TargetAllocation Sheet

1. **Open your Google Sheets** (the same spreadsheet used for Portfolio and Investors data)
2. **Add a new sheet** by clicking the "+" button at the bottom
3. **Rename the sheet** to exactly: `TargetAllocation`

### Step 2: Set Up Column Headers

In the first row, add these headers:

| Column A | Column B |
|----------|----------|
| Risk Category | Target Percentage |

### Step 3: Add Target Allocation Data

Add your target allocation data in the following rows:

| Risk Category | Target Percentage |
|---------------|-------------------|
| Low risk      | 20                |
| Medium risk   | 29                |
| High risk     | 40                |
| Degen         | 1                 |
| Stablecoin    | 10                |

### Step 4: Complete Sheet Structure

Your `TargetAllocation` sheet should look like this:

```
A              B
Risk Category  Target Percentage
Low risk       20
Medium risk    29  
High risk      40
Degen          1
Stablecoin     10
```

### Step 5: Format the Sheet (Optional)

1. **Select row 1** (headers)
2. **Bold the text** (Ctrl+B or Cmd+B)
3. **Add background color** (optional - light gray works well)
4. **Auto-resize columns** by double-clicking the column borders

### Step 6: Verify Setup

1. Make sure the sheet is named exactly `TargetAllocation`
2. Column A contains the risk category names
3. Column B contains the percentage numbers (no % symbol needed)
4. The risk category names match exactly what you use in your portfolio data

## Important Notes

- **Sheet Name**: Must be exactly `TargetAllocation` (case-sensitive)
- **Risk Categories**: Must match the risk levels used in your Portfolio sheet (Column H)
- **Percentages**: Enter as numbers (20, not 20%)
- **Total**: Should add up to 100%
- **Read-Only**: The app will only read this data, you update it manually in Google Sheets

## Updating Target Allocation

To change your target allocation:

1. **Open Google Sheets**
2. **Go to TargetAllocation sheet**
3. **Edit the percentages** in Column B
4. **Save** (auto-saves)
5. **Refresh your app** - changes will appear on next data load

## Example Scenarios

### Conservative Portfolio
```
Low risk       40
Medium risk    35
High risk      20
Degen          0
Stablecoin     5
```

### Aggressive Portfolio  
```
Low risk       10
Medium risk    25
High risk      55
Degen          5
Stablecoin     5
```

### Balanced Portfolio
```
Low risk       25
Medium risk    35
High risk      30
Degen          2
Stablecoin     8
```

## Troubleshooting

**Charts not showing?**
- Check sheet name is exactly `TargetAllocation`
- Verify risk categories match your portfolio data
- Ensure percentages are numbers, not text

**Wrong data displaying?**
- Check column order (Risk Category in A, Target Percentage in B)
- Verify no empty rows between data
- Make sure percentages add up reasonably

**App using default values?**
- Check Google Sheets API permissions
- Verify sheet is in the same spreadsheet as Portfolio data
- Try refreshing the app

---

Once you've set this up, the app will automatically:
- ✅ Fetch your target allocation data
- ✅ Compare it against current portfolio allocation  
- ✅ Display pie charts showing target vs current
- ✅ Show a detailed comparison table with variances
- ✅ Update whenever you refresh the portfolio data
