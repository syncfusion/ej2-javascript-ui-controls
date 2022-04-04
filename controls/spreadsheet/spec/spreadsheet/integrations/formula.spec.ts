import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel } from '../../../src';

Spreadsheet.Inject(BasicModule);

/**
 *  Formula spec
 */

describe('Spreadsheet formula module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI interaction checking ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        // it('Formula edit testing', (done: Function) => {
        //     let td: HTMLTableCellElement = helper.invoke('getCell', [5, 4]);
        //     let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
        //     //Selection update.
        //     helper.triggerMouseAction('mousedown', { x: coords.x, y: coords.y }, null, td);
        //     helper.triggerMouseAction('mouseup', { x: coords.x, y: coords.y }, null, td);
        //     //Start edit.
        //     helper.triggerMouseAction('dblclick', { x: coords.x, y: coords.y }, null, td);
        //     let editorElem: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
        //     editorElem.textContent = '=S';
        //     //key up & down - S key for update internal properties.
        //     helper.triggerKeyEvent('keydown', 83, null, false, false, editorElem);
        //     helper.triggerKeyEvent('keyup', 83, null, false, false, editorElem);
        //     setTimeout(() => {
        //         let formulaPopupLi: HTMLElement = helper.getElement('#spreadsheet_ac_popup li');
        //         expect(formulaPopupLi).not.toBeNull();
        //         expect(formulaPopupLi.textContent).toBe('SUM');
        //         setTimeout(() => {
        //             helper.triggerKeyEvent('keydown', 9, null, false, false, editorElem); //Tab key
        //             setTimeout(() => {
        //                 expect(editorElem.textContent).toBe('=SUM(');
        //                 editorElem.textContent = editorElem.textContent + '10,20';
        //                 //key down - S key for update internal properties.
        //                 helper.triggerKeyEvent('keydown', 48, null, false, false, editorElem);
        //                 //Enter key
        //                 helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
        //                 helper.invoke('getData', ['Sheet1!E6']).then((values: Map<string, CellModel>) => {
        //                     expect(values.get('E6').formula).toEqual('=SUM(10,20)');
        //                     expect(values.get('E6').value).toEqual('30');
        //                     done();
        //                 });
        //             }, 10);
        //         }, 10);
        //     }, 110);
        // });


        it('Int formula', (done: Function) => {
            helper.edit('D2', '11.5');
            helper.edit('J1', '=int(D2)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('11');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":11,"formula":"=int(D2)"}');
            done();
        });

        it('Today formula', (done: Function) => {
            helper.edit('J2', '=today()');
            const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[9];
            expect(cell.format).toBe('mm-dd-yyyy');
            expect(cell.formula).toBe('=today()');
            done();
        });

        it('Sum product formula', (done: Function) => {
            helper.edit('J3', '=sumproduct(D2:D5,E2:E5)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('1430');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":1430,"formula":"=sumproduct(D2:D5,E2:E5)"}');
            done();
        });

        it('Roundup formula', (done: Function) => {
            helper.edit('J4', '=roundup(D2, 0)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('12');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"12","formula":"=roundup(D2, 0)"}');
            done();
        });

        it('Sort formula', (done: Function) => {
            helper.edit('K1', '=sort(A1:A4)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('Formal Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"Casual Shoes","formula":"=sort(A1:A4)"}');
            expect(helper.getInstance().sheets[0].rows[2].cells[10].value).toBe('Item Name')
            expect(helper.getInstance().sheets[0].rows[3].cells[10].value).toBe('Sports Shoes')
            done();
        });

        it('Text formula', (done: Function) => {
            helper.edit('J5', '=Text(D2, "0%")');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('1150%');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].value).toBe("11.5");
            done();
        });

        it('Lookup formula', (done: Function) => {
            helper.edit('J6', '=LOOKUP(20,D2:D5,E2:E5)');
            // expect(helper.invoke('getCell', [5, 9]).textContent).toBe('15'); // This case need to be fixed
            // expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":15,"formula":"=LOOKUP(20,D2:D5,E2:E5)"}');
            done();
        });

        it('Slope formula', (done: Function) => {
            helper.edit('J7', '=slope(D2:D5,E2:E5)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('0.142105');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":"0.142105","formula":"=slope(D2:D5,E2:E5)"}');
            done();
        });

        it('Intercept formula', (done: Function) => {
            helper.edit('J8', '=INTERCEPT(D2:D5,E2:E5)');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('13.60526');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"13.60526","formula":"=INTERCEPT(D2:D5,E2:E5)"}');
            done();
        });

        it('Ln formula', (done: Function) => {
            helper.edit('J9', '=ln(D2)');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('2.442347');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"2.442347","formula":"=ln(D2)"}');
            done();
        });

        it('IsNumber formula', (done: Function) => {
            helper.edit('J10', '=isnumber(D2)');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[9])).toBe('{"value":true,"formula":"=isnumber(D2)"}');
            helper.edit('J10', '=isnumber(A1)');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[9])).toBe('{"value":false,"formula":"=isnumber(A1)"}');
            done();
        });

        it('Round formula', (done: Function) => {
            helper.edit('J11', '=round(D2, 0)');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('12');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[9])).toBe('{"value":"12","formula":"=round(D2, 0)"}');
            done();
        });

        it('Power formula', (done: Function) => {
            helper.edit('J12', '=power(G3,G4)');
            expect(helper.invoke('getCell', [11, 9]).textContent).toBe('78125');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[9])).toBe('{"value":"78125","formula":"=power(G3,G4)"}');
            done();
        });

        it('Log formula', (done: Function) => {
            helper.edit('J13', '=log(D3,E3)');
            expect(helper.invoke('getCell', [12, 9]).textContent).toBe('0.880788');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[9])).toBe('{"value":"0.880788","formula":"=log(D3,E3)"}');
            done();
        });

        it('Trunc formula', (done: Function) => {
            helper.edit('J14', '=trunc(D2)');
            expect(helper.invoke('getCell', [13, 9]).textContent).toBe('11');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[13].cells[9])).toBe('{"value":"11","formula":"=trunc(D2)"}');
            done();
        });

        it('Exp formula', (done: Function) => {
            helper.edit('J15', '=exp(D4)');
            expect(helper.invoke('getCell', [14, 9]).textContent).toBe('485165195');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[14].cells[9])).toBe('{"value":"485165195","formula":"=exp(D4)"}');
            done();
        });

        it('Geomean formula', (done: Function) => {
            helper.edit('J16', '=geomean(D2:D6)');
            expect(helper.invoke('getCell', [15, 9]).textContent).toBe('18.33133');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[15].cells[9])).toBe('{"value":"18.33133","formula":"=geomean(D2:D6)"}');
            done();
        });

        it('Dependent cell update', (done: Function) => {
            helper.edit('D6', '40');
            expect(helper.invoke('getCell', [15, 9]).textContent).toBe('19.41699');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[15].cells[9])).toBe('{"value":"19.41699","formula":"=geomean(D2:D6)"}');
            done();
        });

        it('Compute expression', (done: Function) => {
            expect(helper.invoke('computeExpression', ['=SUM(E2,E5)'])).toBe(40);
            done();
        });
    });

    describe('CR-Issues ->', () => {
        describe('I311951, I309076, FB24295, FB23944 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '25' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Formula with percentage not working and formula parsing issue', (done: Function) => {
                helper.edit('A2', '=A1*5%');
                const inst: Spreadsheet = helper.getInstance();
                expect(inst.sheets[0].rows[1].cells[0].formula).toEqual('=A1*5%');
                expect(inst.sheets[0].rows[1].cells[0].value).toEqual('1.25');
                expect(inst.getCell(1, 0).textContent).toEqual('1.25');
                helper.invoke('selectRange', ['A2']);
                setTimeout(() => {
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('=A1*5%');
                    helper.invoke('selectRange', ['A3']);
                    setTimeout(() => {
                        helper.edit('A3', '=425/25*-1');
                        expect(inst.sheets[0].rows[2].cells[0].formula).toEqual('=425/25*-1');
                        expect(inst.sheets[0].rows[2].cells[0].value).toEqual('-17');
                        expect(inst.getCell(2, 0).textContent).toEqual('-17');
                        setTimeout((): void => {
                            expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('=425/25*-1');
                            done();
                        });
                    });
                });
            });

            it('Count value is not calculated properly in aggregate when selected range contains zero value', (done: Function) => {
                helper.edit('B1', '0');
                helper.invoke('selectRange', ['A1:B1']);
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 2');
                done();
            });

            it('Formula popup not displayed on cell in the bottom of the sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.selectRange('C21');
                spreadsheet.startEdit();
                const editElem: HTMLElement = helper.getCellEditorElement();
                editElem.textContent = '=s';
                helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                setTimeout(()=>{
                    const popup: Element = helper.getElement('#' + helper.id + '_ac_popup');
                    expect(Math.abs(popup.getBoundingClientRect().bottom - editElem.getBoundingClientRect().top)).toBeLessThan(3);
                    setTimeout(()=>{
                        done();
                    }, 100);
                });
            });
        });
        describe('I261427 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '1' }] }] }, { rows: [{ cells: [{ value: '2' }] }] }, { rows: [{ cells: [{ formula:
                        '=Sheet1!A1+Sheet2!A1' }] }] }], activeSheetIndex: 2 }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cross tab formula issue', (done: Function) => {
                const target: HTMLElement = helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1];
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[2].rows[0].cells[0].formula).toEqual('=Sheet1!A1+Sheet2!A1');
                expect(spreadsheet.sheets[2].rows[0].cells[0].value).toEqual('3');
                helper.triggerMouseAction('contextmenu', { x: target.getBoundingClientRect().left + 20, y:
                    target.getBoundingClientRect().top + 10 }, null, target);
                setTimeout(() => {
                    helper.getElement('#' + helper.id + '_cmenu_delete_sheet').click();
                    setTimeout(() => {
                        helper.getElement('.e-footer-content .e-btn.e-primary').click();
                        setTimeout(() => {
                            expect(spreadsheet.sheets[1].rows[0].cells[0].formula).toEqual('=SHEET1!A1+#REF!A1');
                            expect(spreadsheet.sheets[1].rows[0].cells[0].value).toEqual('#REF!');
                            done();
                        }, 10);
                    });
                });
            });
        });
        describe('I288646, I296410, I305593, I314883 ->', () => {
            const model: SpreadsheetModel = { sheets: [{ rows: [{ cells: [{  value: '10' }, { value: '20' }, { index: 8, formula: '=H1' }] }, { cells: [{ formula: '=ROUNDUP(10.6)' },
            { index: 4, formula: '=INT(10.2)' }, { formula: '=SUMPRODUCT(A1:B1)' }, { index: 8, formula: '=H2' }] }] }] };
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Include the unsupported formula (ROUNDUP, INT, SUMPRODUCT)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[0].formula).toBe('=ROUNDUP(10.6)');
                expect(spreadsheet.sheets[0].rows[1].cells[0].value.toString()).toBe('11');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('11');
                expect(spreadsheet.sheets[0].rows[1].cells[4].formula).toBe('=INT(10.2)');
                expect(spreadsheet.sheets[0].rows[1].cells[4].value.toString()).toBe('10');
                expect(helper.invoke('getCell', [1, 4]).textContent).toBe('10');
                expect(spreadsheet.sheets[0].rows[1].cells[5].formula).toBe('=SUMPRODUCT(A1:B1)');
                expect(spreadsheet.sheets[0].rows[1].cells[5].value.toString()).toBe('30');
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('30');
                done();
            });

            it('Circular reference dialog opens multiple times when deleting column', (done: Function) => {
                helper.setAnimationToNone(`#${helper.id}_contextmenu`);
                helper.openAndClickCMenuItem(0, 5, [7], null, true);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-dialog').length).toBe(1);
                    helper.setAnimationToNone('.e-dialog');
                    helper.click('.e-dialog .e-primary');
                    expect(document.querySelectorAll('.e-dialog').length).toBe(0);
                    done();
                });
            });

            // it('Formula dependent cell not updated after destroy', (done: Function) => {
            //     helper.edit('C1', 'Test');
            //     setTimeout(() => {
            //         helper.invoke('destroy');
            //         new Spreadsheet(model, '#' + helper.id);
            //         setTimeout(() => {
            //             setTimeout(() => {
            //                 expect(helper.getInstance().sheets[0].rows[0].cells[2]).toBeUndefined();
            //                 expect(helper.invoke('getCell', [0, 2]).textContent).toBe('');
            //                 helper.edit('B1', '30');
            //                 expect(helper.invoke('getCell', [1, 5]).textContent).toBe('40');
            //                 expect(helper.getInstance().sheets[0].rows[1].cells[5].value).toBe(40);
            //                 done();
            //             });
            //         });
            //     });
            // });
        });
        describe('I312700 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ formula: '=COUNTIF(AR1:AT1,"=10")' }, { index: 4, formula: '=SUMIF(AR1:AT1,"=10")' },
                    { index: 43, value: '10' }, { value: '5' }, { value: '10' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Improve the formulas with the range greater than AA and countif, countifs, sumif, sumifs formula with this ranges', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].formula).toBe('=COUNTIF(AR1:AT1,"=10")');
                expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toBe('2');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('2');
                expect(spreadsheet.sheets[0].rows[0].cells[4].formula).toBe('=SUMIF(AR1:AT1,"=10")');
                expect(spreadsheet.sheets[0].rows[0].cells[4].value.toString()).toBe('20');
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('20');
                done();
            });
        });
        describe('I296802, F162534 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ index: 3, value: '100' }, { value: '50' }, { formula: '=D1+E1' }] }],
                    selectedRange: 'D1:D1' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('formula dependency not updated issue', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[5].value).toEqual('150');
                helper.invoke('insertColumn', [4]);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[0].cells[6].formula).toEqual('=D1+F1');
                    expect(spreadsheet.sheets[0].rows[0].cells[6].value).toEqual('150');
                    helper.edit('F1', '100');
                    expect(spreadsheet.sheets[0].rows[0].cells[6].value).toEqual('200');
                    expect(helper.invoke('getCell', [0, 6]).textContent).toEqual('200');
                    setTimeout((): void => {
                        done();
                    }, 10);
                });
            });
        });
        describe('I305406, I280608, I296710, I257045, I274819, I282974, I288646 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Formula selection support while editing the formula range, Highlight reference selection in formula and formula reference selection issue', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('startEdit');
                setTimeout((): void => {
                    const editor: HTMLElement = helper.getElement('#' +helper.id + '_edit');
                    editor.textContent = '=SUM(';
                    (spreadsheet as any).editModule.editCellData.value = '=SUM(';
                    let cell: HTMLElement = helper.invoke('getCell', [0, 1]);
                    helper.triggerMouseAction(
                        'mousedown', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null,
                        cell);
                    helper.triggerMouseAction(
                        'mouseup', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, document,
                        cell);
                    setTimeout((): void => {
                        expect(editor.textContent).toEqual('=SUM(B1');
                        editor.textContent = '=SUM(A3';
                        editor.focus();
                        helper.triggerKeyEvent('keydown', 51, null, null, null, editor);
                        helper.triggerKeyEvent('keyup', 51, null, null, null, editor);
                        cell = helper.invoke('getCell', [2, 0]);
                        expect(cell.classList).toContain('e-formularef-selection');
                        expect(cell.classList).toContain('e-vborderright');
                        expect(cell.classList).toContain('e-vborderbottom');
                        done();
                    });
                });
            });
        });
        describe('I293654, I296802, I307653, I264424, I298789, I300031 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ name: 'Cover', rows: [{ index: 5, height: 30, cells: [{ colSpan: 8, formula: '=Lookup!B1', style:
                { fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' } }] }, { index: 7, cells: [{ colSpan: 6, value:
                'Company No.12345678' }] }, { cells: [{ colSpan: 4, formula: '=IF(Lookup!B3="ABRIDGED",IF(IF(Lookup!B4="",FALSE,TRUE),"Directors'
                + "'" + '","Director' + "'" + 's")&" Report and "&IF(Lookup!B5="Audited","Audited","Unaudited")&" Abridged Accounts",IF(IF(Lookup!B4="",FALSE,TRUE),"Directors'
                + "'" + '","Director' + "'" + 's")&" Report and "&IF(Lookup!B5="Audited","Audited","Unaudited")&" Accounts")' }] }, { cells: [{ formula:
                '=TEXT(Lookup!B6,"dd MMMM yyyy")' }, { index: 3, value: '37087.58' }, { value: '38767.36' }, { wrap: true, formula:
                '=IF(OR(AND(ABS(D10)>ABS(E10),D10<0),AND(ABS(D10)<=ABS(E10),E10<0)),-1*(IF(D10=0,((ABS(E10)-ABS(D10))/1)*100,((ABS(E10)-ABS(D10))/ABS(D10))*100)),IF(D10=0,((ABS(E10)-ABS(D10))/1)*100,((ABS(E10)-ABS(D10))/ABS(D10))*100))'
                }] }, { cells: [{ formula: '=1-0/0' }] }, { cells: [{ formula: '=(10-3)/1' }] }] }, { name: 'Lookup', rows: [{ cells: [{ value: 'CLIENTNAME' },
                { value: 'Example Limited Company' }] }, { cells: [{ value: 'REGISTRATIONNUMBER' }, { value: '12345678' }] }, { cells: [{ value: 'ACCOUNT' }] }, { cells: [{ value: 'DIRECTOR2' },
                { value: 'abc' }] }, { cells: [{ value: 'AUDITED' }, { value: 'Audited' }] }, { cells: [{ value: 'PERIODEND' }, { value: '9/1/2019' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Opening the attached pre formatted excel file it is giving errors in the last two rows though the formula is correct and date format is also correct', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[5].cells[0].value).toBe('Example Limited Company');
                expect(helper.invoke('getCell', [5, 0]).textContent).toBe('Example Limited Company');
                expect(spreadsheet.sheets[0].rows[8].cells[0].value).toBe("Directors' Report and Audited Accounts");
                expect(helper.invoke('getCell', [8, 0]).textContent).toBe("Directors' Report and Audited Accounts");
                expect(spreadsheet.sheets[0].rows[9].cells[0].value).toBe('September 1, 2019');
                expect(helper.invoke('getCell', [9, 0]).textContent).toBe('September 1, 2019');
                expect(spreadsheet.sheets[0].rows[9].cells[5].value).toBe('4.529225');
                expect(helper.invoke('getCell', [9, 5]).textContent).toBe('4.529225');
                expect(spreadsheet.sheets[0].rows[10].cells[0].value).toBe('#DIV/0!');
                expect(helper.invoke('getCell', [10, 0]).textContent).toBe('#DIV/0!');
                expect(spreadsheet.sheets[0].rows[11].cells[0].value).toBe('7');
                expect(helper.invoke('getCell', [11, 0]).textContent).toBe('7');
                done();
            });
        });
        describe('FB23112 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Match function is not working for cell reference', (done: Function) => {
                helper.edit('I2', 'Running Shoes');
                helper.edit('I3', '=Match(I2, A2:A11)');
                expect(helper.invoke('getCell', [2, 8]).textContent).toBe('7');
                expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toBe(7);
                done();
            });
        });
        describe('fb23644, fb23650 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] }, { cells:
                        [{ value: '5' }] }, { cells: [{ formula: '=SUM(A1:A4)' }] }], selectedRange: 'A4' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Dependent cells not updated for loaded JSON using openFromJson method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[4].cells[0].value.toString()).toEqual('11');
                helper.invoke('refresh');
                setTimeout((): void => {
                    helper.edit('A4', '10');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value.toString()).toEqual('16');
                    setTimeout((): void => {
                        helper.invoke('selectRange', ['A5:A5']);
                        done();
                    });
                });
            });
            it('Cell with inserted function is not properly copied and pasted (Formula range reference not proper on pasted cell)', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[4].cells[1]).toBeUndefined();
                helper.invoke('copy').then((): void => {
                    helper.invoke('paste', ['B5']);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[4].cells[1].value.toString()).toEqual('0');
                        expect(spreadsheet.sheets[0].rows[4].cells[1].formula).toEqual('=SUM(B1:B4)');
                        expect(helper.invoke('getCell', [4, 1]).textContent).toEqual('0');
                        helper.invoke('paste', ['C4']);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[3].cells[2].value).toEqual('#REF!');
                            expect(spreadsheet.sheets[0].rows[3].cells[2].formula).toEqual('=SUM(#REF!)');
                            expect(helper.invoke('getCell', [3, 2]).textContent).toEqual('#REF!');
                            done();
                        });
                    });
                });
            });
        });
        describe('fb24848 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '1' }, { index: 4, value: 'Tom' }] }, { cells: [{ value: '2' }, { index: 4,
                        value: 'John' }] }, { cells: [{ value: '5' }, { index: 4, value: 'Jane' }] }, { index: 4, cells: [{ formula:
                        '=INDEX(A1:A3,MATCH("Tom",E1:E3,0),1)' }, { index: 4, formula: '=INDEX(A1:A3,SUM(A1:A1),1)' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('"#REF!" error when combining functions with each over', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[4].cells[0].value).toEqual('1');
                expect(helper.invoke('getCell', [4, 0]).textContent).toEqual('1');
                expect(spreadsheet.sheets[0].rows[4].cells[4].value).toEqual('1');
                expect(helper.invoke('getCell', [4, 4]).textContent).toEqual('1');
                helper.edit('A1', '3');
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value.toString()).toEqual('3');
                    expect(helper.invoke('getCell', [4, 0]).textContent).toEqual('3');
                    expect(spreadsheet.sheets[0].rows[4].cells[4].value.toString()).toEqual('5');
                    expect(helper.invoke('getCell', [4, 4]).textContent).toEqual('5');
                    done();
                });
            });
        });
        describe('I325908 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '0' }, { index: 4, value: '10' }] }, { cells: [{ formula:
                        '=IF($A1<>0,$A1*E$1,"0,00")' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('IF formula false value with "," inside scenario', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('0,00');
                expect(helper.invoke('getCell', [1, 0]).textContent).toEqual('0,00');
                helper.edit('A1', '10');
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('100');
                    expect(helper.invoke('getCell', [1, 0]).textContent).toEqual('100');
                    done();
                });
            });
        });
        describe('SF-362961 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ name: 'Report Output', rows: [{ index: 1, cells:
                        [{ index: 3, formula: '=IFS(ClientData!E1=0,"",ClientData!E1="Others","",TRUE,ClientData!E1)' },
                            { formula: '=IF($D2="","",IFERROR(IF(SUMIF(ClientData!D1:D3,$A4,ClientData!C1:C3)=0,"0",SUMIF(ClientData!D1:D3,$A4,ClientData!C1:C3)),"0"))' }] }] },
                    { name: 'ClientData', rows: [{ cells: [{ index: 2, value: '100' }, { value: 'EY Adj 1' }, { formula: '=UNIQUE(ClientData!D1:D3)' }] },
                        { cells: [{ index: 2, value: '150' }, { value: 'EY Adj 2' }] }, { cells: [{ index: 2, value: '200' }, { value: 'Others' }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Inserting row not properly updated the cell references in other sheets', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[1].cells[3].value).toEqual('EY Adj 1');
                expect(spreadsheet.sheets[0].rows[1].cells[4].value).toEqual('0');
                spreadsheet.activeSheetIndex = 1;
                spreadsheet.dataBind();
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value).toEqual('EY Adj 1');
                    expect(spreadsheet.sheets[0].rows[1].cells[4].value).toEqual('0');
                    helper.invoke('insertRow');
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[1].cells[3].formula).toEqual('=IFS(ClientData!E2=0,"",ClientData!E2="Others","",TRUE,ClientData!E2)');
                        expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBeNull();
                        expect(spreadsheet.sheets[0].rows[1].cells[4].formula).toEqual('=IF($D2="","",IFERROR(IF(SUMIF(ClientData!D2:D4,$A4,ClientData!C2:C4)=0,"0",SUMIF(ClientData!D2:D4,$A4,ClientData!C2:C4)),"0"))');
                        expect(spreadsheet.sheets[0].rows[1].cells[4].value).toBeNull();
                        done();
                    });
                });
            });
        });
        describe('EJ2-57075 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{       rows: [
                        {
                          cells: [
                            { value: '10' },
                            { value: '10' },
                            { formula: '=SUMIF(A1:A2,"10",B1)' },
                          ],
                        },
                        { cells: [{ value: '10' }, { value: '10' }] },
                      ], }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('SUMIF calculation while criteriaRange is greater than Sum range', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[0].cells[2].value.toString()).toEqual('20');
                done();
            });
        });
        describe('EJ2-57684 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{
                            rows: [
                                {
                                    cells: [
                                        { value: '10', format: '#,##0.00' },
                                        { value: '10', format: '#,##0.00' },
                                    ],
                                },
                            ],
                        }],
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Aggregates not calculated properly for custom number formatted values', (done: Function) => {
                helper.invoke('selectRange', ['A1:B1']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Sum: 20.00')
                done();
            });
        });
        describe('EJ2-58254 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [
                            {
                                ranges: [{ dataSource: defaultData }]
                            }
                        ]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Aggregates not calculated properly for date formatted values', (done: Function) => {
                helper.invoke('selectRange', ['B2:B3']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Sum: 7/27/2128');
                helper.invoke('selectRange', ['C2:C3']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Sum: 5:31:12 PM');
                helper.invoke('selectRange', ['A2:A3']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Count: 2');
                helper.invoke('selectRange', ['D2:D3']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Sum: 30');
                helper.invoke('selectRange', ['A2:B5']);
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Sum: 167296');
                helper.invoke('selectRange', ['B2:B3']);
                helper.getElement('#' + helper.id + '_aggregate').click();
                let Element:NodeListOf<HTMLElement> = document.querySelectorAll("#spreadsheet_aggregate-popup li");
                expect(Element[0].textContent).toBe('Count: 2');
                expect(Element[2].textContent).toBe('Avg: 4/13/2014');
                expect(Element[3].textContent).toBe('Min: 2/14/2014');
                expect(Element[4].textContent).toBe('Max: 6/11/2014');
                Element[0].click();
                expect(helper.getElement('#' + helper.id + '_aggregate').textContent).toBe('Count: 2');
                done();
            });
        });
    });
});