import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, GDPData } from '../util/datasource.spec';
import { CellModel, getFormatFromType, SheetModel, Spreadsheet } from '../../../src/index';
import { Overlay } from '../../../src/spreadsheet/services/index';
import { getComponent } from '@syncfusion/ej2-base';

/**
 *  Chart test cases
 */
describe('Chart ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        let cell: CellModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            cell = helper.getInstance().sheets[0].rows[0].cells[3];
            // expect(JSON.stringify(cell.chart)).toBe('[{"type":"Column","range":"Sheet1!D1:E5","theme":"Material","isSeriesInRows":false,"id":"e_spreadsheet_chart_1","height":290,"width":480,"top":0,"left":192}]'); check this now
            expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).classList).toContain('e-chart');
            done();
        });
        it('Apply freezepane with chart', (done: Function) => {
            helper.invoke('freezePanes', [3, 2]);
            setTimeout((): void => {
                expect(helper.getElementFromSpreadsheet('#' + cell.chart[0].id).parentElement.parentElement.classList).toContain('e-sheet');
                done();
            });
        });
        it('Delete', (done: Function) => {
            const id: string = cell.chart[0].id;
            (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
            helper.invoke('deleteChart', [id]);
            expect(JSON.stringify(cell.chart)).toBe('[]');
            expect(helper.getElementFromSpreadsheet('#' + id)).toBeNull();
            done();
        });
    });

    describe('CR-Issues ->', () => {
        // describe('I315401, I281820 ->', () => {
        //     beforeEach((done: Function) => {
        //         let sheet: SheetModel[] = [{
        //             ranges: [{ dataSource: GDPData }],
        //             rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Column', range: 'A1:E8' }] }] }],
        //             columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }]
        //         }];
        //         helper.initializeSpreadsheet({
        //             sheets: sheet,
        //             created: (): void => {
        //                 const spreadsheet: Spreadsheet = helper.getInstance();
        //                 spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:E1');
        //                 spreadsheet.numberFormat(getFormatFromType('Currency'), 'B2:E8');
        //             }
        //         }, done);
        //     });
        //     afterEach(() => {
        //         helper.invoke('destroy');
        //     });
        //     it('Charts are deleting only on selection of the value', (done: Function) => {
        //         const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
        //         expect(chart.style.top).toEqual('20px');
        //         expect(chart.style.left).toEqual('444px');
        //         const inst: Spreadsheet = helper.getInstance();
        //         inst.element.focus();
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].top).toBe(20);
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].left).toBe(444);
        //         expect(inst.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
        //         helper.triggerMouseAction(
        //             'mousedown', { x: chart.getBoundingClientRect().left + 1, y: chart.getBoundingClientRect().top + 1 },
        //             chart, chart);
        //         helper.triggerMouseAction(
        //             'mousemove', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
        //             chart, chart);
        //         helper.triggerMouseAction(
        //             'mouseup', { x: chart.getBoundingClientRect().left + 200, y: chart.getBoundingClientRect().top + 100 },
        //             document, chart);
        //         (inst.serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in chart.
        //         expect(inst.sheets[0].rows[1].cells[6].chart.length).toBe(0);
        //         expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(1);
        //         expect(chart.style.top).toEqual('233px');
        //         expect(chart.style.left).toEqual('643px');
        //         expect(inst.sheets[0].rows[11].cells[9].chart[0].top).toBe(233);
        //         expect(inst.sheets[0].rows[11].cells[9].chart[0].left).toBe(643);
        //         helper.triggerKeyNativeEvent(46);
        //         expect(inst.sheets[0].rows[11].cells[9].chart.length).toBe(0);
        //         done();
        //     });
        // });
        describe('Chart actions->', () => {
            beforeAll((done: Function) => {
                let model: SheetModel[] = [{ ranges: [{ dataSource: GDPData }],
                    rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Pie', range: 'A1:E8' }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] },
                    { rows: [{ cells: [{ chart: [{ type: 'Column', theme: 'Material',
                    isSeriesInRows: false, range: 'Sheet1!A1:C3', height: 290, width: 480, top: 5, left: 10 }] }] }] }];
                helper.initializeSpreadsheet({
                    sheets: model,
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:E1');
                    }
                },done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-50430 -> Aggregate value wrongly displayed in chart Sample', (done: Function) => {
                helper.invoke('selectRange', ['B2:E8']);
                expect(helper.getInstance().sheets[0].selectedRange).toEqual('B2:E8');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 28');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(1)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 28');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 197.61');
                done();
            });
            it('Chart data not refreshed after merge action', (done: Function) => {
                const chartObj: any = getComponent(helper.getElementFromSpreadsheet('.e-accumulationchart'), 'accumulationchart');
                expect(chartObj.series[0].dataSource[5].y).toBe(2.9);
                expect(chartObj.series[0].dataSource[6].y).toBe(2.4);
                expect(chartObj.series[1].dataSource[4].y).toBe(2.85);
                expect(chartObj.series[1].dataSource[5].y).toBe(2.94);
                expect(chartObj.series[1].dataSource[6].y).toBe(2.93);
                helper.invoke('merge', ['B6:C10']);
                expect(chartObj.series[0].dataSource[5].y).toBe(0);
                expect(chartObj.series[0].dataSource[6].y).toBe(0);
                expect(chartObj.series[1].dataSource[4].y).toBe(0);
                expect(chartObj.series[1].dataSource[5].y).toBe(0);
                expect(chartObj.series[1].dataSource[6].y).toBe(0);
                done();
            });
            it('ej2-react-ui-components/issues/79 -> Charts are not loaded if data range is not from active sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.activeSheetIndex = 1;
                spreadsheet.dataBind();
                setTimeout((): void => {
                    const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                    expect(chart).not.toBeNull();
                    expect(chart.style.top).toEqual('5px');
                    expect(chart.style.left).toEqual('10px');
                    expect(spreadsheet.sheets[1].rows[0].cells[0].chart[0].range).toEqual('Sheet1!A1:C3');
                    done();
                });
            });
        });
        describe('Dependent use cases->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ index: 1, cells: [{ index: 6, chart: [{ type: 'Pie', range: 'A1:E8' }] }] }],
                    columns: [{ width: 80 }, { width: 75 }, { width: 75 }, { width: 75 }, { width: 75 }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Sheet rename update on chart range', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet1!A1:E8');
                helper.triggerMouseAction(
                    'dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'),
                    helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                editorElem.click();
                editorElem.value = 'Sheet11';
                helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
                expect(spreadsheet.sheets[0].rows[1].cells[6].chart[0].range).toEqual('Sheet11!A1:E8');
                done();
            });
        });
    });
});