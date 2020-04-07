import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel } from '../../../src';

Spreadsheet.Inject(BasicModule);

/**
 *  Context menu spec
 */

describe('Spreadsheet context menu module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI interaction checking ->', () => {

        describe('Content context menu checking ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [
                        {
                            ranges: [{ dataSource: defaultData }]
                        }
                    ],
                    beforeDataBound: (): void => {
                        let spreadsheet: Spreadsheet = helper.getInstance();
                        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Sheet1') {
                            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                        }
                    },
                };
                helper.initializeSpreadsheet(model, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Cut checking', (done: Function) => {
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li');
                    setTimeout(() => {
                        let clipboardModule: any = helper.getModel('clipboardModule');
                        expect(clipboardModule.copiedInfo.isCut).toBeTruthy();
                        expect(clipboardModule.copiedInfo.range[0]).toBe(0);
                        expect(clipboardModule.copiedInfo.range[1]).toBe(0);
                        helper.invoke('selectRange', ['K1']);
                        helper.triggerKeyNativeEvent(86, true);
                        helper.invoke('getData', ['Sheet1!K1']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K1').value).toEqual('Item Name');
                            expect(values.get('K1').style.fontWeight).toEqual('bold');
                            expect(values.get('K1').style.textAlign).toEqual('center');
                            done();
                        });
                    }, 10);
                }, 10);
            });

            it('Copy checking', (done: Function) => {
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 10]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                    setTimeout(() => {
                        let clipboardModule: any = helper.getModel('clipboardModule');
                        expect(clipboardModule.copiedInfo.isCut).toBeFalsy();
                        expect(clipboardModule.copiedInfo.range[0]).toBe(0);
                        expect(clipboardModule.copiedInfo.range[1]).toBe(10);
                        helper.invoke('selectRange', ['K2']);
                        helper.triggerKeyNativeEvent(86, true);
                        helper.invoke('getData', ['Sheet1!K2']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K2').value).toEqual('Item Name');
                            expect(values.get('K2').style.fontWeight).toEqual('bold');
                            expect(values.get('K2').style.textAlign).toEqual('center');
                            done();
                        });
                    }, 10);
                }, 10);
            });

            it('Paste checking', (done: Function) => {
                helper.invoke('selectRange', ['K3']);
                let td: HTMLTableCellElement = helper.invoke('getCell', [2, 10]);
                let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
                    setTimeout(() => {
                        helper.invoke('getData', ['Sheet1!K3']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K3').value).toEqual('Item Name');
                            expect(values.get('K3').style.fontWeight).toEqual('bold');
                            expect(values.get('K3').style.textAlign).toEqual('center');
                            done();
                        });
                    }, 10);
                }, 10);
            });

            it('Paste special -> values checking', (done: Function) => {
                helper.invoke('selectRange', ['K4']);
                let cElem: HTMLTableCellElement = helper.invoke('getCell', [3, 10]);
                let coords: DOMRect = <DOMRect>cElem.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cElem);
                setTimeout(() => {
                    cElem = helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)');
                    coords = <DOMRect>cElem.getBoundingClientRect();
                    helper.triggerMouseAction('mouseover', { x: coords.x, y: coords.y }, cElem.parentElement.parentElement, cElem);
                    setTimeout(() => {
                        helper.click('.e-spreadsheet-contextmenu .e-ul li');
                        helper.invoke('getData', ['Sheet1!K4']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K4').value).toEqual('Item Name');
                            expect(values.get('K4').style).toBeUndefined();
                            done();
                        });
                    }, 10);
                }, 10);
            });

            it('Paste special -> formats checking', (done: Function) => {
                helper.invoke('selectRange', ['K5']);
                let cElem: HTMLTableCellElement = helper.invoke('getCell', [4, 10]);
                let coords: DOMRect = <DOMRect>cElem.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, cElem);
                setTimeout(() => {
                    cElem = helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)');
                    coords = <DOMRect>cElem.getBoundingClientRect();
                    helper.triggerMouseAction('mouseover', { x: coords.x, y: coords.y }, cElem.parentElement.parentElement, cElem);
                    setTimeout(() => {
                        helper.click('.e-spreadsheet-contextmenu .e-ul li:nth-child(2)');
                        helper.invoke('getData', ['Sheet1!K5']).then((values: Map<string, CellModel>) => {
                            expect(values.get('K5').style.fontWeight).toEqual('bold');
                            expect(values.get('K5').style.textAlign).toEqual('center');
                            done();
                        }, 10);
                    }, 10);
                }, 10);
            });

        });

    });

});