import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, GDPData } from '../util/datasource.spec';
import { CellModel, getFormatFromType, SheetModel, Spreadsheet } from '../../../src/index';
import { Overlay } from '../../../src/spreadsheet/services/index';

/**
 *  Chart test cases
 */
describe('Chart ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            const cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[3];
            const id: string = cell.chart[0].id;
            // expect(JSON.stringify(cell.chart)).toBe('[{"type":"Column","range":"Sheet1!D1:E5","theme":"Material","isSeriesInRows":false,"id":"e_spreadsheet_chart_1","height":290,"width":480,"top":0,"left":192}]'); check this now
            expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).classList).toContain('e-chart');
            (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
            helper.invoke('deleteChart', [cell.chart[0].id]);
            expect(JSON.stringify(cell.chart)).toBe('[]');
            expect(helper.getElementFromSpreadsheet('#' + id)).toBeNull();
            done();
        });
    });

    describe('CR-Issues ->', () => {
        describe('I315401, I281820 ->', () => {
            beforeEach((done: Function) => {
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
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Charts are deleting only on selection of the value', (done: Function) => {
            //     const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            //     expect(chart.style.top).toEqual('20px');
            //     expect(chart.style.left).toEqual('444px');
            //     const inst: Spreadsheet = helper.getInstance();
            //     inst.element.focus();
            //     expect(inst.sheets[0].rows[1].cells[6].chart[0].top).toBe(20);
            //     expect(inst.sheets[0].rows[1].cells[6].chart[0].left).toBe(444);
            //     expect(inst.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
            //     helper.triggerMouseAction(
            //         'mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 },
            //         chart, chart);
            //     helper.triggerMouseAction(
            //         'mousemove', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
            //         chart, chart);
            //     helper.triggerMouseAction(
            //         'mouseup', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
            //         document, chart);
            //     (inst.serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
            //     expect(inst.sheets[0].rows[1].cells[6].chart.length).toBe(0);
            //     expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(1);
            //     expect(chart.style.top).toEqual('233px');
            //     expect(chart.style.left).toEqual('643px');
            //     expect(inst.sheets[0].rows[11].cells[9].chart[0].top).toBe(233);
            //     expect(inst.sheets[0].rows[11].cells[9].chart[0].left).toBe(643);
            //     helper.triggerKeyNativeEvent(46);
            //     expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(0);
            //     done();
            // });
        });
    });
});