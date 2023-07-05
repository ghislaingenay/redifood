// // import { UserPayload } from '../../redifood-module/src/interfaces';

// // import { authenticate } from '@google-cloud/local-auth';

// import { BadRequestException, HttpStatus } from '@nestjs/common';
// import { JWT } from 'google-auth-library';
// import {
//   EPaymentType,
//   IGetServerSideData,
// } from '../../redifood-module/src/interfaces';
// import { google } from 'googleapis';

// interface IOrderHeaders {
//   column: string;
//   headerColumn: string;
//   apiKey: string;
//   dbKey: string;
// }

// export interface IOrderData {
//   orderNo: string;
//   orderTotal: number;
//   orderTableNumber: number;
//   orderFinished: string | Date;
//   paymentType: EPaymentType;
//   paymentAmount: number;
// }

// // import { google } from 'googleapis';
// class GoogleSheetService {
//   private spreadsheetId = '1copNXVPX-bt-3bOlyfGMekr2JoA57iJdiX8FO01RL9o';
//   private googleSheets: sheets_v4.Sheets;
//   private auth!: JWT;

//   private headers: IOrderHeaders[] = [
//     {
//       column: 'A',
//       headerColumn: 'Order No',
//       apiKey: 'orderNo',
//       dbKey: 'order_no',
//     },
//     {
//       column: 'B',
//       headerColumn: 'Order Total',
//       apiKey: 'orderTotal',
//       dbKey: 'order_total',
//     },
//     {
//       column: 'C',
//       headerColumn: 'Table Number',
//       apiKey: 'orderTableNumber',
//       dbKey: 'order_table_number',
//     },
//     {
//       column: 'D',
//       headerColumn: 'order completed',
//       apiKey: 'orderFinished',
//       dbKey: 'order_finished',
//     },
//     {
//       column: 'E',
//       headerColumn: 'Payment type',
//       apiKey: 'paymentType',
//       dbKey: 'payment_type',
//     },
//     {
//       column: 'F',
//       headerColumn: 'Payment amount',
//       apiKey: 'paymentAmount',
//       dbKey: 'payment_amount',
//     },
//   ];

//   async authorize() {
//     if (this.auth === null) {
//       throw new BadRequestException('Auth is null');
//     }
//   }

//   async initialize() {
//     this.auth = new google.auth.JWT({
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//       email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//       key: process.env.GOOGLE_PRIVATE_KEY,
//     });
//   }

//   async createInstance() {
//     await this.initialize();
//     this.googleSheets = google.sheets({ version: 'v4' });
//   }

//   async getSheetData() {
//     await this.createInstance();
//     const response = await this.googleSheets.spreadsheets.values.get({
//       auth: this.auth,
//       spreadsheetId: this.spreadsheetId,
//       range: 'Sheet1',
//     });
//     return response.data;
//   }

//   async getData(data: IOrderHeaders['apiKey']) {
//     const response = await this.getSheetData();
//     const { values } = response;
//     const header = values?.shift();
//     const index = header?.findIndex((item) => item === data);
//     const dataResponse = values?.map((item) => item[index as number]);
//     return dataResponse;
//   }

//   async createRow(data: IOrderData): Promise<IGetServerSideData<any>> {
//     const orderArray = this.headers.map((item) => item.apiKey);
//     const orderData = orderArray.map((item) => data[item]);
//     try {
//       await this.googleSheets.spreadsheets.values.append({
//         auth: this.auth,
//         spreadsheetId: this.spreadsheetId,
//         range: 'Feuille 1',
//         valueInputOption: 'USER_ENTERED', // USER_ENTERED OR RAW
//         requestBody: {
//           values: [orderData],
//         },
//       });
//       return { statusCode: HttpStatus.OK, message: 'Row created' };
//     } catch (err) {
//       throw new BadRequestException('Impossible to create row');
//     }
//   }
// }

// export default GoogleSheetService;
export {};
