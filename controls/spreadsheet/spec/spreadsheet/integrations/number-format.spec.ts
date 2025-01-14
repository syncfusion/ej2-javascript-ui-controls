import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { SpreadsheetModel, SheetModel, getCell, CellModel, showAggregate, Spreadsheet, setCell, ICellRenderer } from '../../../src/index';
import { convertToDefaultFormat, focus, configureLocalizedFormat, getFormatFromType, refreshRibbonIcons } from '../../../src/index';
import { FormatOption, ValidationModel, DialogBeforeOpenEventArgs, getTypeFromFormat, clearRange, refreshCheckbox } from '../../../src/index';
import { InventoryList, defaultData, defaultGermanData } from '../util/datasource.spec';
import { getComponent, L10n, setCurrencyCode, setCulture, onIntlChange, EmitType } from '@syncfusion/ej2-base';

/**
 *  Spreadsheet Number Format test cases.
 */
describe('Spreadsheet Number Format Module ->', (): void => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
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
            expect(cells[0].format).toBe('mmm-yy');
            expect(cellEle[0].textContent).toBe('Mar-20');
            expect(cells[1].value).toBe('45757');
            expect(cells[1].format).toBe('d-mmm');
            expect(cellEle[1].textContent).toBe('10-Apr');
            expect(cells[2].value).toBe('43952');
            expect(cells[2].format).toBe('mmm-yy');
            expect(cellEle[2].textContent).toBe('May-20');
            expect(cells[3].value).toBe('45830');
            expect(cells[3].format).toBe('d-mmm');
            expect(cellEle[3].textContent).toBe('22-Jun');
            expect(cells[4].value).toBe('44025');
            expect(cells[4].format).toBe('d-mmm-yy');
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
            expect(cells[2].value).toBe('45757');
            expect(cellElems[2].textContent).toBe('10-Apr');
            helper.invoke('updateCell', [{ value: '13-Jul-2020', format: 'd-mmm-yy' }, 'D3']);
            expect(cells[3].value).toBe('44025');
            expect(cellElems[3].textContent).toBe('13-Jul-20');
            setCell(2, 4, sheet, { value: '08/27/1994' });
            expect(cells[4].value).toBe('08/27/1994');
            expect(cells[4].format).toBeUndefined();
            helper.invoke('numberFormat', ['m/d/yyyy', 'E3']);
            expect(cells[4].value).toBe('34573');
            expect(cells[4].format).toBe('m/d/yyyy');
            expect(helper.invoke('getCell', [2, 4]).textContent).toBe('8/27/1994');
            delete cells[4].format;
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
            expect(cellEle.textContent).toBe(' (4,234.57)');
            helper.invoke('numberFormat', ['_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)', 'A2']);
            expect(cell.value).toBe(-4234.567);
            expect(cellEle.textContent).toBe('    (4,235)');
            helper.invoke('updateCell', [{ value: '4234.567' }, 'A2']);
            expect(cell.value).toBe(4234.567);
            expect(cellEle.textContent).toBe('      4,235 ');
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
            expect(row.cells[5].value).toBe('45688');
            expect(row.cells[5].format).toBe('d-mmm');
            expect(cellEle.textContent).toBe('31-Jan');
            helper.invoke('updateCell', [{ value: '12/31' }, 'G2']);
            expect(row.cells[6].value).toBe('46022');
            expect(row.cells[6].format).toBe('d-mmm');
            expect(helper.invoke('getCell', [1, 6]).textContent).toBe('31-Dec');
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
            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('      (0.19)');
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
            expect(row.cells[5].format).toBe('m/d/yyyy');
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
            expect(row.cells[5].format).toBe('m/d/yyyy h:mm');
            expect(cellEle.textContent).toBe('10/2/2020 4:32');
            expect(numFormatSelection.textContent).toBe('Custom');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('44106.189409722225');
            expect(cellEle.textContent).toBe('44106.18941');
            expect(numFormatSelection.textContent).toBe('General');
            helper.invoke('updateCell', [{ value: '09-02-23' }, 'F3']);
            expect(row.cells[5].value).toBe('45171');
            expect(row.cells[5].format).toBe('m/d/yyyy');
            expect(cellEle.textContent).toBe('9/2/2023');
            helper.invoke('updateCell', [{ format: 'General' }, 'F3']);
            expect(row.cells[5].value).toBe('45171');
            expect(cellEle.textContent).toBe('45171');
            helper.invoke('updateCell', [{ value: 'June-2022' }, 'F3']);
            expect(row.cells[5].value).toBe('44713');
            expect(row.cells[5].format).toBe('mmm-yy');
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
        it ('Applying improper number formats', (done: Function) => {
            helper.invoke('numberFormat', ['"_"#', 'F3']);
            const cell: any = helper.getInstance().sheets[0].rows[2].cells[5];
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('"_"#');
            const cellEle: HTMLElement = helper.invoke('getCell', [2, 5]);
            expect(cellEle.textContent).toBe('- 10');
            helper.invoke('numberFormat', ['[Orange]#,##0', 'F3']);
            expect(cell.value).toBe(-10);
            expect(cell.format).toBe('[Orange]#,##0');
            expect(cellEle.textContent).toBe('-[Orange]10');
            expect(cellEle.style.color).toBe('');
            done();
        });
        it ('Checking date regional formats', (done: Function) => {
            helper.invoke('numberFormat', ['mm/dd/yy;@', 'F4']);
            helper.invoke('updateCell', [{ value: 'Test' }, 'F4']);
            const cell: any = helper.getInstance().sheets[0].rows[3].cells[5];
            expect(cell.value).toBe('Test');
            expect(cell.format).toBe('mm/dd/yy;@');
            const cellEle: HTMLElement = helper.invoke('getCell', [3, 5]);
            expect(cellEle.textContent).toBe('Test');
            helper.invoke('updateCell', [{ value: '1/2/2020' }, 'F4']);
            expect(cell.value).toBe('43832');
            expect(cell.format).toBe('mm/dd/yy;@');
            expect(cellEle.textContent).toBe('01/02/20');
            helper.invoke('numberFormat', ['d-mmm;@', 'F4']);
            expect(cell.value).toBe('43832');
            expect(cell.format).toBe('d-mmm;@');
            expect(cellEle.textContent).toBe('2-Jan');
            helper.invoke('numberFormat', ['mmmm-yy;@', 'F4']);
            expect(cell.value).toBe('43832');
            expect(cell.format).toBe('mmmm-yy;@');
            expect(cellEle.textContent).toBe('January-20');
            helper.invoke('numberFormat', ['mmmm d, yyyy;@', 'F4']);
            expect(cell.value).toBe('43832');
            expect(cell.format).toBe('mmmm d, yyyy;@');
            expect(cellEle.textContent).toBe('January 2, 2020');
            helper.invoke('numberFormat', ['m/d/yy h:mm;@', 'F4']);
            expect(cell.value).toBe('43832');
            expect(cell.format).toBe('m/d/yy h:mm;@');
            expect(cellEle.textContent).toBe('1/2/20 0:00');
            helper.invoke('updateCell', [{ value: '6/26/2023 2:29:33 PM' }, 'F4']);
            expect(cell.value).toBe('45103.603854166664');
            expect(cellEle.textContent).toBe('6/26/23 14:29');
            helper.invoke('numberFormat', ['mmmmm-yy;@', 'F4']);
            expect(cell.value).toBe('45103.603854166664');
            expect(cell.format).toBe('mmmmm-yy;@');
            expect(cellEle.textContent).toBe('J-23');
            done();
        });
        it ('Checking custom date format multiple sections', (done: Function) => {
            helper.invoke('numberFormat', ['m/d/yy;(#,##0.00);"-";"Welcome to "@', 'F4']);
            const cell: any = helper.getInstance().sheets[0].rows[3].cells[5];
            expect(cell.value).toBe('45103.603854166664');
            expect(cell.format).toBe('m/d/yy;(#,##0.00);"-";"Welcome to "@');
            const cellEle: HTMLElement = helper.invoke('getCell', [3, 5]);
            expect(cellEle.textContent).toBe('6/26/23');
            helper.invoke('updateCell', [{ value: '-10.237' }, 'F4']);
            expect(cell.value).toBe(-10.237);
            expect(cell.format).toBe('m/d/yy;(#,##0.00);"-";"Welcome to "@');
            expect(cellEle.textContent).toBe('(10.24)');
            helper.invoke('updateCell', [{ value: 'Syncfusion' }, 'F4']);
            expect(cell.value).toBe('Syncfusion');
            expect(cell.format).toBe('m/d/yy;(#,##0.00);"-";"Welcome to "@');
            expect(cellEle.textContent).toBe('Welcome to Syncfusion');
            helper.invoke('updateCell', [{ value: '0' }, 'F4']);
            expect(cell.value).toBe(0);
            expect(cell.format).toBe('m/d/yy;(#,##0.00);"-";"Welcome to "@');
            expect(cellEle.textContent).toBe('-');
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
    describe('Culture based number format ->', (): void => {
        let spreadsheet: Spreadsheet; let cell: any; let sheet: any; let cellEle: HTMLElement;
        let formatBtn: HTMLElement; let customFormats: string[]; let localizedFormats: string[];
        let listObj: { dataSource: string[], selectItem: (text: string) => void, getSelectedItems: () => { text: string, item: Element } };
        beforeAll((done: Function) => {
            helper.loadCultureFiles(['de']);
            // Added below lines to clear the external bounded events which causing delay on setCulture & setCurrencyCode method execution.
            (onIntlChange as any).boundedEvents.notifyExternalChange.length = 0;
            delete (onIntlChange as any).boundedEvents['notifyExternalChange'];
            setCulture('de');
            setCurrencyCode('EUR');
            configureLocalizedFormat(null, [{ id: 22, code: 'dd-MM-yyyy h:mm' }]);
            model = { sheets: [{ ranges: [{ dataSource: defaultGermanData }] }], locale: 'de', listSeparator: ';' };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            const germanCurrencyCode: string = customFormats[36];
            expect(getTypeFromFormat(germanCurrencyCode, true)).toBe('Currency');
            expect(getTypeFromFormat('$#,##0.00', true)).toBe('Custom');
            helper.invoke('destroy');
            // Added below lines to clear the external bounded events which causing delay on setCulture & setCurrencyCode method execution.
            (onIntlChange as any).boundedEvents.notifyExternalChange.length = 0;
            delete (onIntlChange as any).boundedEvents['notifyExternalChange'];
            setCulture('en-US');
            setCurrencyCode('USD');
            expect(getTypeFromFormat(germanCurrencyCode, true)).toBe('Custom');
            expect(getTypeFromFormat('$#,##0.00', true)).toBe('Currency');
        });
        it('Custom format dialog checking', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['E2']);
            helper.getElement(`#${helper.id}_number_format`).click();
            helper.getElement(`#${helper.id}_Custom`).click();
            setTimeout(() => {
                listObj = getComponent(helper.getElement('.e-custom-format-dlg .e-listview'), 'listview');
                const formatInput: HTMLInputElement = helper.getElement('.e-custom-format-dlg .e-dialog-input');
                expect(formatInput.value).toBe('');
                expect(listObj.getSelectedItems()).toBeUndefined();
                customFormats = (spreadsheet.workbookNumberFormatModule as any).customFormats;
                expect(listObj.dataSource.length).toBe(36);
                expect(customFormats.length).toBe(36);
                localizedFormats = (spreadsheet.workbookNumberFormatModule as any).localizedFormats;
                expect(localizedFormats === listObj.dataSource).toBeTruthy();
                expect(listObj.dataSource[2]).toBe('0,00');
                expect(listObj.dataSource[7]).toBe('#.##0,00_);(#.##0,00)');
                expect(listObj.dataSource[10]).toBe('#.##0 €_);[Red](#.##0 €)');
                expect(listObj.dataSource[14]).toBe('0,00%');
                expect(listObj.dataSource[16]).toBe('##0,0E+0');
                expect(listObj.dataSource[20]).toBe('d-mmm-yy');
                expect(listObj.dataSource[26]).toBe('h:mm:ss');
                expect(listObj.dataSource[29]).toBe('mm:ss,0');
                expect(listObj.dataSource[33]).toBe('_(* #.##0_);_(* (#.##0);_(* \"-\"_);_(@_)');
                expect(listObj.dataSource[34]).toBe('_(* #.##0,00 €_);_(* (#.##0,00) €;_(* \"-\"?? €_);_(@_)');
                helper.setAnimationToNone('.e-custom-format-dlg.e-dialog');
                listObj.selectItem('#.##0,00 €_);[Red](#.##0,00 €)');
                expect(formatInput.value).toBe('#.##0,00 €_);[Red](#.##0,00 €)');
                (formatInput.nextElementSibling as HTMLButtonElement).click();
                sheet = helper.invoke('getActiveSheet');
                cell = getCell(1, 4, sheet);
                expect(cell.value).toBe(20);
                expect(cell.format).toBe('#,##0.00 "€"_);[Red](#,##0.00 "€")');
                cellEle = helper.invoke('getCell', [1, 4]);
                expect(cellEle.textContent).toBe('20,00 € ');
                formatBtn = helper.getElement(`#${helper.id}_number_format .e-tbar-btn-text`);
                expect(formatBtn.textContent).toBe('Currency');
                done();
            });
        });
        it ('Culture-based format parsing using Util method', (done: Function) => {
            let format: string = '#.##0,00 €';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('#,##0.00 "€"');
            helper.invoke('updateCell', [{ value: '20,278' }, 'E2']);
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cell.value).toBe('20.278');
            expect(cellEle.textContent).toBe('20,28 €');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Currency');
            format = '#.##0,00_);[Red](#.##0,00)';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('#,##0.00_);[Red](#,##0.00)');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cellEle.textContent).toBe('20,28 ');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            format = 'mm:ss,0';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('mm:ss.0');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cellEle.textContent).toBe('40:19.0');
            format = 'dd.MM.yyyy';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('dd.MM.yyyy');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cellEle.textContent).toBe('20.01.1900');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            format = '#,0.';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('#.0,');
            helper.invoke('numberFormat', [format, 'E2']);
            //expect(cellEle.textContent).toBe(',0');
            format = ',';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('.');
            helper.invoke('numberFormat', [format, 'E2']);
            //expect(cellEle.textContent).toBe('20,');
            format = '","00';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('","00');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cellEle.textContent).toBe(',20');
            format = '\\"_-* #.##0,# \\"';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('\\"_-* #,##0.# \\"');
            helper.invoke('numberFormat', [format, 'E2']);
            //expect(cellEle.textContent).toBe('" 20,3 "');
            format = '#"."';
            format = convertToDefaultFormat(spreadsheet, format);
            expect(format).toBe('#"."');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cellEle.textContent).toBe('20.');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            done();
        });
        it('Custom format dialog checking after custom number formats are added', (done: Function) => {
            helper.getElement(`#${helper.id}_number_format`).click();
            helper.getElement(`#${helper.id}_Custom`).click();
            setTimeout(() => {
                listObj = getComponent(helper.getElement('.e-custom-format-dlg .e-listview'), 'listview');
                expect(listObj.dataSource.length).toBe(43);
                expect(customFormats.length).toBe(43);
                expect(listObj.dataSource[4]).toBe('#.##0,00');
                expect(listObj.dataSource[6]).toBe('#.##0_);[Red](#.##0)');
                expect(listObj.dataSource[11]).toBe('#.##0,00 €_);(#.##0,00 €)');
                expect(listObj.dataSource[18]).toBe('# ??/??');
                expect(listObj.dataSource[22]).toBe('mmm-yy');
                expect(listObj.dataSource[27]).toBe('dd-MM-yyyy h:mm');
                expect(listObj.dataSource[30]).toBe('@');
                expect(listObj.dataSource[32]).toBe('_(* #.##0 €_);_(* (#.##0) €;_(* \"-\" €_);_(@_)');
                expect(listObj.dataSource[36]).toBe('#.##0,00 €');
                expect(customFormats[36]).toBe('#,##0.00 "€"');
                expect(listObj.dataSource[37]).toBe('dd.MM.yyyy');
                expect(listObj.dataSource[38]).toBe('#,0.');
                expect(customFormats[38]).toBe('#.0,');
                expect(listObj.dataSource[39]).toBe(',');
                expect(customFormats[39]).toBe('.');
                expect(listObj.dataSource[40]).toBe('","00');
                expect(customFormats[40]).toBe('","00');
                expect(listObj.dataSource[41]).toBe('\\"_-* #.##0,# \\"');
                expect(customFormats[41]).toBe('\\"_-* #,##0.# \\"');
                expect(listObj.dataSource[42]).toBe('#"."');
                expect(customFormats[42]).toBe('#"."');
                done();
            });
        });
        it('Selcting/deselecting custom number format from list and applying the selected format', (done: Function) => {
            const formatInput: HTMLInputElement = helper.getElement('.e-custom-format-dlg .e-dialog-input');
            expect(formatInput.value).toBe('#"."');
            expect(listObj.getSelectedItems().text).toBe('#"."');
            focus(formatInput);
            formatInput.value = 'd';
            helper.triggerKeyNativeEvent(null, false, false, formatInput, 'input', false, formatInput);
            expect(listObj.getSelectedItems()).toBeUndefined();
            formatInput.value = 'dd.MM.yyyy';
            helper.triggerKeyNativeEvent(null, false, false, formatInput, 'input', false, formatInput);
            expect(listObj.getSelectedItems()).toBeUndefined();
            helper.setAnimationToNone('.e-custom-format-dlg.e-dialog');
            (formatInput.nextElementSibling as HTMLButtonElement).click();
            expect(cell.value).toBe('20.278');
            expect(cell.format).toBe('dd.MM.yyyy');
            expect(cellEle.textContent).toBe('20.01.1900');
            expect(formatBtn.textContent).toBe('Custom');
            done();
        });
        it('Custom format mapping with default number format ID', (done: Function) => {
            let formatOptions: FormatOption[] = [{ id: 1, code: '#' }, { id: 2, code: '#,##' }, { id: 3, code: '0,000' },
                { id: 4, code: '#,##0.0' }, { id: 37, code: '#,##0;-#,##0' }, { id: 38, code: '#,##0;[Red]-#,##0' },
                { id: 39, code: '#,##0.00;-#,##0.00' }, { id: 40, code: '#,##0.00;[Red]-#,##0.00' },
                { id: 5, code: '#,##0 "€";-#,##0 "€"' }, { id: 6, code: '#,##0 "€";[Red]-#,##0 "€"' },
                { id: 7, code: '#,##0.00 "€";-#,##0.00 "€"' }, { id: 8, code: '#,##0.00 "€";[Red]-#,##0.00 "€"' },
                { id: 41, code: '_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-' },
                { id: 42, code: '_-* #,##0 "€"_-;-* #,##0 "€"_-;_-* "-" "€"_-;_-@_-' },
                { id: 43, code: '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-' },
                { id: 44, code: '_-* #,##0.00 "€"_-;-* #,##0.00 "€"_-;_-* "-"?? "€"_-;_-@_-' }];
            configureLocalizedFormat(spreadsheet, formatOptions);
            formatOptions = [{ id: 14, code: 'dd.MM.yyyy' }, { id: 15, code: 'dd. MMM yy' }, { id: 16, code: 'dd. MMM' },
                { id: 17, code: 'MMM yy' }, { id: 18, code: 'hh:mm AM/PM' }, { id: 19, code: 'hh:mm:ss AM/PM' }, { id: 20, code: 'hh:mm' },
                { id: 21, code: 'hh:mm:ss' }, { id: 22, code: 'dd.MM.yyyy hh:mm' }, { id: 45, code: 'm:ss' }, { id: 46, code: '[h]:mm' },
                { id: 47, code: 'h:mm:ss.0' }, { id: 10, code: '0.0#%' }, { id: 9, code: '#%' }, { id: 12, code: '#,##0 ?/?' },
                { id: 13, code: '#,##0 ??/??' }, { id: 11, code: '0.00E+0' }, { id: 48, code: '##0.0E+00' }, { id: 49, code: ' @ ' }];
            configureLocalizedFormat(spreadsheet, formatOptions, false);
            let format: string = getFormatFromType('General');
            expect(format).toBe('General');
            format = getFormatFromType('Number');
            expect(format).toBe('#,##');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cell.format).toBe('#,##');
            expect(cellEle.textContent).toBe('20');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Number');
            format = getFormatFromType('ShortDate');
            expect(format).toBe('dd.MM.yyyy');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cell.format).toBe('dd.MM.yyyy');
            expect(cellEle.textContent).toBe('20.01.1900');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Short Date');
            format = getFormatFromType('Percentage');
            expect(format).toBe('0.0#%');
            helper.invoke('numberFormat', [format, 'G2:G11']);
            expect(getCell(6, 6, sheet).format).toBe('0.0#%');
            expect(helper.invoke('getCell', [6, 6]).textContent).toBe('13,2%');
            helper.getElement(`#${helper.id}_number_format`).click();
            helper.getElement(`#${helper.id}_Fraction`).click();
            expect(cell.format).toBe('#,##0 ?/?');
            expect(cellEle.textContent).toBe('20 139/500');
            expect(formatBtn.textContent).toBe('Fraction');
            format = getFormatFromType('Scientific');
            expect(format).toBe('0.00E+0');
            helper.invoke('updateCell', [{ format: format }, 'E2']);
            expect(cell.format).toBe('0.00E+0');
            expect(cellEle.textContent).toBe('2,03E+1');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
            expect(formatBtn.textContent).toBe('Scientific');
            format = getFormatFromType('Time');
            expect(format).toBe('HH:mm:ss');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cell.format).toBe('HH:mm:ss');
            expect(cellEle.textContent).toBe('06:40:19');
            expect(cellEle.classList.contains('e-right-align')).toBeTruthy();
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Time');
            format = getFormatFromType('Text');
            expect(format).toBe(' @ ');
            helper.invoke('numberFormat', [format, 'E2']);
            expect(cell.format).toBe(' @ ');
            expect(cellEle.textContent).toBe(' 20,278 ');
            expect(cellEle.classList.contains('e-right-align')).toBeFalsy();
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Text');
            done();
        });
        it('Custom format dialog checking after custom number formats are mapped with default format ID', (done: Function) => {
            helper.getElement(`#${helper.id}_number_format`).click();
            helper.getElement(`#${helper.id}_Custom`).click();
            setTimeout(()=> {
                listObj = getComponent(helper.getElement('.e-custom-format-dlg .e-listview'), 'listview');
                expect(listObj.dataSource.length).toBe(43);
                expect(localizedFormats === listObj.dataSource).toBeTruthy();
                expect(customFormats.length).toBe(43);
                expect(listObj.dataSource[0]).toBe('General');
                expect(listObj.dataSource[1]).toBe('#');
                expect(listObj.dataSource[2]).toBe('#.##');
                expect(customFormats[2]).toBe('#,##');
                expect(listObj.dataSource[3]).toBe('0.000');
                expect(customFormats[3]).toBe('0,000');
                expect(listObj.dataSource[4]).toBe('#.##0,0');
                expect(listObj.dataSource[5]).toBe('#.##0;-#.##0');
                expect(listObj.dataSource[6]).toBe('#.##0;[Red]-#.##0');
                expect(listObj.dataSource[7]).toBe('#.##0,00;-#.##0,00');
                expect(listObj.dataSource[8]).toBe('#.##0,00;[Red]-#.##0,00');
                expect(listObj.dataSource[9]).toBe('#.##0 €;-#.##0 €');
                expect(customFormats[9]).toBe('#,##0 "€";-#,##0 "€"');
                expect(listObj.dataSource[10]).toBe('#.##0 €;[Red]-#.##0 €');
                expect(listObj.dataSource[11]).toBe('#.##0,00 €;-#.##0,00 €');
                expect(listObj.dataSource[12]).toBe('#.##0,00 €;[Red]-#.##0,00 €');
                expect(customFormats[12]).toBe('#,##0.00 "€";[Red]-#,##0.00 "€"');
                expect(listObj.dataSource[13]).toBe('#%');
                expect(listObj.dataSource[14]).toBe('0,0#%');
                expect(customFormats[14]).toBe('0.0#%');
                expect(listObj.dataSource[15]).toBe('0,00E+0');
                expect(listObj.dataSource[16]).toBe('##0,0E+00');
                expect(customFormats[16]).toBe('##0.0E+00');
                expect(listObj.dataSource[17]).toBe('#.##0 ?/?');
                expect(listObj.dataSource[18]).toBe('#.##0 ??/??');
                expect(customFormats[18]).toBe('#,##0 ??/??');
                expect(listObj.dataSource[19]).toBe('dd.MM.yyyy');
                expect(listObj.dataSource[20]).toBe('dd. MMM yy');
                expect(customFormats[20]).toBe('dd. MMM yy');
                expect(listObj.dataSource[21]).toBe('dd. MMM');
                expect(listObj.dataSource[22]).toBe('MMM yy');
                expect(listObj.dataSource[23]).toBe('hh:mm AM/PM');
                expect(listObj.dataSource[24]).toBe('hh:mm:ss AM/PM');
                expect(listObj.dataSource[25]).toBe('hh:mm');
                expect(listObj.dataSource[26]).toBe('hh:mm:ss');
                expect(listObj.dataSource[27]).toBe('dd.MM.yyyy hh:mm');
                expect(customFormats[27]).toBe('dd.MM.yyyy hh:mm');
                expect(listObj.dataSource[28]).toBe('m:ss');
                expect(listObj.dataSource[29]).toBe('h:mm:ss,0');
                expect(customFormats[29]).toBe('h:mm:ss.0');
                expect(listObj.dataSource[30]).toBe(' @ ');
                expect(listObj.dataSource[31]).toBe('[h]:mm');
                expect(listObj.dataSource[32]).toBe('_-* #.##0 €_-;-* #.##0 €_-;_-* "-" €_-;_-@_-');
                expect(customFormats[32]).toBe('_-* #,##0 "€"_-;-* #,##0 "€"_-;_-* "-" "€"_-;_-@_-');
                expect(listObj.dataSource[33]).toBe('_-* #.##0_-;-* #.##0_-;_-* "-"_-;_-@_-');
                expect(listObj.dataSource[34]).toBe('_-* #.##0,00 €_-;-* #.##0,00 €_-;_-* "-"?? €_-;_-@_-');
                expect(listObj.dataSource[35]).toBe('_-* #.##0,00_-;-* #.##0,00_-;_-* "-"??_-;_-@_-');
                expect(customFormats[35]).toBe('_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-');
                expect(listObj.dataSource[36]).toBe('#.##0,00 €');
                expect(listObj.dataSource[37]).toBe('#,0.');
                expect(customFormats[37]).toBe('#.0,');
                expect(listObj.dataSource[42]).toBe('HH:mm:ss');
                expect(customFormats[42]).toBe('HH:mm:ss');
                done();
            });
        });
        it('Applying the mapped custom formats in the cell', (done: Function) => {
            const formatInput: HTMLInputElement = helper.getElement('.e-custom-format-dlg .e-dialog-input');
            expect(formatInput.value).toBe(' @ ');
            // Listview trim the front and end spaces, so we are taking the textContent from selected element instead of using text.
            expect(listObj.getSelectedItems().text).toBe('@');
            expect(listObj.getSelectedItems().item.textContent).toBe(' @ ');
            formatInput.value = '_-* #.##0,00 €_-;-* #.##0,00 €_-;_-* "-"?? €_-;_-@_-';
            helper.triggerKeyNativeEvent(null, false, false, formatInput, 'input', false, formatInput);
            expect(listObj.getSelectedItems()).toBeUndefined();
            helper.setAnimationToNone('.e-custom-format-dlg.e-dialog');
            (formatInput.nextElementSibling as HTMLButtonElement).click();
            expect(cell.value).toBe('20.278');
            expect(cell.format).toBe('_-* #,##0.00 "€"_-;-* #,##0.00 "€"_-;_-* "-"?? "€"_-;_-@_-');
            expect(cellEle.textContent).toBe('   20,28 € ');
            expect(formatBtn.textContent).toBe('Accounting');
            helper.invoke('numberFormat', [customFormats[3], 'E2']);
            expect(cell.format).toBe('0,000');
            expect(cellEle.textContent).toBe('0.020');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Number');
            helper.invoke('updateCell', [{ format: customFormats[7] }, 'E2']);
            expect(cell.format).toBe('#,##0.00;-#,##0.00');
            expect(cellEle.textContent).toBe('20,28');
            expect(formatBtn.textContent).toBe('Custom');
            helper.invoke('updateCell', [{ value: '-20,278' }, 'E2']);
            expect(cell.value).toBe('-20.278');
            expect(cellEle.textContent).toBe('-20,28');
            helper.invoke('numberFormat', [customFormats[8], 'E2']);
            expect(cell.format).toBe('#,##0.00;[Red]-#,##0.00');
            expect(cellEle.textContent).toBe('-20,28');
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '20,278' }, 'E2']);
            expect(cell.value).toBe('20.278');
            expect(cellEle.textContent).toBe('20,28');
            expect(cellEle.style.color).toBe('');
            helper.invoke('numberFormat', [customFormats[21], 'E2']);
            expect(cell.format).toBe('dd. MMM');
            expect(cellEle.textContent).toBe('20. Jan');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            helper.invoke('numberFormat', [customFormats[22], 'E2']);
            expect(cell.format).toBe('MMM yy');
            expect(cellEle.textContent).toBe('Jan 00');
            helper.invoke('numberFormat', [customFormats[23], 'E2']);
            expect(cell.format).toBe('hh:mm AM/PM');
            expect(cellEle.textContent).toBe('06:40 AM');
            helper.invoke('numberFormat', [customFormats[27], 'E2']);
            expect(cell.format).toBe('dd.MM.yyyy hh:mm');
            expect(cellEle.textContent).toBe('20.01.1900 06:40');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            helper.invoke('numberFormat', [customFormats[29], 'E2']);
            expect(cell.format).toBe('h:mm:ss.0');
            expect(cellEle.textContent).toBe('6:40:19.0');
            done();
        });
        it('Currency and accounting formats checking after mapping with default ID', (done: Function) => {
            helper.invoke('updateCell', [{ value: '-20,278' }, 'E2']);
            expect(cell.value).toBe('-20.278');
            helper.invoke('numberFormat', [customFormats[9], 'E2']);
            expect(cell.format).toBe('#,##0 "€";-#,##0 "€"');
            expect(cellEle.textContent).toBe('-20 €');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Currency');
            expect(cellEle.style.color).toBe('');
            helper.invoke('numberFormat', [customFormats[12], 'E2']);
            expect(cell.format).toBe('#,##0.00 "€";[Red]-#,##0.00 "€"');
            expect(cellEle.textContent).toBe('-20,28 €');
            expect(cellEle.style.color).toBe('red');
            helper.invoke('updateCell', [{ value: '20,278' }, 'E2']);
            expect(cell.value).toBe('20.278');
            expect(cellEle.textContent).toBe('20,28 €');
            expect(cellEle.style.color).toBe('');
            helper.invoke('numberFormat', [customFormats[33], 'E2']);
            expect(cell.format).toBe('_-* #,##0_-;-* #,##0_-;_-* "-"_-;_-@_-');
            expect(cellEle.textContent).toBe('           20 ');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Accounting');
            helper.invoke('numberFormat', [customFormats[34], 'E2']);
            done();
        });
        it('Autofill action with the mapped formats', (done: Function) => {
            helper.invoke('numberFormat', [customFormats[3], 'E2']);
            let model: any = getCell(10, 6, sheet);
            expect(model.value).toBe('0.09');
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [10, 6]).textContent).toBe('9,0%');
            helper.invoke('autoFill', ['G12:G13', 'G11']);
            model = getCell(11, 6, sheet);
            expect(model.value).toBe(1.09);
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [11, 6]).textContent).toBe('109,0%');
            model = getCell(12, 6, sheet);
            expect(model.value).toBe(2.09);
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [12, 6]).textContent).toBe('209,0%');
            done();
        });
        it('Editing auto-detect of date and time formats with the mapped formats', (done: Function) => {
            helper.invoke('numberFormat', [customFormats[3], 'E2']);
            let model: any = getCell(10, 6, sheet);
            expect(model.value).toBe('0.09');
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [10, 6]).textContent).toBe('9,0%');
            helper.invoke('autoFill', ['G12:G13', 'G11']);
            model = getCell(11, 6, sheet);
            expect(model.value).toBe(1.09);
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [11, 6]).textContent).toBe('109,0%');
            model = getCell(12, 6, sheet);
            expect(model.value).toBe(2.09);
            expect(model.format).toBe('0.0#%');
            expect(helper.invoke('getCell', [12, 6]).textContent).toBe('209,0%');
            helper.edit('G14', '21.Mär.14');
            model = getCell(13, 6, sheet);
            expect(model.value).toBe('41719');
            expect(model.format).toBe(customFormats[20]);
            expect(helper.invoke('getCell', [13, 6]).textContent).toBe('21. Mär 14');
            helper.edit('G15', 'Mär.94');
            model = getCell(14, 6, sheet);
            expect(model.value).toBe('34394');
            expect(model.format).toBe(listObj.dataSource[22]);
            expect(helper.invoke('getCell', [14, 6]).textContent).toBe('Mär 94');
            helper.edit('G16', '7:22 PM');
            model = getCell(15, 6, sheet);
            expect(model.value).toBe('0.8069444444444445');
            expect(model.format).toBe(customFormats[23]);
            expect(helper.invoke('getCell', [15, 6]).textContent).toBe('07:22 PM');
            helper.edit('G17', '3:34:55');
            model = getCell(16, 6, sheet);
            expect(model.value).toBe('0.1492476851851852');
            expect(model.format).toBe(listObj.dataSource[26]);
            expect(helper.invoke('getCell', [16, 6]).textContent).toBe('03:34:55');
            spreadsheet.notify(refreshRibbonIcons, null);
            expect(formatBtn.textContent).toBe('Custom');
            done();
        });
        it ('Data validation dialog checking with formatted values', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.switchRibbonTab(4);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const dlg: HTMLElement = helper.getElementFromSpreadsheet('.e-datavalidation-dlg.e-dialog');
                const minInput: HTMLInputElement = dlg.querySelector('.e-minimum .e-input');
                minInput.value = '20,45 €';
                let maxInput: HTMLInputElement = dlg.querySelector('.e-maximum .e-input');
                maxInput.value = '50,75';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                const applyBtn: HTMLButtonElement = dlg.querySelector('.e-primary.e-btn');
                applyBtn.click();
                let dlgError: HTMLElement = dlg.querySelector('.e-dlg-error');
                expect(dlgError).not.toBeNull();
                expect(dlgError.textContent).toBe('Please enter a correct value.');
                expect(applyBtn.disabled).toBeTruthy();
                minInput.value = '20';
                helper.triggerKeyEvent('keyup', 110, null, false, false, minInput);
                expect(dlg.querySelector('.e-dlg-error')).toBeNull();
                expect(applyBtn.disabled).toBeFalsy();
                applyBtn.click();
                dlgError = dlg.querySelector('.e-dlg-error');
                expect(dlgError).not.toBeNull();
                expect(dlgError.textContent).toBe('Please enter a correct value.');
                expect(applyBtn.disabled).toBeTruthy();
                minInput.value = '50.1';
                maxInput.value = '1.125';
                helper.triggerKeyEvent('keyup', 110, null, false, false, minInput);
                expect(dlg.querySelector('.e-dlg-error')).toBeNull();
                expect(applyBtn.disabled).toBeFalsy();
                applyBtn.click();
                dlgError = dlg.querySelector('.e-dlg-error');
                expect(dlgError).not.toBeNull();
                expect(dlgError.textContent).toBe('Please enter a correct value.');
                expect(applyBtn.disabled).toBeTruthy();
                const ddlObj: any = (dlg.querySelector('.e-allow .e-dropdownlist') as any).ej2_instances[0];
                ddlObj.value = 'Decimal';
                ddlObj.dataBind();
                (dlg.querySelector('.e-minimum .e-input') as HTMLInputElement).value = '200,45 €';
                maxInput = dlg.querySelector('.e-maximum .e-input');
                maxInput.value = '1.000,75';
                helper.triggerKeyEvent('keyup', 110, null, false, false, maxInput);
                expect(dlg.querySelector('.e-dlg-error')).toBeNull();
                expect(applyBtn.disabled).toBeFalsy();
                applyBtn.click();
                const validation: ValidationModel = getCell(1, 3, sheet).validation;
                expect(validation.value1).toBe('200.45');
                expect(validation.value2).toBe('1000.75');
                done();
            });
        });
        it ('Checking the validation with formatted values', (done: Function) => {
            cell = getCell(1, 3, sheet);
            helper.edit('D2', '200,45 €');
            expect(cell.value).toBe('200.45');
            expect(cell.format).toBe('#,##0.00 "€"');
            cellEle = helper.invoke('getCell', [1, 3]);
            expect(cellEle.textContent).toBe('200,45 €');
            helper.edit('D2', '1.000,75');
            expect(cell.value).toBe(1000.75);
            expect(cellEle.textContent).toBe('1.000,75 €');
            helper.edit('D2', '1.000');
            expect(cell.value).toBe(1000);
            expect(cellEle.textContent).toBe('1.000,00 €');
            helper.edit('D2', '3,01E+02');
            expect(cell.value).toBe(301);
            expect(cellEle.textContent).toBe('301,00 €');
            helper.edit('D2', '20.554,54%');
            expect(cell.value).toBe(205.5454);
            expect(cellEle.textContent).toBe('205,55 €');
            helper.edit('D2', '2.000,35 €');
            setTimeout(() => {
                expect(helper.getElement('.e-validation-error-dlg.e-dialog')).not.toBeNull();
                helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                helper.click('.e-validation-error-dlg.e-dialog .e-btn:not(.e-primary)');
                done();
            });
        });
        it('Opening the validation dialog again and checking the values and changing validation', (done: Function) => {
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            setTimeout(() => {
                const dlg: HTMLElement = helper.getElementFromSpreadsheet('.e-datavalidation-dlg.e-dialog');
                expect((dlg.querySelector('.e-minimum .e-input') as HTMLInputElement).value).toBe('200,45');
                expect((dlg.querySelector('.e-maximum .e-input') as HTMLInputElement).value).toBe('1000,75');
                const ddlObj: any = (dlg.querySelector('.e-allow .e-dropdownlist') as any).ej2_instances[0];
                ddlObj.value = 'List';
                ddlObj.dataBind();
                const listInput: HTMLInputElement = dlg.querySelector('.e-values .e-input');
                listInput.value = '10,75 €;20,35;3045%;20.325;50.124,67 €';
                helper.setAnimationToNone('.e-datavalidation-dlg.e-dialog');
                (dlg.querySelector('.e-primary.e-btn') as HTMLButtonElement).click();
                const validation: ValidationModel = getCell(1, 3, sheet).validation;
                expect(validation.value1).toBe('10,75 €;20,35;3045%;20.325;50.124,67 €');
                cellEle = helper.invoke('getCell', [1, 3]);
                expect(cellEle.querySelector('.e-validation-list')).not.toBeNull();
                done();
            });
        });
        it('Checking the validation list values', (done: Function) => {
            delete cell.format;
            helper.edit('D2', '3045,00%');
            expect(cell.value).toBe('30.45');
            expect(cell.format).toBe('0.0#%');
            expect(cellEle.textContent).toBe('3045,0%');
            helper.edit('D2', '10,75 €');
            expect(cell.value).toBe(10.75);
            expect(cellEle.textContent).toBe('1075,0%');
            delete cell.format;
            helper.edit('D2', '20,35');
            expect(cell.value).toBe('20.35');
            expect(cellEle.textContent).toBe('20,35');
            helper.edit('D2', '50.124,67 €');
            expect(cell.value).toBe('50124.67');
            expect(cell.format).toBe('#,##0.00 "€"');
            expect(cellEle.textContent).toBe('50.124,67 €');
            helper.edit('D2', '20.325');
            expect(cell.value).toBe(20325);
            expect(cellEle.textContent).toBe('20.325,00 €');
            helper.edit('D2', '2,03E+04');
            setTimeout(() => {
                expect(helper.getElement('.e-validation-error-dlg.e-dialog')).not.toBeNull();
                helper.setAnimationToNone('.e-validation-error-dlg.e-dialog');
                helper.click('.e-validation-error-dlg.e-dialog .e-btn:not(.e-primary)');
                done();
            });
        });
        it ('Finding culture based formatted values', (done: Function) => {
            expect(sheet.selectedRange).toBe('D2:D2');
            helper.invoke('numberFormat', [convertToDefaultFormat(spreadsheet, '#.##0,00 €'), 'E2:E11']);
            helper.invoke('updateCell', [{ value: '' }, 'E3']);
            helper.invoke('updateCell', [{ value: 'test' }, 'E4']);
            helper.invoke('find', [{ value: '20,45', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('E5:E5');
            helper.invoke('updateCell', [{ value: 30 }, 'E3']);
            helper.invoke('updateCell', [{ value: 15 }, 'E4']);
            cell = getCell(1, 1, sheet);
            expect(cell.format).toBe('m/d/yyyy');
            cellEle = helper.invoke('getCell', [1, 1]);
            expect(cellEle.textContent).toBe('14.2.2014');
            helper.invoke('numberFormat', [getFormatFromType('ShortDate'), 'B2:B11']);
            expect(cellEle.textContent).toBe('14.02.2014');
            expect(cell.value).toBe('41684');
            helper.invoke('find', [{ value: '41684', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('E5:E5');
            helper.invoke('find', [{ value: '14.02', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('B2:B2');
            helper.invoke('find', [{ value: '21. Mär 14', findOpt: 'prev', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('G14:G14');
            helper.invoke('find', [{ value: '0,1492476851851852', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('G14:G14');
            helper.invoke('find', [{ value: '03:34:55', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('G17:G17');
            helper.invoke('find', [{ value: '0,132', findOpt: 'prev', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('G17:G17');
            helper.invoke('find', [{ value: '13,2%', findOpt: 'prev', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('G7:G7');
            done();
        });
        it ('Applying iconSets in accounting formattted cells', (done: Function) => {
            helper.invoke('numberFormat', [customFormats[35], 'H1:H3']);
            let firstCell: HTMLElement = helper.invoke('getCell', [0, 7]);
            expect(firstCell.textContent).toBe(' Profit ');
            expect(firstCell.querySelector('.e-fill')).toBeNull();
            let secondCell: HTMLElement = helper.invoke('getCell', [1, 7]);
            expect(secondCell.querySelector('.e-fill').textContent).toBe('');
            let thirdCell: HTMLElement = helper.invoke('getCell', [2, 7]);
            let thirdCellText: string = thirdCell.querySelector('.e-fill').textContent;
            helper.invoke('conditionalFormat', [{ type: 'ThreeTrafficLights2', range: 'H1:H3' }]);
            expect(firstCell.classList.contains('e-iconset')).toBeFalsy();
            expect(firstCell.querySelector('.e-iconsetspan')).toBeNull();
            expect(secondCell.classList.contains('e-iconset')).toBeTruthy();
            expect(secondCell.querySelector('.e-fill').textContent).toBe('');
            expect(thirdCell.classList.contains('e-iconset')).toBeTruthy();
            expect(thirdCell.querySelector('.e-fill').textContent).not.toBe(thirdCellText);
            clearRange(spreadsheet, [1, 7, 1, 7], 0);
            expect(secondCell.classList.contains('e-iconset')).toBeFalsy();
            expect(secondCell.textContent).toBe('');
            helper.invoke('numberFormat', [customFormats[33], 'H1:H3']);
            expect(thirdCell.classList.contains('e-iconset')).toBeTruthy();
            expect(thirdCell.querySelector('.e-fill').textContent).not.toBe(thirdCellText);
            helper.invoke('numberFormat', ['* #', 'H4:H6']);
            firstCell = helper.invoke('getCell', [3, 7]);
            const firstCellText: string = firstCell.querySelector('.e-fill').textContent;
            expect(firstCellText).not.toBe('');
            secondCell = helper.invoke('getCell', [4, 7]);
            const secondCellText: string = secondCell.querySelector('.e-fill').textContent;
            expect(secondCellText).not.toBe('');
            thirdCell = helper.invoke('getCell', [5, 7]);
            thirdCellText = thirdCell.querySelector('.e-fill').textContent;
            expect(thirdCellText).not.toBe('');
            helper.invoke('conditionalFormat', [{ type: 'ThreeSymbols', range: 'H4:H6' }]);
            expect(firstCell.classList.contains('e-iconset')).toBeTruthy();
            expect(firstCell.querySelector('.e-fill').textContent).not.toBe(firstCellText);
            expect(firstCell.querySelector('.e-fill-sec')).not.toBeNull();
            expect(secondCell.classList.contains('e-iconset')).toBeTruthy();
            expect(secondCell.querySelector('.e-fill').textContent).not.toBe(secondCellText);
            expect(thirdCell.classList.contains('e-iconset')).toBeTruthy();
            expect(thirdCell.querySelector('.e-fill').textContent).not.toBe(thirdCellText);
            helper.invoke('updateCell', [{ notes: 'Test' }, 'H5']);
            helper.invoke('numberFormat', ['* ', 'H5:H9']);
            firstCell = helper.invoke('getCell', [4, 7]);
            expect(firstCell.classList.contains('e-iconset')).toBeTruthy();
            expect(firstCell.querySelector('.e-iconsetspan')).not.toBeNull();
            expect(firstCell.querySelector('.e-fill-sec')).toBeNull();
            expect(firstCell.querySelector('.e-addNoteIndicator')).not.toBeNull();
            helper.invoke('conditionalFormat', [{ type: 'ThreeTriangles', range: 'H5:H9' }]);
            expect(firstCell.classList.contains('e-iconset')).toBeTruthy();
            expect(firstCell.querySelector('.e-iconsetspan')).not.toBeNull();
            expect(firstCell.querySelector('.e-fill-sec')).toBeNull();
            expect(firstCell.querySelector('.e-addNoteIndicator')).not.toBeNull();
            done();
        });
    });
    describe('Formatted text checking on UI interaction ->', (): void => {
        let sheet: any; let cell: any; let cellEle: HTMLElement;
        beforeAll((done: Function) => {
            model = { sheets: [{ ranges: [{ dataSource: defaultData }] }] };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Formatted text update on cell rendering and updating format using the public methods', (done: Function) => {
            sheet = helper.invoke('getActiveSheet');
            expect(JSON.stringify(sheet.rows[1].cells[1])).toBe('{"value":"41684","format":"m/d/yyyy","formattedText":"2/14/2014"}');
            expect(JSON.stringify(sheet.rows[1].cells[2])).toBe('{"value":"0.4823148148148148","format":"h:mm:ss AM/PM","formattedText":"11:34:32 AM"}');
            helper.invoke('selectRange', ['E1:E100']);
            expect(sheet.rows[0].cells[4].formattedText).toBeUndefined();
            expect(sheet.rows[1].cells[4].formattedText).toBeUndefined();
            helper.click(`#${helper.id}_number_format`);
            helper.click(`#${helper.id}_Currency`);
            expect(JSON.stringify(sheet.rows[1].cells[4])).toBe('{"value":20,"format":"$#,##0.00","formattedText":"$20.00"}');
            expect(sheet.rows[0].cells[4].formattedText).toBeUndefined();
            expect(sheet.rows[1].cells[6].formattedText).toBeUndefined();
            helper.invoke('numberFormat', ['0%', 'G1:G100']);
            expect(JSON.stringify(sheet.rows[1].cells[6])).toBe('{"value":1,"format":"0%","formattedText":"100%"}');
            expect(sheet.rows[0].cells[7].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ format: getFormatFromType('Accounting') }, 'H1']);
            expect(sheet.rows[0].cells[7].formattedText).toBe(' Profit ');
            expect(sheet.rows[1].cells[7].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ format: getFormatFromType('Accounting') }, 'H2']);
            expect(JSON.stringify(sheet.rows[1].cells[7])).toBe('{"value":10,"format":"_($* #,##0.00_);_($* (#,##0.00);_($* \\"-\\"??_);_(@_)","formattedText":" $10.00 "}');
            done();
        });
        it('Formatted text update on Editing and changing values using public methods', (done: Function) => {
            sheet = helper.invoke('getActiveSheet');
            helper.edit('E2', '20.278');
            expect(sheet.rows[1].cells[4].formattedText).toBe('$20.28');
            helper.edit('E2', '');
            expect(sheet.rows[1].cells[4].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ value: '200%' }, 'G2']);
            expect(sheet.rows[1].cells[6].formattedText).toBe('200%');
            expect(sheet.rows[79].cells[6].value).toBeUndefined();
            expect(sheet.rows[79].cells[6].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ value: '3' }, 'G80']);
            expect(sheet.rows[79].cells[6].formattedText).toBeUndefined();
            expect(sheet.rows[11].cells[7]).toBeUndefined();
            helper.invoke('updateCell', [{ format: getFormatFromType('Accounting') }, 'H12']);
            expect(sheet.rows[11].cells[7].value).toBeUndefined();
            expect(sheet.rows[11].cells[7].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ value: '3' }, 'H80']);
            expect(sheet.rows[79].cells[7].value).toBe(3);
            expect(sheet.rows[79].cells[7].formattedText).toBeUndefined();
            helper.invoke('numberFormat', [getFormatFromType('Accounting'), 'H80']);
            expect(sheet.rows[79].cells[7].formattedText).toBe(' $3.00 ');
            helper.invoke('updateCell', [{ value: '2.56' }, 'H79']);
            expect(sheet.rows[78].cells[7].formattedText).toBeUndefined();
            helper.invoke('numberFormat', ['_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)', 'H79:H80']);
            expect(sheet.rows[78].cells[7].formattedText).toBe(' ');
            expect(sheet.rows[79].cells[7].formattedText).toBe(' ');
            helper.invoke('updateCell', [{ format: '$#,##0.00_);($#,##0.00)' }, 'H79']);
            expect(sheet.rows[78].cells[7].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ value: '10.45' }, 'H80']);
            expect(sheet.rows[79].cells[7].formattedText).toBeUndefined();
            helper.invoke('updateCell', [{ format: '$#,##0.00_);($#,##0.00)' }, 'H80']);
            expect(sheet.rows[79].cells[7].formattedText).toBeUndefined();
            done();
        });
        it('Formatted cells update when changing the allowNumberFormatting property', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const cellEle: HTMLElement = helper.invoke('getCell', [1, 1]);
            expect(cellEle.textContent).toBe('2/14/2014');
            const numFormatBtn: HTMLElement = helper.getElement(`#${helper.id}_number_format`);
            expect(numFormatBtn.parentElement.classList).not.toContain('e-overlay');
            spreadsheet.allowNumberFormatting = false;
            spreadsheet.dataBind();
            expect(cellEle.textContent).toBe('41684');
            expect(numFormatBtn.parentElement.classList).toContain('e-overlay');
            spreadsheet.allowNumberFormatting = true;
            spreadsheet.dataBind();
            expect(cellEle.textContent).toBe('2/14/2014');
            expect(numFormatBtn.parentElement.classList).not.toContain('e-overlay');
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
            it('EJ2-883693 -> Custom number format is not working properly like MS Excel when the format contains text with date time format in it', (done: Function) => {
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
            it('EJ2-855322 -> Date format gets changed when attempting to edit the data and saving it', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.invoke('updateCell', [{ value: '23/01/1928', format: 'dd/MM/yyyy' }, 'A1']);
                const spreadsheet: any = helper.getInstance();
                // expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('10250');
                const td: HTMLElement = helper.invoke('getCell', [0, 0]);
                // expect(td.textContent).toEqual('23/01/1928');
                helper.invoke('startEdit');
                spreadsheet.notify(
                    'editOperation', { action: 'refreshEditor', value: '1/23/1920', refreshCurPos: true, refreshFormulaBar: true,
                        refreshEditorElem: true });
                const editEle: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
                // expect(editEle.textContent).toBe('1/23/1920');
                const formulaBar: HTMLInputElement = helper.getElement('#' + helper.id + '_formula_input');
                // expect(formulaBar.value).toEqual('1/23/1920');
                helper.invoke('endEdit');
                setTimeout(() => {
                    // expect(td.textContent).toEqual('23/01/1920');
                    helper.invoke('selectRange', ['A1']);
                    helper.invoke('updateCell', [{ value: '23-01-1928', format: 'dd-MM-yyyy' }, 'A1']);
                    // expect(td.textContent).toEqual('23-01-1928');
                    // expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('10250');
                    helper.invoke('startEdit');
                    spreadsheet.notify(
                        'editOperation', { action: 'refreshEditor', value: '1/23/1920', refreshCurPos: true, refreshFormulaBar: true,
                            refreshEditorElem: true });
                    // expect(editEle.textContent).toBe('1/23/1920');
                    // expect(formulaBar.value).toEqual('1/23/1920');
                    helper.invoke('endEdit');
                    setTimeout(() => {
                        //expect(td.textContent).toEqual('23-01-1920');
                        done();
                    });
                });
            });
            it('SF-354174 -> Showing formatted text in the editor and updating based on the format (dd/MM/yyyy or dd-MM-yyyy)', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                const cellEditHandler: any = spreadsheet.cellEdit;
                spreadsheet.cellEdit = (args: any): void => {
                    args.showFormattedText = true;
                };
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
                focus(cellEle);
                const coords: ClientRect = cellEle.getBoundingClientRect();
                helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, cellEle);
                setTimeout(() => {
                    const editEle: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
                    expect(editEle.textContent).toBe('23-01-1920');
                    const formulaBar: HTMLInputElement = helper.getElement('#' + helper.id + '_formula_input');
                    expect(formulaBar.value).toBe('1/23/1920');
                    spreadsheet.notify(
                        'editOperation', {
                            action: 'refreshEditor', value: '27-08-1994', refreshCurPos: true, refreshFormulaBar: true,
                            refreshEditorElem: true });
                    expect(editEle.textContent).toBe('27-08-1994');
                    expect(formulaBar.value).toBe('27-08-1994');
                    helper.invoke('endEdit');
                    const cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
                    expect(cell.value).toBe('34573');
                    expect(cell.format).toBe('dd-MM-yyyy');
                    expect(cellEle.textContent).toBe('27-08-1994');
                    helper.invoke('numberFormat', ['dd/MM/yyyy', 'A1']);
                    helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, cellEle);
                    setTimeout((): void => {
                        expect(editEle.textContent).toBe('27/08/1994');
                        spreadsheet.notify(
                            'editOperation', {
                            action: 'refreshEditor', value: '26/07/2023', refreshCurPos: true, refreshFormulaBar: true,
                            refreshEditorElem: true });
                        expect(editEle.textContent).toBe('26/07/2023');
                        expect(formulaBar.value).toBe('26/07/2023');
                        helper.invoke('endEdit');
                        expect(cell.value).toBe('45133');
                        expect(cell.format).toBe('dd/MM/yyyy');
                        expect(cellEle.textContent).toBe('26/07/2023');
                        helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, cellEle);
                        setTimeout((): void => {
                            expect(editEle.textContent).toBe('26/07/2023');
                            spreadsheet.notify(
                                'editOperation', {
                                action: 'refreshEditor', value: '3/2024', refreshCurPos: true, refreshFormulaBar: true,
                                refreshEditorElem: true });
                            expect(editEle.textContent).toBe('3/2024');
                            expect(formulaBar.value).toBe('3/2024');
                            helper.invoke('endEdit');
                            expect(cell.value).toBe('45352');
                            expect(cell.format).toBe('dd/MM/yyyy');
                            expect(cellEle.textContent).toBe('01/03/2024');
                            spreadsheet.cellEdit = cellEditHandler;
                            done();
                        });
                    });
                });
            });
            it ('Checking custom fill with merge and after the viewport cells', (done: Function) => {
                helper.invoke('merge', ['A10:B10']);
                helper.invoke('updateCell', [{ value: '-457', format: 'm/d/yyyy' }, 'A10']);
                const cellEle: HTMLElement = helper.invoke('getCell', [9, 0]);
                expect(cellEle.querySelector('.e-fill')).not.toBeNull();
                expect(cellEle.textContent).toBe('################');
                helper.invoke('updateCell', [{ value: '-10' }, 'A100']);
                helper.invoke('numberFormat', ['m/d/yyyy', 'A100']);
                expect(helper.invoke('getCell', [99, 0])).toBeUndefined();
                done();
            });
        });
        describe('EJ2-839539, EJ2-911541 ->', () => {
            beforeAll((done: Function) => {
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
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Formula cell that refers another formula valued cell in different sheet throws error while rendering in spreadsheet', (done: Function) => {
                expect(helper.invoke('getCell', [0, 0]).textContent).not.toBe('#VALUE!');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('22314666');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('22314666');
                done();
            });
            it('Custom date format changes to Short Date when copying from Excel to spreadsheet when date starts with 31', (done: Function) => {
                helper.edit('C1', '31-Jan-24');
                helper.edit('C2', '31-Feb-24');
                helper.edit('C3', '31-Mar-24');
                helper.edit('C4', '31-Apr-24');
                helper.edit('C5', '31-May-24');
                helper.edit('C6', '31-Jun-24');
                helper.edit('C7', '31-Jul-24');
                helper.edit('C8', '31-Aug-24');
                helper.edit('C9', '31-Sep-24');
                helper.edit('C10', '31-Oct-24');
                helper.edit('C11', '31-Nov-24');
                helper.edit('C12', '31-Dec-24');
                expect(helper.getInstance().sheets[0].rows[0].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[1].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[2].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[3].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[4].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[5].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[6].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[7].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[8].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[9].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[10].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[11].cells[2].format).toBe('d-mmm-yy');
                expect(helper.getInstance().sheets[0].rows[0].cells[2].formattedText).toBe('31-Jan-24');
                expect(helper.getInstance().sheets[0].rows[1].cells[2].formattedText).toBe('2-Mar-24');
                expect(helper.getInstance().sheets[0].rows[2].cells[2].formattedText).toBe('31-Mar-24');
                expect(helper.getInstance().sheets[0].rows[3].cells[2].formattedText).toBe('1-May-24');
                expect(helper.getInstance().sheets[0].rows[4].cells[2].formattedText).toBe('31-May-24');
                expect(helper.getInstance().sheets[0].rows[5].cells[2].formattedText).toBe('1-Jul-24');
                expect(helper.getInstance().sheets[0].rows[6].cells[2].formattedText).toBe('31-Jul-24');
                expect(helper.getInstance().sheets[0].rows[7].cells[2].formattedText).toBe('31-Aug-24');
                expect(helper.getInstance().sheets[0].rows[8].cells[2].formattedText).toBe('1-Oct-24');
                expect(helper.getInstance().sheets[0].rows[9].cells[2].formattedText).toBe('31-Oct-24');
                expect(helper.getInstance().sheets[0].rows[10].cells[2].formattedText).toBe('1-Dec-24');
                expect(helper.getInstance().sheets[0].rows[11].cells[2].formattedText).toBe('31-Dec-24');
                done();
            });
        });
        describe('EJ2-844735, EJ2-846521, EJ2-910847 ->', () => {
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
            it('Script error occurs when parsing a custom long date format for a cell that contains a string value', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.edit('C1','01/31/2024');
                helper.edit('C2','01/14/2024');
                helper.edit('C3','01/15/2024');
                helper.edit('C4','01/16/2024');
                expect(spreadsheet.sheets[0].rows[0].cells[2].format).toBe('m/d/yyyy');
                expect(spreadsheet.sheets[0].rows[1].cells[2].format).toBe('m/d/yyyy');
                expect(spreadsheet.sheets[0].rows[2].cells[2].format).toBe('m/d/yyyy');
                expect(spreadsheet.sheets[0].rows[3].cells[2].format).toBe('m/d/yyyy');
                expect(spreadsheet.sheets[0].rows[0].cells[2].formattedText).toBe('1/31/2024'); 
                expect(spreadsheet.sheets[0].rows[1].cells[2].formattedText).toBe('1/14/2024'); 
                expect(spreadsheet.sheets[0].rows[2].cells[2].formattedText).toBe('1/15/2024'); 
                expect(spreadsheet.sheets[0].rows[3].cells[2].formattedText).toBe('1/16/2024');
                spreadsheet.numberFormat('dddd/dd/MM/yy','C1:C4');
                expect(spreadsheet.sheets[0].rows[0].cells[2].format).toBe('dddd/dd/MM/yy');
                expect(spreadsheet.sheets[0].rows[1].cells[2].format).toBe('dddd/dd/MM/yy');
                expect(spreadsheet.sheets[0].rows[2].cells[2].format).toBe('dddd/dd/MM/yy');
                expect(spreadsheet.sheets[0].rows[3].cells[2].format).toBe('dddd/dd/MM/yy');
                expect(spreadsheet.sheets[0].rows[0].cells[2].formattedText).toBe('Wednesday/31/01/24'); 
                expect(spreadsheet.sheets[0].rows[1].cells[2].formattedText).toBe('Sunday/14/01/24'); 
                expect(spreadsheet.sheets[0].rows[2].cells[2].formattedText).toBe('Monday/15/01/24'); 
                expect(spreadsheet.sheets[0].rows[3].cells[2].formattedText).toBe('Tuesday/16/01/24');
                spreadsheet.numberFormat('dddd, MM/dd/yyyy','C1:C4');
                expect(spreadsheet.sheets[0].rows[0].cells[2].format).toBe('dddd, MM/dd/yyyy');
                expect(spreadsheet.sheets[0].rows[1].cells[2].format).toBe('dddd, MM/dd/yyyy');
                expect(spreadsheet.sheets[0].rows[2].cells[2].format).toBe('dddd, MM/dd/yyyy');
                expect(spreadsheet.sheets[0].rows[3].cells[2].format).toBe('dddd, MM/dd/yyyy');
                expect(spreadsheet.sheets[0].rows[0].cells[2].formattedText).toBe('Wednesday, 01/31/2024'); 
                expect(spreadsheet.sheets[0].rows[1].cells[2].formattedText).toBe('Sunday, 01/14/2024'); 
                expect(spreadsheet.sheets[0].rows[2].cells[2].formattedText).toBe('Monday, 01/15/2024'); 
                expect(spreadsheet.sheets[0].rows[3].cells[2].formattedText).toBe('Tuesday, 01/16/2024');
                spreadsheet.numberFormat('ddd/dd/MM/yyyy','C1:C4');
                expect(spreadsheet.sheets[0].rows[0].cells[2].format).toBe('ddd/dd/MM/yyyy');
                expect(spreadsheet.sheets[0].rows[1].cells[2].format).toBe('ddd/dd/MM/yyyy');
                expect(spreadsheet.sheets[0].rows[2].cells[2].format).toBe('ddd/dd/MM/yyyy');
                expect(spreadsheet.sheets[0].rows[3].cells[2].format).toBe('ddd/dd/MM/yyyy');
                expect(spreadsheet.sheets[0].rows[0].cells[2].formattedText).toBe('Wed/31/01/2024'); 
                expect(spreadsheet.sheets[0].rows[1].cells[2].formattedText).toBe('Sun/14/01/2024'); 
                expect(spreadsheet.sheets[0].rows[2].cells[2].formattedText).toBe('Mon/15/01/2024'); 
                expect(spreadsheet.sheets[0].rows[3].cells[2].formattedText).toBe('Tue/16/01/2024');
                done();
            });
        });
        describe('EJ2-898605 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{
                        rows: [{ index: 0, cells: [{ value: '001-22-02' }, { value: '001-23-00' }, { value: '001-24-00' }, { value: '002-20-00' }, { value: '01-12-2001' }] }]
                    }]
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Text value is convert into date format values when cell text content contain "-" character', (done: Function) => {
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('001-22-02');
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('001-23-00');
                expect(helper.invoke('getCell', [0, 2]).textContent).toBe('001-24-00');
                expect(helper.invoke('getCell', [0, 3]).textContent).toBe('002-20-00');
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('1/12/2001');
                expect(helper.invoke('getCell', [0, 0]).textContent).not.toBe('1/22/2002');
                expect(helper.invoke('getCell', [0, 1]).textContent).not.toBe('1/23/2000');
                expect(helper.invoke('getCell', [0, 2]).textContent).not.toBe('1/24/2000');
                expect(helper.invoke('getCell', [0, 3]).textContent).not.toBe('2/20/2000');
                done();
            });
        });
    });

    describe('Localization is not updated for placeholder and dialog content in the number format -> EJ2-55546 ->', () => {
        beforeAll((done: Function) => {
            L10n.load({
                'de': {
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
                        'CustomFormatPlaceholder': 'Geben Sie ein benutzerdefiniertes Format ein oder wählen Sie es aus',
                        'APPLY':'Sich bewerben',
                    }
                }
            });
            helper.initializeSpreadsheet({ locale: 'de' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Locale is not applied for placeholder and dialog content', (done: Function): void => {
            helper.getElement('#'+helper.id+'_number_format').click();
            helper.getElement('#'+helper.id+'_Custom').click();
            setTimeout(()=> {
                const inputElement: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-input.e-dialog-input');
                expect(inputElement.placeholder).toEqual('Geben Sie ein benutzerdefiniertes Format ein oder wählen Sie es aus');
                done();
            });
        });
        it('Set custom time format with localized content', (done:Function): void => {
            helper.invoke('updateCell', [{ value: '0.37' }, 'A1']);
            helper.invoke('numberFormat', ['h:mm AM/PM', 'A1']);
            expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe(0.37);
            expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('8:52 AM');
            done();
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
    describe('Testing number format with different cases ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply number format without range. ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['D2']);
            helper.invoke('numberFormat', ['0%']);
            expect(spreadsheet.sheets[0].rows[1].cells[3].format).toBe('0%');
            done();
        });
        it('Apply custom number format with @ symbol. ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('numberFormat', ['@ h:mm:ss AM/PM']);
            expect(spreadsheet.sheets[0].rows[1].cells[3].format).toBe('@ h:mm:ss AM/PM');
            done();
        });
        it('Apply custom number format with color values in already text colured cell. ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ fontWeight: 'bold', color: '#00ff00' }, 'A4:E4');
            helper.invoke('numberFormat', ['[Black]', 'A4:E4']);
            spreadsheet.cellFormat({ fontWeight: 'bold', color: '#00ff00' }, 'A4:E4');
            expect(spreadsheet.sheets[0].rows[3].cells[3].format).toBe('[Black]');
            expect(spreadsheet.sheets[0].rows[3].cells[3].format).toBe('[Black]');
            done();
        });
    });
    describe('EJ2-878093, EJ2-907491 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Script error occurs while searching the values in Filter list with allowNumberFormatting as false', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('numberFormat', ['$#,##0_);($#,##0)', 'E1:E200']);
            spreadsheet.allowNumberFormatting = false;
            spreadsheet.dataBind();
            expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[4].value.toString()).toBe('20');
            var cellEle = helper.invoke('getRow', [1]).cells;
            expect(cellEle[4].textContent).toBe('20');
            helper.invoke('applyFilter');
            const td: HTMLElement = helper.invoke('getCell', [0, 4]);
            helper.invoke('getCell', [0, 4]).focus();
            helper.invoke('selectRange', ['E1']);
            td.focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                const searchEle: HTMLInputElement = helper.getElementFromSpreadsheet('.e-searchinput') as HTMLInputElement;
                searchEle.value = '20';
                spreadsheet.notify(refreshCheckbox, { event: { type: 'keyup', target: searchEle } });
                helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                setTimeout(() => {
                    expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[1].cells[4].value.toString()).toBe('20');
                    var cellEle = helper.invoke('getRow', [1]).cells;
                    expect(cellEle[4].textContent).toBe('20');
                    expect(spreadsheet.sheets[spreadsheet.activeSheetIndex].rows[2].hidden).toBe(true);
                    done();
                });
            }, 5);
        });
        it('Issue in NF-dialog before open event', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const previousValue: EmitType<DialogBeforeOpenEventArgs> = spreadsheet.dialogBeforeOpen;
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Custom').click();
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-custom-format-dlg.e-dialog')).toBeNull();
                spreadsheet.dialogBeforeOpen = previousValue;
                done();
            });
        });
    });
    describe('EJ2-880370, EJ2-907823 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Issue in custom formats while selecting the range in reverse direction', (done: Function) => {
            var spreadsheet = helper.getInstance();
            var cellEle: Element[] = helper.invoke('getRow', [1]).cells;
            expect(spreadsheet.sheets[0].rows[1].cells[5].value).toEqual(200);
            expect(cellEle[5].textContent).toBe('200');
            cellEle = helper.invoke('getRow', [5]).cells;
            expect(spreadsheet.sheets[0].rows[5].cells[5].value).toEqual(300);
            expect(cellEle[5].textContent).toBe('300');
            helper.invoke('numberFormat', ['$#,##0.00', 'F8:F2']);
            cellEle = helper.invoke('getRow', [1]).cells;
            expect(spreadsheet.sheets[0].rows[1].cells[5].value).toEqual(200);
            expect(cellEle[5].textContent).toBe('$200.00');
            cellEle = helper.invoke('getRow', [5]).cells;
            expect(spreadsheet.sheets[0].rows[5].cells[5].value).toEqual(300);
            expect(cellEle[5].textContent).toBe('$300.00');
            done();
        });
        it('Data not maintained properly after changing the number format', (done: Function) => {
            var spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['G1:G200']);
            var cellEle: Element[] = helper.invoke('getRow', [4]).cells;
            spreadsheet.applyFilter([{ field: 'G', predicate: 'or', operator: 'greaterthan', value: '10' }], 'G1:G200');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toEqual(true);
                expect(spreadsheet.sheets[0].rows[2].hidden).toEqual(true);
                expect(spreadsheet.sheets[0].rows[3].hidden).toEqual(true);
                helper.invoke('numberFormat', ['$#,##0.00', 'G1:G200']);
                expect(cellEle[6].textContent).toBe('$11.00');
                expect(spreadsheet.sheets[0].rows[4].cells[6].value.toString()).toEqual('11');
                cellEle = helper.invoke('getRow', [6]).cells;
                expect(cellEle[6].textContent).toBe('$13.00');
                expect(spreadsheet.sheets[0].rows[6].cells[6].value.toString()).toEqual('13');
                cellEle = helper.invoke('getRow', [9]).cells;
                expect(cellEle[6].textContent).toBe('$12.00');
                expect(spreadsheet.sheets[0].rows[9].cells[6].value.toString()).toEqual('12');
                helper.invoke('clearFilter');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[1].hidden).toEqual(false);
                    expect(spreadsheet.sheets[0].rows[2].hidden).toEqual(false);
                    expect(spreadsheet.sheets[0].rows[3].hidden).toEqual(false);
                    cellEle = helper.invoke('getRow', [1]).cells;
                    expect(cellEle[6].textContent).toBe('$1.00');
                    expect(spreadsheet.sheets[0].rows[1].cells[6].value.toString()).toEqual('1');
                    cellEle = helper.invoke('getRow', [2]).cells;
                    expect(cellEle[6].textContent).toBe('$5.00');
                    expect(spreadsheet.sheets[0].rows[2].cells[6].value.toString()).toEqual('5');
                    cellEle = helper.invoke('getRow', [3]).cells;
                    expect(cellEle[6].textContent).toBe('$7.00');
                    expect(spreadsheet.sheets[0].rows[3].cells[6].value.toString()).toEqual('7');
                    done();
                }, 5);
            });
        });
        it('EJ2-894943 Time value not displayed correctly ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.getActiveSheet();
            helper.invoke('numberFormat', ['h:mm:ss AM/PM', 'I2']);
            helper.invoke('selectRange', ['I2']);
            helper.edit('I2', '13 :45:25');
            expect(sheet.rows[1].cells[8].format).toBe('h:mm:ss AM/PM');
            let cellEle = helper.invoke('getCell', [1, 8]);
            expect(cellEle.textContent).toBe('1:45:25 PM');
            expect(sheet.rows[1].cells[8].value).toBe('0.5732060185185185');
            helper.edit('I3', '13 :45:25');
            expect(sheet.rows[2].cells[8].format).toBe('h:mm:ss');
            cellEle = helper.invoke('getCell', [2, 8]);
            expect(cellEle.textContent).toBe('13:45:25');
            expect(sheet.rows[2].cells[8].value).toBe('0.5732060185185185');
            helper.edit('I4', '15: 45:25');
            expect(sheet.rows[3].cells[8].format).toBe('h:mm:ss');
            cellEle = helper.invoke('getCell', [3, 8]);
            expect(cellEle.textContent).toBe('15:45:25');
            expect(sheet.rows[3].cells[8].value).toBe('0.6565393518518519');
            helper.edit('I5', '6:56 :23');
            expect(sheet.rows[4].cells[8].format).toBe('h:mm:ss');
            cellEle = helper.invoke('getCell', [4, 8]);
            expect(cellEle.textContent).toBe('6:56:23');
            expect(sheet.rows[4].cells[8].value).toBe('0.2891550925925926');
            helper.edit('I6', '20: 28 :36');
            expect(sheet.rows[5].cells[8].format).toBe('h:mm:ss');
            cellEle = helper.invoke('getCell', [5, 8]);
            expect(cellEle.textContent).toBe('20:28:36');
            expect(sheet.rows[5].cells[8].value).toBe('0.8531944444444445');
            helper.edit('I6', '7 : 56 : 23 ');
            expect(sheet.rows[5].cells[8].format).toBe('h:mm:ss');
            cellEle = helper.invoke('getCell', [5, 8]);
            expect(cellEle.textContent).toBe('7:56:23');
            expect(sheet.rows[5].cells[8].value).toBe('0.3308217592592593');
            helper.edit('I7', '19 : 56');
            expect(sheet.rows[6].cells[8].format).toBe('h:mm');
            cellEle = helper.invoke('getCell', [6, 8]);
            expect(cellEle.textContent).toBe('19:56');
            expect(sheet.rows[6].cells[8].value).toBe('0.8305555555555556');
            helper.edit('I8', '23:17 ');
            expect(sheet.rows[7].cells[8].format).toBe('h:mm');
            cellEle = helper.invoke('getCell', [7, 8]);
            expect(cellEle.textContent).toBe('23:17');
            expect(sheet.rows[7].cells[8].value).toBe('0.9701388888888889');
            done();
        });
    });
});