/**
 * Table module spec
 */
import { addClass, Browser, closest, createElement, isNullOrUndefined, detach } from "@syncfusion/ej2-base";
import { RichTextEditor, dispatchEvent, DialogType } from "../../../src/rich-text-editor/index";
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { NodeSelection } from '../../../src/selection/index';
import { renderRTE, destroy, setCursorPoint, androidUA, iPhoneUA, currentBrowserUA, ieUA } from './../render.spec';
import { getLastTextNode } from "../../../src/common/util";
import { ARROW_DOWN_EVENT_INIT, ARROW_LEFT_EVENT_INIT, ARROW_UP_EVENT_INIT, ARROWRIGHT_EVENT_INIT, BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ESCAPE_KEY_EVENT_INIT, INSRT_TABLE_EVENT_INIT, SHIFT_ARROW_DOWN_EVENT_INIT, SHIFT_ARROW_LEFT_EVENT_INIT, SHIFT_ARROW_RIGHT_EVENT_INIT, SHIFT_ARROW_UP_EVENT_INIT } from "../../constant.spec";


describe('Table Module', () => {

    describe('CSS property change testing, Coverage improvement ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({toolbarSettings: {
                items: ['CreateTable']
            }});
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it ('Update the CSS property dynamically Dialog test', () => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_TABLE_EVENT_INIT));
            editor.cssClass = 'crm-editor';
            editor.dataBind();
            expect(editor.tableModule.editdlgObj.cssClass.includes('crm-editor')).toBe(true);
            editor.cssClass = 'internal-process-editor';
            editor.dataBind();
            expect(editor.tableModule.editdlgObj.cssClass.includes('internal-process-editor')).toBe(true);
        });

        it ('For coverage', () => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            window.getSelection().removeAllRanges();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement.firstChild.firstChild, 0);
            range.setEnd(editor.inputElement.firstChild.firstChild, 0);
            document.getSelection().addRange(range);
            (editor.tableModule as any).getBrElement(range, []);
        });

        it ('Update the CSS property dynamically Popup test', () => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            (editor.element.querySelector('.e-create-table') as HTMLElement).click()
            editor.cssClass = 'crm-editor';
            editor.dataBind();
            expect(editor.tableModule.popupObj.element.className.includes('crm-editor')).toBe(true);
            editor.cssClass = 'internal-process-editor';
            editor.dataBind();
            expect(editor.tableModule.popupObj.element.className.includes('internal-process-editor')).toBe(true);
        });

        it ('For coverage', () => {
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 100%;"><br></td></tr></tbody></table><p><br></p>`;
            editor.dataBind();
            (editor.tableModule as any).removeTableSelection();
        });

        it ('focus of the table cells and then arrow key action to navigate.', () => {
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`;
            editor.dataBind();
            editor.focusIn();
            document.getSelection().removeAllRanges();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().addRange(range);
            (editor.tableModule as any).previousTableElement = editor.inputElement.querySelector('table');
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ARROWRIGHT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ARROWRIGHT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ARROW_LEFT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ARROW_LEFT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ARROW_DOWN_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', ARROW_UP_EVENT_INIT));
            (editor.tableModule as any).closeDialog();
        });

        it ('focus of the table cells and then shift + arrow keys to select cells.', (done: DoneFn) => {
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`;
            editor.dataBind();
            editor.focusIn();
            document.getSelection().removeAllRanges();
            let range: Range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_RIGHT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_RIGHT_EVENT_INIT));
            range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_LEFT_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_LEFT_EVENT_INIT));
            range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_DOWN_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_DOWN_EVENT_INIT));
            range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_UP_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_UP_EVENT_INIT));
            (editor.tableModule as any).resetTableSelection ();
            (editor.tableModule as any).deleteTable();
            done();
        });
    });

    describe('div content ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
                },
                tableSettings: {
                    width: '100%',
                    styles: [
                        {
                            text: 'Dashed Borders',
                            command: 'Table',
                            subCommand: 'Dashed',
                            cssClass: 'e-dashed-test'
                        },
                        {
                            text: 'Alterte Rows',
                            command: 'Table',
                            subCommand: 'Alternate',
                            cssClass: 'e-alternate-test'
                        },
                        {
                            text: 'No border',
                            command: 'Table',
                            subCommand: 'Custom',
                            cssClass: 'e-no-border'
                        }
                    ]
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table creation', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            addClass([tar.querySelector('td')], "e-cell-select");
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                var tableTBItems = tablePop.querySelectorAll('.e-toolbar-item');
                expect(tableTBItems.length === 10).toBe(true);
                expect(tablePop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (tableTBItems.item(0) as HTMLElement).click();
                var table = rteObj.contentModule.getEditPanel().querySelector('table');
                expect(table.querySelectorAll('thead').length > 0).toBe(true);
                expect(table.querySelectorAll('thead tr').length === 1).toBe(true);
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('th').length === 4).toBe(true);
                (tableTBItems.item(0) as HTMLElement).click();
                expect(table.querySelectorAll('thead').length === 0).toBe(true);
                expect(table.querySelectorAll('tr').length === 2).toBe(true);
                var tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                var eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems as any).item(1).childNodes[0].click();
                var popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                var mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children.length === 3).toBe(true);
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-insert-row-before')).toBe(true);
                document.querySelectorAll('td')[0].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 3).toBe(true)
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(1).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-insert-row-after')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 4).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(1).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-delete-row')).toBe(true);
                document.querySelectorAll('td')[8].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children.length === 3).toBe(true);
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-insert-column-left')).toBe(true);
                expect(table.querySelector('tr').querySelectorAll('td').length === 4).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 5).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-insert-column-right')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 6).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-delete-column')).toBe(true);
                document.querySelectorAll('td')[1].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 5).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table tr td');
                var selObj = new NodeSelection();
                (rteObj.tableModule as any).cellSelect({ args: { target: tar, preventDefault: function () { } } });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(3).childNodes[0] as HTMLElement).click();
                expect(document.querySelectorAll('.e-rte-backgroundcolor-dropdown.e-popup-open').length > 0).toBe(true);
                (document.querySelectorAll('.e-rte-backgroundcolor-dropdown.e-popup-open .e-custom-palette .e-palette .e-row')[1].children[4] as HTMLElement).click();
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                var bottomColor = (document.getElementsByClassName("e-background-color e-rte-elements e-icons")[0] as HTMLElement).style.borderBottomColor;
                tar = rteObj.contentModule.getEditPanel().querySelector('table tr td');
                var selObj = new NodeSelection();
                (rteObj.tableModule as any).cellSelect({ args: { target: tar, preventDefault: function () { } } });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                var defaultBottomcolor = (document.getElementsByClassName("e-background-color e-rte-elements e-icons")[0] as HTMLElement).style.borderBottomColor;
                expect(defaultBottomcolor).toEqual(bottomColor);
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-justify-left')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-justify-center')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-justify-right')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[3]
                };
                expect(popupElement.children[0].children[3].children[0].classList.contains('e-justify-full')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-align-top')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'top').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-align-middle')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'middle').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-align-bottom')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'bottom').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(8).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                (mouseEventArgs.target as HTMLElement).click();
                expect(closest(tar, 'table').classList.contains('e-dashed-border')).toBe(true);
                expect(closest(tar, 'table').classList.contains('e-dashed-test')).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(8).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                (mouseEventArgs.target as HTMLElement).click();
                expect(closest(tar, 'table').classList.contains('e-alternate-border')).toBe(true);
                expect(closest(tar, 'table').classList.contains('e-alternate-test')).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(8).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                (mouseEventArgs.target as HTMLElement).click();
                expect(closest(tar, 'table').classList.contains('e-no-border')).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(9).childNodes[0] as HTMLElement).click();
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(document.body.querySelector('.e-cell-padding')).not.toBe(null);
                expect(document.body.querySelector('.e-cell-spacing')).not.toBe(null);
                expect(document.body.querySelector('.e-size-update')).not.toBe(null);
                clickEvent.initEvent('click', false, true);
                document.body.querySelector('.e-size-update').dispatchEvent(clickEvent);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                var backgroundColorPickerItem = document.querySelectorAll(".e-primary.e-apply")[0];
                var msEventArgs = {
                    target: backgroundColorPickerItem
                };
                clickEvent.initEvent('click', false, true);
                ((tableTBItems.item(3).childNodes[0] as HTMLElement).querySelector('.e-background-color') as HTMLElement).click();
                tar = rteObj.contentModule.getEditPanel().querySelector('td') as any;
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (tableTBItems.item(5).childNodes[0] as HTMLElement).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('table')).toBe(null);
                var eventArgs = { args: { target: document, preventDefault: function () { } } };
                (rteObj.tableModule as any).docClick(eventArgs);
                done();
            }, 500);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        });
    });

    describe('Checking the width for the table elements added', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('2*2 table creation with width configured', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[1],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 4).toBe(true);
            expect(tar.querySelectorAll('td')[0].style.width).toBe("50%");
            expect(tar.querySelectorAll('td')[1].style.width).toBe("50%");
            done();
        });
        it('4*2 table creation with width configured', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1] as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            expect(tar.querySelectorAll('td')[0].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[1].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[2].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[3].style.width).toBe("25%");
            done();
        });
    });

    describe('Checking the width for the table elements added - code coverage', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: null, minWidth: null}
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking the width for the table elements added - code coverage', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[1],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            done();
        });
    });

    describe('Table properties quicktoolbar ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Cellpadding and cellSpacing style in table', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");

            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                ((<HTMLElement>tableTBItems.item(0)).childNodes[0] as HTMLElement).click();
                let cellPadElem = document.getElementById('cellPadding');
                let cellSpcElem = document.getElementById('cellSpacing');
                (cellPadElem as any).value = 20;
                (cellSpcElem as any).value = 25;
                clickEvent.initEvent('click', false, true);
                document.body.querySelector('.e-size-update').dispatchEvent(clickEvent);
                let tableElm = document.querySelector('table');
                expect(tableElm.getAttribute('cellspacing') === '25').toBe(true);
                expect(tableElm.classList.contains('e-rte-table-border')).toBe(true);
                let tdElem = tableElm.querySelectorAll('td');
                for (let i: number = 0; i < tdElem.length; i++) {
                    expect(tdElem[i].style.padding === '20px').toBe(true);
                }
                done();
            }, 500);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        });
    });

    describe('927840 - Console Error Occurs When Editing a Table Using the "TableEditProperties" Quick Toolbar Option', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Console Error Occurs When Editing a Table Using the "TableEditProperties" Quick Toolbar Option', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");

            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                tar.innerText = "Hello Syncfusion";
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                ((<HTMLElement>tableTBItems.item(0)).childNodes[0] as HTMLElement).click();
                let cellPadElem = document.getElementById('cellPadding');
                let cellSpcElem = document.getElementById('cellSpacing');
                (cellPadElem as any).value = 20;
                (cellSpcElem as any).value = 25;
                clickEvent.initEvent('click', false, true);
                document.body.querySelector('.e-size-update').dispatchEvent(clickEvent);
                let tableElm = document.querySelector('table');
                expect(tableElm.getAttribute('cellspacing') === '25').toBe(true);
                expect(tableElm.classList.contains('e-rte-table-border')).toBe(true);
                let tdElem = tableElm.querySelectorAll('td');
                for (let i: number = 0; i < tdElem.length; i++) {
                    expect(tdElem[i].style.padding === '20px').toBe(true);
                }
                done();
            }, 500);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        });
    });

    describe('table dialog', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table creation - dialog', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).classList.contains('enabled')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).classList.contains('enabled')).toBe(false);
        });
        it('Percentage Check-While resizing', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let selObj: NodeSelection = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[0], table.querySelectorAll('td')[0], 0, 0);
            var position = window.getSelection().anchorNode;
            let mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent('mousedown', true, true);
            (document.getElementsByClassName('e-column-resize')[1] as HTMLElement).dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mousemove', true, true);
            document.dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let colWidth: string = (table as HTMLTableElement).rows[0].cells[0].style.width
            expect(colWidth.indexOf('%') !== -1).toBe(true);
            expect(position).toEqual(window.getSelection().anchorNode);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).pageX).toBe(null);
        });
        it('resizing', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            width += 200;
            //expect(width).toEqual((table as HTMLTableElement).rows[0].cells[0].offsetWidth);
            let resRow1: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-row-resize') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            resRow1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.row = true;
            (rteObj.tableModule as any).resizing({ target: resRow1, pageX: 100, pageY: 100, preventDefault: function () { } });
            let height: any = (table as HTMLTableElement).rows[0].offsetHeight;
            (<any>rteObj.tableModule).resizeBtnStat.row = true;
            (rteObj.tableModule as any).resizing({ target: resRow1, pageX: 100, pageY: 200, preventDefault: function () { } });
            height += 100;
            expect(height).toEqual((table as HTMLTableElement).rows[0].offsetHeight);

            let tableBox: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            tableBox.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 100, preventDefault: function () { } });
            height = (table as HTMLTableElement).offsetHeight;
            width = (table as HTMLTableElement).offsetWidth;
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 200, preventDefault: function () { } });
            height += 100;
            width += 201;
            expect(height).toEqual((table as HTMLTableElement).offsetHeight);
            let eventArgs: any = { args: { target: document, preventDefault: function () { } } };
            (<any>rteObj).tableModule.docClick(eventArgs);
        });
    });

    describe('EJ2-60291 - Table First Column Resize check ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.event.target.getAttribute('data-col') === '0');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Resize Start Event check with first column', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
        });
        it('Percentage Check-While resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent('mousedown', true, true);
            (document.getElementsByClassName('e-column-resize')[0] as HTMLElement).dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mousemove', true, true);
            document.dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let colWidth: string = (table as HTMLTableElement).rows[0].cells[0].style.width
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end after first column', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).pageX).toBe(null);
        });
        it('resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.style.marginLeft !== '').toBe(false);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            width += 200;
            expect(table.style.marginLeft !== '').toBe(true);
        });
    });

    describe('EJ2-60291 - Table Last Column Resize check ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.event.target.getAttribute('data-col') === '3');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Resize Start Event check with Last column', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
        });
        it('Percentage Check-While resizing Last column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent('mousedown', true, true);
            (document.getElementsByClassName('e-column-resize')[3] as HTMLElement).dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mousemove', true, true);
            document.dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let colWidth: string = (table as HTMLTableElement).rows[0].cells[0].style.width
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end after Last column', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).pageX).toBe(null);
        });
        it('resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.style.marginLeft !== '').toBe(false);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: -100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: -200, pageY: 200, preventDefault: function () { } });
            expect(table.style.width !== '100%').toBe(true);
            expect(table.querySelector('tr').querySelectorAll('td')[2].style.width !== "33.3333%").toBe(true);
        });
    });

    describe('table keyboard support ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('key navigation', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
          
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let selObj: NodeSelection = new NodeSelection();
            (table as HTMLElement).querySelectorAll('td')[8].classList.add("e-cell-select");
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[8], table.querySelectorAll('td')[8], 0, 0);
            table.querySelectorAll('td')[0].classList.remove("e-cell-select");
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[10] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 38;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[7] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 40;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[10] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.shiftKey = true;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[9] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[11], table.querySelectorAll('td')[11], 0, 0);
            keyboardEventArgs.keyCode = 39;
            keyboardEventArgs.shiftKey = false;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[0], table.querySelectorAll('td')[0], 0, 0);
            keyboardEventArgs.keyCode = 39;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
        });
    });

    describe('Table tabKey pressed for new rows', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Tabkey at end of table td', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
          
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let selObj: NodeSelection = new NodeSelection();
            (table as HTMLElement).querySelectorAll('td')[8].classList.add("e-cell-select");
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[8], table.querySelectorAll('td')[8], 0, 0);
            table.querySelectorAll('td')[0].classList.remove("e-cell-select");
            table.querySelectorAll('td')[6].innerHTML = 'test1' + table.querySelectorAll('td')[6].innerHTML;
            table.querySelectorAll('td')[7].innerHTML = 'test2' + table.querySelectorAll('td')[7].innerHTML;
            table.querySelectorAll('td')[8].innerHTML = 'test3' + table.querySelectorAll('td')[8].innerHTML;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[9].innerText).toBe('\n');
            expect(table.querySelectorAll('td')[10].innerText).toBe('\n');
            expect(table.querySelectorAll('td')[11].innerText).toBe('\n');
        });
    });

    describe('874515 - Pasted table tabKey press', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: `<table border="1" cellspacing="0" cellpadding="0" style="border:none;" class="e-rte-paste-table">
                <tbody><tr>
                 <td width="208" valign="top" style="width:155.8pt;border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                </tr>
                <tr>
                 <td width="208" valign="top" style="width:155.8pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                </tr>
                <tr>
                 <td width="208" valign="top" style="width:155.8pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                 <td width="208" valign="top" style="width:155.85pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;">
                 <p style="margin-bottom:0in;line-height:normal;margin-top:0in;margin-right:0in;margin-left:0in;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>
                 </td>
                </tr>
               </tbody></table><p style="margin-top:0in;margin-right:0in;margin-bottom:8.0pt;margin-left:0in;line-height:107%;font-size:11.0pt;font-family:&quot;Calibri&quot;,sans-serif;">&nbsp;</p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Pasted table tabKey press', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let selObj: NodeSelection = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[1], table.querySelectorAll('td')[1], 0, 0);
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelector('td').nextSibling.nodeName === '#text').toBe(false);
            expect(table.querySelector('tr').nextSibling.nodeName === '#text').toBe(false);
        });
    });

    describe('936419 - Unwanted P Tag Created When Navigating Table Cell by Pressing Tab Key on Mac', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs: any;

        beforeAll(() => {
          rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
              items: ['Bold', 'CreateTable']
            },
            value: `<table border="1">
              <tr>
                <td>Cell 1,1</td>
                <td><span>engineer</span><br></td>
                <td>Cell 1,3</td>
              </tr>
              <tr>
                <td>Cell 2,1</td>
                <td>Cell 2,2</td>
                <td>Cell 2,3</td>
              </tr>
            </table>`
          });
          rteEle = rteObj.element;
        });

        afterAll(() => {
          destroy(rteObj);
        });

        it('Should not create extra p tag when pressing tab key twice', () => {
          const table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
          const cells = table.querySelectorAll('td');
          const firstCell = cells[0];
          const secondCell = cells[1];
          const thirdCell = cells[2];
          // Set selection to the start of the first cell
          let selObj: NodeSelection = new NodeSelection();
          selObj.setSelectionText(rteObj.contentModule.getDocument(), firstCell, firstCell, 0, 0);
          // Simulate first tab key press
          keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
          };
          (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
          // Check if the selection moved to the second cell
          let selection = rteObj.contentModule.getDocument().getSelection();
          expect(selection.anchorNode).toBe(secondCell);
          expect(selection.anchorOffset).toBe(0);
          // Simulate second tab key press
          (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
          // Check if the selection moved to the third cell
          selection = rteObj.contentModule.getDocument().getSelection();
          expect(selection.anchorNode).toBe(thirdCell);
          expect(selection.anchorOffset).toBe(0);
          // Check if no extra p tag was created in the second cell
          expect(secondCell.innerHTML).toBe('<span>engineer</span><br>');
        });
    });

    describe('Table tabKey pressed with header being selected for new rows', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Tabkey at end of table td for creating new row', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 4).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let selObj: NodeSelection = new NodeSelection();
            (table as HTMLElement).querySelectorAll('td')[2].classList.add("e-cell-select");
            (table as HTMLElement).querySelectorAll('td')[5].classList.add("e-cell-select");
            (table as HTMLElement).querySelectorAll('td')[8].classList.add("e-cell-select");
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[8], table.querySelectorAll('td')[8], 0, 0);
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[9].innerText).toBe('\n');
            expect(table.querySelectorAll('td')[10].innerText).toBe('\n');
            expect(table.querySelectorAll('td')[11].innerText).toBe('\n');
        });
    });

    describe('table dialog open close ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('popup open and dialog open', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-cancel') as HTMLElement;
            target.dispatchEvent(clickEvent);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let eventArgs: any = { args: { target: rteObj.contentModule.getEditPanel(), preventDefault: function () { } } };
            (rteObj as any).tableModule.docClick(eventArgs);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect((rteObj as any).tableModule.popupObj).not.toBe(null);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect((rteObj as any).tableModule.popupObj).toBe(null);
        });
    });

    describe('table resize start args ', () => {
        let rteObj: RichTextEditor;
        let value: any = `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p><p><b>Functional
Specifications/Requirements:</b></p><ol><li><p>Provide
the tool bar support, it�s also customiza</p><table class="e-rte-table" style="width: 1065px; height: 50px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p>ble</p></li></ol>
`
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: value,
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                    args.cancel = true;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('args cancel event', () => {
            let clickEvent: any = document.createEvent("MouseEvents");
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
        });
    });

    describe('table resizing args ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', 'FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: { enable: false },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                    args.cancel = true;
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('args cancel event', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            (rteObj.tableModule as any).destroy();
        });
    });
    
    describe('EJ2-50697 - table resizing -', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', 'FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: { enable: false },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('when there is unequal number of columns - ', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            table.querySelector('tr').querySelectorAll('td')[2].remove();
            table.querySelector('tr').querySelectorAll('td')[1].remove();
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length).toBe(4);
            (rteObj.tableModule as any).destroy();
        });
    });

    describe('mobile resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            let target: HTMLElement;
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar.querySelectorAll('tr').length === 3).toBe(true);
            expect(tar.querySelectorAll('td').length === 9).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            tar.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (rteObj.tableModule as any).resizeStart({ target: reCol1, preventDefault: function () { }, stopImmediatePropagation: function () { } });
            (rteObj.tableModule as any).resizing({ target: reCol1, touches: [{ pageX: 300 }] });
            expect((rteObj.tableModule as any).pageX).toBe(300);
            (rteObj.tableModule as any).docClick({ args: { target: rteObj.contentModule.getEditPanel() } });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
        });
        describe('IE browser table ', () => {
            let rteEle: HTMLElement;
            let rteObj: RichTextEditor;
            let defaultUA: string = navigator.userAgent;
            beforeAll(() => {
                Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
                rteObj = renderRTE({
                    height: 400,
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable']
                    }
                });
                rteEle = rteObj.element;
            });
            afterAll(() => {
                Browser.userAgent = defaultUA;
                destroy(rteObj);
            });
            it('table insert', () => {
                expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                let clickEvent: any = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(clickEvent);
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('td').length === 9).toBe(true);
                (InsertHtml as any).closestEle(table.querySelectorAll('td')[0], rteObj.contentModule.getEditPanel() as HTMLElement);
            });
        });
    });

    describe("table Inline Quick toolbar - showPopup method with popup open testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it('show inline toolbar', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                (<HTMLElement>pop.querySelectorAll('.e-toolbar-item button')[1]).click();
                let events: any = document.createEvent("MouseEvents");
                events.initEvent("click", false, true);
                let target: HTMLElement;
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(events);
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(tar.querySelectorAll('tr').length === 3).toBe(true);
                expect(tar.querySelectorAll('td').length === 9).toBe(true);
                let clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                done();
            }, 100);
        });
    });

    describe('table header', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check table heeader', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");

            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                expect(tableTBItems.length === 10).toBe(true);
                expect(tablePop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (<HTMLElement>tableTBItems.item(0)).click();
                let table: any = rteObj.contentModule.getEditPanel().querySelector('table');
                expect(table.querySelectorAll('thead').length > 0).toBe(true);
                expect(table.querySelectorAll('thead tr').length === 1).toBe(true);
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('th').length === 4).toBe(true);
                let selObj: NodeSelection = new NodeSelection();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('th')[3], table.querySelectorAll('th')[3], 0, 0);
                keyboardEventArgs.keyCode = 40;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('td')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 38;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('th')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 9;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('td')[0] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 9;
                keyboardEventArgs.shiftKey = true;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('th')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                done();
            }, 500);
        });
    });

    describe("TABLE with parent based selection", () => {

        describe("Apply to empty table td", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                to insert image from a defined path.</p></li></ol><div>
                <table class="e-rte-table" style="width: 100%;"><tbody><tr>
                <td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br>
                </td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br>
                </td></tr></tbody></table><br></div><ol><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'H1').toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'OL').toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'UL').toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to single line within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;">RichTextEditor</td>
                    <td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'H1').toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'OL').toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'UL').toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selected two lines within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr>
                    <td class="" style="width: 50%;">RichTextEditor<br>Syncfusion</td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br>
                    </td><td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selected three lines within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr>
                    <td class="" style="width: 50%;">RichTextEditor<br>Syncfusion<br>ej2-richtexteditor</td>
                    <td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to all table cells", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selection of table  in between of paragraph", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;"><br>
                    </td><td style="width: 50%;"><br></td></tr></tbody></table><br></div><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('h1');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('li');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('li');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('p');
                expect(applied.length === 4).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[3] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('p');
                expect(applied.length === 4).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[3] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
            it('Bold the text and applying table to it', (done) => {
                rteObj.value = '<p>Bold the richtexteditor text and applying table to it testing</p>'
                rteObj.dataBind();
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], firstNode.childNodes[0], 13, 17);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                expect(firstNode.firstElementChild.tagName.toLowerCase() === 'strong');
                expect(firstNode.firstElementChild.textContent === 'text');
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                (<HTMLElement>rteEle.querySelector(".e-insert-table-btn") as HTMLElement).click();
                (<HTMLElement>rteEle.querySelectorAll(".e-insert-table")[0] as HTMLElement).click();
                let firstSplittedNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let tableNode: HTMLElement = rteObj.element.querySelectorAll("table")[0];
                let lastSplittedNode: HTMLElement = rteObj.element.querySelectorAll("p")[1]
                expect(firstSplittedNode.querySelectorAll('strong').length === 0).toBe(true);
                expect(lastSplittedNode.querySelectorAll('strong').length === 0).toBe(true);
                expect(tableNode).not.toBe(null);
                done();
            });
        });

        describe(" Apply to text line with empty line", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;">Syncfusion<br><br><br></td><td style="width: 50%;"><br></td>
                    </tr></tbody></table><br></div>
                    <p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to in between text line in TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p><b>Description:</b></p><ol><li><p>Support
                    to insert image from a defined path.</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 25%;">Syncfusion<br>RichTextEditor<br>DropDowns</td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply the blockquotes to table parent node.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    format: {
                        types: [
                            { text: 'Paragraph', value: 'P' },
                            { text: 'Code', value: 'Pre'},
                            { text: 'Quotation', value: 'BlockQuote', cssClass: 'e-quote' },
                            { text: 'Heading 1', value: 'H1' },
                            { text: 'Heading 2', value: 'H2' },
                            { text: 'Heading 3', value: 'H3' },
                            { text: 'Heading 4', value: 'H4' }
                        ]
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;">Syncfusion<br><br><br></td><td style="width: 50%;"><br></td>
                    </tr></tbody></table><br></div>
                    <p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-quote') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelector('blockquote');
                // The childnodes was changed because the value now have the space and enter which won't be removed. So the table element was a second childNode
                expect((applied.childNodes[1] as Element).tagName === 'P').toBe(true);
                expect((applied.parentElement).tagName === 'TD').toBe(true);
                done();
            });
        });

        describe(" Insert row from table header.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                    client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                    `
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' test the insert row from table header', (done) => {
                let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
                setCursorPoint(node, 0);
                node.focus();
                let clickEvent: MouseEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: node };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                setTimeout(() => {
                    let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                    let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_TableRows");
                    insertBtn.click();
                    let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_TableRows-popup");
                    (dropdown.querySelectorAll(".e-item")[0] as HTMLElement).click();
                    insertBtn = tablePop.querySelector("#" + controlId + "_quick_TableRows");
                    insertBtn.click();
                    dropdown = document.querySelector('#' + controlId + "_quick_TableRows-popup");
                    (dropdown.querySelectorAll(".e-item")[1] as HTMLElement).click();
                    expect((rteObj as any).inputElement.querySelectorAll("td").length === 6).toBe(true);
                    expect((node.parentNode.parentNode.nextSibling.childNodes[0].childNodes[0] as HTMLElement).tagName === 'TD').toBe(true);
                    done();
                }, 600);
            });
        });

        describe(" Insert row to select the header element.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<h1>The Rich Text Editor (RTE) control is an easy to render in
                    client side.</h1>
                    `
                });
                rteEle = rteObj.element;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' test the insert row after select the h1 element', (done) => {
                let node: HTMLElement = (rteObj as any).inputElement.querySelector("h1");
                expect((rteObj as any).inputElement.querySelectorAll("h1").length === 1).toBe(true);
                let nodeSelection: NodeSelection = new NodeSelection();
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 3, 8);
                node.focus();
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                let clickEvent: any = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(clickEvent);
                expect((rteObj as any).inputElement.querySelectorAll("h1").length === 2).toBe(true);
                done();
            });
        });

        describe(" List tab key action inside table.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: '' };
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>
                    `
                });
                rteEle = rteObj.element;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });

            it(' tab key navigation from second li start point', () => {
                let selectNode: Element = editNode.querySelector('ol');
                expect(selectNode.querySelector('ol')).toBeNull();
                setCursorPoint(selectNode.childNodes[2] as Element, 0);
                (rteObj as any).keyDown(keyBoardEvent);
                expect(selectNode.querySelector('ol')).not.toBeNull();
            });
        });

        describe("tab and shift+tab", () => {
            let rteObj: RichTextEditor;
            let keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: false
            };
            let keyboardEventArgs1 = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: true
            };
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' empty cell', (done) => {
                setTimeout(() => {
                    let tdNode: Element = rteObj.element.querySelector("td");
                    setCursorPoint(tdNode, 0);
                    keyboardEventArgs.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                    keyboardEventArgs1.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs1 });
                    expect(tdNode.querySelector('p')).toBeNull();
                    done();
                }, 500);
            });
            it('Multiline text cell', (done) => {
                setTimeout(() => {
                    let tdNode: Element = rteObj.element.querySelector("td");
                    (tdNode as HTMLElement).innerText = "'first line'<br>'second line'<br>'third line'<br>'fourth line' <br>";
                    (tdNode as HTMLElement).innerText = "'first line'<br>'second line'<br>'third line'<br>'fourth line' <br>";
                    setCursorPoint(tdNode, 0);
                    keyboardEventArgs.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                    keyboardEventArgs1.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs1 });
                    expect(tdNode.querySelector('p')).toBeNull();
                    done();
                }, 500);
            });
        });

        describe("EJ2-57672: List apply when insert table popup opened", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    }
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' List apply when insert table popup opened', (done) => {
                let firstNode: HTMLElement = rteObj.inputElement;
                setCursorPoint(firstNode as Element, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateTable') as HTMLElement;
                item.click();
                let listItem: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                listItem.click();
                expect((window.getSelection().anchorNode as any).firstElementChild.nodeName === 'BR').toBe(true);
                done();
            });
        });

        describe(" EJ2-19873:  Inserting table in the list produces one extra empty list", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li>one</li><li>two</li><li>three</li></ol><p><br></p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' insert the table at selection of end of li', (done) => {
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("li")[1];
                setCursorPoint(firstNode.childNodes[0] as Element, firstNode.textContent.length - 1);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateTable') as HTMLElement;
                item.click();
                let cell: Element = document.getElementById(controlId + "_table").querySelectorAll(".e-rte-tablecell")[0];
                dispatchEvent(cell, "mousedown");
                dispatchEvent(cell, "mouseup");
                (cell as HTMLElement).click();
                let applied: any = editNode.querySelectorAll('li:empty');
                expect(applied.length === 0).toBe(true);
                done();
            });
        });
    });

    describe(' Quick Toolbar showOnRightClick property testing', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" leftClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing context Menu", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = {target: target, which: 3, preventDefault: () => { return true; } };
            rteObj.contextHandler(eventsArg);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" Android - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe(" EJ2-19935: RTE text align property is not working properly in table cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' apply the right alignment to table td', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("td")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 600);
        });
    });

    describe("- EJ2-54390: Align Top in the table cell vertical align quickToolbar of table is always disabled", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it('- Align top in the table cell vertical align quickToolbar of table is always disabled', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_TableCellVerticalAlign");
                insertBtn.click();
                expect(document.querySelector('#' + controlId + "_quick_TableCellVerticalAlign-popup").querySelector('li').classList.contains('e-disabled')).toBe(false);
                done();
            }, 600);
        });
    });

    describe("EJ2-49389: Table quick toolbar not hide while 'ctrl + a' after  backspace key action", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 8,
            shiftKey: false
        };
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it('- checking toolbar hidden after backspace', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                (<any>rteObj).selectAll();
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect((document.querySelectorAll('.e-rte-quick-popup') as any).length).toBe(0);
                done();
            }, 600);
        });
    });

    describe("EJ2-49385: Table cell focus style not removed when interact outside of the RTE in Iframe Mode", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 8,
            shiftKey: false
        };
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                iframeSettings: {
                    enable: true
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it('- checking table focus being removed', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                clickEvent.initEvent('mousedown', false, true);
                document.dispatchEvent(clickEvent);
                expect((document.querySelectorAll('.e-cell-select') as any).length).toBe(0);
                done();
            }, 600);
        });
    });

    describe(" IE - table delete testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            Browser.userAgent = ieUA;
        });

        afterEach(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it(' delete column', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">9</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows[0].querySelectorAll('td').length).toBe(3);
                expect(rows[1].querySelectorAll('td').length).toBe(3);
                expect(rows[2].querySelectorAll('td').length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (rows[1].querySelectorAll('td')[1] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                expect(rows[0].querySelectorAll('td').length).toBe(2);
                expect(rows[1].querySelectorAll('td').length).toBe(2);
                expect(rows[2].querySelectorAll('td').length).toBe(2);
                done();
            }, 400);
        });
        it(' delete row', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">9</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (rows[1].querySelectorAll('td')[1] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                done();
            }, 400);
        });
    });

    describe("EJ2-44726 - Delete row issue ", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        afterEach(() => {
            destroy(rteObj);
        });
        it(' - delete row deletes the previous row issue ', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="table table-bordered" style="width:1977.33px"><tbody><tr><td style="line-height:1.42857"><span style="font-weight:700"><span style="font-size:11px">Proceseigenaar</span></span></td><td style="line-height:1.42857">Directie<br></td></tr><tr><td style="line-height:1.42857" class=""><span style="font-weight:700"><span style="font-size:11px">Doel</span></span></td><td style="line-height:1.42857"><span style="font-size:11px">Zorgen dat wijzigingen in de organisatie op een juiste manier beoordeeld, uitgevoerd en geborgd worden incl. de risico's</span></td></tr><tr><td style="line-height:1.42857"><span style="font-weight:700"><span style="font-size:11px">Verwijzing</span></span></td><td style="line-height:1.42857"><span style="font-size:11px">ISO 9001</span></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[0];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                document.querySelectorAll("td")[2].classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                expect(rows[0].textContent === "ProceseigenaarDirectie").toBe(true);
                done();
            }, 400);
        });
    });

    describe(" EJ2-28899: RTE text align property is not working properly in table header cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class="">test</td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' apply the right alignment to table th', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("th")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 600);
        });
    });

    describe(" IPhone - iFrame alignments testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p>The Rich Text Editor (RTE) control is an easy to render in client side</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
        });
        it(' apply the right alignment to table th', () => {
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 0);
            node.focus();
            let toolbar: any = <HTMLElement>document.querySelector('.e-rte-toolbar');
            let insertBtn: HTMLElement = toolbar.querySelector("#" + controlId + "_toolbar_Alignments");
            insertBtn.click();
            let dropdown: HTMLElement = document.querySelector('#' + controlId + "_toolbar_Alignments-popup");
            (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
            expect(((rteObj as any).inputElement.querySelector("p") as HTMLElement).style.textAlign === 'right').toBe(true);
        });
    });

    describe(" EJ2-28564:  Applying heading to table after inserting table inside another table not works properly", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<table class="e-rte-table" style="width: 95%;"><tbody><tr><td style="width: 33.3333%;" class=""><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><br></td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>
                `
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Insert header to child table', (done) => {
            expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(0);
            let node: HTMLElement = (rteObj as any).inputElement.querySelectorAll("td")[1];
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector(".e-toolbar-item button");
                insertBtn.click();
                expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(1);
                expect((rteObj as any).inputElement.querySelectorAll("thead")[0].querySelectorAll('th').length).toBe(3);
                done();
            }, 600);
        });
        it(' Insert header to root table', (done: Function) => {
            expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(1);
            let node: HTMLElement = (rteObj as any).inputElement.querySelectorAll("td")[11];
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector(".e-toolbar-item button");
                insertBtn.click();
                expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(2);
                expect((rteObj as any).inputElement.querySelectorAll("thead")[1].querySelectorAll('th').length).toBe(3);
                expect((rteObj as any).inputElement.querySelectorAll("thead th").length).toBe(6);
                done();
            }, 600);
        });
    });

    describe(" EJ2-28994 - IE table insert on new line testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            Browser.userAgent = ieUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
        });
        it(' insert table ', (done) => {
            rteObj.focusIn();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 0);
            node.focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(function () {
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                setTimeout(() => {
                    expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                    target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                    target.dispatchEvent(clickEvent);
                    setTimeout(() => {
                        expect(rteEle.querySelectorAll('p').length).toBe(1);
                        expect(rteEle.querySelectorAll('.e-content > p').length).toBe(1);
                        expect(rteEle.querySelectorAll('.e-content > table').length).toBe(1);
                        expect(rteEle.querySelector('.e-content').childNodes.length).toBe(2);
                        let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                        expect(table.querySelectorAll('tr').length === 3).toBe(true);
                        expect(table.querySelectorAll('td').length === 9).toBe(true);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
    });

    describe(" EJ2-59189 - Images removed from list when inserting table", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            Browser.userAgent = ieUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<ol><li><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1199px; min-height: 0px;"></li></ol><p class="focusNode"><br></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
        });
        it(' Images removed from list when inserting table ', (done) => {
            rteObj.focusIn();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let node: HTMLElement = (rteObj as any).inputElement.querySelector(".focusNode");
            setCursorPoint(node, 0);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(function () {
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                setTimeout(() => {
                    expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                    target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                    target.dispatchEvent(clickEvent);
                    setTimeout(() => {
                        expect(rteEle.querySelectorAll('table').length).toBe(1);
                        expect(rteEle.querySelectorAll('img').length).toBe(1);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
    });

    describe(" EJ2-43332 - Table getting removed while using bulleting/numbering", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                    </tr>
                </tbody>
            </table><p><b>Test1</b></p><p><b>Test2</b></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' Apply OrderedList and check table availability ', (done: Function) => {
            rteObj.focusIn();
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            getLastTextNode(rteEle);
            setTimeout(function () {
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                    </tr>
                </tbody>
            </table><ol><li><b>Test1</b></li><li><b>Test2</b></li></ol>`);
                done();
            }, 500);
        });
        it(' Apply UnOrderedList and check table availability ', (done: Function) => {
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            setTimeout(function () {
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                    </tr>
                </tbody>
            </table><ul><li><b>Test1</b></li><li><b>Test2</b></li></ul>`);
                done();
            }, 500);
        });
    });

    describe("Table cell merge - Header", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class="e-cell-select"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Header merge', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table th');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("th")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                let table : HTMLTableElement = rteEle.querySelector("table");
                let header : HTMLElement = table.querySelector("thead");
                expect(header.children.length).toBe(1);
                //expect(header.children[0].getAttribute("colspan")).toBe("2");
                expect(header.children[0].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Table code coverage", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                inlineMode:{
                    enable: true
                },
                value: `<table class=\"e-rte-table\" style=\"width: 100%; min-width: 0px;\"><thead style=\"height: 25%;\"><tr style=\"height: 25%;\"><th class = \"e-cell-select\"><br></th><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr style=\"height: 25%;\"><td class=\"\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr style=\"height: 25%;\"><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr style=\"height: 25%;\"><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table><table class=\"e-rte-table\" id = \"e-rte-table1\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"e-cell-select\" style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td></tr><tr><td style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td></tr><tr><td style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td><td style=\"width: 33.3333%;\"><br></td></tr></tbody></table><span class="e-table-box" data-col="3" unselectable="on" contenteditable="false" style="top: 89px; left: 544px;"></span><p><br></p><div class="e-table-rhelper e-row-helper" style="width: 540.949px; top: 37px; left: 12px;"></div>
                <div class="e-table-rhelper e-column-helper" style="width: 540.949px; top: 37px; left: 12px;"></div>
                `
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table code coverage', (done: Function) => {
            let target: HTMLElement = rteEle.querySelector('.e-rte-table th');
            let activeCell: HTMLElement = rteEle.querySelectorAll("th")[1];
            let args: any = {
                event: { target: target },
                selectNode: [activeCell] as any,
            };
            (rteObj as any).formatter.editorManager.tableObj.tableMove(args);
            expect(target.classList.contains('e-cell-select-end')).toBe(true);
            args = {
                event: { target: target },
                selectNode: [target] as any,
            };
            (rteObj as any).formatter.editorManager.tableObj.tableMove(args);
            expect(target.classList.contains('e-cell-select-end')).toBe(false);
            target = rteEle.querySelector('#e-rte-table1 td');
            (rteObj as any).tableModule.helper = '';
            (rteObj as any).tableModule.removeHelper({ target: target });
            expect((rteObj as any).tableModule.helper !== null).toBe(true);
            (rteObj as any).tableModule.helper = null;
            args = {
                event: { target: target },
                selectNode: [activeCell] as any,
            };
            (rteObj as any).formatter.editorManager.tableObj.tableMove(args);
            expect(target.classList.contains('e-cell-select-end')).toBe(false);
            (rteObj as any).tableModule.curTable = rteEle.querySelector('.e-rte-table');
            const cssText = (rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement).style.cssText;
            (rteObj as any).tableModule.updateResizeIconPosition();
            expect(((rteObj as any).contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement).style.cssText !== cssText).toBe(true);
            args = {
                selectNode: [activeCell]
            };
            target = rteEle.querySelector('.e-rte-table th');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).tableModule.updateResizeIconPosition();
            (rteObj as any).tableModule.createDialog({}); 
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') !== null).toBe(true);
            document.body.appendChild((rteObj as any).tableModule.quickToolObj.inlineQTBar.element);
            (rteObj as any).tableModule.onIframeMouseDown();
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') === null).toBe(true);
            (rteObj as any).tableModule.createDialog({});
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') !== null).toBe(true);
            (rteObj as any).tableModule.applyProperties(args, {});
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') === null).toBe(true);
            (rteObj as any).tableModule.customTable (args, {});
            expect((rteObj as any).formatter.editorManager.tableObj.getCorrespondingIndex(null, []).length === 0).toBe(true);
            (rteObj as any).formatter.editorManager.tableObj.cellMerge(null);
            expect((rteObj as any).formatter.editorManager.tableObj.curTable.querySelectorAll('.e-cell-select').length === 0).toBe(true);
            (rteObj as any).formatter.editorManager.tableObj.curTable = null;
            const element: HTMLElement = rteObj.contentModule.getEditPanel().parentElement;
            let range: Range = document.createRange();
            range.setStart(element , 0);
            (rteObj as any).formatter.editorManager.nodeSelection.save(range, document);
            (rteObj as any).formatter.editorManager.tableObj.removeTable({ item: { selection: rteObj.formatter.editorManager.nodeSelection}});
            expect(document.querySelectorAll('.e-rte-table').length === 2).toBe(true);
            (rteObj as any).focusIn();
            const tdElement: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table').querySelector('tr');
            tdElement.setAttribute('valign', 'top');
            (rteObj as any).formatter.editorManager.tableObj.tableVerticalAlign({item:{tableCell: tdElement, subCommand: 'AlignTop'}});
            expect(tdElement.attributes.hasOwnProperty('valign')).toBe(false);
            range = document.createRange();
            range.setStart(tdElement, 0);
            (rteObj as any).formatter.editorManager.nodeSelection.save(range, document);
            (rteObj as any).formatter.editorManager.tableObj.cellMerge(null);
            expect((rteObj as any).formatter.editorManager.tableObj.curTable.querySelectorAll('.e-cell-select').length === 1).toBe(true);
            (rteObj as any).isDestroyed = true;
            (rteObj as any).tableModule.addEventListener();
            (rteObj as any).renderModule.addEventListener();
            (rteObj as any).renderModule.removeEventListener();
            (rteObj as any).isDestroyed = false;
            (rteObj as any).tableSettings.resize = false;
            (rteObj as any).contentModule = null;
            (rteObj as any).tableModule.onIframeMouseDown();
            (rteObj as any).contentModule = (rteObj as any).tableModule.contentModule;
            (rteObj as any).tableModule.contentModule = null;
            (rteObj as any).tableModule.afterRender();
            (rteObj as any).tableSettings.resize = true;
            document.body.removeChild((rteObj as any).tableModule.quickToolObj.inlineQTBar.element);
            (rteObj as any).tableModule.resizeEnd(null);
            expect((rteObj as any).tableModule.pageX === null).toBe(true);
            done();
        });
    });

    describe("EJ2-56516 - Table cell merge with empty columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;">test 2</td><td style="width: 33.3333%;">test 3</td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge two columns with content and one empty', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[2].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table td').innerHTML).toBe("test 2<br>test 3");
                done();
            }, 400);
        });
    });

    describe("EJ2-56516 - Table cell merge with empty rows", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">test 2</td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge two rows with content and empty', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table td').innerHTML).toBe("test 2");
                done();
            }, 400);
        });
    });

    describe("Bug 903450: The table merge cells is not working properly in the Rich Text Editor", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table cellpadding="0" cellspacing="0" width="192" class="e-rte-paste-table" style="width:144pt;">

 <tbody><tr height="19" style="height:14.5pt;">
  <td height="19" width="64" style="height:14.5pt;width:48pt;">r1</td>
  <td width="64" style="width:48pt;">c2</td>
  <td width="64" style="width:48pt;">c3</td>
 </tr>
 <tr height="19" style="height:14.5pt;">
  <td height="19" style="height:14.5pt;">r2</td>
  <td>c2</td>
  <td>c3</td>
 </tr>
 <tr height="19" style="height:14.5pt;">
  <td height="19" style="height:14.5pt;">r3</td>
  <td>c2</td>
  <td>c3</td>
 </tr>

</tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it(' Merge two rows with content and to verify empty row is removed from the dom', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-paste-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[5].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelectorAll('table tr').length === 2).toBe(true);
                done();
            }, 400);
        });
    });

    describe("Table remove rows with cell merge", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-', 'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;" rowspan="2">Merged</td><td style="width: 25%;" class="">r1c1</td><td style="width: 25%;" class="">r1c2</td><td style="width: 25%;" class="">r1c3</td></tr><tr><td style="width: 25%;">r1c1</td><td style="width: 25%;" class="">r2c2</td><td style="width: 25%;" class="">r3c3</td></tr><tr><td style="width: 25%;" class="">r3</td><td style="width: 25%;">r3</td><td style="width: 25%;">r3</td><td style="width: 25%;">r3</td></tr></tbody></table><p><br/></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Remove the row when the cells are merged', (done: Function) => {
            let target = rteEle.querySelectorAll('.e-rte-table td')[1];
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            let domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), target, target, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table tr').childElementCount === 4).toBe(true);
                done();
            }, 400);
        });
    });

    describe("Table remove rows with cell merge - case 2", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-', 'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;">Merged</td><td style="width: 25%;" class="">r1c1</td><td style="width: 25%;" class="">r1c2</td><td style="width: 25%;" class="">r1c3</td></tr><tr><td style="width: 25%;" class="" rowspan="2">r3</td><td style="width: 25%;">r1c1</td><td style="width: 25%;" class="">r2c2</td><td style="width: 25%;" class="">r3c3</td></tr><tr><td style="width: 25%;">r3</td><td style="width: 25%;">r3</td><td style="width: 25%;">r3</td></tr></tbody></table><p><br/></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Remove the row when the second row cells are merged', (done: Function) => {
            let target = rteEle.querySelectorAll('.e-rte-table td')[4];
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            let domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), target, target, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table tr').childElementCount === 4).toBe(true);
                done();
            }, 400);
        });
    });

    describe("Table cell merge", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><p>1</p></td><td style="width: 33.3333%;"><p>2</p></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(2);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("66.6666%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("33.3333%");
                //expect(rows[0].children[0].getAttribute("colspan")).toBe("2");
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(table.rows[1].children.length).toBe(3);
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[1].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("874475 - Table cell merge with pixel units", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 150px; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50px;"><p>1</p></td><td style="width: 50px;"><p>2</p></td><td style="width: 50px;"><br></td></tr><tr><td style="width: 50px;"><br></td><td style="width: 50px;"><br></td><td style="width: 50px;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table cell merge with pixel units', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(2);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("100px");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("50px");
                done();
            }, 400);
        });
    });

    describe("Table cell merge -single row -all columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[2].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("EJ2-56516 - Table cell merge with row of contents", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;">test 1</td><td style="width: 33.3333%;">test 2</td><td style="width: 33.3333%;">test 3</td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge three columns with content', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[2].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table td').innerHTML).toBe("test 1<br>test 2<br>test 3");
                done();
            }, 400);
        });
    });

    describe("EJ2-56516 - Table cell merge with column of contents", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;">test 1</td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">test 2</td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge two rows with content', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table td').innerHTML).toBe("test 1<br>test 2");
                done();
            }, 400);
        });
    });

    describe("MouseMove on same cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', () => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[0].dispatchEvent(ev);
        });
    });

    describe("Table cell merge -multiple row -single columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell merge -multiple row -multiple columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Double time mousemove", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).mouseDownHandler(eventsArg);
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal split with row span - code coverage", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;" rowspan="3"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table cell horizontal split with row span - code coverage', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal split with default row span - code coverage", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" rowspan="1"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table cell horizontal split with default row span - code coverage', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell vertical split with default col span - code coverage", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" colspan="1"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table cell vertical split with default col span - code coverage', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("877970 && 878643 - Table cell selection background color and resize helper restriction during the multiple cell selection", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Table cell selection background color and resize helper restriction during the multiple cell selection', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                expect(document.querySelectorAll('.e-cell-select.e-multi-cells-select').length > 1).toBe(true);
                expect(document.querySelectorAll('.e-rte-table-resize').length === 0).toBe(true);
                done();
            }, 400);
        });
        it('Table mouse move event with not td element', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelector('.e-rte-table').dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                expect(document.querySelectorAll('.e-cell-select').length === 1).toBe(true);
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;" class="e-cell-select" colspan="2" rowspan="2"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal split", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Split first cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(3);
                expect(table.rows[0].children.length).toBe(3);
                expect(table.rows[1].children.length).toBe(1);
                expect(table.rows[2].children.length).toBe(3);
                expect(rows[0].children[0].classList.contains("e-cell-select")).toEqual(true);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[0].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe("2");
                expect(rows[0].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("rowspan")).toBe("2");
                done();
            }, 400);
        });
    });

    describe("Table cell vertical split", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Split first cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                var tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(4);
                expect(table.rows[1].children.length).toBe(3);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("16.6667%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("16.6667%");
                expect((rows[0].children[2] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[3] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[0].children[0].classList.contains("e-cell-select")).toEqual(true);
                expect(rows[0].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[3].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[3].getAttribute("rowspan")).toBe(null);
                //expect(rows[1].children[0].getAttribute("colspan")).toBe("2");
                expect(rows[1].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("872207 - Table cells are collapsed while apply the vertical split.", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 66.6666%;" colspan="2"><br></td><td style="width: 33.3333%;"><br></td><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('Table cells are collapsed while apply the vertical split.', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                var tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(3);
                expect(table.rows[1].children.length).toBe(3);
                expect(parseFloat((rows[0].children[0] as HTMLElement).style.width)).toBeGreaterThan(30);
                expect(parseFloat((rows[0].children[1] as HTMLElement).style.width)).toBeGreaterThan(30);
                expect(parseFloat((rows[0].children[2] as HTMLElement).style.width)).toBeGreaterThan(30);
                expect(rows[0].children[0].classList.contains("e-cell-select")).toEqual(true);
                expect(rows[0].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete Row with single row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First Row', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete Column with single Column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 100%;" class="e-cell-select"><br></td></tr><tr><td style="width: 100%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First Column', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete header column with single Column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="\&quot;e-rte-table\&quot; e-rte-table" style="\&quot;width:" 100%;="" min-width:="" 0px;\"=""><thead><tr><th><br></th></tr></thead><tbody><tr><td style="\&quot;width:" 100%;\"="" class="\&quot;e-cell-select\&quot;"><br></td></tr><tr><td style="\&quot;width:" 100%;\"=""><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First Header Column', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table th');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('th')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 50%;" class="" colspan="2" rowspan="2"><br></td><td style="width: 25%;" class="e-cell-select"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First row with rowspan', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                done();
            }, 400);
        });
    });

    describe("Insert row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 50%;" class="" colspan="2" rowspan="2"><br></td><td style="width: 25%;" class="e-cell-select"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First row with rowspan', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                done();
            }, 400);
        });
    });

    describe("Resizing elements are removed while mouse click in iframe document", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p>Sample</p><p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Resizing elements are removed while mouse click in iframe document', () => {
            let table: Element = rteObj.contentModule.getEditPanel().querySelectorAll('table')[0];
            expect(table.querySelectorAll('tr').length === 2).toBe(true);
            expect(table.querySelectorAll('td').length === 10).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            table = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1];
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 15).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            rteObj.focusIn();
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLButtonElement).click();
            const mouseDownEvent = new MouseEvent('mousedown', { 'view': window, 'bubbles': true, 'cancelable': true });
            rteObj.inputElement.dispatchEvent(mouseDownEvent);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 0).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 0).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 0).toBe(true);
        });
    });

    describe("EJ2-46995 - Resizing a table column and dragging over another table will resize the another table column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p>Sample</p><p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('While hover another table resize helper element availability testing ', () => {
            let table: Element = rteObj.contentModule.getEditPanel().querySelectorAll('table')[0];
            expect(table.querySelectorAll('tr').length === 2).toBe(true);
            expect(table.querySelectorAll('td').length === 10).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            table = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1];
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 15).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
        });
    });

    describe('Inserting table from the toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent'],
                    enable: false
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Toolbar disabled initially, and dynamically enabled', (done: Function) => {
            rteObj.toolbarSettings.enable = true;
            rteObj.dataBind();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            rteObj.toolbarSettings.enable = false;
            rteObj.dataBind();
            expect(rteObj.toolbarSettings.enable).toBe(false);
            done();
        });
    });

    describe(" table row delete testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        afterEach(() => {
            destroy(rteObj);
        });
        it(' delete row', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[2].querySelectorAll('td')[2];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (rows[2].querySelectorAll('td')[2] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                done();
            }, 400);
        });
        it(' delete column', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[2].querySelectorAll('td')[2];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (rows[2].querySelectorAll('td')[2] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(2);
                done();
            }, 400);
        });
        it(' insert column', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[2].querySelectorAll('td')[2];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (rows[2].querySelectorAll('td')[2] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(4);
                done();
            }, 400);
        });
        it(' delete row', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[2].querySelectorAll('td')[2];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (rows[2].querySelectorAll('td')[2] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(4);
                expect(rows[0].children.length).toBe(3);
                done();
            }, 400);
        });

        it('- insert column when table column have different size -', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody>
                <tr>
                    <td style="width: 25%;" class="e-cell-select">1</td>
                    <td style="width: 75%;">3</td>
                </tr>
                <tr>
                    <td style="width: 25%;">2</td>
                    <td style="width: 75%;">4</td>
                </tr>
            </tbody>
            </table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                expect(rows[0].children.length).toBe(2);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (rows[0].querySelectorAll('td')[0] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows[0].children[0].style.width).not.toBe("33.3333%");
                expect(rows[0].children[1].style.width).toBe("33.3333%");
                expect(rows[0].children[2].style.width).not.toBe("33.3333%");
                done();
            }, 400);
        });
    });

    describe('EJ2-49981 - ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({ });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('beforeDialogOpen event trigger testing', (done) => {
            rteObj.showDialog(DialogType.InsertTable);
            setTimeout(() => {
                expect(document.body.querySelectorAll('.e-rte-edit-table.e-dialog').length).toBe(1);
                rteObj.closeDialog(DialogType.InsertTable);
                setTimeout(() => {
                    expect(document.body.querySelectorAll('.e-rte-edit-table.e-dialog').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('EJ2-59978 - Insert table after Max char count - Table Module', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p class="focusNode">RTE Content with RTE</p>',
                toolbarSettings: {
                    items: ['CreateTable']
                },
                maxLength: 20,
                showCharCount: true
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Insert table after Max char count', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[1],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).toBe(null);
            done();
        });
    });

    describe("EJ2-62919 - Hovering over the elements inside the table body in Rich Text Editor", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table><tr><td><p>Provide the tool bar support, it's also customizable.</p></td></tr></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Hovering over the elements inside the table body', () => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td").firstChild;
            setCursorPoint(node, 0);
            node.focus();
            let tableElm = document.querySelector('table');
            expect(tableElm.classList.contains('e-rte-table')).toBe(true);
        });
    });

    describe("EJ2-62919 - Remove the table at initial render", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table><tr><td><p>Provide the tool bar support, it's also customizable.</p></td></tr></table>`,
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableRemove']
                },
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Remove the table at initial render', () => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            let tableCell = document.querySelector('tr').querySelector('td');
            domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
            (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p></br></p>');
        });
    });

    describe("Remove the table at initial render with text node type", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table><tr><td><p>Provide the tool bar support, it's also customizable.</p></td></tr></table>`,
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableRemove','TableHeader', 'TableRows']
                },
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Remove the table at initial render with text node type', () => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            let tableCell = document.querySelector('tr').querySelector('td');
            domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.childNodes[0].childNodes[0], tableCell.childNodes[0].childNodes[0], 0, 0);
            (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
            let tableHeaderCell = document.querySelector('tr').querySelector('th');
            tableHeaderCell.classList.add('e-cell-select');
            domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableHeaderCell, tableHeaderCell, 0, 0);
            (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
            (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
            domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.childNodes[0].childNodes[0], tableCell.childNodes[0].childNodes[0], 0, 0);
            (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
            expect(rteObj.contentModule.getEditPanel().innerHTML === '<p></br></p>');
        });
    });

    describe("EJ2-67615: Table quick toolbar got misplaced outside the Rich Text Editor when enabling IFrame", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p>
                <table class="e-rte-table" style="width: 100%; min-width: 0px;">
                    <tbody>
                        <tr>
                            <td class="" style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><br></td>
                            <td style="width: 10%;"><p>The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid HTML markup or markdown of the <span class="focusNode">content</span></p></td>
                        </tr>
                    </tbody>
                </table>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it('Table quick toolbar got misplaced when enabling IFrame', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector(".focusNode");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            expect((document.querySelectorAll('.e-rte-quick-popup') as any).length).toBe(1);
            done();
        });
    });

    describe('table resize', function () {
        let rteObj: RichTextEditor;
        var rteEle: HTMLElement;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                enterKey : 'DIV',
                value: `<table class="\&quot;e-rte-table\&quot; e-rte-table" style="width: 385px; height: 187px;" 100%;\"=""><tbody><tr><td style="\&quot;width:" 33.3333%;\"="" class="\&quot;\&quot;">1</td><td style="\&quot;width:" 33.3333%;\"="">4</td><td style="\&quot;width:" 33.3333%;\"="">7</td></tr><tr><td style="\&quot;width:" 33.3333%;\"="" class="">2</td><td style="\&quot;width:" 33.3333%;\"="" class="\&quot;e-cell-select\&quot;">5</td><td style="\&quot;width:" 33.3333%;\"="" class="">8</td></tr><tr><td style="\&quot;width:" 33.3333%;\"="">3</td><td style="\&quot;width:" 33.3333%;\"="">6</td><td style="\&quot;width:" 33.3333%;\"="">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Remove the table using the Quicktoolbar with the enter key DIV', function (done) {
            var node = (rteEle as any).querySelector("td");
           setCursorPoint(node, 0);
            node.focus();
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            rteObj.inputElement.dispatchEvent(clickEvent);
            var eventsArg:any = { pageX: 50, pageY: 200, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                (tablePop.querySelectorAll(".e-rte-quick-toolbar.e-rte-toolbar .e-toolbar-items .e-toolbar-item .e-tbar-btn")[5] as HTMLElement).click()
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().innerHTML === '<div><br></div>').toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it('Remove the table using the Quicktoolbar with the enter key DIV <BR>', function (done) {
            rteObj.enterKey = 'BR'
            var node = rteEle.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            rteObj.inputElement.dispatchEvent(clickEvent);
            var eventsArg = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                (tablePop.querySelectorAll(".e-rte-quick-toolbar.e-rte-toolbar .e-toolbar-items .e-toolbar-item .e-tbar-btn")[5] as HTMLElement).click()
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().innerHTML === '<br>').toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('836937 - Checking with the Mozilla Browser', function () {
        let rteObj: RichTextEditor;
        var rteEle: HTMLElement;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        let defaultUA: string = navigator.userAgent;
        beforeEach(function () {
            Browser.userAgent = fireFox;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="\&quot;e-rte-table\&quot; e-rte-table" style="width: 385px; height: 187px;" 100%;\"=""><tbody><tr><td style="\&quot;width:" 33.3333%;\"="" class="\&quot;\&quot; tdElement">1</td><td style="\&quot;width:" 33.3333%;\"="">4</td><td style="\&quot;width:" 33.3333%;\"="">7</td></tr><tr><td style="\&quot;width:" 33.3333%;\"="" class="">2</td><td style="\&quot;width:" 33.3333%;\"="" class="\&quot;e-cell-select\&quot;">5</td><td style="\&quot;width:" 33.3333%;\"="" class="">8</td></tr><tr><td style="\&quot;width:" 33.3333%;\"="">3</td><td style="\&quot;width:" 33.3333%;\"="">6</td><td style="\&quot;width:" 33.3333%;\"="">123456789</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(function () {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('Table module selection on Mozilla', function (done) {
            rteObj.focusIn()
            var tbElement:any = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                expect((rteObj.contentModule.getEditPanel() as any).contentEditable == "true" ).toBe(true);
                done();
            }, 100);
        });
    });

    describe('836937 - Improve coverage for the table module in the Rich Text Editor', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                value:`<ul><li class="e-rte-table" style="width: 100%; min-width: 0px;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"></td><td style="width: 25%;"></td><td style="width: 25%;" class=""><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 1%;"></td><td style="width: 1%;"></td></tr><tr><td style="width: 1%;"></td><td style="width: 1%;"></td></tr></tbody></table><p></p></td><td style="width: 25%;"></td></tr><tr><td style="width: 25%;"></td><td style="width: 25%;"></td><td style="width: 25%;"></td><td style="width: 25%;"></td></tr></tbody></table></li></ul><p><br/></p>`,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Nested table resize', () => {
            var table = rteObj.contentModule.getEditPanel().querySelector('table table');
            var clickEvent = document.createEvent("MouseEvents");
            (<any>rteObj).tableModule.resizeHelper({ target: table, preventDefault: function () { } });
            var reCol1 = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj).tableModule.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (<any>rteObj).tableModule.resizeStart(clickEvent);
            (<any>rteObj).tableModule.resizing({ target: reCol1, pageX: -10, pageY: -10, preventDefault: function () { } });
            (<any>rteObj).tableModule.curTable.style.marginLeft = "145px";
            (<any>rteObj).tableModule.resizing({ target: reCol1, pageX: -100, pageY: -100, preventDefault: function () { } });
            expect(closest(table, 'table').nodeName == "TABLE").toBe(true);
            (<any>rteObj).enableRtl = true;
            (<any>rteObj).tableModule.resizing({ target: reCol1, pageX: -10, pageY: -10, preventDefault: function () { } });
            (<any>rteObj).enableRtl = false;
        });
    });

    describe('836937 - The read-only setting is true in the Rich Text Editor', () => {
        let rteObj : RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                readonly : true,
                  value:`<table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td class="tdElement"></td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
          </table><div id="elementCursorPosition">Rich Text Editor</div>`
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The read-only setting is true in the Rich Text Editor', () => {
            rteObj.focusIn();
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("tdElement");
            const event = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
              });
              tdElement[0].dispatchEvent(event);
            (rteObj.tableModule as any).resizeStart({ target: tdElement[0], pageX: 100, pageY: 0, preventDefault: function () { } });
            expect(rteObj.readonly).toBe(true);
        });
    });

    describe("When you press backspace while the focus is on the tbody, the table will be deleted from the Rich Text Editor", function () {
        var rteObj :RichTextEditor;
        var keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 8,
            shiftKey: false
        };
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in\n                client side.</p><table class=\"e-rte-table\" style=\"width: 100%;\"><thead><tr><th class=\"e-cell-select\"><br></th><th><br></th></tr></thead><tbody><tr><td style=\"width: 50%;\" class=\"\"><br></td><td style=\"width: 50%;\"><br></td></tr><tr><td style=\"width: 50%;\"><br></td><td style=\"width: 50%;\"><br></td></tr></tbody></table>\n                "
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('The focus is in the tbody, the table will be removed in the Rich Text Editor', function (done) {
            var node = rteObj.inputElement.querySelector("tbody");
            setCursorPoint(node, 0);
            (rteObj as any).tableModule.keyDown({ args: keyboardEventArgs });
            expect(rteObj.inputElement.querySelectorAll("table").length == 0).toBe(true);
            done();
        });
    });

    describe('When existing styles are present in the table, the table style gets removed.', function () {
        let rteObj : RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table e-dashed-borders" style="width: 100%; min-width: 0px;"><tbody><tr><td class="tdElement" style="width: 25%;"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;" class="e-cell-select"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table>`
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('The table style is removed through the Quick Toolbar', function (done) {
            rteObj.focusIn()
            const tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            setCursorPoint(tbElement, 0);
            const eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-dashed-borders") as any).click()
                expect(!rteObj.inputElement.querySelector("table").classList.contains("e-dashed-borders")).toBe(true);
                done();
            },100);
        });
    });
    
    describe('Nested list inside the table using the TAB key in the Rich Text Editor', function () {
        let rteObj : RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                saveInterval : 0,
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><ul><li><p class="liElement">Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p></li><li><p>Capable of handling markdown editing.</p></li><li><p>Contains a modular library to load the necessary functionality on demand.</p></li><li><p>Provides a fully customizable toolbar.</p></li></ul></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`,
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Nested list with block node inside the table using the TAB key', function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            let selectioncursor = new NodeSelection();
            let range= document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Tab', keyCode: 9, stopPropagation: function () { }, shiftKey: false, which: 9 };
            (rteObj as any).keyDown(keyBoardEvent);
            rteObj.dataBind();
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.inputElement.querySelector("table tr td li ul") != null).toBe(true);
            done();
        });
        it('Nested list inside the table using the TAB key', function (done) {
            rteObj.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><ol><li><span class="liElement">Rich Text Editor one</span></li><li>Rich Text Editor two<br></li></ol><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`;
            rteObj.dataBind();
            rteObj.focusIn();
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            let selectioncursor = new NodeSelection();
            let range= document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Tab', keyCode: 9, stopPropagation: function () { }, shiftKey: false, which: 9 };
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.inputElement.querySelector("table tr td li ol li") != null).toBe(true);
            done();
        });
        it("When pressing the ArrowRight key, the cursor doesn't move to the next element", function (done) {
            rteObj.value = `<table class="e-rte-table">
            <tbody><tr>
              <td class="">
              <ol>
                <li class="liElement">Coffee</li>
                <li>Tea</li>
                <li>Milk</li>
               </ol>
              </td>
              <td>Maria Anders</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
          </tbody></table>`;
            rteObj.dataBind();
            rteObj.focusIn();
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            let selectioncursor = new NodeSelection();
            let range= document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            var position = window.getSelection().anchorNode;
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'ArrowRight', keyCode: 39, stopPropagation: function () { }, shiftKey: false, which: 39 };
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(function () {
                expect( window.getSelection().anchorNode == position).toBe(true);
                done();
            },100)
        });
    });

    describe('Checking the table insert without the br tag', function () {
        let rteObj : RichTextEditor;
        var rteEle :any;
        beforeAll(function () {
            rteObj = renderRTE({
                value : "<p><br/></p><p class='liElement'><br/></p>",
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Checking the table insert without the br tag', function (done) {
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            tdElement[0].childNodes[0].remove()
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            rteEle.querySelectorAll(".e-toolbar-item")[0].click();
            var event = {
                target: rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[1],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
             expect(rteObj.inputElement.querySelectorAll("p")[1].innerHTML == '<br>').toBe(true);
            done();
        });
    });

    describe('Table dialogClose event trigger testing', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                beforeDialogOpen(e: any): void {
                    e.cancel = true;
                },
                dialogClose(e: any): void {
                }
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('dialogClose event trigger testing', (done) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector(".e-rte-edit-table") == null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('The cursor focuses on the previous element when you press the shift and tab.', function () {
        let rteObj : RichTextEditor;
        var rteEle :any;
        var keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(function () {
            rteObj = renderRTE({
                value : `<p>Rich Text Editor</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;"><br></td><td class="liElement" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`,
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('The cursor focuses on the previous element when you press the shift and tab', function (done) {
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            tdElement[0].childNodes[0].remove()
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.shiftKey = true;
            var previousPosition = window.getSelection().anchorNode; 
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(previousPosition !=  window.getSelection().anchorNode).toBe(true);
            done();
        });
    });

    describe('876566 - The cursor focuses on the previous or next element when you press back space or delete.', function () {
        let rteObj : RichTextEditor;
        var rteEle :any;
        var keyboardEventArgs = {
            preventDefault: function () { },
            code: "Delete",
            which: 46
        };
        beforeAll(function () {
            rteObj = renderRTE({
                value : `<p class="start">Rich Text Editor</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="liElement" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p class="end">Rich Text Editor</p>`,
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('The cursor focuses on the next element when you press delete', function (done) {
            const element: HTMLElement = rteObj.contentModule.getDocument().querySelector(".start");
            element.focus();
            var range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            const sel: Selection = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            keyboardEventArgs.code = 'Delete';
            keyboardEventArgs.which = 46;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect((window.getSelection().anchorNode as HTMLElement).classList.contains('e-table-fake-selection')).toBe(true);
            const fakeEle = rteObj.contentModule.getDocument().querySelector(".e-table-fake-selection")
            fakeEle.remove();
            const tableEle = rteObj.contentModule.getDocument().querySelector(".e-rte-table");
            tableEle.classList.remove('e-cell-select');
            done();
        });
        it('The cursor focuses on the previous element when you press backspace', function (done) {
            const element: HTMLElement = rteObj.contentModule.getDocument().querySelector(".end");
            element.focus();
            var range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            const sel: Selection = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            keyboardEventArgs.code = 'Backspace';
            keyboardEventArgs.which = 8;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect((window.getSelection().anchorNode as HTMLElement).classList.contains('e-table-fake-selection')).toBe(true);
            done();
        });
    });

    describe('Add the custom class in the table dialog through the cssClass property.', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                cssClass :"rich_Text_Editor",
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Add the custom class in the table dialog through the cssClass property', (done) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector(".e-rte-table-popup.rich_Text_Editor") != null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('When you click the outside table dialog, the dialog will be hidden', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('When you click the outside table dialog, the dialog will be hidden', (done) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as HTMLElement).click();
            setTimeout(() => {
                var clickEvent = document.createEvent ('MouseEvents');
                clickEvent.initEvent ('mousedown', true, true);
                rteObj.inputElement.querySelector("p").dispatchEvent (clickEvent);
                expect(document.querySelector(".e-rte-edit-table") == null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('A custom class added the button element for the table dialog', function () {
        var rteObj: RichTextEditor ;
        beforeAll(function (done) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                cssClass: "rich_Text_Editor",
            });
            done();
        });
        afterAll(function (done) {
            destroy(rteObj);
            done();
        });
        it('A custom class added the button element for the table dialog', function (done) {
            (rteObj as any).element.querySelector('.e-toolbar-item button').click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                expect(document.querySelector(".e-rte-edit-table .e-footer-content button").classList.contains("rich_Text_Editor")).toBe(true);
                done();
            }, 100);
        });
    });

    describe('When you open the table dialog, you need to close the existing one', function () {
        var rteObj : RichTextEditor;
        beforeAll(function (done) {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
            });
            done();
        });
        afterAll(function (done) {
            destroy(rteObj);
            done();
        });
        it('When you open the table dialog, you need to close the existing one', function (done) {
            (rteObj as any).element.querySelector('.e-toolbar-item button').click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as any).click();
            setTimeout(function () {
                (rteObj as any).tableModule.insertTableDialog({ target:document.querySelector(".e-rte-edit-table"), pageX: 100, pageY: 0, preventDefault: function () { } });
                expect(document.querySelector(".e-rte-edit-table") == null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Cursor with empty text in the table when pressing the upper arrow', function () {
        var rteObj: RichTextEditor;
        var keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(function () {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 100%;"><br><br><br>Rich Text Editor</td></tr></tbody></table><p><br></p>`, 
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Cursor with empty text in the table when pressing the upper arrow', function (done) {
            var tdElement = rteObj.inputElement.querySelector("table tbody td").childNodes[3];
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            keyboardEventArgs.keyCode = 38;
            var previousPosition = window.getSelection().anchorNode;
            (rteObj as any).tableModule.keyDown({ args: keyboardEventArgs });
            expect(previousPosition == window.getSelection().anchorNode).toBe(true);
            done();
        });
    });

    describe('Background colour applied for the selected table td element', function () {
        var rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: "<table class=\"e-rte-table e-dashed-borders\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"tdElement\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\" class=\"e-cell-select\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table>"
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Background colour applied for the selected table td element', function (done) {
            rteObj.focusIn();
            var tdElement :any = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).tableModule.setBGColor({
                "item": {
                    "command": "Font",
                    "subCommand": "BackgroundColor",
                    "value": "rgb(255, 255, 0)"
                },
                "name": "tableColorPickerChanged"
            });
            expect(tdElement.style.backgroundColor != '' ).toBe(true);
            done();
        });
    });

    describe('Table dialog popup position', function () {
        var rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: "<table class=\"e-rte-table e-dashed-borders\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"tdElement\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\" class=\"e-cell-select\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table>"
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Table dialog popup position', function (done) {
            Browser.userAgent = androidUA;
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td");
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1, touches:  { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }] };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            expect(! isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
            Browser.userAgent = currentBrowserUA;
            done();
        });
    });

    describe('Remove the table helper element when selecting the table', function () {
        var rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: "<table class=\"e-rte-table e-dashed-borders\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"tdElement\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\" class=\"e-cell-select\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table>"
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Remove the table helper element when selecting the table', function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tableElement = rteObj.contentModule.getEditPanel().querySelector("table");
            var eventsArg = { pageX: 50, pageY: 300, target: tdElement, which: 1 };
            (rteObj as any).tableModule.resizeHelper({ target: tableElement, preventDefault: function () { } });
            var resizeCol = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (rteObj as any).tableModule.resizeStart({target:resizeCol, pageX: 100, pageY: 0, preventDefault: function () { } });
            (rteObj as any).tableModule.appendHelper();
            (rteObj as any).mouseDownHandler(eventsArg);
            expect( document.querySelectorAll(".e-table-rhelper.e-column-helper").length < 2 ).toBe(true);
            done();
        });
    });

    describe('Add table element padding', function () {
        var rteEle;
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties']
                },
                value : `<table class="e-rte-table e-rte-table-border" style="width: 100%; min-width: 0px;" cellspacing="2"><tbody><tr><td class="" style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td></tr><tr><td style="width: 25%; padding: 2px;" class="e-cell-select"><p id="tdElement">Rich Text Editor</p></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td></tr><tr><td style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;"><br></td></tr></tbody></table>`,
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Add table element padding', function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var eventsArg = { pageX: 50, pageY: 300, target: tdElement, which: 1, touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }] };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (document.querySelector(".e-rte-quick-toolbar .e-toolbar-item button") as any).click()
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content button") as any).click()
                expect((document.querySelector("table td") as any).style.padding == '2px').toBe(true);
                done();
            }, 500);
        });
    });

    describe('The dialog popup is closed when set to beforeClose args.cancel to true', function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [ 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties','TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
                },
                beforeDialogClose : function(e){
                    e.cancel = false;
                },
                value:`<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><table class="e-rte-table e-rte-table-border" style="width: 392px; min-width: 0px;" cellspacing="0"><tbody><tr style="height: 115px;"><td class="" style="width: 35.4592%; padding: 0px;"><br></td><td style="width: 28.0612%; padding: 0px;" class=""><br></td><td style="width: 36.2245%; padding: 0px;" class=""><br></td></tr><tr><td style="width: 35.4592%; padding: 0px;"><br></td><td style="width: 28.0612%; padding: 0px;"><br></td><td style="width: 36.2245%; padding: 0px;"><br></td></tr></tbody></table><p><br></p></td><td style="width: 34.4316%;" class=""><br></td><td style="width: 32.1252%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 34.4316%;" class=""><br></td><td style="width: 32.1252%;"><br></td></tr></tbody></table>`
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('The dialog popup is closed when set to beforeClose args.cancel to true', function (done) {
            rteObj.focusIn();
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button") as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                document.querySelector(".e-rte-edit-table.e-dialog.e-rte-elements.e-popup").classList.remove("e-popup-open");
                document.querySelector(".e-rte-edit-table.e-dialog.e-rte-elements.e-popup").classList.add("e-popup-close");
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-cancel") as any).click();
                expect(document.querySelector(".e-rte-edit-table.e-dialog.e-rte-elements.e-popup").classList.contains("e-popup-close")).toBe(true);
                done();
            }, 100);
        });
    });

    describe('When the enter key action is DIV, the inserted table next to it is a div element.', function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enterKey : 'DIV',
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('When the enter key action is DIV, the inserted table next to it is a div element.', function (done) {
            rteObj.focusIn();
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button") as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table") as any).click();
                expect(document.querySelector(".e-content table").nextSibling != null).toBe(true);
                done();
            }, 100);
        });
        it('When the enter key action is BR, the inserted table next to it is a div element.', function (done) {
            rteObj.focusIn();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button")as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table")as any).click();
                expect(document.querySelector(".e-content table").nextSibling != null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('An empty LI tag was removed while inserting the table', function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enterKey: 'DIV',
                value: `<div class="editable-content">
                <ul>
                  <li>RTE</li>
                  <li></li>
                </ul>
                <ol>
                  <!-- No list items inside this ordered list -->
                </ol>
                <ul></ul> <!-- Empty unordered list -->
                <ol>
                  <li></li>
                  <li></li>
                  <li></li>
                </ol>
              </div>
              <div id="divElement"></div>`
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('An empty LI tag was removed while inserting the table', function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("#divElement");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button")as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table")as any).click();
                expect(rteObj.inputElement.querySelectorAll('li *:empty:not(img)').length == 4).toBe(true);
                done();
            }, 100);
        });
    });

    describe("When you set the table width ('300') as a string, it's converted to the PX.", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: {
                    width: '300'
                },
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it("When you set the table width ('300') as a string, it's converted to the PX.", function (done) {
            rteObj.focusIn();
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button")as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn")as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table")as any).click();
                expect(rteObj.inputElement.querySelector("table").style.width == '300px').toBe(true);
                done();
            }, 100);
        });
    });

    describe("Press the enter key DIV with the empty value in the Rich Text Editor.", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enterKey : "DIV",
                value: "<p></p>"
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it("Press the enter key DIV with the empty value in the Rich Text Editor.", function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("p");
            let selectioncursor = new NodeSelection();
            let range= document.createRange();
            range.setStart(tdElement, 1);
            selectioncursor.setRange(document, range);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Backspace', keyCode: 8, stopPropagation: function () { }, shiftKey: false, which: 8 };
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).dataBind();
            document.querySelector(".e-content").innerHTML = '';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.inputElement.innerHTML == '<div><br></div>').toBe(true);
            done();
        });
    });

    describe("Press the enter key BR with the empty value in the Rich Text Editor.", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enterKey : "BR",
                value: "<p></p>"
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it("Press the enter key BR with the empty value in the Rich Text Editor.", function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.inputElement.querySelector("p");
            let selectioncursor = new NodeSelection();
            let range= document.createRange();
            range.setStart(tdElement, 1);
            selectioncursor.setRange(document, range);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Backspace', keyCode: 8, stopPropagation: function () { }, shiftKey: false, which: 8 };
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).dataBind();
            document.querySelector(".e-content").innerHTML = '';
            (rteObj as any).keyUp(keyBoardEvent);
            expect(rteObj.inputElement.innerHTML == "<br>").toBe(true);
            done();
        });
    });

    describe("Table last column resizing is not working when table is pasted from MS Word.", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('resizing last column in a table which has no width', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent1: any = document.createEvent("MouseEvents");
            clickEvent1.initEvent("click", false, true);
            target.dispatchEvent(clickEvent1);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent1);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            table.style.removeProperty('width');
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            clickEvent1.initEvent("mousedown", false, true);
            reCol.dispatchEvent(clickEvent1);
            (rteObj.tableModule as any).resizeStart(clickEvent1);           
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            let width: any = table.querySelectorAll("tr")[0].querySelectorAll("td")[2].offsetWidth;
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            expect(width).not.toEqual((table as HTMLTableElement).querySelectorAll("tr")[0].querySelectorAll("td")[2].offsetWidth);
        });
    });

    describe('850000 - In iframe mode table popup doesnot close properly', () =>  {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
        });
        
        afterAll(() => {
            destroy(rteObj);
        });

        it('Should close the Create table popup on the edit area click', () => {
            rteObj.focusIn();
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLButtonElement).click();
            expect(rteObj.element.querySelector('.e-rte-table-popup').classList.contains('e-popup-open')).toBe(true);
            const mouseDownEvent = new MouseEvent('mousedown', { 'view': window, 'bubbles': true, 'cancelable': true });
            rteObj.inputElement.dispatchEvent(mouseDownEvent);
            expect(rteObj.element.querySelector('.e-rte-table-popup')).toBe(null);
        });
    });

    describe('850230 - CTRL + SHIFT + E Does not insert the table at the current cursor position ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let innerHTML: string = `<p class="focusNode">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
        <p><b>Toolbar</b></p>
        <ol>
            <li>
                <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
            </li>
            <li>
                <p>The Toolbar is fully customizable </p>
            </li>
        </ol>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check that the inserted table is in the current cursor position.', () => {
            rteObj.focusIn();
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 5);
            node.focus();
            const keyEvent = new KeyboardEvent("keydown", {
                key: "E",
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true,
                code: "KeyE",
                charCode: 0,
                keyCode: 69,
                which: 69
            } as EventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(keyEvent);
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            let focusNode: Element = (rteObj as any).inputElement.querySelector(".focusNode").nextSibling as Element;
            expect(focusNode.classList.contains('e-rte-table')).toBe(true);
        });
    });

    describe('850079 - Link and table Quick toolbar has open while .Paste the bolded link inside the table ', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="MsoNormal"><b><span lang="EN-IN"><a href="https://en.wikipedia.org/wiki/Forest_ecology"><i><span class="targetSpan"style="font-size: 10.5pt; line-height: 107%; font-family: Arial, sans-serif; color: rgb(51, 102, 204); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Forest ecology</span></i></a><o:p></o:p></span></b></p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the number of quick toolbar open', () => {
            rteObj.focusIn();
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = document.querySelector('.targetSpan');
            setCursorPoint(target, 0);
            target.focus();
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, ctrlKey: false };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            expect(document.querySelectorAll('.e-rte-quick-popup').length == 1).toBe(true);
        });
    });

     describe('Table coverage case with inline mode', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><p class="MsoNormal"><b><span lang="EN-IN"><a href="https://en.wikipedia.org/wiki/Forest_ecology"><i><span class="targetSpan"style="font-size: 10.5pt; line-height: 107%; font-family: Arial, sans-serif; color: rgb(51, 102, 204); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Forest ecology</span></i></a><o:p></o:p></span></b></p></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>  `;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties']
                },
                inlineMode:{
                    enable: true
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Table coverage case with inline mode', (done) => {
            rteObj.focusIn();
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = document.querySelector('table td');
            setCursorPoint(target, 0);
            target.focus();
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, ctrlKey: false };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (document.querySelector('#' + rteObj.element.id + '_quick_TableEditProperties') as HTMLElement).click();
            done();
        });
    });

    describe("821533 - Table does not inserted in the selected area", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p class="focusNode">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
                <p><b>Toolbar</b></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it('Checking that the table is inserted in the selected area', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            let nodeSelection: NodeSelection = new NodeSelection();
            nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 3, 108);
            node.focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let focusNode: Element = (rteObj as any).inputElement.querySelector(".focusNode").nextSibling as Element;
            expect(focusNode.classList.contains('e-rte-table')).toBe(true);
            done();
        });
    });

    describe('865553 The Table resize border position does not refresh after the enter action', () => {
        let editor: RichTextEditor;
        const enterKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
            bubbles: true,
            cancelable: true
        } as EventInit);
        const enterKeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            shiftKey: false,
            ctrlKey: false,
            altKey: false,
            bubbles: true,
            cancelable: true
        } as EventInit);
        beforeEach(() => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 23.0542%; min-width: 0px; height: 60px;"><tbody><tr><td class="" style="width: 100%;">Hi Team<br><br>Could you please check the issue.<br><br><br><br><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Checking the resize border position after the enter action', (done: DoneFn) => {
            // Partially covered for coverage purpose.
            editor.focusIn();
            let table = editor.element.querySelector('table') as HTMLElement;
            setCursorPoint(table.querySelector('td').firstChild as HTMLElement, 3);
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            const mouseDownEvent = new MouseEvent('mousedown', { 'view': window, 'bubbles': true, 'cancelable': true });
            table.querySelector('td').dispatchEvent(mouseOverEvent);
            table.querySelector('td').dispatchEvent(mouseDownEvent);
            document.activeElement.dispatchEvent(enterKeyDownEvent);
            document.activeElement.dispatchEvent(enterKeyUpEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelector('.e-table-box')).toBe(null);
                done();
            }, 200);
        });
    });

    describe('860995 - The List items get removed when inserting a table inside the list..', () => {
        let editor: RichTextEditor;
        let listCount: number;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'OrderedList', 'UnorderedList']
                },
                value: `<p><span style="font-weight: 700;">Work Details:</span></p>
                <ul>
                    <li>&nbsp;</li>
                </ul>
                <p><span style="font-weight: 700;">Issue:</span></p>
                <ul>
                    <li><br></li>
                </ul>
                <p><span style="font-weight: 700;">Root Cause:</span></p>
                <ul>
                    <li><br></li>
                </ul>
                <p><span style="font-weight: 700;">Solution Description:</span></p>
                <ul>
                    <li><br></li>
                </ul>
                <p><span style="font-weight: 700;">Commit Details:</span></p>
                <ul>
                    <li><br></li>
                </ul>
                <p><span style="font-weight: 700;">PR Links:</span></p>
                <ul>
                    <li><br></li>
                </ul>
                <p><span style="font-weight: 700;">Covering Test Cases:</span></p>
                <ol>
                    <li><br></li>
                </ol>
                <p><span style="font-weight: 700;">Reference Links:</span></p>
                <ul style="margin-bottom: 0px;">
                    <li><br style="font-size: 13.3333px;"></li>
                </ul>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should not remove the list items when inserting a table inside the list.', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.element.querySelector('li').firstChild as Element, 1);
            const tableButton: HTMLElement = editor.element.querySelector('.e-rte-toolbar .e-toolbar-item button');
            tableButton.click();
            listCount = editor.inputElement.querySelectorAll('li').length;
            const insertButton: HTMLElement = document.querySelector('.e-insert-table-btn');
            insertButton.click();
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(listCount);
                done();
            }, 200);
        });
    });

    describe('873562 - When the cursor is at the end of the List item Inserted table has an additional list item.', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'OrderedList', 'UnorderedList']
                },
                value: `<p><b>Toolbar</b></p>
                <ol>
                    <li> 
                        <p>List 1</p>
                    </li>
                    <li> 
                        <p>List 2</p>
                    </li>
                </ol>
                <ul><li>List 1</li><li>List 2</li><li>List 3</li></ul>
                `
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it ('Should not add an additional list item when inserting a table at the end of the list item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelector('li').childNodes[1].firstChild, editor.inputElement.querySelector('li').childNodes[1].firstChild.textContent.length);
            range.collapse(true);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const tableBtn = editor.element.querySelectorAll('.e-toolbar-item button')[0];
            (tableBtn as HTMLElement).click();
            (document.querySelector('.e-insert-table-btn') as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('li').length).toBe(5);
            (document.querySelector('.e-insert-table') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.inputElement.querySelector('li').childNodes[1].childNodes[1].nodeName.toLowerCase()).toBe('table');
                expect(editor.inputElement.querySelectorAll('li').length).toBe(5);
                done();
            }, 200);
        });
    });

    describe('837479 - Redo doesn’t works properly in table', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false,
            ctrlKey: false,
            action: ''
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: '<div class="editable-content" id="redo_test"></div>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Redo doesn’t works properly in table', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            let selection: NodeSelection = new NodeSelection();
            let element: HTMLElement = document.getElementById('redo_test');
            selection.setSelectionText(document, element.childNodes[0], element.childNodes[0], 0, 0);
            let saveSelection: NodeSelection;
            let ranges: Range;
            ranges = selection.getRange(document);
            saveSelection = selection.save(ranges, document);
            saveSelection.restore();
            rteObj.executeCommand('insertTable', {
                rows: 1,
                columns: 1,
                selection: saveSelection,
                width: { minWidth: 20, maxWidth: 50, width: 30 }
            });
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 1).toBe(true);
            expect(table.querySelectorAll('td').length === 1).toBe(true);
            let selObj: NodeSelection = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[0], table.querySelectorAll('td')[0], 0, 0);
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[1].innerText).toBe('\n');
            (<any>rteObj).formatter.saveData();
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            let tableAfterUndo: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tableAfterUndo.querySelectorAll('tr').length === 2).toBe(true);
            expect(tableAfterUndo.querySelectorAll('td').length === 2).toBe(true);
        });
    });

    describe('837483 - Cells gets deleted after merged with header.', function () {
        let rteObj : RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: '<table class="e-rte-table tdElement" style="width: 100%; min-width: 0px;"><thead><tr><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="e-cell-select tdEle" style="width: 100%;"><br></td></tr></tbody></table>'
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Cells gets deleted after merged with header', function (done) {
            rteObj.focusIn()
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdEle")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                addClass([table.querySelector('th')], "e-cell-select");
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[3].querySelector(".e-btn-icon.e-caret") as any).click();
                expect(document.querySelector('#' + rteObj.element.id + '_quick_TableCell-popup').querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                done();
            },0);
        });
    });

    describe('876830 - The table header was moved while press enter key in RTE', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEvent: any = {
            preventDefault: function() {},
            keyCode: 13,
            which: 13,
            shiftKey: false,
            code: 'Enter'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th class="e-cell-select"><br></th><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;" class="e-cell-select"><br></td></tr></tbody></table>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The table header was moved while press enter key in RTE', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let selObj: NodeSelection = new NodeSelection();
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('th')[0], table.querySelectorAll('th')[0], 0, 0);
            keyboardEvent.code = 'Enter';
            keyboardEvent.action = 'enter';
            keyboardEvent.which = 13;
            (<any>rteObj).keyDown(keyboardEvent);
            expect(table.querySelectorAll('table tr')[0].firstChild.nodeName !== 'P').toBe(true);
        });
    });

    describe('Table quick toolbar not hide while adding background color', () => {
        var rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: "<table class=\"e-rte-table e-dashed-borders\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td class=\"tdElement\" style=\"width: 25%;\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\" class=\"e-cell-select\"><br></td><td style=\"width: 25%;\" class=\"\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr><tr><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td><td style=\"width: 25%;\"><br></td></tr></tbody></table>"
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Checks quick tool bar closes after applying background color', function (done) {
            rteObj.focusIn();
            var tdElement :any = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).tableModule.setBGColor({
                "item": {
                    "command": "Font",
                    "subCommand": "BackgroundColor",
                    "value": "rgb(255, 255, 0)"
                },
                "name": "tableColorPickerChanged"
            });
            expect((document.querySelectorAll('.e-rte-quick-popup') as any).length).toBe(0);
            done();
        });
    });
    
    describe('896082 - Console Error thrown when we press backspace with editor mode as Markdown.', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2>`;
        beforeAll(() => {
            rteObj = renderRTE({
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                editorMode: 'Markdown',
                value: innerHTML

            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('press back space ', (done: DoneFn) => {
            rteObj.focusIn();
            const backSpaceKeyDownEventInit: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            const backSpaceKeyUpEventInit: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(backSpaceKeyDownEventInit);
            rteObj.inputElement.dispatchEvent(backSpaceKeyUpEventInit);
            setTimeout(() => {
                expect(rteObj.value).toBe('<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2>');
                done();
            }, 100);
        });
    });

    describe('872399 - Close the table popup using esc key, the focus does not move table icon ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'OrderedList', 'UnorderedList']
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('For coverage', (done: DoneFn) => {
            editor.focusIn();
            const tableButton: HTMLElement = editor.element.querySelector('.e-rte-toolbar .e-toolbar-item button');
            tableButton.click();
            const backSpaceKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            document.activeElement.dispatchEvent(backSpaceKeyDownEvent);
            setTimeout(() => {
                done();
            }, 50);
        });
        it('For coverage', (done: DoneFn) => {
            editor.focusIn();
            const tableButton: HTMLElement = editor.element.querySelector('.e-rte-toolbar .e-toolbar-item button');
            tableButton.click();
            const escapekeyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', ESCAPE_KEY_EVENT_INIT);
            (editor.tableModule as any).createTableButton.destroy();
            editor.inputElement.dispatchEvent(escapekeyUpEvent);
            setTimeout(() => {
                expect( (editor.tableModule as any).getSelectedTableEle([])).toBeNull();
                done();
            }, 50);
        });
    });

    describe("908652 - Table Width Shrinks When Pasting a Table from Outlook and Adding a Column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableColumns']
                },
                value: `<table border="1" cellspacing="0" cellpadding="0" style="border:none;" class="e-rte-table">
                <tbody><tr style="height:31.25pt;">
                 <td width="180" valign="top" style="width:135.3pt;border:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C1R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C2R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border:solid windowtext 1.0pt;
                 border-left:none;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                </tr>
                <tr style="height:29.85pt;">
                 <td width="180" valign="top" style="width:135.3pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C1R2</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C2R2</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R2</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                </tr>
                <tr style="height:31.25pt;">
                 <td width="180" valign="top" style="width:135.3pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C1R3</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C2R3</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R3</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                </tr>
                <tr style="height:29.85pt;">
                 <td width="180" valign="top" style="width:135.3pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C1R4</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C2R4</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R4</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:29.85pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                </tr>
                <tr style="height:31.25pt;">
                 <td width="180" valign="top" style="width:135.3pt;border:solid windowtext 1.0pt;
                 border-top:none;
                 padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                 <td width="181" valign="top" style="width:135.4pt;border-top:none;border-left:
                 none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:31.25pt;">
                 <p style="margin:0in;font-size:11.0pt;font-family:&quot;Aptos&quot;,sans-serif;">C3R1</p>
                 </td>
                </tr>
               </tbody></table><p><br></p>`,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Table Width Shrinks When Pasting a Table from Outlook and Adding a Column', (done: Function) => {
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[4];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                var table = rteObj.element.querySelector('table');
                expect(table.style.width).toBe('');
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                expect(table.style.width != '').toBe(true);
                done();
            }, 100);
        });
    });

    describe("904465 - Cell is not properly visible and cursor is not at correct position in cell after merging the all the cells in single row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Merge two columns in single row', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            let height: any = (rteObj as any).inputElement.querySelector('table td').offsetHeight;
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                expect((rteObj as any).inputElement.querySelector('table td').offsetHeight).toBe(22);
                expect(height + 2 ).toEqual((rteObj as any).inputElement.querySelector('table td').offsetHeight);
                done();
            }, 100);
        });
    });

    describe('916901: Table quick toolbar did not open on right click in mac.', () => {
        let rteObj: RichTextEditor;
        let defaultUA: string = navigator.userAgent;
        let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
        beforeAll(() => {
            Browser.userAgent = safari;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                        showOnRightClick: true
                    },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('Should open the quick toolbar on the Mac Safari.', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node, which: 3 };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length > 0).toBe(true);
                done();
            }, 100);
        });
    });
  
    describe('911853: Table resizing in RTE causes wrong height calculation in FireFox  ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        
        it('check height when resizing', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let height: any = (table as HTMLTableElement).offsetHeight;
            let tableBox: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            tableBox.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 100, preventDefault: function () { } });
            height = (table as HTMLTableElement).offsetHeight;
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 200, preventDefault: function () { } });
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 400, preventDefault: function () { } });
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 600, preventDefault: function () { } });
            height += 500;
            expect(height).toEqual((table as HTMLTableElement).offsetHeight);
        });
    });
    describe('916978: After resizing the image with a percentage in the toolbar, the image does not display according to the adjusted height and weight inside the table', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({toolbarSettings: {
                items: ['CreateTable'],
            },
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr style="height: 33.7662%;"><td class="e-cell-select" style="width: 33.3333%;"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="342" height="193" style="min-width: 0px; max-width: 342px; min-height: 0px; width: 30%; height: 50%;"> </td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 33.7662%;"><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 33.7662%;"><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it ('select the table to check the image when height is setted to percentage', (done: DoneFn) => {
            editor.focusIn();
            const nextElement = document.querySelector('td').nextElementSibling;
            if (nextElement) {
                const clickEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                nextElement.dispatchEvent(clickEvent);
            }
            setTimeout(() => {
                expect(document.querySelector('td').style.height === 'inherit').toBe(true);
                done();
            }, 100);
        });
    });

    describe('935060 - Cursor Does Not Navigate to the Previous Line in a Table Cell When Pressing the Left Arrow Key.', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
            }
            );
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Place the cursor at the end of the <td> element and press the left arrow key.', (done) => {
            editor.focusIn();
            var tbElement = editor.contentModule.getEditPanel().querySelector(".tdElement")
            setCursorPoint(tbElement, 0);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'ArrowLeft', keyCode: 37, stopPropagation: function () { }, shiftKey: false, which: 37 };
            (editor as any).keyDown(keyBoardEvent);
            expect(tbElement.parentElement.contains(window.getSelection().getRangeAt(0).startContainer)).toBe(true);
            done();
        });
    });

    describe('923379 - IFrame: Alternate Row Styles Fail to Apply in Table Cell Using Table Quick Toolbar', function () {
        let rteObj : RichTextEditor;
        let controlId: string;
        let rteEle: HTMLElement;
        let div: HTMLElement;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                iframeSettings: {
                    enable: true
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="tdElement" style="width: 25%;"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;" class="e-cell-select"><br></td><td style="width: 25%;" class=""><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Alternate rows', function (done) {
            rteObj.focusIn()
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            setCursorPoint(tbElement, 0);
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
            (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
            (document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows") as any).click();
            detach(div);
            setCursorPoint(tbElement, 0);
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(() => {
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                let secondRow: HTMLElement = tar.querySelectorAll('tr')[1] as HTMLElement;
                expect(window.getComputedStyle(secondRow).backgroundColor).toBe("rgb(245, 245, 245)");
                detach(div);
                done();
            }, 100);
        });
    });

    describe('936577 - Cursor Moves to Last Cell Instead of Staying in First Cell When Pressing Shift + Tab in Table 1st cell', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            }
            );
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should keep the cursor in the first cell of the table header when Shift+Tab is pressed', (done) => {
            editor.focusIn();
            var tbElement = editor.contentModule.getEditPanel().querySelectorAll("table th")[0];
            setCursorPoint(tbElement, 0);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Tab', keyCode: 9, stopPropagation: function () { }, shiftKey: true, which: 9 };
            (editor as any).keyDown(keyBoardEvent);
            expect(tbElement === window.getSelection().getRangeAt(0).startContainer).toBe(true);
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p></td><td style="width: 50%;" class="tdElement"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`;
            editor.dataBind();
            tbElement = editor.contentModule.getEditPanel().querySelector(".tdElement");
            setCursorPoint(tbElement, 0);
            (editor as any).keyDown(keyBoardEvent);
            expect(window.getSelection().getRangeAt(0).startContainer === editor.contentModule.getEditPanel().querySelectorAll("table tr td table td")[0]).toBe(true);
            done();
        });
    });

    describe('938242: MAC - The quick toolbar for the MAC opens upon selecting text.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor= renderRTE({
                value: `<table><tr><td>Text Content</td><td>Text Content</td><td>Text Content</td></tr></table>`
            });
        })
        afterAll(()=> {
            destroy(editor);
        })
        it('Should not open the Quick toolbar on right click when range collapsed is false.', (done: DoneFn)=> {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            const range = new Range();
            range.setStart(editor.inputElement.querySelector('td').firstChild, 0);
            range.setEnd(editor.inputElement.querySelector('td').firstChild, 4);
            editor.selectRange(range);
            editor.inputElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
            setTimeout(() => {
                expect(editor.quickToolbarModule.tableQTBar.popupObj.element.classList.contains('e-popup-open')).toBe(false);
                done();
            }, 100);
        })
    });
});
