import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { SpreadsheetModel, SheetModel, getCell, CellModel, showAggregate, Spreadsheet } from '../../../src/index';
import { L10n, setCurrencyCode } from '@syncfusion/ej2-base';

/**
 *  Spreadsheet Number Format spec
 */
describe('Spreadsheet Number Format Module ->', (): void => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('Custom number format ->', (): void => {
        let sheet: any;
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
        it('Automatic custom date format deduction based on cell value checking', (done: Function) => {
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
            expect(cellEle.textContent).toBe('#####');
            expect(cellEle.style.color).toBe('');
            helper.invoke('updateCell', [{ value: '120' }, 'A2']);
            expect(cellEle.textContent).toBe('120');
            expect(cellEle.style.color).toBe('blue');
            helper.invoke('updateCell', [{ value: '111111111111111111111' }, 'A4']);
            expect(sheet.rows[3].cells[0].value).toBe(111111111111111110000);
            expect(helper.invoke('getCell', [3, 0]).textContent).toBe('1.11111E+20');
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
            it('Mistakenly auto detecting as currency format for cell data which contains text with currency number', (done: Function) => {
                helper.edit('D2', 'Claims greater than $2,500');
                const cell: CellModel = helper.getInstance().sheets[0].rows[1].cells[3];
                expect(cell.value).toBe('Claims greater than $2,500');
                const cellEle: HTMLElement = helper.invoke('getCell', [1, 3]);
                expect(cellEle.textContent).toBe('Claims greater than $2,500');
                expect(cell.format).toBeUndefined();
                helper.edit('D2', '$2,500');
                expect(cell.value).toBe('2500');
                expect(cell.format).toBe('$#,##0.00');
                expect(cellEle.textContent).toBe('$2,500.00');
                done();
            });
            it('Currency code change checking', (done: Function) => {
                helper.invoke('numberFormat', ['$#,##0.00', 'B1']);
                const cellEle: HTMLElement = helper.invoke('getCell', [0, 1]);
                expect(cellEle.textContent).toBe('$10.00');
                const spreadsheet: Spreadsheet = helper.getInstance();
                setCurrencyCode('EUR');
                spreadsheet.dataBind();
                expect(cellEle.textContent).toBe('€10.00');
                setCurrencyCode('USD');
                spreadsheet.dataBind();
                expect(cellEle.textContent).toBe('$10.00');
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
                            'Apply': 'Anwenden',
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
                            'CustomFormat': 'Geben Sie das Format ein',
                            'APPLY':'vorgehen',
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
                    expect(inputElement.placeholder).toEqual('Geben Sie das Format ein');
                    done();
                });  
            });
        });
    });
});