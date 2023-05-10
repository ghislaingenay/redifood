// import { UserPayload } from '../../redifood-module/src/interfaces';

// import { authenticate } from '@google-cloud/local-auth';

import { google, sheets_v4 } from 'googleapis';

// import { google } from 'googleapis';
class GoogleSheetApi {
  spreadsheetId = '1copNXVPX-bt-3bOlyfGMekr2JoA57iJdiX8FO01RL9o';
  googleSheets: sheets_v4.Sheets;

  async initialize() {
    const auth = new google.auth.GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
      keyFile: '../../credentials.json',
    });

    // Create client instance for auth
    return await auth.getClient();
  }

  async createInstance() {
    const client = await this.initialize();
    this.googleSheets = google.sheets({ version: 'v4' });
  }
}

// export default GoogleSheet;

// rmer step.
// ;(async () => {
//   const auth = new google.auth.JWT({
//     email: SERVICE_ACCOUNT_EMAIL,
//     key: SERVICE_ACCOUNT_PRIVATE_KEY,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"]
//   })
//   const sheet = google.sheets("v4")
//   await sheet.spreadsheets.values.append({
//     spreadsheetId: SHEET_ID,
//     auth: auth,
//     range: "Sheet1",
//     valueInputOption: "RAW",
//     requestBody: {
//       values: [["hello", "world"]]
//     }
//   })
// })()

// const auth = new google.auth.GoogleAuth({
//   keyFile: "credentials.json",
//   scopes: "https://www.googleapis.com/auth/spreadsheets",
// });

// // Create client instance for auth
// const client = await auth.getClient();

// // Instance of Google Sheets API
// const googleSheets = google.sheets({ version: "v4", auth: client });

// const spreadsheetId = "1J5OesnSTJCgLTTA0hQ_QSk_UPVK1nwRTEkvvRHHrEqM";

// // Get metadata about spreadsheet
// const metaData = await googleSheets.spreadsheets.get({
//   auth,
//   spreadsheetId,
// });

// // Read rows from spreadsheet
// const getRows = await googleSheets.spreadsheets.values.get({
//   auth,
//   spreadsheetId,
//   range: "Sheet1!A:A",
// });

// // Write row(s) to spreadsheet
// await googleSheets.spreadsheets.values.append({
//   auth,
//   spreadsheetId,
//   range: "Sheet1!A:B",
//   valueInputOption: "USER_ENTERED",
//   resource: {
//     values: [[request, name]],
//   },
// });
