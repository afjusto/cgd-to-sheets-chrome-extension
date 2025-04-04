# CGD to Sheets – chrome extension for exporting CGD transactions to Google Sheets

This Chrome Extension helps you export selected banking transactions from **Caixa Geral de Depósitos (CGD)** into a Google Sheet with one click.

It works directly on the CGD web banking interface:
- Select transactions using the checkboxes
- Click the extension icon
- The selected rows are formatted and sent to your own Google Sheet

---

## ⚙️ Requirements

- A CGD online banking account  
- A Google account (to create and host the Google Apps Script)

---

## 📦 Installation

1. Clone or download this repo  
2. Go to `chrome://extensions`  
3. Enable **Developer mode**  
4. Click **Load unpacked**  
5. Select the directory with this project  

---

## 🔗 Setup – Google Apps Script

You'll need to create a webhook using Google Apps Script to receive your transaction data.

### 1. Create a Google Sheet

- Go to [Google Sheets](https://sheets.google.com/)  
- Create a new spreadsheet  
- Add **two sheets** inside it named:
  - `Despesas`
  - `Rendimentos`

> These sheet names are required for categorizing debit and credit transactions. If you want to use different names, you must update the code in the Apps Script accordingly.

### 2. Add an Apps Script

- Go to **Extensions > Apps Script**  
- Delete any default code and paste the following:

    ```javascript
    function doPost(e) {
      const despesasSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Despesas");
      const rendimentosSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rendimentos");
      const output = ContentService.createTextOutput();

      const data = JSON.parse(e.postData.contents);  
      data.forEach(item => {
        const date = item.date;
        const description = item.description;
        const debit = item.debit;
        const credit = item.credit;

        if (debit) {
          appendToSheet(despesasSheet, date, debit, description);
        } else if (credit) {
          appendToSheet(rendimentosSheet, date, credit, description);
        }   
      });

      output.append("Success");
      return output;
    }

    function appendToSheet(sheet, date, value, description) {
      const lastRow = sheet.getLastRow();
      const nextRow = lastRow + 1;

      sheet.getRange(nextRow, 2).setValue(date); // Column B for date
      sheet.getRange(nextRow, 3).setValue(value); // Column C for value (debit or credit)
      sheet.getRange(nextRow, 4).setValue(description); // Column D for description
    }
    ```

### 3. Deploy as Web App

- Click **Deploy > Manage deployments**  
- Click **+ New deployment**  
- Select **"Web App"**  
- Set:
  - **Execute as**: *Me*
  - **Who has access**: *Anyone*
- Click **Deploy**  
- Copy the **Web App URL** (it will start with `https://script.google.com/macros/...`)

---

## ⚙️ Configure the Extension

1. Right-click the extension icon in Chrome  
2. Click **Options**  
3. Paste your Google Apps Script URL into the input  
4. Click **Save**

The extension will now send data to that URL whenever you click it.

---

## 🧪 How to Use

1. Log into your CGD online banking account  
2. Navigate to the transactions list (e.g., "Movimentos")  
3. Select the checkboxes for the rows you want to export  
4. Click the extension icon  
5. The selected rows will be sent to your configured Google Sheet

Each row includes:
- `date`: Formatted as `dd/mm/yyyy`
- `description`: Cleaned and capitalized
- `debit`: As a number (e.g., `12.50`)
- `credit`: As a number (e.g., `100.00`)

Transactions will be automatically appended to:
- `Despesas` sheet for debits
- `Rendimentos` sheet for credits

---

## 🛡️ Privacy & Security

- This extension only runs when clicked manually  
- It only scrapes selected rows from the CGD page you're viewing  
- The data is sent **only** to the Google Apps Script URL you configure  
- No data is logged, stored, or transmitted elsewhere
