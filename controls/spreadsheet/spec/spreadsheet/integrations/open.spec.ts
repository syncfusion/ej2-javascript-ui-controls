import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Open & Save ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
                saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save', sheets: [{ ranges: [{ dataSource: defaultData }] }],
                beforeSave: (args: any) => { args.isFullPost = false }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Open', (done: Function) => {
            fetch('http://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx').then((response) => {
                response.blob().then((data: Blob) => {
                    const file: File = new File([data], "Sample.xlsx");
                    helper.invoke('open', [{ file: file }]);
                    setTimeout(() => { // check this now
                        // expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"isLocked":true,"style":{"fontWeight":"Bold","textAlign":"Center","verticalAlign":"Middle"},"value":"Customer Name"}');
                        // expect(JSON.stringify(helper.getInstance().sheets[0].rows[30].cells[5])).toBe('{"format":"$#,##0.00","formula":"=SUM(F2:F30)","isLocked":true,"style":{"fontWeight":"Bold"},"value":"282501.5"}');
                        // expect(helper.getInstance().sheets[0].columns[0].width).toBe(180);
                        // expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Model');
                        done();
                    }, 1500);
                });
            });
        });

        // it('Save', (done: Function) => {
        //     helper.invoke('save', []);
        //     setTimeout(()=>{
        //         // Need to check how to write test case for this case
        //         done();
        //     }, 3000);
        // });

        it('Open & Save from JSON', (done: Function) => {
            // helper.edit('A1', 'Test'); Check this now
            // helper.invoke('saveAsJson').then((response: any) => {
            //     expect(response.jsonObject.Workbook.sheets[0].rows[0].cells[0].value).toBe('Test');
            //     helper.invoke('openFromJson', [{ file: response.jsonObject }]);
            //     setTimeout(() => {
            //         expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test');
                     done();
            //     });
            // });
        });
    });

    describe('UI Interaction ->', () => {

    });
});