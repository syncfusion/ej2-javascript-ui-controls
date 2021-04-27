import { Spreadsheet, SpreadsheetModel } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';

/**
 *  Clipboard test cases
 */
describe('Clipboard ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('CR-Issues ->', () => {
        describe('F163240, FB23869 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Paste behaviour erroneous after cut', (done: Function) => {
                helper.invoke('selectRange', ['A1:D5']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toEqual('Item Name');
                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('15');
                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Formal Shoes');
                expect(spreadsheet.sheets[0].rows[2].cells[2].value).toEqual('0.2475925925925926');
                setTimeout((): void => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('selectRange', ['A2']);
                        setTimeout((): void => {
                            helper.invoke('paste', ['Sheet1!A2:A2']);
                            setTimeout((): void => {
                                expect(spreadsheet.sheets[0].rows[0].cells[0]).toBeNull();
                                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('');
                                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('20');
                                expect(helper.invoke('getCell', [4, 3]).textContent).toEqual('20');
                                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Sports Shoes');
                                expect(helper.invoke('getCell', [3, 0]).textContent).toEqual('Sports Shoes');
                                expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toEqual('0.4823148148148148');
                                done();
                            });
                        });
                    });
                });
            });

            it('Paste values only for formula is not working', (done: Function) => {
                helper.edit('I1', '=SUM(F2:F8)');
                helper.invoke('copy', ['I1']).then(() => {
                    helper.invoke('paste', ['I2', 'Values']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 8]).textContent).toBe('2700');
                        expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBe('');
                        done();
                    });
                });
            });
        });
        describe('F162960 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: '100' }, { value: '25' }, { value: '1001' }] }, { cells: [{ value: '100' },
                    { value: '25' }, { value: '1001' }] }], selectedRange: 'A1:B2' }],
                    created: (): void => helper.getInstance().setRowHeight(45)
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Row height not persistent after cut/paste', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                expect(spreadsheet.sheets[0].rows[3]).toBeUndefined();
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['Sheet1!A4:A4']);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                            expect(helper.invoke('getRow', [0, 0]).style.height).toEqual('45px');
                            expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toEqual('100');
                            done();
                        });
                    });
                });
            });
        });
        describe('I299870, I298549, I296802 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'Value' }] }], selectedRange: 'A1' }],
                    cellSave: (): void => {
                        (helper.getInstance() as Spreadsheet).insertRow([{ index: 1, cells: [{ value: 'Added' }] }]);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Trigger the cellSave event for paste action and while insertRow inn actionComplete script error throws', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[4].cells[0].value).toEqual('Value');
                            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('Added');
                            done();
                        });
                    });
                });
            });
        });
        describe('I301708 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'C2' }],
                    created: (): void => {
                        (helper.getInstance() as Spreadsheet).setBorder({ border: '1px solid #000' }, 'C2');
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Border copy paste issue (copy the border and paste it in adjacent cells, border removed)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let dataSourceChangedFunction: () => void = jasmine.createSpy('dataSourceChanged');
                spreadsheet.dataSourceChanged = dataSourceChangedFunction;
                spreadsheet.dataBind();
                expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [0, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['B2']);
                    setTimeout((): void => {
                        helper.invoke('paste');
                        setTimeout((): void => {
                            //expect(dataSourceChangedFunction).toHaveBeenCalled();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.border).toBeUndefined();
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderLeft).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderTop).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderRight).toEqual('1px solid #000');
                            expect(spreadsheet.sheets[0].rows[1].cells[1].style.borderBottom).toEqual('1px solid #000');
                            expect(helper.invoke('getCell', [1, 0]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [0, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 1]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderRight).toEqual('1px solid rgb(0, 0, 0)');
                            expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toEqual('1px solid rgb(0, 0, 0)');
                            done();
                        });
                    });
                });
            });
        });
    });
});