import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { SpreadsheetModel, SheetModel, getCell, CellModel, showAggregate, Spreadsheet, setCell, ICellRenderer } from '../../../src/index';
import { InventoryList, defaultData } from '../util/datasource.spec';
import { L10n, setCurrencyCode } from '@syncfusion/ej2-base';

/**
 *  Spreadsheet Number Format spec
 */
describe('Spreadsheet Number Format Module ->', (): void => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('Custom number format ->', (): void => {
        let sheet: any; let cell: any; let cellEle: HTMLElement;
        beforeAll((done: Function) => {
            model = {
                sheets: [{ rows: [{ cells: [{ value: 'Mar-2020' }, { value: 'Apr-10' }, { value: '2020-May' }, { value: '22-jun' },
                { value: '13-Jul-2020' }, { value: '11:34:32 AM' }, { value: '11:34:32' }, { value: '11:34' }, { value: '11:34 AM' },
                { value: '11 AM' }] }] }]
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Automatic custom date format deduction based on cell value checking', (done: Function) => {
            sheet = helper.invoke('getActiveSheet');
            const cells: CellModel[] = sheet.rows[0].cells;
            const cellEle: Element[] = helper.invoke('getRow', [0]).cells;
            expect(cells[0].value).toBe('43891');
            expect(cells[0].format).toBe('MMM-yy');
            expect(cellEle[0].textContent).toBe('Mar-20');
            expect(cells[1].value).toBe('45392');
            expect(cells[1].format).toBe('dd-MMM');
            expect(cellEle[1].textContent).toBe('10-Apr');
            expect(cells[2].value).toBe('43952');
            expect(cells[2].format).toBe('MMM-yy');
            expect(cellEle[2].textContent).toBe('May-20');
            expect(cells[3].value).toBe('45465');
            expect(cells[3].format).toBe('dd-MMM');
            expect(cellEle[3].textContent).toBe('22-Jun');
            expect(cells[4].value).toBe('44025');
            expect(cells[4].format).toBe('d-MMM-yy');
            expect(cellEle[4].textContent).toBe('13-Jul-20');
            done();
        });
        it('Automatic custom time format deduction based on cell value checking', (done: Function) => {
            const cells: CellModel[] = sheet.rows[0].cells;
            const cellEle: Element[] = helper.invoke('getRow', [0]).cells;
            expect(cells[5].value).toBe('0.4823148148148148');
            expect(cells[5].format).toBe('h:mm:ss AM/PM');
            expect(cellEle[5].textContent).toBe('11:34:32 AM');
            expect(cells[6].value).toBe('0.4823148148148148');
            expect(cells[6].format).toBe('h:mm:ss');
            expect(cellEle[6].textContent).toBe('11:34:32');
            expect(cells[7].value).toBe('0.48194444444444445');
            expect(cells[7].format).toBe('h:mm');
            expect(cellEle[7].textContent).toBe('11:34');
            expect(cells[8].value).toBe('0.48194444444444445');
            expect(cells[8].format).toBe('h:mm AM/PM');
            expect(cellEle[8].textContent).toBe('11:34 AM');
            expect(cells[9].value).toBe('0.4583333333333333');
            expect(cells[9].format).toBe('h AM/PM');
            expect(cellEle[9].textContent).toBe('11 AM');
            done();
        });
        it('Custom short date format checking', (done: Function) => {
            helper.invoke('updateCell', [{ value: '43891' }, 'B2']);
            let cells: any[] = sheet.rows[1].cells;
            expect(cells[1].value).toBe(43891);
            helper.invoke('numberFormat', ['mmm-yy', 'B2']);
            let cellElems: Element[] = helper.invoke('getRow', [1]).cells;
            expect(cellElems[1].textContent).toBe('Mar-20');
            helper.invoke('updateCell', [{ value: '43952' }, 'B2']);
            expect(cellElems[1].textContent).toBe('May-20');
            helper.invoke('updateCell', [{ value: '44661' }, 'C2']);
            expect(cells[2].value).toBe(44661);
            helper.invoke('numberFormat', ['dd-mmm', 'C2']);
            expect(cellElems[2].textContent).toBe('10-Apr');
            helper.invoke('updateCell', [{ value: '44734' }, 'C2']);
            expect(cellElems[2].textContent).toBe('22-Jun');
            helper.invoke('updateCell', [{ value: '44025' }, 'D2']);
            expect(cells[3].value).toBe(44025);
            helper.invoke('numberFormat', ['d-mmm-yy', 'D2']);
            expect(cellElems[3].textContent).toBe('13-Jul-20');
            helper.invoke('updateCell', [{ value: 'Mar-2020', format: 'mmm-yy' }, 'B3']);
            cells = sheet.rows[2].cells;
            expect(cells[1].value).toBe('43891');
            cellElems = helper.invoke('getRow', [2]).cells;
            expect(cellElems[1].textContent).toBe('Mar-20');
            helper.invoke('updateCell', [{ value: '10-Apr', format: 'dd-mmm' }, 'C3']);
            expect(cells[2].value).toBe('45392');
            expect(cellElems[2].textContent).toBe('10-Apr');
            helper.invoke('updateCell', [{ value: '13-Jul-2020', format: 'd-mmm-yy' }, 'D3']);
            expect(cells[3].value).toBe('44025');
            expect(cellElems[3].textContent).toBe('13-Jul-20');
            done();
        });
            
        it('EJ2-63249 -> $#,##0_);[Red]($#,##0) number format', (done: Function) => {
            helper.invoke('numberFormat', ['$#,##0_);[Red]($#,##0)', 'H1']);
            helper.invoke('updateCell', [{ value: '8529.22' }, 'H1']);
            const cell: any = helper.getInstance().sheets[0].rows[0].cells[7];
            expect(cell.value).toBe(8529.22);
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 7]);
            expect(cellEle.textContent).toBe('$8,529 ');
            helper.edit('H1', '-8529.22');
            expect(cell.value).toBe(-8529.22);
            expect(cellEle.textContent).toBe('($8,529)');
            expect(cellEle.style.color).toBe('red');
            done();
        });
        it('Custom conditions format checking', (done: Function) => {
            helper.invoke('numberFormat', ['[Red][<=100];[Blue][>101]', 'A2']);
            const cell: CellModel = sheet.rows[1].cells[0];
            const cellEle: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(cell.format).toBe('[Red][<=100];[Blue][>101]');
            expect(cellEle.textContent).toBe('');
            expect(cellEle.style.color).toBe('');
            helper.edit('A2', '20');
            expect(cellEle.textContent).toBe('20');
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '101' }, 'A2']);
            expect(cellEle.textContent).toBe('########');
            expect(cellEle.style.color).toBe('');
            helper.invoke('updateCell', [{ value: '120' }, 'A2']);
            expect(cellEle.textContent).toBe('120');
            expect(cellEle.style.color).toBe('blue');
            helper.invoke('updateCell', [{ value: '111111111111111111111' }, 'A4']);
            expect(sheet.rows[3].cells[0].value).toBe(111111111111111110000);
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('1.11111E+20');
            done();
        });
        it('Custom number format on different number representation checking', (done: Function) => {
            helper.invoke('updateCell', [{ value: '12.68' }, 'A2']);
            cell = getCell(1, 0, helper.invoke('getActiveSheet'));
            expect(cell.value).toBe(12.68);
            helper.invoke('numberFormat', ['0', 'A2']);
            cellEle = helper.invoke('getCell', [1, 0]);
            expect(cellEle.textContent).toBe('13');
            helper.invoke('numberFormat', ['0.0', 'A2']);
            expect(cell.value).toBe(12.68);
            expect(cellEle.textContent).toBe('12.7');
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            helper.invoke('numberFormat', ['#,##0', 'A2']);
            expect(cell.value).toBe(4234);
            cellEle = helper.invoke('getCell', [1, 0]);
            expect(cellEle.textContent).toBe('4,234');
            helper.invoke('numberFormat', ['#,##0.00', 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('4,234.00');
            helper.invoke('numberFormat', ['#,##0_);(#,##0)', 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('4,234 ');
            helper.invoke('updateCell', [{ value: '-4234' }, 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('(4,234)');
            helper.invoke('numberFormat', ['#,##0_);[Red](#,##0)', 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('(4,234)');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('4,234 ');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('');
            helper.invoke('numberFormat', ['#,##0.00_);(#,##0.00)', 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('4,234.00 ');
            helper.invoke('updateCell', [{ value: '-4234' }, 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('(4,234.00)');
            helper.invoke('numberFormat', ['#,##0.00_);[Red](#,##0.00)', 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('(4,234.00)');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('4,234.00 ');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('');
            helper.invoke('updateCell', [{ value: '4234.123' }, 'A3']);
            done();
        });
        it('Custom currency number format checking', (done: Function) => {
            helper.invoke('numberFormat', ['$#,##0_);($#,##0)', 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('$4,234 ');
            helper.invoke('updateCell', [{ value: '-4234' }, 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('($4,234)');
            helper.invoke('numberFormat', ['$#,##0_);[Red]($#,##0)', 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('($4,234)');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('$4,234 ');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('');
            helper.invoke('numberFormat', ['$#,##0.00_);($#,##0.00)', 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('$4,234.00 ');
            helper.invoke('updateCell', [{ value: '-4234' }, 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('($4,234.00)');
            helper.invoke('numberFormat', ['$#,##0.00_);[Red]($#,##0.00)', 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe('($4,234.00)');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            expect(cell.value).toBe(4234);
            expect(cellEle.textContent).toBe('$4,234.00 ');
            expect(cell.style).toBeUndefined();
            expect(cellEle.style.color).toBe('');
            done();
        });
        it('Custom percentage number format checking', (done: Function) => {
            helper.invoke('updateCell', [{ value: '4234.57' }, 'A2']);
            expect(cell.value).toBe(4234.57);
            helper.invoke('numberFormat', ['0%', 'A2']);
            expect(cellEle.textContent).toBe('423457%');
            helper.invoke('numberFormat', ['0.00%', 'A2']);
            expect(cell.value).toBe(4234.57);
            expect(cellEle.textContent).toBe('423457.00%');
            helper.invoke('updateCell', [{ value: '4234.5768' }, 'A2']);
            expect(cell.value).toBe(4234.5768);
            expect(cellEle.textContent).toBe('423457.68%');
            helper.invoke('numberFormat', ['0.0%', 'A2']);
            expect(cell.value).toBe(4234.5768);
            expect(cellEle.textContent).toBe('423457.7%');
            helper.invoke('numberFormat', ['0%', 'A2']);
            expect(cell.value).toBe(4234.5768);
            expect(cellEle.textContent).toBe('423458%');
            const formulaBar: HTMLInputElement = helper.getElement('#' + helper.id + '_formula_input');
            helper.invoke('selectRange', ['A2']);
            setTimeout((): void => {
                expect(formulaBar.value).toBe('423458%');
                const spreadsheet: any = helper.getInstance();
                spreadsheet.startEdit();
                setTimeout((): void => {
                    expect(spreadsheet.editModule.editCellData.value).toBe('423458%');
                    spreadsheet.editModule.editCellData.value = '423.45%';
                    spreadsheet.endEdit();
                    expect(cell.value).toBe('4.2345');
                    expect(cellEle.textContent).toBe('423%');
                    done();
                }, 10);
            });
        });
        it('Custom accounting number format checking', (done: Function) => {
            helper.invoke('updateCell', [{ value: '4234' }, 'A2']);
            expect(cell.value).toBe(4234);
            helper.invoke('numberFormat', ['_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)', 'A2']);
            expect(cellEle.textContent).toBe(' $4,234 ');
            helper.invoke('updateCell', [{ value: '-4234' }, 'A2']);
            expect(cell.value).toBe(-4234);
            expect(cellEle.textContent).toBe(' $  (4,234)');
            helper.invoke('updateCell', [{ value: 'Test' }, 'A2']);
            expect(cell.value).toBe('Test');
            expect(cellEle.textContent).toBe(' Test ');
            helper.invoke('updateCell', [{ value: '0' }, 'A2']);
            expect(cell.value).toBe(0);
            expect(cellEle.innerHTML).toBe('<span id="spreadsheet_currency" style="float: left"> $</span>  - ');
            helper.invoke('updateCell', [{ value: '4234.567' }, 'A2']);
            expect(cell.value).toBe(4234.567);
            expect(cellEle.textContent).toBe(' $4,235 ');
            helper.invoke('numberFormat', ['_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)', 'A2']);
            expect(cell.value).toBe(4234.567);
            expect(cellEle.textContent).toBe(' $4,234.57 ');
            helper.invoke('updateCell', [{ value: '-4234.567' }, 'A2']);
            expect(cell.value).toBe(-4234.567);
            expect(cellEle.textContent).toBe(' $  (4,234.57)');
            helper.invoke('numberFormat', ['_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)', 'A2']);
            expect(cell.value).toBe(-4234.567);
            expect(cellEle.textContent).toBe('   (4,234.57)');
            helper.invoke('numberFormat', ['_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)', 'A2']);
            expect(cell.value).toBe(-4234.567);
            expect(cellEle.textContent).toBe('   (4,235)');
            helper.invoke('updateCell', [{ value: '4234.567' }, 'A2']);
            expect(cell.value).toBe(4234.567);
            expect(cellEle.textContent).toBe(' 4,235 ');
            helper.invoke('numberFormat', ['_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)', 'A2']);
            expect(cell.value).toBe(4234.567);
            expect(cellEle.textContent).toBe(' 4,234.57 ');
            done();
        });
        it('EJ2-63249 -> Fraction custom number format', (done: Function) => {
            helper.invoke('numberFormat', ['# ?/?', 'G1']);
            helper.invoke('updateCell', [{ value: '18488.80' }, 'G1']);
            const cell: any = helper.getInstance().sheets[0].rows[0].cells[6];
            expect(cell.value).toBe(18488.80);
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 6]);
            //expect(cellEle.textContent).toBe('18488 4/5');
            helper.invoke('updateCell', [{ value: '8529.22' }, 'G1']);
            expect(cell.value).toBe(8529.22);
            //expect(cellEle.textContent).toBe('8529 2/9');
            helper.invoke('numberFormat', ['# ??/??', 'G1']);
            //expect(cellEle.textContent).toBe('8529 11/50');
            helper.invoke('numberFormat', ['# ???/???', 'G1']);
            helper.invoke('updateCell', [{ value: '9709.49' }, 'G1']);
            expect(cell.value).toBe(9709.49);
            expect(cellEle.textContent).toBe('9709 49/100');
            done();
        });
        it('Other custom number formats', (done: Function) => {
            helper.invoke('numberFormat', ['#, K', 'H1']);
            helper.invoke('updateCell', [{ value: '10' }, 'H1']);
            const cell: any = helper.getInstance().sheets[0].rows[0].cells[7];
            expect(cell.value).toBe(10);
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 7]);
            expect(cellEle.textContent).toBe(' K');
            helper.invoke('updateCell', [{ value: '2022' }, 'H1']);
            expect(cell.value).toBe(2022);
            expect(cellEle.textContent).toBe('2 K');
            helper.invoke('updateCell', [{ value: '202245' }, 'H1']);
            expect(cell.value).toBe(202245);
            expect(cellEle.textContent).toBe('202 K');
            helper.invoke('numberFormat', ['#.???', 'H1']);
            helper.invoke('updateCell', [{ value: '20' }, 'H1']);
            expect(cell.value).toBe(20);
            expect(cellEle.textContent).toBe('20.      ');
            helper.invoke('updateCell', [{ value: '20.2' }, 'H1']);
            expect(cell.value).toBe(20.2);
            expect(cellEle.textContent).toBe('20.2    ');
            helper.invoke('updateCell', [{ value: '20.25' }, 'H1']);
            expect(cell.value).toBe(20.25);
            expect(cellEle.textContent).toBe('20.25  ');
            helper.invoke('updateCell', [{ value: '20.256' }, 'H1']);
            expect(cell.value).toBe(20.256);
            expect(cellEle.textContent).toBe('20.256');
            helper.invoke('numberFormat', ['# kgs', 'H1']);
            expect(cell.value).toBe(20.256);
            expect(cellEle.textContent).toBe('20 kgs');
            helper.invoke('numberFormat', ['#.## kgs', 'H1']);
            expect(cell.value).toBe(20.256);
            expect(cellEle.textContent).toBe('20.26 kgs');
            helper.invoke('numberFormat', ["#.# 'kgs'", 'H1']);
            expect(cell.value).toBe(20.256);
            expect(cellEle.textContent).toBe('20.3 kgs');
            done();
        });
        it('Preventing incorrect date and time value from auto deduct', (done: Function) => {
            helper.invoke('updateCell', [{ value: '1:1' }, 'E2']);
            const row: any = helper.getInstance().sheets[0].rows[1];
            expect(row.cells[4].value).toBe('0.04236111111111111');
            expect(row.cells[4].format).toBe('h:mm');
            expect(helper.invoke('getCell', [1, 4]).textContent).toBe('1:01');
            helper.invoke('updateCell', [{ value: '99:99' }, 'F2']);
            expect(row.cells[5].value).toBe('99:99');
            expect(row.cells[5].format).toBeUndefined();
            let cellEle: HTMLElement = helper.invoke('getCell', [1, 5]);
            expect(cellEle.textContent).toBe('99:99');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: '0-1' }, 'F2']);
            expect(row.cells[5].value).toBe('0-1');
            expect(row.cells[5].format).toBeUndefined();
            expect(cellEle.textContent).toBe('0-1');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: '0-31' }, 'F2']);
            expect(row.cells[5].value).toBe('0-31');
            expect(row.cells[5].format).toBeUndefined();
            expect(cellEle.textContent).toBe('0-31');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: '34:c' }, 'F2']);
            expect(row.cells[5].value).toBe('34:c');
            expect(row.cells[5].format).toBeUndefined();
            expect(cellEle.textContent).toBe('34:c');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: 'c:34' }, 'F2']);
            expect(row.cells[5].value).toBe('c:34');
            expect(row.cells[5].format).toBeUndefined();
            expect(cellEle.textContent).toBe('c:34');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: '22:45:c' }, 'F2']);
            expect(row.cells[5].value).toBe('22:45:c');
            expect(row.cells[5].format).toBeUndefined();
            expect(cellEle.textContent).toBe('22:45:c');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            helper.invoke('updateCell', [{ value: '1/31' }, 'F2']);
            expect(row.cells[5].value).toBe('45322');
            expect(row.cells[5].format).toBe('dd/MMM');
            expect(cellEle.textContent).toBe('31/Jan');
            helper.invoke('updateCell', [{ value: '12/31' }, 'G2']);
            expect(row.cells[6].value).toBe('45657');
            expect(row.cells[6].format).toBe('dd/MMM');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('31/Dec');
            helper.invoke('updateCell', [{ value: '1:2 PM' }, 'H2']);
            expect(row.cells[7].value).toBe('0.5430555555555555');
            expect(row.cells[7].format).toBe('h:mm AM/PM');
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('1:02 PM');
            helper.invoke('updateCell', [{ value: '3:22:3 AM' }, 'I2']);
            expect(row.cells[8].value).toBe('0.1403125');
            expect(row.cells[8].format).toBe('h:mm:ss AM/PM');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('3:22:03 AM');
            helper.invoke('updateCell', [{ value: '2:4:5 PM' }, 'J2']);
            expect(row.cells[9].value).toBe('0.5861689814814814');
            expect(row.cells[9].format).toBe('h:mm:ss AM/PM');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('2:04:05 PM');
            done();
        });
        it ('Auto deduct general number format', (done: Function) => {
            helper.invoke('updateCell', [{ value: '6.8999999999999995' }, 'E3']);
            const row: any = helper.getInstance().sheets[0].rows[2];
            expect(row.cells[4].value).toBe(6.8999999999999995);
            expect(row.cells[4].format).toBeUndefined();
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 4]);
            expect(cellEle.textContent).toBe('6.9');
            helper.invoke('updateCell', [{ value: '17866.19' }, 'A3']);
            helper.edit('E3', '=MOD(-A3,-2)');
            expect(row.cells[4].value).toBe(-0.18999999999869033);
            expect(row.cells[4].format).toBeUndefined();
            expect(cellEle.textContent).toBe('-0.19');
            helper.edit('A2', '=E3');
            expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('-0.18999999999869033');
            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('   (0.19)');
            done();
        });
        it ('Auto deduct on general number format applied cells', (done: Function) => {
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            helper.invoke('selectRange', ['F3']);
            const numFormatSelection: HTMLElement = helper.getElement(`#${helper.id}_number_format .e-tbar-btn-text`);
            expect(numFormatSelection.textContent).toBe('General');
            helper.invoke('updateCell', [{ value: '2/10/2020' }, 'F3']);
            const row: any = helper.getInstance().sheets[0].rows[2];
            expect(row.cells[5].value).toBe('43871');
            expect(row.cells[5].format).toBe('mm-dd-yyyy');
            expect(numFormatSelection.textContent).toBe('Short Date');
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 5]);
            expect(cellEle.textContent).toBe('2/10/2020');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('43871');
            expect(cellEle.textContent).toBe('43871');
            helper.invoke('updateCell', [{ value: '13:22:22' }, 'F3']);
            expect(row.cells[5].value).toBe('0.5571990740740741');
            expect(row.cells[5].format).toBe('h:mm:ss');
            expect(cellEle.textContent).toBe('13:22:22');
            expect(numFormatSelection.textContent).toBe('Custom');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('0.5571990740740741');
            expect(cellEle.textContent).toBe('0.557199074');
            helper.invoke('updateCell', [{ value: '10/2/2020 4:32:45' }, 'F3']);
            expect(row.cells[5].value).toBe('44106.189409722225');
            expect(row.cells[5].format).toBe('mm-dd-yyyy h:mm:ss');
            expect(cellEle.textContent).toBe('10/2/2020 4:32:45');
            expect(numFormatSelection.textContent).toBe('Custom');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('44106.189409722225');
            expect(cellEle.textContent).toBe('44106.18941');
            expect(numFormatSelection.textContent).toBe('General');
            helper.invoke('updateCell', [{ value: '09-02-23' }, 'F3']);
            expect(row.cells[5].value).toBe('45171');
            expect(row.cells[5].format).toBe('mm-dd-yyyy');
            expect(cellEle.textContent).toBe('9/2/2023');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('45171');
            expect(cellEle.textContent).toBe('45171');
            helper.invoke('updateCell', [{ value: 'June-2022' }, 'F3']);
            expect(row.cells[5].value).toBe('44713');
            expect(row.cells[5].format).toBe('MMM-yy');
            expect(cellEle.textContent).toBe('Jun-22');
            expect(numFormatSelection.textContent).toBe('Custom');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('44713');
            expect(cellEle.textContent).toBe('44713');
            done();
        });
        it ('Apply date and time formats to cell which contain negative value', (done: Function) => {
            helper.invoke('updateCell', [{ value: '-10' }, 'F3']);
            const cell: any = helper.getInstance().sheets[0].rows[2].cells[5];
            expect(cell.value).toBe(-10);
            helper.invoke('numberFormat', ['mm-dd-yyyy', 'F3']);
            expect(cell.format).toBe('mm-dd-yyyy');
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 5]);
            expect(cellEle.textContent).toBe('########');
            helper.invoke('numberFormat', ['MMM-yy', 'F3']);
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('MMM-yy');
            expect(cellEle.textContent).toBe('########');
            helper.invoke('numberFormat', ['h:mm:ss AM/PM', 'F3']);
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('h:mm:ss AM/PM');
            expect(cellEle.textContent).toBe('########');
            helper.invoke('numberFormat', ['h:mm', 'F3']);
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('h:mm');
            expect(cellEle.textContent).toBe('########');
            helper.invoke('numberFormat', ['dd/MM/yyyy h:mm', 'F3']);
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('dd/MM/yyyy h:mm');
            expect(cellEle.textContent).toBe('########');
            done();
        });
    });
    describe('Number format and dependent support ->', (): void => {
        let sheet: any; let cell: any; let cellEle: HTMLElement;
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: InventoryList }], selectedRange: 'D1:D17' }] };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Apply customized number format through custom dialog', (done: Function) => {
            helper.invoke('numberFormat', ['#,##0.00', 'D1:D17']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('#' + helper.id + '_applyfilter');
            helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'D1:D17' }]);
            sheet = helper.getInstance().sheets[0];
            expect(sheet.rows[1].cells[3].value).toBe('169.5');
            cellEle = helper.invoke('getCell', [1, 3]);
            expect(cellEle.textContent).toBe('169.50');
            expect((cellEle.querySelectorAll('.e-databar')[1] as HTMLElement).style.width).toBe('85%');
            helper.invoke('sort', [{ sortDescriptors: { order: 'Descending' } }]).then((): void => {
                expect(sheet.rows[1].cells[3].value).toBe(201.25);
                expect(cellEle.textContent).toBe('201.25');
                expect((cellEle.querySelectorAll('.e-databar')[1] as HTMLElement).style.width).toBe('100%');
                done();
            });
        });
        it('Date format formula bar update', (done: Function) => {
            const formulaBar: HTMLInputElement = helper.getElement('#' + helper.id + '_formula_input');
            expect(formulaBar.value).toBe('Purchase Price');
            helper.invoke('selectRange', ['G2']);
            setTimeout((): void => {
                expect(formulaBar.value).toBe('5/25/2019');
                helper.invoke('updateCell', [{ value: '' }, 'G18']);
                helper.invoke('selectRange', ['G18']);
                setTimeout((): void => {
                    expect(formulaBar.value).toBe('');
                    done();
                });
            });
        });
        it('Time format formula bar update', (done: Function) => {
            helper.invoke('updateCell', [{ value: '11:32' }, 'I2']);
            const formulaBar: HTMLInputElement = helper.getElement('#' + helper.id + '_formula_input');
            helper.invoke('selectRange', ['I2']);
            setTimeout((): void => {
                expect(formulaBar.value).toBe('11:32:00 AM');
                helper.invoke('updateCell', [{ value: '10/20/2020 22:32:45' }, 'I3']);
                helper.invoke('selectRange', ['I3']);
                setTimeout((): void => {
                    expect(formulaBar.value).toBe('10/20/2020 10:32:45 PM');
                    done();
                });
            });
        });
        it('Apply repeat fill format with less column width', (done: Function) => {
            helper.invoke('updateCell', [{ value: '1' }, 'J1']);
            helper.invoke('numberFormat', ['_(* #,##0.00_);_(* (#,##0);_(* \"-\"??_);_(@_)', 'J1']);
            expect(sheet.rows[0].cells[9].value).toBe(1);
            cellEle = helper.invoke('getCell', [0, 9]);
            expect(cellEle.textContent).toBe('        1.00 ');
            helper.invoke('setColWidth', [20, 9]);
            helper.invoke('numberFormat', ['_(* #,##0.00_);_(* (#,##0);_(* \"-\"??_);_(@_)', 'J1']);
            expect(sheet.rows[0].cells[9].value).toBe(1);
            expect(cellEle.textContent).toBe(' 1.00 ');
            done();
        });
        it('CF Greater than and Less than checking with Date formatted cells', (done: Function) => {
            helper.invoke('updateCell', [{ value: '2/3/2020' }, 'K1']);
            helper.invoke('updateCell', [{ value: '10/2/2021' }, 'K2']);
            expect(sheet.rows[0].cells[10].value).toBe('43864');
            expect(sheet.rows[1].cells[10].value).toBe('44471');
            helper.invoke('conditionalFormat', [{ type: 'GreaterThan', range: 'K1:K2', cFColor: 'RedFT', value: '1/1/2021' }]);
            expect(sheet.conditionalFormats[1].value).toBe('44197');
            cellEle = helper.invoke('getCell', [0, 10]);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [1, 10]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            helper.invoke('clearConditionalFormat', ['K1:K2']);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            helper.invoke('conditionalFormat', [{ type: 'LessThan', range: 'K1:K2', cFColor: 'YellowFT', value: '1/1/2021' }]);
            expect(sheet.conditionalFormats[1].value).toBe('44197');
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [0, 10]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(cellEle.style.color).toBe('rgb(156, 101, 0)');
            done();
        });
        it('CF Between checking with custom number format', (done: Function) => {
            helper.invoke('updateCell', [{ value: '45.09' }, 'L1']);
            helper.invoke('updateCell', [{ value: '89300.01' }, 'L2']);
            helper.invoke('updateCell', [{ value: '-0.03' }, 'L3']);
            helper.invoke('updateCell', [{ value: '0.38' }, 'L4']);
            helper.invoke('updateCell', [{ value: '-1.46' }, 'L5']);
            helper.invoke('numberFormat', ['0.00', 'L1:L5']);
            helper.invoke('conditionalFormat', [{ type: 'Between', range: 'L1:L5', cFColor: 'GreenFT', value: '-0.01,-2' }]);
            cellEle = helper.invoke('getCell', [0, 11]);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [2, 11]);
            expect(cellEle.style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(cellEle.style.color).toBe('rgb(0, 97, 0)');
            cellEle = helper.invoke('getCell', [3, 11]);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [4, 11]);
            expect(cellEle.style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(cellEle.style.color).toBe('rgb(0, 97, 0)');
            done();
        });
        it('CF and autofill on custom number format applied cells', (done: Function) => {
            helper.invoke('updateCell', [{ value: '67.3' }, 'M1']); helper.invoke('updateCell', [{ value: '-90.46' }, 'M2']);
            helper.invoke('updateCell', [{ value: '-0.67' }, 'M3']); helper.invoke('updateCell', [{ value: '-0.12' }, 'M4']);
            helper.invoke('updateCell', [{ value: '0' }, 'M5']); helper.invoke('updateCell', [{ value: '1.5' }, 'M6']);
            helper.invoke('updateCell', [{ value: '2.4' }, 'M7']); helper.invoke('updateCell', [{ value: '4.78' }, 'M8']);
            helper.invoke('updateCell', [{ value: '7.06' }, 'M9']); helper.invoke('updateCell', [{ value: '9.99' }, 'M10']);
            helper.invoke('updateCell', [{ value: '12.89' }, 'M11']); helper.invoke('updateCell', [{ value: '23.01' }, 'M12']);
            helper.invoke('updateCell', [{ value: '78.46' }, 'M13']);
            helper.invoke('numberFormat', ['$#,##0.00_);[Red]($#,##0.00)', 'M1:M18']);
            helper.invoke('conditionalFormat', [{ type: 'Top10Items', range: 'M1:M18', cFColor: 'RedFT', value: '10' }]);
            cellEle = helper.invoke('getCell', [0, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            cellEle = helper.invoke('getCell', [1, 12]);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('red');
            cellEle = helper.invoke('getCell', [4, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            cellEle = helper.invoke('getCell', [8, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            helper.invoke('autoFill', ['M14:M18', 'M13:M13', 'Down', 'FillSeries']);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [4, 12]);
            expect(cellEle.style.backgroundColor).toBe('');
            expect(cellEle.style.color).toBe('');
            cellEle = helper.invoke('getCell', [0, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            cellEle = helper.invoke('getCell', [13, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            cellEle = helper.invoke('getCell', [17, 12]);
            expect(cellEle.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(cellEle.style.color).toBe('rgb(156, 0, 85)');
            done();
        });
        it('Autofill with time format applied date time cells', (done: Function) => {
            helper.invoke('numberFormat', ['h:mm', 'J2']);
            helper.invoke('updateCell', [{ value: '1/1/1900 12:14:00 AM' }, 'J2']);
            expect(sheet.rows[1].cells[9].value).toBe('1.0097222222222222');
            expect(helper.invoke('getCell', [1, 9]).textContent).toBe('0:14');
            helper.invoke('autoFill', ['J3:J6', 'J2:J2', 'Down', 'FillSeries']);
            expect(sheet.rows[2].cells[9].value).toBe(1.051388888888889);
            expect(helper.invoke('getCell', [2, 9]).textContent).toBe('1:14');
            expect(sheet.rows[3].cells[9].value).toBe(1.093055555555556);
            expect(helper.invoke('getCell', [3, 9]).textContent).toBe('2:14');
            expect(sheet.rows[4].cells[9].value).toBe(1.1347222222222229);
            expect(helper.invoke('getCell', [4, 9]).textContent).toBe('3:14');
            expect(sheet.rows[5].cells[9].value).toBe(1.1763888888888898);
            expect(helper.invoke('getCell', [5, 9]).textContent).toBe('4:14');
            done();
        });
    });
    describe('CR Issues ->', (): void => {
        describe('SF-343605, EJ2-56678, SF-366825, EJ2-69867 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [
                        {
                            rows: [{ cells: [{ value: '0f02f609e12', format: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)' }, { value: '10' }] }]
                        }
                    ]
                };
                helper.initializeSpreadsheet(model, done);
            });

            afterAll((): void => {
                helper.invoke('destroy');
            });

            it('Custom format with text value starts with number throws script error while import', (done: Function) => {
                const td: Element = helper.invoke('getCell', [0, 0]);
                expect(td.classList).not.toContain('e-right-align');
                expect(td.textContent).toBe(' 0f02f609e12 ');
                done();
            });

            it('Parse thousand separator in custom number & currency format', (done: Function) => {
                let td: Element;
                let sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('numberFormat', ['#,##0', 'A2']);
                helper.edit('A2', '12,00');
                td = helper.invoke('getCell', [1, 0]);
                expect(td.textContent).toBe('12,00');
                expect(td.classList).not.toContain('e-right-align');
                expect(getCell(1, 0, sheet).value).toBe('12,00');
                helper.edit('A2', '1,200');
                td = helper.invoke('getCell', [1, 0]);
                expect(td.textContent).toBe('1,200');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(1, 0, sheet).value).toBe('1200');

                helper.invoke('numberFormat', ['#,##0.00', 'A3']);
                helper.edit('A3', '1,1,499');
                td = helper.invoke('getCell', [2, 0]);
                expect(td.textContent).toBe('1,1,499');
                expect(td.classList).not.toContain('e-right-align');
                expect(getCell(2, 0, sheet).value).toBe('1,1,499');
                helper.edit('A3', '11,499');
                td = helper.invoke('getCell', [2, 0]);
                expect(td.textContent).toBe('11,499.00');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(2, 0, sheet).value).toBe('11499');

                helper.invoke('numberFormat', ['#,##0.00_);[Red](#,##0.00)', 'A4']);
                helper.edit('A4', '1111,1233');
                td = helper.invoke('getCell', [3, 0]);
                expect(td.textContent).toBe('1111,1233');
                expect(td.classList).not.toContain('e-right-align');
                expect(getCell(3, 0, sheet).value).toBe('1111,1233');
                helper.edit('A4', '11,111,233');
                td = helper.invoke('getCell', [3, 0]);
                expect(td.textContent).toBe('11,111,233.00 ');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(3, 0, sheet).value).toBe('11111233');

                helper.invoke('numberFormat', ['$#,##0_);($#,##0)', 'A5']);
                helper.edit('A5', '$1,1233');
                td = helper.invoke('getCell', [4, 0]);
                expect(td.textContent).toBe('$1,1233');
                expect(td.classList).not.toContain('e-right-align');
                expect(getCell(4, 0, sheet).value).toBe('$1,1233');
                helper.edit('A5', '$11,111,233');
                td = helper.invoke('getCell', [4, 0]);
                expect(td.textContent).toBe('$11,111,233 ');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(4, 0, sheet).value).toBe('11111233');

                helper.invoke('numberFormat', ['$#,##0.00_);[Red]($#,##0.00)', 'A6']);
                helper.edit('A6', '$1,1233');
                td = helper.invoke('getCell', [5, 0]);
                expect(td.textContent).toBe('$1,1233');
                expect(td.classList).not.toContain('e-right-align');
                expect(getCell(5, 0, sheet).value).toBe('$1,1233');
                helper.edit('A6', '$11,111,233');
                td = helper.invoke('getCell', [5, 0]);
                expect(td.textContent).toBe('$11,111,233.00 ');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(5, 0, sheet).value).toBe('11111233');

                // Customer exact case
                helper.invoke('numberFormat', ['text', 'A7']);
                helper.edit('A7', '-10.23499');
                helper.invoke('numberFormat', ['#,##0_);(#,##0)', 'A7']);
                td = helper.invoke('getCell', [6, 0]);
                expect(td.textContent).toBe('(10)');
                expect(td.classList).toContain('e-right-align');
                expect(getCell(6, 0, sheet).value as any).toBe(-10.23499);
                done();
            });
            it('Text align dropdown icon not updated while applying text format for numbers', (done: Function) => {
                const textAlignIcon: HTMLElement = helper.getElement('#' + helper.id + '_text_align .e-btn-icon');
                helper.invoke('selectRange', ['B1']);
                const cell: HTMLElement = helper.invoke('getCell', [0, 1]);
                expect(textAlignIcon.classList.contains('e-right-icon')).toBeTruthy();
                expect(cell.classList.contains('e-right-align')).toBeTruthy();
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_Text').click();
                expect(textAlignIcon.classList.contains('e-left-icon')).toBeTruthy();
                expect(cell.classList.contains('e-right-align')).toBeFalsy();
                helper.invoke('selectRange', ['A2']);
                expect(textAlignIcon.classList.contains('e-right-icon')).toBeTruthy();
                helper.invoke('selectRange', ['B1']);
                expect(textAlignIcon.classList.contains('e-left-icon')).toBeTruthy();
                helper.getElement('#' + helper.id + '_text_align').click();
                helper.getElement('#' + helper.id + '_text_align-popup .e-right-icon').click();
                expect(cell.style.textAlign).toBe('right');
                expect(textAlignIcon.classList.contains('e-right-icon')).toBeTruthy();
                done();
            });
            it('Applying number format on empty cell throws script error and used range not updated', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                expect(sheet.usedRange.colIndex).toBe(1);
                helper.invoke('selectRange', ['D1']);
                helper.getElement('#' + helper.id + '_number_format').click();
                helper.getElement('#' + helper.id + '_Accounting').click();
                expect(sheet.usedRange.colIndex).toBe(3);
                done();
            });
            it('Mistakenly auto detecting as currency format for cell data which contains text with currency number', (done: Function) => {
                helper.edit('D2', 'Claims greater than $2,500');
                let cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
                expect(cell.value).toBe('Claims greater than $2,500');
                const cellEle: HTMLElement = helper.invoke('getCell', [1, 3]);
                expect(cellEle.textContent).toBe('Claims greater than $2,500');
                expect(cell.format).toBeUndefined();
                helper.edit('D2', '$2,500');
                expect(cell.value).toBe('2500');
                expect(cell.format).toBe('$#,##0');
                expect(cellEle.textContent).toBe('$2,500');
                helper.edit('D3', '$2,500.667');
                cell = helper.getInstance().sheets[0].rows[2].cells[3];
                expect(cell.value).toBe('2500.667');
                expect(cell.format).toBe('$#,##0.00');
                expect(helper.invoke('getCell', [2, 3]).textContent).toBe('$2,500.67');
                done();
            });
            it('Currency code change checking', (done: Function) => {
                helper.invoke('numberFormat', ['$#,##0.00', 'B1']);
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 1]);
                expect(cellEle.textContent).toBe('$10.00');
                // const spreadsheet: Spreadsheet = helper.getInstance();
                // setCurrencyCode('EUR');
                // spreadsheet.dataBind();
                // expect(cellEle.textContent).toBe('€10.00');
                // setCurrencyCode('USD');
                // spreadsheet.dataBind();
                // expect(cellEle.textContent).toBe('$10.00');
                done();
            });
            it('SF-407064 - Scientific custom format with decimal places more than two is not working', (done: Function) => {
                helper.invoke('updateCell', [{ value: 1237658 }, 'B3']);
                helper.invoke('numberFormat', ['0.000000E+00', 'B3']);
                const cellEle: HTMLElement = helper.invoke('getCell', [2, 1]);
                expect(cellEle.textContent).toBe('1.237658E+06');
                helper.invoke('numberFormat', ['0.0000E+00', 'B3']);
                expect(cellEle.textContent).toBe('1.2377E+06');
                helper.invoke('numberFormat', ['0.000E+0', 'B3']);
                expect(cellEle.textContent).toBe('1.238E+6');
                helper.invoke('numberFormat', ['0.00E+00', 'B3']);
                expect(cellEle.textContent).toBe('1.24E+06');
                helper.invoke('updateCell', [{ value: '-15.34' }, 'B3']);
                expect(helper.getInstance().sheets[0].rows[2].cells[1].value).toBe(-15.34);
                expect(cellEle.textContent).toBe('-1.53E+01');
                helper.invoke('numberFormat', ['0.000E+0', 'B5']);
                expect(helper.invoke('getCell', [4, 1]).textContent).toBe('');
                done();
            });
            it('Custom formatted cell value changed while clicking on column header (Aggregate calculation updating the cell model)', (done: Function) => {
                helper.invoke('selectRange', ['E1:E2']);
                helper.invoke('updateCell', [{ value: 'Amount' }, 'E1']);
                helper.invoke('updateCell', [{ value: '20' }, 'E2']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('updateCell', [{ format: '($* #,##0);($* (#,##0);($* "-");(@_)' }, 'E1']);
                helper.invoke('updateCell', [{ format: '($* #,##0);($* (#,##0);($* "-");(@_)' }, 'E2']);
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 4]);
                expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBe('Amount');
                expect(cellEle.textContent).toBe('(Amount ');
                spreadsheet.notify(showAggregate, {});
                expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBe('Amount');
                expect(cellEle.textContent).toBe('(Amount ');
                done();
            });
            it('SF-399272 -> MMM d, yyyy - ddd and MMM d, yyyy ddd custom date format', (done: Function) => {
                helper.invoke('numberFormat', ['MMM d, yyyy - ddd', 'A15']);
                helper.invoke('updateCell', [{ value: 'Feb 14, 2014 - Fri' }, 'A15']);
                const cell: CellModel = helper.getInstance().sheets[0].rows[14].cells[0];
                expect(cell.value).toBe('41684');
                expect(cell.format).toBe('MMM d, yyyy - ddd');
                const cellEle: HTMLElement = helper.invoke('getCell', [14, 0]);
                expect(cellEle.textContent).toBe('Feb 14, 2014 - Fri');
                expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
                helper.invoke('numberFormat', ['MMM d, yyyy ddd', 'A15']);
                helper.invoke('updateCell', [{ value: 'Aug 22, 1994 Mon' }, 'A15']);
                expect(cell.value).toBe('34568');
                expect(cell.format).toBe('MMM d, yyyy ddd');
                expect(cellEle.textContent).toBe('Aug 22, 1994 Mon');
                expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
                done();
            });
            it('EJ2-64839 -> String type cell values are right aligned while applying custom date format', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'Text' }, 'A16']);
                helper.invoke('numberFormat', ['dd-MMM', 'A16']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                const sheet: SheetModel = helper.getInstance().sheets[0];
                expect(sheet.rows[15].cells[0].value).toBe('Text');
                const cellEle: HTMLElement = helper.invoke('getCell', [15, 0]);
                expect(cellEle.textContent).toBe('Text');
                expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
                helper.invoke('updateCell', [{ value: '7 Series' }, 'A16']);
                expect(cellEle.textContent).toBe('7 Series');
                expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
                setCell(15, 0, sheet, { value: '7/Aug' }, true);
                expect(sheet.rows[15].cells[0].value).toBe('7/Aug');
                spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refresh(15, 0, true, cellEle);
                expect(sheet.rows[15].cells[0].value).toBe('37110');
                expect(cellEle.textContent).toBe('07-Aug');
                expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
                done();
            });
            it('EJ2-63248 - ##0.0E+0  format is not working', (done: Function) => {
                helper.invoke('updateCell', [{ value: '17866.19' }, 'F1']);
                const cell: any = helper.getInstance().sheets[0].rows[0].cells[5];
                expect(cell.value).toBe(17866.19);
                helper.invoke('numberFormat', ['##0.0E+0', 'F1']);
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 5]);
                expect(cellEle.textContent).toBe('17.9E+3');
                helper.invoke('numberFormat', ['#0.0E+0', 'F1']);
                expect(cellEle.textContent).toBe('1.8E+4');
                helper.invoke('updateCell', [{ value: '2338.74' }, 'F1']);
                expect(cell.value).toBe(2338.74);
                expect(cellEle.textContent).toBe('23.4E+2');
                helper.invoke('numberFormat', ['##0.0E+0', 'F1']);
                expect(cellEle.textContent).toBe('2.3E+3');
                helper.invoke('updateCell', [{ value: '20' }, 'F1']);
                expect(cell.value).toBe(20);
                expect(cellEle.textContent).toBe('20.0E+0');
                helper.invoke('updateCell', [{ value: '9967.74' }, 'F1']);
                expect(cell.value).toBe(9967.74);
                expect(cellEle.textContent).toBe('10.0E+3');
                helper.invoke('updateCell', [{ value: '13853.09' }, 'F1']);
                expect(cell.value).toBe(13853.09);
                expect(cellEle.textContent).toBe('13.9E+3');
                helper.invoke('updateCell', [{ value: '0.02' }, 'F1']);
                expect(cell.value).toBe(0.02);
                expect(cellEle.textContent).toBe('20.0E-3');
                helper.invoke('updateCell', [{ value: '0.11555489' }, 'F1']);
                expect(cell.value).toBe(0.11555489);
                expect(cellEle.textContent).toBe('115.6E-3');
                helper.invoke('updateCell', [{ value: '0.000089' }, 'F1']);
                expect(cell.value).toBe(0.000089);
                expect(cellEle.textContent).toBe('89.0E-6');
                helper.invoke('updateCell', [{ value: '67.32' }, 'F1']);
                expect(cell.value).toBe(67.32);
                expect(cellEle.textContent).toBe('67.3E+0');
                helper.invoke('updateCell', [{ value: '7.056' }, 'F1']);
                expect(cell.value).toBe(7.056);
                expect(cellEle.textContent).toBe('7.1E+0');
                helper.invoke('updateCell', [{ value: '-0.67' }, 'F1']);
                expect(cell.value).toBe(-0.67);
                expect(cellEle.textContent).toBe('-670.0E-3');
                done();
            });
            it('EJ2-69867 - Exceptions thrown while importing a file with custom format into a spreadsheet', (done: Function) => {
                helper.edit('G1', '0');
                setTimeout((): void => {
                    helper.invoke('numberFormat', ['_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)', 'G1']);
                    const cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[6];
                    expect(cell.value.toString()).toBe('0');
                    const cellEle: HTMLElement = helper.invoke('getCell', [0, 6]);
                    expect(cellEle.getElementsByClassName("e-fill-sec")[0].textContent).toBe('- ');
                    expect(cellEle.textContent).toBe('             - ');
                    done();
                });
            });
            it('EJ2-830145 -> Custom number format with third rule as -(hypen) and cell value as zero ', (done: Function) => {
                helper.invoke('numberFormat', ['#,##0.00;-#,##0.00;"-"', 'G2']);
                helper.invoke('updateCell', [{ value: '0' }, 'G2']);
                const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[6];
                expect(cell.value.toString()).toBe('0');
                const cellEle: HTMLElement = helper.invoke('getCell', [1, 6]);
                expect(cellEle.textContent).toBe('-');
                done();
            });
        });
        describe('EJ2-839539 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{
                        rows: [{
                            cells: [
                                { formula: '=A2+A3' }
                            ]
                        },{
                            cells: [
                                { value: '22,313,432' }
                            ]
                        },{
                            cells: [
                                { value: '1234' },
                            ]
                        }]
                    }]
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Formula cell that refers another formula valued cell in different sheet throws error while rendering in spreadsheet', (done: Function) => {
                expect(helper.invoke('getCell', [0, 0]).textContent).not.toBe('#VALUE!');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('22314666');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('22314666');
                done();
            });
        });
        describe('EJ2-844735, EJ2-846521 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{
                        rows: [
                            { cells: [{ value: '1', format: '0.0%' }, { value: '100'}] },
                            { cells: [{ value: '1', format: '#,##0' }, { value: '100.00'}] },
                            { cells: [{ value: '1', format: '$#,##0.00' }, { value: '100.01'}] },
                            { cells: [{ value: '1', format: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)' }, { value: '100.010'}] },
                            { cells: [{ value: '1', format: '0.00%' }, { value: '100%'}] }
                        ]
                    }]
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Value converts to string when entered with % in custom format applied cell', (done: Function) => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('100.0%');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('1');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('$1.00');
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe(' $1.00 ');
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('100.00%');
                helper.edit('A1', '1%');
                helper.edit('A2', '1%');
                helper.edit('A3', '1%');
                helper.edit('A4', '1%');
                helper.edit('A5', '1%');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('1.0%');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('0');
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('$0.01');
                expect(helper.invoke('getCell', [3, 0]).textContent).toBe(' $0.01 ');
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('1.00%');
                done();
            });
            it('The decimal values that contains zeros after decimal point was not parsed properly while loading it using openFromJson method', (done: Function) => {
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('100');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('100');
                expect(helper.invoke('getCell', [2, 1]).textContent).toBe('100.01');
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('100.01');
                expect(helper.invoke('getCell', [4, 1]).textContent).toBe('100%');
                done();
            });
        });
    });

    describe('Localization is not updated for placeholder and dialog content in the number format ->',(): void =>{
        describe('EJ2-55546 ->',()=>{
            beforeEach((done: Function) => {
                L10n.load({
                    'de-DE': {
                        'spreadsheet': {
                            'Cut': 'Schneiden',
                            'Copy': 'Kopieren',
                            'Paste': 'Paste',
                            'PasteSpecial': 'paste spezial',
                            'All': 'Alles',
                            'Values': 'Werte',
                            'Formats': 'Formate',
                            'Font': 'Schriftart',
                            'FontSize': 'Schriftgröße',
                            'Bold': 'Fett gedruckt',
                            'Italic': 'Kursiv',
                            'Underline': 'Unterstreichen',
                            'Strikethrough': 'Durchgestrichen',
                            'TextColor': 'Textfarbe',
                            'FillColor': 'Füllfarbe',
                            'HorizontalAlignment': 'Horizontale Ausrichtung',
                            'AlignLeft': 'Linksbündig ausrichten',
                            'AlignCenter': 'Center',
                            'AlignRight': 'Rechtsbündig ausrichten',
                            'VerticalAlignment': 'Vertikale Ausrichtung',
                            'AlignTop': 'Oben ausrichten',
                            'AlignMiddle': 'Mitte ausrichten',
                            'AlignBottom': 'Unten ausrichten',
                            'InsertFunction': 'Funktion einfügen',
                            'Insert': 'Einfügen',
                            'Delete': 'Löschen',
                            'Rename': 'Umbenennen',
                            'Hide': 'verbergen',
                            'Unhide': 'Sichtbar machen',
                            'NameBox': 'Namensfeld',
                            'ShowHeaders': 'Kopfzeilen anzeigen',
                            'HideHeaders': 'Header ausblenden',
                            'ShowGridLines': 'Gitternetzlinien anzeigen',
                            'HideGridLines': 'Gitternetzlinien ausblenden',
                            'AddSheet': 'Blatt hinzufügen',
                            'ListAllSheets': 'Alle Blätter auflisten',
                            'FullScreen': 'Vollbild',
                            'CollapseToolbar': 'Zusammenbruch symbolleiste',
                            'ExpandToolbar': 'Erweitern Symbolleiste',
                            'CollapseFormulaBar': 'Collapse Formelleiste',
                            'ExpandFormulaBar': 'Expand Formelleiste',
                            'File': 'Datei',
                            'Home': 'Huis',
                            'Formulas': 'Formeln',
                            'View': 'Aussicht',
                            'New': 'Neu',
                            'Open': 'Öffnen',
                            'SaveAs': 'Speichern als',
                            'ExcelXlsx': 'Microsoft Excel',
                            'ExcelXls': 'Microsoft Excel 97-2003',
                            'CSV': 'Comma-separated values',
                            'FormulaBar': 'Formelleiste',
                            'Ok': 'OK',
                            'Close': 'Schließen',
                            'Cancel': 'Abbrechen',
                            'Apply': 'Sich bewerben',
                            'MoreColors': 'Mehr Farben',
                            'StandardColors': 'Standard farben',
                            'General': 'Allgemeines',
                            'Number': 'Nummer',
                            'Currency': 'Währung',
                            'Accounting': 'Buchhaltung',
                            'ShortDate': 'Kurzes Date',
                            'LongDate': 'Langes Datum',
                            'Time': 'Zeit',
                            'Percentage': 'Prozentsatz',
                            'Fraction': 'Fraktion',
                            'Scientific': 'Wissenschaft',
                            'Text': 'Text',
                            'NumberFormat': 'Zahlenformat',
                            'MobileFormulaBarPlaceHolder': 'Wert oder Formel eingeben',
                            'PasteAlert': 'Sie können dies hier nicht einfügen, da der Kopierbereich und der Einfügebereich nicht dieselbe Größe haben. Bitte versuchen Sie es in einem anderen Bereich.',
                            'DestroyAlert': 'Möchten Sie die aktuelle Arbeitsmappe wirklich löschen, ohne sie zu speichern, und eine neue Arbeitsmappe erstellen?',
                            'SheetRenameInvalidAlert': 'Der Blattname enthält ein ungültiges Zeichen.',
                            'SheetRenameEmptyAlert': 'Der Blattname darf nicht leer sein.',
                            'SheetRenameAlreadyExistsAlert': 'Der Blattname ist bereits vorhanden. Bitte geben Sie einen anderen Namen ein.',
                            'DeleteSheetAlert': 'Möchten Sie dieses Blatt wirklich löschen?',
                            'DeleteSingleLastSheetAlert': 'Eine Arbeitsmappe muss mindestens ein sichtbares Arbeitsblatt enthalten.',
                            'PickACategory': 'Wählen Sie eine Kategorie',
                            'Description': 'Beschreibung',
                            'UnsupportedFile': 'Nicht unterstützte Datei',
                            'InvalidUrl': 'Ungültige URL',
                            'SUM': 'Fügt eine Reihe von Zahlen und / oder Zellen hinzu.',
                            'SUMIF': 'Fügt die Zellen basierend auf der angegebenen Bedingung hinzu.',
                            'SUMIFS': 'Fügt die Zellen basierend auf den angegebenen Bedingungen hinzu.',
                            'ABS': 'Gibt den Wert einer Zahl ohne Vorzeichen zurück.',
                            'RAND': 'Gibt eine Zufallszahl zwischen 0 und 1 zurück.',
                            'RANDBETWEEN': 'Gibt eine zufällige Ganzzahl basierend auf angegebenen Werten zurück.',
                            'FLOOR': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors ab.',
                            'CEILING': 'Rundet eine Zahl auf das nächste Vielfache eines bestimmten Faktors.',
                            'PRODUCT': 'Multipliziert eine Reihe von Zahlen und / oder Zellen.',
                            'AVERAGE': 'Berechnen Sie den Durchschnitt für die Reihe von Zahlen und / oder Zellen ohne Text.',
                            'AVERAGEIF': 'Berechnet den Durchschnitt für die Zellen basierend auf der angegebenen Bedingung.',
                            'AVERAGEIFS': 'Berechnet den Durchschnitt für die Zellen basierend auf den angegebenen Bedingungen.',
                            'AVERAGEA': 'Berechnet den Durchschnitt für die Zellen, wobei WAHR als 1, text und FALSCH als 0 ausgewertet werden.',
                            'COUNT': 'Zählt die Zellen, die numerische Werte in einem Bereich enthalten.',
                            'COUNTIF': 'Zählt die Zellen basierend auf der angegebenen Bedingung.',
                            'COUNTIFS': 'Zählt die Zellen basierend auf den angegebenen Bedingungen.',
                            'COUNTA': 'Zählt die Zellen, die Werte in einem Bereich enthalten.',
                            'MIN': 'Gibt die kleinste Anzahl der angegebenen Argumente zurück.',
                            'MAX': 'Gibt die größte Anzahl der angegebenen Argumente zurück.',
                            'DATE': 'Gibt das Datum basierend auf einem bestimmten Jahr, Monat und Tag zurück.',
                            'DAY': 'Gibt den Tag ab dem angegebenen Datum zurück.',
                            'DAYS': 'Gibt die Anzahl der Tage zwischen zwei Daten zurück.',
                            'IF': 'Gibt einen Wert basierend auf dem angegebenen Ausdruck zurück.',
                            'IFS': 'Gibt einen Wert zurück, der auf den angegebenen mehreren Ausdrücken basiert.',
                            'AND': 'Gibt WAHR zurück, wenn alle Argumente WAHR sind, andernfalls wird FALSCH zurückgegeben.',
                            'OR': 'Gibt WAHR zurück, wenn eines der Argumente WAHR ist, andernfalls wird FALSCH zurückgegeben.',
                            'IFERROR': 'Gibt einen Wert zurück, wenn kein Fehler gefunden wurde. Andernfalls wird der angegebene Wert zurückgegeben.',
                            'CHOOSE': 'Gibt einen Wert aus der Werteliste basierend auf der Indexnummer zurück.',
                            'INDEX': 'Gibt einen Wert der Zelle in einem bestimmten Bereich basierend auf der Zeilen- und Spaltennummer zurück.',
                            'FIND': 'Gibt die Position eines Strings innerhalb eines anderen Strings zurück, wobei die Groß- und Kleinschreibung beachtet wird.',
                            'CONCATENATE': 'Kombiniert zwei oder mehr Zeichenfolgen.',
                            'CONCAT': 'Verkettet eine Liste oder einen Bereich von Textzeichenfolgen.',
                            'SUBTOTAL': 'Gibt die Zwischensumme für einen Bereich unter Verwendung der angegebenen Funktionsnummer zurück.',
                            'RADIANS': 'Konvertiert Grad in Bogenmaß.',
                            'MATCH': 'Gibt die relative Position eines angegebenen Wertes im angegebenen Bereich zurück.',
                            'DefineNameExists': 'Dieser Name ist bereits vorhanden, versuchen Sie es mit einem anderen Namen.',
                            'CircularReference': 'Wenn eine Formel auf einen oder mehrere Zirkelverweise verweist, kann dies zu einer falschen Berechnung führen.',
                            'CustomFormat': 'Formats de nombre personnalisés',
                            'APPLY':'Sich bewerben',
                        }
                    }
                });
                helper.initializeSpreadsheet({locale:'de-DE'},done);
            });
            afterEach(()=>{
                helper.invoke('destroy');
            });
            it('Locale is not applied for placeholder and dialog content',(done:Function):void => {
                let inputElement:any;
                helper.getElement('#'+helper.id+'_number_format').click();
                helper.getElement('#'+helper.id+'_Custom').click();
                setTimeout(()=> {
                    inputElement=helper.getElementFromSpreadsheet('.e-input.e-dialog-input');
                    expect(inputElement.placeholder).toEqual('Geben Sie ein benutzerdefiniertes Format ein oder wählen Sie es aus');
                    done();
                });  
            });
            it('Set custom time format with localized content',(done:Function):void => {
                helper.invoke('updateCell', [{ value: '0.37' }, 'A1']);
                helper.invoke('numberFormat', ['h:mm AM/PM', 'A1']);
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe(0.37);
                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('8:52 AM');
                done();
            });
        });
    });

    describe('EJ2-64943->', (): void => {
        let sheet: any;
        beforeAll((done: Function) => {
            model = {
                sheets: [{
                    rows: [{
                        cells: [{ value: 'Mar-2020' }, { value: 'April-2010' }, { value: '2020-April' }, { value: 'No benchmark-USD' },
                        { value: 'mark-20' }, { value: '10-october' }, { value: 'Novem-2022' }, { value: 'Novel-2022' }, { value: '-2' }, { value: 'no-2022' },
                        { value: '12-October-1945' }, { value: 'October-1945' }]
                    }]
                }]
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Spreadsheet auto format the text into date', (done: Function) => {
            sheet = helper.invoke('getActiveSheet');
            const cellEle: Element[] = helper.invoke('getRow', [0]).cells;
            expect(cellEle[0].textContent).toBe('Mar-20');
            expect(cellEle[1].textContent).toBe('Apr-10');
            expect(cellEle[2].textContent).toBe('Apr-20');
            expect(cellEle[3].textContent).toBe('No benchmark-USD');
            expect(cellEle[4].textContent).toBe('mark-20');
            expect(cellEle[5].textContent).toBe('10-Oct');
            expect(cellEle[6].textContent).toBe('Nov-22');
            expect(cellEle[7].textContent).toBe('Novel-2022');
            expect(cellEle[8].textContent).toBe('-2');
            expect(cellEle[9].textContent).toBe('no-2022');
            expect(cellEle[10].textContent).toBe('12-Oct-45');
            expect(cellEle[11].textContent).toBe('Oct-45');
            helper.invoke('selectRange', ['K1']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_LongDate').click();
            helper.invoke('selectRange', ['L1']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_LongDate').click();
            expect(cellEle[10].textContent).toBe('Friday, October 12, 1945');
            expect(cellEle[11].textContent).toBe('Monday, October 1, 1945');
            done();
        });
    });
    describe('EJ2-855322 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    rows: [
                        { cells: [{ value: '23/01/1928', format: 'dd/MM/yyyy' }, { value: '23-01-1928', format: 'dd-MM-yyyy' }] }
                    ]
                }]
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Date format gets changed when attempting to edit the data and saving it', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            let coords: ClientRect = td.getBoundingClientRect();
            expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('1/23/1928');
            helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
            let editEle: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
            expect(editEle.textContent).toBe('1/23/1928');
            helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '1/23/1920', refreshCurPos: true, refreshEditorElem: true });
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('23/01/1920');
                helper.invoke('selectRange', ['B1']);
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('1/23/1928');
                    td = helper.invoke('getCell', [1, 0]);
                    coords = td.getBoundingClientRect();
                    helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
                    editEle = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
                    expect(editEle.textContent).toBe('1/23/1928');
                    helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '1/23/1920', refreshCurPos: true, refreshEditorElem: true });
                    helper.triggerKeyNativeEvent(13);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 1]).textContent).toEqual('23-01-1920');
                        done();
                    });
                });
            });
        });
    });
    describe('EJ2-883693 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Custom number format is not working properly like MS Excel when the format contains text with date time format in it', (done: Function) => {
            helper.edit('A12', '33.43');
            helper.invoke('numberFormat', ['"Largo: "0.00" metros"', 'A12']);
            let td: HTMLElement = helper.invoke('getCell', [11, 0]);
            expect(td.textContent).toBe('Largo: 33.43 metros');
            helper.edit('A13', '33.43');
            helper.invoke('numberFormat', ['"hm: "0.00" metros"', 'A13']);
            td = helper.invoke('getCell', [12, 0]);
            expect(td.textContent).toBe('hm: 33.43 metros');
            helper.edit('A14', '33.43');
            helper.invoke('numberFormat', ['"AM: "0.00" metros"', 'A14']);
            td = helper.invoke('getCell', [13, 0]);
            expect(td.textContent).toBe('AM: 33.43 metros');
            helper.edit('A15', '33.43');
            helper.invoke('numberFormat', ['"Hq/ "0.00" HR"', 'A15']);
            td = helper.invoke('getCell', [14, 0]);
            expect(td.textContent).toBe('Hq/ 33.43 HR');
            helper.edit('A16', '33.43');
            helper.invoke('numberFormat', ['"sSmd "0.00" metros"', 'A16']);
            td = helper.invoke('getCell', [15, 0]);
            expect(td.textContent).toBe('sSmd 33.43 metros');
            helper.edit('A17', '33.43');
            helper.invoke('numberFormat', ['"Hmia "0.00" Apa"', 'A17']);
            td = helper.invoke('getCell', [16, 0]);
            expect(td.textContent).toBe('Hmia 33.43 Apa');
            done();
        });
    });
});