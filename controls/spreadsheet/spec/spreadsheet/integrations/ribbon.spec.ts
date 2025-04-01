import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, getCell, SpreadsheetModel, Spreadsheet } from '../../../src/index';
import { L10n, getComponent  } from '@syncfusion/ej2-base';

/**
 *  Spreadsheet Ribbon spec
 */
describe('Spreadsheet Ribbon integration module ->', (): void => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('Public method ->', (): void => {
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

        afterAll((): void => {
            helper.invoke('destroy');
        });

        it('Enable & Disable ribbon tab', (done: Function): void => {
            helper.invoke('enableRibbonTabs', [['Home', 'Data'], false]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[2].classList).toContain('e-overlay');
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[5].classList).toContain('e-overlay');
            helper.invoke('enableRibbonTabs', [['Home', 'Data']]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[2].classList).not.toContain('e-overlay');
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[5].classList).not.toContain('e-overlay');
            done();
        });

        it('Hide & show ribbon tab', (done: Function): void => {
            helper.invoke('hideRibbonTabs', [['Insert', 'View']]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[3].classList).toContain('e-hide');
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[6].classList).toContain('e-hide');
            helper.invoke('hideRibbonTabs', [['Insert', 'View'], false]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[3].classList).not.toContain('e-hide');
            expect(helper.getElementFromSpreadsheet('.e-ribbon .e-toolbar-items').children[6].classList).not.toContain('e-hide');
            done();
        });

        it('Enable & Disable toolbar items', (done: Function): void => {
            helper.invoke('enableToolbarItems', ['Home', ['spreadsheet_cut'], false]); // Check this now
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[3].classList).toContain('e-overlay');
            helper.invoke('enableToolbarItems', ['Home', ['spreadsheet_cut']]);
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[3].classList).not.toContain('e-overlay');
            done();
        });

        it('Hide & Show toolbar items', (done: Function): void => {
            helper.invoke('hideToolbarItems', ['Home', [4, 7]]); // Check this now
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[4].classList).toContain('e-hide');
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[7].classList).toContain('e-hide');
            helper.invoke('hideToolbarItems', ['Home', [4, 7], false]);
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[4].classList).not.toContain('e-hide');
            // expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items').children[7].classList).not.toContain('e-hide');
            done();
        });

        it('Enable & Disable File menu items', (done: Function): void => {
            helper.invoke('enableFileMenuItems', [['File'], false]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon #' + helper.id + '_File').classList).toContain('e-disabled');
            helper.invoke('enableFileMenuItems', [['File']]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon #' + helper.id + '_File').classList).not.toContain('e-disabled');
            done();
        });

        it('Hide & Show File menu items', (done: Function): void => {
            helper.invoke('hideFileMenuItems', [['File']]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon #' + helper.id + '_File').classList).toContain('e-menu-hide');
            helper.invoke('hideFileMenuItems', [['File'], false]);
            expect(helper.getElementFromSpreadsheet('.e-ribbon #' + helper.id + '_File').classList).not.toContain('e-menu-hide');
            done();
        });

        it('Add File menu items', (done: Function): void => {
            helper.invoke('addFileMenuItems', [[{ text: 'Print' }], 'Save As', false]);
            helper.click('.e-ribbon #' + helper.id + '_File');
            setTimeout(() => {
                expect(helper.getElement('.e-menu-popup li:nth-child(3)').textContent).toBe('Print');
                helper.click('.e-menu-popup li:nth-child(3)');
                done();
            });
        });
        it('881341- Issue in clearing the data when protect sheet is enabled', (done: Function): void => {
            helper.invoke('protectSheet', ['Sheet1', { selectCells: true, selectUnLockedCells: true, formatCells: true }]);
            expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
            const clearButton = helper.getElement('#' + helper.id + '_clear');
            clearButton.click();
            const clearOptions = document.querySelectorAll('.e-clear-ddb .e-item');
            clearOptions.forEach((option: Element) => {
                const id = option.getAttribute('id');
                if (id.includes('_Clear Formats')) {
                    expect(option.classList.contains('e-disabled')).toBe(false);
                } else {
                    expect(option.classList.contains('e-disabled')).toBe(true);
                }
            });
            helper.getElement('.e-clear-ddb .e-clear-icon').click();
            done();
        });
        it('914971- Clear options not enabled for Unlocked cells in Protected Sheet', (done: Function): void => {
            helper.invoke('protectSheet', ['Sheet1', { selectCells: true, selectUnLockedCells: true, formatCells: true, formatRows: true, formatColumns: true, insertLink: true, }]);
            expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
            helper.invoke('lockCells', ['A1:H11', false]);
            const clearButton = helper.getElement('#' + helper.id + '_clear');
            clearButton.click();
            const clearOptions = document.querySelectorAll('.e-clear-ddb .e-item');
            clearOptions.forEach((option: Element) => {
                const id = option.getAttribute('id');
                if (id.includes('_Clear Formats') || id.includes('_Clear All') || id.includes('_Clear Contents')) {
                    expect(option.classList.contains('e-disabled')).toBe(false);
                } else {
                    expect(option.classList.contains('e-disabled')).toBe(true);
                }
            });
            helper.getElement('.e-clear-ddb .e-clear-icon').click();
            done();
        });
    });


    describe('UI interaction checking ->', (): void => {
        let instance: Spreadsheet;
        beforeAll((done: Function) => {
            model = {
                sheets: [
                    {
                        ranges: [{ dataSource: defaultData }]
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
            // for undo checking
            helper.click('_undo');
            expect(getCell(0, 0, instance.getActiveSheet()).style).toBeUndefined();
            expect(instance.getCell(0, 0).style.fontWeight).toEqual('');
            // for redo checking
            helper.click('_redo');
            expect(instance.getCell(0, 0).style.fontWeight).toEqual('bold');
            // remove bold checking
            helper.click('_bold');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontWeight).toEqual('normal');
            expect(instance.getCell(0, 0).style.fontWeight).toEqual('normal');
        });

        it('Italic testing', (): void => {
            helper.click('_italic');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('italic');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('italic');
            // for undo checking
            helper.click('_undo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontWeight).toEqual('normal');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('');
            // for redo checking
            helper.click('_redo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('italic');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('italic');
            // remove italic checking
            helper.click('_italic');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('normal');
            expect(instance.getCell(0, 0).style.fontStyle).toEqual('normal');
        });

        it('StrikeThrough testing', (): void => {
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('line-through');
            // for undo checking
            helper.click('_undo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.fontStyle).toEqual('normal');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('');
            // for redo checking
            helper.click('_redo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('line-through');
            // remove line through checking
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
        });

        it('Underline testing', (): void => {
            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline');
            // for undo checking
            helper.click('_undo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
            // for redo checking
            helper.click('_redo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline');
            // remove line through checking
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
            // for undo checking
            helper.click('_undo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline');
            // for redo checking
            helper.click('_redo');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('underline line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('underline line-through');

            helper.click('_underline');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('line-through');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('line-through');
            helper.click('_line-through');
            expect(getCell(0, 0, instance.getActiveSheet()).style.textDecoration).toEqual('none');
            expect(instance.getCell(0, 0).style.textDecoration).toEqual('none');
        });

        it('Cut testing', (done: Function) => {
            helper.click('_bold');
            helper.click('_italic');
            helper.click('_underline');
            helper.click('_cut');
            setTimeout(() => {
                helper.invoke('selectRange', ['K1']);
                helper.click('_paste');
                let cell: CellModel = getCell(0, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
                //undo testing
                helper.click('_undo');
                cell = getCell(0, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('');
                expect(cell.style).toBeUndefined();
                done();
            });
        });

        it('Cut-redo testing', (done: Function) => {
            let cell: CellModel = getCell(0, 10, instance.getActiveSheet());
            helper.click('_redo');
            setTimeout(() => {
                cell = getCell(0, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
                done();
            });
        });

        it('Copy testing', (done: Function) => {
            helper.click('_copy');
            setTimeout(() => {
                helper.invoke('selectRange', ['K2']);
                helper.click('_paste');
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
                //undo testing
                helper.invoke('undo', null);
                cell = getCell(1, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('');
                expect(cell.style).toBeUndefined();
                done();
            });
        });

        it('Copy-redo testing', (done: Function) => {
            let cell: CellModel = getCell(0, 10, instance.getActiveSheet());
            helper.invoke('redo', null);
            setTimeout(() => {
                cell = getCell(1, 10, instance.getActiveSheet());
                expect(cell.value).toEqual('Item Name');
                expect(cell.style.fontWeight).toEqual('bold');
                expect(cell.style.fontStyle).toEqual('italic');
                expect(cell.style.textDecoration).toEqual('underline');
                done()
            });
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
            helper.click('#' + helper.getElement('#' + helper.id + '_font_color_picker .e-dropdown-btn').id + '-popup span[aria-label="#ed7d31ff"]');
            expect(getCell(4, 10, instance.getActiveSheet()).style.color).toEqual('#ed7d31');
            // undo checking
            helper.click('_undo');
            expect(getCell(4, 10, instance.getActiveSheet()).style).toBeUndefined();
            // redo checking
            helper.click('_redo');
            expect(getCell(4, 10, instance.getActiveSheet()).style.color).toEqual('#ed7d31');
        });

        it('Text color mode switcher testing', (): void => {
            helper.invoke('selectRange', ['K6']);
            helper.click('_font_color_picker .e-dropdown-btn');
            const popupSelector: string = '#' + helper.getElement('#' + helper.id + '_font_color_picker .e-dropdown-btn').id + '-popup';
            helper.click(popupSelector + ' .e-switch-ctrl-btn button');
            helper.click(popupSelector + ' .e-switch-ctrl-btn .e-apply');
            expect(getCell(5, 10, instance.getActiveSheet()).style.color).toEqual('#ed7d31');
        });

        it('Fill color testing', (): void => {
            helper.invoke('selectRange', ['K4']);
            helper.click('_fill_color_picker .e-split-btn');
            expect(getCell(3, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#ffff00');
            helper.invoke('selectRange', ['K5']);
            helper.click('_fill_color_picker .e-dropdown-btn');
            helper.click('#' + helper.getElement('#' + helper.id + '_fill_color_picker .e-dropdown-btn').id + '-popup span[aria-label="#00ffffff"]');
            expect(getCell(4, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#00ffff');
            // undo checking
            helper.click('_undo');
            expect(getCell(4, 10, instance.getActiveSheet()).style.backgroundColor).toBeUndefined();
            // redo checking
            helper.click('_redo');
            expect(getCell(4, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#00ffff');
        });

        it('Fill color mode switcher testing', (): void => {
            helper.invoke('selectRange', ['K6']);
            helper.click('_fill_color_picker .e-dropdown-btn');
            const popupSelector: string = '#' + helper.getElement('#' + helper.id + '_fill_color_picker .e-dropdown-btn').id + '-popup';
            helper.click(popupSelector + ' .e-switch-ctrl-btn button');
            helper.click(popupSelector + ' .e-switch-ctrl-btn .e-apply');
            expect(getCell(5, 10, instance.getActiveSheet()).style.backgroundColor).toEqual('#00ffff');
        });

        it('Font testing', (): void => {
            helper.click('_font_name .e-btn-icon');
            helper.click(`#${helper.id}_font_name-popup li:nth-child(2)`);
            expect(getCell(5, 10, instance.getActiveSheet()).style.fontFamily).toEqual('Arial Black');
            expect(instance.getCell(5, 10).style.fontFamily).toEqual('"Arial Black"');
            expect(helper.getElement(`#${helper.id}_font_name .e-tbar-btn-text`).textContent).toEqual('Arial Black');
            // undo checking
            helper.click('_undo');
            expect(getCell(5, 10, instance.getActiveSheet()).style.fontFamily).toBeUndefined();
            // redo checking
            helper.click('_redo');
            expect(getCell(5, 10, instance.getActiveSheet()).style.fontFamily).toEqual('Arial Black');
        });

        it('Font testing', (): void => {
            helper.click('_number_format .e-btn-icon');
            helper.click(`#${helper.id}_number_format-popup li:nth-child(2)`);
            expect(getCell(5, 10, instance.getActiveSheet()).format).toEqual('0.00');
            // undo checking
            helper.click('_undo');
            expect(getCell(5, 10, instance.getActiveSheet()).format).toBeUndefined();
            // redo checking
            helper.click('_redo');
            expect(getCell(5, 10, instance.getActiveSheet()).format).toEqual('0.00');
        });

        it('File Menu New testing', (done: Function) => {
            setTimeout((): void => {
                helper.click('.e-add-sheet-tab');
                helper.click('.e-file-menu li');
                setTimeout((): void => {
                    expect(helper.getElement('.e-menu-popup.e-file-menu')).not.toBeNull();
                    helper.click('.e-menu-popup.e-file-menu li[id="' + helper.id + '_New"]');
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

    describe('UI - Interaction for Chart Design Tab->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Switch Row/Column->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            helper.getElement('#' + helper.id + 'switch_row_column_chart').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Undo after apply Switch Row/Column->', (done: Function) => {
            helper.switchRibbonTab(1);
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            });
        });
        it('Opening Chart Theme Dropdown->', (done: Function) => {
            helper.switchRibbonTab(6)
            helper.getElement('#' + helper.id + '_chart_theme').click();
            helper.getElement('.e-item[aria-label="Fabric"]').click();
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_chart_theme').textContent).toContain('Fabric');
                done();
            }, 20);
        });
        it('Opening Chart Type Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#stackedColumn').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Hovering mouse over Differner Types of Chart in Chart Types Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            const Column: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item');
            (getComponent(Column.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: Column.getBoundingClientRect().left + 5, y: Column.getBoundingClientRect().top + 5 }, document, Column);

            const bar : HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Bar"]');
            (getComponent(bar.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: bar.getBoundingClientRect().left + 5, y: bar.getBoundingClientRect().top + 5 }, document, bar);

            const Area: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Area"]');
            (getComponent(Area.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: Area.getBoundingClientRect().left + 5, y: Area.getBoundingClientRect().top + 5 }, document, Area);

            const Pie: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Pie/Doughnut"]');
            (getComponent(Pie.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: Pie.getBoundingClientRect().left + 5, y: Pie.getBoundingClientRect().top + 5 }, document, Pie);

            const Line: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Line"]');
            (getComponent(Line.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: Line.getBoundingClientRect().left + 5, y: Line.getBoundingClientRect().top + 5 }, document, Line);

            const Scatter: HTMLElement = helper.getElement('#' + helper.id + '_chart-type-btn-popup .e-menu-item[aria-label="Scatter"]');
            (getComponent(Scatter.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: Scatter.getBoundingClientRect().left + 5, y: Scatter.getBoundingClientRect().top + 5 }, document, Scatter);
            helper.getElement('#' + helper.id + '_chart-type-btn').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Opening Chart Element Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PHAxes').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
        it('Choosing Pv Axes Chart Element Dropdown->', (done: Function) => {
            helper.getElement('#' + helper.id + '_addchart').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_addchart-popup .e-menu-item');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#PVAxes').click();
            setTimeout(() => {
                const chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                expect(chart).not.toBeNull();
                done();
            }, 20);
        });
    });

    describe('UI - Interaction for Conditional Formatting, Borders, Merge, Re-apply Filter->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Hovering mouse over Differner Types of Formats in CF menu->', (done: Function) => {
            helper.invoke('selectRange', ['D2:D11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const databars: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Data Bars"]');
            (getComponent(databars.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: databars.getBoundingClientRect().left + 5, y: databars.getBoundingClientRect().top + 5 }, document, databars);

            const colorscales: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Color Scales"]');
            (getComponent(colorscales.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: colorscales.getBoundingClientRect().left + 5, y: colorscales.getBoundingClientRect().top + 5 }, document, colorscales);

            const iconsets: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Icon Sets"]');
            (getComponent(iconsets.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: iconsets.getBoundingClientRect().left + 5, y: iconsets.getBoundingClientRect().top + 5 }, document, iconsets);
            helper.getElement('#ThreeArrows').click();
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');
            done();
        });
        it('Clear Conditional Formatting from entire Sheet->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Clear Rules"]');
            (getComponent(target.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
            helper.getElement('#cf_cr_sheet').click();
            expect(helper.invoke('getCell', [1, 3]).querySelector('e-3arrows-3')).toBeNull();
            expect(helper.invoke('getCell', [5, 3]).querySelector('e-3arrows-2')).toBeNull();
            expect(helper.invoke('getCell', [6, 3]).querySelector('e-3arrows-1')).toBeNull();
            done();
        });
        it('Apply Different Colors and Styles in Border Popup->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_borders').click();
            const borderColor: HTMLElement = helper.getElement('.e-menu-item[aria-label="Border Color"]');
            (getComponent(borderColor.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: borderColor.getBoundingClientRect().left + 5, y: borderColor.getBoundingClientRect().top + 5 }, document, borderColor);
            helper.getElement('.e-tile[aria-label="#ec407aff"]').click();
            helper.click('.e-border-color .e-primary');
            const borderStyle: HTMLElement = helper.getElement('.e-menu-item[aria-label="Border Style"]');
            (getComponent(borderStyle.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: borderStyle.getBoundingClientRect().left + 5, y: borderStyle.getBoundingClientRect().top + 5 }, document, borderStyle);
            helper.getElement('#' + helper.id + '_2px').click();
            helper.getElement('.e-menu-item[aria-label="Top Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[4].cells[4].style.borderTop).toBe('2px solid #ec407a');
            done();
        });
        it('Apply "3px" style in Border Popup->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_borders').click();
            const borderColor: HTMLElement = helper.getElement('.e-menu-item[aria-label="Border Color"]');
            (getComponent(borderColor.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: borderColor.getBoundingClientRect().left + 5, y: borderColor.getBoundingClientRect().top + 5 }, document, borderColor);
            helper.getElement('.e-border-color .e-mode-switch-btn').click();
            helper.click('.e-border-color .e-primary');
            const borderStyle: HTMLElement = helper.getElement('.e-menu-item[aria-label="Border Style"]');
            (getComponent(borderStyle.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: borderStyle.getBoundingClientRect().left + 5, y: borderStyle.getBoundingClientRect().top + 5 }, document, borderStyle);
            helper.getElement('#' + helper.id + '_3px').click();
            helper.getElement('.e-menu-item[aria-label="Left Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[4].cells[4].style.borderLeft).toBe('3px solid #ec407a');
            done();
        });
        it('Apply "Dashed" style in Border Popup->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_borders').click();
            const borderStyle: HTMLElement = helper.getElement('.e-menu-item[aria-label="Border Style"]');
            (getComponent(borderStyle.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: borderStyle.getBoundingClientRect().left + 5, y: borderStyle.getBoundingClientRect().top + 5 }, document, borderStyle);
            helper.getElement('#' + helper.id + '_dashed').click();
            helper.getElement('.e-menu-item[aria-label="Right Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[4].cells[4].style.borderRight).toBe('1px dashed #ec407a');
            done();
        });
        it('Apply Vertical Border->', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            helper.getElement('#' + helper.id + '_borders').click();
            helper.getElement('.e-menu-item[aria-label="Vertical Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[5].cells[4].style.borderRight).toBe('1px dashed #ec407a');
            expect(helper.getInstance().sheets[0].rows[5].cells[4].style.borderLeft).toBe('1px dashed #ec407a');

            done();
        });
        it('Apply Insdie Border->', (done: Function) => {
            helper.invoke('selectRange', ['E7:F8']);
            helper.getElement('#' + helper.id + '_borders').click();
            helper.getElement('.e-menu-item[aria-label="Inside Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[6].cells[4].style.borderBottom).toBe('1px dashed #ec407a');
            expect(helper.getInstance().sheets[0].rows[7].cells[4].style.borderTop).toBe('1px dashed #ec407a');
            done();
        });
        it('Apply No Border->', (done: Function) => {
            helper.invoke('selectRange', ['E5:F8']);
            helper.getElement('#' + helper.id + '_borders').click();
            helper.getElement('.e-menu-item[aria-label="No Borders"]').click();
            expect(helper.getInstance().sheets[0].rows[6].cells[4].style.borderBottom).toBe('');
            expect(helper.getInstance().sheets[0].rows[7].cells[4].style.borderTop).toBe('');
            done();
        });
        it('Apply Re-apply Filter->', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_reapplyfilter').click();
                expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).toContain('e-filtered');
                done();
            });
        });
        it('Apply Merge All->', (done: Function) => {
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_clearfilter').click();
            helper.invoke('selectRange', ['K3:L5']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Merge All"]').click();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].colSpan).toBe(2);
            expect(helper.getInstance().sheets[0].rows[2].cells[10].rowSpan).toBe(3);
            done();
        });
        it('Apply UnMerge->', (done: Function) => {
            helper.invoke('selectRange', ['K3']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Unmerge"]').click();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].colSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].rowSpan).toBeUndefined();
            done();
        });
        it('Apply Merge Horizontally->', (done: Function) => {
            helper.invoke('selectRange', ['K3:L5']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Merge Horizontally"]').click();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].colSpan).toBe(2);
            expect(helper.getInstance().sheets[0].rows[2].cells[10].rowSpan).toBeUndefined();
            done();
        });
        it('Apply Merge Vertically->', (done: Function) => {
            helper.invoke('selectRange', ['K3:L5']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Merge Vertically"]').click();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].colSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[2].cells[10].rowSpan).toBe(3);
            done();
        });
        it('914949-Issue while unmerging the readonly cells, need to throw edit alert when selected Cells are in read->', function (done) {
            const spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A5:B6']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Merge All"]').click();
            expect(helper.getInstance().sheets[0].rows[4].cells[0].colSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[4].cells[0].rowSpan).toBeUndefined();
            spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Unmerge"]').click();
            const dialog = helper.getElement('.e-readonly-alert-dlg.e-dialog');
            expect(dialog.querySelector('.e-dlg-content').textContent).toBe("You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.");
            helper.click('.e-dialog .e-primary');
            done();
        });
        it('914946-Issue while applying the conditional formatting for readonly cells,  need to throw edit alert when selected Cells are in read->', function (done) {
            const spreadsheet = helper.getInstance();
            spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
            helper.invoke('selectRange', ['F2:F11']);
            helper.getElement('#' + helper.id + '_conditionalformatting').click();
            const databars: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item[aria-label="Data Bars"]');
            (getComponent(databars.parentElement, 'menu') as any).animationSettings.effect = 'None';
            helper.triggerMouseAction('mouseover', { x: databars.getBoundingClientRect().left + 5, y: databars.getBoundingClientRect().top + 5 }, document, databars);
            helper.getElement('#BlueDataBar').click();
            const dialog = helper.getElement('.e-readonly-alert-dlg.e-dialog');
            expect(dialog.querySelector('.e-dlg-content').textContent).toBe("You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.");
            helper.click('.e-dialog .e-primary');
            done();
        });
    });

    describe('UI - Interaction for Find & Replace, Custom Format Dialog, View Tab & Data Tab ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('checking 0 of 0 in Find Dialog', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                const findEditor: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-text-findNext-short');
                findEditor.value = 'ShOe';
                findEditor.focus();
                helper.triggerKeyNativeEvent(88, false, false, findEditor, 'keyup');
                expect(findEditor.nextElementSibling.textContent).toBe('0 of 5');
                findEditor.value = '';
                helper.triggerKeyNativeEvent(88, false, false, findEditor, 'keyup');
                expect(findEditor.nextElementSibling.textContent).toBe('0 of 0');
                done();
            });
        });
        it('Choosing Format in Custom format Dialog->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Custom').click();
            setTimeout(() => {
                helper.setAnimationToNone('.e-custom-format-dlg.e-dialog');
                helper.getElement('.e-custom-listview .e-list-item:nth-child(3)').click();
                helper.click('.e-custom-format-dlg .e-dlg-content .e-btn');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [4, 4]).textContent).toBe('20.00');
                    done();
                });
            });
        });
        it('Hide Headers with Find Dialog->', (done: Function) => {
            helper.invoke('selectRange', ['E5']);
            helper.switchRibbonTab(5);
            helper.click('#' + helper.id + '_headers');
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-findtool-dlg.e-dialog')).not.toBeNull();
                helper.invoke('selectRange', ['E5']);
                done();
            });
        });
        // it('Apply Freeze Row->', (done: Function) => {
        //     helper.click('#' + helper.id + '_freezerows');
        //     setTimeout(() => {
        //         // expect(helper.getInstance().sheets[0].frozenRows).toBe(4);
        //         // expect(helper.getInstance().sheets[0].frozenColumns).toBe(0);
        //         done();
        //     }, 50);
        // });
        // it('Apply Freeze Column->', (done: Function) => {
        //     helper.click('#' + helper.id + '_freezecolumns');
        //     setTimeout(() => {
        //         expect(helper.getInstance().sheets[0].frozenRows).toBe(4);
        //         expect(helper.getInstance().sheets[0].frozenColumns).toBe(4);
        //         done();
        //     });
        // });
        it('Apply Protect Workbook in Protected sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.click('#' + helper.id + '_protectworkbook');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                    (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                    setTimeout(() => {
                        var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                        // expect(btnText).toBe('Unprotect Workbook');
                        done();
                    }, 50);
                });
            });
        });
        it('UnprotectWorkbook in Protected Sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                // expect(btnText).toBe('Protect Workbook');
                done();
            }, 50);
        });
    });
    
    describe('CR-Issues ->', () => {
        describe('I257035 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ showRibbon: true }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Add toolbar items', (done: Function): void => {
                helper.invoke('addToolbarItems', ['Home', [{ type: 'Separator' }, { text: 'Custom', tooltipText: 'Custom Btn' }], 20]);
                expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items .e-hscroll-content').children[20].classList).toContain('e-separator');
                expect(helper.getElementFromSpreadsheet('.e-ribbon .e-content .e-toolbar-items .e-hscroll-content').children[21].textContent).toBe('Custom');
                done();
            });
        });
    });
    describe('EJ2-61618->', () => {
        L10n.load({
            'de-DE': {
                'spreadsheet': {
                    'Home': 'Huis',
                    'Insert': 'Einfügen',
                    'Formulas': 'Formeln',
                    'View': 'Aussicht',
                }
            }
        });
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],locale: 'de-DE' }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Console Error while using "addToobarItems" in localization.', () => {
            let spreadsheet:Spreadsheet = helper.getInstance();
            spreadsheet.addToolbarItems('Home', [{ type: 'Separator' }, { text: 'Custom', tooltipText: 'Custom Btn' }], 2);
            expect(spreadsheet.ribbonModule.ribbon.items[0].header.text).toBe('Huis');
        });
    });
    describe('EJ2-63732, EJ2-946085 ->', () => {
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
        afterAll((): void => {
            helper.invoke('destroy');
        });
        it('Selected Icon in Font dropdown is not shown after choosing Comic Sans MS Font', (done: Function): void => {
            helper.click('_font_name .e-btn-icon');
            helper.click(`#${helper.id}_font_name-popup li:nth-child(7)`);
            helper.click('_font_name .e-btn-icon');
            expect(helper.getElements('.e-menu-icon')[0].classList).toContain('e-selected-icon');
            done();
        });

        it('Disabled icons gets enabled while loading a new document', (done: Function): void => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A1']);
            spreadsheet.enableToolbarItems('Home', [3, 4, 6, 9, 7, 8, 11, 13, 14, 15], false);
            spreadsheet.enableToolbarItems('Insert', [0, 1], false);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[16].disabled).toBe(false);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[17].disabled).toBe(false);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[19].disabled).toBe(false);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[20].disabled).toBe(false);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[3].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[4].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[6].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[7].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[8].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[9].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[11].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[13].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[14].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[0].content[15].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[1].content[0].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[1].content[1].disabled).toBe(true);
            expect(spreadsheet.ribbonModule.ribbon.items[1].content[3].disabled).toBe(false);
            expect(spreadsheet.activeSheetIndex).toBe(0);
            expect(spreadsheet.sheets.length).toBe(1);
            helper.click('.e-add-sheet-tab');
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                expect(spreadsheet.sheets.length).toBe(2);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[16].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[17].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[19].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[20].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[3].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[4].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[6].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[7].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[8].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[9].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[11].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[13].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[14].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[15].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[0].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[1].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[3].disabled).toBe(false);
                done();
            });
        });

        it('Disabled icons gets enabled while performing protect sheet and unprotect sheet', (done: Function): void => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('protectSheet', ['Sheet1', {}]);
            helper.invoke('goTo', ['Sheet1!A1']);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(0);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[16].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[17].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[19].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[20].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[3].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[4].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[6].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[7].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[8].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[9].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[11].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[13].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[14].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[15].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[0].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[1].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[3].disabled).toBe(true);
                helper.invoke('unprotectSheet', ['Sheet1', {}]);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[16].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[17].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[19].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[20].disabled).toBe(false);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[3].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[4].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[6].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[7].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[8].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[9].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[11].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[13].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[14].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[0].content[15].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[0].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[1].disabled).toBe(true);
                expect(spreadsheet.ribbonModule.ribbon.items[1].content[3].disabled).toBe(false);
                done();
            });
        });
    });
});
