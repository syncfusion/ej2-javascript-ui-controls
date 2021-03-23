import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { getFormatFromType, SheetModel, Spreadsheet } from "../../../src/index";
import { GDPData } from "../util/datasource.spec";

/**
 *  Chart spec
 */
 describe('Chart ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('CR-Issues ->', () => {
        beforeAll((done: Function) => {
            let sheet: SheetModel[] = [{
                ranges: [{ dataSource: GDPData }],
                rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Column', range: 'A1:E8' }] }] }],
                columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
            }];
            helper.initializeSpreadsheet({
                sheets: sheet,
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:E1');
                    spreadsheet.numberFormat(getFormatFromType('Currency'), 'B2:E8');
                }
            }, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        describe('I315401 ->', () => {
            it('Charts are deleting only on selection of the value', (done: Function) => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart.style.top).toEqual('20px');
                expect(chart.style.left).toEqual('444px');
                const inst: Spreadsheet = helper.getInstance();
                expect(inst.sheets[0].rows[1].cells[6].chart[0].top).toBe(20);
                expect(inst.sheets[0].rows[1].cells[6].chart[0].left).toBe(444);
                expect(inst.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
                helper.triggerMouseAction(
                    'mousedown', { x: chart.getBoundingClientRect().top + 1, y: chart.getBoundingClientRect().left + 1 },
                    chart, chart);
                helper.triggerMouseAction(
                    'mousemove', { x: chart.getBoundingClientRect().top + 100, y: chart.getBoundingClientRect().left + 100 },
                    chart, chart);
                helper.triggerMouseAction(
                    'mouseup', { x: chart.getBoundingClientRect().top + 100, y: chart.getBoundingClientRect().left + 100 },
                    document, chart);
                expect(inst.sheets[0].rows[1].cells[6].chart.length).toBe(0);
                expect(inst.sheets[0].rows[5].cells[7].chart.length).toBe(1);
                expect(chart.style.top).toEqual('119px');
                expect(chart.style.left).toEqual('543px');
                expect(inst.sheets[0].rows[5].cells[7].chart[0].top).toBe(119);
                expect(inst.sheets[0].rows[5].cells[7].chart[0].left).toBe(543);
                helper.triggerKeyNativeEvent(46);
                expect(inst.sheets[0].rows[5].cells[7].chart.length).toBe(0);
                done();
            });
        });
    });
});