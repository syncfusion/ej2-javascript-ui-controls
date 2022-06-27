import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { SpreadsheetModel, SheetModel, getCell, CellModel } from '../../../src/index';

/**
 *  Spreadsheet Number Format spec
 */
describe('Spreadsheet Number Format Module ->', (): void => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('Custom date format ->', (): void => {
        let sheet: SheetModel;
        beforeAll((done: Function) => {
            model = {
                sheets: [{ rows: [{ cells: [{ value: 'Mar-2020' }, { value: 'Apr-10' }, { value: '2020-May' }, { value: '22-jun' },
                { value: '13-Jul-2020' }] }] }]
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Automatic format deduction based on cell value checking', (done: Function) => {
            sheet = helper.invoke('getActiveSheet');
            const cells: CellModel[] = sheet.rows[0].cells;
            const cellEle: Element[] = helper.invoke('getRow', [0]).cells;
            expect(cells[0].value).toBe('43891');
            expect(cells[0].format).toBe('MMM-yy');
            expect(cellEle[0].textContent).toBe('Mar-20');
            expect(cells[1].value).toBe('44661');
            expect(cells[1].format).toBe('dd-MMM');
            expect(cellEle[1].textContent).toBe('10-Apr');
            expect(cells[2].value).toBe('43952');
            expect(cells[2].format).toBe('MMM-yy');
            expect(cellEle[2].textContent).toBe('May-20');
            expect(cells[3].value).toBe('44734');
            expect(cells[3].format).toBe('dd-MMM');
            expect(cellEle[3].textContent).toBe('22-Jun');
            expect(cells[4].value).toBe('44025');
            expect(cells[4].format).toBe('d-MMM-yy');
            expect(cellEle[4].textContent).toBe('13-Jul-20');
            done();
        });
    });
    describe('CR Issues ->', (): void => {
        describe('SF-343605, EJ2-56678, SF-366825 ->', () => {
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
                expect(getCell(4, 0, sheet).value).toBe('$11,111,233');

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
                expect(getCell(6, 0, sheet).value).toBe('-10.23499');
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
        });
    });
});