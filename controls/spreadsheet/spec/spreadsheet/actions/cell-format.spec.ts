import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { SheetModel, getRangeAddress, Spreadsheet, getCell, CellModel } from '../../../src/index';
import { L10n } from '@syncfusion/ej2-base';
import { SpreadsheetModel } from '../../../src/spreadsheet/index';

describe('Cell Format ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('API ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells:[{ style: { fontSize: '9pt', fontFamily: 'Georgia', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' } }] }], selectedRange: 'B1:B1' }], cellStyle: { fontSize: '14pt', fontFamily: 'Courier', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(td.style.fontSize).toBe('9pt');
            expect(td.style.fontFamily).toBe('Georgia');
            expect(td.style.fontWeight).toBe('normal');
            expect(td.style.fontStyle).toBe('normal');
            expect(td.style.textAlign).toBe('left');

            td = helper.invoke('getCell', [0, 1]);
            expect(td.style.fontSize).toBe('14pt');
            expect(td.style.fontFamily).toBe('Courier');
            expect(td.style.fontWeight).toBe('bold');
            expect(td.style.fontStyle).toBe('italic');
            expect(td.style.textAlign).toBe('center');
            done();
        });
        it('Checking property change', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.allowCellFormatting).toBeTruthy();
            const boldBtn: HTMLElement = helper.getElement(`#${helper.id}_bold`);
            expect(boldBtn.classList).toContain('e-active');
            expect(boldBtn.parentElement.classList).not.toContain('e-overlay');
            spreadsheet.allowCellFormatting = false;
            spreadsheet.dataBind();
            expect(spreadsheet.allowCellFormatting).toBeFalsy();
            expect(boldBtn.classList).not.toContain('e-active');
            expect(boldBtn.parentElement.classList).toContain('e-overlay');
            let tdEle: HTMLElement = helper.invoke('getCell', [0, 1]);
            expect(tdEle.style.fontWeight).toBe('');
            helper.invoke('selectRange', ['A1']);
            expect(boldBtn.classList).not.toContain('e-active');
            helper.invoke('selectRange', ['B1']);
            expect(boldBtn.classList).not.toContain('e-active');
            spreadsheet.allowCellFormatting = true;
            spreadsheet.dataBind();
            expect(boldBtn.classList).toContain('e-active');
            expect(boldBtn.parentElement.classList).not.toContain('e-overlay');
            expect(tdEle.style.fontWeight).toContain('bold');
            helper.invoke('selectRange', ['A1']);
            expect(boldBtn.classList).not.toContain('e-active');
            helper.invoke('selectRange', ['B1']);
            expect(boldBtn.classList).toContain('e-active');
            done();
        });
    });

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Border', (done: Function) => {
            helper.invoke('cellFormat', [{ border: '1px solid #000' }, 'A1']);
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(td.style.borderWidth).toBe('1px');
            expect(td.style.borderStyle).toBe('solid');
            expect(td.style.borderColor).toBe('rgb(0, 0, 0)');

            helper.invoke('cellFormat', [{ border: '1px solid red' }, 'C1']);
            td = helper.invoke('getCell', [0, 2]);
            expect(td.style.borderTop).toBe('1px solid red');
            expect(td.style.borderRight).toBe('1px solid red');
            expect(td.style.borderBottom).toBe('1px solid red');
            expect(td.style.borderLeft).toBe('');
            expect(helper.invoke('getCell', [0, 1]).style.borderRight).toBe('1px solid red');

            helper.invoke('cellFormat', [{ border: '2px solid #eb4034' }, 'B5']);
            td = helper.invoke('getCell', [4, 1]);
            expect(td.style.borderTop).toBe('');
            expect(td.style.borderLeft).toBe('');
            expect(td.style.borderRight).toBe('2px solid rgb(235, 64, 52)');
            expect(td.style.borderBottom).toBe('2px solid rgb(235, 64, 52)');
            expect(helper.invoke('getCell', [3, 1]).style.borderBottom).toBe('2px solid rgb(235, 64, 52)');
            expect(helper.invoke('getCell', [4, 0]).style.borderRight).toBe('2px solid rgb(235, 64, 52)');
            done();
        });

        it('Border are not removed after undo when selection is in reverse', (done: Function) => {
            helper.invoke('selectRange', ['D3:C2']);
            helper.click('#spreadsheet_borders');
            helper.click('.e-borders-menu ul li:nth-child(5)');
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [1, 3]).style.borderRight).toBe('');
            expect(helper.invoke('getCell', [2, 3]).style.borderRight).toBe('');
            expect(helper.invoke('getCell', [2, 3]).style.borderBottom).toBe('');
            expect(helper.invoke('getCell', [2, 2]).style.borderBottom).toBe('');
            done();
        });
        it('Strike through option is not working as expected, when Underline text decoration was applied', (done: Function) => {
            helper.invoke('selectRange', ['B1:B10']);
            const sheet = helper.getInstance().sheets[0];
            helper.invoke('cellFormat', [{ textDecoration: 'Underline' }, 'Sheet1!B1:B10']);
            expect(sheet.rows[0].cells[1].style.textDecoration).toBe('Underline');
            expect(sheet.rows[1].cells[1].style.textDecoration).toBe('Underline');
            expect(sheet.rows[2].cells[1].style.textDecoration).toBe('Underline');
            expect(sheet.rows[3].cells[1].style.textDecoration).toBe('Underline');
            helper.click(`#${helper.id}_line-through`);
            expect(sheet.rows[0].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[1].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[2].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[3].cells[1].style.textDecoration).toBe('underline line-through');
            helper.invoke('cellFormat', [{ textDecoration: 'Line-through' }, 'Sheet1!B1:B10']);
            expect(sheet.rows[0].cells[1].style.textDecoration).toBe('Line-through');
            expect(sheet.rows[1].cells[1].style.textDecoration).toBe('Line-through');
            expect(sheet.rows[2].cells[1].style.textDecoration).toBe('Line-through');
            expect(sheet.rows[3].cells[1].style.textDecoration).toBe('Line-through');
            helper.click(`#${helper.id}_underline`);
            expect(sheet.rows[0].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[1].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[2].cells[1].style.textDecoration).toBe('underline line-through');
            expect(sheet.rows[3].cells[1].style.textDecoration).toBe('underline line-through');
            done();
        });
    });

    describe('Set Border Method->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('setBorder->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setBorder({border: '1px solid #000000' }, 'A1');
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(td.style.borderWidth).toBe('1px');
            expect(td.style.borderStyle).toBe('solid');
            expect(td.style.borderColor).toBe('rgb(0, 0, 0)');
    
            spreadsheet.setBorder({borderTop: '1px solid red' }, 'A2');
            expect(helper.getInstance().sheets[0].rows[1].cells[0].style.borderTop).toBe('1px solid red');
            expect(helper.getInstance().sheets[0].rows[1].cells[0].style.borderBottom).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[1].cells[0].style.borderRight).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[1].cells[0].style.borderLeft).toBeUndefined;

            spreadsheet.setBorder({borderLeft: '1px solid red' }, 'C3');
            expect(helper.getInstance().sheets[0].rows[2].cells[2].style.borderTop).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[2].cells[2].style.borderBottom).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[2].cells[2].style.borderRight).toBeUndefined;
            expect(helper.getInstance().sheets[0].rows[2].cells[2].style.borderLeft).toBe('1px solid red');

            spreadsheet.setBorder({border: '3px solid red' }, 'D2:G5');
            td = helper.invoke('getCell', [2, 3]);
            expect(td.style.borderRight).toBe('3px solid red');
            expect(td.style.borderBottom).toBe('3px solid red');
            expect(td.style.borderTop).toBe('');
            expect(td.style.borderLeft).toBe('');
            expect(helper.getInstance().sheets[0].rows[2].cells[3].style.borderBottom).toBe('3px solid red');
            expect(helper.getInstance().sheets[0].rows[2].cells[3].style.borderRight).toBe('3px solid red');
            expect(helper.getInstance().sheets[0].rows[2].cells[3].style.borderTop).toBe('3px solid red');
            expect(helper.getInstance().sheets[0].rows[2].cells[3].style.borderLeft).toBe('3px solid red');
            done();
        });

        it('Apply Top Border after Hidden Rows->', (done: Function) => {
            helper.invoke('hideRow', [8]);
            expect(helper.getInstance().sheets[0].rows[8].hidden).toBeTruthy();
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setBorder({borderTop: '1px solid #000000' }, 'A10');
            expect(helper.getInstance().sheets[0].rows[9].cells[0].style.borderTop).toBe('1px solid #000000');
            done();
        });

        it('setRowHeight Method->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(40, 2);
            expect(helper.invoke('getRow', [2]).style.height).toBe('40px');
            expect(helper.getInstance().sheets[0].rows[2].height).toBe(40);
            done();
        });

        it('Apply Redo after applying Horizontal Border->', (done: Function) => {
            helper.invoke('selectRange', ['D7']);
            helper.getElement('#' + helper.id + '_borders').click();
            helper.getElement('.e-menu-item[aria-label="Horizontal Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.borderTop).toBe('1px solid #000000');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.borderBottom).toBe('1px solid #000000');
            helper.click('#spreadsheet_undo');
            helper.click('#spreadsheet_redo');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.borderTop).toBe('1px solid #000000');
            expect(helper.getInstance().sheets[0].rows[6].cells[3].style.borderBottom).toBe('1px solid #000000');
            done();
        });
    });

    describe('Clear Method->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Clear Wrap->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.wrap('A1', true);
            spreadsheet.clear({type: 'Clear Formats', range: 'A1'});
            expect(helper.getInstance().sheets[0].rows[0].cells[0].classList).not.toContain('e-wraptext');
            done();
        });

        it('Clear Conditional Formatting->', (done: Function) => {
            helper.getInstance().workbookConditionalFormattingModule.setCFRule({ cfModel: { type: 'BlueDataBar', range: 'H2:H11' }, isAction: true });
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.clear({type: 'Clear Formats', range: 'H2:H11'});
            expect(helper.invoke('getCell', [1, 7]).querySelector('.e-databar')).toBeNull();
            expect(helper.invoke('getCell', [9, 7]).querySelector('.e-databar')).toBeNull();
            done();
        });

        it('Clear Formula->', (done: Function) => {
            helper.edit('H12', '=SUM(H2:H11)');
            expect(helper.getInstance().sheets[0].rows[11].cells[7].formula).toEqual('=SUM(H2:H11)');
            expect(helper.getInstance().sheets[0].rows[11].cells[7].value).toEqual(554);
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.clear({type: 'Clear All', range: 'H12'});
            expect(helper.getInstance().sheets[0].rows[11].cells[7].formula).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[11].cells[7].textContent).toBeUndefined();
            done();
        });

        it('Merged cell with small Row Height ->', (done: Function) => {
            helper.invoke('setRowHeight', [12, 0]);
            helper.invoke('merge', ['A1:B1']);
            expect(helper.getInstance().sheets[0].rows[0].height).toBe(12);
            expect(helper.getInstance().sheets[0].rows[0].cells[0].rowSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[0].cells[0].colSpan).toBe(2);
            done();
        });

        it('Conditional Formatting Size updated depends on Font Size ->', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H3' }]);
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            const cell: HTMLElement = helper.invoke('getCell', [2, 7]);
            expect(cell.style.fontSize).toBe('');
            helper.invoke('cellFormat', [{ fontSize: '14pt' }, 'Sheet1!H3']);
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('22px');
            expect(helper.invoke('getCell', [2, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
            expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
            expect(cell.style.fontSize).toBe('14pt');
            done();
        });
    });

    describe('Color Picker ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                actionBegin(args: any) {
                    if (args.action === 'format') {
                      args.args.eventArgs.cancel = true;
                    }
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Switch between color picker to color palatte ->', (done: Function) => {
            helper.click('_fill_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup .e-mode-switch-btn');
            setTimeout(() => {
                helper.click('.e-colorpicker-popup .e-mode-switch-btn'); 
                done();
            });
        });
        it('Cancelling cell fill color ->', (done: Function) => {
            helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#ffff00ff"]');
            expect(helper.invoke('getCell', [0, 0]).style.backgroundColor).toBe('');
            done();
        });
        it('Cancelling text fill color ->', (done: Function) => {
            helper.click('_font_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#ff0000ff"]');
            expect(helper.invoke('getCell', [0, 0]).style.color).toBe('');
            done();
        });
    });

    describe('Apply border, image and chart with cell formatting->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply cell format with merged cell and small sized row->', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(15, 0);
            helper.invoke('merge', ['A1:B1']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[0].colSpan).toBe(2);
                spreadsheet.cellFormat({ fontStyle: 'italic'});
                spreadsheet.cellFormat({ fontWeight: 'bold'});
                expect(helper.getInstance().sheets[0].rows[0].cells[0].style.fontStyle).toBe('italic');
                expect(helper.getInstance().sheets[0].rows[0].cells[0].style.fontWeight).toBe('bold');
                helper.invoke('selectRange', ['A11']);
                done();
            });
        });
        it('Alt enter', (done: Function) => {
            helper.triggerKeyNativeEvent(113);
            const editor: HTMLElement = helper.getElement('#' + helper.id + '_edit');
            editor.focus();
            editor.textContent = 'Sridhar';
            helper.triggerKeyNativeEvent(13, false, false, null, 'keyup', true);
            helper.triggerKeyNativeEvent(13);
            expect(helper.getInstance().sheets[0].rows[10].height).toBe(38);
            const cell: CellModel = helper.getInstance().sheets[0].rows[10].cells[0];
            expect(cell.wrap).toBeTruthy();
            expect(cell.value).toBe('Sridhar\n ');
            const cellEle: HTMLElement = helper.invoke('getCell', [10, 0]);
            expect(cellEle.classList).toContain('e-wraptext');
            expect(cellEle.textContent).toBe('Sridhar\n ');
            expect(cellEle.parentElement.style.height).toBe('38px');
            done();
        });
        it('Apply all border with alt + enter edited cell->', (done: Function) => {
            helper.invoke('selectRange', ['A11']);
            setTimeout(() => {
                helper.invoke('selectRange', ['A11']);
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="All Borders"]').click();
                expect(helper.getInstance().sheets[0].rows[10].cells[0].style.borderRight).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[0].rows[10].cells[0].style.borderBottom).toBe('1px solid #000000');
                done();
            });
        });
        it('Apply top border in below merged cell->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.getElement('#' + helper.id + '_borders').click();
            helper.getElement('.e-menu-item[aria-label="Top Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[1].cells[0].style.borderTop).toBe('1px solid #000000');
            done();
        });
        it('Delete image with clear all option->', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({options: { src: 'https://www.w3schools.com/images/w3schools_green.jpg'}, range: 'C3', isPublic: true });
            const imageId: string = helper.getInstance().sheets[0].rows[2].cells[2].image[0].id;
            helper.getElement('#' + helper.id + '_clear').click();
            helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
            expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
            done();
        });
        it('Delete chart with clear all option->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_clear').click();
            helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
            const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
            expect(chart).toBeNull();
            done();
        });
    });

    describe('CR-Issues ->', () => {
        describe('fb22572, EJ2-62186 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ cellStyle: { fontSize: '8pt' }, sheets: [{ rows: [{ index: 3, cells:
                    [{ index: 3, value: '10-0347d' }] }], selectedRange: 'D4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell size is getting changed after applying border', (done: Function) => {
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="Outside Borders"]').click();
                expect(helper.getInstance().sheets[0].rows[2]).toBeNull();
                expect(helper.getInstance().sheets[0].rows[3].height).toBeUndefined();
                expect(helper.invoke('getRow', [2]).style.height).toBe('20px');
                expect(helper.invoke('getRow', [3]).style.height).toBe('20px');
                done();
            });
            it('Data Corruption while scrolling with larger data', (done: Function) => {
                let sheets: SheetModel[] = helper.getInstance().sheets;
                expect(getCell(3, 3, sheets[0]).value).toBe('10-0347d');
                expect(getCell(3, 3, sheets[0]).format).toBeUndefined();
                expect(helper.invoke('getCell', [3, 3]).textContent).toBe('10-0347d');
                done();
            });
        });
        describe('fb21556, fb21625 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'Item Name' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('When wrap text is applied to the cell, horizontal/vertical alignment is not working properly', (done: Function) => {
            //     helper.invoke('setRowHeight', [100]);
            //     helper.invoke('setColWidth', [150]);
            //     helper.getElement('#' + helper.id + '_wrap').click();
            //     helper.getElement('#' + helper.id + '_vertical_align').click();
            //     helper.getElement('#' + helper.id + '_vertical_align-popup .e-item:nth-child(2)').click();
            //     const wrapContent: HTMLElement = helper.invoke('getCell', [0, 0]).querySelector('.e-wrap-content');
            //     expect(getComputedStyle(wrapContent).bottom).toBe('33px');
            //     expect(getComputedStyle(wrapContent).transform).toBe('matrix(1, 0, 0, 1, 0, -8.5)');
            //     expect(getComputedStyle(wrapContent).left).toBe('0px');
            //     helper.getElement('#' + helper.id + '_vertical_align').click();
            //     helper.getElement('#' + helper.id + '_vertical_align-popup .e-item').click();
            //     expect(getComputedStyle(wrapContent).transform).toBe('none');
            //     expect(getComputedStyle(wrapContent).top).toBe('0px');
            //     helper.getElement('#' + helper.id + '_wrap').click();
            //     done();
            // });
        });
        describe('SF-356947 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ index: 3, height: 30, customHeight: true, cells: [{ index: 3, value: 'test' }] }],
                    selectedRange: 'D4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selection issue while apply font size as 72pt for whole column with custom height enabled', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [3, 3]);
                expect(cell.style.lineHeight).toBe('');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.lastElementChild.click();
                expect(cell.style.fontSize).toBe('72pt');
                expect(cell.style.lineHeight).toBe('29px');
                expect(helper.invoke('getRow', [3]).style.height).toBe('30px');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.children[5].click();
                expect(cell.style.fontSize).toBe('14pt');
                expect(cell.style.lineHeight).toBe('');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.children[13].click();
                expect(cell.style.fontSize).toBe('36pt');
                expect(cell.style.lineHeight).toBe('29px');
                helper.getElement('#' + helper.id + '_wrap').click();
                expect(cell.style.lineHeight).toBe('');
                expect(cell.querySelector('.e-wrap-content')).not.toBeNull();
                done();
            });
        });
        describe('EJ2-57647 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Used range not updated while Clear entire data.', (done: Function) => {
                let spreadsheet: Spreadsheet = helper.getInstance();
                let sheet: SheetModel = spreadsheet.sheets[0];
                spreadsheet.clear({type: 'Clear All', range: getRangeAddress([0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex])});
                setTimeout(() => {
                    expect(sheet.usedRange.rowIndex).toEqual(0);
                    expect(sheet.usedRange.colIndex).toEqual(0);
                    done();
                });
            });
            it('Used range not updated while delete entire data.', (done: Function) => {
                let spreadsheet: Spreadsheet = helper.getInstance();
                let sheet: SheetModel = spreadsheet.sheets[0];
                spreadsheet.selectRange(getRangeAddress([0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex]));
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(sheet.usedRange.rowIndex).toEqual(0);
                    expect(sheet.usedRange.colIndex).toEqual(0);
                    done();
                });
            });
        });
        describe('EJ2-49588, EJ2-46530, EJ2-51216, EJ2-52952, EJ2-53948, EJ2-53048, EJ2-54306, EJ2-56161, EJ2-51575, EJ2-50222 ->',() => {
            beforeAll((done: Function) =>{
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ index: 3, cells:[{ index: 3, value: 'Style' }] }], selectedRange: 'D4' }, 
                { rows: [{ index: 3, cells: [{ index: 3, style: { fontSize: '14pt', fontFamily: 'Georgia', fontWeight: 'bold' } }] }], selectedRange: 'D4' },
                { columns:[{ width: 200 }, { width: 150 }, { width: 350}], rows: [{ cells: [{ value: 'CASOS DE PRUEBAS GENERALES PARA M�DULO' }] }, 
                { cells: [{ }] },
                { cells: [{ value: 'GENERAL'}] },
                { cells: [{ value: 'CASOS DE PRUEBAS'}, { value: 'PRUEBAS A REALIZAR'}, { value: 'RESULTADO ESPERADO'}] },
                { cells: [{ value: 'Interface: Men� principal'}, { value: ''}, {wrap: true, value: ''}] },
                { cells: [{ value: 'Interface: Men� principal'}, { wrap: true, value: ''}, { value: ''}] },
                { cells: [{ value: 'Interface: �rea de Trabajo (Visor)'}, { wrap: true, value: ''}, { value: ''}] },
                { cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },{ cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },
                { cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },{ cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },
                { cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },{ cells: [{ value: ''}, { wrap: true, value: ''}, { value: ''}] },
                ] }], activeSheetIndex: 1,
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.merge("Sheet3!A1:C1"); 
                    spreadsheet.merge("Sheet3!A2:C2"); 
                    spreadsheet.merge("Sheet3!A3:C3");
                    spreadsheet.merge("Sheet3!A5:A6");
                    spreadsheet.merge("Sheet3!A7:A25");
                    spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A1:C1');spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A2:C2');
                    spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A3:C3');spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A4:C4');
                    spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A5:A6');spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!B5:C6');
                    spreadsheet.cellFormat({ border: '2px solid #000000'}, 'Sheet3!A7:A25');spreadsheet.cellFormat({ border: '2px solid #000000'},'Sheet3!B7:C25');
                } }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-49588 - Styling a cell is also styling copied cells in different sheets', (done: Function) => {
                helper.invoke('copy', ['Sheet1!D4']).then(function () {
                    helper.invoke('paste', ['D4']);
                    helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'Sheet1!D4']);
                    helper.invoke('cellFormat', [{ fontStyle: 'italic' }, 'Sheet1!D4']);
                    helper.invoke('cellFormat', [{ textDecoration: 'underline line-through' }, 'Sheet1!D4']);
                    var td = helper.invoke('getCell', [3, 3]);
                    expect(td.style.fontWeight).not.toBe('bold');
                    expect(td.style.fontStyle).not.toBe('italic');
                    expect(td.style.textDecoration).not.toBe('underline line-through');
                    done();
                });
            });
            it('EJ2-46530 - fix the alignment issue with wrap and merge with resized row', function (done) {
                helper.invoke('selectRange', ['A1:A2']);
                helper.getElement('#' + helper.id + '_merge').click();
                helper.invoke('updateCell', [{ value: 'text test word one two three' }, 'A1']);
                helper.getElement('#' + helper.id + '_wrap').click();
                helper.getElement('#' + helper.id + '_vertical_align').click();
                helper.getElement('#' + helper.id + '_vertical_align-popup .e-item:nth-child(2)').click();
                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('text test word one two three');
                done();
            });
            it('EJ2-51216 - Underline and strikethrough not working after performing row resize action->', (done: Function) => {
                helper.invoke('selectRange', ['B10']);
                helper.invoke('updateCell', [{ value: 'one two three four five six seven eight nine ten eleven twelve thirtneen fourteen fifteen' }, 'B10']);
                helper.getElement('#' + helper.id + '_wrap').click();
                helper.getElement('#' + helper.id + '_underline').click();
                helper.getElement('#' + helper.id + '_line-through').click();
                helper.invoke('setRowHeight', [130, 9]);
                expect(helper.getInstance().sheets[1].rows[9].cells[1].style.textDecoration).toBe('underline line-through');
                done();
            });
            it('EJ2-52952 - Borders are not getting applied properly for merged cells after applying border style and color->', (done: Function) => {
                helper.invoke('merge', ['C1:D2']);
                helper.invoke('setBorder', [{ border: '3px solid #1e88e5' }, 'C1:D2', 'Outer']);
                expect(helper.getInstance().sheets[1].rows[0].cells[2].style.borderTop).toBe('3px solid #1e88e5');
                expect(helper.getInstance().sheets[1].rows[0].cells[2].style.borderLeft).toBe('3px solid #1e88e5');
                helper.invoke('selectRange', ['C1']);
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="All Borders"]').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[2].style.borderRight).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[1].rows[0].cells[2].style.borderBottom).toBe('1px solid #000000');
                done();
            });
            it('EJ2-53948 - Unable to apply bottom border to a merged cell->', (done: Function) => {
                helper.invoke('merge', ['F1:F4']);
                helper.invoke('selectRange', ['F1']);
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="Bottom Borders"]').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[5].style.borderBottom).toBe('1px solid #000000');
                done();
            });
            it('EJ2-53048 - undo redo for merged cell with border does not work->', (done: Function) => {
                helper.invoke('merge', ['H1:I1']);
                helper.invoke('selectRange', ['H1:I2']);
                helper.click('_fill_color_picker .e-dropdown-btn');
                helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#ffff00ff"]');
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="All Borders"]').click();
                helper.invoke('copy', ['H1:I2']).then(() => {
                    helper.invoke('paste', ['K1']);
                    helper.click('#spreadsheet_undo');
                    expect(helper.invoke('getCell', [0, 10]).style.backgroundColor).toBeNull;
                    expect(helper.invoke('getCell', [1, 10]).style.backgroundColor).toBeNull;
                    done();
                });
            });
            it('EJ2-54306 - Toggle Button state not refreshed in ribbon while clearing format for a cell using clear format option->', (done: Function) => {
                helper.invoke('selectRange', ['K1']);
                helper.invoke('updateCell', [{ value: 'text' }, 'K1']);
                helper.getElement('#' + helper.id + '_bold').click();
                helper.getElement('#' + helper.id + '_italic').click();
                helper.getElement('#' + helper.id + '_line-through').click();
                helper.getElement('#' + helper.id + '_underline').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[10].style.fontWeight).toBe('bold');
                expect(helper.getInstance().sheets[1].rows[0].cells[10].style.fontStyle).toBe('italic');
                expect(helper.getInstance().sheets[1].rows[0].cells[10].style.textDecoration).toBe('underline line-through');
                helper.getElement('#' + helper.id + '_clear').click();
                helper.click('#' + helper.id + '_clear-popup ul li:nth-child(2)');
                expect(helper.getElement('#' + helper.id + '_bold').classList).not.toContain('e-active');
                expect(helper.getElement('#' + helper.id + '_italic').classList).not.toContain('e-active');
                expect(helper.getElement('#' + helper.id + '_line-through').classList).not.toContain('e-active');
                expect(helper.getElement('#' + helper.id + '_underline').classList).not.toContain('e-active');
                done();
            });
            it('EJ2-56161 - While copy paste the merge cell with bottom border, the border is missing in pasted cell->', (done: Function) => {
                helper.invoke('merge', ['L1:L2']);
                helper.invoke('selectRange', ['L1:M2']);
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="Bottom Borders"]').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[11].style.borderBottom).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[1].rows[1].cells[12].style.borderBottom).toBe('1px solid #000000');    
                helper.invoke('copy', ['L1:M2']).then(() => {
                    helper.invoke('paste', ['L4']);
                    expect(helper.getInstance().sheets[1].rows[3].cells[11].style.borderBottom).toBe('1px solid #000000');
                    expect(helper.getInstance().sheets[1].rows[4].cells[12].style.borderBottom).toBe('1px solid #000000');
                    done();
                });
            });
            it('EJ2-51575 - Undo button doesnot work as expected in spreadsheet control', (done: Function) => {
                helper.invoke('merge', ['O1:Q1']);
                helper.invoke('selectRange', ['O1:Q2']);
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="All Borders"]').click();
                helper.click('_fill_color_picker .e-dropdown-btn');
                helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#33ffffff"]');
                helper.getElement('#' + helper.id + '_underline').click();
                helper.getElement('#' + helper.id + '_line-through').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[14].style.textDecoration).toBe('underline line-through');
                expect(helper.getInstance().sheets[1].rows[1].cells[14].style.textDecoration).toBe('underline line-through');
                expect(helper.invoke('getCell', [0, 14]).style.backgroundColor).toBe('rgb(51, 255, 255)');
                expect(helper.invoke('getCell', [1, 14]).style.backgroundColor).toBe('rgb(51, 255, 255)');
                helper.getElement('#' + helper.id + '_undo').click();
                helper.getElement('#' + helper.id + '_undo').click();
                helper.getElement('#' + helper.id + '_undo').click();
                expect(helper.getInstance().sheets[1].rows[0].cells[14].style.textDecoration).toBeNull;
                expect(helper.getInstance().sheets[1].rows[1].cells[14].style.textDecoration).toBeNull;
                expect(helper.invoke('getCell', [0, 14]).style.backgroundColor).toBeNull;
                expect(helper.invoke('getCell', [1, 14]).style.backgroundColor).toBeNull;
                done();
            });
            it('EJ2-50222 - cell border issue while applying Merge and wrap text', (done: Function) => {
                helper.invoke('goTo', ['Sheet3!A1']);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [4, 0]).style.borderRight).toBe('2px solid rgb(0, 0, 0)');
                    expect(helper.invoke('getCell', [4, 0]).style.borderLeft).toBe('2px solid rgb(0, 0, 0)');
                    done();
                });
            });
        });
        describe('EJ2-59778 ->', () => {
            let sheets: SheetModel[];
            L10n.load({
                'de-DE': {
                    'spreadsheet': {
                        "Clear": "klar",
                        "ClearContents": "Inhalt löschen",
                        "ClearAll": "Alles löschen",
                        "ClearFormats": "Formate löschen",
                        "ClearHyperlinks": "Löschen Sie Hyperlinks",
                    }
                }
            });
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], locale: 'de-DE'  }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Clear Hyperlink', (done: Function) => {
                helper.invoke('insertHyperlink', [{ address: 'www.google.com' }, 'Sheet1!A7', 'Test', false]);
                helper.invoke('selectRange', ['A7:A7']);
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(4)');
                sheets = helper.getInstance().sheets;
                setTimeout(() => {
                    expect(getCell(6, 0, sheets[0]).hyperlink).toBeUndefined();
                    let td: HTMLElement = helper.invoke('getCell', [6, 0]);
                    expect(helper.invoke('getCell', [6, 0]).children.length).toBe(0);
                    done();
                });
            });
            it('Clear Formats', (done: Function) => {
                helper.invoke('cellFormat', [{ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1']);
                helper.invoke('selectRange', ['A1:A1']);
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(2)');
                sheets = helper.getInstance().sheets;
                setTimeout(() => {
                    expect(getCell(0, 0, sheets[0]).format).toBeUndefined();
                    expect(helper.invoke('getCell', [0, 0]).style.fontWeight).toBe('');
                    done();
                });
            });
            it('Clear Contents', (done: Function) => {
                helper.invoke('selectRange', ['D3:D3']);
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(3)');
                sheets = helper.getInstance().sheets;
                setTimeout(() => {
                    expect(getCell(2, 3, sheets[0]).value).toBeUndefined();
                    expect(helper.invoke('getCell', [2, 3]).textContent).toBe('');
                    done();
                });
            });
            it('Clear All', (done: Function) => {
                helper.invoke('insertHyperlink', [{ address: 'www.google.com' }, 'Sheet1!A4', 'Test', false]);
                helper.invoke('selectRange', ['A1:C6']);
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
                sheets = helper.getInstance().sheets;
                setTimeout(() => {
                    expect(getCell(2, 0, sheets[0]).value).toBeUndefined();
                    expect(helper.invoke('getCell', [2, 0]).textContent).toBe('');
                    expect(getCell(0, 4, sheets[0]).format).toBeUndefined();
                    expect(helper.invoke('getCell', [0, 4]).style.fontWeight).toBe('');
                    expect(getCell(3, 0, sheets[0]).hyperlink).toBeUndefined();
                    let td: HTMLElement = helper.invoke('getCell', [6, 0]);
                    expect(helper.invoke('getCell', [3, 0]).children.length).toBe(0);
                    done();
                });
            });
        });		

        describe('EJ2-935705 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Cell formatting is updated incorrectly when a custom negative number format is applied', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                spreadsheet.cellFormat({ color: 'green' }, 'F4:F11');
                spreadsheet.numberFormat('#,##0_);[Red](#,##0)', 'F4:F11');
                expect(spreadsheet.sheets[0].rows[3].cells[5].style.color).toBe('green');
                expect(spreadsheet.sheets[0].rows[4].cells[5].style.color).toBe('green');
                expect(spreadsheet.sheets[0].rows[5].cells[5].style.color).toBe('green');
                expect(spreadsheet.sheets[0].rows[6].cells[5].style.color).toBe('green');
                expect(helper.invoke('getCell', [3, 5]).style.color).toBe('green');
                expect(helper.invoke('getCell', [4, 5]).style.color).toBe('green');
                expect(helper.invoke('getCell', [5, 5]).style.color).toBe('green');
                expect(helper.invoke('getCell', [6, 5]).style.color).toBe('green');
                helper.edit('F4', '-10');
                helper.edit('F5', '-20');
                helper.edit('F6', '-30');
                helper.edit('F7', '-40');
                expect(spreadsheet.sheets[0].rows[3].cells[5].style.color).toBe('green');
                expect(helper.invoke('getCell', [3, 5]).style.color).toBe('red');
                expect(spreadsheet.sheets[0].rows[3].cells[5].value).toBe(-10);
                expect(spreadsheet.sheets[0].rows[3].cells[5].formattedText).toBe('(10)');
                expect(spreadsheet.sheets[0].rows[4].cells[5].style.color).toBe('green');
                expect(helper.invoke('getCell', [4, 5]).style.color).toBe('red');
                expect(spreadsheet.sheets[0].rows[4].cells[5].value).toBe(-20);
                expect(spreadsheet.sheets[0].rows[4].cells[5].formattedText).toBe('(20)');
                expect(spreadsheet.sheets[0].rows[5].cells[5].style.color).toBe('green');
                expect(helper.invoke('getCell', [5, 5]).style.color).toBe('red');
                expect(spreadsheet.sheets[0].rows[5].cells[5].value).toBe(-30);
                expect(spreadsheet.sheets[0].rows[5].cells[5].formattedText).toBe('(30)');
                expect(spreadsheet.sheets[0].rows[6].cells[5].style.color).toBe('green');
                expect(helper.invoke('getCell', [6, 5]).style.color).toBe('red');
                expect(spreadsheet.sheets[0].rows[6].cells[5].value).toBe(-40);
                expect(spreadsheet.sheets[0].rows[6].cells[5].formattedText).toBe('(40)');
                helper.invoke('goTo', ['Sheet2!A1']);
                setTimeout(() => {
                    helper.invoke('goTo', ['Sheet1!A1']);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[3].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [3, 5]).style.color).toBe('red');
                        expect(spreadsheet.sheets[0].rows[3].cells[5].value).toBe(-10);
                        expect(spreadsheet.sheets[0].rows[3].cells[5].formattedText).toBe('(10)');
                        expect(spreadsheet.sheets[0].rows[4].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [4, 5]).style.color).toBe('red');
                        expect(spreadsheet.sheets[0].rows[4].cells[5].value).toBe(-20);
                        expect(spreadsheet.sheets[0].rows[4].cells[5].formattedText).toBe('(20)');
                        expect(spreadsheet.sheets[0].rows[5].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [5, 5]).style.color).toBe('red');
                        expect(spreadsheet.sheets[0].rows[5].cells[5].value).toBe(-30);
                        expect(spreadsheet.sheets[0].rows[5].cells[5].formattedText).toBe('(30)');
                        expect(spreadsheet.sheets[0].rows[6].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [6, 5]).style.color).toBe('red');
                        expect(spreadsheet.sheets[0].rows[6].cells[5].value).toBe(-40);
                        expect(spreadsheet.sheets[0].rows[6].cells[5].formattedText).toBe('(40)');
                        helper.edit('F4', '10');
                        helper.edit('F5', '20');
                        helper.edit('F6', '30');
                        helper.edit('F7', '40');
                        expect(spreadsheet.sheets[0].rows[3].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [3, 5]).style.color).toBe('green');
                        expect(spreadsheet.sheets[0].rows[3].cells[5].value).toBe(10);
                        expect(spreadsheet.sheets[0].rows[3].cells[5].formattedText).toBe('10 ');
                        expect(spreadsheet.sheets[0].rows[4].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [4, 5]).style.color).toBe('green');
                        expect(spreadsheet.sheets[0].rows[4].cells[5].value).toBe(20);
                        expect(spreadsheet.sheets[0].rows[4].cells[5].formattedText).toBe('20 ');
                        expect(spreadsheet.sheets[0].rows[5].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [5, 5]).style.color).toBe('green');
                        expect(spreadsheet.sheets[0].rows[5].cells[5].value).toBe(30);
                        expect(spreadsheet.sheets[0].rows[5].cells[5].formattedText).toBe('30 ');
                        expect(spreadsheet.sheets[0].rows[6].cells[5].style.color).toBe('green');
                        expect(helper.invoke('getCell', [6, 5]).style.color).toBe('green');
                        expect(spreadsheet.sheets[0].rows[6].cells[5].value).toBe(40);
                        expect(spreadsheet.sheets[0].rows[6].cells[5].formattedText).toBe('40 ');
                        done();
                    });
                });
            });
        });
        
        describe('EJ2-939706 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{ ranges: [{ dataSource: defaultData }] }],
                        beforeDataBound: (): void => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            spreadsheet.merge("Sheet1!E3:G3");
                            spreadsheet.merge("Sheet1!C4:F4");
                            spreadsheet.cellFormat({ borderTop: '1px solid #000000' }, 'Sheet1!A3:M3');
                            spreadsheet.cellFormat({ borderTop: '1px solid #000000' }, 'Sheet1!A4:M4');
                            spreadsheet.cellFormat({ borderTop: '1px solid #000000' }, 'Sheet1!A5:M5');
                        }
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Border not rendered properly in merged cells - Initial Rendering', (done: Function) => {
                expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 3]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 4]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 5]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 6]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 7]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 8]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 9]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [2, 2]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 3]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 4]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 5]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 6]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 7]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [2, 8]).style.borderTop).toBe('');
                expect(helper.invoke('getCell', [3, 2]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 3]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 4]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 5]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 6]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 7]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 8]).style.borderBottom).toBe('');
                expect(helper.invoke('getCell', [3, 2]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 3]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 4]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 5]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 6]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 7]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 8]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [3, 9]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                done();
            });

            it('Border not rendered properly in merged cells - Vertical Scrolling', (done: Function) => {
                helper.invoke('goTo', ['Sheet1!A60']);
                setTimeout(() => {
                    helper.invoke('goTo', ['Sheet1!A7']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 3]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 4]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 5]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 6]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 7]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 8]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 9]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [2, 2]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 3]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 4]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 5]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 6]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 7]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 8]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [3, 2]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 3]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 4]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 5]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 6]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 7]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 8]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 2]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 3]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 4]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 5]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 6]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 7]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 8]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 9]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        done();
                    }, 10);
                }, 10);
            });

            it('Border not rendered properly in merged cells - Horizontal Scrolling', (done: Function) => {
                helper.invoke('goTo', ['Sheet1!BA2']);
                setTimeout(() => {
                    helper.invoke('goTo', ['Sheet1!A2']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 2]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 3]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 4]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 5]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 6]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 7]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 8]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [1, 9]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [2, 2]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 3]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 4]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 5]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 6]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 7]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [2, 8]).style.borderTop).toBe('');
                        expect(helper.invoke('getCell', [3, 2]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 3]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 4]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 5]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 6]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 7]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 8]).style.borderBottom).toBe('');
                        expect(helper.invoke('getCell', [3, 2]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 3]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 4]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 5]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 6]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 7]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 8]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        expect(helper.invoke('getCell', [3, 9]).style.borderTop).toBe('1px solid rgb(0, 0, 0)');
                        done();
                    }, 10);
                }, 10);
            });
        });
    });
    describe('EJ2-58338, EJ2-840548 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Clear Option does not work, when values are selected from bottom to top / left to right', (done: Function) => {
            helper.invoke('selectRange', ['E1:A1'])
            helper.getElement('#'+helper.id+'_clear').click();
            helper.getElement('#'+helper.id+'_clear-popup li:nth-child(3)').click();
            expect(helper.invoke('getCell', [0, 4]).textContent).toBe('');
            expect(helper.invoke('getCell', [0, 3]).textContent).toBe('');
            expect(helper.invoke('getCell', [0, 2]).textContent).toBe('');
            expect(helper.invoke('getCell', [0, 1]).textContent).toBe('');
            expect(helper.invoke('getCell', [0, 0]).textContent).toBe('');
            var spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[0].cells[4].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[3].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBeUndefined();
            done();
        });
        it('Cell borders removed on undo action after copy/paste from external excel file', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setBorder({border: '1px dashed red' }, 'F1:F5');
            spreadsheet.setBorder({border: '1px dashed red' }, 'G1:H1');
            spreadsheet.setBorder({border: '1px solid #000000' }, 'J1:J5');
            spreadsheet.setBorder({borderRight: '1px dashed red' }, 'G2');
            spreadsheet.setBorder({borderRight: '1px dashed red' }, 'G3');
            spreadsheet.setBorder({borderRight: '1px dashed red' }, 'G4');
            spreadsheet.setBorder({borderRight: '1px dashed red' }, 'G5');
            spreadsheet.setBorder({borderRight: '1px dashed red', borderBottom: '1px dashed red' }, 'G2:H2');
            spreadsheet.setBorder({borderRight: '1px dashed red', borderBottom: '1px dashed red' }, 'G3:H3');
            spreadsheet.setBorder({borderRight: '1px dashed red', borderBottom: '1px dashed red' }, 'G4:H4');
            spreadsheet.setBorder({borderRight: '1px dashed red', borderBottom: '1px dashed red' }, 'G5:H5');
            helper.invoke('copy', ['J1:J5']).then(() => {
                helper.invoke('paste', ['H1']);
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[0].cells[7].style.borderBottom).toBe('1px dashed red');
                expect(helper.invoke('getCell', [0, 7]).style.borderBottom).toBe('1px dashed red');
                expect(spreadsheet.sheets[0].rows[1].cells[6].style.borderBottom).toBe('1px dashed red');
                expect(helper.invoke('getCell', [1, 6]).style.borderBottom).toBe('1px dashed red');
                expect(spreadsheet.sheets[0].rows[3].cells[7].style.borderBottom).toBe('1px dashed red');
                expect(helper.invoke('getCell', [3, 7]).style.borderBottom).toBe('1px dashed red');
                expect(spreadsheet.sheets[0].rows[4].cells[6].style.borderBottom).toBe('1px dashed red');
                expect(helper.invoke('getCell', [4, 6]).style.borderBottom).toBe('1px dashed red');
                done();
            });
        });
    });
    describe('Applying formats to the hidden rows ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Apply cell format border to the hidden row ', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'notequal', value: '15' }], 'A1:H1')
            setTimeout(() => {
                spreadsheet.cellFormat({ fontWeight: 'bold', color: '#ffffff', border: '12pt' }, 'A4:E4');
                spreadsheet.cellFormat({ fontWeight: 'bold', color: '#ffffff', border: '12pt' }, 'A3:E3');
                helper.getElement('#' + helper.id + '_line-through').click();
                helper.getElement('#' + helper.id + '_underline').click();
                helper.getElement('#' + helper.id + '_line-through').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline');

                done();
            });
        });
    });
    describe('Applying text decorator formats with args.cancel as true in actionBegin event ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                actionBegin(args: any) {
                    if (args.action === 'format') {
                      args.args.eventArgs.cancel = true;
                    }
                }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Apply cell format border to the hidden row ', (done: Function) => {
            let spreadsheet: Spreadsheet = helper.getInstance();
            helper.getElement('#' + helper.id + '_line-through').click();
            expect(spreadsheet.activeSheetIndex).toEqual(0);
            done();
        });
        it('EJ2-894962 - Font color not applied correctly for the negative value cells', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const cell1: CellModel = spreadsheet.sheets[0].rows[4].cells[6];
            const cell2: CellModel = spreadsheet.sheets[0].rows[9].cells[6];
            const td1: HTMLTableCellElement = helper.invoke('getCell', [4, 6]);
            const td2: HTMLTableCellElement = helper.invoke('getCell', [5, 6]);
            helper.edit('G5', '-11');
            helper.edit('G6', '-10');
            expect(td1.textContent).toEqual('-11');
            expect(td2.textContent).toEqual('-10');
            helper.invoke('numberFormat', ['#,##0_);[Red](#,##0)', 'G1:G10']);
            expect(cell1.format).toEqual('#,##0_);[Red](#,##0)');
            expect(cell2.format).toEqual('#,##0_);[Red](#,##0)');
            expect(td1.textContent).toEqual('(11)');
            expect(td2.textContent).toEqual('(10)');
            spreadsheet.cellFormat({ color: '#70ad47' }, 'G1:G10');
            expect(cell1.style.color).toEqual('#70ad47');
            expect(cell2.style.color).toEqual('#70ad47');
            expect(td1.style.color).toEqual('red');
            expect(td2.style.color).toEqual('red');
            expect(spreadsheet.sheets[0].rows[6].cells[6].style.color).toEqual('#70ad47');
            expect(helper.invoke('getCell', [6, 6]).style.color).toEqual('rgb(112, 173, 71)');
            done();
        });
    });

    describe('Testing Cell Formatting while performing undo action ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Cell Formatting while performing undo action after deleting rows', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
            spreadsheet.selectRange('A2:CV5');
            let td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(7)');
                setTimeout(() => {
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[1].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[2].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[2].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[3].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[3].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[4].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[4].cells[0].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[2].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[2].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[3].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[3].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[4].cells[7].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[4].cells[7].style).toBeUndefined();
                        done();
                    });
                });
            });
        });
        it('Cell Formatting while performing undo action after deleting columns', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:A11');
            helper.invoke('selectRange', ['B1:E100']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.click('#' + helper.id + '_contextmenu li:nth-child(7)');
                setTimeout(() => {
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[1].cells[1].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[1].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[2].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[2].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[3].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[3].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[4].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[1].cells[4].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[1].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[1].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[2].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[2].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[3].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[3].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[4].style).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].cells[4].style).toBeUndefined();
                        done();
                    });
                });
            });
        });
    });
});
