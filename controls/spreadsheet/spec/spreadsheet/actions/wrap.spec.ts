import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { getCell, getRowHeight, SheetModel, Spreadsheet } from '../../../src/index';

describe('Wrap ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.getInstance().wrap('C2');
            let td: Element = helper.invoke('getCell', [1, 2]);
            expect(td.classList).toContain('e-wraptext');
            // expect(td.parentElement.style.height).toBe('38px'); check this now
            helper.edit('C2', '12 23 34 45 56 67 78'); // After Editing
            // expect(td.parentElement.style.height).toBe('56px'); check this now
            helper.invoke('cellFormat', [{ fontSize: '22pt' }, 'C2']); // After increasing font size
            // expect(td.parentElement.style.height).toBe('254px'); check this now
            helper.invoke('cellFormat', [{ fontFamily: 'Arial Black' }, 'C2']); // After changing font family
            // expect(td.parentElement.style.height).toBe('295px'); check this now
            helper.edit('C2', '12 23 3'); // After Editing by decreasing font length
            // expect(td.parentElement.style.height).toBe('128px'); - This case failed only in jenkin CI machine
            helper.invoke('cellFormat', [{ fontSize: '11pt' }, 'C2']); // After decreasing font size
            // expect(td.parentElement.style.height).toBe('22px'); - This case need to be fixed
            done();
        });
    });


    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.click('#spreadsheet_wrap');
            let td: Element = helper.invoke('getCell', [3, 0]);
            expect(td.classList).toContain('e-wraptext');
            expect(td.parentElement.style.height).toBe('38px');
            done();
        });

        // it('Alt Enter', (done: Function) => { Need to handle this case
        //     helper.invoke('selectRange', ['D5']);
        //     helper.edit('D5', 'abcdefgh\nijkl\nmnopqrs');
        //     let td: Element = helper.invoke('getCell', [4, 3]);
        //     expect(td.classList).toContain('e-wraptext');
        //     expect(td.parentElement.style.height).toBe('56px');
        //     done();
        // });
    });
    describe('CR-Issues ->', () => {
        describe('I316931, I31444 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ wrap: true }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('UpdateCell method is not working in wrap cell after calling setRowHeight', (done: Function) => {
                helper.invoke('setRowHeight', [55]);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toBe(55);
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBeUndefined();
                expect( helper.invoke('getRow', [0]).style.height).toBe('55px');
                helper.invoke('updateCell', [{ value: 'Welcome to Spreadsheet!!!' }]);
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Welcome to Spreadsheet!!!');
                expect(spreadsheet.sheets[0].rows[0].height).toBe(55);
                expect(helper.invoke('getRow', [0]).style.height).toBe('55px');
                done();
            });
        });
        describe('fb23856, FB23947, FB23948 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'A1:B2' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Size of cell is increased for merge - top left allignment', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.getElement('#' + helper.id + '_merge').click();
                helper.getElement('#' + helper.id + '_wrap').click();
                expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                helper.invoke('startEdit');
                (spreadsheet as any).editModule.editCellData.value = 'text\ntext';
                helper.getElement('#' + helper.id + '_edit').textContent = 'text\ntext';
                helper.triggerKeyNativeEvent(13);
                expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                helper.invoke('selectRange', ['A1:B2']);
                helper.invoke('startEdit');
                (spreadsheet as any).editModule.editCellData.value = 'text\n\ntext';
                helper.getElement('#' + helper.id + '_edit').textContent = 'text\n\ntext';
                helper.triggerKeyNativeEvent(13);
                expect(getRowHeight(helper.getInstance().sheets[0], 0)).toBe(20);
                expect(spreadsheet.sheets[0].rows[1].height).toBeUndefined();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-wrap-content').textContent).toBe('text\n\ntext');
                done();
            });

            it('Wrapping on merge cell increases row height', (done: Function) => {
                helper.invoke('selectRange', ['A3:B4']);
                helper.getElement('#' + helper.id + '_merge').click();
                helper.getElement('#' + helper.id + '_wrap').click();
                helper.edit('A3', 'Wrapping on merge cell increases row height');
                expect(getRowHeight(helper.getInstance().sheets[0], 2)).toBe(20);
                expect(helper.invoke('getCell', [2, 0]).parentElement.style.height).toBe('20px');
                expect(helper.invoke('getCell', [2, 0]).querySelector('.e-wrap-content').textContent).toBe('Wrapping on merge cell increases row height');
                done();
            });

            it('Deleting wrap cell does not changes row height', (done: Function) => {
                helper.invoke('updateCell', [{ wrap: true, value: 'Deleting wrap cell does not changes row height' }, 'C1']);
                setTimeout(() => {
                    // expect(parseInt(helper.invoke('getCell', [0, 2]).parentElement.style.height)).toBeGreaterThan(105); // Fails only on CI
                    helper.invoke('selectRange', ['C1']);
                    helper.triggerKeyEvent('keydown', 46);
                    // expect(helper.getInstance().sheets[0].rows[0].height).toBe(20); // Fails only on CI
                    expect(helper.invoke('getCell', [0, 2]).parentElement.style.height).toBe('20px');
                    done();
                });
            });
        });

        describe('I328361 ->', ()=>{
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: [{
                    "code": "SR-046605",
                    "shortDesc": "Richiesta dell’autorizzazione di SH della parte passiva (antenne e cavi RF) verso TIM",
                    "fkOperativeSite": 987044,
                    "notes": "05/01/2018: inviato  assenso \n19/12/2017 Sblocco condivisioni siti A 2a tranche (mail Moretti-Maratea-Catenaro)\n05/07/2017: TIM OK  verifica disponibilità\n",
                    "KeyField1": "Valore1",
                    "KeyField2": "Valore6",
                    "KeyField3": "Valore9",
                    "KeyField4": "Valore13",
                    "KeyField5": "Valore17",
                    "KeyField6": "Valore21",
                    "_rownum": 1,
                    "_ID": 3936951
                }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
    
            it('Resize row issue when datasource contains \n', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[1].cells[3].wrap).toBeTruthy();
                helper.getInstance().resizeModule.setRowHeight(1,1, '170px', '147px');
                expect(helper.invoke('getCell', [1,3]).children[0].classList).toContain('e-wrap-content');
                expect(getComputedStyle(helper.invoke('getCell', [1,3]).children[0]).lineHeight).toBe('normal');
                expect(helper.invoke('getCell', [1,1]).parentElement.offsetHeight).toBe(170);
                done();
            });
        });
        describe('EJ2-50347', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A2:B2' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Underline and Strikethrough options are removed if we perform wrap text option', (done: Function) => {
                helper.getElement('#' + helper.id + '_merge').click();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-footer-content button:nth-child(1)');
                setTimeout(() => {
                    helper.edit('A2', 'Wrapping on merge cell increases row height');
                    helper.getElement('#' + helper.id + '_line-through').click();
                    helper.getElement('#' + helper.id + '_underline').click();
                    setTimeout(() => {
                    helper.getElement('#' + helper.id + '_wrap').click();
                    expect(helper.invoke('getCell', [1, 0]).querySelector('.e-wrap-content').textContent).toBe('Wrapping on merge cell increases row height');
                    expect(helper.getInstance().sheets[0].rows[1].cells[0].style.textDecoration).toBe('underline line-through');
                    done();
                    });
                });
            });
        });
        describe('EJ2-50915->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Sheet is loading for long when switch the sheet', (done: Function) => {
                helper.click('.e-add-sheet-tab');
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().sheets.length).toBe(2);
                setTimeout(() => {
                    helper.edit('D5', ('123456789'));
                    helper.edit('D6', ('4353563773'));
                    helper.edit('D7', ('2612'));
                    helper.invoke('selectRange', ['D5:D7']);
                    setTimeout(() => {
                        helper.getElement('#' + helper.id + '_number_format').click();
                        helper.getElement('#' + helper.id + '_number_format-popup .e-item:nth-child(11)').click();
                        setTimeout(() => {
                            helper.getElement('#' + helper.id + '_wrap').click();
                            setTimeout(() => {
                                helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[0].click();
                                setTimeout(() => {
                                    helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1].click();
                                    setTimeout(() => {
                                        expect(helper.getInstance().sheets[1].selectedRange).toBe('D5:D7');
                                        expect(helper.getInstance().sheets[1].rows[4].cells[3].wrap).toBeTruthy();
                                        expect(helper.getInstance().sheets[1].rows[5].cells[3].wrap).toBeTruthy();
                                        expect(helper.getInstance().sheets[1].rows[6].cells[3].wrap).toBeTruthy();
                                        done();
                                    }, 10);
                                }, 10);
                            }, 10);
                        }, 10);
                    });
                });
            });
        });
        describe('EJ2-53337->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ selectedRange: 'B2' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('selection issue with wrap applied cell in Spreadsheet->', (done: Function) => {
                helper.edit('B2', ('selection issue with wrap applied cell in Spreadsheet'));
                helper.getElement('#' + helper.id + '_wrap').click();
                expect(helper.getInstance().sheets[0].rows[1].height).toBe(147);
                setTimeout(function () {
                    helper.invoke('setColWidth', [44, 1]);
                    expect(helper.invoke('getCell', [1, 1]).querySelector('.e-wrap-content').textContent).toBe('selection issue with wrap applied cell in Spreadsheet');
                    expect(helper.getInstance().sheets[0].rows[1].height).toBe(147);
                    expect(helper.getInstance().sheets[0].columns[1].width).toBe(44);
                    helper.triggerKeyNativeEvent(13);
                    setTimeout(function () {
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('B3:B3');
                        done();
                    }, 100);
                });
            });
        });
        describe('EJ2-55169->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ isProtected: true, protectSettings: { selectCells: true }, colCount: 9, rowCount: 1, frozenRows: 1, frozenColumns: 2, name: 'TPP Adj',
                        columns: [{ width: 100 }, { width: 400 }, { width: 120 }, { width: 120 }, { width: 120 }, { width: 300 }, { width: 120 }, { width: 120 },{ width: 300 }],
                        rows: [{ cells: [{ value: 'Account', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'Description', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'As Sourced', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'TPP Reclasses', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'TPP Adjusted \n Balance', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'TPP Comment', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'Tax Reclasses', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'Tax Adjusted Balance', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'Tax Comment', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } },
                            { value: 'Account', style: { fontWeight: 'bold', textAlign: 'center', backgroundColor: '#eceff1', color: '#000000' } }] }] 
                    }],showRibbon: false, showFormulaBar: false, scrollSettings: { isFinite: true }, allowInsert: false, allowDelete: false
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('When use \n in cell value, it throws script error->', (done: Function) => {
                helper.invoke('goTo', ['E1']);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[4].wrap).toBeTruthy();
                    expect(helper.invoke('getCell', [0,4]).classList).toContain('e-wraptext');
                    expect(getRowHeight(helper.getInstance().sheets[0], 0)).toBe(38);
                    expect(helper.invoke('getCell', [0, 4]).textContent).toBe('TPP Adjusted \n Balance');
                    done();
                });
            });
        });
        describe('EJ2-52429->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Improvement for resize with wrap cells.->', (done: Function) => {
                helper.invoke('goTo', ['A22']);
                setTimeout(() => {
                    helper.invoke('setRowHeight', [5, 21]);
                    helper.invoke('goTo', ['A200']);
                    setTimeout(() => {
                        helper.invoke('goTo', ['A22']);
                        setTimeout(() => {
                            expect(helper.invoke('getRow', [21]).style.height).toBe('5px');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-52631->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ startCell: 'A5', dataSource: defaultData }], 
                    rows: [{ cells: [{ value: 'customerBillingRefNum' }, { value: 'orderId' }, { value: 'orderType' }, { value: 'operationNotes' }, { value: 'description' }] },
                        { cells: [{ index: 4, value: 'McCormack @ 24/08/2021 08:51:08 AM \n hhhhhhhhhhhhhhh \n McCormack @ 24/08/2021 08:51:05 AM \n kkkkkkkkkkkkkkkk \n McCormack @ 24/08/2021 08:51:03 AM \n pppppppppppppppp\nMcCormack @ 24/08/2021 08:51:01 AM \n jjjjjjjjjjjjjjjjjjjjjj\nMcCormack @ 24/08/2021 08:50:59 AM \n jjjjjjjjjjjjjjjjjjjjjjjj \n null null \n fgtfgfgf \n www' }] },
                        { cells: [{ index: 4, value: 'McCormack @ 24/08/2021 08:51:08 AM \n hhhhhhhhhhhhhhh \n McCormack @ 24/08/2021 08:51:05 AM \n kkkkkkkkkkkkkkkk \n McCormack @ 24/08/2021 08:51:03 AM \n pppppppppppppppp\nMcCormack @ 24/08/2021 08:51:01 AM \n jjjjjjjjjjjjjjjjjjjjjj\nMcCormack @ 24/08/2021 08:50:59 AM \n jjjjjjjjjjjjjjjjjjjjjjjj \n null null \n fgtfgfgf \n www' }] },
                        { cells: [{ index: 4, value: 'McCormack @ 24/08/2021 08:51:08 AM \n hhhhhhhhhhhhhhh \n McCormack @ 24/08/2021 08:51:05 AM \n kkkkkkkkkkkkkkkk \n McCormack @ 24/08/2021 08:51:03 AM \n pppppppppppppppp\nMcCormack @ 24/08/2021 08:51:01 AM \n jjjjjjjjjjjjjjjjjjjjjj\nMcCormack @ 24/08/2021 08:50:59 AM \n jjjjjjjjjjjjjjjjjjjjjjjj \n null null \n fgtfgfgf \n www' }] },
                    ], selectedRange: 'E2'  }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue with row height while changing data source with wrap.->', (done: Function) => {
                let cellEle: HTMLElement = helper.getElements('.e-active-cell')[0];
                let selectionEle: HTMLElement = helper.getElements('.e-selection')[0];
                expect(cellEle.style.height).toEqual(selectionEle.style.height);
                done();
            });
        });
        describe('EJ2-52631->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: 'OrderID' }, { value: 'RequiredStartDate' }, { value: 'RequiredStartTime' }, { value: 'RequiredFinishDate' }, { value: 'RequiredFinishTime' },{ value: 'planningNotes' }] },
                    { cells: [{ value: '10250' }, { value: '15/02/1998' }, { value: '2/20/2020' }, { value: '25/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] },
                    { cells: [{ value: '10251' }, { value: '16/02/1998' }, { value: '10/10/2010' }, { value: '30/02/1998' }, { value: '1:10:00 PM' },{ value: '' }] },
                    { cells: [{ value: '10252' }, { value: '17/02/1998' }, { value: '10/10/2010' }, { value: '20/02/1998' }, { value: '1:10:00 PM' },{ value: '' }] },
                    { cells: [{ value: '10253' }, { value: '18/02/1998' }, { value: '10/10/2010' }, { value: '23/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] },
                    { cells: [{ value: '10254' }, { value: '19/02/1998' }, { value: '10/10/2010' }, { value: '24/02/1998' }, { value: '1:10:00 PM' },{ value: 'kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n' }] }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue with cell selection while reducing row height and apply wrap->', (done: Function) => {
                helper.invoke('setRowHeight', [50, 1]);
                helper.invoke('selectRange', ['F2']);
                helper.getElement('#' + helper.id + '_wrap').click();
                setTimeout(() => {
                    expect(helper.invoke('getRow', [1]).style.height).toBe('50px');
                    expect(helper.invoke('getCell', [1, 5]).classList).toContain('e-alt-unwrap');
                    expect(helper.invoke('getCell', [1, 5]).textContent).toBe('kiran \n jayanth \n murali \n chiru \n sanketh \n pavan \n');
                    done();
                });
            });
        });
    });
    describe('EJ2-60694->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Selection issue after cut/paste the wrap appiled cell->', (done: Function) => {
            helper.invoke('selectRange', ['H2:H2']);
            helper.getElement('#' + helper.id + '_wrap').click();
            const sheet: SheetModel = helper.invoke('getActiveSheet');
            helper.invoke('cut', ['H2:H2']).then(() => {
                helper.invoke('selectRange', ['J3:J3']);
                helper.invoke('paste');
                setTimeout(() => {
                    expect(getCell(2, 9, sheet).wrap).toBeTruthy();
                    expect(helper.invoke('getCell', [1, 7]).classList).not.toContain('e-wraptext');
                    done();
                });
            });
        });
    });
});