import { SpreadsheetModel, Spreadsheet, BasicModule, DialogBeforeOpenEventArgs } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, getCell, getRangeAddress, DefineNameModel, RowModel, SheetModel } from '../../../src/index';

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
            expect(helper.getInstance().sheets[0].rows[4].cells[9].formula).toBe('=Text(D2, "0%")');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].value).toBe("11.5");
            done();
        });

        it('Lookup formula', (done: Function) => {
            helper.edit('J6', '=LOOKUP(20,D2:D5,E2:E5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].formula).toBe('=LOOKUP(20,D2:D5,E2:E5)');
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

    describe('Formula - Checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('INt formula no Inputs->', (done: Function) => { 
            helper.edit('I1', '=INT();');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"#NAME?","formula":"=INT();"}');
            done();
        });
        it('INt formula for #Value! Error->', (done: Function) => {
            helper.edit('D2', 'N/A');
            helper.edit('I2', '=INT("D2");');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBe('=INT("D2");');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('#VALUE!');
            done();
        });
        it('INt formula with Range in ""->', (done: Function) => {
            helper.edit('D2', '11.5');
            helper.edit('I3', '=INT("D2");');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('11');
            done();
        });
        it('INt formula with Direct Input Value->', (done: Function) => {
            helper.edit('I4', '=INT(12.5);');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('12');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":12,"formula":"=INT(12.5);"}');
            done();
        });
        it('TODAY formula with No Inputs', (done: Function) => {
            helper.edit('I5', '=TODAY(C3);');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"invalid arguments","formula":"=TODAY(C3);"}');
            done();
        });
        it('WEEKDAY formula with No Inputs', (done: Function) => {
            helper.edit('I6', '=WEEKDAY();');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"invalid arguments","formula":"=WEEKDAY();"}');
            done();
        });
        it('WEEKDAY formula', (done: Function) => {
            helper.edit('I7', '=WEEKDAY(B2);');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('6');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":6,"formula":"=WEEKDAY(B2);"}');
            done();
        });
        it('PROPER formula with No Inputs', (done: Function) => {
            helper.edit('I8', '=PROPER();');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":"invalid arguments","formula":"=PROPER();"}');
            done();
        });
        it('PROPER formula with #Name Error', (done: Function) => {
            helper.edit('I9', '=PROPER(sync fusion);');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[8])).toBe('{"value":"#NAME?","formula":"=PROPER(sync fusion);"}');
            done();
        });
        it('PROPER formula', (done: Function) => {
            helper.edit('I10', '=PROPER(A4);');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('Formal Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[8])).toBe('{"value":"Formal Shoes","formula":"=PROPER(A4);"}');
            done();
        });
        it('PROPER formula with input contains "-"', (done: Function) => {
            helper.edit('I11', '=PROPER(A6);');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('FLip- FLops & Slippers');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[8])).toBe('{"value":"FLip- FLops & Slippers","formula":"=PROPER(A6);"}');
            done();
        });
        it('PROPER formula with input contains ","', (done: Function) => {
            helper.edit('A7', 'S,neakers');
            helper.edit('I12', '=PROPER(A7);');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('S,Neakers');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[8])).toBe('{"value":"S,Neakers","formula":"=PROPER(A7);"}');
            done();
        });
        it('SUMPRODUCT formula with No Inputs', (done: Function) => {
            helper.edit('J1', '=SUMPRODUCT();');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"invalid arguments","formula":"=SUMPRODUCT();"}');
            done();
        });
        it('SUMPRODUCT formula with invalid Inputs', (done: Function) => {
            helper.edit('J2', '=SUMPRODUCT(D);');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"#NAME?","formula":"=SUMPRODUCT(D);"}');
            done();
        });
        it('SUMPRODUCT formula which return value as "0" for invalid inputs', (done: Function) => {
            helper.edit('J3', '=SUMPRODUCT("D");');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toBe('=SUMPRODUCT("D");');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('0');
            done();
        });
        it('SUMPRODUCT formula which contains FIrst as null', (done: Function) => {
            helper.edit('D1', '');
            helper.edit('J4', '=SUMPRODUCT(D1:D5);');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('66.5');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":66.5,"formula":"=SUMPRODUCT(D1:D5);"}');
            done();
        });
         it('SUMPRODUCT formula with row and column range is entered in reverse order', (done: Function) => {
            const cellEle: HTMLElement = helper.invoke('getCell', [4, 9]);
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(D2:D5,E5:E2)' }, 'J5']);
            expect(cellEle.textContent).toBe('1430');
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(D5:D2,E2:E5)' }, 'J5']);
            expect(cellEle.textContent).toBe('1430');
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(D5:D2,E5:E2)' }, 'J5']);
            expect(cellEle.textContent).toBe('1430');
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(D2:F2,F3:D3)' }, 'J5']);
            expect(cellEle.textContent).toBe('120830');
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(F2:D2,D3:F3)' }, 'J5']);
            expect(cellEle.textContent).toBe('120830');
            helper.invoke('updateCell', [{ value: '=SUMPRODUCT(F2:D2,F3:D3)' }, 'J5']);
            expect(cellEle.textContent).toBe('120830');
            done();
        });
        it('ROUNDUP formula with more than 2 inputs', (done: Function) => {
            helper.edit('J5', '=ROUNDUP(C2,C3,C4);');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"invalid arguments","formula":"=ROUNDUP(C2,C3,C4);"}');
            done();
        });
        it('ROUNDUP formula with negative input', (done: Function) => {
            helper.edit('J6', '=ROUNDUP("-0.5");');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].formula).toBe('=ROUNDUP("-0.5");');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('-1');
            done();
        });
        it('ROUNDUP formula with 2 Positive inputs', (done: Function) => {
            helper.edit('J7', '=ROUNDUP("0.5","0.5");');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].formula).toBe('=ROUNDUP("0.5","0.5");');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('0.5');
            done();
        });
        it('ROUNDUP formula with First Negative input and second Positive inputs', (done: Function) => {
            helper.edit('J8', '=ROUNDUP(-0.5,0.5);');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('-0.5');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"-0.5","formula":"=ROUNDUP(-0.5,0.5);"}');
            done();
        });
        it('ROUNDUP formula with having only second Positive input', (done: Function) => {
            helper.edit('J9', '=ROUNDUP(N/A,0.5);');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"#NAME?","formula":"=ROUNDUP(N/A,0.5);"}');
            done();
        });
        it('ROUNDUP formula with having only second Positive input in "" ->', (done: Function) => {
            helper.edit('J10', '=ROUNDUP(N/A,"0.5");');
            expect(helper.getInstance().sheets[0].rows[9].cells[9].formula).toBe('=ROUNDUP(N/A,"0.5");');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('#NAME?');
            done();
        });
        it('ROUNDUP formula with 2 Negative inputs', (done: Function) => {
            helper.edit('J11', '=ROUNDUP(-0.5,-0.5);');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('-1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[9])).toBe('{"value":"-1","formula":"=ROUNDUP(-0.5,-0.5);"}');
            done();
        });
        it('ROUNDUP formula with having only second NEgative input', (done: Function) => {
            helper.edit('J12', '=ROUNDUP(N/A,-0.5);');
            expect(helper.invoke('getCell', [11, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[9])).toBe('{"value":"#NAME?","formula":"=ROUNDUP(N/A,-0.5);"}');
            done();
        });
        it('ROUNDUP formula with having no first input', (done: Function) => {
            helper.edit('J13', '=ROUNDUP(,0.5);');
            expect(helper.invoke('getCell', [12, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[9])).toBe('{"value":"invalid arguments","formula":"=ROUNDUP(,0.5);"}');
            done();
        });
    });

    describe('Formula - Checking II ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Date formula->', (done: Function) => {
            helper.edit('O1', '1998');
            helper.edit('P1', '12');
            helper.edit('Q1', '26');
            helper.edit('I1', '=DATE(O1,P1,Q1);');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('12/26/1998');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"36155","formula":"=DATE(O1,P1,Q1);","format":"mm-dd-yyyy"}');
            done();
        });
        it('Date formula with month having value more than 12->', (done: Function) => {
            helper.edit('P1', '22');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('10/26/1999');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"36459","formula":"=DATE(O1,P1,Q1);","format":"mm-dd-yyyy"}');
            done();
        });
        it('Date formula with year having negative values->', (done: Function) => {
            helper.edit('P1', '12');
            helper.edit('O1', '-1998');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"#NUM!","formula":"=DATE(O1,P1,Q1);","format":"mm-dd-yyyy"}');
            done();
        });
        it('Date formula with having inputs as 0->', (done: Function) => {
            helper.edit('O1', '0');
            helper.edit('P1', '0');
            helper.edit('Q1', '0');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('11/30/1899');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"11/30/1899","formula":"=DATE(O1,P1,Q1);","format":"mm-dd-yyyy"}');
            done();
        });
        it('FLOOR formula with wrong inputs->', (done: Function) => {
            helper.edit('I2', '=FLOOR(12.9,1,3);');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"wrong number of arguments","formula":"=FLOOR(12.9,1,3);"}');
            done();
        });
        it('CEILING formula with wrong inputs->', (done: Function) => {
            helper.edit('I3', '=CEILING(12.5, 3, 2);');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"wrong number of arguments","formula":"=CEILING(12.5, 3, 2);"}');
            done();
        });
        it('DAY formula with wrong inputs>', (done: Function) => {
            helper.edit('I4', '=DAY("B5");');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toBe('=DAY("B5");');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('#VALUE!');
            done();
        });
        it('DAYS formula with giving value True as input for error Checking->', (done: Function) => {
            helper.edit('I5', '=DAYS(True, October);');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('NaN');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":null,"formula":"=DAYS(True, October);"}');
            done();
        });
        it('DAYS formula with giving value False as input for error Checking>', (done: Function) => {
            helper.edit('I6', '=DAYS(False, October);');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('NaN');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":null,"formula":"=DAYS(False, October);"}');
            done();
        });
        it('DAYS formula with giving value True & False as input ->', (done: Function) => {
            helper.edit('I7', '=DAYS(True, False);');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":0,"formula":"=DAYS(True, False);"}');
            done();
        });
        it('DAYS formula with giving single value input->', (done: Function) => {
            helper.edit('I8', '=DAYS(2022,);');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('2021');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":2021,"formula":"=DAYS(2022,);"}');
            done();
        });
        it('DAYS formula with giving # as input for End Date->', (done: Function) => {
            helper.edit('I9', '=DAYS("#-October-2022", "26-December-2022");');
            expect(helper.getInstance().sheets[0].rows[8].cells[8].formula).toBe('=DAYS("#-October-2022", "26-December-2022");');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('#-October-2022');
            done();
        });
        it('DAYS formula with giving # as input for Start Date->', (done: Function) => {
            helper.edit('I10', '=DAYS("20-October-2022", "#-December-2022");');
            expect(helper.getInstance().sheets[0].rows[9].cells[8].formula).toBe('=DAYS("20-October-2022", "#-December-2022");');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('#-December-2022');
            done();
        });
        it('T formula->', (done: Function) => {
            helper.edit('I11', '=T(A3);');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('Sports Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[8])).toBe('{"value":"Sports Shoes","formula":"=T(A3);"}');
            done();
        });
        it('T formula with no inputs->', (done: Function) => {
            helper.edit('I12', '=T();');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[8])).toBe('{"value":"invalid arguments","formula":"=T();"}');
            done();
        });
        it('T formula with Number value input->', (done: Function) => {
            helper.edit('I13', '=T(D5);');
            expect(helper.invoke('getCell', [12, 8]).textContent).toBe('');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[8])).toBe('{"value":"","formula":"=T(D5);"}');
            done();
        });
        it('T formula with Date value input->', (done: Function) => {
            helper.edit('I14', '=T(B5);');
            expect(helper.invoke('getCell', [13, 8]).textContent).toBe('');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[13].cells[8])).toBe('{"value":"","formula":"=T(B5);"}');
            done();
        });
        it('T formula with Time value input->', (done: Function) => {
            helper.edit('I15', '=T(C5);');
            expect(helper.invoke('getCell', [14, 8]).textContent).toBe('');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[14].cells[8])).toBe('{"value":"","formula":"=T(C5);"}');
            done();
        });
        it('T formula with : ->', (done: Function) => {
            helper.edit('I16', '=T(A3:A4);');
            expect(helper.invoke('getCell', [15, 8]).textContent).toBe('Sports Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[15].cells[8])).toBe('{"value":"Sports Shoes","formula":"=T(A3:A4);"}');
            done();
        });
        it('Hour formula->', (done: Function) => {
            helper.edit('J1', '=HOUR(C4);');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('3');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":3,"formula":"=HOUR(C4);"}');
            done();
        });
        it('Hour formula with no inputs->', (done: Function) => {
            helper.edit('J2', '=HOUR();');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"#VALUE!","formula":"=HOUR();"}');
            done();
        });
        it('Hour formula with more than 1 input for error checking->', (done: Function) => {
            helper.edit('J3', '=HOUR(C3,C4);');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"invalid arguments","formula":"=HOUR(C3,C4);"}');
            done();
        });
        it('Hour formula with input having no hour value->', (done: Function) => {
            helper.edit('J4', '=HOUR(6:45 PM);');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"#VALUE!","formula":"=HOUR(6:45 PM);"}');
            done();
        });
        it('Hour formula with input having only Date Value->', (done: Function) => {
            helper.edit('J5', '=HOUR("4/4/2022");');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].formula).toBe('=HOUR("4/4/2022");');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('0'); 
            done();
        });
        it('Hour formula with input having both Date and Time Value->', (done: Function) => {
            helper.edit('J6', '=HOUR("4/4/2022 3:32:44 AM");');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].formula).toBe('=HOUR("4/4/2022 3:32:44 AM");');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('3');
            done();
        });
        it('Hour formula with invalid input Value->', (done: Function) => {
            helper.edit('J7', '=HOUR("3:32:44 AM");');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].formula).toBe('=HOUR("3:32:44 AM");');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('#VALUE!');
            done();
        });
    });

    describe('Formula - Checking III ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('MINUTE formula->', (done: Function) => {
            helper.edit('I1', '=MINUTE(C4)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('32');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":32,"formula":"=MINUTE(C4)"}');
            done();
        });
        it('MINUTE formula with 2 Inputs->', (done: Function) => {
            helper.edit('I2', '=MINUTE(C4:C5)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('32');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":32,"formula":"=MINUTE(C4:C5)"}');
            done();
        });
        it('MINUTE formula with no Inputs->', (done: Function) => {
            helper.edit('I3', '=MINUTE()');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"#VALUE!","formula":"=MINUTE()"}');
            done();
        });
        it('MINUTE formula with invalid Inputs->', (done: Function) => {
            helper.edit('I4', '=MINUTE(2,2)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"invalid arguments","formula":"=MINUTE(2,2)"}');
            done();
        });
        it('MINUTE formula with Date and Time Value->', (done: Function) => {
            helper.edit('I5', '=MINUTE("7/1/2022 7:23:34 AM")');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].formula).toBe('=MINUTE("7/1/2022 7:23:34 AM")');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('23');
            done();
        });
        it('MINUTE formula with input having minute value as 90->', (done: Function) => {
            helper.edit('C4', '3:90:44 AM');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"#VALUE!","formula":"=MINUTE(C4)"}');
            done();
        });
        it('MINUTE formula with cell having no value->', (done: Function) => {
            helper.edit('I6', '=MINUTE(P10)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":0,"formula":"=MINUTE(P10)"}');
            done();
        });
        it('MINUTE formula with cell having alphabets->', (done: Function) => {
            helper.edit('I7', '=MINUTE(A1)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":"#VALUE!","formula":"=MINUTE(A1)"}');
            done();
        });
        it('MINUTE formula with Time Formula->', (done: Function) => {
            helper.edit('I8', '=TIME(7,MINUTE(C5),0)');
            expect(helper.getInstance().sheets[0].rows[7].cells[8].formula).toBe('=TIME(7,MINUTE(C5),0)');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('7:23 AM');
            done();
        });
        it('MINUTE formula without ""->', (done: Function) => {
            helper.edit('I9', '=MINUTE(7/1/2022 7:23:34 AM)');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[8])).toBe('{"value":"#VALUE!","formula":"=MINUTE(7/1/2022 7:23:34 AM)"}');
            done();
        });
        it('SECOND formula->', (done: Function) => {
            helper.edit('J1', '=SECOND(C4)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('44');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":44,"formula":"=SECOND(C4)"}');
            done();
        });
        it('SECOND formula with 2 Inputs->', (done: Function) => {
            helper.edit('J2', '=SECOND(C4:C5)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('44');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":44,"formula":"=SECOND(C4:C5)"}');
            done();
        });
        it('SECOND formula with no Inputs->', (done: Function) => {
            helper.edit('J3', '=SECOND()');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"#VALUE!","formula":"=SECOND()"}');
            done();
        });
        it('SECOND formula with invalid Inputs->', (done: Function) => {
            helper.edit('J4', '=SECOND(2,2)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"invalid arguments","formula":"=SECOND(2,2)"}');
            done();
        });
        it('SECOND formula with cell having no value->', (done: Function) => {
            helper.edit('J5', '=SECOND(P10)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":0,"formula":"=SECOND(P10)"}');
            done();
        });
        it('SECOND formula with cell having alphabets->', (done: Function) => {
            helper.edit('J6', '=SECOND(A1)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"#VALUE!","formula":"=SECOND(A1)"}');
            done();
        });
        it('SECOND formula with Time Formula->', (done: Function) => {
            helper.edit('J7', '=TIME(9,30,45)');
            helper.edit('J8', '=SECOND(J7)');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('45');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":45,"formula":"=SECOND(J7)"}');
            done();
        });
        it('SECOND formula with input having both Date and Time value->', (done: Function) => {
            helper.edit('J9', '=SECOND("7/1/2022 7:23:34 AM")');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('34');
            done(); 
        });
        it('MONTH formula->', (done: Function) => {
            helper.edit('K1', '=MONTH(B5)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('11');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"11","formula":"=MONTH(B5)"}');
            done();
        });
        it('MONTH formula with no Inputs->', (done: Function) => {
            helper.edit('K2', '=MONTH()');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"#VALUE!","formula":"=MONTH()"}');
            done();
        });
        it('MONTH formula with 2 Inputs->', (done: Function) => {
            helper.edit('K3', '=MONTH(B5,B6)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"invalid arguments","formula":"=MONTH(B5,B6)"}');
            done();
        });
        it('MONTH formula with Date and Time->', (done: Function) => {
            helper.edit('K4', '=MONTH("7/11/2022 7:21:56 AM")');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].formula).toBe('=MONTH("7/11/2022 7:21:56 AM")');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('7');
            done();
        });
        it('MONTH formula without ""->', (done: Function) => {
            helper.edit('K5', '=MONTH(7/11/2022 7:21:56 AM)');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].formula).toBe('=MONTH(7/11/2022 7:21:56 AM)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#VALUE!');
            done();
        });
        it('MONTH formula with cell having alphabets->', (done: Function) => {
            helper.edit('K6', '=MONTH(A1)');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[10])).toBe('{"value":"#VALUE!","formula":"=MONTH(A1)"}');
            done();
        });
        it('MONTH formula with direct month value as Input->', (done: Function) => {
            helper.edit('K7', '=MONTH("11/12/2022")');
            expect(helper.getInstance().sheets[0].rows[6].cells[10].formula).toBe('=MONTH("11/12/2022")');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('11');
            done();
        });
        it('Now formula with Invalid Arguments->', (done: Function) => {
            helper.edit('L1', '=NOW(B5)');
            expect(helper.invoke('getCell', [0, 11]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[11])).toBe('{"value":"invalid arguments","formula":"=NOW(B5)"}');
            done();
        });
    });

    describe('Formula - Checking IV ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('EXACT formula with cell Reference - I->', (done: Function) => {
            helper.edit('I1', 'Word');
            helper.edit('J1', 'word');
            helper.edit('I2', '=EXACT(I1,J1)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":false,"formula":"=EXACT(I1,J1)"}');
            done();
        });
        it('EXACT formula cell Reference - II->', (done: Function) => {
            helper.edit('I1', 'word');
            helper.edit('I3', '=EXACT(I1,J1)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":true,"formula":"=EXACT(I1,J1)"}');
            done();
        });
        it('EXACT formula cell Reference - III->', (done: Function) => {
            helper.edit('I1', 'Word');
            helper.edit('J1', 'Word');
            helper.edit('I4', '=EXACT(I1,J1)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":true,"formula":"=EXACT(I1,J1)"}');
            done();
        });
        it('EXACT formula with space contained Text->', (done: Function) => {
            helper.edit('I1', 'W ord');
            helper.edit('I5', '=EXACT(I1,J1)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":false,"formula":"=EXACT(I1,J1)"}');
            done();
        });
        it('EXACT formula with direct inputs->', (done: Function) => {
            helper.edit('I6', '=EXACT(word, word)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":true,"formula":"=EXACT(word, word)"}');
            done();
        });
        it('EXACT formula with more than 2 inputs->', (done: Function) => {
            helper.edit('I7', '=EXACT(word,word,word)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":"invalid arguments","formula":"=EXACT(word,word,word)"}');
            done();
        });
        it('EXACT formula with no inputs->', (done: Function) => {
            helper.edit('I8', '=EXACT()');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":"invalid arguments","formula":"=EXACT()"}');
            done();
        });
        it('EXACT formula with alphabets and numbers->', (done: Function) => {
            helper.edit('I9', '=EXACT(word, 123)');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[8])).toBe('{"value":false,"formula":"=EXACT(word, 123)"}');
            done();
        });
        it('EXACT formula for numbers->', (done: Function) => {
            helper.edit('I10', '=EXACT(123, 123)');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[8])).toBe('{"value":true,"formula":"=EXACT(123, 123)"}');
            done();
        });
        it('EXACT formula with ""->', (done: Function) => {
            helper.edit('I11', '=EXACT("apple","apple")');
            expect(helper.getInstance().sheets[0].rows[10].cells[8].formula).toBe('=EXACT("apple","apple")');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('TRUE');
            done();
        });
        it('EXACT formula with "" for one text->', (done: Function) => {
            helper.edit('I12', '=EXACT("apple",apple)');
            expect(helper.getInstance().sheets[0].rows[11].cells[8].formula).toBe('=EXACT("apple",apple)');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('FALSE');
            done();
        });
        it('EXACT formula with alphabets and number combined Text->', (done: Function) => {
            helper.edit('I13', '=EXACT(word123,word123)');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[8])).toBe('{"value":true,"formula":"=EXACT(word123,word123)"}');
            done();
        });
        it('LEN Formula with cell Reference->', (done: Function) => {
            helper.edit('J2', '=LEN(A2)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('12');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":12,"formula":"=LEN(A2)"}');
            done();
        });
        it('LEN Formula with Date Value->', (done: Function) => {
            helper.edit('J3', '=LEN(B6)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('5');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":5,"formula":"=LEN(B6)"}');
            done();
        });
        it('LEN Formula with cell having no Value->', (done: Function) => {
            helper.edit('J4', '=LEN(P10)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":0,"formula":"=LEN(P10)"}');
            done();
        });
        it('LEN Formula with text having spaces and comma->', (done: Function) => {
            helper.edit('A2', '   Casual Shoes ,   ');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":20,"formula":"=LEN(A2)"}');
            done();
        });
        it('LEN Formula with cell having Number Value->', (done: Function) => {
            helper.edit('J5', '=LEN(D5)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":2,"formula":"=LEN(D5)"}');
            done();
        });
        it('LEN Formula with cell having Formatted Number Value->', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.getElement('#'+helper.id+'_number_format').click();
            helper.getElement('#'+helper.id+'_Accounting').click();
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":2,"formula":"=LEN(D5)"}');
            done();
        });
        it('LEN Formula with more than 1 inputs->', (done: Function) => {
            helper.edit('J6', '=LEN(A5,A6)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"invalid arguments","formula":"=LEN(A5,A6)"}');
            done();
        });
        it('LEN Formula with more than 1 inputs->', (done: Function) => {
            helper.edit('J6', '=LEN(A5,A6)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"invalid arguments","formula":"=LEN(A5,A6)"}');
            done();
        });
        it('LEN Formula without ""->', (done: Function) => {
            helper.edit('J7', '=LEN(ed)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":"#NAME?","formula":"=LEN(ed)"}');
            done();
        });
        it('LEN Formula with no inputs->', (done: Function) => {
            helper.edit('J8', '=LEN()');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"#VALUE!","formula":"=LEN()"}');
            done();
        });
        it('MOD Formula->', (done: Function) => {
            helper.edit('K1', '=MOD(10,20)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":10,"formula":"=MOD(10,20)"}');
            done();
        });
        it('MOD Formula with Number contains negative sign->', (done: Function) => {
            helper.edit('K2', '=MOD(-3,2)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":1,"formula":"=MOD(-3,2)"}');
            done();
        });
        it('MOD Formula with divisor contains negative sign->', (done: Function) => {
            helper.edit('K3', '=MOD(3,-2)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('-1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":-1,"formula":"=MOD(3,-2)"}');
            done();
        });
        it('MOD Formula with both number and divisor contains negative sign->', (done: Function) => {
            helper.edit('K4', '=MOD(-3,-2)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('-1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":-1,"formula":"=MOD(-3,-2)"}');
            done();
        });
        it('MOD Formula with Deciaml values->', (done: Function) => {
            helper.edit('K5', '=MOD(0.75,0.1)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('0.05');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"0.05","formula":"=MOD(0.75,0.1)"}');
            done();
        });
        it('MOD Formula with cell Reference->', (done: Function) => {
            helper.edit('K6', '=MOD(E2,F2)');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[10])).toBe('{"value":20,"formula":"=MOD(E2,F2)"}');
            done();
        });
        it('MOD Formula with cell Reference and Number->', (done: Function) => {
            helper.edit('K7', '=MOD(E2,6)');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[10])).toBe('{"value":2,"formula":"=MOD(E2,6)"}');
            done();
        });
        it('MOD Formula with Date values->', (done: Function) => {
            helper.edit('K8', '=MOD(B2,F2)');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('84');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[10])).toBe('{"value":84,"formula":"=MOD(B2,F2)"}');
            done();
        });
        it('MOD Formula with Time values->', (done: Function) => {
            helper.edit('K9', '=MOD(C2,F2)');
            expect(helper.invoke('getCell', [8, 10]).textContent).toBe('0.482315');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[10])).toBe('{"value":"0.482315","formula":"=MOD(C2,F2)"}');
            done();
        });
        it('MOD Formula with Divisor as 0->', (done: Function) => {
            helper.edit('K10', '=MOD(20,0)');
            expect(helper.invoke('getCell', [9, 10]).textContent).toBe('#DIV/0!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[10])).toBe('{"value":"#DIV/0!","formula":"=MOD(20,0)"}');
            done();
        });
        it('MOD Formula with number as 0->', (done: Function) => {
            helper.edit('K11', '=MOD(0,20)');
            expect(helper.invoke('getCell', [10, 10]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[10])).toBe('{"value":"0","formula":"=MOD(0,20)"}');
            done();
        });
        it('MOD Formula with no inputs->', (done: Function) => {
            helper.edit('K12', '=MOD()');
            expect(helper.invoke('getCell', [11, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[10])).toBe('{"value":"invalid arguments","formula":"=MOD()"}');
            done();
        });
        it('MOD Formula with more than 2 inputs->', (done: Function) => {
            helper.edit('K13', '=MOD(2,3,4)');
            expect(helper.invoke('getCell', [12, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[10])).toBe('{"value":"invalid arguments","formula":"=MOD(2,3,4)"}');
            done();
        });
        it('MOD Formula with alphabets as inputs->', (done: Function) => {
            helper.edit('K14', '=MOD(A2,A3)');
            expect(helper.invoke('getCell', [13, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[13].cells[10])).toBe('{"value":"#VALUE!","formula":"=MOD(A2,A3)"}');
            done();
        });
        it('MOD Formula with invalid inputs->', (done: Function) => {
            helper.edit('K15', '=MOD(ed,ed)');
            expect(helper.invoke('getCell', [14, 10]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[14].cells[10])).toBe('{"value":"#NAME?","formula":"=MOD(ed,ed)"}');
            done();
        });
    });

    describe('Formula - Checking IV ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('ODD Formula with cell Reference - I->', (done: Function) => {
            helper.edit('I1', '=ODD(E4)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('15');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":15,"formula":"=ODD(E4)"}');
            done();
        });
        it('ODD Formula with cell Reference - II->', (done: Function) => {
            helper.edit('I2', '=ODD(E2)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('21');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":21,"formula":"=ODD(E2)"}');
            done();
        });
        it('ODD Formula with direct value->', (done: Function) => {
            helper.edit('I3', '=ODD(22)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('23');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":23,"formula":"=ODD(22)"}');
            done();
        });
        it('ODD Formula with negative odd value->', (done: Function) => {
            helper.edit('I4', '=ODD(-1)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('-1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":-1,"formula":"=ODD(-1)"}');
            done();
        });
        it('ODD Formula with negative even value->', (done: Function) => {
            helper.edit('I5', '=ODD(-2)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('-3');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":-3,"formula":"=ODD(-2)"}');
            done();
        });
        it('ODD Formula with decimal value->', (done: Function) => {
            helper.edit('I6', '=ODD(1.5)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('3');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":3,"formula":"=ODD(1.5)"}');
            done();
        });
        it('ODD Formula with negative decimal value->', (done: Function) => {
            helper.edit('I7', '=ODD(-1.5)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('-3');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":-3,"formula":"=ODD(-1.5)"}');
            done();
        });
        it('ODD Formula with no input->', (done: Function) => {
            helper.edit('I8', '=ODD()');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":"#VALUE!","formula":"=ODD()"}');
            done();
        });
        it('ODD Formula with more than 1 input->', (done: Function) => {
            helper.edit('I9', '=ODD(D2,D3)');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[8])).toBe('{"value":"invalid arguments","formula":"=ODD(D2,D3)"}');
            done();
        });
        it('ODD Formula with invalid input->', (done: Function) => {
            helper.edit('I10', '=ODD(odd)');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[8])).toBe('{"value":"#NAME?","formula":"=ODD(odd)"}');
            done();
        });
        it('ODD Formula with with cell having no value->', (done: Function) => {
            helper.edit('I11', '=ODD(L3)');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[8])).toBe('{"value":1,"formula":"=ODD(L3)"}');
            done();
        });
        it('ODD Formula with with cell having alphabets->', (done: Function) => {
            helper.edit('I12', '=ODD(A3)');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[8])).toBe('{"value":"#VALUE!","formula":"=ODD(A3)"}');
            done();
        });
        it('EVEN Formula with cell Reference - I->', (done: Function) => {
            helper.edit('J1', '=EVEN(E4)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('16');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":16,"formula":"=EVEN(E4)"}');
            done();
        });
        it('EVEN Formula with cell Reference - II->', (done: Function) => {
            helper.edit('J2', '=EVEN(E2)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":20,"formula":"=EVEN(E2)"}');
            done();
        });
        it('EVEN Formula with direct value->', (done: Function) => {
            helper.edit('J3', '=EVEN(13)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('14');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":14,"formula":"=EVEN(13)"}');
            done();
        });
        it('EVEN Formula with negative odd value->', (done: Function) => {
            helper.edit('J4', '=EVEN(-13)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('-14');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":-14,"formula":"=EVEN(-13)"}');
            done();
        });
        it('EVEN Formula with negative even value->', (done: Function) => {
            helper.edit('J5', '=EVEN(-14)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('-14');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":-14,"formula":"=EVEN(-14)"}');
            done();
        });
        it('EVEN Formula with decimal value->', (done: Function) => {
            helper.edit('J6', '=EVEN(2.5)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('4');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":4,"formula":"=EVEN(2.5)"}');
            done();
        });
        it('EVEN Formula with negative decimal value->', (done: Function) => {
            helper.edit('J7', '=EVEN(-1.5)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('-2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":-2,"formula":"=EVEN(-1.5)"}');
            done();
        });
        it('EVEN Formula with no input->', (done: Function) => {
            helper.edit('J8', '=EVEN()');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"#VALUE!","formula":"=EVEN()"}');
            done();
        });
        it('EVEN Formula with more than 1 input->', (done: Function) => {
            helper.edit('J9', '=EVEN(D2,D3)');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"invalid arguments","formula":"=EVEN(D2,D3)"}');
            done();
        });
        it('EVEN Formula with invalid input->', (done: Function) => {
            helper.edit('J10', '=EVEN(even)');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[9])).toBe('{"value":"#NAME?","formula":"=EVEN(even)"}');
            done();
        });
        it('EVEN Formula with with cell having no value->', (done: Function) => {
            helper.edit('J11', '=EVEN(L3)');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[10].cells[9])).toBe('{"value":0,"formula":"=EVEN(L3)"}');
            done();
        });
        it('EVEN Formula with with cell having alphabets->', (done: Function) => {
            helper.edit('J12', '=EVEN(A3)');
            expect(helper.invoke('getCell', [11, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[9])).toBe('{"value":"#VALUE!","formula":"=EVEN(A3)"}');
            done();
        });
        it('PI Formula ->', (done: Function) => {
            helper.edit('K1', '=PI()');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('3.141593');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"3.141593","formula":"=PI()"}');
            done();
        });
        it('PI Formula with other operator->', (done: Function) => {
            helper.edit('K2', '=PI()*2');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('6.283185');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"6.283185","formula":"=PI()*2"}');
            done();
        });
        it('PI Formula with invalid input ->', (done: Function) => {
            helper.edit('K3', '=PI(2)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"invalid arguments","formula":"=PI(2)"}');
            done();
        });2
        it('PI Formula for area of circle formula->', (done: Function) => {
            helper.edit('K4', '=PI()*(D3^2)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('1256.637');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"1256.637","formula":"=PI()*(D3^2)"}');
            done();
        });
        it('PI Formula with Degrees formula->', (done: Function) => {
            helper.edit('K5', '=DEGREES(pi())');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('180');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":180,"formula":"=DEGREES(pi())"}');
            done();
        });
        it('MEdian Formula ->', (done: Function) => {
            helper.edit('L1', '=MEDIAN(E2:E11)');
            expect(helper.invoke('getCell', [0, 11]).textContent).toBe('17.5');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[11])).toBe('{"value":17.5,"formula":"=MEDIAN(E2:E11)"}');
            done();
        });
        it('MEdian Formula II->', (done: Function) => {
            helper.edit('L2', '=MEDIAN(E2:E10)');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[11])).toBe('{"value":20,"formula":"=MEDIAN(E2:E10)"}');
            done();
        });
        it('MEdian Formula with no inputs->', (done: Function) => {
            helper.edit('L2', '=MEDIAN()');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[11])).toBe('{"value":"invalid arguments","formula":"=MEDIAN()"}');
            done();
        });
    });

    describe('Formula - Checking V ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('EDATE Formula with cell Reference->', (done: Function) => {
            helper.edit('I1', '=EDATE(B5,3)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('2/21/2015');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"42056","formula":"=EDATE(B5,3)","format":"mm-dd-yyyy"}');
            done();
        });
        it('EDATE Formula with no input->', (done: Function) => {
            helper.edit('I3', '=EDATE()');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"invalid arguments","formula":"=EDATE()"}');
            done();
        });
        it('EDATE Formula with number as string->', (done: Function) => {
            helper.edit('I4', '=EDATE(B5,A6)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"#NUM!","formula":"=EDATE(B5,A6)"}');
            done();
        });
        it('EDATE Formula with date as string->', (done: Function) => {
            helper.edit('I5', '=EDATE(A6,1)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"#VALUE!","formula":"=EDATE(A6,1)"}');
            done();
        });
        it('EDATE Formula with no Date value->', (done: Function) => {
            helper.edit('I6', '=EDATE(,1)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"#VALUE!","formula":"=EDATE(,1)"}');
            done();
        });
        it('DATEVALUE Formula with dd-mm-yyyy format ->', (done: Function) => {
            helper.edit('J2', '=DATEVALUE("21/12/1998")');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toBe('=DATEVALUE("21/12/1998")');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('#VALUE!');
            done();
        });
        it('DATEVALUE Formula with cell refernce having Date Value ->', (done: Function) => {
            helper.edit('J4', '=DATEVALUE(B5)');
            expect(helper.getInstance().sheets[0].rows[3].cells[9].formula).toBe('=DATEVALUE(B5)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#VALUE!');
            done();
        });
        it('DATEVALUE Formula without "" ->', (done: Function) => {
            helper.edit('J5', '=DATEVALUE(11/20/1998)');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].formula).toBe('=DATEVALUE(11/20/1998)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('#VALUE!');
            done();
        });
        it('DATEVALUE Formula with cell having no value ->', (done: Function) => {
            helper.edit('J6', '=DATEVALUE(P10)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('#VALUE!');
            done();
        });
        it('DATEVALUE Formula with invalid arguments ->', (done: Function) => {
            helper.edit('J7', '=DATEVALUE("12/26/1998","10/20/1998")');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].formula).toBe('=DATEVALUE("12/26/1998","10/20/1998")');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('invalid arguments');
            done();
        });
        it('COUNTBLANK Formula ->', (done: Function) => {
            helper.edit('K1', '=COUNTBLANK(D1:D13)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":2,"formula":"=COUNTBLANK(D1:D13)"}');
            done();
        });
        it('COUNTBLANK Formula - II ->', (done: Function) => {
            helper.edit('K2', '=COUNTBLANK(P10)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":1,"formula":"=COUNTBLANK(P10)"}');
            done();
        });
        it('COUNTBLANK Formula - III ->', (done: Function) => {
            helper.edit('K3', '=COUNTBLANK(C2)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":0,"formula":"=COUNTBLANK(C2)"}');
            done();
        });
        it('COUNTBLANK Formula with no inputs ->', (done: Function) => {
            helper.edit('K4', '=COUNTBLANK()');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"invalid arguments","formula":"=COUNTBLANK()"}');
            done();
        });
        it('COUNTBLANK Formula with no cell referneces ->', (done: Function) => {
            helper.edit('K5', '=COUNTBLANK("")');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].formula).toBe('=COUNTBLANK("")');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('invalid arguments');
            done();
        });
        it('FACT Formula ->', (done: Function) => {
            helper.edit('L1', '=FACT(5)');
            expect(helper.invoke('getCell', [0, 11]).textContent).toBe('120');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[11])).toBe('{"value":120,"formula":"=FACT(5)"}');
            done();
        });
        it('FACT Formula with Decimal Numbers->', (done: Function) => {
            helper.edit('L2', '=FACT(1.9)');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[11])).toBe('{"value":1,"formula":"=FACT(1.9)"}');
            done();
        });
        it('FACT Formula for 0->', (done: Function) => {
            helper.edit('L3', '=FACT(0)');
            expect(helper.invoke('getCell', [2, 11]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[11])).toBe('{"value":1,"formula":"=FACT(0)"}');
            done();
        });
        it('FACT Formula for negative numbers->', (done: Function) => {
            helper.edit('L4', '=FACT(-1)');
            expect(helper.invoke('getCell', [3, 11]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[11])).toBe('{"value":"#NUM!","formula":"=FACT(-1)"}');
            done();
        });
        it('FACT Formula for cell referencing numbers->', (done: Function) => {
            helper.edit('L5', '=FACT(H2)');
            expect(helper.invoke('getCell', [4, 11]).textContent).toBe('3628800');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[11])).toBe('{"value":3628800,"formula":"=FACT(H2)"}');
            done();
        });
        it('FACT Formula for cell referencing string->', (done: Function) => {
            helper.edit('L6', '=FACT(A3)');
            expect(helper.invoke('getCell', [5, 11]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[11])).toBe('{"value":"#VALUE!","formula":"=FACT(A3)"}');
            done();
        });
        it('FACT Formula with no inputs ->', (done: Function) => {
            helper.edit('L7', '=FACT()');
            expect(helper.invoke('getCell', [6, 11]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[11])).toBe('{"value":"#VALUE!","formula":"=FACT()"}');
            done();
        });
        it('FACT Formula with more than 1 inputs ->', (done: Function) => {
            helper.edit('L8', '=FACT(1,2)');
            expect(helper.invoke('getCell', [7, 11]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[11])).toBe('{"value":"invalid arguments","formula":"=FACT(1,2)"}');
            done();
        });
        it('DECIMAL Formula ->', (done: Function) => {
            helper.edit('M1', '=DECIMAL(100,2)');
            expect(helper.invoke('getCell', [0, 12]).textContent).toBe('4');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[12])).toBe('{"value":4,"formula":"=DECIMAL(100,2)"}');
            done();
        });
        it('DECIMAL Formula with cell Reference->', (done: Function) => {
            helper.edit('M2', '=DECIMAL(D4,G3)');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[12])).toBe('{"value":10,"formula":"=DECIMAL(D4,G3)"}');
            done();
        });
        it('DECIMAL Formula for Binary Values->', (done: Function) => {
            helper.edit('M3', '=DECIMAL(1101,2)');
            expect(helper.invoke('getCell', [2, 12]).textContent).toBe('13');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[12])).toBe('{"value":13,"formula":"=DECIMAL(1101,2)"}');
            done();
        });
        it('DECIMAL Formula for Hexadecimal Values->', (done: Function) => {
            helper.edit('M4', '=DECIMAL("FF",16)');
            expect(helper.getInstance().sheets[0].rows[3].cells[12].formula).toBe('=DECIMAL("FF",16)');
            expect(helper.invoke('getCell', [3, 12]).textContent).toBe('255');
            done();
        });
        it('DECIMAL Formula for Hexadecimal Values withb radix as 2->', (done: Function) => {
            helper.edit('M5', '=DECIMAL("FF",2)');
            expect(helper.invoke('getCell', [4, 12]).textContent).toBe('#NAME?');
            done();
        });
        it('DECIMAL Formula with no inputs->', (done: Function) => {
            helper.edit('M6', '=DECIMAL()');
            expect(helper.invoke('getCell', [5, 12]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[12])).toBe('{"value":"invalid arguments","formula":"=DECIMAL()"}');
            done();
        });
        it('DECIMAL Formula with no values->', (done: Function) => {
            helper.edit('M7', '=DECIMAL(,)');
            expect(helper.invoke('getCell', [6, 12]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[12])).toBe('{"value":"#VALUE!","formula":"=DECIMAL(,)"}');
            done();
        });
        it('DECIMAL Formula with input having no radix number->', (done: Function) => {
            helper.edit('M8', '=DECIMAL(100,)');
            expect(helper.invoke('getCell', [7, 12]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[12])).toBe('{"value":"#VALUE!","formula":"=DECIMAL(100,)"}');
            done();
        });
        it('DECIMAL Formula with input having only radix number->', (done: Function) => {
            helper.edit('M9', '=DECIMAL(,2)');
            expect(helper.invoke('getCell', [8, 12]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[12])).toBe('{"value":0,"formula":"=DECIMAL(,2)"}');
            done();
        });
        it('DEGREES Formula ->', (done: Function) => {
            helper.edit('N1', '=DEGREES(6.3)');
            expect(helper.invoke('getCell', [0, 13]).textContent).toBe('360');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[13])).toBe('{"value":360,"formula":"=DEGREES(6.3)"}');
            done();
        });
        it('DEGREES Formula with no input->', (done: Function) => {
            helper.edit('N2', '=DEGREES()');
            expect(helper.invoke('getCell', [1, 13]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[13])).toBe('{"value":"invalid arguments","formula":"=DEGREES()"}');
            done();
        });
        it('DEGREES Formula with cell having no value->', (done: Function) => {
            helper.edit('N3', '=DEGREES(P10)');
            expect(helper.invoke('getCell', [2, 13]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[13])).toBe('{"value":"#VALUE!","formula":"=DEGREES(P10)"}');
            done();
        });
        it('DEGREES Formula with cell having string value->', (done: Function) => {
            helper.edit('N4', '=DEGREES(A3)');
            expect(helper.invoke('getCell', [3, 13]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[13])).toBe('{"value":"#VALUE!","formula":"=DEGREES(A3)"}');
            done();
        });
    });

    describe('Address Formula - Checking->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('ADDRESS Formula ->', (done: Function) => {
            helper.edit('I1', '=ADDRESS(2,2)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('$B$2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"$B$2","formula":"=ADDRESS(2,2)"}');
            done();
        });
        it('ADDRESS Formula with abs value as 2->', (done: Function) => {
            helper.edit('I2', '=ADDRESS(2,2,2)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('B$2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"B$2","formula":"=ADDRESS(2,2,2)"}');
            done();
        });
        it('ADDRESS Formula with abs value as 3->', (done: Function) => {
            helper.edit('I3', '=ADDRESS(2,2,3)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('$B2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"$B2","formula":"=ADDRESS(2,2,3)"}');
            done();
        });
        it('ADDRESS Formula with abs value as 4->', (done: Function) => {
            helper.edit('I4', '=ADDRESS(2,2,4)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('B2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"B2","formula":"=ADDRESS(2,2,4)"}');
            done();
        });
        it('ADDRESS Formula with Reference style as false and abs value as 1->', (done: Function) => {
            helper.edit('I5', '=ADDRESS(2,2,1,FALSE)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('R2C2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"R2C2","formula":"=ADDRESS(2,2,1,FALSE)"}');
            done();
        });
        it('ADDRESS Formula with Reference style as false and abs value as 2->', (done: Function) => {
            helper.edit('I6', '=ADDRESS(2,2,2,FALSE)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('R2C[2]');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"R2C[2]","formula":"=ADDRESS(2,2,2,FALSE)"}');
            done();
        });
        it('ADDRESS Formula with Reference style as false and abs value as 3->', (done: Function) => {
            helper.edit('I7', '=ADDRESS(2,2,3,FALSE)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('R[2]C2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":"R[2]C2","formula":"=ADDRESS(2,2,3,FALSE)"}');
            done();
        });
        it('ADDRESS Formula with Reference style as false and abs value as 4->', (done: Function) => {
            helper.edit('I8', '=ADDRESS(2,2,4,FALSE)');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('R[2]C[2]');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":"R[2]C[2]","formula":"=ADDRESS(2,2,4,FALSE)"}');
            done();
        });
        it('ADDRESS Formula with Sheet name and Reference style as false->', (done: Function) => {
            helper.edit('I9', '=ADDRESS(2,2,1,FALSE,"Price Details")');
            expect(helper.getInstance().sheets[0].rows[8].cells[8].formula).toBe('=ADDRESS(2,2,1,FALSE,"Price Details")');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('Price Details!R2C2');
            done();
        });
        it('ADDRESS Formula with Sheet name and Reference style as TRUE->', (done: Function) => {
            helper.edit('I10', '=ADDRESS(2,2,1,TRUE,"Price Details")');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('Price Details!$B$2');
            done();
        });
        it('ADDRESS Formula for workbook->', (done: Function) => {
            helper.edit('I11', '=ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")');
            expect(helper.getInstance().sheets[0].rows[10].cells[8].formula).toBe('=ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('[Book1]Sheet1!R2C3');
            done();
        });
        it('ADDRESS Formula with invalid Reference style->', (done: Function) => {
            helper.edit('I12', '=ADDRESS(2,2,1,3)');
            expect(helper.invoke('getCell', [11, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[11].cells[8])).toBe('{"value":"#NAME?","formula":"=ADDRESS(2,2,1,3)"}');
            done();
        });
        it('ADDRESS Formula with invalid sheet name->', (done: Function) => {
            helper.edit('I13', '=ADDRESS(2,2,1,FALSE,aa)');
            expect(helper.invoke('getCell', [12, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[12].cells[8])).toBe('{"value":"#NAME?","formula":"=ADDRESS(2,2,1,FALSE,aa)"}');
            done();
        });
        it('ADDRESS Formula with no input->', (done: Function) => {
            helper.edit('I14', '=ADDRESS()');
            expect(helper.invoke('getCell', [13, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[13].cells[8])).toBe('{"value":"invalid arguments","formula":"=ADDRESS()"}');
            done();
        });
        it('ADDRESS Formula with invalid input->', (done: Function) => {
            helper.edit('I15', '=ADDRESS(A,B)');
            expect(helper.invoke('getCell', [14, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[14].cells[8])).toBe('{"value":"#VALUE!","formula":"=ADDRESS(A,B)"}');
            done();
        });
        it('ADDRESS Formula with negative values for Row and Column->', (done: Function) => {
            helper.edit('I16', '=ADDRESS(-1,-2)');
            expect(helper.invoke('getCell', [15, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[15].cells[8])).toBe('{"value":"#VALUE!","formula":"=ADDRESS(-1,-2)"}');
            done();
        });
        it('ADDRESS Formula with no values for Row and Column->', (done: Function) => {
            helper.edit('I17', '=ADDRESS(,,2)');
            expect(helper.invoke('getCell', [16, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[16].cells[8])).toBe('{"value":"invalid arguments","formula":"=ADDRESS(,,2)"}');
            done();
        });
    });

    describe('Formula - Checking VI ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('TIME Formula ->', (done: Function) => {
            helper.edit('I1', '=TIME(6,6,6)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('6:06 AM');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"0.2542361111111111","formula":"=TIME(6,6,6)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with Hour value as > 12 ->', (done: Function) => {
            helper.edit('I2', '=TIME(14,30,30)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('2:30 PM');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"0.6045138888888889","formula":"=TIME(14,30,30)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with Hour value = 0 ->', (done: Function) => {
            helper.edit('I3', '=TIME(0,5,30)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('12:05 AM');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"0.0038194444444444443","formula":"=TIME(0,5,30)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with cell Reference values->', (done: Function) => {
            helper.edit('I4', '=TIME(D2,D3,D4)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('10:20 AM');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"0.430787037037037","formula":"=TIME(D2,D3,D4)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with no input->', (done: Function) => {
            helper.edit('I5', '=TIME()');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"invalid arguments","formula":"=TIME()","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with cell having string inputs->', (done: Function) => {
            helper.edit('I6', '=TIME(A5,A8,A10)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"#NAME?","formula":"=TIME(A5,A8,A10)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with string inputs->', (done: Function) => {
            helper.edit('I7', '=TIME(a,b,c)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":"#NAME?","formula":"=TIME(a,b,c)","format":"h:mm AM/PM"}');
            done();
        });
        it('TIME Formula with hour value > 32767->', (done: Function) => {
            helper.edit('I8', '=TIME(32768,3,4)');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[8])).toBe('{"value":"#NUM!","formula":"=TIME(32768,3,4)","format":"h:mm AM/PM"}');
            done();
        });
        it('SMALL Formula ->', (done: Function) => {
            helper.edit('J1', '=SMALL(D2:D11,2)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('15');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":15,"formula":"=SMALL(D2:D11,2)"}');
            done();
        });
        it('SMALL Formula II ->', (done: Function) => {
            helper.edit('J2', '=SMALL(D2:H11,25)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":20,"formula":"=SMALL(D2:H11,25)"}');
            done();
        });
        it('SMALL Formula with no inputs ->', (done: Function) => {
            helper.edit('J3', '=SMALL()');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"invalid arguments","formula":"=SMALL()"}');
            done();
        });
        it('SMALL Formula with cell having string ->', (done: Function) => {
            helper.edit('J4', '=SMALL(A2,1)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"#NUM!","formula":"=SMALL(A2,1)"}');
            done();
        });
        it('SMALL Formula with number as 0 ->', (done: Function) => {
            helper.edit('J5', '=SMALL(D2:H11,0)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"#NUM!","formula":"=SMALL(D2:H11,0)"}');
            done();
        });
        it('SMALL Formula with number as alphabet ->', (done: Function) => {
            helper.edit('J6', '=SMALL(D2:D11,a)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"#NAME?","formula":"=SMALL(D2:D11,a)"}');
            done();
        });
        it('SMALL Formula with number greater than array value ->', (done: Function) => {
            helper.edit('J7', '=SMALL(D2:H11,52)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":"#NUM!","formula":"=SMALL(D2:H11,52)"}');
            done();
        });
        it('LARGE Formula ->', (done: Function) => {
            helper.edit('K1', '=LARGE(D2:D11,2)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('41');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":41,"formula":"=LARGE(D2:D11,2)"}');
            done();
        });
        it('LARGE Formula with no inputs->', (done: Function) => {
            helper.edit('K2', '=LARGE()');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"invalid arguments","formula":"=LARGE()"}');
            done();
        });
        it('LARGE Formula with cell having string->', (done: Function) => {
            helper.edit('K3', '=LARGE(A2,1)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"#NUM!","formula":"=LARGE(A2,1)"}');
            done();
        });
        it('LARGE Formula with cell having number value as string->', (done: Function) => {
            helper.edit('K4', '=LARGE(D2:D11,a)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#NAME?","formula":"=LARGE(D2:D11,a)"}');
            done();
        });
        it('CHOOSE Formula with as cell Referenced value->', (done: Function) => {
            helper.edit('K5', '=CHOOSE(D2:D2,"10","20")');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].formula).toBe('=CHOOSE(D2:D2,"10","20")');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#VALUE!');
            done();
        });
    });

    describe('Formula - Checking VII ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('CHAR Formula for Numbers->', (done: Function) => {
            helper.edit('I1', '=CHAR(56)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('8');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"8","formula":"=CHAR(56)"}');
            done();
        });
        it('CHAR Formula for alphabets->', (done: Function) => {
            helper.edit('I2', '=CHAR(78)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('N');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"N","formula":"=CHAR(78)"}');
            done();
        });
        it('CHAR Formula with no inputs->', (done: Function) => {
            helper.edit('I3', '=CHAR()');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"invalid arguments","formula":"=CHAR()"}');
            done();
        });
        it('CHAR Formula with invalid inputs->', (done: Function) => {
            helper.edit('I4', '=CHAR(a)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"#NAME?","formula":"=CHAR(a)"}');
            done();
        });
        it('CHAR Formula with value > 256->', (done: Function) => {
            helper.edit('I5', '=CHAR(256)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"#VALUE!","formula":"=CHAR(256)"}');
            done();
        });
        it('CHAR Formula with value as 0->', (done: Function) => {
            helper.edit('I6', '=CHAR(0)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"#VALUE!","formula":"=CHAR(0)"}');
            done();
        });
        it('CODE Formula for Numbers->', (done: Function) => {
            helper.edit('J1', '=CODE(1)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('49');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":49,"formula":"=CODE(1)"}');
            done();
        });
        it('CODE Formula for alphabets->', (done: Function) => {
            helper.edit('J2', '=CODE("A")');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toBe('=CODE("A")');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('65');
            done();
        });
        it('CODE Formula for invalid inputs->', (done: Function) => {
            helper.edit('J3', '=CODE(a)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"#NAME?","formula":"=CODE(a)"}');
            done();
        });
        it('CODE Formula for no inputs->', (done: Function) => {
            helper.edit('J4', '=CODE()');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"invalid arguments","formula":"=CODE()"}');
            done();
        });
        it('CODE Formula for with only ""->', (done: Function) => {
            helper.edit('J5', '=CODE("")');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('#VALUE!');
            done();
        });
        it('CODE Formula for 0->', (done: Function) => {
            helper.edit('J6', '=CODE(0)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('48');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":48,"formula":"=CODE(0)"}');
            done();
        });
        it('DOLLAR Formula->', (done: Function) => {
            helper.edit('J7', '=DOLLAR(2)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('$2.00');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":"$2.00","format":"$#,##.00","formula":"=DOLLAR(2)"}');
            done();
        });
        it('DOLLAR Formula for no inputs->', (done: Function) => {
            helper.edit('J8', '=DOLLAR()');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('invalid arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"invalid arguments","formula":"=DOLLAR()"}');
            done();
        });
        it('DOLLAR Formula for invalid inputs->', (done: Function) => {
            helper.edit('J9', '=DOLLAR(a)');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"#NAME?","formula":"=DOLLAR(a)"}');
            done();
        });
        it('DOLLAR Formula for alphanumeric inputs->', (done: Function) => {
            helper.edit('J10', '=DOLLAR(10A)');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[9])).toBe('{"value":"#VALUE!","formula":"=DOLLAR(A10)"}');
            done();
        });
        it('SUMIF Formula->', (done: Function) => {
            helper.edit('J11', '=SUMIF(A2:A5,"Casual Shoes",D2:D4)');
            expect(helper.getInstance().sheets[0].rows[10].cells[9].formula).toBe('=SUMIF(A2:A5,"Casual Shoes",D2:D4)');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('10');
            done();
        });
        it('SUMIF Formula with more than 3 inputs->', (done: Function) => {
            helper.edit('J12', '=SUMIF(A2:A5,"Casual Shoes",D2:D4,E2:E4)');
            expect(helper.invoke('getCell', [11, 9]).textContent).toBe('wrong number of arguments');
            done();
        });
        it('ABS Formula->', (done: Function) => {
            helper.edit('K1', '=ABS(D2)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":10,"formula":"=ABS(D2)"}');
            done();
        });
        it('ABS Formula with cell having no values->', (done: Function) => {
            helper.edit('K2', '=ABS(P10)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"#NAME?","formula":"=ABS(P10)"}');
            done();
        });
        it('ABS Formula with more than 1 inputs->', (done: Function) => {
            helper.edit('K3', '=ABS(-1,-2)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"wrong number of arguments","formula":"=ABS(-1,-2)"}');
            done();
        });
        it('FIND Formula with Name Error->', (done: Function) => {
            helper.edit('K4', '=FIND(S,"A2")');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].formula).toBe('=FIND(S,"A2")');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#NAME?');
            done();
        });
    });

    describe('Sort Formula - Checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ cells: [{ value:'10' }] },{ cells: [{ value:'21' }] }, { cells: [{ value:'5' }] }, { cells: [{ value:'42' }] } ] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('SORT Formula with Reverse Row Selection->', (done: Function) => {
            helper.edit('I1', '=SORT(D11:D2)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('10');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('50');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"10","formula":"=SORT(D11:D2)"}');
            done();
        });
        it('SORT Formula with Reverse Column Selection->', (done: Function) => {
            helper.edit('J1', '=SORT(H5:D5)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('15');
            expect(helper.invoke('getCell', [0, 13]).textContent).toBe('67');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"15","formula":"=SORT(H5:D5)"}');
            done();
        });
        it('SORT Formula with By Column as True->', (done: Function) => {
            helper.edit('J2', '=SORT(D2:D11,1,-1,TRUE)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('10');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('50');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"10","formula":"=SORT(D2:D11,1,-1,TRUE)"}');
            done();
        });
        it('SORT Formula with invalid number sort order->', (done: Function) => {
            helper.edit('K2', '=SORT(D2:D11,1,2)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"#VALUE!","formula":"=SORT(D2:D11,1,2)"}');
            done();
        });
        it('SORT Formula with value 0 as Sort index->', (done: Function) => {
            helper.edit('K3', '=SORT(D2:D11,0)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"#VALUE!","formula":"=SORT(D2:D11,0)"}');
            done();
        });
        it('SORT Formula with invalid value for by Column->', (done: Function) => {
            helper.edit('K4', '=SORT(D2:D11,1,-1,ed)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#VALUE!","formula":"=SORT(D2:D11,1,-1,ed)"}');
            done();
        });
        it('SORT Formula with value refered form another sheet->', (done: Function) => {
            helper.edit('K5', '=SORT(Sheet2!A1:A4)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('5');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('42');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"5","formula":"=SORT(Sheet2!A1:A4)"}');
            done();
        });
        it('SORT Formula with no inputs ->', (done: Function) => {
            helper.edit('L2', '=SORT()');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[11])).toBe('{"value":"wrong number of arguments","formula":"=SORT()"}');
            done();
        });
    });

    describe('Formula - Checking VIII ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('COUNTIF Formula ->', (done: Function) => {
            helper.edit('I1', '=COUNTIF(D2:D11,"20")');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('3');
            done();
        });
        it('COUNTIF Formula with greater than equal to operator ->', (done: Function) => {
            helper.edit('I2', '=COUNTIF(D2:D11,">=30")');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toBe('=COUNTIF(D2:D11,">=30")');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('5');
            done();
        });
        it('COUNTIF Formula with not equal to operator ->', (done: Function) => {
            helper.edit('I3', '=COUNTIF(D2:D11,"<>30")');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].formula).toBe('=COUNTIF(D2:D11,"<>30")');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('9');
            done();
        });
        it('COUNTIF Formula with Greater than operator ->', (done: Function) => {
            helper.edit('I4', '=COUNTIF(D2:D11,">30")');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('4');
            done();
        });
        it('COUNTIF Formula with Less than operator ->', (done: Function) => {
            helper.edit('I5', '=COUNTIF(D2:D11,"<30")');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('5');
            done();
        });
        it('COUNTIF Formula with * ->', (done: Function) => {
            helper.edit('I6', '=COUNTIF(D2:D11,"*20")');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('3');
            done();
        });
        it('Add 2 COUNTIF Formulas->', (done: Function) => {
            helper.edit('I7', '=(COUNTIF(D2:D11,">30")+COUNTIF(D2:D11,"<30"))');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('9');
            done();
        });
        it('MATCH Formula for without input->', (done: Function) => {
            helper.edit('I8', '=MATCH("",A2:A11)');
            expect(helper.getInstance().sheets[0].rows[7].cells[8].formula).toBe('=MATCH("",A2:A11)');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('#N/A');
            done();
        });
        it('SUBTOTAL Formula Case I->', (done: Function) => {
            helper.edit('J1', '=SUBTOTAL(1,d2:d11)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('27.7');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"27.7","formula":"=SUBTOTAL(1,d2:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case II->', (done: Function) => {
            helper.edit('J2', '=SUBTOTAL(2,d1:d11)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":10,"formula":"=SUBTOTAL(2,d1:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case III->', (done: Function) => {
            helper.edit('J3', '=SUBTOTAL(3,d1:d11)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('11');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":11,"formula":"=SUBTOTAL(3,d1:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case IV->', (done: Function) => {
            helper.edit('J4', '=SUBTOTAL(4,d2:d11)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('50');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"50","formula":"=SUBTOTAL(4,d2:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case V->', (done: Function) => {
            helper.edit('J5', '=SUBTOTAL(5,d2:d11)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"10","formula":"=SUBTOTAL(5,d2:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case VI->', (done: Function) => {
            helper.edit('J6', '=SUBTOTAL(6,d2:d5)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('60000');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"60000","formula":"=SUBTOTAL(6,d2:d5)"}');
            done();
        });
        it('SUBTOTAL Formula Case VIII->', (done: Function) => {
            helper.edit('J7', '=SUBTOTAL(8,A2:A3)');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('Casual ShoesSports Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[9])).toBe('{"value":"Casual ShoesSports Shoes","formula":"=SUBTOTAL(8,A2:A3)"}');
            done();
        });
        it('SUBTOTAL Formula Case XI->', (done: Function) => {
            helper.edit('J8', '=SUBTOTAL(9,d2:d11)');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('277');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":277,"formula":"=SUBTOTAL(9,d2:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case X->', (done: Function) => {
            helper.edit('J9', '=SUBTOTAL(10,d1:d11)');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('25.18182');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"25.18182","formula":"=SUBTOTAL(10,d1:d11)"}');
            done();
        });
        it('SUBTOTAL Formula Case XI->', (done: Function) => {
            helper.edit('E2', '-20');
            helper.edit('J10', '=SUBTOTAL(11,e2)');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[9])).toBe('{"value":20,"formula":"=SUBTOTAL(11,e2)"}');
            done();
        });
        it('LN Formula->', (done: Function) => {
            helper.edit('K1', '=LN(1)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":0,"formula":"=LN(1)"}');
            done();
        });
        it('LN Formula with no inputs->', (done: Function) => {
            helper.edit('K3', '=LN()');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"#NUM!","formula":"=LN()"}');
            done();
        });
        it('LN Formula with String inputs->', (done: Function) => {
            helper.edit('K4', '=LN(sa)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#VALUE!","formula":"=LN(sa)"}');
            done();
        });
        it('LN Formula with more than 1 inputs->', (done: Function) => {
            helper.edit('K5', '=LN(3,2)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"wrong number of arguments","formula":"=LN(3,2)"}');
            done();
        });
    });

    describe('Unique Formula - Checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('UNIQUE Formula with no arguments->', (done: Function) => {
            helper.edit('I1', '=UNIQUE()');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"wrong number of arguments","formula":"=UNIQUE()"}');
            done();
        });
        it('UNIQUE Formula with with reverse row selection->', (done: Function) => {
            helper.edit('I2', '=UNIQUE(E11:E2)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('20');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('30');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('15');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"20","formula":"=UNIQUE(E11:E2)"}');
            done();
        });
        it('UNIQUE Formula with reverse Column selection->', (done: Function) => {
            helper.edit('J1', '=UNIQUE(H2:D2)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('10');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('20');
            expect(helper.invoke('getCell', [0, 11]).textContent).toBe('200');
            expect(helper.invoke('getCell', [0, 12]).textContent).toBe('1');
            expect(helper.invoke('getCell', [0, 13]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"10","formula":"=UNIQUE(H2:D2)"}');
            done();
        });
        it('UNIQUE Formula for by column value as True->', (done: Function) => {
            helper.edit('J2', '=UNIQUE(D2:H2,1)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('10');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('20');
            expect(helper.invoke('getCell', [1, 11]).textContent).toBe('200');
            expect(helper.invoke('getCell', [1, 12]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"10","formula":"=UNIQUE(D2:H2,1)"}');
            done();
        });
        it('UNIQUE Formula for by column value as True and Exactly once as True->', (done: Function) => {
            helper.edit('J3', '=UNIQUE(D2:H2,1,TRUE)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('20');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('200');
            expect(helper.invoke('getCell', [2, 11]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"20","formula":"=UNIQUE(D2:H2,1,TRUE)"}');
            done();
        });
        it('UNIQUE Formula with single cell->', (done: Function) => {
            helper.edit('J4', '=UNIQUE(A1)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('Item Name');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"Item Name","formula":"=UNIQUE(A1)"}');
            done();
        });
        it('UNIQUE Formula with Column Header as NUll ->', (done: Function) => {
            helper.edit('J5', '=UNIQUE(2:2,1,TRUE)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Casual Shoes');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('41684');
            expect(helper.invoke('getCell', [4, 11]).textContent).toBe('0.482315');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"Casual Shoes","formula":"=UNIQUE(2:2,1,TRUE)"}');
            done();
        });
        it('UNIQUE Formula with Row Number as NUll ->', (done: Function) => {
            helper.edit('J6', '=UNIQUE(E:E)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('Price');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('20');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('30');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('15');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"Price","formula":"=UNIQUE(E:E)"}');
            done();
        });
    });

    describe('Formula - Checking XI ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('CHOOSE Formula for cell Reference with Num_index->', (done: Function) => {
            helper.edit('I1', '=CHOOSE(1,A2:A5)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('Casual Shoes');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"Casual Shoes","formula":"=CHOOSE(1,A2:A5)"}');
            done();
        });
        it('CHOOSE Formula for cell Reference with Num_index as alphabets->', (done: Function) => {
            helper.edit('I2', '=CHOOSE(a,A2:A5)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"#NAME?","formula":"=CHOOSE(a,A2:A5)"}');
            done();
        });
        it('INDEX Formula ->', (done: Function) => {
            helper.edit('I3', '=INDEX(D1:H11,5,5)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('67');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"67","formula":"=INDEX(D1:H11,5,5)"}');
            done();
        });
        it('INDEX Formula with column value as alphabets->', (done: Function) => {
            helper.edit('I4', '=INDEX(A1:A5,1,a)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"#NAME?","formula":"=INDEX(A1:A5,1,a)"}');
            done();
        });
        it('INDEX Formula with Row value as alphabets->', (done: Function) => {
            helper.edit('I5', '=INDEX(D2:D5,a)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"#NAME?","formula":"=INDEX(D2:D5,a)"}');
            done();
        });
        it('INDEX Formula with Column value as 0->', (done: Function) => {
            helper.edit('I6', '=INDEX(D2:H11,5,0)');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[8])).toBe('{"value":"#VALUE!","formula":"=INDEX(D2:H11,5,0)"}');
            done();
        });
        it('INDEX Formula with row and Column value as -1->', (done: Function) => {
            helper.edit('I7', '=INDEX(A1:A10,-1,-1)');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[8])).toBe('{"value":"#VALUE!","formula":"=INDEX(A1:A10,-1,-1)"}');
            done();
        });
        it('Match Formula with Match Type as 1->', (done: Function) => {
            helper.edit('J1', '=Match(9.5,D2:D11,1)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('10');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":10,"formula":"=Match(9.5,D2:D11,1)"}');
            done();
        });
        it('Match Formula with Match Type as -1->', (done: Function) => {
            helper.edit('J2', '=MATCH(10,D2:D11,"-1")');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('1');
            done();
        });
        it('Match Formula with Match Type as -1 II->', (done: Function) => {
            helper.edit('J3', '=MATCH(10,D3:D11,"-1")');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toBe('=MATCH(10,D3:D11,"-1")');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('3');
            done();
        });
        it('Match Formula with Match Type as 0->', (done: Function) => {
            helper.edit('J4', '=MATCH(10,D2:D11,0)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":1,"formula":"=MATCH(10,D2:D11,0)"}');
            done();
        });
        it('RANDBETWEEN Formula with maximum argument->', (done: Function) => {
            helper.edit('J5', '=RANDBETWEEN(,10)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('#N/A');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"#N/A","formula":"=RANDBETWEEN(,10)"}');
            done();
        });
        it('RANDBETWEEN Formula with value as 0->', (done: Function) => {
            helper.edit('J6', '=RANDBETWEEN(0,0)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":0,"formula":"=RANDBETWEEN(0,0)"}');
            done();
        });
        it('RANDBETWEEN Formula for cell references with string values ->', (done: Function) => {
            helper.edit('J8', '=RANDBETWEEN(A2,D2)');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[9])).toBe('{"value":"#VALUE!","formula":"=RANDBETWEEN(A2,D2)"}');
            done();
        });
        it('RANDBETWEEN Formula for cell references with no values ->', (done: Function) => {
            helper.edit('J9', '=RANDBETWEEN(D12,D13)');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('0');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[9])).toBe('{"value":"0","formula":"=RANDBETWEEN(D12,D13)"}');
            done();
        });
        it('SLOPE Formula ->', (done: Function) => {
            helper.edit('K1', '=SLOPE(D2:D11,E2:E11)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('-0.19111');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"-0.19111","formula":"=SLOPE(D2:D11,E2:E11)"}');
            done();
        });
        it('SLOPE Formula with no inputs->', (done: Function) => {
            helper.edit('K2', '=SLOPE()');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"wrong number of arguments","formula":"=SLOPE()"}');
            done();
        });
        it('SLOPE Formula with not equal range->', (done: Function) => {
            helper.edit('K3', '=SLOPE(D2:D11,C2:C5)');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('#N/A');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"#N/A","formula":"=SLOPE(D2:D11,C2:C5)"}');
            done();
        });
        it('SLOPE Formula with cell having string->', (done: Function) => {
            helper.edit('K4', '=SLOPE(D1,E1)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#DIV/0!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#DIV/0!","formula":"=SLOPE(D1,E1)"}');
            done();
        });
        it('SLOPE Formula with direct string inputs->', (done: Function) => {
            helper.edit('K5', '=SLOPE(a,b)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"#NAME?","formula":"=SLOPE(a,b)"}');
            done();
        });
        it('INTERCEPT Formula ->', (done: Function) => {
            helper.edit('K6', '=INTERCEPT(D2:D11,E2:E11)');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('31.04444');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[10])).toBe('{"value":"31.04444","formula":"=INTERCEPT(D2:D11,E2:E11)"}');
            done();
        });
        it('INTERCEPT Formula with no inputs->', (done: Function) => {
            helper.edit('K7', '=INTERCEPT()');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[10])).toBe('{"value":"wrong number of arguments","formula":"=INTERCEPT()"}');
            done();
        });
        it('SLOPE Formula with not equal range->', (done: Function) => {
            helper.edit('K8', '=SLOPE(D2:D11,C2:C5)');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('#N/A');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[10])).toBe('{"value":"#N/A","formula":"=SLOPE(D2:D11,C2:C5)"}');
            done();
        });
        it('SLOPE Formula with cell having string->', (done: Function) => {
            helper.edit('K9', '=INTERCEPT(D1,E1)');
            expect(helper.invoke('getCell', [8, 10]).textContent).toBe('#DIV/0!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[10])).toBe('{"value":"#DIV/0!","formula":"=INTERCEPT(D1,E1)"}');
            done();
        });
        it('SLOPE Formula with direct string inputs->', (done: Function) => {
            helper.edit('K10', '=INTERCEPT(a,b)');
            expect(helper.invoke('getCell', [9, 10]).textContent).toBe('#NAME?');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[10])).toBe('{"value":"#NAME?","formula":"=INTERCEPT(a,b)"}');
            done();
        });
    });

    describe('Formula - Checking X ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('ISNUMBER Formula ->', (done: Function) => {
            helper.edit('I1', '=ISNUMBER(100)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('TRUE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":true,"formula":"=ISNUMBER(100)"}');
            done();
        });
        it('ISNUMBER Formula with no arguments->', (done: Function) => {
            helper.edit('I2', '=ISNUMBER()');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('FALSE');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":false,"formula":"=ISNUMBER()"}');
            done();
        });
        it('ISNUMBER Formula with more than 2 arguments->', (done: Function) => {
            helper.edit('I3', '=ISNUMBER(1,2,3)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"wrong number of arguments","formula":"=ISNUMBER(1,2,3)"}');
            done();
        });
        it('POWER Formula ->', (done: Function) => {
            helper.edit('J1', '=POWER(2,3)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('8');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"8","formula":"=POWER(2,3)"}');
            done();
        });
        it('POWER Formula with more than 2 arguments->', (done: Function) => {
            helper.edit('J2', '=POWER(1,2,3)');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"wrong number of arguments","formula":"=POWER(1,2,3)"}');
            done();
        });
        it('POWER Formula with negative arguments->', (done: Function) => {
            helper.edit('J3', '=POWER(-2,3)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('-8');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"-8","formula":"=POWER(-2,3)"}');
            done();
        });
        it('POWER Formula with value as 0->', (done: Function) => {
            helper.edit('J4', '=POWER(0,-3)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#DIV/0!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"#DIV/0!","formula":"=POWER(0,-3)"}');
            done();
        });
        it('POWER Formula with both value and exponent as 0->', (done: Function) => {
            helper.edit('J5', '=POWER(0,0)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"#NUM!","formula":"=POWER(0,0)"}');
            done();
        });
        it('POWER Formula with string as arguments->', (done: Function) => {
            helper.edit('J6', '=POWER(a,b)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"#VALUE!","formula":"=POWER(a,b)"}');
            done();
        });
        it('LOG Formula ->', (done: Function) => {
            helper.edit('K1', '=LOG(100,10)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('2');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"2","formula":"=LOG(100,10)"}');
            done();
        });
        it('LOG Formula with more than 2 arguments->', (done: Function) => {
            helper.edit('K2', '=LOG(1,2,3)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"wrong number of arguments","formula":"=LOG(1,2,3)"}');
            done();
        });
        it('LOG Formula with both value and base as negative values->', (done: Function) => {
            helper.edit('K4', '=LOG(-100,-10)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#NUM!","formula":"=LOG(-100,-10)"}');
            done();
        });
        it('LOG Formula with base value as 1->', (done: Function) => {
            helper.edit('K5', '=LOG(10,1)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#DIV/0!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"#DIV/0!","formula":"=LOG(10,1)"}');
            done();
        });
        it('LOG Formula with string as arguments->', (done: Function) => {
            helper.edit('K6', '=LOG(a,b)');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[10])).toBe('{"value":"#VALUE!","formula":"=LOG(a,b)"}');
            done();
        });
    });

    describe('Formula - Checking XI ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('TRUNC Formula ->', (done: Function) => {
            helper.edit('I1', '=TRUNC(8.9)');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('8');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[8])).toBe('{"value":"8","formula":"=TRUNC(8.9)"}');
            done();
        });
        it('TRUNC Formula for Negative Value and Number number of Digits as 0->', (done: Function) => {
            helper.edit('I2', '=TRUNC(-6.5,0)');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('-6');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[8])).toBe('{"value":"-6","formula":"=TRUNC(-6.5,0)"}');
            done();
        });
        it('TRUNC Formula with Number number of Digits as 3->', (done: Function) => {
            helper.edit('I3', '=TRUNC(3.147895,3)');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('3.147');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"3.147","formula":"=TRUNC(3.147895,3)"}');
            done();
        });
        it('TRUNC Formula with cell Reference which contains string->', (done: Function) => {
            helper.edit('I4', '=TRUNC(A5)');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[8])).toBe('{"value":"#VALUE!","formula":"=TRUNC(A5)"}');
            done();
        });
        it('TRUNC Formula with more than 2 arguments->', (done: Function) => {
            helper.edit('I5', '=TRUNC(1.5,2.5,3.5)');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":"wrong number of arguments","formula":"=TRUNC(1.5,2.5,3.5)"}');
            done();
        });
        it('EXP Formula ->', (done: Function) => {
            helper.edit('J1', '=EXP(1)');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('2.718282');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":"2.718282","formula":"=EXP(1)"}');
            done();
        });
        it('EXP Formula with no arguments ->', (done: Function) => {
            helper.edit('J2', '=EXP()');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"1","formula":"=EXP()"}');
            done();
        });
        it('EXP Formula for value 709 ->', (done: Function) => {
            helper.edit('J3', '=EXP(709)');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('8.218407461554972e+307');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"8.218407461554972e+307","formula":"=EXP(709)"}');
            done();
        });
        it('EXP Formula for value greater than 709 ->', (done: Function) => {
            helper.edit('J4', '=EXP(710)');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":"#NUM!","formula":"=EXP(710)"}');
            done();
        });
        it('EXP Formula for more than 1 argument->', (done: Function) => {
            helper.edit('J5', '=EXP(1,2)');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('wrong number of arguments');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[9])).toBe('{"value":"wrong number of arguments","formula":"=EXP(1,2)"}');
            done();
        });
        it('EXP Formula with cell Reference which contains alphabets->', (done: Function) => {
            helper.edit('J6', '=EXP(A5)');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('#VALUE!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[9])).toBe('{"value":"#VALUE!","formula":"=EXP(A5)"}');
            done();
        });
        it('GEOMEAN Formula ->', (done: Function) => {
            helper.edit('K1', '=GEOMEAN(1,2)');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('1.414214');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[10])).toBe('{"value":"1.414214","formula":"=GEOMEAN(1,2)"}');
            done();
        });
        it('GEOMEAN Formula with 3 arguments->', (done: Function) => {
            helper.edit('K2', '=GEOMEAN(1,2,3)');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('1.817121');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":"1.817121","formula":"=GEOMEAN(1,2,3)"}');
            done();
        });
        it('GEOMEAN Formula with subtract operator->', (done: Function) => {
            helper.edit('K3', '=GEOMEAN(1,2)-1');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('0.414214');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"0.414214","formula":"=GEOMEAN(1,2)-1"}');
            done();
        });
        it('GEOMEAN Formula with subtract operator->', (done: Function) => {
            helper.edit('K3', '=GEOMEAN(1,2)-1');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('0.414214');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[10])).toBe('{"value":"0.414214","formula":"=GEOMEAN(1,2)-1"}');
            done();
        });
        it('GEOMEAN Formula with negative value in argument 2->', (done: Function) => {
            helper.edit('K4', '=GEOMEAN(5,-1)');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[10])).toBe('{"value":"#NUM!","formula":"=GEOMEAN(5,-1)"}');
            done();
        });
        it('GEOMEAN Formula with negative value in argument 1->', (done: Function) => {
            helper.edit('K5', '=GEOMEAN(-5,1)');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[10])).toBe('{"value":"#NUM!","formula":"=GEOMEAN(-5,1)"}');
            done();
        });
        it('GEOMEAN Formula with cell reference->', (done: Function) => {
            helper.edit('K6', '=GEOMEAN(D3)');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('20');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[5].cells[10])).toBe('{"value":"20","formula":"=GEOMEAN(D3)"}');
            done();
        });
        it('GEOMEAN Formula with cell reference which contains string->', (done: Function) => {
            helper.edit('K7', '=GEOMEAN(D1:D5)');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('15.65085');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[10])).toBe('{"value":"15.65085","formula":"=GEOMEAN(D1:D5)"}');
            done();
        });
        it('GEOMEAN Formula with cell reference which contains negative values->', (done: Function) => {
            helper.edit('F2', '-200');
            helper.edit('K8', '=GEOMEAN(F2:F8)');
            expect(helper.invoke('getCell', [7, 10]).textContent).toBe('#NUM!');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[10])).toBe('{"value":"#NUM!","formula":"=GEOMEAN(F2:F8)"}');
            done();
        });
        it('GEOMEAN Formula with no argguments->', (done: Function) => {
            helper.edit('K9', '=GEOMEAN()');
            expect(helper.invoke('getCell', [8, 10]).textContent).toBe('1');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[8].cells[10])).toBe('{"value":"1","formula":"=GEOMEAN()"}');
            done();
        });
        it('GEOMEAN Formula with only contains ""->', (done: Function) => {
            helper.edit('K10', '=GEOMEAN("")');
            expect(helper.getInstance().sheets[0].rows[9].cells[10].formula).toBe('=GEOMEAN("")');
            expect(helper.invoke('getCell', [9, 10]).textContent).toBe('#NAME?');
            done();
        });
    });

    describe('Text Formula - Checking with Different Date Format->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('TEXT Formula with Date format - dd-MMM-yyyy ->', (done: Function) => {
            helper.edit('I1', '=TEXT(B2,"dd-MMM-yyyy")');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('Feb 14, 2014');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toEqual('=TEXT(B2,"dd-MMM-yyyy")');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toEqual('Feb 14, 2014');
            done();
        });
        it('TEXT Formula with Date format - dd MMM yyyy ->', (done: Function) => {
            helper.edit('I2', '=TEXT(B3,"dd MMM yyyy")');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('Jun 11, 2014');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toEqual('=TEXT(B3,"dd MMM yyyy")');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toEqual('Jun 11, 2014');
            done();
        });
        it('TEXT Formula with Date format - MMM-yyyy ->', (done: Function) => {
            helper.edit('I3', '=TEXT(B4,"MMM-yyyy")');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('Jul 2014');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].formula).toEqual('=TEXT(B4,"MMM-yyyy")');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toEqual('Jul 2014');
            done();
        });
        it('TEXT Formula with Date format - MMM yyyy ->', (done: Function) => {
            helper.edit('I4', '=TEXT(B5,"MMM yyyy")');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('Nov 2014');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toEqual('=TEXT(B5,"MMM yyyy")');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].value).toEqual('Nov 2014');
            done();
        });
        it('TEXT Formula with Date format - MM-dd-yyyy ->', (done: Function) => {
            helper.edit('I5', '=TEXT(B6,"MM-dd-yyyy")');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('6/23/14');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].formula).toEqual('=TEXT(B6,"MM-dd-yyyy")');
            done();
        });
        it('TEXT Formula with Date format - dd-MM-yyyy ->', (done: Function) => {
            helper.edit('I6', '=TEXT(B7,"dd-MM-yyyy")');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('7/22/14');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].formula).toEqual('=TEXT(B7,"dd-MM-yyyy")');
            done();
        });
        it('TEXT Formula with Date format - dd-MM-yy ->', (done: Function) => {
            helper.edit('I7', '=TEXT(B8,"dd-MM-yy")');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('2/4/14');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toEqual('=TEXT(B8,"dd-MM-yy")');
            done();
        });
        it('TEXT Formula with Date format - MM/dd/yyyy ->', (done: Function) => {
            helper.edit('I8', '=TEXT(B9,"MM/dd/yyyy")');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('11/30/14');
            expect(helper.getInstance().sheets[0].rows[7].cells[8].formula).toEqual('=TEXT(B9,"MM/dd/yyyy")');
            done();
        });
        it('TEXT Formula with Date format - dd/MM/yyyy ->', (done: Function) => {
            helper.edit('I9', '=TEXT(B10,"dd/MM/yyyy")');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('7/9/14');
            expect(helper.getInstance().sheets[0].rows[8].cells[8].formula).toEqual('=TEXT(B10,"dd/MM/yyyy")');
            done();
        });
        it('TEXT Formula with Date format - dd/MM/yy ->', (done: Function) => {
            helper.edit('I10', '=TEXT(B11,"dd/MM/yy")');
            expect(helper.invoke('getCell', [9, 8]).textContent).toBe('10/31/14');
            expect(helper.getInstance().sheets[0].rows[9].cells[8].formula).toEqual('=TEXT(B11,"dd/MM/yy")');
            done();
        });
        it('TEXT Formula with Date format - MMM d ->', (done: Function) => {
            helper.edit('I11', '=TEXT(B4,"MMM d")');
            expect(helper.invoke('getCell', [10, 8]).textContent).toBe('Jul 27');
            expect(helper.getInstance().sheets[0].rows[10].cells[8].formula).toEqual('=TEXT(B4,"MMM d")');
            expect(helper.getInstance().sheets[0].rows[10].cells[8].value).toEqual('Jul 27');
            done();
        });
        it('TEXT Formula with Date format - M/yyyy ->', (done: Function) => {
            helper.edit('I12', '=TEXT(B5,"M/yyyy")');
            const cellEle: HTMLElement = helper.invoke('getCell', [11, 8]);
            expect(cellEle.textContent).toBe('11/2014');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            expect(helper.getInstance().sheets[0].rows[11].cells[8].formula).toEqual('=TEXT(B5,"M/yyyy")');
            done();
        });
        it('TEXT Formula with Date format - dddd MMMM dd yyyy ->', (done: Function) => {
            helper.edit('J1', '=TEXT(B2,"dddd MMMM dd yyyy")');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('February 14, 2014');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toEqual('=TEXT(B2,"dddd MMMM dd yyyy")');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toEqual('February 14, 2014');
            done();
        });
        it('TEXT Formula with Date format - dd MMMM yyyy ->', (done: Function) => {
            helper.edit('J2', '=TEXT(B3,"dd MMMM yyyy")');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('June 11, 2014');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toEqual('=TEXT(B3,"dd MMMM yyyy")');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toEqual('June 11, 2014');
            done();
        });
        it('TEXT Formula with Date format - d MMMM yyyy ->', (done: Function) => {
            helper.edit('J3', '=TEXT(B4,"d MMMM yyyy")');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Jul 27, 2014');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toEqual('=TEXT(B4,"d MMMM yyyy")');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toEqual('Jul 27, 2014');
            done();
        });
        it('TEXT Formula with Date format - yyyy ->', (done: Function) => {
            helper.edit('J4', '=TEXT(B5,"yyyy")');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('2014');
            expect(helper.getInstance().sheets[0].rows[3].cells[9].formula).toEqual('=TEXT(B5,"yyyy")');
            expect(helper.getInstance().sheets[0].rows[3].cells[9].value).toEqual('2014');
            done();
        });
        it('TEXT Formula with Date format - dddd ->', (done: Function) => {
            helper.edit('J5', '=TEXT(B3,"dddd")');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('Wed');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].formula).toEqual('=TEXT(B3,"dddd")');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].value).toEqual('Wed');
            done();
        });
        it('TEXT Formula with Date format - d ->', (done: Function) => {
            helper.edit('J6', '=TEXT(B4,"d")');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('27');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].formula).toEqual('=TEXT(B4,"d")');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].value).toEqual('27');
            done();
        });
        it('TEXT Formula with Date format - d dddd ->', (done: Function) => {
            helper.edit('J7', '=TEXT(B3,"d dddd")');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('11 Wed');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].formula).toEqual('=TEXT(B3,"d dddd")');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].value).toEqual('11 Wed');
            done();
        });
        it('TEXT Formula with Date format - M ->', (done: Function) => {
            helper.edit('J8', '=TEXT(B5,"M")');
            expect(helper.invoke('getCell', [7, 9]).textContent).toBe('11');
            expect(helper.getInstance().sheets[0].rows[7].cells[9].formula).toEqual('=TEXT(B5,"M")');
            expect(helper.getInstance().sheets[0].rows[7].cells[9].value).toEqual('11');
            done();
        });
        it('TEXT Formula with Date format - Md ->', (done: Function) => {
            helper.edit('J9', '=TEXT(B2,"Md")');
            expect(helper.invoke('getCell', [8, 9]).textContent).toBe('2/14');
            expect(helper.getInstance().sheets[0].rows[8].cells[9].formula).toEqual('=TEXT(B2,"Md")');
            done();
        });
        it('TEXT Formula with Date format - MMM ->', (done: Function) => {
            helper.edit('J10', '=TEXT(B5,"MMM")');
            expect(helper.invoke('getCell', [9, 9]).textContent).toBe('Nov');
            expect(helper.getInstance().sheets[0].rows[9].cells[9].formula).toEqual('=TEXT(B5,"MMM")');
            expect(helper.getInstance().sheets[0].rows[9].cells[9].value).toEqual('Nov');
            done();
        });
        it('TEXT Formula with Date format - ddd MMM d ->', (done: Function) => {
            helper.edit('J11', '=TEXT(B3,"ddd MMM d")');
            expect(helper.invoke('getCell', [10, 9]).textContent).toBe('Wed, Jun 11');
            expect(helper.getInstance().sheets[0].rows[10].cells[9].formula).toEqual('=TEXT(B3,"ddd MMM d")');
            expect(helper.getInstance().sheets[0].rows[10].cells[9].value).toEqual('Wed, Jun 11');
            done();
        });
        it('TEXT Formula with Date format - ddd->', (done: Function) => {
            helper.edit('J12', '=TEXT(B6,"ddd")');
            expect(helper.invoke('getCell', [11, 9]).textContent).toBe('Mon');
            expect(helper.getInstance().sheets[0].rows[11].cells[9].formula).toEqual('=TEXT(B6,"ddd")');
            expect(helper.getInstance().sheets[0].rows[11].cells[9].value).toEqual('Mon');
            done();
        });
    });

    describe('Text Formula - Checking with Different Time Format->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('TEXT Formula with Time format - h:mm ->', (done: Function) => {
            helper.edit('I1', '=TEXT(C2,"h:mm")');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('11:34');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toEqual('=TEXT(C2,"h:mm")');
            done();
        });
        it('TEXT Formula with Time format - h:mm tt ->', (done: Function) => {
            helper.edit('I2', '=TEXT(C3,"h:mm tt")');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('5:56 AM');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toEqual('=TEXT(C3,"h:mm tt")');
            done();
        });
        it('TEXT Formula with Time format - h ->', (done: Function) => {
            helper.edit('I3', '=TEXT(C4,"h")');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('03');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].formula).toEqual('=TEXT(C4,"h")');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toEqual('03');
            done();
        });
        it('TEXT Formula with Time format - h tt ->', (done: Function) => {
            helper.edit('I4', '=TEXT(C5,"h tt")');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('6 AM');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toEqual('=TEXT(C5,"h tt")');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].value).toEqual('6 AM');
            done();
        });
        it('TEXT Formula with Time format - h:mm:ss tt ->', (done: Function) => {
            helper.edit('I5', '=TEXT(C6,"h:mm:ss tt")');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('12:43:59 AM');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].formula).toEqual('=TEXT(C6,"h:mm:ss tt")');
            done();
        });
        it('TEXT Formula with Time format - h:mm:ss ->', (done: Function) => {
            helper.edit('I6', '=TEXT(C7,"h:mm:ss")');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('10:55:53');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].formula).toEqual('=TEXT(C7,"h:mm:ss")');
            done();
        });
        it('TEXT Formula with invalid format->', (done: Function) => {
            helper.edit('I7', '=TEXT(B2,"MM/dd/yy")');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('#NAME?');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toEqual('=TEXT(B2,"MM/dd/yy")');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].value).toEqual('#NAME?');
            done();
        });
    });

    describe('UI - Interaction', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Open circular reference dialog->', (done: Function) => {
            helper.edit('I1', '19');
            helper.edit('I2', '20');
            helper.edit('I3', '=I1+I2+I3');
            setTimeout(() => {
                helper.setAnimationToNone('.e-control.e-dialog');
                expect(helper.getElement('.e-control.e-dialog')).not.toBeNull();
                helper.click('.e-control .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Selecting formula in dropdown->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=SU';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(H2:H11)';
                helper.triggerKeyNativeEvent(13);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[9])).toBe('{"value":554,"formula":"=SUM(H2:H11)"}');
                done();
            });
        });
        it('Selecting sub formula in dropdown->', (done: Function) => {
            helper.invoke('selectRange', ['J2']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=SU';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                editElem.textContent = '=SUM(SU';
                helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(2)');
                    helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(SUM(H2:H11))';
                    helper.triggerKeyNativeEvent(13);
                    setTimeout(() => {
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":554,"formula":"=SUM(SUM(H2:H11))"}');
                        done();
                    });
                });
            });
        });
        it('Clicking down arrow and up arrow and tab key in formula dropdown->', (done: Function) => {
            helper.invoke('selectRange', ['J3']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=SU';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                helper.triggerKeyNativeEvent(40);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(38);
                    helper.triggerKeyNativeEvent(40);
                    helper.triggerKeyNativeEvent(9);
                    helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(H2:H11)';
                    helper.triggerKeyNativeEvent(13);
                    setTimeout(() => {
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":554,"formula":"=SUM(H2:H11)"}');
                        done();
                    });
                });
            });
        });
        it('Close name box popup using esc button->', (done: Function) => {
            helper.invoke('selectRange', ['J3']);
            let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
            nameBox.click();
            setTimeout(() => {
                helper.triggerKeyEvent('keydown', 27, null, false, false, nameBox);
                done();
            });
        });
        it('Editing after opening suggestion already opened in dropdown->', (done: Function) => {
            helper.invoke('selectRange', ['J4']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=S';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                editElem.textContent = '=SU';
                helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(2)');
                    helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(H2:H11)';
                    helper.triggerKeyNativeEvent(13);
                    setTimeout(() => {
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[9])).toBe('{"value":554,"formula":"=SUM(H2:H11)"}');
                        done();
                    });
                });
            });
        });
        it('Defined name editing alert->', (done: Function) => {
            helper.invoke('selectRange', ['J1:J4']);
            let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
            nameBox.click();
            nameBox.value = 'Test1';
            helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
            helper.invoke('selectRange', ['I1:I3']);
            nameBox.click();
            nameBox.value = 'Test1';
            helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
            setTimeout(() => {
                helper.setAnimationToNone('.e-control.e-dialog');
                expect(helper.getElement('.e-control.e-dialog')).not.toBeNull();
                helper.click('.e-control .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Deleting sub formula after adding->', (done: Function) => {
            helper.invoke('selectRange', ['K1']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=SU';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                editElem.textContent = '=SUM(S';
                helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                setTimeout(() => {
                    editElem.textContent = '=SUM(';
                    helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
                    setTimeout(() => {
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":554,"formula":"=SUM(SUM(H2:H11))"}');
                        done();
                    });
                });
            });
        });
        it('Cancelling the circular reference error dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            helper.edit('I1', '19');
            helper.edit('I2', '20');
            helper.edit('I3', '=I1+I2+I3');
            setTimeout(function () {
                expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull();
                helper.invoke('selectRange', ['K2']);
                done();
            });
        });
        it('Selecting formula in dropdown in formula bar->', (done: Function) => {
            let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            editorElem.dispatchEvent(e);
            const editElem: HTMLElement = helper.getCellEditorElement();
            editElem.textContent = '=SU';
            helper.triggerKeyEvent('keyup', 83, null, null, null, editElem);
            setTimeout(() => {
                helper.click('.e-ddl.e-popup li:nth-child(2)');
                helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(H2:H11)';
                helper.triggerKeyNativeEvent(13);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[10])).toBe('{"value":554,"formula":"=SUM(H2:H11)"}');
                done();
            });
        });
        it('Add defined for whole column', (done: Function) => {
            helper.invoke('selectRange', [getRangeAddress([0, 7, helper.getInstance().sheets[0].rowCount, 7])]);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = '123';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                nameBox.classList.remove('e-name-editing');
                expect(helper.getInstance().definedNames.length).toBe(2);
                expect(helper.getInstance().definedNames[1].name).toBe('123');
                done();
            }, 20);
        });
        it('Cancelling the definename exists dialog error', (done: Function) => {
            helper.invoke('selectRange', ['A5:A7']);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = '123';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                setTimeout(function () {
                    expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull();
                    done();
                });
            }, 20);
        });
        it('Cancelling the definename invalid dialog error', (done: Function) => {
            helper.invoke('selectRange', ['A5:A7']);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = '/';
                helper.triggerKeyEvent('keydown', 13, null, false, false, nameBox);
                setTimeout(function () {
                    expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).toBeNull();
                    done();
                });
            }, 20);
        });
    });

    describe('Base module cases I->', () => { 
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('SUMIF formula with no range argument ->', (done: Function) => {
            helper.edit('I1', '=SUMIF(,"10")');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('improper formula');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toEqual('=SUMIF(,"10")');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toEqual('improper formula');
            done();
        });
        it('SUMIF formula with no argument ->', (done: Function) => {
            helper.edit('I2', '=SUMIF()');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('improper formula');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toEqual('=SUMIF()');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toEqual('improper formula');
            done();
        });
        it('SUMIF formula with argument hvaing whole column range->', (done: Function) => {
            helper.edit('I3', '=SUMIF(H:H,">10")');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('489');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].formula).toEqual('=SUMIF(H:H,">10")');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toEqual(489);
            done();
        });
        it('SUMIF formula with argument having *, >, and number as criteria value->', (done: Function) => {
            helper.edit('I4', '=SUMIF(H2:H5,">*1")');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('0');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toEqual('=SUMIF(H2:H5,">*1")');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].value).toEqual(0);
            done();
        });
        it('SUMIF formula with argument having * and number as criteria value->', (done: Function) => {
            helper.edit('I5', '=SUMIF(H2:H5,"*1")');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('10');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].formula).toEqual('=SUMIF(H2:H5,"*1")');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].value).toEqual(10);
            done();
        });
        it('SUMIF formula with argument having * only as criteria value->', (done: Function) => {
            helper.edit('I6', '=SUMIF(H2:H5,"*")');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('0');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].formula).toEqual('=SUMIF(H2:H5,"*")');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].value).toEqual(0);
            done();
        });
        it('SUMIF formula with argument having with criteria value length > 255->', (done: Function) => {
            helper.edit('I7', '=SUMIF(H2:H5,">123456789090123456789012345678789012345678799999877654544121233456775345654323456543234565432345654345699012346587909098765432123456789876543234567876888889999998889999999987654345678987654323456789098765432345678909876543345678987654323456789876543456785")');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('#VALUE!');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toEqual('=SUMIF(H2:H5,">123456789090123456789012345678789012345678799999877654544121233456775345654323456543234565432345654345699012346587909098765432123456789876543234567876888889999998889999999987654345678987654323456789098765432345678909876543345678987654323456789876543456785")');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].value).toEqual('#VALUE!');
            done();
        });
        it('SUMIF formula with argument having with criteria value having * and equal operator->', (done: Function) => {
            helper.edit('I8', '=SUMIF(H2:H5,"=*10")');
            expect(helper.invoke('getCell', [7, 8]).textContent).toBe('10');
            expect(helper.getInstance().sheets[0].rows[7].cells[8].formula).toEqual('=SUMIF(H2:H5,"=*10")');
            expect(helper.getInstance().sheets[0].rows[7].cells[8].value).toEqual(10);
            done();
        });
        it('SUMIF formula with argument having with criteria value having * and less than equal operator->', (done: Function) => {
            helper.edit('I9', '=SUMIF(H2:H5,"<=30")');
            expect(helper.invoke('getCell', [8, 8]).textContent).toBe('37');
            expect(helper.getInstance().sheets[0].rows[8].cells[8].formula).toEqual('=SUMIF(H2:H5,"<=30")');
            expect(helper.getInstance().sheets[0].rows[8].cells[8].value).toEqual(37);
            done();
        });
        it('AVERAGEIF formula with no range argument ->', (done: Function) => {
            helper.edit('J1', '=AVERAGEIF(,">10")');
            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('improper formula');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toEqual('=AVERAGEIF(,">10")');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toEqual('improper formula');
            done();
        });
        it('AVERAGEIF formula with no argument->', (done: Function) => {
            helper.edit('J2', '=AVERAGEIF()');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('improper formula');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toEqual('=AVERAGEIF()');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toEqual('improper formula');
            done();
        });
        it('AVERAGEIF formula with argument hvaing whole column range->', (done: Function) => {
            helper.edit('J3', '=AVERAGEIF(H:H,">10")');
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('61.125');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toEqual('=AVERAGEIF(H:H,">10")');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toEqual(61.125);
            done();
        });
        it('AVERAGEIF formula with argument having *, >, and number as criteria value->', (done: Function) => {
            helper.edit('J4', '=AVERAGEIF(H2:H5,">*1")');
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('NaN');
            expect(helper.getInstance().sheets[0].rows[3].cells[9].formula).toEqual('=AVERAGEIF(H2:H5,">*1")');
            expect(helper.getInstance().sheets[0].rows[3].cells[9].value).toEqual(NaN);
            done();
        });
        it('AVERAGEIF formula with argument having * and number as criteria value->', (done: Function) => {
            helper.edit('J5', '=AVERAGEIF(H2:H5,"*1")');
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('10');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].formula).toEqual('=AVERAGEIF(H2:H5,"*1")');
            expect(helper.getInstance().sheets[0].rows[4].cells[9].value).toEqual(10);
            done();
        });
        it('AVERAGEIF formula with argument having * only as criteria value->', (done: Function) => {
            helper.edit('J6', '=AVERAGEIF(H2:H5,"*")');
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('NaN');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].formula).toEqual('=AVERAGEIF(H2:H5,"*")');
            expect(helper.getInstance().sheets[0].rows[5].cells[9].value).toEqual(NaN);
            done();
        });
        it('AVERAGEIF formula with argument having with criteria value length > 255->', (done: Function) => {
            helper.edit('J7', '=AVERAGEIF(H2:H5,">123456789090123456789012345678789012345678799999877654544121233456775345654323456543234565432345654345699012346587909098765432123456789876543234567876888889999998889999999987654345678987654323456789098765432345678909876543345678987654323456789876543456785")');
            expect(helper.invoke('getCell', [6, 9]).textContent).toBe('#VALUE!');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].formula).toEqual('=AVERAGEIF(H2:H5,">123456789090123456789012345678789012345678799999877654544121233456775345654323456543234565432345654345699012346587909098765432123456789876543234567876888889999998889999999987654345678987654323456789098765432345678909876543345678987654323456789876543456785")');
            expect(helper.getInstance().sheets[0].rows[6].cells[9].value).toEqual('#VALUE!');
            done();
        });
        it('AVERAGEIF formula->', (done: Function) => {
            helper.edit('K1', '=AVERAGEIFS(H2:H5,E2:E5,">10")');
            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('38.5');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].formula).toEqual('=AVERAGEIFS(H2:H5,E2:E5,">10")');
            expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toEqual(38.5);
            done();
        });
        it('AVERAGEIFS formula with no argument->', (done: Function) => {
            helper.edit('K2', '=AVERAGEIFS()');
            expect(helper.invoke('getCell', [1, 10]).textContent).toBe('wrong number of arguments');
            expect(helper.getInstance().sheets[0].rows[1].cells[10].formula).toEqual('=AVERAGEIFS()');
            expect(helper.getInstance().sheets[0].rows[1].cells[10].value).toEqual('wrong number of arguments');
            done();
        });
        it('AVERAGEIFS formula with criteria value as *->', (done: Function) => {
            helper.edit('K3', '=AVERAGEIFS(H2:H5,H2:H5,"*")');
            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[2].cells[10].formula).toEqual('=AVERAGEIFS(H2:H5,H2:H5,"*")');
            expect(helper.getInstance().sheets[0].rows[2].cells[10].value).toEqual('#DIV/0!');
            done();
        });
        it('AVERAGEIFS formula with criteria value as ?->', (done: Function) => {
            helper.edit('K4', '=AVERAGEIFS(H2:H5,H2:H5,"?")');
            expect(helper.invoke('getCell', [3, 10]).textContent).toBe('#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].formula).toEqual('=AVERAGEIFS(H2:H5,H2:H5,"?")');
            expect(helper.getInstance().sheets[0].rows[3].cells[10].value).toEqual('#DIV/0!');
            done();
        });
        it('AVERAGEIFS formula with criteria value as ? And numbers->', (done: Function) => {
            helper.edit('K5', '=AVERAGEIFS(H2:H5,H2:H5,"1?1")');
            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].formula).toEqual('=AVERAGEIFS(H2:H5,H2:H5,"1?1")');
            expect(helper.getInstance().sheets[0].rows[4].cells[10].value).toEqual('#DIV/0!');
            done();
        });
        it('AVERAGEIFS formula with criteria value as ? And numbers - II->', (done: Function) => {
            helper.edit('K6', '=AVERAGEIFS(H2:H5,H2:H5,"11?1")');
            expect(helper.invoke('getCell', [5, 10]).textContent).toBe('#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[5].cells[10].formula).toEqual('=AVERAGEIFS(H2:H5,H2:H5,"11?1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[10].value).toEqual('#DIV/0!');
            done();
        });
        it('Date formula with month > 12 and day > 31->', (done: Function) => {
            helper.edit('K7', '=DATE(2022,25,33)');
            expect(helper.invoke('getCell', [6, 10]).textContent).toBe('02/02/2024');
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[6].cells[10])).toBe('{"value":"45324","formula":"=DATE(2022,25,33)","format":"mm-dd-yyyy"}');
            done();
        });
    });

    describe('Base module cases - II->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Formula with #DIV/0! as formula->', (done: Function) => {
            helper.edit('I1', '=#DIV/0!');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toEqual('=#DIV/0!');
            expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toEqual('#DIV/0!');
            done();
        });
        it('Formula with #NAME? as formula->', (done: Function) => {
            helper.edit('I2', '=#NAME?');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('#NAME?');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].formula).toEqual('=#NAME?');
            expect(helper.getInstance().sheets[0].rows[1].cells[8].value).toEqual('#NAME?');
            done();
        });
        it('Formula with - as formula->', (done: Function) => {
            helper.edit('I3', '=-');
            expect(helper.invoke('getCell', [2, 8]).textContent).toBe('');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].formula).toEqual('=-');
            expect(helper.getInstance().sheets[0].rows[2].cells[8].value).toEqual('');
            done();
        });
        it('Formula with value inside in []->', (done: Function) => {
            helper.edit('I4', '=[1+5+3]');
            expect(helper.invoke('getCell', [3, 8]).textContent).toBe('9');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].formula).toEqual('=[1+5+3]');
            expect(helper.getInstance().sheets[0].rows[3].cells[8].value).toEqual('9');
            done();
        });
        it('Formula with value inside in [] for defined name reference->', (done: Function) => {
            helper.getInstance().addDefinedName({name: 'Test', refersTo: 'H2:H5'});
            helper.edit('I5', '=SUM([Test])');
            expect(helper.invoke('getCell', [4, 8]).textContent).toBe('154');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].formula).toEqual('=SUM([Test])');
            expect(helper.getInstance().sheets[0].rows[4].cells[8].value).toEqual(154);
            done();
        });
        it('Formula with #N/A as formula->', (done: Function) => {
            helper.edit('I6', '=#N/A');
            expect(helper.invoke('getCell', [5, 8]).textContent).toBe('invalid expression');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].formula).toEqual('=#N/A');
            expect(helper.getInstance().sheets[0].rows[5].cells[8].value).toEqual('invalid expression');
            done();
        });
        it('Formula with []  and {} ->', (done: Function) => {
            helper.edit('I7', '=SUM([{1+5}])');
            expect(helper.invoke('getCell', [6, 8]).textContent).toBe('6');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].formula).toEqual('=SUM([{1+5}])');
            expect(helper.getInstance().sheets[0].rows[6].cells[8].value).toEqual(6);
            done();
        });
    });

    describe('UI - Interaction', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Update defined names method with changed as true->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.updateDefinedNames({name: 'test'}, 'Price Deatils', [1,5], true, [5,1], {index: 0});
            setTimeout(() => {
                expect(helper.getInstance().definedNames.length).toBe(0);
                done();
            });
        });
        it('Update defined names method with changed as false->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.updateDefinedNames({name: 'test'}, 'Price Deatils', [15], false, [5], {index: 0});
            setTimeout(() => {
                expect(helper.getInstance().definedNames.length).toBe(0);
                done();
            });
        });
        it('Refresh named range method testing->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.refreshNamedRange({ sheet: { name: 'Sheet!' }, modelType: "Row", isInsert: true, definedNames: { name: 'Test' } });
            setTimeout(() => {
                expect(helper.getInstance().definedNames.length).toBe(0);
                done();
            });
        });
        it('Update data container method testing for active selected cell->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.updateDataContainer([0,0], { value: 20, sheetId: 1, visible: true });
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value.innerText).toBeUndefined();
                done();
            });
        });
        it('Update data container method testing for cell with no data in a row->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.updateDataContainer([0,10], { value: 20, sheetId: 1, visible: true });
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toBeUndefined();
                done();
            });
        });
        it('Update data container method testing for cell with no data in a column->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.updateDataContainer([12,0], { value: 20, sheetId: 1, visible: true });
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[10].value).toBeUndefined();
                done();
            });
        });
        it('Add defined name method testing->', (done: Function) => {
            helper.getInstance().workbookFormulaModule.addDefinedName({name: 'Test', refersTo: 'E2:E5', scope: 'Workbook'}, true, 1, true)
            setTimeout(() => {
                let definedNames: DefineNameModel[] = helper.getInstance().definedNames;
                expect(definedNames.length).toBe(1);
                expect(definedNames[0].name).toBe('Test');
                done();
            });
        });
        it('Clearalluniqueformulavalue method testing->', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.invoke('updateCell', [{ value: '10' }, 'I4']);
            helper.invoke('updateCell', [{ formula: '=UNIQUE(H2:H5)' }, 'I1']);
            helper.getInstance().workbookFormulaModule.clearAllUniqueFormulaValue();
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toBe('=UNIQUE(H2:H5)');
                expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('#SPILL!');
                done();
            });
        });
    });

    describe('UI - Interaction for delete the formula value referenced row', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells: [{ index: 9, formula: '=H10&H11'  } ,  { format: '##0.0E+0', value: '10'   }] },
        { cells: [{ index: 9, formula: '=H9^H10' }] }, { cells: [{ index: 9, formula: '=H8<H9' }] }  ] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply delete with operator "&" and delete the formula value referenced row->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=H10&H11');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('16655');
            helper.invoke('selectRange', ['A11']);
            helper.invoke('delete', [10, 10, 'Row']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=H10&H11:H10');
                expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('#VALUE!');
                done();
            });
        });
        it('Apply delete with operator "^" and delete the formula value referenced row->', (done: Function) => {
            helper.invoke('selectRange', ['A10']);
            expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toBe('=H9^H10');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('5.728852639234935e+242');
            helper.invoke('delete', [9, 9, 'Row']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[1].cells[9].formula).toBe('=H9^H10:H9');
                expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('invalid expression');
                done();
            });
        });
        it('Apply delete with operator "<" and delete the formula value referenced row->', (done: Function) => {
            helper.invoke('selectRange', ['A9']);
            expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toBe('=H8<H9');
            expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('TRUE');
            helper.invoke('delete', [8, 8, 'Row']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].cells[9].formula).toBe('=H8<H9:H8');
                expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('invalid expression');
                done();
            });
        });
        // it('Checking scientific custom number format value', (done: Function) => {  // scientific custom format issue. needs to fix.
        //     helper.invoke('selectRange', ['K1']);
        //     expect(helper.invoke('getCell', [0, 10]).textContent).toBe('10.0E+0');
        //     expect(helper.getInstance().sheets[0].rows[0].cells[10].format).toBe('##0.0E+0');
        //     done();
        // });
        // it('Apply scientific number format ', (done: Function) => {
        //     helper.getElement('#'+helper.id+'_number_format').click();
        //     helper.getElement('#'+helper.id+'_Scientific').click();
        //     expect(helper.invoke('getCell', [0, 10]).textContent).toBe('1.00E+01');
        //     expect(helper.getInstance().sheets[0].rows[0].cells[10].format).toBe('0.00E+00');
        //     done();
        // });
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ formula: '=COUNTIF(AR1:AT1,"=10")' }, { index: 4, formula: '=SUMIF(AR1:AT1,"=10")' },
                        { index: 43, value: '10' }, { value: '5' }, { value: '10' }] }], columns: [{ index: 1, width: 120 }] }] }, done);
            });
            afterAll(() => {
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
            it('SF-422696 -> SUMIFS formula not working if the criteria contains both operator and a cell range', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ value: 'Residential' }, 'B1']);
                helper.invoke('updateCell', [{ value: 'Residential' }, 'B2']);
                helper.invoke('updateCell', [{ value: 'Residential' }, 'B3']);
                helper.invoke('updateCell', [{ value: '1' }, 'C1']);
                helper.invoke('updateCell', [{ value: '2' }, 'C2']);
                helper.invoke('updateCell', [{ value: '3' }, 'C3']);
                helper.invoke('updateCell', [{ formula: '=SUMIFS(C1:C3,B1:B3,"="&B1)' }, 'D1']);
                const cell: any = spreadsheet.sheets[0].rows[0].cells[3];
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(cell.formula).toBe('=SUMIFS(C1:C3,B1:B3,"="&B1)');
                expect(cell.value).toBe(6);
                expect(cellEle.textContent).toBe('6');
                helper.invoke('updateCell', [{ value: 'Residential 1' }, 'B2']);
                expect(cell.value).toBe(4);
                expect(cellEle.textContent).toBe('4');
                helper.invoke('updateCell', [{ formula: '=SUMIFS(C1:C3,B1:B3,"<>"&Sheet1!B1)' }, 'D1']);
                expect(cell.value).toBe(2);
                expect(cellEle.textContent).toBe('2');
                helper.invoke('updateCell', [{ value: 'Residential 2' }, 'B3']);
                expect(cell.value).toBe(5);
                expect(cellEle.textContent).toBe('5');
                helper.invoke('updateCell', [{ value: 'Residential 1' }, 'B4']);
                helper.invoke('updateCell', [{ value: '4' }, 'C4']);
                helper.invoke('updateCell', [{ formula: '=SUMIFS(C1:C4,B1:B4,"<>"Sheet1!B1,B1:B4,"<>"&B3)' }, 'D1']);
                expect(cell.value).toBe(6);
                expect(cellEle.textContent).toBe('6');
                helper.invoke('updateCell', [{ formula: '=SUMIFS(C1:C4, B1:B4 , "Residential")' }, 'D1']);
                expect(cell.value).toBe(1);
                expect(cellEle.textContent).toBe('1');
                helper.invoke('updateCell', [{ formula: '=COUNTIFS(B1:B4,"<>"&Sheet1!B1)' }, 'D1']);
                expect(cell.value).toBe(3);
                expect(cellEle.textContent).toBe('3');
                helper.invoke('updateCell', [{ formula: '=COUNTIFS(B1:B4,"="Sheet1!B2)' }, 'D1']);
                expect(cell.formula).toBe('=COUNTIFS(B1:B4,"="Sheet1!B2)');
                expect(cell.value).toBe(2);
                expect(cellEle.textContent).toBe('2');
                helper.invoke('updateCell', [{ formula: '=AVERAGEIFS(C1:C4,B1:B4,"<>"Sheet1!B2)' }, 'D1']);
                expect(cell.formula).toBe('=AVERAGEIFS(C1:C4,B1:B4,"<>"Sheet1!B2)');
                expect(cell.value).toBe(2);
                expect(cellEle.textContent).toBe('2');
                helper.invoke('updateCell', [{ formula: '=AVERAGEIFS(C1:C4,B1:B4,"="&Sheet1!B2)' }, 'D1']);
                expect(cell.formula).toBe('=AVERAGEIFS(C1:C4,B1:B4,"="&Sheet1!B2)');
                expect(cell.value).toBe(3);
                expect(cellEle.textContent).toBe('3');
                done();
            });
            it('SF-422232 -> OR operation in SUMIFS formula', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,B1:B4,{"Residential","Residential 1"}))' }, 'D2']);
                const cell: any = spreadsheet.sheets[0].rows[1].cells[3];
                const cellEle: HTMLElement = helper.invoke('getCell', [1, 3]);
                expect(cell.value).toBe(7);
                expect(cellEle.textContent).toBe('7');
                helper.invoke('updateCell', [{ formula: '=SUM(AVERAGEIFS(C1:C4,B1:B4,{"Residential 2","Residential 1"}))' }, 'D2']);
                expect(cell.value).toBe(6);
                expect(cellEle.textContent).toBe('6');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,B1:B4,{"Residential";"Residential 2"}))' }, 'D2']);
                expect(cell.value).toBe(4);
                expect(cellEle.textContent).toBe('4');
                helper.invoke('updateCell', [{ formula: '=AVERAGE(AVERAGEIFS(C1:C4, B1:B4, {"Residential", "Residential 2"}))' }, 'D2']);
                expect(cell.value).toBe('2');
                expect(cellEle.textContent).toBe('2');
                helper.invoke('updateCell', [{ value: 'Residential 3' }, 'B4']);
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,B1:B4,{"Residential 1","Residential 2","Residential 3"}))' }, 'D2']);
                expect(cell.value).toBe(9);
                expect(cellEle.textContent).toBe('9');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,B1:B4,{"<>Residential 1","=Residential 2"}))' }, 'D2']);
                expect(cell.value).toBe(11);
                expect(cellEle.textContent).toBe('11');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,B1:B4, {"Residential"}))' }, 'D2']);
                expect(cell.formula).toBe('=SUM(SUMIFS(C1:C4,B1:B4, {"Residential"}))');
                expect(cell.value).toBe(1);
                expect(cellEle.textContent).toBe('1');
                helper.invoke('updateCell', [{ value: '33' }, 'F1']);
                helper.invoke('updateCell', [{ value: '45' }, 'F2']);
                helper.invoke('updateCell', [{ value: '28' }, 'F3']);
                helper.invoke('updateCell', [{ value: '25' }, 'F4']);
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,F1:F4,{33,28}))' }, 'D2']);
                expect(cell.value).toBe(4);
                expect(cellEle.textContent).toBe('4');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,F1:F4,{"25","45"}))' }, 'D2']);
                expect(cell.value).toBe(6);
                expect(cellEle.textContent).toBe('6');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,F1:F4, {">20","<30"}))' }, 'D2']);
                expect(cell.value).toBe(17);
                expect(cellEle.textContent).toBe('17');
                helper.invoke('updateCell', [{ formula: '=AVERAGE(AVERAGEIFS(C1:C4,F1:F4, {">30","<50"}))' }, 'D2']);
                expect(cell.value).toBe('2');
                expect(cellEle.textContent).toBe('2');
                helper.invoke('updateCell', [{ value: 'TRUE' }, 'G1']);
                helper.invoke('updateCell', [{ value: 'FALSE' }, 'G3']);
                helper.invoke('updateCell', [{ value: 'TRUE' }, 'G4']);
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,G1:G4,{"=TRUE","<>FALSE"}))' }, 'D2']);
                expect(cell.value).toBe(12);
                expect(cellEle.textContent).toBe('12');
                helper.invoke('updateCell', [{ formula: '=SUM(SUMIFS(C1:C4,G1:G4,{TRUE,FALSE}))' }, 'D2']);
                expect(cell.value).toBe(8);
                expect(cellEle.textContent).toBe('8');
                helper.invoke('updateCell', [{ formula: '=AVERAGE(SUMIFS(C1:C4, G1:G4, {"=TRUE", "<>FALSE"}))' }, 'D2']);
                expect(cell.value).toBe('6');
                expect(cellEle.textContent).toBe('6');
                done();
            });
        });
        describe('EJ2-66373 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{
                        rows: [
                            { cells: [{ value: '1' }, { value: '1' }, { value: '' }, { value: '1' }, { formula: '=MEDIAN(A1:D1)' }]},
                            { cells: [{ value: '2' }, { value: '2' }, { value: 'Text' }, { value: '' }, { formula: '=MEDIAN(A2:D2)' }]},
                            { cells: [{ value: '3' }, { value: '3' }, { value: '1' }, { value: '2' }, { formula: '=MEDIAN(A3:D3)' }]},
                            { cells: [{ value: 'Text' }, { value: '4' }, { value: '2' }, { value: 'Text' }, { formula: '=MEDIAN(A4:D4)' }]},
                            { cells: [{ value: '4' }, { value: '4' }, { value: '3' }, { value: '3' }, { formula: '=MEDIAN(A5:D5)' }]},
                            { cells: [{ value: '' }, { value: 'Text' }, { value: '4' }, { value: '4' }, { formula: '=MEDIAN(A6:D6)' }]},
                            { cells: [{ value: '5' }, { value: '' }, { value: '5' }, { value: '5' }, { formula: '=MEDIAN(A7:D7)' }]},
                            { cells: [{ formula: '=MEDIAN(A1:A7)' }, { formula: '=MEDIAN(B1:B7)' }, { formula: '=MEDIAN(C1:C7)' }, { formula: '=MEDIAN(D1:D7)' }]},
                        ]
                    }, {
                        rows: [
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A1:D1)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A2:D2)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A3:D3)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A4:D4)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A5:D5)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A6:D6)' }]},
                            { cells: [{ index: 4, formula: '=MEDIAN(Sheet1!A7:D7)' }]},
                            { cells: [{ formula: '=MEDIAN(Sheet1!A1:A7)' }, { formula: '=MEDIAN(Sheet1!B1:B7)' }, { formula: '=MEDIAN(Sheet1!C1:C7)' }, { formula: '=MEDIAN(Sheet1!D1:D7)' }]},
                        ]
                    }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Page becomes unresponsive after provide Median formula with String and Numbers', (done: Function) => {
                expect(helper.getInstance().sheets[0].rows[0].cells[4].value).toBe(1);
                expect(helper.getInstance().sheets[0].rows[1].cells[4].value).toBe(2);
                expect(helper.getInstance().sheets[0].rows[2].cells[4].value).toBe(2.5);
                expect(helper.getInstance().sheets[0].rows[3].cells[4].value).toBe(3);
                expect(helper.getInstance().sheets[0].rows[4].cells[4].value).toBe(3.5);
                expect(helper.getInstance().sheets[0].rows[5].cells[4].value).toBe(4);
                expect(helper.getInstance().sheets[0].rows[6].cells[4].value).toBe(5);
                expect(helper.getInstance().sheets[0].rows[7].cells[0].value).toBe(3);
                expect(helper.getInstance().sheets[0].rows[7].cells[1].value).toBe(3);
                expect(helper.getInstance().sheets[0].rows[7].cells[2].value).toBe(3);
                expect(helper.getInstance().sheets[0].rows[7].cells[3].value).toBe(3);
                helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1].click();
                setTimeout(() => {
                    expect(helper.getInstance().sheets[1].rows[0].cells[4].value).toBe(1);
                    expect(helper.getInstance().sheets[1].rows[1].cells[4].value).toBe(2);
                    expect(helper.getInstance().sheets[1].rows[2].cells[4].value).toBe(2.5);
                    expect(helper.getInstance().sheets[1].rows[3].cells[4].value).toBe(3);
                    expect(helper.getInstance().sheets[1].rows[4].cells[4].value).toBe(3.5);
                    expect(helper.getInstance().sheets[1].rows[5].cells[4].value).toBe(4);
                    expect(helper.getInstance().sheets[1].rows[6].cells[4].value).toBe(5);
                    expect(helper.getInstance().sheets[1].rows[7].cells[0].value).toBe(3);
                    expect(helper.getInstance().sheets[1].rows[7].cells[1].value).toBe(3);
                    expect(helper.getInstance().sheets[1].rows[7].cells[2].value).toBe(3);
                    expect(helper.getInstance().sheets[1].rows[7].cells[3].value).toBe(3);
                    done();
                });
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
            it('DAY formula returns NAN value for integer formatted date value', (done: Function) => {
                helper.edit('F1', '=DAY("7/24/1969")');
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 5]);
                const cell: any = helper.getInstance().getActiveSheet().rows[0].cells[5];
                expect(cell.value).toBe(24);
                expect(cellEle.textContent).toBe('24');
                helper.edit('E1', '7/24/1969');
                helper.edit('F1', '=DAY(E1)');
                expect(cell.value).toBe(24);
                expect(cellEle.textContent).toBe('24');
                helper.edit('F1', '=DAY(4)');
                expect(cell.value).toBe(4);
                expect(cellEle.textContent).toBe('4');
                helper.edit('F1', '=DAY("18")');
                expect(cell.value).toBe(18);
                expect(cellEle.textContent).toBe('18');
                helper.edit('F1', '=DAY("2-june-2016")');
                expect(cell.value).toBe(2);
                expect(cellEle.textContent).toBe('2');
                helper.edit('F1', '=DAY("October 22")');
                expect(cell.value).toBe(22);
                expect(cellEle.textContent).toBe('22');
                helper.edit('F1', '=DAY("October 22, 2016")');
                expect(cell.value).toBe(22);
                expect(cellEle.textContent).toBe('22');
                helper.edit('F1', '=DAY("November 2020")');
                expect(cell.value).toBe(1);
                expect(cellEle.textContent).toBe('1');
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
        describe('EJ2-67308 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ 
                        rows: [
                            { cells: [{ value: 'q1' }, { formula: '=IF(1<2, "QqqQ")' }] },
                            { cells: [{ value: 'q2' }, { formula: '=IF(SUM(1,1)<3, "Trueq", "Falseq")' }] },
                            { cells: [{ value: 'q1' }, { formula: '=IF(SUM(SUM(2,2),1)<3, "(Trueq)", "(Falseq)")' }] },
                            { cells: [{ value: 'q2' }, { formula: '=COUNTIF(A1:A4,"q1")' }] }
                        ]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Parsing error occurs when the custom function argument contains "q" alphabet', (done: Function) => {
                (window as any).CustomFuntion = (str: string) => {
                    return str;
                };
                helper.invoke('addCustomFunction', ["CustomFuntion", "myfunq"]);
                let formula: string = '=myfunq("SUCCESSq")';
                helper.edit('C1', '=IF(1<2, "QqqQ")');
                helper.edit('C2', '=IF(SUM(1,1)<3, "Trueq", "Falseq")');
                helper.edit('C3', '=IF(SUM(SUM(2,2),1)<3, "(Trueq)", "(Falseq)")');
                helper.edit('C4', '=COUNTIF(A1:A4,"q1")');
                helper.edit('C5', formula);
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('QqqQ');
                expect(helper.invoke('getCell', [0, 1]).innerText).toBe('QqqQ');
                expect(helper.invoke('getCell', [0, 2]).textContent).toBe('QqqQ');
                expect(helper.invoke('getCell', [0, 2]).innerText).toBe('QqqQ');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('Trueq');
                expect(helper.invoke('getCell', [1, 1]).innerText).toBe('Trueq');
                expect(helper.invoke('getCell', [1, 2]).textContent).toBe('Trueq');
                expect(helper.invoke('getCell', [1, 2]).innerText).toBe('Trueq');
                expect(helper.invoke('getCell', [2, 1]).textContent).toBe('(Falseq)');
                expect(helper.invoke('getCell', [2, 1]).innerText).toBe('(Falseq)');
                expect(helper.invoke('getCell', [2, 2]).textContent).toBe('(Falseq)');
                expect(helper.invoke('getCell', [2, 2]).innerText).toBe('(Falseq)');
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('2');
                expect(helper.invoke('getCell', [3, 1]).innerText).toBe('2');
                expect(helper.invoke('getCell', [3, 2]).textContent).toBe('2');
                expect(helper.invoke('getCell', [3, 2]).innerText).toBe('2');
                expect(helper.invoke('getCell', [4, 2]).textContent).toBe('"SUCCESSq"');
                expect(helper.invoke('getCell', [4, 2]).innerText).toBe('"SUCCESSq"');
                done();
            });
        });
        describe('EJ2-68534 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ formula: '=SUM(1,1)' }] }] }, { rows: [{ cells: [{ formula: '=SUM(2,2)' }] }] }, { rows: [{ cells: [{ formula: '=SUM(3,3)' }] }] }], allowEditing: false }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('When the "allowEditing" property is set to false then formula cells are rendered with a blank value', (done: Function) => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('2');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].formula).toBe('=SUM(1,1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe(2);
                helper.getInstance().activeSheetIndex = 1;
                helper.getInstance().dataBind();
                setTimeout(function () {
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('4');
                    expect(helper.getInstance().sheets[1].rows[0].cells[0].formula).toBe('=SUM(2,2)');
                    expect(helper.getInstance().sheets[1].rows[0].cells[0].value).toBe(4);
                    helper.getInstance().activeSheetIndex = 2;
                    helper.getInstance().dataBind();
                    setTimeout(function () {
                        expect(helper.getInstance().activeSheetIndex).toBe(2);
                        expect(helper.invoke('getCell', [0, 0]).textContent).toBe('6');
                        expect(helper.getInstance().sheets[2].rows[0].cells[0].formula).toBe('=SUM(3,3)');
                        expect(helper.getInstance().sheets[2].rows[0].cells[0].value).toBe(6);
                        done();
                    });
                });
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
    describe('EJ2-64655, EJ2-66218 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ id: 200, rows: [{ cells: [{ value: '179.75' }] }, { cells: [{ value: '179.725' }] }, { cells: [{ value: '179.7235' }] }, { cells: [{ value: '179.22345' }] }, { cells: [{ value: '179.323455' }] }, { cells: [{ value: '179.8234505' }] }, { cells: [{ value: '-179.725' }] }] }, {}] }, done);
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
        it('Cell delete on UNIQUE formula which has spill error', (done: Function) => {
            helper.invoke('updateCell', [{ formula: '=UNIQUE(B1:B7)' }, 'D1']);
            const sheet: SheetModel = helper.getInstance().sheets[0];
            expect(sheet.rows[0].cells[3].value).toBe('179.8');
            expect(helper.invoke('getCell', [0, 3]).textContent).toBe('179.8');
            expect(sheet.rows[1].cells[3].value).toBe('179.73');
            expect(helper.invoke('getCell', [1, 3]).textContent).toBe('179.73');
            expect(sheet.rows[5].cells[3].value).toBe('179.823451');
            expect(helper.invoke('getCell', [5, 3]).textContent).toBe('179.823451');
            helper.edit('D3', 'Changed');
            expect(sheet.rows[0].cells[3].value).toBe('#SPILL!');
            expect(helper.invoke('getCell', [0, 3]).textContent).toBe('#SPILL!');
            expect(sheet.rows[2].cells[3].value).toBe('Changed');
            expect(helper.invoke('getCell', [2, 3]).textContent).toBe('Changed');
            expect(sheet.rows[5].cells[3].value).toBe('');
            expect(helper.invoke('getCell', [5, 3]).textContent).toBe('');
            helper.invoke('selectRange', ['D1']);
            helper.triggerKeyNativeEvent(46);
            expect(sheet.rows[0].cells[3].value).toBe('');
            expect(helper.invoke('getCell', [0, 3]).textContent).toBe('');
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
            helper.getInstance().addDefinedName({ name: 'defName', refersTo: '=Sheet1!A4:A5' });
            helper.edit('A6', '=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(5);
            helper.edit('A6', '=COUNT(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(5);
            helper.edit('A6', '=COUNT($1$A:$A$5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNT($A$1:$A$5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(5);
            helper.edit('A6', '=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=COUNTIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFs(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=COUNTIFS(A1:A5,"=1",1B:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFS(A1:A5,"=1",B1:B5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=COUNTIFS($A$1:$A$5,"=1",$1$B:$B$5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=COUNTIFS($A$1:$A$5,"=1",$B$1:$B$5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUM($A$1:$A$5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM($A$1:$A$5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUMIF(A1:5A,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIF(A1:A5,"=1")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=SUMIFS(A1:A5,B1:5B,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('3');
            helper.edit('A6', '=AVERAGE(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGE(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('3');
            helper.edit('A6', '=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(NaN);
            helper.edit('A6', '=AVERAGEIF(A1:5A,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIF(A1:A5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(NaN);
            helper.edit('A6', '=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#DIV/0!');
            helper.edit('A6', '=AVERAGEIFS(A1:5A,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=AVERAGEIFS(A1:A5,B1:B5,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('#DIV/0!');
            helper.edit('A6', '=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('5');
            helper.edit('A6', '=MAX(1A:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MAX(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('5');
            helper.edit('A6', '=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('1');
            helper.edit('A6', '=MIN(A1:5A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=MIN(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('1');
            helper.edit('A6', '=SUM(1A:A3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM(1A,A2,3A,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1,A2,A3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM($A$1:$A$3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM($A$1:$A$3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM($1$A:$3$A,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM($A$1:$A$3,defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUMIFS($4$B:$B$5,defName,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS($B$4:$B$5,defName,"=0")');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=IF(1A=1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=IF(A1=1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('TRUE');
            helper.edit('A6', '=IF(1A>1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=IF(A1>1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('FALSE');
            helper.edit('A6', '=A1+2A');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=A1+A2');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('3');
            helper.edit('A6', '=(1A*A2)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=(A1*A2)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('2');
            helper.edit('A6', '=(A1>2A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=(A1>A2)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('FALSE');
            helper.edit('A6', '=(A1>=2A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=(A1>=A2)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('FALSE');
            helper.edit('A6', '=TIME(A1,2A,A3)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=TIME(A1,A2,A3)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('0.043090277777777776');
            helper.edit('A6', '=DATE(1A,A2,3A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=DATE(A1,A2,A3)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('400');
            helper.edit('A6', '=UNIQUE()');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=UNIQUE()');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('wrong number of arguments');
            helper.edit('A6', '=SUM()');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM()');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual('invalid arguments');
            helper.edit('A6', '=SUM(1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUM(1,2,3)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(1,2,3)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(6);
            helper.edit('A6', '=SUM(A1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUM(1A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(1);
            helper.edit('A6', '=SUM(A1,A2,A3,A4)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1,A2,A3,A4)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(10);
            helper.edit('A6', '=SUM(1A,A2,3A,A4)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1,A2,A3,A4)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(10);
            helper.edit('A6', '=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM(1A:5A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
            helper.edit('A6', '=SUM(A1:A5,B1:B5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5,B1:B5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(19);
            helper.edit('A6', '=SUM(1A:A5,B1:5B)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5,B1:B5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(19);
            helper.edit('A6', '=SUM(defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(defName)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(9);
            helper.edit('A6', '=SUM(1A,A2:3A,defName,B1,3B:B5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1,A2:A3,defName,B1,B3:B5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(19);
            helper.edit('A6', '=SUMIFS(A1:A2,A3:A4,">"&1B)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A2,A3:A4,">"&B1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(3);
            helper.edit('A6', '=SUMIFS(A1:A2,A3:A4,"<"&1B)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A2,A3:A4,"<"&B1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=SUMIFS(A1:A2,A3:A4,">="&1B)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A2,A3:A4,">="&B1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(3);
            helper.edit('A6', '=SUMIFS(A1:A2,A3:A4,"<="&1B)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUMIFS(A1:A2,A3:A4,"<="&B1)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(0);
            helper.edit('A6', '=SUM(1A: 5A)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].formula).toEqual('=SUM(A1:A5)');
            expect(helper.getInstance().sheets[0].rows[5].cells[0].value).toEqual(15);
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
    describe('EJ2-66087,EJ2-66341,EJ2-66984 -> ', () => {
        beforeEach((done: Function) => {
            const addSum = (sourceValue: any, destinationValue: any) => {
                let data = sourceValue + destinationValue;
                return data;
            };
            const cusFunc = (sourceValue: any, destinationValue: any) => {
                let data = sourceValue + destinationValue;
                return data;
            };
            helper.initializeSpreadsheet({
                sheets: [
                    {
                        name: 'Monthly Budget',
                        rows: [{ cells: [{ value: '1' }, { value: '2' }, { value: '', formula: '=ADDSUM(A1,B1)' }, { value: '', formula: '=CUSFUNC(B1,A1)' }] },
                        { cells: [{ value: '2' }, { value: '3' }, { value: '', formula: '=ADDSUM(A2,B2)' }, { value: '', formula: '=CUSFUNC(B2,A2)' }] },
                        { cells: [{ value: '4' }, { value: '5' }, { value: '', formula: '=ADDSUM(A3,B3)' }, { value: '', formula: '=CUSFUNC(B3,A3)' }] },
                        { cells: [{ value: '5' }, { value: '5' }, { value: '', formula: '=ADDSUM(A4,B4)' }, { value: '', formula: '=CUSFUNC(B4,A4)' }] },
                        { cells: [{ value: '5' }, { value: '6' }, { value: '', formula: '=ADDSUM(A5,B5)' }, { value: '', formula: '=CUSFUNC(B5,A5)' }] }
                        ],
                        columns: [
                            { width: 110 }, { width: 115 }, { width: 110 }, { width: 100 }
                        ]
                    }
                ],
                beforeDataBound: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.addCustomFunction(addSum, 'ADDSUM');
                    spreadsheet.addCustomFunction(cusFunc, 'CUSFUNC');
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
        it('Nested IF formula which contains Index formula returns wrong value', (done: Function) => {
            helper.edit('A1', 'test');
            helper.edit('B1', '=IF(INDEX(A1:A2,1,1)="TEST",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[0].cells[1].formula).toEqual('=IF(INDEX(A1:A2,1,1)="TEST",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[0].cells[1].value).toEqual("TRUE");
            helper.edit('B1', '=IF(IF(A1="TEST","TEST","SET")=A1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[0].cells[1].formula).toEqual('=IF(IF(A1="TEST","TEST","SET")=A1,TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[0].cells[1].value).toEqual("TRUE");
            helper.edit('A2', '2');
            helper.edit('B2', '=IF(INDEX(A1:A2,2,1)=2,1,2)');
            expect(helper.getInstance().sheets[0].rows[1].cells[1].formula).toEqual('=IF(INDEX(A1:A2,2,1)=2,1,2)');
            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toEqual("1");
            helper.edit('B2', '=IF(INDEX(A1:A2,2,1)=A2,1,2)');
            expect(helper.getInstance().sheets[0].rows[1].cells[1].formula).toEqual('=IF(INDEX(A1:A2,2,1)=A2,1,2)');
            expect(helper.getInstance().sheets[0].rows[1].cells[1].value).toEqual("1");
            helper.edit('A3', '5');
            helper.edit('B3', '=IF(IF(A3=5,"test","set")="test",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[2].cells[1].formula).toEqual('=IF(IF(A3=5,"test","set")="test",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[2].cells[1].value).toEqual("TRUE");
            helper.edit('A4', 'tests');
            helper.edit('B4', '=IF(IF(A4="test","test","set")="test",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[3].cells[1].formula).toEqual('=IF(IF(A4="test","test","set")="test",TRUE,FALSE)');
            expect(helper.getInstance().sheets[0].rows[3].cells[1].value).toEqual("FALSE");
            done();
        });
        it('Calling refresh() removes custom functions reference from spreadsheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.refresh();
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[2].formula).toEqual('=ADDSUM(A1,B1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[2].value).toEqual("12");
                expect(helper.getInstance().sheets[0].rows[0].cells[3].formula).toEqual('=CUSFUNC(B1,A1)');
                expect(helper.getInstance().sheets[0].rows[0].cells[3].value).toEqual("21");
                expect(helper.getInstance().sheets[0].rows[1].cells[2].formula).toEqual('=ADDSUM(A2,B2)');
                expect(helper.getInstance().sheets[0].rows[1].cells[2].value).toEqual("23");
                expect(helper.getInstance().sheets[0].rows[1].cells[3].formula).toEqual('=CUSFUNC(B2,A2)');
                expect(helper.getInstance().sheets[0].rows[1].cells[3].value).toEqual("32");
                expect(helper.getInstance().sheets[0].rows[2].cells[2].formula).toEqual('=ADDSUM(A3,B3)');
                expect(helper.getInstance().sheets[0].rows[2].cells[2].value).toEqual("45");
                expect(helper.getInstance().sheets[0].rows[2].cells[3].formula).toEqual('=CUSFUNC(B3,A3)');
                expect(helper.getInstance().sheets[0].rows[2].cells[3].value).toEqual("54");
                expect(helper.getInstance().sheets[0].rows[3].cells[2].formula).toEqual('=ADDSUM(A4,B4)');
                expect(helper.getInstance().sheets[0].rows[3].cells[2].value).toEqual("55");
                expect(helper.getInstance().sheets[0].rows[3].cells[3].formula).toEqual('=CUSFUNC(B4,A4)');
                expect(helper.getInstance().sheets[0].rows[3].cells[3].value).toEqual("55");
                expect(helper.getInstance().sheets[0].rows[4].cells[2].formula).toEqual('=ADDSUM(A5,B5)');
                expect(helper.getInstance().sheets[0].rows[4].cells[2].value).toEqual("56");
                expect(helper.getInstance().sheets[0].rows[4].cells[3].formula).toEqual('=CUSFUNC(B5,A5)');
                expect(helper.getInstance().sheets[0].rows[4].cells[3].value).toEqual("65");
                done();
            });
        });
    });
});