import { getRangeAddress, SheetModel, Spreadsheet, focus, onContentScroll } from '../../../src/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { closest } from '@syncfusion/ej2-base';

describe('Spreadsheet cell navigation module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('Keyboard Navigations-I ->', () => {
        let mergeItem: HTMLElement; let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Sheet rename cancel by Space Button', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            helper.triggerKeyNativeEvent(32, false, false, helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename'));
            expect(helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename')).not.toBeNull();
            done();
        });
        it('Ctrl + Shift + Home key with vertical and horizontal scrolling', (done: Function) => {
            sheet = helper.getInstance().sheets[0];
            helper.invoke('goTo', ['AG80']);
            setTimeout(() => {
                helper.invoke('selectRange', ['AI100']);
                helper.triggerKeyNativeEvent(36, true, true);
                setTimeout(() => {
                    expect(sheet.selectedRange).toBe('AI100:A1');
                    done();
                }, 20);
            });
        });
        it('Home key', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(36);
            expect(sheet.selectedRange).toBe('A5:A5');
            helper.getInstance().selectionSettings.mode = 'Single';
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(36);
            expect(sheet.selectedRange).toBe('A5:A5');
            helper.getInstance().selectionSettings.mode = 'Multiple';
            done();
        });
        it('Ctrl + Home key', (done: Function) => {
            helper.invoke('selectRange', ['H5']);
            helper.triggerKeyNativeEvent(36, true);
            expect(sheet.selectedRange).toBe('A1:A1');
            done();
        });
        it('Shift + Home key', (done: Function) => {
            helper.invoke('selectRange', ['H6']);
            expect(sheet.selectedRange).toBe('H6:H6');
            mergeItem = closest(helper.getElement(`#${helper.id}_merge`), '.e-toolbar-item') as HTMLElement;
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.triggerKeyNativeEvent(36, false, true);
            expect(sheet.selectedRange).toBe('H6:A6');
            expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
            done();
        });
        it('Ctrl + End key', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            helper.triggerKeyNativeEvent(35, true);
            expect(sheet.selectedRange).toBe('H11:H11');
            done();
        });
        it('Ctrl + Shift + End key', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(35, true, true);
            expect(sheet.selectedRange).toBe('B2:H11');
            done();
        });
        it('Shift + Space key for row selection', (done: Function) => {
            helper.invoke('selectRange', ['C5']);
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.triggerKeyNativeEvent(32, false, true);
            expect(sheet.selectedRange).toBe('A5:CV5');
            expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
            done();
        });
        it('Ctrl + Space key for column selection', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.triggerKeyNativeEvent(32, true);
            expect(sheet.selectedRange).toBe('C1:C100');
            expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
            done();
        });
        it('Ctrl + Shift + Down arrow key for selection', (done: Function) => {
            helper.invoke('selectRange', ['E4']);
            helper.triggerKeyNativeEvent(46);
            helper.invoke('selectRange', ['E1']);
            helper.triggerKeyNativeEvent(40, true, true);
            expect(sheet.selectedRange).toBe('E1:E3');
            helper.triggerKeyNativeEvent(40, true, true);
            expect(sheet.selectedRange).toBe('E1:E5');
            helper.triggerKeyNativeEvent(40, true, true);
            expect(sheet.selectedRange).toBe('E1:E11');
            done();
        });
        it('Ctrl + Shift + Right arrow key for selection', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.triggerKeyNativeEvent(39, true, true);
            expect(sheet.selectedRange).toBe('C4:D4');
            helper.triggerKeyNativeEvent(39, true, true);
            expect(sheet.selectedRange).toBe('C4:F4');
            helper.triggerKeyNativeEvent(39, true, true);
            expect(sheet.selectedRange).toBe('C4:H4');
            done();
        });
        it('Ctrl + Shift + Up arrow key for selection', (done: Function) => {
            helper.invoke('selectRange', ['E11']);
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.triggerKeyNativeEvent(38, true, true);
            expect(sheet.selectedRange).toBe('E11:E5');
            expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
            helper.triggerKeyNativeEvent(38, true, true);
            expect(sheet.selectedRange).toBe('E11:E3');
            helper.triggerKeyNativeEvent(38, true, true);
            expect(sheet.selectedRange).toBe('E11:E1');
            done();
        });
        it('Ctrl + Shift + Left arrow key for selection', (done: Function) => {
            helper.invoke('selectRange', ['H4']);
            helper.triggerKeyNativeEvent(37, true, true);
            expect(sheet.selectedRange).toBe('H4:F4');
            helper.triggerKeyNativeEvent(37, true, true);
            expect(sheet.selectedRange).toBe('H4:D4');
            helper.triggerKeyNativeEvent(37, true, true);
            expect(sheet.selectedRange).toBe('H4:A4');
            done();
        });
        it('Ctrl + Down arrow key for navigation', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.triggerKeyNativeEvent(40, true);
            expect(sheet.selectedRange).toBe('E3:E3');
            helper.triggerKeyNativeEvent(40, true);
            expect(sheet.selectedRange).toBe('E5:E5');
            helper.triggerKeyNativeEvent(40, true);
            expect(sheet.selectedRange).toBe('E11:E11');
            helper.triggerKeyNativeEvent(40, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('E100:E100');
                done();
            }, 20);
        });
        it('Ctrl + Right arrow key for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.triggerKeyNativeEvent(39, true);
            expect(sheet.selectedRange).toBe('D4:D4');
            helper.triggerKeyNativeEvent(39, true);
            expect(sheet.selectedRange).toBe('F4:F4');
            helper.triggerKeyNativeEvent(39, true);
            expect(sheet.selectedRange).toBe('H4:H4');
            helper.triggerKeyNativeEvent(39, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('CV4:CV4'); done();
            }, 20);
        });
        it('Ctrl + Up arrow key for navigation', (done: Function) => {
            helper.invoke('selectRange', ['E11']);
            helper.triggerKeyNativeEvent(38, true);
            expect(sheet.selectedRange).toBe('E5:E5');
            helper.triggerKeyNativeEvent(38, true);
            expect(sheet.selectedRange).toBe('E3:E3');
            helper.triggerKeyNativeEvent(38, true);
            expect(sheet.selectedRange).toBe('E1:E1');
            done();
        });
        it('Ctrl + Left arrow key for navigation', (done: Function) => {
            helper.invoke('selectRange', ['H4']);
            helper.triggerKeyNativeEvent(37, true);
            expect(sheet.selectedRange).toBe('F4:F4');
            helper.triggerKeyNativeEvent(37, true);
            expect(sheet.selectedRange).toBe('D4:D4');
            helper.triggerKeyNativeEvent(37, true);
            expect(sheet.selectedRange).toBe('A4:A4');
            done();
        });
        it('Shift + Up Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A2:A1');
                expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
                helper.triggerKeyNativeEvent(40, false, true);
                expect(sheet.selectedRange).toBe('A2:A2');
                expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
                done();
            }, 20);
        });
        it('Shift + Up Arrow Button in TopLeft Cell for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A1:A1');
                done();
            }, 20);
        });
        it('Shift + Up Arrow Button in Merged Cell for Selection', (done: Function) => {
            helper.invoke('merge', ['E5:E6']);
            helper.invoke('selectRange', ['E5']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('E6:E4');
                done();
            }, 20);
        });
        it('Shift + Down Arrow Button in Merged Cell for Selection', (done: Function) => {
            helper.invoke('selectRange', ['F6:F5']);
            helper.invoke('merge', ['F6:F5']);
            helper.triggerKeyNativeEvent(40, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('F5:F7');
                done();
            }, 20);
        });
        it('Shift + Right Arrow Button with Merged cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['D7:C7']);
            helper.invoke('merge', ['D7:C7']);  
            helper.triggerKeyNativeEvent(39, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('C7:E7');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['B5']);
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('B5:A5');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button in First Column Left Cell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A5:A5');
                done();
            }, 20);
        });
        it('Shift + Left Arrow Button with Merged cell for Navigation', (done: Function) => {
            helper.invoke('merge', ['C8:D8']);
            helper.invoke('selectRange', ['C8']);
            const mergeBtn: HTMLElement = helper.getElement(`#${helper.id}_merge`);
            expect(mergeBtn.classList.contains('e-active')).toBeTruthy();
            expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
            helper.triggerKeyNativeEvent(37, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('D8:B8');
                expect(mergeBtn.classList.contains('e-active')).toBeFalsy();
                expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
                helper.triggerKeyNativeEvent(39, false, true);
                expect(sheet.selectedRange).toBe('D8:C8');
                expect(mergeBtn.classList.contains('e-active')).toBeTruthy();
                expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
                done();
            }, 20);
        });
        it('Left Arrow Button in TopLeftCell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Shift + Enter Button in TopLeftCell for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.triggerKeyNativeEvent(13, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Shift + Enter Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(13, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A1:A1');
                done();
            }, 20);
        });
        it('Tab key with Column Merged cell for Navigation', (done: Function) => {
            helper.invoke('merge', ['A3:B3']);
            helper.invoke('selectRange', ['A3']);
            helper.triggerKeyNativeEvent(9);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('C3:C3');
                done();
            }, 10);
        });
        it('Shift + Tab key with Column Merged cell for Navigation', (done: Function) => {
            helper.triggerKeyNativeEvent(9, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A3:B3');
                done();
            }, 20);
        });
        it('Down arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('hideRow', [2]);
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A4:A4');
                done();
            }, 10);
        });
        it('Shift + Down arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(40, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A2:B4');
                done();
            }, 10);
        });
        it('Up arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A2:A2');
                done();
            }, 20);
        });
        it('Shift + Up arrow Button with Hidden Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.triggerKeyNativeEvent(38, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('B4:A2');
                done();
            }, 20);
        });
        it('Up arrow Button with Hidden Row in Top Most Row for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.invoke('hideRow', [0]);
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A2:A2');
                done();
            }, 10);
        });
        it('Right arrow Button with Hidden Column for Navigation', (done: Function) => {
            helper.invoke('hideColumn', [2]);
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('D2:D2');
                done();
            }, 10);
        });
        it('Left arrow Button with Hidden Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('B2:B2');
                done();
            }, 20);
        });
        it('Left arrow Button with Hidden Column in Top Most Column for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.invoke('hideColumn', [0]);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('Page Down Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(34);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A23:A23');
                done();
            }, 50);
        });
        it('Page Up Button for Navigation', (done: Function) => {
            helper.invoke('selectRange', ['G15']);
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(33);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('G2:G2');
                done();
            }, 50);
        });

        it('Shift + Page Up Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['G15']);
            helper.triggerKeyNativeEvent(33, false, true);
            expect(sheet.selectedRange).toBe('G15:G2');
            done();
        });
        it('Shift + Page Down Button for Selection', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            expect(mergeItem.classList.contains('e-overlay')).toBeTruthy();
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(34, false, true);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('A5:A26');
                expect(mergeItem.classList.contains('e-overlay')).toBeFalsy();
                done();
            }, 50);
        });
        it('Insert function using shift+F3', (done: Function) => {
            helper.invoke('selectRange', ['A6']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.isEdit).toBeFalsy();
            helper.triggerKeyNativeEvent(114, false, true);
            setTimeout(() => {
                expect(spreadsheet.isEdit).toBeFalsy();
                const dialog: HTMLElement = helper.getElement('.e-spreadsheet-function-dlg.e-dialog');
                expect(dialog).not.toBeNull();
                helper.click('.e-spreadsheet-function-dlg.e-dialog .e-list-item:nth-child(4)');
                helper.setAnimationToNone('.e-spreadsheet-function-dlg.e-dialog');
                helper.click('.e-spreadsheet-function-dlg.e-dialog .e-footer-content .e-primary');
                expect(spreadsheet.isEdit).toBeTruthy();
                helper.invoke('closeEdit');
                done();
            });
        });
        it('Ctrl + F6 to navigate between each part in spreadsheet', (done: Function) => {
            focus(helper.getInstance().element);
            helper.triggerKeyNativeEvent(117, true, false);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(117, true, false, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(closest(document.activeElement, '.e-ribbon')).not.toBeNull();
            helper.triggerKeyNativeEvent(117, true, false, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-combobox')).toBeTruthy();
            expect(closest(document.activeElement, '.e-name-box')).not.toBeNull();
            helper.triggerKeyNativeEvent(117, true, false, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-selectall')).toBeTruthy();
            done();
        });
        it('Ctrl + Shift + F6 to navigate between each part in spreadsheet', (done: Function) => {
            helper.triggerKeyNativeEvent(117, true, true);
            expect(document.activeElement.classList.contains('e-combobox')).toBeTruthy();
            expect(closest(document.activeElement, '.e-name-box')).not.toBeNull();
            helper.triggerKeyNativeEvent(117, true, true, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toBeTruthy();
            expect(closest(document.activeElement, '.e-ribbon')).not.toBeNull();
            helper.triggerKeyNativeEvent(117, true, true, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(117, true, true, null, 'keydown', false, <HTMLElement>document.activeElement);
            expect(document.activeElement.classList.contains('e-selectall')).toBeTruthy();
            done();
        });
        it('Tab and Shift + Tab navigation inside sheet tabs', (done: Function) => {
            helper.invoke('insertSheet', [1, 5]);
            (helper.getElementFromSpreadsheet('.e-add-sheet-tab') as HTMLButtonElement).disabled = false;
            focus(helper.getInstance().element);
            helper.triggerKeyNativeEvent(117, true);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            focus(helper.getElement('.e-sheet-tab-panel .e-sheets-list'));
            const sheetTabs: HTMLElement[] = [].slice.call(helper.getElements('.e-sheet-tab-panel .e-toolbar-item'));
            const firstTab: HTMLElement = sheetTabs.splice(0, 1)[0];
            focus(firstTab.querySelector('.e-tab-wrap'));
            sheetTabs.forEach((sheetTab: HTMLElement, index: number): void => {
                helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
                expect(sheetTabs.indexOf(document.activeElement.parentElement)).toBe(index);
            });
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(sheetTabs.indexOf(document.activeElement.parentElement)).toBe(sheetTabs.length - 1);
            sheetTabs.unshift(firstTab);
            sheetTabs.splice(sheetTabs.length - 1, 1);
            sheetTabs.reverse().forEach((sheetTab: HTMLElement, index: number): void => {
                helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
                expect(sheetTabs.indexOf(document.activeElement.parentElement)).toBe(index);
            });
            done();
        });
        it('Tab and Shift + Tab navigation inside the scrollable sheet tabs', (done: Function) => {
            helper.invoke('insertSheet', [6, 9]);
            const sheetTabs: HTMLElement[] = [].slice.call(helper.getElements('.e-sheet-tab-panel .e-toolbar-item'));
            focus(sheetTabs[sheetTabs.length - 1].querySelector('.e-tab-wrap'));
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-left-nav')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-right-nav')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-right-nav')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-left-nav')).toBeTruthy();
            helper.invoke('selectRange', ['D2:E4']);
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-right-nav')).toBeTruthy();
            focus(helper.getElementFromSpreadsheet('.e-aggregate-list'));
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-add-sheet-tab')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-aggregate-list')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-scroll-right-nav')).toBeTruthy();
            done();
        });
        it('Enter key action in scoll nav button in the sheet tabs', (done: Function) => {
            const scrollNav: HTMLElement = helper.getElementFromSpreadsheet('.e-sheet-tab-panel .e-scroll-left-nav');
            expect(scrollNav.getAttribute('tabindex')).toBe('0');
            focus(scrollNav);
            helper.triggerKeyNativeEvent(13, false, true, null, 'keyup', false, document.activeElement);
            scrollNav.removeAttribute('tabindex');
            setTimeout((): void => {
                expect(document.activeElement.classList.contains('e-scroll-left-nav')).toBeTruthy();
                expect(scrollNav.getAttribute('tabindex')).toBe('0');
                done();
            });
        });
        it('Tab and Shift + Tab navigation inside the ribbon', (done: Function) => {
            helper.triggerKeyNativeEvent(18, false, false, null, 'keydown', true);
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_undo`);
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_undo`);
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            done();
        });
        it('Left and right navigation inside the ribbon toolbar', (done: Function) => {
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_undo`);
            const ele: HTMLElement = helper.getElementFromSpreadsheet('.e-content .e-toolbar');
            helper.triggerKeyNativeEvent(39, false, false, ele, 'keyup', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_cut`);
            helper.triggerKeyNativeEvent(39, false, false, ele, 'keyup', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_copy`);
            helper.triggerKeyNativeEvent(39, false, false, ele, 'keyup', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_number_format`);
            helper.triggerKeyNativeEvent(40, false, false, document.activeElement, 'keydown', true, document.activeElement);
            expect(document.activeElement.getAttribute('ARIA-label')).toBe('Number Format');
            expect(document.activeElement.parentElement.id).toBe(`${helper.id}_number_format-popup`);
            helper.triggerKeyNativeEvent(38, false, false, document.activeElement.parentElement, 'keydown', true, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_number_format`);
            helper.triggerKeyNativeEvent(37, false, false, ele, 'keyup', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_copy`);
            focus(helper.getElementFromSpreadsheet(`#${helper.id}_underline`));
            helper.triggerKeyNativeEvent(39, false, false, ele, 'keyup', false, document.activeElement);
            helper.triggerKeyNativeEvent(39, false, false, null, 'keyup', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-split-colorpicker')).toBeTruthy();
            helper.triggerKeyNativeEvent(39, false, false, ele, 'keyup', false, document.activeElement);
            helper.triggerKeyNativeEvent(39, false, false, null, 'keyup', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-split-colorpicker')).toBeTruthy();
            expect(document.activeElement.getAttribute('ARIA-label')).toBe('Fill Color #ffff00');
            helper.triggerKeyNativeEvent(37, false, false, ele, 'keyup', false, document.activeElement);
            helper.triggerKeyNativeEvent(37, false, false, null, 'keyup', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-split-colorpicker')).toBeTruthy();
            expect(document.activeElement.getAttribute('ARIA-label')).toBe('Text Color #000000');
            done();
        });
        it('Testing keyboard navigation after hiding toolbar items in ribbon tab ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.hideToolbarItems('Home', [0, 1, 2, 3]);
            helper.triggerKeyNativeEvent(18, false, false, null, 'keydown', true);
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_copy`);
            done();
        });
        it('Shift + Tab navigation after hiding toolbar items in ribbon tab', (done: Function) => {
            helper.triggerKeyNativeEvent(18, false, false, null, 'keydown', true);
            helper.triggerKeyNativeEvent(18, false, false, null, 'keydown', true);
            expect(document.activeElement.querySelector('.e-tab-text').textContent).toBe('Home');
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.classList.contains('e-drop-icon')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, document.activeElement);
            expect(document.activeElement.id).toBe(`${helper.id}_copy`);
            done();
        });
    });

    describe('Keyboard Navigation with Locked and Unlocked cells ->', () => {
        let sheet: SheetModel;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], 
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.protectSheet(
                        'Sheet1', { selectCells: false, selectUnLockedCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        
        it('Right arrow Button in last used column cell for navigation', (done: Function) => {
            sheet = helper.getInstance().sheets[0];
            helper.invoke('lockCells', ['B2:D5', false]);
            expect(sheet.selectedRange).toBe('A1:A1');
            helper.invoke('selectRange', ['H11']);
            expect(sheet.selectedRange).toBe('A1:A1');
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(sheet.selectedRange).toBe('B2:B2');
                done();
            }, 100);
        });
        it('Right arrow Button in the last unlocked Row cell for navigation', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            expect(sheet.selectedRange).toBe('D5:D5');
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 100);
        });
        it('Right arrow button in the last unlocked column cell for navigation', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.triggerKeyNativeEvent(39);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B4:B4');
                done();
            }, 100);
        });
        it('Left arrow button from first unlocked column for navigation', (done: Function) => {
            helper.invoke('selectRange', ['B3']);
            helper.triggerKeyNativeEvent(37);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
                done();
            }, 100);
        });
        it('Down arrow Button in last unlocked row for navigation', (done: Function) => {
            helper.invoke('selectRange', ['B5']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C2:C2');
                done();
            }, 100);
        });
        it('Down arrow Button in last unlocked row and column cell for navigation', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 100);
        });
        it('Up arrow Button in the first unlocked row and column cell for navigation', (done: Function) => {
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D5:D5');
                done();
            }, 100);
        });
    });

    describe('Dependent features using keyboard actions ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A2:A2' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        const navigateMenuItemAndSelect: (row: number, col: number, countArr: number[], isRowHdr?: boolean, isColHdr?: boolean) => void =
            (row: number, col: number, countArr: number[], isRowHdr?: boolean, isColHdr?: boolean) => {
            helper.openAndClickCMenuItem(row, col, null, isRowHdr, isColHdr);
            const cMenuWrapper: HTMLElement = document.activeElement.parentElement as HTMLElement;
            countArr.forEach((count: number, index: number) => {
                while (count) {
                    helper.triggerKeyNativeEvent(40, false, false, cMenuWrapper, 'keyup');
                    count--;
                }
                if (countArr.length - 1 === index) {
                    helper.triggerKeyNativeEvent(13, false, false, cMenuWrapper, 'keyup');
                } else {
                    const focuedItem: HTMLElement = cMenuWrapper.querySelector('.e-menu-item.e-focused') as HTMLElement;
                    focuedItem.classList.add('e-selected');
                    helper.triggerKeyNativeEvent(39, false, false, cMenuWrapper, 'keyup');
                }
            });
        };
        it ('Cut/paste cell using context menu', (done: Function) => {
            spreadsheet = helper.getInstance();
            focus(spreadsheet.element);
            helper.setAnimationToNone(`#${helper.id}_contextmenu`);
            helper.triggerKeyNativeEvent(121, false, true);
            expect(document.activeElement.textContent).toBe('2/14/2014');
            navigateMenuItemAndSelect(1, 0, [1]);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                expect(spreadsheet.clipboardModule.copiedInfo.isCut).toBeTruthy();
                expect(spreadsheet.clipboardModule.copiedInfo.range[0]).toBe(1);
                expect(spreadsheet.clipboardModule.copiedInfo.range[1]).toBe(0);
                helper.invoke('selectRange', ['A7']);
                navigateMenuItemAndSelect(6, 0, [3]);
                expect(spreadsheet.sheets[0].rows[6].cells[0].value).toBe('Casual Shoes');
                expect(spreadsheet.sheets[0].rows[1].cells[0]).toBeNull();
                done();
            });
        });
        it ('Copy/paste cell using context menu', (done: Function) => {
            navigateMenuItemAndSelect(6, 0, [2]);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                expect(spreadsheet.clipboardModule.copiedInfo.isCut).toBeFalsy();
                expect(spreadsheet.clipboardModule.copiedInfo.range[0]).toBe(6);
                expect(spreadsheet.clipboardModule.copiedInfo.range[1]).toBe(0);
                helper.invoke('selectRange', ['A2']);
                navigateMenuItemAndSelect(1, 0, [3]);
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                helper.triggerKeyNativeEvent(27);
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).toBeNull();
                done();
            });
        });
        it ('Apply and clear filter using context menu', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [3, 0]);
            setTimeout(() => {
                const checkFilterCases: Function = () => {
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(1);
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].value).toBe('Casual Shoes');
                    expect(spreadsheet.sheets[0].rows[1].isFiltered).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[6].isFiltered).toBeUndefined();
                };
                checkFilterCases();
                navigateMenuItemAndSelect(1, 0, [3, 1]);
                setTimeout(() => {
                    checkFilterCases();
                    navigateMenuItemAndSelect(1, 0, [3, 0]);
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(0);
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeFalsy();
                    done();
                });
            });
        });
        it ('Sort Ascending', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [4, 0]);
            setTimeout(() => {
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Casual Shoes');
                    expect(spreadsheet.sheets[0].rows[3].cells[0].value).toBe('Cricket Shoes');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Flip- Flops & Slippers');
                    expect(spreadsheet.sheets[0].rows[10].cells[0].value).toBe('T-Shirts');
                    helper.triggerKeyNativeEvent(90, true);
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
                    done();
                });
            });
        });
        it ('Sort Descending', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [4, 1]);
            setTimeout(() => {
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('T-Shirts');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Running Shoes');
                    expect(spreadsheet.sheets[0].rows[10].cells[0].value).toBe('Casual Shoes');
                    helper.triggerKeyNativeEvent(90, true);
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
                    done();
                });
            });
        });
        it ('Apply hyperlink', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [6]);
            setTimeout(() => {
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                const urlInput: HTMLInputElement = helper.getElementFromSpreadsheet(
                    '.e-hyperlink-dlg .e-webpage').lastElementChild.querySelector('.e-text');
                focus(urlInput);
                urlInput.value = 'https://www.syncfusion.com/';
                helper.triggerKeyNativeEvent(39, false, false, null, 'keyup', false, urlInput);
                helper.getElementFromSpreadsheet('.e-hyperlink-dlg .e-footer-content .e-primary').click();
                expect(spreadsheet.sheets[0].rows[1].cells[0].hyperlink.address).toBe('https://www.syncfusion.com/');
                expect(helper.invoke('getCell', [1, 0]).querySelector('.e-hyperlink')).not.toBeNull();
                done();
            });
        });
        it ('Edit and remove hyperlink', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [6]);
            setTimeout(() => {
                helper.setAnimationToNone('.e-edithyperlink-dlg.e-dialog');
                const urlInput: HTMLInputElement = helper.getElementFromSpreadsheet(
                    '.e-edithyperlink-dlg .e-webpage').lastElementChild.querySelector('.e-text');
                urlInput.value = 'https://www.google.com/';
                helper.getElementFromSpreadsheet('.e-edithyperlink-dlg .e-footer-content .e-primary').click();
                expect(spreadsheet.sheets[0].rows[1].cells[0].hyperlink.address).toBe('https://www.google.com/');
                const cell: HTMLElement = helper.invoke('getCell', [1, 0]);
                expect(cell.querySelector('.e-hyperlink')).not.toBeNull();
                navigateMenuItemAndSelect(1, 0, [8]);
                expect(spreadsheet.sheets[0].rows[1].cells[0].hyperlink).toBeUndefined();
                expect(cell.querySelector('.e-hyperlink')).toBeNull();
                done();
            });
        });
        it ('Hide/show column', (done: Function) => {
            focus(spreadsheet.element);
            helper.invoke('selectRange', ['B1']);
            helper.triggerKeyNativeEvent(32, true);
            navigateMenuItemAndSelect(0, 1, [5], false, true);
            expect(spreadsheet.sheets[0].columns[1].hidden).toBeTruthy();
            navigateMenuItemAndSelect(0, 1, [6], false, true);
            expect(spreadsheet.sheets[0].columns[1].hidden).toBeFalsy();
            done();
        });
        it ('Delete column', (done: Function) => {
            navigateMenuItemAndSelect(0, 1, [4], false, true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].usedRange.colIndex).toBe(6);
                expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('Time');
                helper.triggerKeyNativeEvent(90, true);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].usedRange.colIndex).toBe(7);
                    expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('Date');
                    done();
                });
            });
        });
        it ('Insert column', (done: Function) => {
            navigateMenuItemAndSelect(0, 1, [3, 0], false, true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].usedRange.colIndex).toBe(8);
                expect(spreadsheet.sheets[0].rows[0].cells[1]).toBeNull();
                expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('Date');
                helper.triggerKeyNativeEvent(90, true);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].usedRange.colIndex).toBe(7);
                    expect(spreadsheet.sheets[0].rows[0].cells[1].value).toBe('Date');
                    expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('Time');
                    done();
                });
            });
        });
        it ('Hide/show row', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(32, false, true);
            navigateMenuItemAndSelect(1, 0, [5], true);
            expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
            navigateMenuItemAndSelect(1, 0, [6], true);
            expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
            done();
        });
        it ('Delete row', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [4], true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].usedRange.rowIndex).toBe(9);
                expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Sports Shoes');
                helper.triggerKeyNativeEvent(90, true);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].usedRange.rowIndex).toBe(10);
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                    done();
                });
            });
        });
        it ('Insert row', (done: Function) => {
            navigateMenuItemAndSelect(1, 0, [3, 0], true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].usedRange.rowIndex).toBe(11);
                expect(spreadsheet.sheets[0].rows[1].cells).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Casual Shoes');
                helper.triggerKeyNativeEvent(90, true);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].usedRange.rowIndex).toBe(10);
                    expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
                    done();
                });
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('F164825, EJ2-850507 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ allowScrolling: false }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Cell navigation does not work without scrolling', (done: Function) => {
                helper.getElement().focus();
                helper.triggerKeyNativeEvent(39);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
                helper.triggerKeyNativeEvent(40);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                helper.triggerKeyNativeEvent(37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                helper.triggerKeyNativeEvent(38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
            it('Formula selection not worked properly while selecting the cells using Shift+Down arrow key', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.invoke('startEdit');
                helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '=SUM(', refreshCurPos: true, refreshEditorElem: true });
                const td: HTMLElement = helper.invoke('getCell', [0, 2]);
                const coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top }, document, td);
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=SUM(C1')
                helper.triggerKeyNativeEvent(40, false, true);
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=SUM(C1:C2');
                done();
            });
        });
        describe('EJ2-929110 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Shift plus arrow key navigation is not working properly in RTL mode', (done: Function) => {
                helper.setModel('enableRtl', true);
                setTimeout(() => {
                    helper.invoke('selectRange', ['H5']);
                    helper.triggerKeyNativeEvent(37, false, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:I5');
                    helper.invoke('selectRange', ['H5']);
                    helper.triggerKeyNativeEvent(39, false, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:G5');
                    helper.invoke('selectRange', ['A5']);
                    helper.triggerKeyNativeEvent(37, true, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:H5');
                    helper.invoke('selectRange', ['H5']);
                    helper.triggerKeyNativeEvent(39, true, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:A5');
                    helper.invoke('selectRange', ['A5']);
                    helper.triggerKeyNativeEvent(37, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H5:H5');
                    helper.invoke('selectRange', ['H5']);
                    helper.triggerKeyNativeEvent(39, true);
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A5');
                    done();
                });
            });
        })
        describe('I348582, EJ2-60424 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ isProtected: true, protectSettings: { selectCells: true } }] }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Shift selection on whole row makes scroll right even it is in viewport', (done: Function) => {
                helper.invoke('selectRange', [getRangeAddress([4, 0, 4, helper.getInstance().sheets[0].colCount - 1])]);
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 40, null, false, true);
                expect(helper.getContentElement().parentElement.scrollLeft).toBe(0);
                done();
            });

            it('Pressing left/up key on 0th column/row throws script error on protected sheet', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.triggerKeyEvent('keydown', 37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                helper.triggerKeyEvent('keydown', 38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        describe('SF-360092 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ index: 3, value: '20', validation: { ignoreBlank: true, inCellDropDown: true,
                        operator: 'Between', type: 'List', value1: '10,20,30', value2: '' } }] }], selectedRange: 'D1:D1' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell navigation occurs while selecting cell template dropdown items', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(cell.firstElementChild.classList.contains('e-validation-list')).toBeTruthy();
                const ddl: HTMLElement = cell.getElementsByClassName('e-ddl')[0] as HTMLElement;
                ddl.focus();
                helper.getInstance('#' + helper.id + 'listValid').showPopup();
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.triggerKeyEvent('keydown', 40, null, false, true, ddl);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.getElement('#' + helper.id + 'listValid_popup .e-list-item').click();
                expect(document.activeElement.classList.contains('e-spreadsheet')).toBeTruthy();
                done();
            });
        });

        describe('EJ2-59225 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rowCount: 3, colCount: 3, selectedRange: 'B2:C3' }], scrollSettings: { isFinite: true } }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The spreadsheet selection moves away from the spreadsheet table when we move it with the keyboard', (done: Function) => {
                const selectionEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-selection');
                const autofillEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-autofill');
                const table: HTMLElement = helper.invoke('getContentTable');
                const height: number = table.offsetHeight; const width: number = table.offsetWidth;
                const instance: any = helper.getInstance();
                const checkFn: Function = (): void => {
                    expect(instance.sheets[0].selectedRange).toBe('B2:C3');
                    expect(parseInt(selectionEle.style.height, 10)).toBeLessThan(height);
                    expect(parseInt(autofillEle.style.top, 10)).toBeLessThan(height);
                    expect(parseInt(selectionEle.style.width, 10)).toBeLessThan(width);
                    expect(parseInt(autofillEle.style.left, 10)).toBeLessThan(width);
                };
                checkFn()
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, true);
                setTimeout(() => {
                    checkFn();
                    helper.triggerKeyEvent('keydown', 40, null, false, true);
                    setTimeout(() => {
                        checkFn();
                        done();
                    });
                });
            });
        });
        describe('EJ2-59905 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rowCount: 10, colCount: 26, selectedRange: 'A10:A10', rows: [{ index: 4, hidden: true }, { index: 5, hidden: true }, { index: 6, hidden: true }] }], height: 300, scrollSettings: { isFinite: true }} , done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Keyboard selection issue in finite mode', (done: Function) => {
                const instance: any = helper.getInstance();
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, false);
                setTimeout(() => {
                    expect(instance.sheets[0].selectedRange).toBe('B10:B10');
                    done();
                }, 50);
            });
        });
    });
    describe('EJ2-60990 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ showHeaders: false ,rowCount: 5 , selectedRange: 'C4:C4'}], scrollSettings: { isFinite: true } }, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('When showheader is false and in finite mode, Keyboard navigation is not working - bottom', (done: Function) => {
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C5:C5');
                done();
            }, 50);
        });
        it('When showheader is false and in finite mode, Keyboard navigation is not working - right', (done: Function) => {
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C4:C4');
                done();
            }, 50);
        });
    });

    describe('Testing keyboard navigation with protect sheet->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }], scrollSettings: { enableVirtualization: false, isFinite: true } }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Hide Row and Column in Protect Sheet.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: false, formatRows: true, formatColumns: true, formatCells: true });
            setTimeout(() => {
                helper.triggerKeyNativeEvent(36, false, false);
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    spreadsheet.protectSheet('Sheet1', { selectCells: false, formatRows: false, formatColumns: false, formatCells: false });
                    done();
                });
            });
        });
        it('Name box Shitf + Tab Navigation', (done: Function) => {
            helper.setModel('enableRtl', true);
            setTimeout(() => {
                let nameBox: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('#' + helper.id + '_name_box');
                nameBox.click();
                nameBox.value = 'TestName';
                helper.triggerKeyEvent('keydown', 9, null, false, true, nameBox);
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            }, 20);
        });
        it('Home key Navigation with freeze panes', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2, 3)
            setTimeout(() => {
                helper.invoke('selectRange', ['E5']);
                helper.triggerKeyEvent('keydown', 36, null, false, false, null);
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Shift + Home key Navigation with freeze panes', (done: Function) => {
            helper.setModel('enableRtl', true);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2, 3)
            setTimeout(() => {
                helper.invoke('selectRange', ['D5']);
                helper.triggerKeyEvent('keydown', 36, null, false, true, null);
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Alt + End key Navigation', (done: Function) => {
            helper.invoke('selectRange', ['F6']);
            helper.triggerKeyNativeEvent(40, false, false, null, null, true);
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
    });

    describe('Keyboard navigation with Freeze pane->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], topLeftCell: 'C3', frozenColumns: 5, frozenRows: 5, selectedRange: 'C3:C3', paneTopLeftCell: 'F6' }],
                 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Navigate upward in the freeze pane', function (done) {
            focus(helper.getElement());
            helper.triggerKeyEvent('keydown', 38, null, null, false, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            helper.triggerKeyEvent('keydown', 37, null, null, false, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            done();
        });
        it('Navigate with ctrl key in the freeze pane', function (done) {
            focus(helper.getElement());
            helper.triggerKeyEvent('keydown', 38, null, true, false, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            helper.triggerKeyEvent('keydown', 37, null, true, false, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            done();
        });
        it('Navigate with shift key in the freeze pane', function (done) {
            focus(helper.getElement());
            helper.triggerKeyEvent('keydown', 38, null, false, true, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            helper.triggerKeyEvent('keydown', 37, null, false, true, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            done();
        });
        it('Navigate with ctrl and shift key in the freeze pane', function (done) {
            focus(helper.getElement());
            helper.triggerKeyEvent('keydown', 38, null, true, true, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            helper.triggerKeyEvent('keydown', 37, null, true, true, helper.invoke('getCell', [2, 2]));
            expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C3');
            done();
        });
    });
});
