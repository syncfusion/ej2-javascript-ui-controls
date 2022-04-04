import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from "../../../src/index";

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
    describe('EJ2-57002', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Invalid expression throws While delete and apply undo for formula applied rows', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.updateCell({ formula: '=IF(I1="","empty","not empty")' }, "Sheet1!J1");
            const cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-rowhdr-table') as HTMLTableElement).rows[1].cells[0];
            helper.triggerMouseAction(
                'contextmenu', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null,
                cell);
            setTimeout((): void => {
                document.getElementById("spreadsheet_cmenu_delete_row").click();
                setTimeout((): void => {
                    helper.getElement('#spreadsheet_undo').click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[0].cells[9].value).toEqual('empty');
                        done();
                    });
                });
            });
        });
    });
});