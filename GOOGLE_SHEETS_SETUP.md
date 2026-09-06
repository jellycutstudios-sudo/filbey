# 📊 Google Sheets Setup for Customer Orders & Marketing Promotions

Follow these simple steps (takes under 2 minutes) to link your Filbey website to your own Google Sheet.

Every customer who places an order will automatically be added with their **Name, Phone Number, Delivery Address, Area, Order Total, and Date**.

---

## Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name your sheet: `Filbey Customer Orders & Promotions`.
3. In Row 1, add these headers:
   - **Column A:** `Date & Time`
   - **Column B:** `Phone Number`
   - **Column C:** `Customer Name`
   - **Column D:** `Delivery Area`
   - **Column E:** `Full Address`
   - **Column F:** `Order Total (₹)`
   - **Column G:** `Ordered Items`

---

## Step 2: Add the Apps Script Webhook
1. In your Google Sheet menu, click **Extensions** > **Apps Script**.
2. Delete whatever is in the script editor and paste this code:

```javascript
const SHEET_NAME = "Sheet1"; // Change if your sheet tab is named differently

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Normalize phone number (last 10 digits)
    const rawPhone = String(data.phone || "").replace(/\D/g, "");
    const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;
    
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    sheet.appendRow([
      timestamp,
      phone,
      data.name || "",
      data.area || "",
      data.address || "",
      data.total || 0,
      data.items || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Order logged successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const phoneParam = e && e.parameter && e.parameter.phone ? String(e.parameter.phone).replace(/\D/g, "") : "";
    const cleanQuery = phoneParam.length >= 10 ? phoneParam.slice(-10) : phoneParam;

    if (!cleanQuery) {
      return ContentService.createTextOutput(JSON.stringify({ hasOrdered: false }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    let found = false;
    let customerName = "";
    let customerAddress = "";

    // Search Column B (index 1) for this phone number (skipping header row 0)
    // Going from row 1 to bottom ensures we get their latest name and address
    for (let i = 1; i < data.length; i++) {
      const cellPhone = String(data[i][1] || "").replace(/\D/g, "");
      const normalized = cellPhone.length >= 10 ? cellPhone.slice(-10) : cellPhone;
      if (normalized === cleanQuery) {
        found = true;
        if (data[i][2]) customerName = String(data[i][2]).trim();
        if (data[i][4]) customerAddress = String(data[i][4]).trim();
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      hasOrdered: found,
      phone: cleanQuery,
      name: customerName,
      address: customerAddress
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ hasOrdered: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3: Deploy as Web App
1. In the top right of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Configure the settings:
   - **Description:** `Filbey Order Webhook`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` *(Crucial so the website can log orders and check phones)*
---

## ⚡ How to Update the Script (If Already Deployed)
If you already deployed your script previously:
1. In Apps Script, replace the code with the script above and click **Save** (💾).
2. In the top right, click **Deploy** > **Manage deployments**.
3. Click the **Edit (pencil icon ✏️)** in the top right of the modal.
4. Under **Version**, click the dropdown and choose **New version**.
5. Click **Deploy**. *(Your URL stays the same, and it immediately starts returning the customer name & address!)*


*Note: The website also has an automatic local backup. Even if you haven't added the URL yet, it will still remember phones on the customer's browser.*
