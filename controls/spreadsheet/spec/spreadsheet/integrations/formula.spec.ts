import { SpreadsheetModel, Spreadsheet, BasicModule } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, getCell, RowModel, SheetModel } from '../../../src/index';

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
        it('Now formula', (done: Function) => {
            helper.edit('A13', '=NOW()');
            const cell: CellModel = helper.getInstance().sheets[0].rows[12].cells[0];
            expect(cell.value.indexOf('/') > -1).toBeFalsy();
            expect(cell.value.indexOf(':') > -1).toBeFalsy();
            expect(!!Number(cell.value)).toBeTruthy();
            expect(cell.format).toBe('M/d/yyyy h:mm');
            const cellContent: string = helper.invoke('getCell', [12, 0]).textContent;
            expect(cellContent.indexOf('/') > -1).toBeTruthy();
            expect(cellContent.indexOf(':') > -1).toBeTruthy();
            expect(cellContent.indexOf('AM') > -1).toBeFalsy();
            expect(cellContent.indexOf('PM') > -1).toBeFalsy();
            done();
        });
        it('Date formula', (done: Function) => {
            helper.edit('A14', '=DATE(2022, 8, 22)');
            const cell: CellModel = helper.getInstance().sheets[0].rows[13].cells[0];
            expect(cell.formula).toBe('=DATE(2022, 8, 22)');
            expect(cell.value).toBe('44795');
            const cellEle: HTMLElement = helper.invoke('getCell', [13, 0]);
            expect(cellEle.textContent).toBe('08/22/2022');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
            helper.invoke('updateCell', [{ formula: '=DATE(2022, 1, -1)' }, 'A14']);
            expect(cell.formula).toBe('=DATE(2022, 1, -1)');
            expect(cell.value).toBe('44560');
            expect(cellEle.textContent).toBe('12/30/2021');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
            helper.invoke('updateCell', [{ formula: '=DATE(2022, -1, 1)' }, 'A14']);
            expect(cell.formula).toBe('=DATE(2022, -1, 1)');
            expect(cell.value).toBe('44501');
            expect(cellEle.textContent).toBe('11/1/2021');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
            helper.invoke('updateCell', [{ formula: '=DATE(2022, -30, 1)' }, 'A14']);
            expect(cell.formula).toBe('=DATE(2022, -30, 1)');
            expect(cell.value).toBe('43617');
            expect(cellEle.textContent).toBe('6/1/2019');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
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
        describe('I288646, I296410, I305593, I314883, EJ2-63933 ->', () => {
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
                    expect(document.querySelectorAll('.e-dialog').length).toBe(0);
                    done();
                });
            });

            it('Calculation issue while applying the formula =(B2+B3)^2', (done: Function) => {
                helper.edit('B2', '1');
                helper.edit('B3', '5.00%');
                helper.edit('B4', '=(B2+B3)^2');
                helper.edit('B5', '=(B2+B3)^(1/3)');
                helper.edit('B6', '=POWER((B2+B3),2)');
                helper.edit('B7', '=POWER((B2+B3),1/3)');
                helper.edit('B8', '=(3^2)^(2)');
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('1.1025');
                expect(helper.invoke('getCell', [4, 1]).textContent).toBe('1.016396');
                expect(helper.invoke('getCell', [5, 1]).textContent).toBe('1.1025');
                expect(helper.invoke('getCell', [6, 1]).textContent).toBe('1.016396');
                expect(helper.invoke('getCell', [7, 1]).textContent).toBe('81');
                done();
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
        describe('FB23112, EJ2-60666 ->', () => {
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

            it('Editing formula is not working after sheets updated dynamically', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets = [{}, {}];
                spreadsheet.dataBind();
                setTimeout(() => {
                    helper.edit('B1', '=A1');
                    expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('0');
                    expect(spreadsheet.sheets[0].rows[0].cells[1].formula).toBe('=A1');
                    expect(helper.invoke('getCell', [0, 1]).textContent).toBe('0');
                    done();
                });
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
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ name: 'Report Output', rows: [{ index: 1, cells:
                        [{ formula: '=IFS(NonOtherUQE!A1=0,"",NonOtherUQE!A1="Others","",TRUE,NonOtherUQE!A1)' }, { index: 3, formula: '=IFS(ClientData!E1=0,"",ClientData!E1="Others","",TRUE,ClientData!E1)' },
                            { formula: '=IF($D2="","",IFERROR(IF(SUMIF(ClientData!D1:D3,$A4,ClientData!C1:C3)=0,"0",SUMIF(ClientData!D1:D3,$A4,ClientData!C1:C3)),"0"))' }] }] },
                        { name: 'ClientData', rows: [{ cells: [{ index: 2, value: '100' }, { value: 'EY Adj 1' }, { formula: '=UNIQUE(ClientData!D1:D3)' }] },
                        { cells: [{ value: 'EY Adj 2' }, { value: '1,000.00' }, { value: '150' }, { value: 'EY Adj 2' }] }, { cells: [{ index: 1, value: '-2,000.00' }, { value: '200' }, { value: 'Others' }] },
                        { index: 5, cells: [{ index: 6, formula: '=C6' }] }, { cells: [{ index: 6, formula: '=D5' }] }, { index: 100, cells: [{ formula: '=SUM(C1:C2)' }] }] },
                        { name: 'NonOtherUQE' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Inserting row not properly updated the cell references in other sheets', (done: Function) => {
                spreadsheet = helper.getInstance();
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
            it('saveAsJson formula calculation for not calculated formula cell and #value error checking', (done: Function) => {
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('');
                expect(spreadsheet.sheets[1].rows[101].cells[0].value).toBeNull();
                // saveAsJson operation codes are used to replicate the case, since CI will not compatible with Worker task so invoking getStringifyObject method directly.
                const skipProps: string[] = ['dataSource', 'startCell', 'query', 'showFieldAsHeader'];
                for (let i: number = 0, sheetCount: number = spreadsheet.sheets.length; i < sheetCount; i++) {
                    spreadsheet.workbookSaveModule.getStringifyObject(spreadsheet.sheets[i], skipProps, i);
                }
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toEqual('');
                expect(spreadsheet.sheets[1].rows[101].cells[0].value).toEqual(250);
                done();
            });
            it('External copy/paste and SUMIF formula calculation value is not proper', (done: Function) => {
                expect(getCell(4, 2, spreadsheet.sheets[1])).toBeNull();
                helper.invoke('updateCell', [{ formula: '=SUMIF(ClientData!$D$2:$D$4,$A3,ClientData!$B$2:$B$4)' }, 'C5']);
                expect(spreadsheet.sheets[1].rows[4].cells[2].value).toEqual(1000);
                done();
            });
            it('Referenced cells are not updated while updating the UNIQUE formula value', (done: Function) => {
                expect(getCell(5, 2, spreadsheet.sheets[1])).toBeNull();
                expect(spreadsheet.sheets[1].rows[6].cells[6].formula).toEqual('=C7');
                expect(spreadsheet.sheets[1].rows[6].cells[6].value).toEqual('0');
                expect(spreadsheet.sheets[1].rows[7].cells[6].formula).toEqual('=D6');
                expect(spreadsheet.sheets[1].rows[7].cells[6].value).toEqual('0');
                helper.invoke('updateCell', [{ formula: '=UNIQUE(C2:D4)' }, 'C6']);
                expect(spreadsheet.sheets[1].rows[5].cells[2].value).toEqual('100');
                expect(spreadsheet.sheets[1].rows[6].cells[6].value).toEqual('150');
                expect(spreadsheet.sheets[1].rows[7].cells[6].value).toEqual('EY Adj 1');
                done();
            });
        });
        describe('EJ2-57075, EJ2-60798 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{       rows: [
                        {
                          cells: [
                            { value: '10' },
                            { value: '10' },
                            { formula: '=SUMIF(A1:A2,"10",B1)' },
                            { value: 'Apple' },
                            { value: 'Fruit' },
                            { formula: '=IF(D1="NA",E1,Concat(D1:E1))' }
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
            it('Concat two string inside if formula is not working', (done: Function) => {
                const cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[5];
                expect(cell.value).toBe('AppleFruit');
                expect(helper.invoke('getCell', [0, 5]).textContent).toBe('AppleFruit');
                helper.edit('D1', 'NA');
                expect(cell.value).toBe('Fruit');
                expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Fruit');
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
        describe('EJ2-58254, EJ2-59388, EJ2-60324 ->', () => {
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
            it('When using the dollar formula with a single argument, an error occurs', (done: Function) => {
                helper.edit('I2', '=DOLLAR(H2)');
                expect(helper.invoke('getCell', [1, 8]).textContent).toBe('$10.00');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8].value)).toBe('"$10.00"');
                helper.edit('I2', '=DOLLAR(H2,3)');
                expect(helper.invoke('getCell', [1, 8]).textContent).toBe('$10.000');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8].value)).toBe('"$10.000"');
                done();
            });
            it('Sum of decimal numbers with three decimal places is formatted to two decimal places', (done: Function) => {
                helper.edit('J1', '1.001');
                helper.edit('J2', '2.002');
                helper.edit('J3', '=SUM(J1:J2)');
                expect(helper.invoke('getCell', [2, 9]).textContent).toBe('3.003');
                expect(getCell(2, 9, helper.getInstance().sheets[0]).value).toBe('3.003');
                done();
            });
        });
        describe('EJ2-49597, I327667, EJ2-53137, EJ2-51869, EJ2-51868, EJ2-47753, EJ2-49475, EJ2-56722, EJ2-48147, Ej2-54448->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],  
                rows: [{ index: 13, cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] }, { cells: [{ value: '4' }] }, {cells: [{ }]}, { cells: [{ formula: '=SUM(A14:A17)' }] },
                { cells: [{ }] }, { cells: [{ value: '1'}, { value: '1'}] }, { cells:  [{ value: '2'}, { value: '1'}] },
                { cells: [{ value: '3'}, { value: '1'}] }, { cells: [{ value: '-5'},{ value: '-1'}] },
                { cells: [{ value: '-6'}, { value: '-1'}] }, { cells: [{ value: '-7'}, { value: '-1'}] },
                { cells: [{ }] }, { cells: [{ value: '1' }, { value: '1.25' }, { value: '1500' }, { formula: '=A28*C28' }, { formula: '=B28*C28' }, { formula: '=E28*A28' }] }, 
                { cells: [{ value: '1' }, { value: '' }, { value: '2000' }, { formula: '=A29*C29' }, { formula: '=B28*C29' }, { formula: '=E29*A29' }] }, 
                { cells: [{ value: '1' }, { value: '' }, { value: '1750' }, { formula: '=A30*C30' }, { formula: '=B28*C30' }, { formula: '=E30*A30' }] },
                { cells: [{ index: 5, formula: '=SUM(F21:F30)' }] }
            ],selectedRange: 'A15' } ] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy'); 
            });
            it('EJ2-49597 - Formula dependent cells not updated while clear the value using DELETE key', (done: Function) => {
                helper.triggerKeyNativeEvent(46);
                expect(helper.invoke('getCell', [14, 0]).value).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[18].cells[0].value).toBe(8);
                done();
            });
            it('I327667 - MATCH function doesnot work properly', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'Jeanette Pamplin' }, 'A12']);
                helper.invoke('updateCell', [{ value: 'Jeanette Pamplin' }, 'H3']);
                helper.invoke('updateCell', [{ formula: '=Match(H3,A2:A30)' }, 'H4']);
                expect(helper.getInstance().sheets[0].rows[3].cells[7].value).toBe(11);
                done();
            });
            it('I327667 - Match formula does not throw error when finding value is not present', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'A' }, 'M1']);
                helper.invoke('updateCell', [{ formula: '=Match(M1,N1:N10)' }, 'M3']);
                expect(helper.getInstance().sheets[0].rows[2].cells[12].value).toBe('#N/A');
                done();
            });
            it('EJ2-53137 - MAX function throws error->', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=MAX(K1,K10)' }, 'I1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toBe('=MAX(K1,K10)');
                expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('0');
                done();
            });
            it('EJ2-51869 - Need to avoid rounding decimal values while adding decimal values->', (done: Function) => {
                helper.invoke('selectRange', ['J1:J5']);
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_number_format-popup .e-item:nth-child(2)').click();
                helper.invoke('updateCell', [{ value: '100000.50' }, 'J1']);
                helper.invoke('updateCell', [{ value: '1.00' }, 'J2']);
                helper.invoke('updateCell', [{ formula: '=SUM(J1:J2)' }, 'J3']);
                expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toBe('=SUM(J1:J2)');
                expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('100001.5');
                done();
            });
            it('EJ2-51868 - Spreadsheet formula throws #value error->', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=(I3+I7)*-1' }, 'I2']);
                expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBe('=(I3+I7)*-1');
                expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toBe('0');
                done();
            });
            it('EJ2-47753 - Dependent cells not updated for loaded JSON using openFromJson method', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('100001.5');
                helper.invoke('refresh');
                setTimeout(() => {
                    helper.invoke('selectRange', ['J2']);
                    helper.invoke('updateCell', [{ value: '2.00' }, 'J2']);
                    expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('100002.5');
                    done();
                });
            });
            it('EJ2-49475 - nested IF formula issue in spreadsheet', (done: Function) => {
                helper.invoke('selectRange', ['C21']);
                helper.invoke('updateCell', [{ formula: '=IF(SUMIF(A21:A26,"<0",B21:B26)<0,1,2)' }, 'C21']);
                expect(helper.getInstance().sheets[0].rows[20].cells[2].value).toBe('1');
                helper.invoke('updateCell', [{ value: '13' }, 'D21']);
                helper.invoke('updateCell', [{ formula: '=IF(D1="","None",IF(D1>10,"Pass","Fail"))' }, 'E21']);
                expect(helper.getInstance().sheets[0].rows[20].cells[4].value).toBe('Pass');
                done();
            });
            it('EJ2-56722 - Cascading cell values does not get updated properly for imported file->', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[30].cells[5].value).toBe('6562.5');
                helper.invoke('updateCell', [{ value: '2' }, 'A29']);
                expect(helper.getInstance().sheets[0].rows[28].cells[3].value).toBe('4000');
                expect(helper.getInstance().sheets[0].rows[28].cells[5].value).toBe('5000');
                expect(helper.getInstance().sheets[0].rows[30].cells[5].value).toBe('9062.5');
                done();
            });
            it('EJ2-48147 - Formula suggestion box not showed for last cells', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.sheets[0].topLeftCell = 'A40'
                spreadsheet.dataBind();
                setTimeout(() => {
                    spreadsheet.selectRange('C42');
                    spreadsheet.startEdit();
                    const editElem: HTMLElement = helper.getCellEditorElement();
                    editElem.textContent = '=s';
                    helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                    setTimeout(() => {
                        let popUpElem: HTMLElement = helper.getElement('.e-popup-open .e-dropdownbase');
                        expect(popUpElem.firstElementChild.childElementCount).toBe(9);
                        helper.triggerKeyNativeEvent(13);
                        done();
                    });
                });
            });
            it('Ej2-54448 - When data is save as json , values parameter are not available->', (done: Function) => {
                const json: object = { Workbook: { sheets: [{ rows: [{ cells: [{ value: '1' }] }, { cells: [{ value: '2' }] },
                { cells: [{ value: '3' }] }, { cells: [{ value: '4' }] }, { cells: [{ value: '5' }] }, 
                {index: 84, cells: [{ formula: '=SUM(A1:A5)' }] }] }],  selectedRange: 'A85'  }  }
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.openFromJson({ file: json});
                setTimeout(() => {
                    spreadsheet.sheets[0].topLeftCell = 'A80'
                    spreadsheet.dataBind();
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[84].cells[0].value).toBe(15);
                        done();
                    });
                });
            });
            it('EJ2-63297 - String concatenation formula not works properly when the formula contains space with string value->', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=A85 & "test"' }, 'A86']);
                const sheet: SheetModel = helper.getInstance().sheets[0];
                expect(sheet.rows[85].cells[0].value).toBe('15test');
                helper.invoke('updateCell', [{ formula: '=A85&"test"' }, 'A87']);
                expect(sheet.rows[86].cells[0].value).toBe('15test');
                helper.invoke('updateCell', [{ formula: '=A85 & " test"' }, 'A88']);
                expect(sheet.rows[87].cells[0].value).toBe('15 test');
                done();
            });
        });
        describe('EJ2-46382->', () => {
            const model: SpreadsheetModel = { sheets: [{ rows: [{ cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] }, { cells:
                [{ value: '4' }] }, { cells: [{ value: '5' }] }, { cells: [{ formula: '=SUM(A1:A5)' }] }], selectedRange: 'A5' }] };
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Formula dependent cells not updated after destroy the spreadsheet', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'Formula' }, 'B1']);
                helper.invoke('destroy');
                setTimeout(() => {
                    new Spreadsheet(model, '#' + helper.id);
                    setTimeout(() => {
                        helper.invoke('updateCell', [{ value: '10' }, 'A5']);
                        expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toBe(20);
                        expect(helper.invoke('getCell', [0, 2]).textContent).toBe('');
                        done();
                    });
                });
            });
        });
        describe('EJ2-52160, EJ2-56672', () => {
            let rows: RowModel[];
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [
                        { cells: [{ }] },
                        { cells: [{ value: 'Entity 1' }, { value: '100' }, { value: '200' }, { value: '300' }] },
                        { cells: [{ value: 'Entity 1' }] },
                        { cells: [{ value: 'Entity 2' }, { value: '100' }, { value: '200' }, { value: '300' }] },
                        { cells: [{ value: 'Entity 1' }] },
                        { cells: [{ value: 'Entity 3' }, { value: '300' }, { value: '400' }, { value: '500' }] },
                        { cells: [{ value: 'Entity 4' }, { value: '1' }, { value: '3' }, { value: '5' }] },
                        { cells: [{ value: 'Entity 5' }, { value: '2' }, { value: '4' }, { value: '6' }] },
                        { cells: [{ value: 'Entity 2' }] },
                        { cells: [{ value: 'Entity 3' }] },
                        {  cells: [{ }]},
                        {  cells: [{ value: 'cat' }, { formula: '=UNIQUE(A12:A100)' }, { formula: '=IFS(B12=0,"null",TRUE,B12)' } ]},
                        {  cells: [{ value: 'dog' } ]},
                        {  cells: [{ value: 'lion' } ]},
                        {  cells: [{ value: 'tiger' } ]}
                    ] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-52160 - UNIQUE function on multiple columns doesnot work properly', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=UNIQUE(A1:D10)' }, 'G2']);
                expect(helper.getInstance().sheets[0].rows[1].cells[6].formula).toBe('=UNIQUE(A1:D10)');
                expect(helper.getInstance().sheets[0].rows[1].cells[6].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[1].cells[7].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[2].cells[6].value).toBe('Entity 1');
                expect(helper.getInstance().sheets[0].rows[9].cells[6].value).toBe('Entity 3');
                expect(helper.getInstance().sheets[0].rows[9].cells[7].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[9].cells[8].value).toBe('0');
                expect(helper.getInstance().sheets[0].rows[9].cells[9].value).toBe('0');
                done();
            });
            it('EJ2-56672 - To refresh the all dependent cells for a formula that refers another formula cell->', (done: Function) => {
                rows = helper.getInstance().sheets[0].rows;
                expect(rows[11].cells[1].formula).toBe('=UNIQUE(A12:A100)');
                expect(rows[11].cells[2].formula).toBe('=IFS(B12=0,"null",TRUE,B12)');
                expect(rows[11].cells[1].value).toBe('cat');
                expect(rows[12].cells[1].value).toBe('dog');
                expect(rows[13].cells[1].value).toBe('lion');
                expect(rows[14].cells[1].value).toBe('tiger');
                expect(rows[15].cells[1].value).toBeUndefined;
                expect(rows[11].cells[2].value).toBe('cat');
                helper.invoke('autoFill', ['C13:C20', 'C12', 'Down', 'FillWithoutFormatting']);
                expect(rows[12].cells[2].value).toBe('dog');
                expect(rows[13].cells[2].value).toBe('lion');
                expect(rows[14].cells[2].value).toBe('tiger');
                expect(rows[15].cells[2].value).toBeUndefined; 
                expect(rows[16].cells[2].value).toBeUndefined;
                helper.invoke('updateCell', [{ value: 'hippo' }, 'A15']);
                expect(rows[14].cells[1].value).toBe('hippo');
                expect(rows[14].cells[2].value).toBe('hippo');
                done();
            });
            it('EJ2-56672 - Unique formula cell value throws #spill error on refresh ->', (done: Function) => {
                expect(rows[11].cells[1].formula).toBe('=UNIQUE(A12:A100)');
                expect(rows[11].cells[1].value).toBe('cat');
                helper.getInstance().refresh();
                setTimeout(() => {
                    expect(rows[11].cells[1].value).toBe('cat');
                    done();
                });
            });
        });
        describe('EJ2-42389, EJ2-49476, EJ2-49549->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: '4' }] }, { cells: [{ value: '5' }] }, { cells: [{ }] }, { cells: [{ value: '10' }] }, {cells: [{ value: '20'}] }, { cells: [{ value: '30'}] } ] }, 
                    { rows: [{ cells: [{ index: 1, value: '4' }, { index: 3, value: '1' }, { value: '3' }] }, { cells: [{ index: 1, value: '5'}, { index: 3, value: '2' }, { value: '2' }] }, 
                    { cells: [{ index: 3, value: '3' }, { value: '1'}] }, { cells: [{ value: '20'}, { index: 3, value: '2' }, { value: '5' }] }, { cells: [{ value: '202'}, { index: 3, value: '1' }, { value: '1' }] }, 
                    { cells: [{ value: '202'}, { index: 3, value: '5' }, { value: '8' }] } ] }, 
                    { rows: [{ cells: [{ formula:'=(sheet1!a2*sheet2!b2)+(sheet1!a1/sheet2!b1)' }] }] }], activeSheetIndex: 2 }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-42389 - Cross tab formula issue', (done: Function) => {
                expect(helper.getInstance().sheets[2].rows[0].cells[0].formula).toBe('=(sheet1!a2*sheet2!b2)+(sheet1!a1/sheet2!b1)');
                expect(helper.getInstance().sheets[2].rows[0].cells[0].value).toBe('26');
                helper.invoke('updateCell', [{ value: '25' }, 'Z25']);
                helper.invoke('updateCell', [{ formula: '=sum(a1:a4)+sheet3!z25' }, 'B1']);
                expect(helper.getInstance().sheets[2].rows[0].cells[1].formula).toBe('=sum(a1:a4)+sheet3!z25');
                expect(helper.getInstance().sheets[2].rows[0].cells[1].value).toBe('51');
                helper.invoke('updateCell', [{ value: '25' }, 'B2']);
                helper.invoke('updateCell', [{ formula: '=(b2*25%)+(sheet3!Z25*1.125)' }, 'C1']);
                expect(helper.getInstance().sheets[2].rows[0].cells[2].formula).toBe('=(b2*25%)+(sheet3!Z25*1.125)');
                expect(helper.getInstance().sheets[2].rows[0].cells[2].value).toBe('34.375');
                done();
            });
            it('EJ2-49476 - improve the UI level formula enhancements for cross tab formula support in spraedsheet', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=B5+Sheet1!A5+Sheet1!A6+Sheet2!A5' }, 'A5']);
                expect(helper.getInstance().sheets[2].rows[4].cells[0].formula).toBe('=B5+Sheet1!A5+Sheet1!A6+Sheet2!A5');
                expect(helper.getInstance().sheets[2].rows[4].cells[0].value).toBe('252');
                helper.invoke('updateCell', [{ value: '444' }, 'B6']);
                helper.invoke('updateCell', [{ formula: '=B6+Sheet1!A5+Sheet1!A6' }, 'A6']);
                expect(helper.getInstance().sheets[2].rows[5].cells[0].formula).toBe('=B6+Sheet1!A5+Sheet1!A6');
                expect(helper.getInstance().sheets[2].rows[5].cells[0].value).toBe('494');
                helper.invoke('updateCell', [{ formula: '=B6+Sheet1!A5+Sheet2!A5' }, 'A7']);
                expect(helper.getInstance().sheets[2].rows[6].cells[0].formula).toBe('=B6+Sheet1!A5+Sheet2!A5');
                expect(helper.getInstance().sheets[2].rows[6].cells[0].value).toBe('666');
                helper.invoke('updateCell', [{ formula: '=(B6+Sheet1!A5)' }, 'A8']);
                expect(helper.getInstance().sheets[2].rows[7].cells[0].formula).toBe('=(B6+Sheet1!A5)');
                expect(helper.getInstance().sheets[2].rows[7].cells[0].value).toBe('464');
                helper.invoke('updateCell', [{ formula: '=(Sheet1!A5+B6)' }, 'A9']);
                expect(helper.getInstance().sheets[2].rows[8].cells[0].formula).toBe('=(Sheet1!A5+B6)');
                expect(helper.getInstance().sheets[2].rows[8].cells[0].value).toBe('464');
                helper.invoke('updateCell', [{ formula: '=(Sheet1!A5+B6)' }, 'A10']);
                expect(helper.getInstance().sheets[2].rows[9].cells[0].formula).toBe('=(Sheet1!A5+B6)');
                expect(helper.getInstance().sheets[2].rows[9].cells[0].value).toBe('464');
                helper.invoke('updateCell', [{ formula: '=Sheet2!A5+A5' }, 'A11']);
                expect(helper.getInstance().sheets[2].rows[10].cells[0].formula).toBe('=Sheet2!A5+A5');
                expect(helper.getInstance().sheets[2].rows[10].cells[0].value).toBe('454');
                helper.invoke('updateCell', [{ formula: '=Sheet1!A5+B6' }, 'A12']);
                expect(helper.getInstance().sheets[2].rows[11].cells[0].formula).toBe('=Sheet1!A5+B6');
                expect(helper.getInstance().sheets[2].rows[11].cells[0].value).toBe('464');
                done();
            });
            it('EJ2-49549 - Deleting a whole row on sheet that references other sheets changes values to #REF!-Issue 1', (done: Function) => {
                helper.invoke('updateCell', [{ formula: '=IF(SUMIF(Sheet2!$D1:$D6,">3",Sheet2!$E1:$E6)>3,1)' }, 'A14']);
                helper.invoke('updateCell', [{ formula: '=SUM(Sheet2!D1:E1)' }, 'C14']);
                helper.invoke('updateCell', [{ formula: '=IF(Sheet2!D1>0,1,0)' }, 'D14']);
                helper.invoke('updateCell', [{ value: '5' }, 'D15']);
                expect(helper.getInstance().sheets[2].rows[14].cells[3].value).toBe(5);
                helper.invoke('delete', [14, 14, 'Row']);
                setTimeout(function () {
                    expect(helper.getInstance().sheets[2].rows[13].cells[0].value).toBe('1');
                    expect(helper.getInstance().sheets[2].rows[13].cells[2].value).toBe(4);
                    expect(helper.getInstance().sheets[2].rows[13].cells[3].value).toBe('1');
                    done();
                });
            });
            it('DAYS formula returns NAN value for string formatted date value', (done: Function) => {
                helper.edit('F1', '=DAYS("7/24/1969", "7/16/1969")');
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 5]);
                const cell: any = helper.getInstance().getActiveSheet().rows[0].cells[5];
                expect(cell.value).toBe(8);
                expect(cellEle.textContent).toBe('8');
                helper.edit('E1', '7/24/1969');
                helper.edit('E2', '7/16/1969');
                helper.edit('F1', '=DAYS(E1,E2)');
                expect(cell.value).toBe(8);
                expect(cellEle.textContent).toBe('8');
                helper.edit('F1', '=DAYS(8, 4)');
                expect(cell.value).toBe(4);
                expect(cellEle.textContent).toBe('4');
                helper.edit('F1', '=DAYS("18", "4")');
                expect(cell.value).toBe(14);
                expect(cellEle.textContent).toBe('14');
                helper.edit('F1', '=DAYS("2-june-2016","2-may-2016")');
                expect(cell.value).toBe(31);
                expect(cellEle.textContent).toBe('31');
                helper.edit('F1', '=DAYS("October 22","October 12")');
                expect(cell.value).toBe(10);
                expect(cellEle.textContent).toBe('10');
                helper.edit('F1', '=DAYS("October 22, 2016","October 12, 2016")');
                expect(cell.value).toBe(10);
                expect(cellEle.textContent).toBe('10');
                helper.edit('F1', '=DAYS("November 2020", "October 2020")');
                expect(cell.value).toBe(31);
                expect(cellEle.textContent).toBe('31');
                done();
            });
        });
        describe('EJ2-63727 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [
                        { rows: [
                            { cells: [{ value: 'Residential' }, { value: '11' }] },
                            { cells: [{ value: '22', index: 1 }] },
                            { cells: [{ value: 'Residential' }, { value: '33' }] },
                            { cells: [{ value: 'New-Residential' }, { formula: '=SUM(B2:B3)' }] },
                            { index: 5, cells: [{ value: '10' }, { value: 'Residential' }] },
                            { cells: [{ value: '20' }, { value: 'Residential' }] },
                            { cells: [{ value: '30' }, { value: 'Residential' }] },
                            { cells: [{ value: '40' }, { value: 'New-Residential' }] },
                            { cells: [{ index: 5, value: '11' }, { value: '1' }] },
                            { cells: [{ index: 1, value: 'Residential' }, { value: 'New-Residential' }, { index: 5, value: '22' }, { value: '2' }] },
                            { cells: [{ index: 1, value: 'Residential' }, { value: 'New-Residential' }, { index: 5, value: '33' }, { value: '3' }] },
                            { cells: [{ index: 1, value: 'New-Residential' }, { value: 'Residential' }, { index: 5, value: '44' }, { value: '4' }] },
                            { cells: [{ index: 1, value: 'New-Residential' }, { value: 'Residential' }, { value: 'Residential' }, { value: 'New-Residential' }] },
                            { cells: [{ index: 3, value: 'New-Residential' }, { value: 'Residential' }] },
                            { cells: [{ index: 3, value: 'Residential' }, { value: 'New-Residential' }] },
                            { cells: [{ index: 3, value: 'New-Residential' }, { value: 'Residential' }] }
                        ]},
                        { rows: [
                            { cells: [{ value: 'Residential' }, { value: '1' }] },
                            { cells: [{ value: 'Residential' }, { value: '2' }] },
                            { cells: [{ value: 'Residential' }, { value: '3' }] },
                            { cells: [{ value: 'New-Residential' }, { value: '4' }] }
                        ]},
                        { rows: [
                            { cells: [{ value: 'Residential' }, { value: '111' }] },
                            { cells: [{ value: 'Residential' }, { value: '222' }] },
                            { cells: [{ value: 'Residential' }, { value: '333' }] },
                            { cells: [{ value: 'New-Residential' }, { value: '444' }] }
                        ]}
                    ] 
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Formula ( =SUMIFS ) not working as expected when referring values in other sheets', (done: Function) => {
                helper.edit('D1', '=SUMIFS(B1:B3,A1:A3,"=Residential")');
                helper.edit('E1', '=SUMIFS(Sheet2!B1:B3,Sheet2!A1:A3,"=Residential")');
                helper.edit('F1', '=SUMIFS(Sheet3!B1:B3,Sheet2!A1:A3,"=Residential")');
                helper.edit('G1', '=SUMIFS(B1:B3,Sheet2!A1:A3,"=Residential")');
                helper.edit('H1', '=SUMIFS(Sheet3!B1:B3,A1:A3,"=Residential")');
                helper.edit('D2', '=SUMIFS(B1:B4,A1:A4,"New-Residential")');
                helper.edit('E2', '=SUMIFS(Sheet2!B1:B4,Sheet3!B1:B4,"<=333")');
                helper.edit('F2', '=SUMIFS(Sheet2!B1:B4,Sheet3!B1:B4,">=333")');
                helper.edit('G2', '=SUMIFS(B1:B4,A1:A4,"=")');
                helper.edit('H2', '=SUMIFS(B1:B4,A1:A4,"<>")');
                helper.edit('D3', '=SUMIFS(A6:A9,Sheet2!A1:A4,Sheet2!A4,Sheet3!A1:A4,Sheet3!A4)');
                helper.edit('E3', '=SUMIFS(A6:A9,Sheet2!A1:A4,Sheet2!A3,Sheet3!A1:A4,Sheet3!A3)');
                helper.edit('F3', '=SUMIFS(Sheet3!B1:B4,Sheet2!A1:A4,Sheet2!A4,A1:A4,A4)');
                helper.edit('G3', '=SUMIFS(Sheet2!B1:B4,A1:A4,A1,Sheet3!A1:A4,Sheet3!A1)');
                helper.edit('H3', '=SUMIFS(A6:A9,A1:A4,A1)');
                helper.edit('D4', '=SUMIFS(B1:B4,A6:A9,SUM(H3:I3))');
                helper.edit('E4', '=SUMIFS(F10:G13,Sheet2!A1:B4,"=R*")');
                helper.edit('F4', '=SUMIFS(F10:G13,B11:C14,B11,D14:E17,"=N*")');
                helper.edit('G4', '=SUMIFS(Sheet3!B1:C4,B11:C14,B11)');
                helper.edit('I10', '=SUMIFS(F10:G13,B11:C14,C11)');
                helper.edit('J10', '=SUMIFS(F10:G13,B11:C14,B11)');
                helper.edit('k10', '=SUMIFS(F10:G13,B11:C14,C11,D14:E17,E14)');
                helper.edit('L10', '=SUMIFS(F10:G13,B11:C14,B14,D14:E17,D14)');
                helper.edit('I11', '=AVERAGEIFS(B1:B4,A1:A4,"New-Residential")');
                helper.edit('J11', '=AVERAGEIFS(Sheet2!B1:B4,Sheet3!B1:B4,"<=333")');
                helper.edit('k11', '=AVERAGEIFS(Sheet2!B1:B4,Sheet3!B1:B4,">=333")');
                helper.edit('L11', '=AVERAGEIFS(B1:B4,A1:A4,"=")');
                helper.edit('M11', '=AVERAGEIFS(B1:B4,A1:A4,"<>")');
                helper.edit('I12', '=AVERAGEIFS(A6:A9,Sheet2!A1:A4,Sheet2!A4,Sheet3!A1:A4,Sheet3!A4)');
                helper.edit('J12', '=AVERAGEIFS(A6:A9,Sheet2!A1:A4,Sheet2!A3,Sheet3!A1:A4,Sheet3!A3)');
                helper.edit('k12', '=AVERAGEIFS(Sheet3!B1:B4,Sheet2!A1:A4,Sheet2!A4,A1:A4,A4)');
                helper.edit('L12', '=AVERAGEIFS(Sheet2!B1:B4,A1:A4,A1,Sheet3!A1:A4,Sheet3!A1)');
                helper.edit('M12', '=AVERAGEIFS(A6:A9,A1:A4,A1)');
                helper.edit('I13', '=COUNTIFS(A1:A4,"New-Residential")');
                helper.edit('J13', '=COUNTIFS(Sheet3!B1:B4,"<=333")');
                helper.edit('k13', '=COUNTIFS(Sheet3!B1:B4,">=333")');
                helper.edit('L13', '=COUNTIFS(A1:A4,"=")');
                helper.edit('M13', '=COUNTIFS(A1:A4,"<>")');
                helper.edit('I14', '=COUNTIFS(Sheet2!A1:A4,Sheet2!A4,Sheet3!A1:A4,Sheet3!A4)');
                helper.edit('J14', '=COUNTIFS(Sheet2!A1:A4,Sheet2!A3,Sheet3!A1:A4,Sheet3!A3)');
                helper.edit('k14', '=COUNTIFS(Sheet2!A1:A4,Sheet2!A4,A1:A4,A4)');
                helper.edit('L14', '=COUNTIFS(A1:A4,A1,Sheet3!A1:A4,Sheet3!A1)');
                helper.edit('M14', '=COUNTIFS(B11:C14,B11,D14:E17,D15)');
                helper.edit('I15', '=AVERAGEIFS(F10:G13,Sheet2!A1:B4,"=R*")');
                helper.edit('J15', '=AVERAGEIFS(F10:G13,B11:C14,B11,D14:E17,"=N*")');
                helper.edit('k15', '=AVERAGEIFS(Sheet3!B1:C4,B11:C14,B11)');
                helper.edit('I16', '=COUNTIFS(Sheet2!A1:B4,"=R*")');
                helper.edit('J16', '=COUNTIFS(B11:C14,B11,D14:E17,"=N*")');
                helper.edit('k16', '=COUNTIFS(Sheet3!A1:B4,"=R*")');
                expect(helper.invoke('getCell', [0, 3]).textContent).toBe('44');
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('6');
                expect(helper.invoke('getCell', [0, 5]).textContent).toBe('666');
                expect(helper.invoke('getCell', [0, 6]).textContent).toBe('66');
                expect(helper.invoke('getCell', [0, 7]).textContent).toBe('444');
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('55');
                expect(helper.invoke('getCell', [1, 4]).textContent).toBe('6');
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('7');
                expect(helper.invoke('getCell', [1, 6]).textContent).toBe('22');
                expect(helper.invoke('getCell', [1, 7]).textContent).toBe('99');
                expect(helper.invoke('getCell', [2, 3]).textContent).toBe('40');
                expect(helper.invoke('getCell', [2, 4]).textContent).toBe('60');
                expect(helper.invoke('getCell', [2, 5]).textContent).toBe('444');
                expect(helper.invoke('getCell', [2, 6]).textContent).toBe('4');
                expect(helper.invoke('getCell', [2, 7]).textContent).toBe('40');
                expect(helper.invoke('getCell', [3, 3]).textContent).toBe('55');
                expect(helper.invoke('getCell', [3, 4]).textContent).toBe('66');
                expect(helper.invoke('getCell', [3, 5]).textContent).toBe('25');
                expect(helper.invoke('getCell', [3, 6]).textContent).toBe('333');
                expect(helper.invoke('getCell', [9, 8]).textContent).toBe('80');
                expect(helper.invoke('getCell', [9, 9]).textContent).toBe('40');
                expect(helper.invoke('getCell', [9, 10]).textContent).toBe('45');
                expect(helper.invoke('getCell', [9, 11]).textContent).toBe('35');
                expect(helper.invoke('getCell', [10, 8]).textContent).toBe('55');
                expect(helper.invoke('getCell', [10, 9]).textContent).toBe('2');
                expect(helper.invoke('getCell', [10, 10]).textContent).toBe('3.5');
                expect(helper.invoke('getCell', [10, 11]).textContent).toBe('22');
                expect(helper.invoke('getCell', [10, 12]).textContent).toBe('33');
                expect(helper.invoke('getCell', [11, 8]).textContent).toBe('40');
                expect(helper.invoke('getCell', [11, 9]).textContent).toBe('20');
                expect(helper.invoke('getCell', [11, 10]).textContent).toBe('444');
                expect(helper.invoke('getCell', [11, 11]).textContent).toBe('2');
                expect(helper.invoke('getCell', [11, 12]).textContent).toBe('20');
                expect(helper.invoke('getCell', [12, 8]).textContent).toBe('1');
                expect(helper.invoke('getCell', [12, 9]).textContent).toBe('3');
                expect(helper.invoke('getCell', [12, 10]).textContent).toBe('2');
                expect(helper.invoke('getCell', [12, 11]).textContent).toBe('1');
                expect(helper.invoke('getCell', [12, 12]).textContent).toBe('3');
                expect(helper.invoke('getCell', [13, 8]).textContent).toBe('1');
                expect(helper.invoke('getCell', [13, 9]).textContent).toBe('3');
                expect(helper.invoke('getCell', [13, 10]).textContent).toBe('1');
                expect(helper.invoke('getCell', [13, 11]).textContent).toBe('2');
                expect(helper.invoke('getCell', [13, 12]).textContent).toBe('2');
                expect(helper.invoke('getCell', [14, 8]).textContent).toBe('22');
                expect(helper.invoke('getCell', [14, 9]).textContent).toBe('12.5');
                expect(helper.invoke('getCell', [14, 10]).textContent).toBe('166.5');
                expect(helper.invoke('getCell', [15, 8]).textContent).toBe('3');
                expect(helper.invoke('getCell', [15, 9]).textContent).toBe('2');
                expect(helper.invoke('getCell', [15, 10]).textContent).toBe('3');
                done();
            });
        });
    });
    describe('Stability ->', () => {
        describe('SUM Formula', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [
                            {
                                ranges: [{ dataSource: defaultData }]
                            }, {}
                        ]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Sum basic', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: 5 }, 'I1']);
                helper.invoke('updateCell', [{ value: 5 }, 'I2']);
                helper.invoke('updateCell', [{ formula: '=SUM(I1:I2)' }, 'I3']);
                helper.invoke('updateCell', [{ formula: '=I3' }, 'J3']);
                helper.invoke('updateCell', [{ formula: '=I3+I2' }, 'K3']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(10);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(10);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[10].value)).toEqual(15);
                done();
            });
            it('Sum refersh', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: 10 }, 'I1']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(15);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(15);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[10].value)).toEqual(20);
                done();
            });
            it('Sum with text', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: "spreadsheet" }, 'I1']);
                helper.invoke('updateCell', [{ formula: '=SUM(I1:I2)' }, 'I3']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(5);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(5);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[10].value)).toEqual(10);
                done();
            });
            it('Sum with all text', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: "spreadsheet" }, 'I2']);
                helper.invoke('updateCell', [{ formula: '=SUM(I1:I2)' }, 'I3']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(0);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(0);
                done();
            });
            it('Nested formula', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: "spreadsheet" }, 'I2']);
                helper.invoke('updateCell', [{ formula: '=SUM(D2:E7,SUM(D2:D7))' }, 'I7']);
                helper.invoke('updateCell', [{ formula: '=I7' }, 'I8']);
                expect(parseInt(spreadsheet.sheets[0].rows[6].cells[8].value)).toEqual(385);
                expect(parseInt(spreadsheet.sheets[0].rows[7].cells[8].value)).toEqual(385);
                done();
            });
            it('Cell reference with other sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: 5 }, 'L1']);
                helper.invoke('updateCell', [{ value: 5 }, 'L2']);
                helper.invoke('updateCell', [{ formula: '=SUM(L1:L2)' }, 'L3']);
                helper.invoke('updateCell', [{ formula: '=L3' }, 'L4']);
                helper.invoke('goTo', ['Sheet2!A2']);
                setTimeout(function () {
                    helper.invoke('updateCell', [{ formula: '=Sheet1!L3' }, 'A3']);
                    expect(parseInt(spreadsheet.sheets[1].rows[2].cells[0].value)).toEqual(10);
                    helper.invoke('updateCell', [{ value: 15 }, 'Sheet1!L1']);
                    expect(parseInt(spreadsheet.sheets[1].rows[2].cells[0].value)).toEqual(20);
                    done();
                });
            });
        })
        describe('SUMIF Formula', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [
                            {
                                ranges: [{ dataSource: defaultData }]
                            }, {}
                        ]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Sumif basic', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ formula: '=SUMIF(D2:D7,">10")' }, 'I3']);
                helper.invoke('updateCell', [{ formula: '=I3' }, 'J3']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(125);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(125);
                done();
            });
            it('Sumif refersh', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: 30 }, 'D2']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(155);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(155);
                done();
            });
            it('Sumif with text', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: "spreadsheet" }, 'D3']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(135);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(135);
                done();
            });
            it('Sumif with all text', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ formula: '=SUM(D4:D6)' }, 'D7']);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[8].value)).toEqual(160);
                expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(160);
                done();
            });
            it('Cell reference with other sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('goTo', ['Sheet2!A2']);
                setTimeout(function () {
                    helper.invoke('updateCell', [{ formula: '=Sheet1!I3' }, 'A3']);
                    expect(parseInt(spreadsheet.sheets[1].rows[2].cells[0].value)).toEqual(160);
                    helper.invoke('updateCell', [{ formula: '=Sheet2!A3' }, 'A4']);
                    expect(parseInt(spreadsheet.sheets[1].rows[2].cells[0].value)).toEqual(160);
                    done();
                });
            });
        });
    });
    describe('EJ2-62007 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Issue in applying large formula in sheet.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('updateCell', [{ formula: '=LARGE(A1:B100,4)' }, 'J3']);
            expect(parseInt(spreadsheet.sheets[0].rows[2].cells[9].value)).toEqual(41964);
            done();
        });
    });
    describe('EJ2-62878, EJ2-62887 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '1' }] }, { cells: [{ value: '2' }] }, { cells: [{ value: '3' }] }] }, {} ]}, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Console error on deleting or inserting rows and cannot able to delete a row', (done: Function) => {
            helper.getElement('.e-sheet-tab').querySelectorAll('.e-toolbar-item')[1].click();
            setTimeout(() => {
                helper.edit('A1', '=UNIQUE(Sheet1!A1:A3)');
                helper.getElement('.e-sheet-tab').querySelectorAll('.e-toolbar-item')[0].click();
                setTimeout(() => {
                    expect(getCell(2, 0, helper.getInstance().sheets[0]).value).toBe('3');
                    expect(getCell(0, 0, helper.getInstance().sheets[1]).formula).toBe('=UNIQUE(Sheet1!A1:A3)');
                    helper.invoke('delete', [2, 2, 'Row']);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[2]).toBeUndefined();
                        expect(getCell(0, 0, helper.getInstance().sheets[1]).formula).toBe('=UNIQUE(Sheet1!A1:A2)');
                        helper.invoke('insertRow', [1, 1]);
                        expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('2');
                        expect(getCell(0, 0, helper.getInstance().sheets[1]).formula).toBe('=UNIQUE(Sheet1!A1:A3)');
                        done();
                    }, 10);
                });
            });
        });
        it('The formula reference not updated properly while pasting the formula with multiple cells', (done: Function) => {
            const sheet: SheetModel = helper.getInstance().sheets[0];
            helper.invoke('updateCell', [{ formula: '=A1+B1' }, 'B2']);
            helper.invoke('updateCell', [{ formula: '=A1+AA1' }, 'B3']);
            helper.invoke('updateCell', [{ formula: '=AA1+AAA1' }, 'B4']);
            helper.invoke('updateCell', [{ formula: '=A1+AA1+AAA1' }, 'B5']);
            helper.invoke('copy', ['B2:B5']).then(() => {
                helper.invoke('paste', ['C2']);
                expect(sheet.rows[1].cells[2].formula).toBe('=B1+C1');
                expect(sheet.rows[2].cells[2].formula).toBe('=B1+AB1');
                expect(sheet.rows[3].cells[2].formula).toBe('=AB1+AAB1');
                expect(sheet.rows[4].cells[2].formula).toBe('=B1+AB1+AAB1');
                done();
            });
        });
    });
    describe('EJ2-64655->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: '179.75' }] }, { cells: [{ value: '179.725' }] }, { cells: [{ value: '179.7235' }] }, { cells: [{ value: '179.22345' }] }, { cells: [{ value: '179.323455' }] }, { cells: [{ value: '179.8234505' }] }, { cells: [{ value: '-179.725' }] }] }, {}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Rounding formula not works properly when the last digit contains 5', (done: Function) => {
            helper.edit('B1', '=round(A1, 1)');
            expect(helper.invoke('getCell', [0, 1]).textContent).toBe('179.8');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[1])).toBe('{"value":"179.8","formula":"=round(A1, 1)"}');
            helper.edit('B2', '=round(A2, 2)');
            expect(helper.invoke('getCell', [1, 1]).textContent).toBe('179.73');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[1])).toBe('{"value":"179.73","formula":"=round(A2, 2)"}');
            helper.edit('B3', '=round(A3, 3)');
            expect(helper.invoke('getCell', [2, 1]).textContent).toBe('179.724');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[1])).toBe('{"value":"179.724","formula":"=round(A3, 3)"}');
            helper.edit('B4', '=round(A4, 4)');
            expect(helper.invoke('getCell', [3, 1]).textContent).toBe('179.2235');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[1])).toBe('{"value":"179.2235","formula":"=round(A4, 4)"}');
            helper.edit('B5', '=round(A5, 5)');
            expect(helper.invoke('getCell', [4, 1]).textContent).toBe('179.32346');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[1])).toBe('{"value":"179.32346","formula":"=round(A5, 5)"}');
            helper.edit('B6', '=round(A6, 6)');
            expect(helper.invoke('getCell', [5, 1]).textContent).toBe('179.823451');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[1])).toBe('{"value":"179.823451","formula":"=round(A6, 6)"}');
            helper.edit('B7', '=round(A7, 2)');
            expect(helper.invoke('getCell', [6, 1]).textContent).toBe('-179.73');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[1])).toBe('{"value":"-179.73","formula":"=round(A7, 2)"}');
            done();
        });
    });
    describe('EJ2-65615-> Row wise', () => {
        const model: SpreadsheetModel = {
            sheets: [{
                rows: [{ cells: [{ value: '1' }, { value: '1' }] }, { cells: [{ value: '2' }, { value: '' }] }, { cells: [{ value: '3' }, { value: '1' }] }, { cells: [{ value: '4' }, { value: '1' }] }, { cells: [{ value: '5' }, { value: '1' }] }]
            }]
        };
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet(model, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('COUNT formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(5);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=COUNT(A1:A6)');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(5);
                helper.edit('A6', '1');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(6);
                done();
            })
        });
        it('COUNTIF formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=COUNTIF(A1:A6,"=0")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(0);
                helper.edit('A6', '0');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(1);
                done();
            })
        });
        it('COUNTIFS formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=COUNTIFs(A1:A6,"=1",B1:B6,"=1")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(1);
                helper.edit('A6', '1');
                helper.edit('B6', '1');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(2);
                done();
            })
        });
        it('SUM function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=SUM(A1:A6)');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(15);
                helper.edit('A6', '6');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(21);
                done();
            })
        });
        it('SUMIF function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=SUMIF(A1:A6,"=1")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(1);
                helper.edit('A6', '1');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(2);
                done();
            })
        });
        it('SUMIFS function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=SUMIFS(A1:A6,B1:B6,"=0")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(0);
                helper.edit('A6', '6');
                helper.edit('B2', '0');
                helper.edit('B6', '0');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(8);
                done();
            })
        });
        it('AVERAGE formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('3');
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=AVERAGE(A1:A6)');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('3');
                helper.edit('A6', '6');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('3.5');
                done();
            })
        });
        it('AVERAGEIF formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A2', '');
            helper.edit('A6', '=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(NaN);
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=AVERAGEIF(A1:A6,"=0")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(NaN);
                helper.edit('A6', '0');
                helper.edit('A2', '0');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(0);
                done();
            })
        });
        it('AVERAGEIFS formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#DIV/0!');
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=AVERAGEIFS(A1:A6,B1:B6,"=0")');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('#DIV/0!');
                helper.edit('A6', '6');
                helper.edit('B2', '0');
                helper.edit('B6', '0');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual(4);
                done();
            })
        });
        it('MAX formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('5');
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=MAX(A1:A6)');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('5');
                helper.edit('A6', '6');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('6');
                done();
            })
        });
        it('MIN formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('A6', '=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('1');
            helper.invoke('insertRow', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].formula).toEqual('=MIN(A1:A6)');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('1');
                helper.edit('A6', '0');
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toEqual('0');
                done();
            })
        });
        it('Using wrong address in formula argument does not throws any error', (done: Function) => {
            helper.edit('A6', '=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(5);
            helper.edit('A6', '=COUNT(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=COUNTIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=COUNTIFS(A1:A5,"=1",1B:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFS(A1:A5,"=1",1B:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUMIF(A1:5A,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIF(A1:5A,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=SUMIFS(A1:A5,B1:5B,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A5,B1:5B,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('3');
            helper.edit('A6', '=AVERAGE(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGE(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(NaN);
            helper.edit('A6', '=AVERAGEIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#DIV/0!');
            helper.edit('A6', '=AVERAGEIFS(A1:5A,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIFS(A1:5A,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('5');
            helper.edit('A6', '=MAX(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MAX(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            helper.edit('A6', '=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('1');
            helper.edit('A6', '=MIN(A1:5A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MIN(A1:5A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#VALUE!');
            done();
        });
    });
    describe('EJ2-65615-> Column wise ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ rows: [{ cells: [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }] }, { cells: [{ value: '1' }, { value: '' }, { value: '1' }, { value: '1' }, { value: '1' }] }] }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('COUNT formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=COUNT(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=COUNT(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(5);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=COUNT(A1:F1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(5);
                helper.edit('F1', '1');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(6);
                done();
            })
        });
        it('COUNTIF formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=COUNTIF(A1:E1,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=COUNTIF(A1:E1,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(0);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=COUNTIF(A1:F1,"=0")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(0);
                helper.edit('F1', '0');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(1);
                done();
            })
        });
        it('COUNTIFS formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=COUNTIFS(A1:E1,"=1",A2:E2,"=1")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=COUNTIFS(A1:E1,"=1",A2:E2,"=1")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(1);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=COUNTIFS(A1:F1,"=1",A2:F2,"=1")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(1);
                helper.edit('F1', '1');
                helper.edit('F2', '1');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(2);
                done();
            })
        });
        it('SUM function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=SUM(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=SUM(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(15);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=SUM(A1:F1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(15);
                helper.edit('F1', '6');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(21);
                done();
            })
        });
        it('SUMIF function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=SUMIF(A1:E1,"=1")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=SUMIF(A1:E1,"=1")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(1);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=SUMIF(A1:F1,"=1")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(1);
                helper.edit('F1', '1');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(2);
                done();
            })
        });
        it('SUMIFS function is not value updated properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=SUMIFS(A1:E1,A2:E2,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=SUMIFS(A1:E1,A2:E2,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(0);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=SUMIFS(A1:F1,A2:F2,"=0")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(0);
                helper.edit('F1', '6');
                helper.edit('B2', '0');
                helper.edit('F2', '0');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(8);
                done();
            })
        });
        it('AVERAGE formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=AVERAGE(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=AVERAGE(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('3');
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=AVERAGE(A1:F1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('3');
                helper.edit('F1', '6');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('3.5');
                done();
            })
        });
        it('AVERAGEIF formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('B1', '');
            helper.edit('F1', '=AVERAGEIF(A1:E1,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=AVERAGEIF(A1:E1,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual(NaN);
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=AVERAGEIF(A1:F1,"=0")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(NaN);
                helper.edit('F1', '0');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(0);
                done();
            })
        });
        it('AVERAGEIFS formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=AVERAGEIFS(A1:E1,A2:E2,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=AVERAGEIFS(A1:E1,A2:E2,"=0")');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('#DIV/0!');
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=AVERAGEIFS(A1:F1,A2:F2,"=0")');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('#DIV/0!');
                helper.edit('F1', '6');
                helper.edit('B2', '0');
                helper.edit('F2', '0');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual(4);
                done();
            })
        });
        it('MAX formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=MAX(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=MAX(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('5');
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=MAX(A1:F1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('5');
                helper.edit('F1', '6');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('6');
                done();
            })
        });
        it('MIN formula is not updated value properly while the new insert and update the value', (done: Function) => {
            helper.edit('F1', '=MIN(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].formula).toEqual('=MIN(A1:E1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('1');
            helper.invoke('insertColumn', [5]);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[6].formula).toEqual('=MIN(A1:F1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('1');
                helper.edit('F1', '0');
                expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toEqual('0');
                done();
            })
        });
    });
    describe('EJ2-66087-> ', () => {
        beforeEach((done: Function) => {
            const addSum = (sourceValue: any, destinationValue: any) => {
                let data = sourceValue + destinationValue;
                return data;
            };
            helper.initializeSpreadsheet({
                sheets: [
                    {
                        name: 'Monthly Budget',
                        rows: [{ cells: [{ value: '1' }, { value: '2' }, { value: '', formula: '=ADDSUM(A1,B1)' }] },
                        { cells: [{ value: '2' }, { value: '3' }, { value: '', formula: '=ADDSUM(A2,B2)' },] },
                        { cells: [{ value: '4' }, { value: '5' }, { value: '', formula: '=ADDSUM(A3,B3)' }] },
                        { cells: [{ value: '5' }, { value: '5' }, { value: '', formula: '=ADDSUM(A4,B4)' }] },
                        { cells: [{ value: '5' }, { value: '6' }, { value: '', formula: '=ADDSUM(A5,B5)' }] }
                        ],
                        columns: [
                            { width: 110 }, { width: 115 }, { width: 110 }, { width: 100 }
                        ]
                    }
                ],
                beforeDataBound: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.addCustomFunction(addSum, 'ADDSUM');
                }
            },
                done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Custom function calculated values are not updated properly in cell data binding', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[2].formula).toEqual('=ADDSUM(A1,B1)');
            expect(helper.getInstance().sheets[0].rows[0].cells[2].value).toEqual("12");
            expect(helper.getInstance().sheets[0].rows[1].cells[2].formula).toEqual('=ADDSUM(A2,B2)');
            expect(helper.getInstance().sheets[0].rows[1].cells[2].value).toEqual("23");
            expect(helper.getInstance().sheets[0].rows[2].cells[2].formula).toEqual('=ADDSUM(A3,B3)');
            expect(helper.getInstance().sheets[0].rows[2].cells[2].value).toEqual("45");
            expect(helper.getInstance().sheets[0].rows[3].cells[2].formula).toEqual('=ADDSUM(A4,B4)');
            expect(helper.getInstance().sheets[0].rows[3].cells[2].value).toEqual("55");
            expect(helper.getInstance().sheets[0].rows[4].cells[2].formula).toEqual('=ADDSUM(A5,B5)');
            expect(helper.getInstance().sheets[0].rows[4].cells[2].value).toEqual("56");
            done();
        });
    });
});