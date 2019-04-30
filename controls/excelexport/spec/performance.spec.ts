// import { Workbook } from './../src/workbook';

// describe('Performance', () => {
//     afterEach(function () {
//         sleep(3000);
//     });
//     function sleep(millSecs: any) {
//         let date: any = new Date();
//         let curDate: any = null;
//         do { curDate = new Date(); }
//         while (curDate - date < millSecs);
//     }
//     //Methods testcase
//     it('number-500Rows-100Columns', (done) => {
//         let json: any = (getJson(500, 100, 'number'));
//         console.log((new Date()).toUTCString());
//         let book: Workbook = new Workbook(json);
//         book.save('number-500Rows-100Columns.xlsx');
//         console.log((new Date()).toUTCString());
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 50);
//     });
//     //Methods testcase
//     it('number-1000Rows-100Columns', (done) => {
//         let json: any = (getJson(1000, 100, 'number'));
//         console.log((new Date()).toUTCString());
//         let book: Workbook = new Workbook(json);
//         book.save('number-1000Rows-100Columns.xlsx');
//         console.log((new Date()).toUTCString());
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 50);
//     });
//     //Methods testcase
//     it('text-500Rows-100Columns', (done) => {
//         let json: any = (getJson(500, 100, 'string'));
//         console.log((new Date()).toUTCString());
//         let book: Workbook = new Workbook(json);
//         book.save('text-500Rows-100Columns.xlsx');
//         console.log((new Date()).toUTCString());
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 50);
//     });
//     //Methods testcase
//     it('date-500Rows-100Columns', (done) => {
//         let json: any = (getJson(500, 100, 'date'));
//         console.log((new Date()).toUTCString());
//         let book: Workbook = new Workbook(json);
//         book.save('date-500Rows-100Columns.xlsx');
//         console.log((new Date()).toUTCString());
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 50);
//     });
//     function getJson(row: number, column: number, type: string): any {
//         let cells: any = []; // [{ value: 10 }, { value: 10 }, { value: 10 }]
//         let _rows: any = [];
//         let _worksheets: any = [];
//         let book: any = [];
//         for (let c: number = 0; c < column; c++) {
//             switch (type) {
//                 case 'number':
//                     cells.push({ value: 10 });
//                     break;
//                 case 'text':
//                     cells.push({ value: 'row' + 0 + 'col' + c });
//                     break;
//                 case 'date':
//                     cells.push({ value: new Date() });
//                     break;
//             }

//         }
//         for (let r: number = 0; r < row; r++) {
//             _rows.push({ cells });
//         }
//         _worksheets.push({ rows: _rows });
//         book.push({ worksheets: _worksheets });
//         return { worksheets: _worksheets };
//     }
// });