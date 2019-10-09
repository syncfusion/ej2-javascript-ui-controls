import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, getCell, SpreadsheetModel, Spreadsheet } from '../../../src/index';

/**
 *  Spreadsheet Ribbon spec
 */
describe('Spreadsheet Ribbon integration module ->', (): void => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('UI interaction checking ->', (): void => {
        let instance: Spreadsheet;
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        rangeSettings: [
                            { dataSource: defaultData }
                        ]
                    }
                ]
            };
            helper.initializeSpreadsheet(model, done);
            instance = helper.getInstance();
        });

        afterAll((): void => {
            helper.invoke('destroy');
        });

        it('Bold testing', (): void => {
            helper.click('_bold');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontWeight).toEqual('bold'); // model checking
            expect(instance.getCell(0, 0).style.fontWeight).toEqual('bold'); // dom checking
            helper.click('_bold');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontWeight).toEqual('normal');
            expect(instance.getCell(0, 0).style.fontWeight).toEqual('normal');
        });

        it('Italic testing', (): void => {
            helper.click('_italic');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('italic');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('italic');
            helper.click('_italic');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('normal');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('normal');
        });

        it('StrikeThrough testing', (): void => {
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('line-through');
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
        });

        it('Underline testing', (): void => {
            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline');
            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
        });

        it('Underline & StrikeThrough testing', (): void => {
            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline');
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline line-through');
            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('line-through');
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
        });

        it('Cut testing', (): void => {
            helper.click('_bold');
            helper.click('_italic');
            helper.click('_underline');
            helper.click('_cut');
            setTimeout(() => {
                helper.invoke('selectRange', ['K1']);
                helper.triggerKeyNativeEvent(86, true);
                let cell: CellModel = getCell(0, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
            }, 100);
        });

        it('Copy testing', (): void => {
            helper.click('_copy');
            setTimeout(() => {
                helper.invoke('selectRange', ['K2']);
                helper.triggerKeyNativeEvent(86, true);
                // Copied cell
                let cell: CellModel = getCell(0, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
                // Pasted the copied content cell
                cell = getCell(1, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
            }, 100);
        });

        it('Paste testing', (): void => {
            helper.invoke('selectRange', ['K3']);
            helper.click('_paste');
            let cell: CellModel = getCell(2, 10, instance.getActiveSheet());
            expect(cell.value).toEqual('Item Name');
            expect(cell.style.fontWeight).toEqual('bold');
            expect(cell.style.fontStyle).toEqual('italic');
            expect(cell.style.textDecoration).toEqual('underline');
        });

        it('Text color testing', (): void => {
            helper.invoke('selectRange', ['K4']);
            helper.click('_font_color_picker .e-split-btn');
            expect(getCell(3, 10, instance.getActiveSheet()).style.color).toEqual('#000000');
            helper.invoke('selectRange', ['K5']);
            helper.click('_font_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#ed7d31ff"]');
            expect(getCell(4, 10, instance.getActiveSheet()).style.color).toEqual('#ed7d31');
        });

        it('Text color mode switcher testing', (): void => {
            helper.invoke('selectRange', ['K6']);
            helper.click('_font_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open .e-switch-ctrl-btn button');
            helper.click('.e-colorpicker-popup.e-popup-open .e-switch-ctrl-btn .e-apply');
            expect(getCell(5, 10, instance.getActiveSheet()).style.color).toEqual('#ed7d31');
        });

        it('Fill color testing', (): void => {
            helper.invoke('selectRange', ['K4']);
            helper.click('_fill_color_picker .e-split-btn');
            expect(getCell(3, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#ffff00');
            helper.invoke('selectRange', ['K5']);
            helper.click('_fill_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open span[aria-label="#00ffffff"]');
            expect(getCell(4, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#00ffff');
        });

        it('Fill color mode switcher testing', (): void => {
            helper.invoke('selectRange', ['K6']);
            helper.click('_fill_color_picker .e-dropdown-btn');
            helper.click('.e-colorpicker-popup.e-popup-open .e-switch-ctrl-btn button');
            helper.click('.e-colorpicker-popup.e-popup-open .e-switch-ctrl-btn .e-apply');
            expect(getCell(5, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#00ffff');
        });

        it('Font testing', (): void => {
            helper.click('_font_name .e-btn-icon');
            helper.click(`#${helper.id}_font_name-popup li:nth-child(2)`);
            expect(getCell(5, 10, instance.getActiveSheet()).style.fontFamily).toEqual('Arial Black');
            expect(instance.getCell(5, 10).style.fontFamily).toEqual('"Arial Black"');
            expect(helper.getElement(`#${helper.id}_font_name .e-tbar-btn-text`).textContent).toEqual('Arial Black');
        });

        it('Font testing', (): void => {
            helper.click('_number_format .e-btn-icon');
            helper.click(`#${helper.id}_number_format-popup li:nth-child(2)`);
            expect(getCell(5, 10, instance.getActiveSheet()).format).toEqual('0.00');
        });

        it('File Menu New testing', (done: Function) => {
            setTimeout((): void => {
                helper.click('.e-add-sheet-tab');
                helper.click('.e-file-menu li');
                setTimeout((): void => {
                    expect(helper.getElement('.e-menu-popup.e-file-menu')).not.toBeNull();
                    helper.click('.e-menu-popup.e-file-menu li[id="New"]');
                    setTimeout((): void => {
                        helper.click('.e-dialog.e-popup-open button.e-primary');
                        setTimeout((): void => {
                            expect(helper.getInstance().sheets.length).toBe(1);
                            done();
                        }, 10);
                    }, 10);
                }, 10);
            }, 20);
        });

        //Checked for code coverage.
        it('File Menu Open testing', (done: Function) => {
            setTimeout(
                (): void => {
                    let fileElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#spreadsheet_fileUpload')
                    let eventArg: Event = new Event('change');
                    fileElem.dispatchEvent(eventArg);
                    done();
                },
                20);
        });

        it('Collapse expand testing', (): void => {
            expect(helper.getElement('.e-ribbon .e-drop-icon').title).toEqual('Collapse Toolbar');
            helper.click('.e-ribbon .e-drop-icon');
            expect(helper.hasClass('e-collapsed', helper.getRibbonElement())).toBeTruthy();
            expect(helper.getElement('.e-ribbon .e-drop-icon').title).toEqual('Expand Toolbar');
            helper.click('.e-ribbon .e-drop-icon');
            expect(helper.hasClass('e-collapsed', helper.getRibbonElement())).toBeFalsy();
            expect(helper.getElement('.e-ribbon .e-drop-icon').title).toEqual('Collapse Toolbar');
        });

    });

});