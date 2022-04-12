import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, SheetModel } from '../../../src/index';

describe('Undo redo ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('CR Issues ->', () => {
        describe('SF-359671,SF-356044,SF-361047 -> actionBegin and actionComplete event', () => {
            let spreadsheet: Spreadsheet; let action: string; let isTriggered: boolean; let cancel: boolean;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{ ranges: [{ dataSource: defaultData }] }]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('cell edit', (done: Function) => {
                spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args): void => {
                    if (cancel) {
                        args.args.eventArgs.cancel = true;
                    }
                    if (action === 'undo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.args.eventArgs.value).toBe('20');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.args.eventArgs.value).toBe('20');
                    }
                    isTriggered = true;
                };
                spreadsheet.actionComplete = (args): void => {
                    if (action === 'undo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.isUndoRedo).toBeTruthy();
                        expect(args.eventArgs.value).toBe('20');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellSave');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.isUndoRedo).toBeTruthy();
                        expect(args.eventArgs.value).toBe('20');
                    }
                };
                helper.edit('D2', '20');
                setTimeout((): void => {
                    action = 'undo';
                    helper.click('#spreadsheet_undo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(10);
                    action = 'redo';
                    helper.click('#spreadsheet_redo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    isTriggered = false;
                    helper.invoke('undo');
                    expect(isTriggered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(10);
                    helper.invoke('redo');
                    expect(isTriggered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    cancel = true;
                    action = '';
                    helper.click('#spreadsheet_undo');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                    expect(helper.getElement('#spreadsheet_undo').disabled).toBeFalsy();
                    expect(helper.getElement('#spreadsheet_redo').disabled).toBeFalsy();
                    cancel = false;
                    done();
                });
            });
            it('cell delete', (done: Function) => {
                spreadsheet.actionBegin = (args): void => {
                    if (cancel) {
                        args.args.eventArgs.cancel = true;
                    }
                    if (action === 'undo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.args.eventArgs.address).toBe('Sheet1!D2:D2');
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeFalsy();
                    }
                    isTriggered = true;
                };
                spreadsheet.actionComplete = (args): void => {
                    if (action === 'undo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeTruthy();
                        expect(args.isUndoRedo).toBeTruthy();
                    }
                    if (action === 'redo') {
                        expect(args.action).toBe('cellDelete');
                        expect(args.isUndo).toBeFalsy();
                        expect(args.isUndoRedo).toBeTruthy();
                    }
                };
                helper.triggerKeyNativeEvent(46);
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBeUndefined();
                action = 'undo';
                helper.click('#spreadsheet_undo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                action = 'redo';
                helper.click('#spreadsheet_redo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBeUndefined();
                isTriggered = false;
                helper.invoke('undo');
                expect(isTriggered).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBe(20);
                helper.invoke('redo');
                expect(isTriggered).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBeUndefined();
                cancel = true;
                action = '';
                helper.click('#spreadsheet_undo');
                expect(spreadsheet.sheets[0].rows[1].cells[3].value as any).toBeUndefined();
                expect(helper.getElement('#spreadsheet_undo').disabled).toBeFalsy();
                expect(helper.getElement('#spreadsheet_redo').disabled).toBeFalsy();
                cancel = false;
                done();
            });
        });
    });
    describe('SF-362962', () => {
        let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A3' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Invalid expression throws While delete row and apply undo for formula applied rows', (done: Function) => {
            sheet = helper.getInstance().sheets[0];
            helper.invoke('updateCell', [{ formula: '=IF(I3="","empty","not empty")' }, 'Sheet1!J3']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(2, 0, [7], true);
            setTimeout((): void => {
                expect(sheet.rows[2].cells[9]).toBeUndefined();
                expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('');
                helper.getElement('#spreadsheet_undo').click();
                setTimeout((): void => {
                    expect(sheet.rows[2].cells[9].formula).toEqual('=IF(I3="","empty","not empty")');
                    expect(sheet.rows[2].cells[9].value).toEqual('empty');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('empty');
                    done();
                });
            });
        });
        it('Invalid expression throws while delete column and apply undo for formula applied columns', (done: Function) => {
            helper.openAndClickCMenuItem(0, 9, [7], false, true);
            setTimeout((): void => {
                expect(sheet.rows[2].cells[9]).toBeUndefined();
                expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('');
                helper.getElement('#spreadsheet_undo').click();
                setTimeout((): void => {
                    expect(sheet.rows[2].cells[9].formula).toEqual('=IF(I3="","empty","not empty")');
                    expect(sheet.rows[2].cells[9].value).toEqual('empty');
                    expect(helper.invoke('getCell', [2, 9]).textContent).toEqual('empty');
                    done();
                });
            });
        });
    });
});