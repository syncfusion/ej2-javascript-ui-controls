/**
 * Table module spec
 */
import { addClass, Browser, closest, createElement, isNullOrUndefined, detach } from "@syncfusion/ej2-base";
import * as ej2Base from '@syncfusion/ej2-base';
import { RichTextEditor, dispatchEvent, CLS_RTE_PASTE_KEEP_FORMAT, CLS_RTE_PASTE_OK } from "../../../src/rich-text-editor/index";
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { NodeSelection } from '../../../src/selection/index';
import { DialogType, ToolbarType } from "../../../src/common/enum";
import { renderRTE, destroy, setCursorPoint, androidUA, iPhoneUA, currentBrowserUA, ieUA, setSelection } from './../render.spec';
import { getLastTextNode, convertPixelToPercentage, getCorrespondingIndex } from "../../../src/common/util";
import { ARROW_DOWN_EVENT_INIT, ARROW_LEFT_EVENT_INIT, ARROW_UP_EVENT_INIT, ARROWRIGHT_EVENT_INIT, BACKSPACE_EVENT_INIT, BASIC_CONTEXT_MENU_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT, ESCAPE_KEY_EVENT_INIT, INSRT_TABLE_EVENT_INIT, SHIFT_ARROW_DOWN_EVENT_INIT, SHIFT_ARROW_LEFT_EVENT_INIT, SHIFT_ARROW_RIGHT_EVENT_INIT, SHIFT_ARROW_UP_EVENT_INIT, TAB_KEY_EVENT_INIT } from "../../constant.spec";
import { MACOS_USER_AGENT } from "../user-agent.spec";

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

describe('Table Module', () => {

    describe('CSS property change testing, Coverage improvement ', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Update the CSS property dynamically Dialog test', () => {
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

        it('For coverage', () => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            window.getSelection().removeAllRanges();
            const range: Range = document.createRange();
            range.setStart(editor.inputElement.firstChild.firstChild, 0);
            range.setEnd(editor.inputElement.firstChild.firstChild, 0);
            document.getSelection().addRange(range);
            (editor.tableModule as any).tableObj.getBrElement(range, []);
        });

        it('Update the CSS property dynamically Popup test', () => {
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

        it('For coverage', () => {
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 100%;"><br></td></tr></tbody></table><p><br></p>`;
            editor.dataBind();
            (editor.tableModule as any).tableObj.removeTableSelection();
        });

        it('focus of the table cells and then arrow key action to navigate.', () => {
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

        it('focus of the table cells and then shift + arrow keys to select cells.', (done: DoneFn) => {
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
            (editor.tableModule as any).tableObj.resetTableSelection();
            (editor.tableModule as any).tableObj.deleteTable();
            done();
        });
        it('focus of the table with herader cells and then shift + arrow keys to select cells.', (done: DoneFn) => {
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th class="e-cell-select"><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`;
            editor.dataBind();
            editor.focusIn();
            document.getSelection().removeAllRanges();
            let range: Range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select'), 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select'), 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_DOWN_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_DOWN_EVENT_INIT));
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length === 2);
            editor.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th class=""><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 33.3333%;" class="e-cell-select"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`;
            editor.dataBind();
            editor.focusIn();
            range = document.createRange();
            range.setStart(editor.inputElement.querySelector('.e-cell-select').childNodes[0], 0);
            range.setEnd(editor.inputElement.querySelector('.e-cell-select').parentElement.parentElement.parentElement, 0);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_UP_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_UP_EVENT_INIT));
            (editor.tableModule as any).tableObj.resetTableSelection();
            (editor.tableModule as any).tableObj.deleteTable();
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length === 2)
            done();
        });
        it("code coverage", (done: DoneFn) => {
            editor.editorMode = 'Markdown';
            (editor.tableModule as any).handleSpecialActions({ event: { action: "insert-table" } }, null);
            (editor.tableModule as any).openDialog(true, null);
            const node = document.createTextNode("Test");
            (editor.tableModule as any).verticalAlign({ selectParent: [node] }, null);
            editor.editorMode = 'HTML';
            done();
        });
    });

    describe('963100 - Table cell with emoji - Enter key and heading format issue', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Formats', 'CreateTable']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td> <td style="width: 23.2295%"><span>Andrew James</span><br></td> <td style="width: 9.91501%">45</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Lawyer</td> <td style="width: 21.1048%" class="e-cell-select"><span style="font-size: 14pt">🚕<br><br></span></td> </tr> </tbody> </table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it('should handle cursor positioning correctly after Enter key in emoji cell', (done: Function) => {
            rteObj.focusIn();

            const table: HTMLTableElement = rteObj.contentModule.getEditPanel().querySelector('table');
            const lastCell: HTMLTableCellElement = table.querySelector('tbody tr:last-child td:last-child');
            const emojiSpan: HTMLSpanElement = lastCell.querySelector('span[style*="font-size: 14pt"]');

            // Set cursor after emoji
            setCursorPoint(emojiSpan, 1); // Position after the span element

            // Press Enter key
            const keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 13,
                which: 13,
                key: 'Enter',
                code: 'Enter',
                shiftKey: false
            };

            (rteObj as any).keyDown({ args: keyboardEventArgs });

            setTimeout(() => {
                // Try to apply format at current cursor position
                const formatButton: HTMLElement = rteEle.querySelector('#' + rteEle.id + '_toolbar_Formats') as HTMLElement;
                if (formatButton) {
                    formatButton.click();
                    setTimeout(() => {
                        const h1Option: HTMLElement = document.querySelector('.e-h1') as HTMLElement;
                        if (h1Option) {
                            // This should not throw any range-related errors
                            expect(() => {
                                h1Option.click();
                            }).not.toThrow();
                        }
                        done();
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
    });

    describe('948232 - Table module coverage improvements', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', 'BackgroundColor', 'TableRemove']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('insideList method with range at start offset', () => {
            rteObj.focusIn();
            const listItem = document.createElement('li');
            const paragraph = document.createElement('p');
            paragraph.textContent = 'List item content';
            listItem.appendChild(paragraph);
            rteObj.inputElement.appendChild(listItem);
            const range = document.createRange();
            range.setStart(listItem, 0);
            range.setEnd(listItem, 0);
            const result = (rteObj.tableModule as any).tableObj.insideList(range);
            expect(result).toBeFalsy();
        });
        it('getBlockNodesInSelection method with collapsed range', () => {
            rteObj.focusIn();
            const range = document.createRange();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            range.setStart(cell, 0);
            range.setEnd(cell, 0);

            const blockNodes = (rteObj.tableModule as any).tableObj.getBlockNodesInSelection(range);
            expect(blockNodes.length).toBeGreaterThanOrEqual(0);
        });
        it('getImmediateBlockNode method with various node types', () => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            const textNode = document.createTextNode('Test');
            cell.appendChild(textNode);

            const blockTags = ['DIV', 'P', 'LI', 'TD'];
            const result = (rteObj.tableModule as any).tableObj.getImmediateBlockNode(textNode, blockTags);
            expect(result.nodeName).toBe('TD');
        });
        it('should test removeEmptyTextNodes with various node types', () => {
            rteObj.focusIn();
            const row = rteObj.contentModule.getEditPanel().querySelector('tr');
            const emptyText = document.createTextNode('');
            row.appendChild(emptyText);
            (rteObj.tableModule as any).tableObj.removeEmptyTextNodes(row);
            expect(row.childNodes.length).toBe(2); // Just the two TD cells
        });
        it('should test applyTableStyleCommand with Dashed style - toggle on and off', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Dashed', table);
            expect(table.classList.contains('e-dashed-border')).toBe(true);
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Dashed', table);
            expect(table.classList.contains('e-dashed-border')).toBe(false);
        });

        it('should test applyTableStyleCommand with Alternate style - toggle on and off', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            // Apply Alternate style
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Alternate', table);
            expect(table.classList.contains('e-alternate-border')).toBe(true);
            // Toggle off Alternate style
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Alternate', table);
            expect(table.classList.contains('e-alternate-border')).toBe(false);
        });
        it('should test findNextElementForward with no next sibling', () => {
            rteObj.focusIn();
            const lastCell = rteObj.contentModule.getEditPanel().querySelectorAll('td')[3];
            const result = (rteObj.tableModule as any).tableObj.findNextElementForward(lastCell);
            expect(result).toBe(lastCell); // Should return same element if no next found
        });
        it('should test findPreviousElementBackward with no previous sibling', () => {
            rteObj.focusIn();
            const firstCell = rteObj.contentModule.getEditPanel().querySelector('td');
            const result = (rteObj.tableModule as any).tableObj.findPreviousElementBackward(firstCell);
            expect(result).toBe(firstCell); // Should return same element if no previous found
        });
        it('should test applyCustomCssClasses method with various css classes', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const args = {
                args: {
                    item: {
                        cssClass: 'test-class1 test-class2'
                    }
                }
            };
            // Add classes
            (rteObj.tableModule as any).tableObj.applyCustomCssClasses(args, table);
            expect(table.classList.contains('test-class1')).toBe(true);
            expect(table.classList.contains('test-class2')).toBe(true);
            // Toggle off classes
            (rteObj.tableModule as any).tableObj.applyCustomCssClasses(args, table);
            expect(table.classList.contains('test-class1')).toBe(false);
            expect(table.classList.contains('test-class2')).toBe(false);
        });
        it('should test hideTableQuickToolbar method when toolbar exists', () => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            const eventsArg = { pageX: 50, pageY: 300, target: cell, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(() => {
                (rteObj.tableModule as any).hideTableQuickToolbar();
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
            }, 100);
        });
        it('should test shouldShowQuickToolbar method with various conditions', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const args = { target: table, which: 1 };
            const range = document.createRange();
            range.setStart(table.querySelector('td'), 0);
            range.collapse(true);
            // Set a selection
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const result = (rteObj.tableModule as any).shouldShowQuickToolbar(args, table, range);
            expect(result).toBe(true);
        });
        it('should test keyDown method with shift+tab in first cell', () => {
            rteObj.focusIn();
            const firstCell = rteObj.contentModule.getEditPanel().querySelector('td');
            const args = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: true
            };
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), firstCell, firstCell, 0, 0);
            (rteObj.tableModule as any).keyDown({ args: args });
            expect(document.getSelection().anchorNode).toBeDefined();
        });
        it('should test handleCollapsedRangeBlockNodes and handleExpandedRangeBlockNodes', () => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            const range = document.createRange();
            range.setStart(cell, 0);
            range.collapse(true);
            const blockTags = ['DIV', 'P', 'TD', 'TH'];
            const blockNodes = new Set();
            (rteObj.tableModule as any).tableObj.handleCollapsedRangeBlockNodes(range, blockTags, blockNodes);
            expect(blockNodes.size).toBeGreaterThan(0);
            // Test expanded range
            const range2 = document.createRange();
            range2.setStart(rteObj.contentModule.getEditPanel().querySelectorAll('td')[0], 0);
            range2.setEnd(rteObj.contentModule.getEditPanel().querySelectorAll('td')[1], 0);
            const blockNodes2 = new Set();
            (rteObj.tableModule as any).tableObj.handleExpandedRangeBlockNodes(range2, blockTags, blockNodes2);
            expect(blockNodes2.size).toBeGreaterThan(0);
        });
        it('should test tableHeader method with various arguments', () => {
            rteObj.focusIn();
            const selection = new NodeSelection();
            selection.setSelectionText(
                rteObj.contentModule.getDocument(),
                rteObj.contentModule.getEditPanel().querySelector('td'),
                rteObj.contentModule.getEditPanel().querySelector('td'),
                0, 0
            );
            const e = {
                originalEvent: new MouseEvent('click'),
                item: {
                    subCommand: 'AddHeader'
                }
            };
            (rteObj.tableModule as any).tableHeader(selection, e);
            expect(rteObj.contentModule.getEditPanel().querySelector('thead')).toBeDefined();
        });
    });
    describe('948232 - Table module edge cases', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', 'BackgroundColor', 'TableRemove']
                },
                tableSettings: {
                    width: '800px',
                    minWidth: '500px',
                    resize: true
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test createDialog method with various arguments', () => {
            rteObj.focusIn();
            const args = {
                event: { target: rteObj.contentModule.getEditPanel().querySelector('table') },
                cancel: false
            };
            // Create dialog
            (rteObj.tableModule as any).createDialog(args);
            expect(document.querySelector('.e-rte-edit-table')).not.toBeNull();
        });
        it('should test getCorrespondingIndex method with empty arguments', () => {
            rteObj.focusIn();
            const result = getCorrespondingIndex(null, []);
            expect(result.length).toBe(0);
        });
        it('should test updateResizeIconPosition method with different conditions', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            // Create resize elements
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            // Change table position
            table.style.marginLeft = '50px';
            // Update resize icon positions
            (rteObj.tableModule as any).tableObj.updateResizeIconPosition();
            // Check if the tableBox was repositioned
            const tableBox = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            expect(tableBox.style.left).not.toBe('');
        });
        it('should test tableVerticalAlign method with different alignments', () => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            // Set initial alignment
            cell.style.verticalAlign = 'top';
            const args = {
                tableCell: cell,
                subCommand: 'AlignMiddle'
            };
            // Apply middle alignment
            (rteObj.formatter.editorManager as any).tableObj.tableVerticalAlign({ item: args });
            expect(cell.style.verticalAlign).toBe('middle');
            // Change to bottom alignment
            args.subCommand = 'AlignBottom';
            (rteObj.formatter.editorManager as any).tableObj.tableVerticalAlign({ item: args });
            expect(cell.style.verticalAlign).toBe('bottom');
            // Change to top alignment
            args.subCommand = 'AlignTop';
            (rteObj.formatter.editorManager as any).tableObj.tableVerticalAlign({ item: args });
            expect(cell.style.verticalAlign).toBe('top');
        });
    });
    describe('948232 - Table module with iFrame settings', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', 'BackgroundColor', 'TableRemove']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test keyDown method with tab navigation inside iFrame mode', () => {
            rteObj.focusIn();
            const firstCell = rteObj.contentModule.getEditPanel().querySelector('td');
            const args = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: false
            };
            const selection = new NodeSelection();
            selection.setSelectionText(
                rteObj.contentModule.getDocument(),
                firstCell,
                firstCell,
                0, 0
            );
            (rteObj.tableModule as any).keyDown({ args: args });
            const secondCell = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
            expect(document.getSelection().anchorNode).toBeDefined();
        });
        it('should test resizeHelper with tables inside iFrame', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            // Call resize helper
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            // Check if resize elements were created
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-table-box')).not.toBeNull();
        });
        it('should test creating and applying table styles in iFrame mode', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            // Apply dashed style
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Dashed', table);
            expect(table.classList.contains('e-dashed-border')).toBe(true);
            // Apply alternate style
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Alternate', table);
            expect(table.classList.contains('e-alternate-border')).toBe(true);
            // Custom styles
            const args = {
                args: {
                    item: {
                        cssClass: 'test-class1 test-class2'
                    }
                }
            };
            (rteObj.tableModule as any).tableObj.applyCustomCssClasses(args, table);
            expect(table.classList.contains('test-class1')).toBe(true);
            expect(table.classList.contains('test-class2')).toBe(true);
        });
        it('should test table manipulation inside iFrame', (done) => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            setCursorPoint(cell, 0);
            cell.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                // Find the table rows dropdown button in the quick toolbar
                const rowsButton = document.querySelector('.e-popup-open .e-table-rows');
                if (rowsButton) {
                    (rowsButton as HTMLElement).click();
                    setTimeout(() => {
                        // Find and click the insert row after option
                        const insertRowAfter = document.querySelectorAll('.e-item')[1] as HTMLElement;
                        if (insertRowAfter) {
                            insertRowAfter.click();
                            setTimeout(() => {
                                // Check if new row was added
                                expect(rteObj.contentModule.getEditPanel().querySelector('table').rows.length).toBe(3);
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
    });
    describe('948232 - Table module with different browser environments', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let originalUserAgent: string;
        beforeEach(() => {
            originalUserAgent = Browser.userAgent;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            Browser.userAgent = originalUserAgent;
            destroy(rteObj);
        });
        it('should test table functionality in Firefox browser', () => {
            Browser.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            cell.classList.add('e-cell-select');
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-table-box')).not.toBeNull();
        });
        it('should test table functionality in Edge browser', () => {
            Browser.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59";
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length).toBeGreaterThan(0);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-table-box')).not.toBeNull();
        });
        it('should test table functionality in Safari browser', () => {
            Browser.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const eventsArg = {
                pageX: 50,
                pageY: 50,
                target: cell,
                which: 1
            };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            expect(cell.textContent).toBe('Cell content');
        });
    });
    describe('948232 - Table module dialog tests', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                beforeDialogOpen: function (args) {
                },
                dialogOpen: function (args) {
                },
                beforeDialogClose: function (args) {
                },
                dialogClose: function (args) {
                }
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test table dialog open and customize properties', (done) => {
            rteObj.focusIn();
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                const insertTableBtn = document.querySelector('.e-insert-table-btn');
                if (insertTableBtn) {
                    (insertTableBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const rowsInput = document.querySelector('#tableRow') as HTMLInputElement;
                        const colsInput = document.querySelector('#tableColumn') as HTMLInputElement;
                        rowsInput.value = '5';
                        colsInput.value = '4';
                        rowsInput.dispatchEvent(new Event('change', { bubbles: true }));
                        colsInput.dispatchEvent(new Event('change', { bubbles: true }));
                        const insertBtn = document.querySelector('.e-insert-table');
                        if (insertBtn) {
                            (insertBtn as HTMLElement).click();
                            setTimeout(() => {
                                const newTable = rteObj.contentModule.getEditPanel().querySelectorAll('table')[0];
                                expect(newTable.querySelectorAll('tr').length).toBe(5);
                                expect(newTable.querySelector('tr').querySelectorAll('td').length).toBe(4);
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
        it('should test edit table properties dialog', (done) => {
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            const eventsArg = {
                pageX: 50,
                pageY: 50,
                target: cell,
                which: 1
            };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(() => {
                const tableEditPropsBtn = Array.from(document.querySelectorAll('.e-toolbar-item button')).find(
                    btn => btn.classList.contains('e-table-edit-properties')
                );
                if (tableEditPropsBtn) {
                    (tableEditPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const paddingInput = document.querySelector('#cellPadding') as HTMLInputElement;
                        const spacingInput = document.querySelector('#cellSpacing') as HTMLInputElement;
                        if (paddingInput && spacingInput) {
                            paddingInput.value = '5';
                            spacingInput.value = '2';
                            paddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                            spacingInput.dispatchEvent(new Event('change', { bubbles: true }));
                            const updateBtn = document.querySelector('.e-size-update');
                            if (updateBtn) {
                                (updateBtn as HTMLElement).click();
                                setTimeout(() => {
                                    const table = rteObj.contentModule.getEditPanel().querySelector('table');
                                    expect(table.getAttribute('cellspacing')).toBe('2');
                                    expect(table.querySelectorAll('td')[0].style.padding).toBe('5px');
                                    done();
                                }, 100);
                            } else {
                                done();
                            }
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
        it('should test dialog cancel button', (done) => {
            rteObj.focusIn();
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                const insertTableBtn = document.querySelector('.e-insert-table-btn');
                if (insertTableBtn) {
                    (insertTableBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const cancelBtn = document.querySelector('.e-cancel');
                        if (cancelBtn) {
                            (cancelBtn as HTMLElement).click();
                            setTimeout(() => {
                                const closedDialog = document.querySelector('.e-rte-edit-table');
                                expect(closedDialog).toBeNull();
                                const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
                                expect(tables.length).toBe(1);
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
        it('should test beforeDialogClose event with cancel = true', (done) => {
            rteObj.beforeDialogClose = function (args) {
                args.cancel = true;
            };
            rteObj.dataBind();
            rteObj.focusIn();
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                const insertTableBtn = document.querySelector('.e-insert-table-btn');
                if (insertTableBtn) {
                    (insertTableBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const cancelBtn = document.querySelector('.e-cancel');
                        if (cancelBtn) {
                            (cancelBtn as HTMLElement).click();
                            setTimeout(() => {
                                const openDialog = document.querySelector('.e-rte-edit-table');
                                expect(openDialog).not.toBeNull();
                                rteObj.beforeDialogClose = function (args) {
                                };
                                rteObj.dataBind();
                                (cancelBtn as HTMLElement).click();
                                setTimeout(() => {
                                    const closedDialog = document.querySelector('.e-rte-edit-table');
                                    expect(closedDialog).toBeNull();
                                    done();
                                }, 100);
                            }, 100);
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
    });
    describe('948232 - Table module with different enterKey settings', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                enterKey: 'DIV',
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test table insertion with DIV enterKey setting', (done) => {
            rteObj.focusIn();
            // Set cursor in paragraph before table
            const p = rteObj.contentModule.getEditPanel().querySelector('p');
            const range = document.createRange();
            range.setStart(p.firstChild, 5); // Cursor in middle of text
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                const insertTableBtn = document.querySelector('.e-insert-table-btn') as HTMLElement;
                if (insertTableBtn) {
                    insertTableBtn.click();
                    setTimeout(() => {
                        const confirmBtn = document.querySelector('.e-insert-table') as HTMLElement;
                        if (confirmBtn) {
                            confirmBtn.click();
                            setTimeout(() => {
                                const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
                                expect(tables.length).toBe(2);
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
        it('should test table removal with DIV enterKey setting', (done) => {
            rteObj.value = `<table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table>`;
            rteObj.dataBind();
            rteObj.focusIn();
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            const range = document.createRange();
            range.setStart(cell.firstChild, 0);
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const eventsArg = {
                pageX: 50,
                pageY: 50,
                target: cell,
                which: 1
            };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(() => {
                const removeTableBtn = document.querySelector('.e-table-remove');
                if (removeTableBtn) {
                    (removeTableBtn as HTMLElement).click();
                    setTimeout(() => {
                        const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
                        expect(tables.length).toBe(0);
                        const divs = rteObj.contentModule.getEditPanel().querySelectorAll('div');
                        expect(divs.length).toBeGreaterThanOrEqual(1);
                        done();
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });
    });
    describe('948232 - Table module handleSpecialActions Markdown branch', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                editorMode: 'Markdown'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should process Markdown table insertion in handleSpecialActions method', () => {
            const tableModule = (rteObj as any).tableModule;
            const event = {
                action: 'insert-table',
                preventDefault: jasmine.createSpy('preventDefault')
            };
            spyOn(rteObj.formatter, 'process');
            tableModule.handleSpecialActions(event, null);
            expect(rteObj.formatter.process).toHaveBeenCalledWith(rteObj, null, event);
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });
    describe('948232 - Table module null check branch coverage', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should properly handle non-null formatter.editorManager.nodeSelection and contentModule', () => {
            const tableModule = (rteObj as any).tableModule;
            expect(rteObj.formatter).not.toBeNull();
            expect(rteObj.formatter.editorManager).not.toBeNull();
            expect(rteObj.formatter.editorManager.nodeSelection).not.toBeNull();
            expect(tableModule.contentModule).not.toBeNull();
            const selection = rteObj.formatter.editorManager.nodeSelection;
            const mockFunction = () => {
                if (!isNullOrUndefined(tableModule.parent.formatter.editorManager.nodeSelection) &&
                    tableModule.contentModule) {
                    return true;
                }
                return false;
            };
            expect(mockFunction()).toBe(true);
            const originalNodeSelection = rteObj.formatter.editorManager.nodeSelection;
            const originalContentModule = tableModule.contentModule;
            rteObj.formatter.editorManager.nodeSelection = null;
            expect(mockFunction()).toBe(false);
            rteObj.formatter.editorManager.nodeSelection = originalNodeSelection;
            tableModule.contentModule = null;
            expect(mockFunction()).toBe(false);
            tableModule.contentModule = originalContentModule;
            expect(mockFunction()).toBe(true);
        });
    });
    describe('948232 - Table module tableCellsKeyboardSelection coverage', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test tableCellsKeyboardSelection with cell-select-end elements', () => {
            rteObj.focusIn();
            const tableModule = (rteObj as any).tableModule;
            const originalHandleTableCellArrowNavigation = tableModule.tableObj.handleTableCellArrowNavigation;
            const originalIsTableMultiSelectActive = tableModule.tableObj.isTableMultiSelectActive;
            spyOn(tableModule.tableObj, 'handleTableCellArrowNavigation').and.callThrough();
            spyOn(tableModule.tableObj, 'isTableMultiSelectActive').and.returnValue(false);
            const mockEvent = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            tableModule.tableObj.keyDownEventInstance = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            const cells = rteObj.contentModule.getEditPanel().querySelectorAll('td');
            tableModule.tableObj.setActiveCell(cells[0]);
            cells[1].classList.add('e-cell-select-end');
            tableModule.tableObj.tableCellsKeyboardSelection(mockEvent);
            expect(tableModule.tableObj.handleTableCellArrowNavigation).toHaveBeenCalled();
            expect(tableModule.tableObj.keyDownEventInstance.preventDefault).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            cells[1].classList.remove('e-cell-select-end');
            tableModule.tableObj.handleTableCellArrowNavigation.calls.reset();
            tableModule.tableObj.keyDownEventInstance.preventDefault.calls.reset();
            mockEvent.preventDefault.calls.reset();
            tableModule.tableObj.isTableMultiSelectActive = jasmine.createSpy('isTableMultiSelectActive').and.returnValue(true);
            tableModule.tableObj.tableCellsKeyboardSelection(mockEvent);
            expect(tableModule.tableObj.handleTableCellArrowNavigation).toHaveBeenCalled();
            expect(tableModule.tableObj.keyDownEventInstance.preventDefault).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            tableModule.tableObj.handleTableCellArrowNavigation = originalHandleTableCellArrowNavigation;
            tableModule.tableObj.isTableMultiSelectActive = originalIsTableMultiSelectActive;
        });
        it('should test tableCellsKeyboardSelection with no selected cells', () => {
            rteObj.focusIn();
            const tableModule = (rteObj as any).tableModule;
            const originalHandleTableCellArrowNavigation = tableModule.tableObj.handleTableCellArrowNavigation;
            const originalIsTableMultiSelectActive = tableModule.tableObj.isTableMultiSelectActive;
            spyOn(tableModule.tableObj, 'handleTableCellArrowNavigation').and.callThrough();
            spyOn(tableModule.tableObj, 'isTableMultiSelectActive').and.returnValue(false);
            const mockEvent = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            tableModule.tableObj.keyDownEventInstance = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            const cells = rteObj.contentModule.getEditPanel().querySelectorAll('td');
            cells.forEach(cell => cell.classList.remove('e-cell-select-end'));
            tableModule.tableObj.tableCellsKeyboardSelection(mockEvent);
            expect(tableModule.tableObj.handleTableCellArrowNavigation).not.toHaveBeenCalled();
            expect(tableModule.tableObj.keyDownEventInstance.preventDefault).not.toHaveBeenCalled();
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            tableModule.tableObj.handleTableCellArrowNavigation = originalHandleTableCellArrowNavigation;
            tableModule.tableObj.isTableMultiSelectActive = originalIsTableMultiSelectActive;
        });
    });
    describe('948232 - Table module setupSelectionState coverage', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test setupSelectionState with cell-select-end elements', () => {
            rteObj.focusIn();
            const tableModule = (rteObj as any).tableModule;
            spyOn(rteObj.formatter.editorManager.nodeSelection, 'Clear').and.callThrough();
            spyOn(rteObj.formatter.editorManager.nodeSelection, 'setSelectionText').and.callThrough();
            spyOn(rteObj.formatter.editorManager.nodeSelection, 'setCursorPoint').and.callThrough();
            const cells = rteObj.contentModule.getEditPanel().querySelectorAll('td');
            cells.forEach(cell => cell.classList.remove('e-cell-select-end'));
            tableModule.tableObj.setupSelectionState();
            expect(rteObj.formatter.editorManager.nodeSelection.Clear).not.toHaveBeenCalled();
            expect(rteObj.formatter.editorManager.nodeSelection.setSelectionText).not.toHaveBeenCalled();
            expect(rteObj.formatter.editorManager.nodeSelection.setCursorPoint).not.toHaveBeenCalled();
            cells[0].classList.add('e-cell-select-end');
            tableModule.tableObj.setupSelectionState();
            expect(rteObj.formatter.editorManager.nodeSelection.Clear).toHaveBeenCalledWith(
                rteObj.contentModule.getDocument()
            );
            expect(rteObj.formatter.editorManager.nodeSelection.setSelectionText).toHaveBeenCalledWith(
                rteObj.contentModule.getDocument(),
                cells[0],
                cells[0],
                0,
                0
            );
            expect(rteObj.formatter.editorManager.nodeSelection.setCursorPoint).toHaveBeenCalledWith(
                rteObj.contentModule.getDocument(),
                cells[0],
                0
            );
        });
    });
    describe('948232 - Table module isTableMultiSelectActive coverage', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test isTableMultiSelectActive with various activeCell states', () => {
            rteObj.focusIn();
            const tableModule = (rteObj as any).tableModule;
            const document = rteObj.contentModule.getDocument();
            const tbody = rteObj.contentModule.getEditPanel().querySelector('tbody');
            const range = document.createRange();
            range.selectNodeContents(tbody);
            spyOn(rteObj.formatter.editorManager.nodeSelection, 'getRange').and.returnValue(range);
            tableModule.tableObj.activeCell = null;
            expect(tableModule.tableObj.isTableMultiSelectActive()).toBe(false);
            tableModule.tableObj.activeCell = rteObj.contentModule.getEditPanel().querySelector('td');
            expect(tableModule.tableObj.isTableMultiSelectActive()).toBe(true);
            tableModule.tableObj.activeCell = undefined;
            expect(tableModule.tableObj.isTableMultiSelectActive()).toBe(false);
            const tr = rteObj.contentModule.getEditPanel().querySelector('tr');
            range.selectNodeContents(tr);
            tableModule.tableObj.activeCell = rteObj.contentModule.getEditPanel().querySelector('td');
            expect(tableModule.tableObj.isTableMultiSelectActive()).toBe(true);
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            range.selectNodeContents(td);
            expect(tableModule.tableObj.isTableMultiSelectActive()).toBe(false);
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 4).toBe(true);
            expect(tar.querySelectorAll('col')[0].style.width).toBe("50%");
            expect(tar.querySelectorAll('col')[1].style.width).toBe("50%");
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1] as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            expect(tar.querySelectorAll('col')[0].style.width).toBe("25%");
            expect(tar.querySelectorAll('col')[1].style.width).toBe("25%");
            expect(tar.querySelectorAll('col')[2].style.width).toBe("25%");
            expect(tar.querySelectorAll('col')[3].style.width).toBe("25%");
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
                tableSettings: { width: null, minWidth: null }
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            let target: HTMLElement = tar;
            target = tar;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                target = tar;
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            let target = tar;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                tar.innerText = "Hello Syncfusion";
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                target = tar;
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
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
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(false);
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
            let colWidth: string = (table as HTMLTableElement).querySelectorAll('col')[0].style.width;
            expect(colWidth.indexOf('%') !== -1).toBe(true);
            expect(position).toEqual(window.getSelection().anchorNode);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).tableObj.resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).tableObj.pageX).toBe(null);
        });
        it('resizing', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            width += 200;
            //expect(width).toEqual((table as HTMLTableElement).rows[0].cells[0].offsetWidth);
            let resRow1: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-row-resize') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            resRow1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.row = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: resRow1, pageX: 100, pageY: 100, preventDefault: function () { } });
            let height: any = (table as HTMLTableElement).rows[0].offsetHeight;
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.row = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: resRow1, pageX: 100, pageY: 200, preventDefault: function () { } });
            height += 100;
            expect(height).toEqual((table as HTMLTableElement).rows[0].offsetHeight);

            let tableBox: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            tableBox.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 100, preventDefault: function () { } });
            height = (table as HTMLTableElement).offsetHeight;
            width = (table as HTMLTableElement).offsetWidth;
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 200, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
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
            let colWidth: string = (table as HTMLTableElement).querySelectorAll('col')[0].style.width;
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end after first column', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).tableObj.resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).tableObj.pageX).toBe(null);
        });
        it('resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.style.marginLeft !== '').toBe(false);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            width += 200;
            expect(table.style.marginLeft !== '').toBe(true);
        });
    });

    describe('Bug 959900: Ta<tr> Element Gets Inline height Style When Resizing Table Column Widths in Blazor Rich Text Editor ', () => {
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            let reCol1: any = rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize')[0];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
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
            let colWidth: string = (table as HTMLTableElement).querySelectorAll('col')[0].style.width;
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end after first column', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).tableObj.resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).tableObj.pageX).toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelector('tr').style.height === '').toBe(true);
        });
        it('resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.style.marginLeft !== '').toBe(false);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
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
            const cols = (table as HTMLTableElement).querySelectorAll('col');
            let colWidth: string = cols[cols.length - 1].style.width;
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end after Last column', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).tableObj.resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).tableObj.pageX).toBe(null);
        });
        it('resizing first column', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.style.marginLeft !== '').toBe(false);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: -100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: -200, pageY: 200, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[1];
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, preventDefault: function () { }, stopImmediatePropagation: function () { } });
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, touches: [{ pageX: 300 }] });
            expect((rteObj.tableModule as any).tableObj.pageX).toBe(300);
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
                (InsertHtml as any).findClosestRelevantElement(table.querySelectorAll('td')[0], rteObj.contentModule.getEditPanel() as HTMLElement);
            });
        });
    });

    describe("table Inline Quick toolbar - showPopup method with popup open testing", () => {
        let editor: RichTextEditor;

        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('show inline toolbar', (done: Function) => {
            editor.focusIn();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('div');
            setCursorPoint(target.firstChild, 2);
            expect(editor.quickToolbarSettings.link.length).toBe(3);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-inline-popup')[0];
                expect(pop).not.toBe(undefined);
                (<HTMLElement>pop.querySelectorAll('.e-toolbar-item button')[1]).click();
                let events: any = document.createEvent("MouseEvents");
                events.initEvent("click", false, true);
                let target: HTMLElement;
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(editor.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                expect(editor.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                expect((editor.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                expect((editor.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                target = editor.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(events);
                let tar: HTMLElement = editor.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(tar.querySelectorAll('tr').length === 3).toBe(true);
                expect(tar.querySelectorAll('td').length === 9).toBe(true);
                let clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                (editor as any).inputElement.dispatchEvent(clickEvent);
                target = tar;
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            let target = tar;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                expect(tableTBItems.length === 10).toBe(true);
                expect(tablePop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
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
                    </td><td style="width: 50%;"><br></td></tr></tbody></table></div><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
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
                            { text: 'Code', value: 'Pre' },
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
                rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
                setCursorPoint(node, 0);
                node.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                    let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_TableRows");
                    insertBtn.click();
                    let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_TableRows-popup");
                    expect((dropdown.querySelectorAll(".e-item")[0] as HTMLElement).textContent == 'Insert row after').toBe(true);
                    done();
                }, 100);
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
                rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let tdNode: Element = rteObj.element.querySelector("td");
                setCursorPoint(tdNode, 0);
                keyboardEventArgs.keyCode = 9;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                keyboardEventArgs1.keyCode = 9;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs1 });
                setTimeout(() => {
                    expect(tdNode.querySelector('p')).toBeNull();
                    done();
                }, 100);
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
            let eventsArg: any = { target: target, which: 3, preventDefault: () => { return true; } };
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            let target: HTMLElement = node;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("td")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 100);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            let target: HTMLElement = node;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_TableCellVerticalAlign");
                insertBtn.click();
                expect(document.querySelector('#' + controlId + "_quick_TableCellVerticalAlign-popup").querySelector('li').classList.contains('e-disabled')).toBe(false);
                done();
            }, 100);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            let target: HTMLElement = node;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (<any>rteObj).selectAll();
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect((document.querySelectorAll('.e-rte-quick-popup') as any).length).toBe(0);
                done();
            }, 100);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            let target: HTMLElement = node;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                document.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                expect((document.querySelectorAll('.e-cell-select') as any).length).toBe(0);
                done();
            }, 100);
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                document.querySelectorAll("td")[2].classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2].firstElementChild as HTMLElement).click();
                setTimeout(() => {
                    (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                    rows = rteObj.element.querySelectorAll('tr');
                    expect(rows.length).toBe(2);
                    expect(rows[0].textContent === "ProceseigenaarDirectie").toBe(true);
                    done();
                }, 100);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target: HTMLElement = node;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("th")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 100);
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
            let target: HTMLElement = node as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
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
            let target: HTMLElement = node as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
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
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody> <tr> <td class="" style="width: 20%;"><ol><li><br></li></ol></td> <td style="width: 20%;"><ol><li><br></li></ol></td> <td style="width: 20%;"><ol><li><br></li></ol></td> <td style="width: 20%;"><ol><li><br></li></ol></td> <td style="width: 20%;"><ol><li><br></li></ol></td> </tr> </tbody> </table><ol><li style="font-weight: bold;"><b>Test1</b></li><li style="font-weight: bold;"><b>Test2</b></li></ol>`);
                done();
            }, 500);
        });
        it(' Apply UnOrderedList and check table availability ', (done: Function) => {
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            setTimeout(function () {
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody> <tr> <td class="" style="width: 20%;"><ul><li><br></li></ul></td> <td style="width: 20%;"><ul><li><br></li></ul></td> <td style="width: 20%;"><ul><li><br></li></ul></td> <td style="width: 20%;"><ul><li><br></li></ul></td> <td style="width: 20%;"><ul><li><br></li></ul></td> </tr> </tbody> </table><ul><li style="font-weight: bold;"><b>Test1</b></li><li style="font-weight: bold;"><b>Test2</b></li></ul>`);
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
                let table: HTMLTableElement = rteEle.querySelector("table");
                let header: HTMLElement = table.querySelector("thead");
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
                inlineMode: {
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
            (rteObj as any).tableModule.tableObj.removeHelper({ target: target });
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
            (rteObj as any).tableModule.tableObj.updateResizeIconPosition();
            expect(((rteObj as any).contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement).style.cssText !== cssText).toBe(true);
            args = {
                selectNode: [activeCell]
            };
            target = rteEle.querySelector('.e-rte-table th');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).tableModule.tableObj.updateResizeIconPosition();
            (rteObj as any).tableModule.createDialog({});
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') !== null).toBe(true);
            document.body.appendChild((rteObj as any).tableModule.quickToolObj.inlineQTBar.element);
            (rteObj as any).tableModule.onIframeMouseDown();
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') === null).toBe(true);
            (rteObj as any).tableModule.createDialog({});
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') !== null).toBe(true);
            (rteObj as any).tableModule.applyProperties(args, {});
            expect(document.querySelector('#' + rteObj.element.id + '_tabledialog') === null).toBe(true);
            (rteObj as any).tableModule.customTable(args, {});
            expect(getCorrespondingIndex(null, []).length === 0).toBe(true);
            (rteObj as any).formatter.editorManager.tableObj.cellMerge(null);
            expect((rteObj as any).formatter.editorManager.tableObj.curTable.querySelectorAll('.e-cell-select').length === 0).toBe(true);
            (rteObj as any).formatter.editorManager.tableObj.curTable = null;
            const element: HTMLElement = rteObj.contentModule.getEditPanel().parentElement;
            let range: Range = document.createRange();
            range.setStart(element, 0);
            (rteObj as any).formatter.editorManager.nodeSelection.save(range, document);
            (rteObj as any).formatter.editorManager.tableObj.removeTable({ item: { selection: rteObj.formatter.editorManager.nodeSelection } });
            expect(document.querySelectorAll('.e-rte-table').length === 2).toBe(true);
            (rteObj as any).focusIn();
            const tdElement: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table').querySelector('tr');
            tdElement.setAttribute('valign', 'top');
            (rteObj as any).formatter.editorManager.tableObj.tableVerticalAlign({ item: { tableCell: tdElement, subCommand: 'AlignTop' } });
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
            (rteObj as any).tableSettings.resize = true;
            document.body.removeChild((rteObj as any).tableModule.quickToolObj.inlineQTBar.element);
            (rteObj as any).tableModule.tableObj.resizeEnd(null);
            expect((rteObj as any).tableModule.tableObj.pageX === null).toBe(true);
            (rteObj as any).tableModule.tableObj.tableMouseLeave();
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
            rteObj.enableRtl = true;
            rteObj.locale = 'de';
            rteObj.dataBind();
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
                var cols = rteEle.querySelectorAll("col");
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(2);
                expect(parseFloat(cols[0].style.width)).toBeGreaterThan(33);
                expect(parseFloat(cols[1].style.width)).toBeGreaterThan(33);
                expect(parseFloat(cols[2].style.width)).toBeGreaterThan(33);
                expect(rows[0].children[0].getAttribute("colspan")).toBe("2");
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(table.rows[1].children.length).toBe(3);
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
                expect((rows[0].children[0] as HTMLElement).offsetWidth).toBeGreaterThanOrEqual(97);
                expect((rows[0].children[1] as HTMLElement).offsetWidth).toBeGreaterThanOrEqual(47);
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
    describe("963097 - Improper Selection of Nested Table in Rich Text Editor.", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;">Hello</td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table></td></tr></tbody></table><p>Editor</p>`
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
            rteEle.querySelectorAll('.e-rte-table')[1].querySelector('td').childNodes[0].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                expect(document.querySelectorAll('.e-cell-select').length === 6).toBe(true);
                (rteObj as any).tableModule.tableObj.tableMove({selectNode: [null]});
                done();
            }, 400);
        });
    });
    describe("960134 - Improve Selection of Content Including Both Table and Surrounding Text", function () {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(function () {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Table cell selection background color and resize helper restriction during the multiple cell selection', function (done) {
            var target = rteEle.querySelector('.e-rte-table td');
            var eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            var ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).tableModule.tableObj.tableMouseLeave();
            rteEle.querySelectorAll('p')[2].dispatchEvent(ev);
            setTimeout(function () {
                expect(document.querySelectorAll('.e-cell-select').length).toEqual(0);
                expect(rteObj.tableModule.tableObj.activeCell !== null).toBe(true);
                rteEle.querySelectorAll("td")[2].dispatchEvent(ev);
                expect(document.querySelectorAll('.e-cell-select').length > 0).toBe(true);
                (rteObj as any).tableModule.tableObj.tableMouseLeave();
                rteEle.querySelectorAll('p')[2].dispatchEvent(ev);
                setTimeout(function () {
                    var shiftKeyDown = new KeyboardEvent('keydown', SHIFT_ARROW_UP_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(shiftKeyDown);
                    var secondTD = rteObj.inputElement.querySelectorAll('td')[4];
                    var range = new Range();
                    range.setStart(secondTD, 0);
                    range.setEnd(target, 0);
                    rteObj.selectRange(range);
                    (rteObj as any).tableModule.keyDown({
                        args: {
                            preventDefault: function () { },
                            keyCode: 38,
                            shiftKey: true
                        }
                    });
                    setTimeout(function () {
                        var mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                        rteEle.querySelector('p').dispatchEvent(mouseUpEvent);
                        setTimeout(function () {
                            expect(rteObj.tableModule.tableObj.activeCell === null).toBe(true);
                            rteObj.tableModule.tableObj.calMaxCol(null);
                            rteObj.tableModule.tableObj.calcPos(null);
                            (rteObj as any).tableModule.tableObj.getCurrentColWidth(null, null);
                            done();
                        }, 400);
                    }, 400);
                }, 400);
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
                value: `<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p>Editor</p>`
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
                var cols = table.querySelectorAll('col');
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(4);
                expect(table.rows[1].children.length).toBe(3);
                expect(parseFloat(cols[0].style.width)).toBeGreaterThanOrEqual(16);
                expect(parseFloat(cols[1].style.width)).toBeGreaterThanOrEqual(16);
                expect((cols[2] as HTMLElement).style.width).toEqual("33.3333%");
                expect((cols[3] as HTMLElement).style.width).toEqual("33.3333%");
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
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 66.6666%;" colspan="2"><br></td><td style="width: 33.3333%;"><br></td><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Table cells are collapsed while apply the vertical split.', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('td');
            target.classList.add('e-cell-select');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                setTimeout(() => {
                    var tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                    (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                    (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                    var table = rteEle.querySelector("table");
                    var rows = table.rows;
                    expect(table.rows.length).toBe(2);
                    expect(table.rows[0].children.length).toBe(3);
                    expect(table.rows[1].children.length).toBe(3);
                    var cols = rteEle.querySelectorAll("col");
                    expect(parseFloat(cols[0].style.width)).toBeGreaterThan(30);
                    expect(parseFloat(cols[1].style.width)).toBeGreaterThan(30);
                    expect(parseFloat(cols[2].style.width)).toBeGreaterThan(30);
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
                }, 100);
            }, 100);
        });
    });

    describe("Delete Row with single row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Delete First Row', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('td');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 100);
        });
    });

    describe("Delete Column with single Column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 100%;" class="e-cell-select"><br></td></tr><tr><td style="width: 100%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Delete First Column', (done: Function) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('td');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                setTimeout(() => {
                    var table = rteEle.querySelector("table");
                    expect(table).toBe(null);
                    done();
                }, 100);
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
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete row", () => {
        let editor: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 50%;" class="" colspan="2" rowspan="2"><br></td><td style="width: 25%;" class="e-cell-select"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = editor.element;
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Delete First row with rowspan', (done: Function) => {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('td');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('td');
            setCursorPoint(target.firstChild, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            table = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1];
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 15).toBe(true);
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 6).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            table = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1];
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 15).toBe(true);
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                expect(rows[0].children.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                expect(rows[0].children.length).toBe(2);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.firstChild, tableCell.firstChild, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[3] as HTMLElement).click();
                (rows[0].querySelectorAll('td')[0] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('col');
                expect(rows[0].style.width).not.toBe("33.3333%");
                expect(rows[1].style.width).toBe("33.3333%");
                expect(rows[2].style.width).not.toBe("33.3333%");
                done();
            }, 400);
        });
    });

    describe('EJ2-49981 - ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({});
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table><tr><td><p>Provide the tool bar support, it's also customizable.</p></td></tr></table>`,
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableRemove', 'TableHeader', 'TableRows']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Remove the table at initial render with text node type', (done: DoneFn) => {
            let target = rteEle.querySelector('.e-rte-table td');
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let tableCell = document.querySelector('tr').querySelector('td');
            const domSelection: NodeSelection = new NodeSelection(rteObj.inputElement);
            domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.childNodes[0], tableCell.childNodes[0], 0, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                let tableHeaderCell = document.querySelector('tr').querySelector('th');
                tableHeaderCell.classList.add('e-cell-select');
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableHeaderCell, tableHeaderCell, 0, 0);
                tableHeaderCell.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                    (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                    domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell.childNodes[0], tableCell.childNodes[0], 0, 0);
                    tableCell.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                        expect(rteObj.contentModule.getEditPanel().innerHTML === '<p></br></p>');
                        done();
                    }, 100);
                }, 100);
            }, 100);
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
            let target: HTMLElement = node as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect((document.querySelectorAll('.e-rte-quick-popup') as any).length).toBe(1);
                done();
            }, 100);
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
                enterKey: 'DIV',
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
            let target: HTMLElement = node as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                (tablePop.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[6] as HTMLElement).click()
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
            let target: HTMLElement = node as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                (tablePop.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[6] as HTMLElement).click()
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
            var tbElement: any = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                expect((rteObj.contentModule.getEditPanel() as any).contentEditable == "true").toBe(true);
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
                value: `<ul><li class="e-rte-table" style="width: 100%; min-width: 0px;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 49.635%;"><col style="width: 50.365%;"></colgroup><tbody><tr style="height: 50%;"><td style="width: 1%;"><br></td><td style="width: 1%;"><br></td></tr><tr style="height: 50%;"><td style="width: 1%;"><br></td><td style="width: 1%;"><br></td></tr></tbody></table><p><br></p></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table></li></ul><p><br></p>`,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Nested table resize', () => {
            var table = rteObj.contentModule.getEditPanel().querySelector('table table');
            var clickEvent = document.createEvent("MouseEvents");
            (<any>rteObj).tableModule.tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            var reCol1 = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj).tableModule.tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (<any>rteObj).tableModule.tableObj.resizeStart(clickEvent);
            (<any>rteObj).tableModule.tableObj.resizing({ target: reCol1, pageX: -10, pageY: -10, preventDefault: function () { } });
            (<any>rteObj).tableModule.tableObj.curTable.style.marginLeft = "145px";
            (<any>rteObj).tableModule.tableObj.resizing({ target: reCol1, pageX: -100, pageY: -100, preventDefault: function () { } });
            expect(closest(table, 'table').nodeName == "TABLE").toBe(true);
            (<any>rteObj).enableRtl = true;
            (<any>rteObj).tableModule.tableObj.resizing({ target: reCol1, pageX: -10, pageY: -10, preventDefault: function () { } });
            (<any>rteObj).enableRtl = false;
        });
    });

    describe('TableCommand uncovered branches', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test handleCollapsedRangeBlockNodes with null blockNode', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const range = document.createRange();
            const textNode = document.createTextNode('Test');
            range.setStart(textNode, 0);
            range.setEnd(textNode, 0);
            spyOn(tableObj, 'getImmediateBlockNode').and.returnValues(null, rteObj.contentModule.getEditPanel().querySelector('td'));
            const blockTags = ['DIV', 'P', 'TD', 'TH'];
            const blockNodes = new Set();
            tableObj.handleCollapsedRangeBlockNodes(range, blockTags, blockNodes);
            expect(tableObj.getImmediateBlockNode).toHaveBeenCalled();
            expect(tableObj.getImmediateBlockNode.calls.count()).toBe(1);
        });
    });

    describe('TableCommand handleExpandedRangeBlockNodes branch coverage', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test handleExpandedRangeBlockNodes with null blockNode branch', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const range = document.createRange();
            const firstCell = rteObj.contentModule.getEditPanel().querySelector('td');
            const lastCell = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
            range.setStart(firstCell, 0);
            range.setEnd(lastCell, 0);
            spyOn(tableObj, 'getImmediateBlockNode').and.callFake((node: Node, tags: string[]) => {
                if (tableObj.getImmediateBlockNode.calls.count() === 1) {
                    return null;
                }
                return rteObj.contentModule.getEditPanel().querySelector('td');
            });
            const blockTags = ['DIV', 'P', 'TD', 'TH'];
            const blockNodes = new Set();
            tableObj.handleExpandedRangeBlockNodes(range, blockTags, blockNodes);
            expect(tableObj.getImmediateBlockNode).toHaveBeenCalled();
        });
    });

    describe('TableCommand uncovered branches - navigation and node checks', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should test getImmediateBlockNode with non-matching tags returning null', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const textNode = document.createTextNode('Test text');
            rteObj.contentModule.getEditPanel().appendChild(textNode);
            const blockTags = ['NONEXISTENT-TAG'];
            const result = tableObj.getImmediateBlockNode(textNode, blockTags);
            expect(result).toBeNull();
        });
        it('should test handleForwardTabNavigation with element === nextElement branch', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const cell = rteObj.contentModule.getEditPanel().querySelector('td');
            spyOn(tableObj, 'findNextElementForward').and.returnValue(cell);
            const mockEvent = {
                keyCode: 39
            };
            const mockSelection = {
                selectNode: jasmine.createSpy('selectNode')
            };
            tableObj.handleForwardTabNavigation(cell, mockSelection, mockEvent);
            expect(tableObj.findNextElementForward).toHaveBeenCalled();
        });
        it('should test handleForwardTabNavigation with nextElement null branch', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLTableCellElement;
            spyOn(Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName')!, 'get').and.returnValue('TD');
            const differentElement = document.createElement('td');
            spyOn(tableObj, 'findNextElementForward').and.returnValue(differentElement);
            spyOn(tableObj, 'setSelectionForElement');
            const mockEvent: any = {
                keyCode: 39
            };
            const mockSelection: any = {};
            tableObj.handleForwardTabNavigation(cell, mockSelection, mockEvent);
            expect(tableObj.findNextElementForward).toHaveBeenCalled();
            expect(tableObj.setSelectionForElement).toHaveBeenCalledWith(differentElement, mockSelection);
        });
    });

    describe('TableCommand insertAfter method branches', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should handle referenceNode without parentNode', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const newNode = document.createElement('div');
            const referenceNode = document.createElement('div');
            const result = tableObj.insertAfter(newNode, referenceNode);
            expect(result).toBeUndefined();
            expect(newNode.parentNode).toBeNull();
        });
        it('should handle cell without parentElement in createReplacementCellIfNeeded', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const mockCell = jasmine.createSpyObj('cell', ['cloneNode']);
            mockCell.cloneNode.and.returnValue({ innerHTML: '' });
            mockCell.parentElement = null;
            spyOn(tableObj, 'getMergedRow').and.returnValue([mockCell]);
            tableObj.curTable = document.querySelector('table');
            tableObj.createReplacementCellIfNeeded(0);
            expect(tableObj.getMergedRow).toHaveBeenCalled();
        });
        it('should handle missing nextFocusCell in updateSelectionAfterColumnDelete', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const tbodyHeadEle = document.createElement('tbody');
            const rowHeadEle = document.createElement('tr');
            tbodyHeadEle.appendChild(rowHeadEle);
            tableObj.updateSelectionAfterColumnDelete({}, tbodyHeadEle, 0, 0);
        });
        it('should handle cells without oldWidth dataset in redistributeCellWidths', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const cells = [
                document.createElement('td'),
                document.createElement('td')
            ];
            tableObj.redistributeCellWidths(cells, 100, 200);
            expect(cells[0].style.width).toBe('');
            expect(cells[1].style.width).toBe('');
        });
        it('should handle the conditional return branch in getReferenceRowIndex', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const allCells = new Array(5);
            const result = tableObj.getReferenceRowIndex(allCells, 2, true, true);
            expect(result).toBe(3);
            const result2 = tableObj.getReferenceRowIndex(allCells, 5, true, true);
            expect(result2).toBe(5);
        });
        it('should handle cells without rowspan attribute in incrementRowspan', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const cell = document.createElement('td');
            tableObj.incrementRowspan(cell);
            expect(cell.getAttribute('rowspan')).toBe('2');
        });
        it('should return null when no cells are selected in getSelectedMinMaxIndexes', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            tableObj.curTable = rteObj.element.querySelector('table');
            const result = tableObj.getSelectedMinMaxIndexes([]);
            expect(result).toBeNull();
        });
        it('should return empty string for default case in getVerticalAlignmentValue', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const result = tableObj.getVerticalAlignmentValue('InvalidCommand');
            expect(result).toBe('');
        });
        it('should test the else branches in updateRowspanAttributes', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const activeCell = jasmine.createSpyObj('activeCell', ['setAttribute', 'removeAttribute']);
            const newCell = jasmine.createSpyObj('newCell', ['setAttribute', 'removeAttribute']);
            tableObj.updateRowspanAttributes(activeCell, newCell, 1, 2);
            expect(activeCell.removeAttribute).toHaveBeenCalledWith('rowspan');
            activeCell.removeAttribute.calls.reset();
            newCell.removeAttribute.calls.reset();
            tableObj.updateRowspanAttributes(activeCell, newCell, 2, 1);
            expect(newCell.removeAttribute).toHaveBeenCalledWith('rowspan');
        });
        it('should test the break case in findInsertionColumnIndex', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const correspondingCells = [[{}, {}]];
            const rowIndex = 0;
            correspondingCells[rowIndex][0] = null; // Ensure first cell is initialized
            const result = tableObj.findInsertionColumnIndex(correspondingCells, rowIndex, -1);
            expect(result).toBeLessThan(0);
        });
        it('should test all branches in insertNewCellInRow', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const correspondingCells = [[{}]];
            const rowIndex = 0;
            const newCell = document.createElement('td');
            tableObj.curTable = jasmine.createSpyObj('curTable', ['appendChild']);
            const emptyRow = document.createElement('tr');
            tableObj.curTable.rows = [emptyRow];
            tableObj.insertNewCellIntoRow(correspondingCells, rowIndex, -1, newCell);
            expect(tableObj.curTable.appendChild).toHaveBeenCalledWith(newCell);
            tableObj.curTable.appendChild.calls.reset();
            const mockCell = jasmine.createSpyObj('cell', ['insertAdjacentElement']);
            correspondingCells[rowIndex][0] = mockCell;
            tableObj.insertNewCellIntoRow(correspondingCells, rowIndex, 0, newCell);
            expect(mockCell.insertAdjacentElement).toHaveBeenCalledWith('afterend', newCell);
        });
        it('should test both else branches in updateColspanAttributes', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const activeCell = jasmine.createSpyObj('activeCell', ['setAttribute', 'removeAttribute']);
            const newCell = jasmine.createSpyObj('newCell', ['setAttribute', 'removeAttribute']);
            tableObj.updateColspanAttributes(activeCell, newCell, 1, 2);
            expect(activeCell.removeAttribute).toHaveBeenCalledWith('colspan');
            activeCell.removeAttribute.calls.reset();
            newCell.removeAttribute.calls.reset();
            tableObj.updateColspanAttributes(activeCell, newCell, 2, 1);
            expect(newCell.removeAttribute).toHaveBeenCalledWith('colspan');
        });
        it('should return false when activeCell or target is falsy in isValidCellTarget', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            tableObj.activeCell = null;
            const result = tableObj.isValidCellTarget(document.createElement('td'));
            expect(result).toBe(false);
            const result2 = tableObj.isValidCellTarget(null);
            expect(result2).toBe(false);
        });
        it('should return 0 when offsetValue is 0 in convertPixelToPercentage', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const result = convertPixelToPercentage(100, 0);
            expect(result).toBe(0);
            const result2 = convertPixelToPercentage(50, 200);
            expect(result2).toBe(25); // (50/200)*100 = 25
            tableObj.updateResizeIconPosition();
            const value = tableObj.tableCellSelect(null);
            expect(value).toBeUndefined();
            const value1 = tableObj.tableCellSelect({ target: null });
            expect(value1).toBeUndefined();
        });
    });

    describe('TableCommand - element === nextElement branch', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should cover the element === nextElement branch', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const lastCell = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1] as HTMLTableCellElement;
            spyOn(tableObj, 'findNextElementForward').and.returnValue(lastCell);
            const closestSpy = spyOn(ej2Base, 'closest').and.callFake((element: Element, selector: string) => {
                if (selector === 'table') {
                    return rteObj.contentModule.getEditPanel().querySelector('table');
                }
                return null;
            });
            const mockEvent: any = {
                keyCode: 39
            };
            const mockSelection: any = {
                selectNode: jasmine.createSpy('selectNode')
            };
            tableObj.handleForwardTabNavigation(lastCell, mockSelection, mockEvent);
            expect(closestSpy).toHaveBeenCalledWith(lastCell, 'table');
        });
    });

    describe('TableCommand - backward navigation and previous element branches', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: '<table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></tbody></table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should cover the element === prevElement branch in handleBackwardTabNavigation', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const firstCell = rteObj.contentModule.getEditPanel().querySelector('td');
            spyOn(tableObj, 'findPreviousElementBackward').and.returnValue(firstCell);
            const closestSpy = spyOn(ej2Base, 'closest').and.callFake((element: Element, selector: string) => {
                if (selector === 'table') {
                    return rteObj.contentModule.getEditPanel().querySelector('table');
                }
                return null;
            });
            const mockEvent = {
                keyCode: 37
            };
            const mockSelection = {
                selectNode: jasmine.createSpy('selectNode')
            };
            tableObj.handleBackwardTabNavigation(firstCell, mockSelection, mockEvent);
            expect(closestSpy).toHaveBeenCalledWith(firstCell, 'table');
        });

        it('should cover the !ej2_base_1.isNullOrUndefined(prevRow) branch in findPreviousElementBackward', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const targetCell = rteObj.contentModule.getEditPanel().querySelectorAll('tr')[1].querySelector('td');
            const isNullOrUndefinedSpy = spyOn(ej2Base, 'isNullOrUndefined').and.callFake((value: any) => {
                if (value && value.tagName === 'TR') {
                    return false;
                }
                return true;
            });
            const closestSpy = spyOn(ej2Base, 'closest').and.callFake((element: Element, selector: string) => {
                if (selector === 'tr') {
                    return rteObj.contentModule.getEditPanel().querySelector('tr');
                }
                if (selector === 'table') {
                    return rteObj.contentModule.getEditPanel().querySelector('table');
                }
                return null;
            });
            const result = tableObj.findPreviousElementBackward(targetCell);
            expect(result).toBeDefined();
        });

        it('should cover the prevSibling nodeName === td branch in findPreviousElementBackward', () => {
            rteObj.focusIn();
            const tableObj = (rteObj.formatter.editorManager as any).tableObj;
            const secondCell = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
            const isNullOrUndefinedSpy = spyOn(ej2Base, 'isNullOrUndefined').and.callFake((value: any) => {
                if (value && value.tagName === 'TR') {
                    return true;
                }
                if (value && value.tagName === 'TD') {
                    return false;
                }
                return true;
            });
            const closestSpy = spyOn(ej2Base, 'closest').and.callFake((element: Element, selector: string) => {
                if (selector === 'tr') {
                    return null;
                }
                if (selector === 'table') {
                    return rteObj.contentModule.getEditPanel().querySelector('table');
                }
                return null;
            });
            const mockPrevSibling = rteObj.contentModule.getEditPanel().querySelector('td');
            Object.defineProperty(secondCell, 'previousSibling', {
                get: () => mockPrevSibling,
                configurable: true
            });
            const result = tableObj.findPreviousElementBackward(secondCell);
            expect(result).toBe(mockPrevSibling);
        });
    });

    describe('836937 - The read-only setting is true in the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                readonly: true,
                value: `<table>
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
            (rteObj.tableModule as any).tableObj.resizeStart({ target: tdElement[0], pageX: 100, pageY: 0, preventDefault: function () { } });
            expect(rteObj.readonly).toBe(true);
        });
    });

    describe("When you press backspace while the focus is on the tbody, the table will be deleted from the Rich Text Editor", function () {
        var rteObj: RichTextEditor;
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
        let rteObj: RichTextEditor;
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
            }, 100);
        });
    });

    describe('Nested list inside the table using the TAB key in the Rich Text Editor', function () {
        let rteObj: RichTextEditor;
        beforeEach(function () {
            rteObj = renderRTE({
                saveInterval: 0,
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><ul><li class="liElement"><p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p></li><li><p>Capable of handling markdown editing.</p></li><li><p>Contains a modular library to load the necessary functionality on demand.</p></li><li><p>Provides a fully customizable toolbar.</p></li></ul></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`,
            });
        });
        afterEach(function () {
            destroy(rteObj);
        });
        it('Nested list with block node inside the table using the TAB key', function (done) {
            rteObj.focusIn();
            var tdElement = rteObj.contentModule.getDocument().getElementsByClassName("liElement");
            let selectioncursor = new NodeSelection();
            let range = document.createRange();
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
            let range = document.createRange();
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
            let range = document.createRange();
            range.setStart(tdElement[0], 0);
            selectioncursor.setRange(document, range);
            var position = window.getSelection().anchorNode;
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'ArrowRight', keyCode: 39, stopPropagation: function () { }, shiftKey: false, which: 39 };
            (rteObj as any).keyDown(keyBoardEvent);
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(function () {
                expect(window.getSelection().anchorNode == position).toBe(true);
                done();
            }, 100)
        });
    });

    describe('Checking the table insert without the br tag', function () {
        let rteObj: RichTextEditor;
        var rteEle: any;
        beforeAll(function () {
            rteObj = renderRTE({
                value: "<p><br/></p><p class='liElement'><br/></p>",
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
            (rteObj as any).tableModule.tableObj.tableCellSelect(event);
            (rteObj as any).tableModule.tableObj.tableCellLeave(event);
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
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector(".e-rte-edit-table") == null).toBe(true);
                done();
            }, 100);
        });
    });

    describe('The cursor focuses on the previous element when you press the shift and tab.', function () {
        let rteObj: RichTextEditor;
        var rteEle: any;
        var keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(function () {
            rteObj = renderRTE({
                value: `<p>Rich Text Editor</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;"><br></td><td class="liElement" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>`,
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
            expect(previousPosition != window.getSelection().anchorNode).toBe(true);
            done();
        });
    });

    describe('876566 - The cursor focuses on the previous or next element when you press back space or delete.', function () {
        let rteObj: RichTextEditor;
        var rteEle: any;
        var keyboardEventArgs = {
            preventDefault: function () { },
            code: "Delete",
            which: 46
        };
        beforeAll(function () {
            rteObj = renderRTE({
                value: `<p class="start">Rich Text Editor</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="liElement" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p class="end">Rich Text Editor</p>`,
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
                cssClass: "rich_Text_Editor",
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
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('When you click the outside table dialog, the dialog will be hidden', (done) => {
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as HTMLElement).click();
                setTimeout(() => {
                    var clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('mousedown', true, true);
                    rteObj.inputElement.querySelector("p").dispatchEvent(clickEvent);
                    expect(document.querySelector(".e-rte-edit-table") == null).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('A custom class added the button element for the table dialog', function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                cssClass: "rich_Text_Editor",
            });
        });
        afterAll(function () {
            destroy(rteObj);
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
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('When you open the table dialog, you need to close the existing one', function (done) {
            (rteObj as any).element.querySelector('.e-toolbar-item button').click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                (rteObj as any).tableModule.insertTableDialog({ target: document.querySelector(".e-rte-edit-table"), pageX: 100, pageY: 0, preventDefault: function () { } });
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
                    items: ['CreateTable', 'BackgroundColor']
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
            var tdElement: any = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            let target: HTMLElement = rteObj.inputElement.querySelector('.e-rte-table td');
            let activeCell: HTMLElement = rteObj.inputElement.querySelectorAll("td")[1];
            let args: any = {
                event: { target: target },
                selectNode: [activeCell] as any,
            };
            (rteObj as any).formatter.editorManager.tableObj.tableMove(args);
            (rteObj as any).formatter.editorManager.tableObj.setBGColor({
                "item": {
                    "command": "Font",
                    "subCommand": "BackgroundColor"
                },
                "value": "rgb(255, 255, 0)",
                "name": "tableColorPickerChanged"
            });
            let backgroundColorPicker: HTMLElement = <HTMLElement>rteObj.element.querySelector(".e-rte-background-colorpicker");
            backgroundColorPicker.click();
            (backgroundColorPicker.querySelector(".e-rte-background-colorpicker .e-split-colorpicker .e-selected-color") as HTMLElement).click();
            expect(tdElement.style.backgroundColor != '').toBe(true);
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
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1, touches: { length: 0 }, changedTouches: [{ pageX: 0, pageY: 0, clientX: 0 }] };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            expect(!isNullOrUndefined(document.querySelector(".e-rte-quick-toolbar"))).toBe(true);
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
            (rteObj as any).tableModule.tableObj.resizeHelper({ target: tableElement, preventDefault: function () { } });
            var resizeCol = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (rteObj as any).tableModule.tableObj.resizeStart({ target: resizeCol, pageX: 100, pageY: 0, preventDefault: function () { } });
            (rteObj as any).tableModule.tableObj.appendHelper();
            (rteObj as any).mouseDownHandler(eventsArg);
            expect(document.querySelectorAll(".e-table-rhelper.e-column-helper").length < 2).toBe(true);
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
                value: `<table class="e-rte-table e-rte-table-border" style="width: 100%; min-width: 0px;" cellspacing="2"><tbody><tr><td class="" style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td></tr><tr><td style="width: 25%; padding: 2px;" class="e-cell-select"><p id="tdElement">Rich Text Editor</p></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td></tr><tr><td style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;" class=""><br></td><td style="width: 25%; padding: 2px;"><br></td><td style="width: 25%; padding: 2px;"><br></td></tr></tbody></table>`,
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
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties', 'TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
                },
                beforeDialogClose: function (e) {
                    e.cancel = false;
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 33.3333%;"><table class="e-rte-table e-rte-table-border" style="width: 392px; min-width: 0px;" cellspacing="0"><tbody><tr style="height: 115px;"><td class="" style="width: 35.4592%; padding: 0px;"><br></td><td style="width: 28.0612%; padding: 0px;" class=""><br></td><td style="width: 36.2245%; padding: 0px;" class=""><br></td></tr><tr><td style="width: 35.4592%; padding: 0px;"><br></td><td style="width: 28.0612%; padding: 0px;"><br></td><td style="width: 36.2245%; padding: 0px;"><br></td></tr></tbody></table><p><br></p></td><td style="width: 34.4316%;" class=""><br></td><td style="width: 32.1252%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 34.4316%;" class=""><br></td><td style="width: 32.1252%;"><br></td></tr></tbody></table>`
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
                enterKey: 'DIV',
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
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button") as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table") as any).click();
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
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button") as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table") as any).click();
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
            (document.querySelector(".e-rte-toolbar .e-toolbar-items .e-toolbar-item button") as any).click();
            (document.querySelector(".e-rte-table-popup button.e-insert-table-btn") as any).click();
            setTimeout(function () {
                (document.querySelector(".e-rte-edit-table .e-footer-content .e-rte-elements.e-insert-table") as any).click();
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
                enterKey: "DIV",
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
            let range = document.createRange();
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

    describe("959882 - Table multiple cell selection gets cleared on clicking the paste cleanup prompt in RTE", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                pasteCleanupSettings: {
                    prompt: true
                },
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it("Press the enter key BR with the empty value in the Rich Text Editor.", function (done) {
            rteObj.focusIn();
            rteObj.value = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody></tbody></table>`;
            rteObj.dataBind();
            let keyBoardEvent: any = {
                preventDefault: () => { },
                type: 'keydown',
                stopPropagation: () => { },
                ctrlKey: false,
                shiftKey: false,
                action: null,
                which: 64,
                key: ''
            };
            keyBoardEvent.clipboardData = {
                getData: () => {
                    return "Hello Testing";
                },
                items: []
            };
            (rteObj as any).inputElement.focus();
            const selectedCells = (rteObj as any).inputElement.querySelectorAll('td');
            selectedCells[0].classList.add('e-cell-select');
            selectedCells[1].classList.add('e-cell-select');
            rteObj.onPaste(keyBoardEvent);
            setTimeout(() => {
                if (rteObj.pasteCleanupSettings.prompt) {
                    let keepFormat: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_KEEP_FORMAT);
                    keepFormat[0].click();
                    dispatchEvent(document.getElementById(rteObj.getID() + '_pasteCleanupDialog'), 'mousedown');
                    let pasteOK: any = document.getElementById(rteObj.getID() + '_pasteCleanupDialog').getElementsByClassName(CLS_RTE_PASTE_OK);
                    pasteOK[0].click();
                }
                const selectedCells = document.querySelectorAll('.e-cell-select');
                expect(selectedCells.length > 0).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Press the enter key BR with the empty value in the Rich Text Editor.", function () {
        var rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                enterKey: "BR",
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
            let range = document.createRange();
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol: any = rteObj.contentModule.getPanel().querySelectorAll('.e-column-resize')[3];
            clickEvent1.initEvent("mousedown", false, true);
            reCol.dispatchEvent(clickEvent1);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent1);
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[3];
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            (rteObj.tableModule as any).tableObj.resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.column = true;
            let width: any = table.querySelectorAll("tr")[0].querySelectorAll("td")[2].offsetWidth;
            (rteObj.tableModule as any).tableObj.resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            expect(width).not.toEqual((table as HTMLTableElement).querySelectorAll("tr")[0].querySelectorAll("td")[2].offsetWidth);
        });
    });

    describe('850000 - In iframe mode table popup doesnot close properly', () => {
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
                inlineMode: {
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
        it('Should not add an additional list item when inserting a table at the end of the list item.', (done: DoneFn) => {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelector('li').childNodes[0], editor.inputElement.querySelector('li').childNodes[0].textContent.length);
            range.collapse(true);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            const tableBtn = editor.element.querySelectorAll('.e-toolbar-item button')[0];
            (tableBtn as HTMLElement).click();
            (document.querySelector('.e-insert-table-btn') as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('li').length).toBe(5);
            (document.querySelector('.e-insert-table') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.inputElement.querySelector('li').childNodes[1].nodeName.toLowerCase()).toBe('table');
                expect(editor.inputElement.querySelectorAll('li').length).toBe(5);
                done();
            }, 200);
        });
    });

    describe('941514: Table is not inserted in correct position inside the list', function () {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                value: `<p><b>Toolbar</b></p><ol><li><p>List 1</p></li><li><p>List 2</p></li><li><p>List 3</p></li><li><p>List 4</p></li></ol>`,
                toolbarSettings: {
                    items: ['CreateTable']
                }
            });
            rteEle = rteObj.element;
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('should insert a table between list items', (done: Function) => {
            rteObj.focusIn();
            let firstListItem = rteEle.querySelector('li:nth-child(1)');
            setCursorPoint(firstListItem.childNodes[0] as Element, 2);
            let createTableButton = rteEle.querySelector('.e-toolbar-item button') as HTMLElement;
            createTableButton.click();
            let insertButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertButton.click();
            let insertDialogBtn = document.querySelector('.e-insert-table') as HTMLElement;
            insertDialogBtn.click();
            firstListItem = rteEle.querySelector('li:nth-child(1)');
            expect(firstListItem.parentNode.querySelector('table')).not.toBeNull();
            done();
        });
        it('should insert a table partially selecting second and third list items', (done: Function) => {
            rteObj.focusIn();
            let secondListItem = rteEle.querySelector('li:nth-child(2)');
            let thirdListItem = rteEle.querySelector('li:nth-child(3)');
            let range = document.createRange();
            range.setStart(secondListItem.childNodes[0], 1);
            range.setEnd(thirdListItem.childNodes[0], 3);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            let createTableButton = rteEle.querySelector('.e-toolbar-item button') as HTMLElement;
            createTableButton.click();
            let insertButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertButton.click();
            let insertdialogbtn = document.querySelector('.e-insert-table') as HTMLElement;
            insertdialogbtn.click();
            expect(rteEle.querySelectorAll('li').length).toBe(3);
            expect(rteEle.querySelectorAll('li')[1].querySelector('table')).not.toBeNull();
            done();
        });
        it('should insert a table selecting "4" inside the fourth item', (done: Function) => {
            rteObj.focusIn();
            let fourthListItem = rteEle.querySelector('li:nth-child(4)').childNodes[0];
            let range = document.createRange();
            range.selectNode(fourthListItem);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            let createTableButton = rteEle.querySelector('.e-toolbar-item button') as HTMLElement;
            createTableButton.click();
            let insertButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertButton.click();
            let insertdialogbtn = document.querySelector('.e-insert-table') as HTMLElement;
            insertdialogbtn.click();
            expect(rteEle.querySelectorAll('li')[3].querySelector('table')).not.toBeNull();
            done();
        });
    });

    describe('945968: Table Insertion within Nested List Items', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<ul class ="parentUL"><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.<ul><li>First nested LI</li><li>second nested LI</li></ul></li>
                    <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.<ul><li>Third nested LI</li><li>Fourth nested LI</li></ul></li>
                    <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li>
                    <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li>
                    <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li>
                </ul>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should insert table between the selected content', (done: Function) => {
            rteObj.focusIn();
            const nodeSelection = new NodeSelection();
            const secondNestedLI = rteEle.querySelector('ul > li > ul > li:nth-child(2)');
            const thirdNestedLI = rteEle.querySelector('ul > li:nth-child(3) > ul > li:nth-child(2)');
            nodeSelection.setSelectionText(document, secondNestedLI.firstChild, thirdNestedLI.firstChild, 7, 16);
            const createTableButton = rteEle.querySelector('.e-toolbar-item button') as HTMLElement;
            createTableButton.click();
            const insertTableButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertTableButton.click();
            const insertButton = document.querySelector('.e-insert-table') as HTMLElement;
            insertButton.click();
            setTimeout(() => {
                const numberOfLi: number = document.querySelector('.parentUL').querySelectorAll('li').length;
                expect(numberOfLi).toBe(7);
                done();
            }, 100);
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
        let rteObj: RichTextEditor;
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
            }, 0);
        });
    });

    describe('876830 - The table header was moved while press enter key in RTE', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEvent: any = {
            preventDefault: function () { },
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
            var tdElement: any = rteObj.inputElement.querySelector("table td");
            var selectioncursor = new NodeSelection();
            var range = document.createRange();
            range.setStart(tdElement, 0);
            selectioncursor.setRange(document, range);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector("table td")
            var eventsArg = { pageX: 50, pageY: 300, target: tbElement, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            let target: HTMLElement = rteObj.inputElement.querySelector('.e-rte-table td');
            let activeCell: HTMLElement = rteObj.inputElement.querySelectorAll("td")[1];
            let args: any = {
                event: { target: target },
                selectNode: [activeCell] as any,
            };
            (rteObj as any).formatter.editorManager.tableObj.tableMove(args);
            (rteObj as any).formatter.editorManager.tableObj.setBGColor({
                "item": {
                    "command": "Font",
                    "subCommand": "BackgroundColor"
                },
                "value": "rgb(255, 255, 0)",
                "name": "tableColorPickerChanged"
            });
            rteObj.notify('hideTableQuickToolbar', {});
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

    describe('936814: Tab Key Press Functionality in Table', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;">testing-1</td><td style="width: 50%;" class="">testing-2</td></tr><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;" class=""><br></td></tr></tbody></table><p><br></p>`,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should move cursor from the first to the second cell on pressing Tab key', (done: DoneFn) => {
            rteObj.focusIn();
            const firstCell = rteEle.querySelector('td.e-cell-select');
            setCursorPoint(firstCell as Element, 0);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', TAB_KEY_EVENT_INIT));
            setTimeout(() => {
                const firstRowCells = rteEle.querySelectorAll('.e-rte-table tbody tr:first-child td');
                expect(firstRowCells[0].classList.contains('e-cell-select')).toBe(false);
                expect(firstRowCells[1].classList.contains('e-cell-select')).toBe(true);
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
                expect((editor.tableModule as any).tableObj.getSelectedTableEle([])).toBeNull();
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
            let target: HTMLElement = tableCell as HTMLElement;
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
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
                expect(height + 2).toEqual((rteObj as any).inputElement.querySelector('table td').offsetHeight);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
            setCursorPoint(node, 0);
            const rightClickMouseUp: MouseEvent = new MouseEvent('mouseup', BASIC_CONTEXT_MENU_EVENT_INIT)
            node.dispatchEvent(rightClickMouseUp);
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
            (rteObj.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            let height: any = (table as HTMLTableElement).offsetHeight;
            let tableBox: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            tableBox.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).tableObj.resizeStart(clickEvent);
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 100, preventDefault: function () { } });
            height = (table as HTMLTableElement).offsetHeight;
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 200, preventDefault: function () { } });
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 400, preventDefault: function () { } });
            (<any>rteObj.tableModule).tableObj.resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).tableObj.resizing({ target: tableBox, pageX: 100, pageY: 600, preventDefault: function () { } });
            height += 500;
            expect(height).toEqual((table as HTMLTableElement).offsetHeight);
        });
    });
    describe('916978: After resizing the image with a percentage in the toolbar, the image does not display according to the adjusted height and weight inside the table', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr style="height: 33.7662%;"><td class="e-cell-select" style="width: 33.3333%;"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" class="e-rte-image e-imginline" alt="RTE-Overview" width="342" height="193" style="min-width: 0px; max-width: 342px; min-height: 0px; width: 30%; height: 50%;"> </td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 33.7662%;"><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr style="height: 33.7662%;"><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('select the table to check the image when height is setted to percentage', (done: DoneFn) => {
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
    describe('937247: Keyboard shortcut for creating tables in the Markdown editor is not functioning', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                editorMode: 'Markdown'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should insert a table using Ctrl+Shift+E shortcut', (done: DoneFn) => {
            rteObj.focusIn();
            const keyEvent = new KeyboardEvent("keydown", {
                key: "E",
                code: "KeyE",
                which: 69,
                keyCode: 69,
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            } as KeyboardEventInit);
            rteObj.inputElement.dispatchEvent(keyEvent);
            setTimeout(() => {
                const panel = rteObj.contentModule.getEditPanel() as HTMLInputElement;
                const markdownValue = panel.value;
                expect(markdownValue).toBe('|Heading 1|Heading 2|\n|---------|---------|\n|Col A1|Col A2|\n|Col B1|Col B2|\n\n');
                done();
            }, 100);
        });
    });
    describe('935060 - Cursor Does Not Navigate to the Previous Line in a Table Cell When Pressing the Left Arrow Key.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
            }
            );
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Place the cursor at the end of the <td> element and press the left arrow key.', (done) => {
            editor.focusIn();
            var tbElement = editor.contentModule.getEditPanel().querySelector(".tdElement")
            setCursorPoint(tbElement, 0);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'ArrowLeft', keyCode: 37, stopPropagation: function () { }, shiftKey: false, which: 37 };
            (editor as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(tbElement.parentElement.contains(window.getSelection().getRangeAt(0).startContainer)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('936577 - Cursor Moves to Last Cell Instead of Staying in First Cell When Pressing Shift + Tab in Table 1st cell', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            }
            );
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should keep the cursor in the first cell of the table header when Shift+Tab is pressed', (done) => {
            editor.focusIn();
            var tbElement = editor.contentModule.getEditPanel().querySelectorAll("table th")[0];
            setCursorPoint(tbElement, 0);
            var keyBoardEvent = { type: 'keydown', preventDefault: function () { }, key: 'Tab', keyCode: 9, stopPropagation: function () { }, shiftKey: true, which: 9 };
            (editor as any).keyDown(keyBoardEvent);
            expect(tbElement === window.getSelection().getRangeAt(0).startContainer).toBe(true);
            editor.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p></td><td style="width: 50%;" class="tdElement"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`;
            tbElement = editor.contentModule.getEditPanel().querySelector(".tdElement");
            setCursorPoint(tbElement, 0);
            (editor as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer === editor.contentModule.getEditPanel().querySelectorAll("table tr td table td")[0]).toBe(true);
                done();
            }, 100);
        });
    });

    describe('923379 - IFrame: Alternate Row Styles Fail to Apply in Table Cell Using Table Quick Toolbar', function () {
        let rteObj: RichTextEditor;
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
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            var tbElement = rteObj.contentModule.getEditPanel().querySelector(".tdElement")
            setCursorPoint(tbElement, 0);
            tbElement.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                (document.querySelector(".e-dropdown-popup .e-item.e-alternate-rows") as any).click();
                detach(div);
                setCursorPoint(tbElement, 0);
                tbElement.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    div = document.querySelector('#' + controlId + '_quick_TableRows-popup');
                    (document.querySelectorAll(".e-rte-quick-toolbar .e-toolbar-items .e-toolbar-item")[8].querySelector(".e-btn-icon.e-caret") as any).click();
                    let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                    let secondRow: HTMLElement = tar.querySelectorAll('tr')[1] as HTMLElement;
                    expect(window.getComputedStyle(secondRow).backgroundColor).toBe("rgb(245, 245, 245)");
                    detach(div);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('962302 - Nested Table Gets Deleted After Inserting Horizontal Line Before It', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'HorizontalLine', 'Bold', 'Italic']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                            <tbody>
                                <tr>
                                    <td style="width: 50%;">
                                        <p>Parent table cell content</p>
                                        <table class="e-rte-table nested-table" style="width: 100%; min-width: 0px;">
                                            <tbody>
                                                <tr>
                                                    <td style="width: 50%;">Nested Cell 1</td>
                                                    <td style="width: 50%;">Nested Cell 2</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 50%;">Nested Cell 3</td>
                                                    <td style="width: 50%;">Nested Cell 4</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td style="width: 50%;">
                                        <p>Another parent cell</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should preserve nested table when inserting horizontal line before it', (done: DoneFn) => {
            rteObj.focusIn();
            // Get the nested table element
            const nestedTable = rteObj.contentModule.getEditPanel().querySelector('.nested-table') as HTMLElement;
            expect(nestedTable).not.toBeNull();
            expect(nestedTable.querySelectorAll('tr').length).toBe(2);
            expect(nestedTable.querySelectorAll('td').length).toBe(4);
            // Position cursor just before the nested table
            const parentCell = nestedTable.closest('td');
            const range = document.createRange();
            range.setStart(parentCell, 3); // Position after the <p> element but before the nested table
            range.collapse(true);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            // Insert horizontal line using toolbar
            const hrButton = rteEle.querySelector('#' + rteObj.element.id + '_toolbar_HorizontalLine') as HTMLElement;
            hrButton.click();
            setTimeout(() => {
                // Verify that the nested table still exists after inserting HR
                const nestedTableAfterHR = rteObj.contentModule.getEditPanel().querySelector('.nested-table') as HTMLElement;
                expect(nestedTableAfterHR).not.toBeNull();
                expect(nestedTableAfterHR.querySelectorAll('tr').length).toBe(2);
                expect(nestedTableAfterHR.querySelectorAll('td').length).toBe(4);
                // Verify that horizontal line was inserted
                const hrElement = rteObj.contentModule.getEditPanel().querySelector('hr');
                expect(hrElement).not.toBeNull();
                // Verify that the nested table content is preserved
                const nestedCells = nestedTableAfterHR.querySelectorAll('td');
                expect(nestedCells[0].textContent.trim()).toBe('Nested Cell 1');
                expect(nestedCells[1].textContent.trim()).toBe('Nested Cell 2');
                expect(nestedCells[2].textContent.trim()).toBe('Nested Cell 3');
                expect(nestedCells[3].textContent.trim()).toBe('Nested Cell 4');
                // Verify that the parent table structure is maintained
                const parentTable = rteObj.contentModule.getEditPanel().querySelector('.e-rte-table');
                expect(parentTable).not.toBeNull();
                done();
            }, 200);
        });
    });

    describe('941512: Table is not inserted for the selected blockquote', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<blockquote><p>Testing</p></blockquote>`,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should insert a table after selecting text within blockquote', (done) => {
            rteObj.focusIn();
            const blockquote = rteObj.contentModule.getDocument().querySelector('blockquote');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), blockquote.firstChild, blockquote.firstChild, 0, 7);
            const createTableButton = rteEle.querySelector('.e-toolbar-item button') as HTMLElement;
            createTableButton.click();
            const insertTableButton = document.querySelector('.e-insert-table-btn') as HTMLElement;
            insertTableButton.click();
            const insertButton = document.querySelector('.e-insert-table') as HTMLElement;
            insertButton.click();
            setTimeout(() => {
                const tables = rteObj.contentModule.getDocument().querySelectorAll('table');
                expect(tables.length).toBe(1);
                done();
            }, 100);
        });
    });
    describe('938242: MAC - The quick toolbar for the MAC opens upon selecting text.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<table><tr><td>Text Content</td><td>Text Content</td><td>Text Content</td></tr></table>`
            });
        })
        afterAll(() => {
            destroy(editor);
        })
        it('Should not open the Quick toolbar on right click when range collapsed is false.', (done: DoneFn) => {
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

    describe('936848: Add Table Popup Gets Hidden Under the Lower Rich Text Editor’s Toolbar', () => {
        let rteObjOne: RichTextEditor;
        let rteObjTwo: RichTextEditor;
        beforeAll(() => {
            rteObjOne = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
            }
            );
            rteObjTwo = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">Rich Text Editor 1</td><td style="width: 50%;" class="">Rich Text Editor 1</td></tr><tr><td style="width: 50%;" class="">Rich Text Editor 1</td><td style="width: 50%;" class="e-cell-select">Rich Text Editor 1<p class="tdElement"><br></p></td></tr></tbody></table><p><br></p>`
            }
            );
        });
        afterAll(() => {
            destroy(rteObjOne);
            destroy(rteObjTwo);
        });
        it("936848: Add Table Popup Gets Hidden Under the Lower Rich Text Editor’s Toolbar", () => {
            expect(rteObjOne.element.querySelectorAll('.e-rte-content').length).toBe(1);
            expect(rteObjTwo.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteObjOne.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObjOne.element.querySelectorAll('.e-popup').length === 1).toBe(true);
            expect((<HTMLElement>rteObjOne.element.querySelector(".e-toolbar-wrapper") as HTMLElement).style.zIndex === '11').toBe(true);
            (<HTMLElement>rteObjOne.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect((<HTMLElement>rteObjOne.element.querySelector(".e-toolbar-wrapper") as HTMLElement).style.zIndex === '').toBe(true);
        });
    });

    describe('942409 - Background color applies to the newly inserted rows and column', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['TableRows', 'TableColumns', 'BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 33.3333%; background-color: rgb(255, 255, 0);"><span style="background-color: rgb(255, 255, 0);">​</span></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Case 1: Row - Should not copy the Background color style when new column and row are inserted.', (done: DoneFn) => {
            editor.focusIn();
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseDownEvent);
            setCursorPoint(editor.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const rowDropDownBtn: HTMLElement = document.querySelector('.e-popup-open .e-table-rows');
                rowDropDownBtn.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('table').rows.length).toBe(4);
                    const insertRowAfterBtn: HTMLElement = document.querySelectorAll('.e-item')[1] as HTMLElement;
                    insertRowAfterBtn.click();
                    setTimeout(() => {
                        expect(editor.inputElement.querySelector('table').rows.length).toBe(5);
                        expect(editor.inputElement.querySelectorAll('td')[3].style.backgroundColor).toBe('');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('942409 - Background color applies to the newly inserted rows and column', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['TableRows', 'TableColumns', 'BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 33.3333%; background-color: rgb(255, 255, 0);"><span style="background-color: rgb(255, 255, 0);">​</span></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Case 2: Column -Should not copy the Background color style when new column and row are inserted.', (done: DoneFn) => {
            editor.focusIn();
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseDownEvent);
            setCursorPoint(editor.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const colDropDownBtn: HTMLElement = document.querySelector('.e-popup-open .e-table-columns');
                colDropDownBtn.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('table').rows[0].cells.length).toBe(3);
                    const insertRowAfterBtn: HTMLElement = document.querySelectorAll('.e-item')[1] as HTMLElement;
                    insertRowAfterBtn.click();
                    setTimeout(() => {
                        expect(editor.inputElement.querySelector('table').rows[0].cells.length).toBe(4);
                        expect(editor.inputElement.querySelectorAll('td')[5].style.backgroundColor).toBe('');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('935436 - Improving coverage for toolbar renderer.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 33.3333%; background-color: rgb(255, 255, 0);"><span style="background-color: rgb(255, 255, 0);"></span></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Test case coverage for Cell Vertical Split', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseDownEvent);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const cellDropDownBtn: HTMLElement = document.querySelector('.e-popup-open .e-table-cell');
                cellDropDownBtn.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('table').rows[1].cells.length).toBe(3);
                    const insertRowAfterBtn: HTMLElement = document.querySelectorAll('.e-item')[2] as HTMLElement;
                    insertRowAfterBtn.click();
                    setTimeout(() => {
                        expect(editor.inputElement.querySelector('table').rows[1].cells.length).toBe(4);
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
    });

    describe('943288: Cursor Position Incorrect After Deleting a Table ', () => {
        let rteObj: any;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Introductory text.</p><table class="e-rte-table"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table><h2>Following text.</h2>`,
                quickToolbarSettings: {
                    table: ['TableRemove']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('should delete the table and place cursor after the table section', (done) => {
            rteObj.focusIn();
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
            setCursorPoint(rteObj.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const deleteBtn: HTMLElement = document.querySelector('.e-btn-icon.e-table-remove.e-icons').parentElement;
                deleteBtn.click();
                setTimeout(() => {
                    expect(rteObj.element.querySelector('table')).toBe(null);
                    expect(window.getSelection().getRangeAt(0).startOffset).toBe(1);
                    expect(window.getSelection().getRangeAt(0).endOffset).toBe(1);
                    done();
                }, 100);
            }, 100)
        });
    });

    describe('Bug 970441: Cursor Misplacement After Sequential Row Deletion in Table (Safari) ', () => {
        let rteObj: any;
        const defaultUA: string = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15';
            rteObj = renderRTE({
                value: `<p>Hello</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 100%;"></colgroup><tbody><tr><td><br></td></tr></tbody></table>`,
                quickToolbarSettings: {
                    table: ['TableRows']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
        it('should delete the table and place cursor after the table section', (done) => {
            rteObj.focusIn();
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
            setCursorPoint(rteObj.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            rteObj.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();
                // Find and click the TableRows dropdown button
                const tableRowsBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableRows');
                expect(tableRowsBtn).not.toBeNull();
                (tableRowsBtn as HTMLElement).click();
                const deleteRowOption = document.querySelector('.e-delete-row').parentElement;
                expect(deleteRowOption).not.toBeNull();
                (deleteRowOption as HTMLElement).click();
                setTimeout(() => {
                    expect(rteObj.element.querySelector('table')).toBe(null);
                    expect(window.getSelection().getRangeAt(0).startOffset).toBe(1);
                    expect(window.getSelection().getRangeAt(0).endOffset).toBe(1);
                    done();
                }, 100);
            }, 100)
        });
    });

    describe('935436 - Improving coverage for toolbar renderer.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                quickToolbarSettings: {
                    table: ['BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 33.3333%; background-color: rgb(255, 255, 0);"><span style="background-color: rgb(255, 255, 0);"></span></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p><br></p>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Test case coverage for Cell Background color', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.contentModule.getEditPanel().querySelector('td'), 0);
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseDownEvent);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const colorDropDown: HTMLElement = document.querySelector('.e-split-btn-wrapper .e-dropdown-btn');
                colorDropDown.click();
                setTimeout(() => {
                    done();
                }, 100);
            }, 200);
        });
    });

    describe('938242: MAC - The quick toolbar for the MAC opens upon selecting text.', () => {
        let editor: RichTextEditor;
        const defaultUA: string = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15';
            editor = renderRTE({
                value: `<table><tr><td>Text Content</td><td>Text Content</td><td>Text Content</td></tr></table>`
            });
        })
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        })
        it('Should not open the Quick toolbar on right click when range collapsed is false.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            const range = new Range();
            range.setStart(editor.inputElement.querySelector('td'), 1);
            range.setEnd(editor.inputElement.querySelectorAll('td')[1], 0);
            editor.selectRange(range);
            editor.inputElement.querySelector('td').dispatchEvent(new MouseEvent('mouseup', BASIC_CONTEXT_MENU_EVENT_INIT));
            editor.inputElement.querySelector('td').classList.add("e-multi-cells-select");
            editor.inputElement.querySelectorAll('td')[1].classList.add("e-multi-cells-select");
            setTimeout(() => {
                expect(editor.quickToolbarModule.tableQTBar.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('945123 - Table cell background color fails to apply..', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['BackgroundColor']
                },
                value: `<table border="1" cellpadding="0" cellspacing="0" valign="top" title="" summary="" style="direction: ltr; border-style: solid; border-width: 1pt;" class="e-rte-paste-table">\n <tbody><tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Task</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Status</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/944774">Bug\n  944774</a>: MAC - Table Quick Toolbar Fails to Open After Selecting Two Cells</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Done</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945054">Bug\n  945054</a>: MAC - Format Painter Pastes the content with formatting.</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7763in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Done</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6013in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945123">Bug\n  945123</a>: Table cell background color fails to apply.</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.8458in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">In Progress</p>\n  </td>\n </tr>\n <tr>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 6.6208in; padding: 4pt;">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;"><a href="https://dev.azure.com/EssentialStudio/Ej2-Web/_workitems/edit/945130">Bug\n  945130</a>: MAC - Uppercase and Lowercase Formats Applied Properly, but\n  Selection Partially Cleared</p>\n  </td>\n  <td style="border-style: solid; border-width: 1pt; vertical-align: top; width: 0.7569in; padding: 4pt;" class="">\n  <p style="margin: 0in; font-family: Calibri; font-size: 11pt;">Validated</p>\n  </td>\n </tr>\n</tbody></table>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should apply the Background color to the table cell when range is in selection.', (done: DoneFn) => {
            editor.focusIn();
            setCursorPoint(editor.contentModule.getEditPanel().querySelector('td').firstChild as HTMLElement, 0);
            const mouseDownEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(mouseDownEvent);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseDownEvent);
            const mouseUpEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            editor.contentModule.getEditPanel().querySelector('td').dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const colorDropDown: HTMLElement = document.querySelector('.e-popup-open .e-rte-background-colorpicker .e-split-colorpicker .e-selected-color');
                colorDropDown.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('td').style.backgroundColor).toBe('rgb(255, 255, 0)')
                    done();
                }, 100);
            }, 200);
        });
    });

    describe('954588 - Implement the Clipboard Copy Function for the Rich Text Editor table support.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"></colgroup><tbody><tr><td class="e-cell-select e-multi-cells-select">1</td><td class="e-cell-select e-multi-cells-select">2</td><td class="e-cell-select e-multi-cells-select">3</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td class="e-cell-select e-multi-cells-select">4</td><td class="e-cell-select e-multi-cells-select">5</td><td class="e-cell-select e-multi-cells-select">6</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td class="e-cell-select e-multi-cells-select">7</td><td class="e-cell-select e-multi-cells-select">8</td><td class="e-cell-select e-multi-cells-select e-cell-select-end">9</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('The Clipboard Copy Function for the Rich Text Editor table support.', (done: DoneFn) => {
            const mockEvent: object = {
                action: 'copy',
                isTrusted: true,
                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: 'KeyC',
                composed: true,
                ctrlKey: true,
                preventDefault: function (): void {
                    this.defaultPrevented = true;
                }
            };
            const range = new Range();
            range.setStart(editor.inputElement.querySelector('td'), 1);
            range.setEnd(editor.inputElement.querySelectorAll('td')[1], 0);
            editor.selectRange(range);
            editor.tableModule.tableObj.curTable = editor.inputElement.querySelector('table');
            editor.onCopy(mockEvent as any);
            expect(editor.inputElement.querySelectorAll('table')[0].rows[0].cells[0].innerText).toBe('1');
            done();
        });
    });

    describe('954593 - Implement the Clipboard Cut Function for the Rich Text Editor table support.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"><col style="width: 12.5%;"></colgroup><tbody><tr><td class="e-cell-select e-multi-cells-select">1</td><td class="e-cell-select e-multi-cells-select">2</td><td class="e-cell-select e-multi-cells-select">3</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td class="e-cell-select e-multi-cells-select">4</td><td class="e-cell-select e-multi-cells-select" rowspan="2" style="height: 51px;">5<br>8</td><td class="e-cell-select e-multi-cells-select">6</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td class="e-cell-select e-multi-cells-select">7</td><td class="e-cell-select e-multi-cells-select e-cell-select-end">9</td><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('The Clipboard cut Function for the Rich Text Editor table support.', (done: DoneFn) => {
            const mockEvent: object = {
                action: 'copy',
                isTrusted: true,
                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: 'KeyC',
                composed: true,
                ctrlKey: true,
                preventDefault: function (): void {
                    this.defaultPrevented = true;
                }
            };
            const range = new Range();
            range.setStart(editor.inputElement.querySelector('td'), 1);
            range.setEnd(editor.inputElement.querySelectorAll('td')[1], 0);
            editor.selectRange(range);
            editor.tableModule.tableObj.curTable = editor.inputElement.querySelector('table');
            editor.onCut(mockEvent as any);
            expect(editor.inputElement.querySelectorAll('table')[0].rows[0].cells[0].innerHTML).toBe('<br>');
            done();
        });
    });

    describe('Table Module - Additional Coverage Tests', () => {
        let rteObj: RichTextEditor;

        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                        'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles'],
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;">Cell 1</td><td style="width: 33.3333%;">Cell 2</td><td style="width: 33.3333%;">Cell 3</td></tr><tr><td style="width: 33.3333%;">Cell 4</td><td style="width: 33.3333%;">Cell 5</td><td style="width: 33.3333%;">Cell 6</td></tr></tbody></table><p><br></p>`
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('should test table selection with multiple cells and keyboard navigation', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cells = table.querySelectorAll('td');

            // Set up selection on first cell
            cells[0].classList.add('e-cell-select');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cells[0], cells[0], 0, 0);

            // Test shift+arrow right to select multiple cells
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 39, // Right arrow
                    shiftKey: true
                }
            });

            // Test shift+arrow down to extend selection
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 40, // Down arrow
                    shiftKey: true
                }
            });

            // Test escape key to clear selection
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 27, // Escape
                    shiftKey: false
                }
            });

            expect(cells[0].classList.contains('e-cell-select')).toBe(true);
        });

        it('should test table border styles application', () => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');

            // Test applying different border styles
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Dashed', table);
            expect(table.classList.contains('e-dashed-border')).toBe(true);

            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Alternate', table);
            expect(table.classList.contains('e-alternate-border')).toBe(true);

            // Test removing styles
            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Dashed', table);
            expect(table.classList.contains('e-dashed-border')).toBe(false);

            (rteObj.tableModule as any).tableObj.applyTableStyleCommand('Alternate', table);
            expect(table.classList.contains('e-alternate-border')).toBe(false);
        });

        it('should test table row operations with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
            // Simulate mouse click on cell to select it
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseDownEvent);

            // Simulate mouse up to trigger quick toolbar
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table rows button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableRows dropdown button
                const tableRowsBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableRows');
                expect(tableRowsBtn).not.toBeNull();
                (tableRowsBtn as HTMLElement).click();
                // Wait for dropdown to appear
                setTimeout(() => {
                    // Find and click the "Insert Row Before" option
                    const insertRowBeforeOption = document.querySelector('.e-insert-row-before').parentElement;
                    expect(insertRowBeforeOption).not.toBeNull();
                    (insertRowBeforeOption as HTMLElement).click();

                    // Verify row was added
                    expect(table.querySelectorAll('tr').length).toBe(3);

                    // Click the cell again to get the toolbar
                    setTimeout(() => {
                        cell.dispatchEvent(mouseDownEvent);
                        cell.dispatchEvent(mouseUpEvent);

                        setTimeout(() => {
                            // Click the TableRows button again
                            (tableRowsBtn as HTMLElement).click();

                            // Wait for dropdown to appear
                            setTimeout(() => {
                                // Find and click the "Insert Row After" option
                                const insertRowAfterOption = document.querySelector('.e-insert-row-after').parentElement;
                                expect(insertRowAfterOption).not.toBeNull();
                                (insertRowAfterOption as HTMLElement).click();

                                // Verify another row was added
                                expect(table.querySelectorAll('tr').length).toBe(4);

                                // Click the cell again to get the toolbar
                                setTimeout(() => {
                                    cell.dispatchEvent(mouseDownEvent);
                                    cell.dispatchEvent(mouseUpEvent);

                                    setTimeout(() => {
                                        // Click the TableRows button again
                                        (tableRowsBtn as HTMLElement).click();

                                        // Wait for dropdown to appear
                                        setTimeout(() => {
                                            // Find and click the "Delete Row" option
                                            const deleteRowOption = document.querySelector('.e-delete-row').parentElement;
                                            expect(deleteRowOption).not.toBeNull();
                                            (deleteRowOption as HTMLElement).click();

                                            // Verify row was deleted
                                            expect(table.querySelectorAll('tr').length).toBe(3);
                                            done();
                                        }, 100);
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table column operations with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
            // Simulate mouse click on cell to select it
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseDownEvent);

            // Simulate mouse up to trigger quick toolbar
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table columns button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableColumns dropdown button
                const tableColumnsBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableColumns');
                expect(tableColumnsBtn).not.toBeNull();
                (tableColumnsBtn as HTMLElement).click();

                // Wait for dropdown to appear
                setTimeout(() => {
                    // Find and click the "Insert Column Left" option
                    const insertColumnLeftOption = document.querySelector('.e-insert-column-left').parentElement;
                    expect(insertColumnLeftOption).not.toBeNull();
                    (insertColumnLeftOption as HTMLElement).click();

                    // Verify column was added
                    expect(table.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(4);

                    // Click the cell again to get the toolbar
                    setTimeout(() => {
                        cell.dispatchEvent(mouseDownEvent);
                        cell.dispatchEvent(mouseUpEvent);

                        setTimeout(() => {
                            // Click the TableColumns button again
                            (tableColumnsBtn as HTMLElement).click();

                            // Wait for dropdown to appear
                            setTimeout(() => {
                                // Find and click the "Insert Column Right" option
                                const insertColumnRightOption = document.querySelector('.e-insert-column-right').parentElement;
                                expect(insertColumnRightOption).not.toBeNull();
                                (insertColumnRightOption as HTMLElement).click();

                                // Verify another column was added
                                expect(table.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(5);

                                // Click the cell again to get the toolbar
                                setTimeout(() => {
                                    cell.dispatchEvent(mouseDownEvent);
                                    cell.dispatchEvent(mouseUpEvent);

                                    setTimeout(() => {
                                        // Click the TableColumns button again
                                        (tableColumnsBtn as HTMLElement).click();

                                        // Wait for dropdown to appear
                                        setTimeout(() => {
                                            // Find and click the "Delete Column" option
                                            const deleteColumnOption = document.querySelector('.e-delete-column').parentElement;
                                            expect(deleteColumnOption).not.toBeNull();
                                            (deleteColumnOption as HTMLElement).click();

                                            // Verify column was deleted
                                            expect(table.querySelectorAll('tr')[0].querySelectorAll('td').length).toBe(4);
                                            done();
                                        }, 100);
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table cell vertical alignment with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
            // Simulate mouse click on cell to select it
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseDownEvent);

            // Simulate mouse up to trigger quick toolbar
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table cell button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableCell dropdown button
                const tableCellBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableCellVerticalAlign');
                expect(tableCellBtn).not.toBeNull();
                (tableCellBtn as HTMLElement).click();

                // Wait for dropdown to appear
                setTimeout(() => {
                    // Find and click the "Align Top" option
                    const alignTopOption = document.querySelector('.e-align-top').parentElement;
                    expect(alignTopOption).not.toBeNull();
                    (alignTopOption as HTMLElement).click();

                    // Verify alignment was applied
                    expect(cell.style.verticalAlign).toBe('top');

                    // Click the cell again to get the toolbar
                    setTimeout(() => {
                        cell.dispatchEvent(mouseDownEvent);
                        cell.dispatchEvent(mouseUpEvent);

                        setTimeout(() => {
                            // Click the TableCell button again
                            (tableCellBtn as HTMLElement).click();

                            // Wait for dropdown to appear
                            setTimeout(() => {
                                // Find and click the "Align Middle" option
                                const alignMiddleOption = document.querySelector('.e-align-middle').parentElement;
                                expect(alignMiddleOption).not.toBeNull();
                                (alignMiddleOption as HTMLElement).click();

                                // Verify alignment was applied
                                expect(cell.style.verticalAlign).toBe('middle');

                                // Click the cell again to get the toolbar
                                setTimeout(() => {
                                    cell.dispatchEvent(mouseDownEvent);
                                    cell.dispatchEvent(mouseUpEvent);

                                    setTimeout(() => {
                                        // Click the TableCell button again
                                        (tableCellBtn as HTMLElement).click();

                                        // Wait for dropdown to appear
                                        setTimeout(() => {
                                            // Find and click the "Align Bottom" option
                                            const alignBottomOption = document.querySelector('.e-align-bottom').parentElement;
                                            expect(alignBottomOption).not.toBeNull();
                                            (alignBottomOption as HTMLElement).click();

                                            // Verify alignment was applied
                                            expect(cell.style.verticalAlign).toBe('bottom');
                                            done();
                                        }, 100);
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table cell merge and split operations with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cells = table.querySelectorAll('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cells[0], cells[0], 0, 0);
            // First select multiple cells by clicking and dragging
            // Simulate mousedown on first cell
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cells[0].dispatchEvent(mouseDownEvent);

            // Add selection class to simulate selection
            cells[0].classList.add('e-cell-select');
            cells[1].classList.add('e-cell-select');
            cells[3].classList.add('e-cell-select');
            cells[4].classList.add('e-cell-select');

            // Simulate mouseup on last selected cell
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cells[4].dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table cell button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableCell dropdown button
                const tableCellBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableCell');
                expect(tableCellBtn).not.toBeNull();
                (tableCellBtn as HTMLElement).click();

                // Wait for dropdown to appear
                setTimeout(() => {
                    // Find and click the "Merge Cells" option
                    const mergeCellsOption = document.querySelector('.e-cell-merge').parentElement;
                    expect(mergeCellsOption).not.toBeNull();
                    (mergeCellsOption as HTMLElement).click();

                    // Verify cells were merged
                    const firstRowCells = table.querySelectorAll('tr')[0].querySelectorAll('td');
                    expect(firstRowCells.length).toBeLessThan(3);

                    // Find the merged cell
                    const cellWithColspan = table.querySelector('td[rowspan]');
                    expect(cellWithColspan).not.toBeNull();

                    // Now click on the merged cell to split it
                    setTimeout(() => {
                        cellWithColspan.dispatchEvent(mouseDownEvent);
                        cellWithColspan.dispatchEvent(mouseUpEvent);

                        setTimeout(() => {
                            // Click the TableCell button again
                            (tableCellBtn as HTMLElement).click();

                            // Wait for dropdown to appear
                            setTimeout(() => {
                                // Find and click the "Split Cell" option
                                const splitCellOption = document.querySelector('.e-cell-vertical-split').parentElement;
                                expect(splitCellOption).not.toBeNull();
                                (splitCellOption as HTMLElement).click();

                                // Verify cells were split
                                const firstRowCellsAfterSplit = table.querySelectorAll('tr')[0].querySelectorAll('td');
                                expect(firstRowCellsAfterSplit.length).toBeGreaterThanOrEqual(2);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table properties dialog', (done: DoneFn) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');

            // Select the cell
            cell.classList.add('e-cell-select');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);

            // Open table properties dialog
            (rteObj.tableModule as any).openDialog(true, selection);

            setTimeout(() => {
                // Check if dialog is open
                const dialog = document.querySelector('.e-rte-edit-table');
                expect(dialog).not.toBeNull();

                // Update table properties
                const widthInput = document.querySelector('#tableWidth') as HTMLInputElement;
                const heightInput = document.querySelector('#tableHeight') as HTMLInputElement;
                const cellPaddingInput = document.querySelector('#cellPadding') as HTMLInputElement;
                const cellSpacingInput = document.querySelector('#cellSpacing') as HTMLInputElement;

                if (widthInput) widthInput.value = '500';
                if (heightInput) heightInput.value = '300';
                if (cellPaddingInput) cellPaddingInput.value = '10';
                if (cellSpacingInput) cellSpacingInput.value = '5';

                // Apply changes
                const updateButton = document.querySelector('.e-size-update') as HTMLElement;
                if (updateButton) {
                    updateButton.click();

                    setTimeout(() => {
                        // Check if properties were applied
                        expect(table.style.width).toBe('500px');
                        expect(table.getAttribute('cellspacing')).toBe('5');
                        expect(cell.style.padding).toBe('10px');
                        done();
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });

        it('should test table removal with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
            // Simulate mouse click on cell to select it
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseDownEvent);

            // Simulate mouse up to trigger quick toolbar
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            cell.dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table remove button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableRemove button
                const tableRemoveBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableRemove');

                expect(tableRemoveBtn !== undefined).toBe(true);
                (tableRemoveBtn as HTMLElement).click();

                // Verify table was removed
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().querySelector('table')).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('should test table with empty cells and special key handling', () => {
            rteObj.value = `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;"></td><td style="width: 33.3333%;"></td><td style="width: 33.3333%;"></td></tr><tr><td style="width: 33.3333%;"></td><td style="width: 33.3333%;"></td><td style="width: 33.3333%;"></td></tr></tbody></table><p><br></p>`;
            rteObj.dataBind();
            rteObj.focusIn();

            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');

            // Select the cell
            cell.classList.add('e-cell-select');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);

            // Test backspace in empty cell
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 8, // Backspace
                    shiftKey: false
                }
            });

            // Test delete in empty cell
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 46, // Delete
                    shiftKey: false
                }
            });

            // Test enter in cell
            (rteObj.tableModule as any).keyDown({
                args: {
                    preventDefault: function () { },
                    keyCode: 13, // Enter
                    shiftKey: false
                }
            });

            expect(table.querySelectorAll('td').length).toBe(6);
        });

        it('should test table with nested elements and selection with human interaction', (done: Function) => {
            rteObj.value = `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;"><p>Paragraph in cell</p><ul><li>List item 1</li><li>List item 2</li></ul></td><td style="width: 33.3333%;"><p>Another paragraph</p></td><td style="width: 33.3333%;"><p>Third cell</p></td></tr></tbody></table><p><br></p>`;
            rteObj.dataBind();
            rteObj.focusIn();

            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            const listItem = cell.querySelector('li');

            // Simulate mouse click and drag to select text in list item
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            // First click to position cursor
            listItem.dispatchEvent(mouseDownEvent);

            // Manually set selection range since we can't easily simulate drag
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(listItem.firstChild, 2);
            range.setEnd(listItem.firstChild, 5);
            selection.removeAllRanges();
            selection.addRange(range);

            // Finish selection with mouseup
            listItem.dispatchEvent(mouseUpEvent);

            // Verify selection is correct
            const currentRange = selection.getRangeAt(0);
            expect(currentRange.startContainer).toBe(listItem.firstChild);
            expect(currentRange.startOffset).toBe(2);
            expect(currentRange.endOffset).toBe(5);

            // Now click on the cell to get the table toolbar
            setTimeout(() => {
                cell.dispatchEvent(mouseDownEvent);
                cell.dispatchEvent(mouseUpEvent);
                const selection = new NodeSelection();
                selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
                // Wait for quick toolbar to appear
                setTimeout(() => {
                    // Find the table rows button in quick toolbar
                    const quickToolbar = document.querySelector('.e-rte-quick-popup');
                    expect(quickToolbar).not.toBeNull();

                    // Find and click the TableRows dropdown button
                    const tableRowsBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableRows');
                    expect(tableRowsBtn).not.toBeNull();
                    (tableRowsBtn as HTMLElement).click();

                    // Wait for dropdown to appear
                    setTimeout(() => {
                        // Find and click the "Insert Row After" option
                        const insertRowAfterOption = document.querySelector('.e-insert-row-after').parentElement;
                        expect(insertRowAfterOption).not.toBeNull();
                        (insertRowAfterOption as HTMLElement).click();

                        // Verify row was added
                        setTimeout(() => {
                            expect(table.querySelectorAll('tr').length).toBe(2);

                            // Verify the nested elements are still intact
                            expect(cell.querySelector('p').textContent).toBe('Paragraph in cell');
                            expect(cell.querySelectorAll('li').length).toBe(2);
                            expect(cell.querySelectorAll('li')[0].textContent).toBe('List item 1');
                            expect(cell.querySelectorAll('li')[1].textContent).toBe('List item 2');

                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table with browser-specific handling', () => {
            // Save original user agent
            const originalUserAgent = Browser.userAgent;

            try {
                // Test with Firefox user agent
                Browser.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";

                rteObj.focusIn();
                const table = rteObj.contentModule.getEditPanel().querySelector('table');
                const cell = table.querySelector('td');

                // Select the cell
                cell.classList.add('e-cell-select');
                const selection = new NodeSelection();
                selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);

                // Test Firefox-specific handling
                (rteObj.tableModule as any).keyDown({
                    args: {
                        preventDefault: function () { },
                        keyCode: 9, // Tab
                        shiftKey: false
                    }
                });

                // Test with Safari user agent
                Browser.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";

                // Test Safari-specific handling
                (rteObj.tableModule as any).keyDown({
                    args: {
                        preventDefault: function () { },
                        keyCode: 9, // Tab
                        shiftKey: true
                    }
                });

                expect(table.querySelectorAll('td').length).toBe(6);
            } finally {
                // Restore original user agent
                Browser.userAgent = originalUserAgent;
            }
        });

        it('should test table with complex selection scenarios with human interaction', (done: Function) => {
            rteObj.value = `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;">Cell 1</td><td style="width: 33.3333%;">Cell 2</td><td style="width: 33.3333%;">Cell 3</td></tr><tr><td style="width: 33.3333%;">Cell 4</td><td style="width: 33.3333%;">Cell 5</td><td style="width: 33.3333%;">Cell 6</td></tr></tbody></table><p>Text after table</p>`;
            rteObj.dataBind();
            rteObj.focusIn();

            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cells = table.querySelectorAll('td');
            const paragraph = rteObj.contentModule.getEditPanel().querySelector('p');

            // Simulate mouse events for complex selection
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            // Start selection at last cell
            cells[5].dispatchEvent(mouseDownEvent);

            // Manually create a complex selection from cell to paragraph
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(cells[5], 0);
            range.setEnd(paragraph.firstChild, 3);
            selection.removeAllRanges();
            selection.addRange(range);

            // End selection at paragraph
            paragraph.dispatchEvent(mouseUpEvent);

            // Verify selection is correct
            const currentRange = selection.getRangeAt(0);
            expect(currentRange.startContainer).toBe(cells[5]);
            expect(currentRange.endContainer).toBe(paragraph.firstChild);

            // Add selection classes to simulate table selection
            cells[5].classList.add('e-cell-select');

            // Click on a different area to reset selection
            setTimeout(() => {
                const clickEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 10,
                    clientY: 10
                });

                rteObj.contentModule.getEditPanel().dispatchEvent(clickEvent);
                rteObj.contentModule.getEditPanel().dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));

                // Verify selection was reset
                setTimeout(() => {
                    expect(cells[0].classList.contains('e-cell-select')).toBe(false);
                    expect(cells[5].classList.contains('e-cell-select')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should test table with multiple tables in document with human interaction', (done: Function) => {
            rteObj.value = `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td>Table 1 Cell</td></tr></tbody></table><p>Text between tables</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td>Table 2 Cell</td></tr></tbody></table>`;
            rteObj.dataBind();
            rteObj.focusIn();

            const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
            expect(tables.length).toBe(2);

            // Simulate mouse click on cell in second table
            const cell = tables[1].querySelector('td');
            const selection = new NodeSelection();
            selection.setSelectionText(rteObj.contentModule.getDocument(), cell, cell, 0, 0);
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            cell.dispatchEvent(mouseDownEvent);
            cell.dispatchEvent(mouseUpEvent);

            // Wait for quick toolbar to appear
            setTimeout(() => {
                // Find the table rows button in quick toolbar
                const quickToolbar = document.querySelector('.e-rte-quick-popup');
                expect(quickToolbar).not.toBeNull();

                // Find and click the TableRows dropdown button
                const tableRowsBtn = quickToolbar.querySelector('#' + rteObj.element.id + '_quick_TableRows');
                expect(tableRowsBtn).not.toBeNull();
                (tableRowsBtn as HTMLElement).click();

                // Wait for dropdown to appear
                setTimeout(() => {
                    // Find and click the "Insert Row After" option
                    const insertRowAfterOption = document.querySelector('.e-insert-row-after').parentElement;
                    expect(insertRowAfterOption).not.toBeNull();
                    (insertRowAfterOption as HTMLElement).click();

                    // Verify row was added to the correct table
                    setTimeout(() => {
                        expect(tables[1].querySelectorAll('tr').length).toBe(2);
                        expect(tables[0].querySelectorAll('tr').length).toBe(1);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should test table with context menu operations with human interaction', (done: Function) => {
            rteObj.focusIn();
            const table = rteObj.contentModule.getEditPanel().querySelector('table');
            const cell = table.querySelector('td');
            // Simulate right-click on cell
            const contextMenuEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2,  // Right mouse button
            });
            const contextMenuUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2,  // Right mouse button
            });
            // Prevent actual context menu from appearing
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            }, { once: true });
            cell.dispatchEvent(contextMenuEvent);
            cell.dispatchEvent(contextMenuUpEvent);
            // Wait for quick toolbar to appear (if applicable)
            setTimeout(() => {
                // Check if cell is selected
                expect(cell.classList.contains('e-cell-select')).toBe(true);
                // Manually hide the toolbar
                (rteObj.tableModule as any).hideTableQuickToolbar();
                // Simulate left-click elsewhere to deselect
                const clickEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,  // Left mouse button
                });
                const clickUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0,  // Left mouse button
                });
                rteObj.contentModule.getEditPanel().dispatchEvent(clickEvent);
                rteObj.contentModule.getEditPanel().dispatchEvent(clickUpEvent);
                setTimeout(() => {
                    expect(cell.classList.contains('e-cell-select')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('938242: MAC - Background color not applied for the Table Cell.', () => {
        let editor: RichTextEditor;
        const defaultUA: string = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MACOS_USER_AGENT.SAFARI;
            editor = renderRTE({
                quickToolbarSettings: {
                    table: ['BackgroundColor']
                },
                value: `<table class="e-rte-table" style="width: 12.5749%; min-width: 0px; height: 35px;"><tbody><tr style="height: 63.5135%;"><td style="width: 50%;">Sno<br/><br/></td><td style="width: 50%;">Task</td></tr><tr style="height: 35.1351%;"><td style="width: 50%;" class="">1</td><td style="width: 50%;" class=""><br/></td></tr></tbody></table>`
            });
        })
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        })
        it('Should apply the background color to the Table cell.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            const range = new Range();
            editor.inputElement.querySelector('td').classList.add('e-cell-select');
            range.setStart(editor.inputElement.querySelector('td'), 2);
            range.setEnd(editor.inputElement.querySelectorAll('td')[1], 0);
            editor.selectRange(range);
            editor.inputElement.querySelector('td').dispatchEvent(new MouseEvent('mouseup', BASIC_CONTEXT_MENU_EVENT_INIT));
            editor.inputElement.querySelector('td').classList.add("e-multi-cells-select");
            editor.inputElement.querySelectorAll('td')[1].classList.add("e-multi-cells-select");
            setTimeout(() => {
                expect(editor.quickToolbarModule.tableQTBar.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const colorDropDown: HTMLElement = document.querySelector('.e-split-btn');
                colorDropDown.click();
                setTimeout(() => {
                    expect((editor.inputElement.querySelector('td').childNodes[2] as HTMLElement).style.backgroundColor).toBe('rgb(255, 255, 0)')
                    done();
                }, 150);
            }, 100);
        });
    });

    describe('Cell selection with arrow keys testing. CASE 1: Arrow keys cell selection.', () => {
        let editor: RichTextEditor;

        beforeEach(() => {
            editor = renderRTE({
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;"><br/></td><td style="width: 50%;"><br/></td></tr><tr><td style="width: 50%;"><br/></td><td style="width: 50%;"><br/></td></tr></tbody></table><p><br/></p>'
            })
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should select the next cell with Right arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[0];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_RIGHT_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[1];
                const range: Range = new Range();
                range.setStart(firstTD, 0);
                range.setEnd(secondTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    expect(secondTD.classList.contains('e-cell-select')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it('Should select the previous cell with Left arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[1];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_LEFT_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[0];
                const range: Range = new Range();
                range.setStart(secondTD, 0);
                range.setEnd(firstTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    expect(secondTD.classList.contains('e-cell-select')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it('Should select the next row with Down arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[0];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_DOWN_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[1];
                const range: Range = new Range();
                range.setStart(firstTD, 0);
                range.setEnd(secondTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    const tdElements: NodeListOf<HTMLTableCellElement> = editor.inputElement.querySelectorAll('td');
                    expect(tdElements[0].classList.contains('e-cell-select')).toBe(true);
                    expect(tdElements[2].classList.contains('e-cell-select')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it('Should select the previous cell with Up arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[2];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_UP_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[0];
                const range: Range = new Range();
                range.setStart(secondTD, 0);
                range.setEnd(firstTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    const tdElements: NodeListOf<HTMLTableCellElement> = editor.inputElement.querySelectorAll('td');
                    expect(tdElements[0].classList.contains('e-cell-select')).toBe(true);
                    expect(tdElements[2].classList.contains('e-cell-select')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Cell selection with arrow keys testing. CASE 2: Arrow keys row selection.', () => {
        let editor: RichTextEditor;

        beforeEach(() => {
            editor = renderRTE({
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;"><br/></td><td style="width: 50%;"><br/></td></tr><tr><td style="width: 50%;"><br/></td><td style="width: 50%;"><br/></td></tr></tbody></table><p><br/></p>'
            })
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should select the next cell with Right arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[0];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_RIGHT_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[1];
                const range: Range = new Range();
                range.setStart(firstTD, 0);
                range.setEnd(secondTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    expect(secondTD.classList.contains('e-cell-select')).toBe(true);
                    const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_RIGHT_EVENT_INIT);
                    editor.inputElement.dispatchEvent(shiftKeyDown);
                    const thirdTD: HTMLElement = editor.inputElement.querySelectorAll('td')[2];
                    const range: Range = new Range();
                    range.setStart(firstTD, 0);
                    range.setEnd(thirdTD, 0);
                    editor.selectRange(range);
                    setTimeout(() => {
                        const tdElements: NodeListOf<HTMLTableCellElement> = editor.inputElement.querySelectorAll('td');
                        expect(tdElements[0].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[1].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[2].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[3].classList.contains('e-cell-select')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Should select the previous cell with Left arrow key press.', (done: DoneFn) => {
            editor.focusIn();
            const firstTD: HTMLElement = editor.inputElement.querySelectorAll('td')[3];
            setCursorPoint(firstTD, 0);
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseDownEvent);
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            firstTD.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(firstTD.classList.contains('e-cell-select')).toBe(true);
                const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_LEFT_EVENT_INIT);
                editor.inputElement.dispatchEvent(shiftKeyDown);
                const secondTD: HTMLElement = editor.inputElement.querySelectorAll('td')[2];
                const range: Range = new Range();
                range.setStart(secondTD, 0);
                range.setEnd(firstTD, 0);
                editor.selectRange(range);
                setTimeout(() => {
                    expect(secondTD.classList.contains('e-cell-select')).toBe(true);
                    const shiftKeyDown: KeyboardEvent = new KeyboardEvent('keydown', SHIFT_ARROW_LEFT_EVENT_INIT);
                    editor.inputElement.dispatchEvent(shiftKeyDown);
                    const thirdTD: HTMLElement = editor.inputElement.querySelectorAll('td')[2];
                    const range: Range = new Range();
                    range.setStart(thirdTD, 0);
                    range.setEnd(firstTD, 0);
                    editor.selectRange(range);
                    setTimeout(() => {
                        const tdElements: NodeListOf<HTMLTableCellElement> = editor.inputElement.querySelectorAll('td');
                        expect(tdElements[0].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[1].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[2].classList.contains('e-cell-select')).toBe(true);
                        expect(tdElements[3].classList.contains('e-cell-select')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('EJ2-28899: Apply alignment to multiple selected table header cells', () => {
        let rteObj: any;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        'Bold', 'CreateTable', '|', 'Formats', 'Alignments',
                        'OrderedList', 'UnorderedList', 'Outdent', 'Indent'
                    ]
                },
                quickToolbarSettings: {
                    table: ['Alignments', 'TableCell']
                },
                value:
                    '<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in client side.</p>' +
                    '<table class="e-rte-table" style="width: 100%;">' +
                    '<thead><tr><th class="e-cell-select">Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead>' +
                    '<tbody><tr><td>test</td><td>test2</td><td>test3</td></tr></tbody></table>'
            });
            rteEle = rteObj.element as HTMLElement;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Apply right alignment to multiple selected table header cells', (done: DoneFn) => {
            const tdCells: NodeListOf<HTMLTableCellElement> = rteEle.querySelectorAll('.e-rte-table td');
            const startCell: HTMLTableCellElement = tdCells[0];
            const endCell: HTMLTableCellElement = tdCells[2];
            const eventsArg = {
                pageX: 50,
                pageY: 300,
                target: startCell,
                which: 1
            };
            rteObj.mouseDownHandler(eventsArg);
            const mouseMoveEvent = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            endCell.dispatchEvent(mouseMoveEvent);
            rteObj.mouseUp(eventsArg);
            setCursorPoint(endCell.firstChild as Element, 3)
            rteObj.tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                const tablePopup = document.querySelector('.e-rte-quick-popup') as HTMLElement;
                const alignBtn = tablePopup.querySelector(`#${controlId}_quick_Alignments`) as HTMLElement;
                alignBtn.click();
                const dropdown = document.querySelector(`#${controlId}_quick_Alignments-popup`) as HTMLElement;
                const rightAlignItem = dropdown.querySelectorAll('.e-item')[2] as HTMLElement;
                rightAlignItem.click();
                expect(tdCells[0].style.textAlign).toBe('right');
                expect(tdCells[1].style.textAlign).toBe('right');
                expect(tdCells[2].style.textAlign).toBe('right');
                done();
            }, 600);
        });
    });

    describe("EJ2-957170: Apply vertical alignment to multiple selected table cells", function () {
        let rteObj: any;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                quickToolbarSettings: {
                    table: ['TableCellVerticalAlign', 'TableCell'],
                },
                value: `<p><b>Description:</b></p>
                        <p>The Rich Text Editor (RTE) control is easy to render on the client side.</p>
                        <table class="e-rte-table" style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td class="e-cell-select">Cell 1</td>
                                    <td>Cell 2</td>
                                    <td>Cell 3</td>
                                </tr>
                                <tr>
                                    <td>Cell 4</td>
                                    <td>Cell 5</td>
                                    <td>Cell 6</td>
                                </tr>
                            </tbody>
                        </table>`
            });
            rteEle = rteObj.element as HTMLElement;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Apply middle vertical alignment to selected table data cells', (done: DoneFn) => {
            const tdCells: NodeListOf<HTMLTableCellElement> = rteEle.querySelectorAll('.e-rte-table td');
            const startCell: HTMLTableCellElement = tdCells[0];
            const endCell: HTMLTableCellElement = tdCells[2];
            const eventsArg = { pageX: 50, pageY: 300, target: startCell, which: 1 };
            rteObj.mouseDownHandler(eventsArg);
            const moveEvent = new MouseEvent("mousemove", { view: window, bubbles: true, cancelable: true });
            endCell.dispatchEvent(moveEvent);
            rteObj.mouseUp(eventsArg);
            rteObj.tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                const tablePopup = document.querySelector('.e-rte-quick-popup') as HTMLElement;
                const vAlignBtn = tablePopup.querySelector(`#${controlId}_quick_TableCellVerticalAlign`) as HTMLElement;
                vAlignBtn.click();
                const dropdown = document.querySelector(`#${controlId}_quick_TableCellVerticalAlign-popup`) as HTMLElement;
                const middleAlignItem = dropdown.querySelectorAll('.e-item')[1] as HTMLElement;
                middleAlignItem.click();
                expect(tdCells[0].style.verticalAlign).toBe('middle');
                expect(tdCells[1].style.verticalAlign).toBe('middle');
                expect(tdCells[2].style.verticalAlign).toBe('middle');
                done();
            }, 600);
        });
    });

    describe('EJ2-961259 - Fix for table up/down arrow navigation in nested structure', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let keyEvent: any = {
            preventDefault: () => {},
            stopPropagation: () => {},
            keyCode: 40, // down arrow
            shiftKey: false
        };
        let selObj: NodeSelection;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
            selObj = new NodeSelection();
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('Should move caret vertically between rows for pasted Word table structure', (done) => {
            const pasteContent = `
                <table>
                    <tbody>
                        <tr><td><p>&nbsp;</p></td><td><p>Cell 2</p></td></tr>
                        <tr><td><p>Cell 3</p></td><td><p>Cell 4</p></td></tr>
                    </tbody>
                </table>`;
            rteObj.executeCommand('insertHTML', pasteContent);
            
            setTimeout(() => {
                const table = rteObj.contentModule.getEditPanel().querySelector('table')!;
                const firstCell = table.querySelectorAll('td')[0];
                const secondRowFirstCell = table.querySelectorAll('td')[2];
                const targetNode = firstCell.querySelector('p').firstChild;
                selObj.setSelectionText(rteObj.contentModule.getDocument(), targetNode, targetNode, 0, 0);
                keyEvent.keyCode = 40;
                (rteObj as any).tableModule.keyDown({ args: keyEvent });
                const newRange = selObj.getRange(rteObj.contentModule.getDocument());
                expect(secondRowFirstCell.contains(newRange.startContainer)).toBe(true);
                done();
            }, 50);
        });
    });

    describe('963113 - Table cell content insertion with emoji - Issue Fix', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', 'Formats', 'Italic', 'Underline']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                            <tbody>
                                <tr>
                                    <td style="width: 50%;"><span style="font-size: 14pt">🚕<br><br></span></td>
                                    <td style="width: 50%;">Normal cell</td>
                                </tr>
                            </tbody>
                        </table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should insert heading tag without wrapping in span when cell contains emoji', (done: DoneFn) => {
            rteObj.focusIn();
            // Select the cell with emoji
            const cellWithEmoji = rteObj.contentModule.getEditPanel().querySelector('br');
            const selection = new NodeSelection();
            // Position cursor at the end of the cell content
            selection.setSelectionText(
                rteObj.contentModule.getDocument(), 
                cellWithEmoji,
                cellWithEmoji,
                cellWithEmoji.textContent.length, 
                cellWithEmoji.textContent.length
            );
            // Insert a heading using executeCommand
            rteObj.executeCommand('formatBlock', 'H1');
            setTimeout(() => {
                // Check that the heading is not wrapped in a span
                const h1Element = rteObj.contentModule.getEditPanel().querySelector('h1');
                expect(h1Element).not.toBeNull();
                // Verify that the h1 is a direct child of td, not wrapped in span
                expect(h1Element.parentElement.tagName.toLowerCase()).toBe('td');
                // Verify that there's no span wrapper around the h1
                const spanWrapper = cellWithEmoji.querySelector('span > h1');
                expect(spanWrapper).toBeNull();
                // Verify emoji is preserved
                expect(h1Element.textContent).toContain('🚕');
                done();
            }, 100);
        });
    });

    describe('RTE with popup toolbar - table insertion via popup toggle', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let defaultRTE: HTMLElement = createElement('div', { id: 'defaultRTE' });
            let innerHTML: string = `<p id="rte-p"></p>`;
            beforeEach( () => {
                document.body.appendChild(defaultRTE);
                rteObj = new RichTextEditor({
                    height: 400,
                    width: 200,
                    placeholder: 'Insert table here',
                    toolbarSettings: {
                        type: ToolbarType.Popup,
                        items: ['Bold', 'Italic', 'Underline', 'FontName', 'FontSize', 'Alignments', 'SourceCode' , 'CreateTable']
                    }
                });
                rteObj.appendTo('#defaultRTE');
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should expand nav, open table popup, insert table via cell selection, and close the popup', () => {
                const createTableBtn = rteObj.element.querySelector('.e-create-table') as HTMLElement;
                expect(createTableBtn).not.toBeNull();
                createTableBtn.click();
                const popup = (rteObj as any).tableModule.popupObj.element;
                expect(popup).not.toBeNull();
                expect(popup.classList.contains('e-popup-open')).toBe(true);
                const targetCell = popup.querySelector('.e-rte-tablecell[data-cell="4"]') as HTMLElement;
                expect(targetCell).not.toBeNull();
                targetCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const insertedTable = rteObj.contentModule.getEditPanel().querySelector('table');
                expect(insertedTable).not.toBeNull();
            });
    });

    describe('968937 - Table height and width resizing functionality', () => {
        let editor: RichTextEditor;
        let rteEle: HTMLElement;

        beforeAll(() => {
            editor = renderRTE({
                saveInterval: 1,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: `<table class="e-rte-table" style="width: 50%; min-width: 0px; height: 150px;">
                        <tbody>
                            <tr>
                                <td style="width: 33.3333%;">Cell 1</td>
                                <td style="width: 33.3333%;">Cell 2</td>
                                <td style="width: 33.3333%;">Cell 3</td>
                            </tr>
                            <tr>
                                <td style="width: 33.3333%;">Cell 4</td>
                                <td style="width: 33.3333%;">Cell 5</td>
                                <td style="width: 33.3333%;">Cell 6</td>
                            </tr>
                        </tbody>
                    </table>`
            });
            rteEle = editor.element;
        });

        afterAll(() => {
            destroy(editor);
        });

        it('should resize table width using column resize handles', (done: DoneFn) => {
            editor.focusOut();
            let activeElement = document.activeElement;
            const table = editor.contentModule.getEditPanel().querySelector('table') as HTMLTableElement;
            const initialWidth = table.offsetWidth;
            (editor.tableModule as any).tableObj.resizeHelper({ target: table, preventDefault: function () { } });
            const columnHandle = editor.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0] as HTMLElement;
            expect(columnHandle).not.toBeNull();
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            columnHandle.dispatchEvent(mouseDownEvent);
            (editor.tableModule as any).tableObj.resizeStart(mouseDownEvent);
            (editor.tableModule as any).tableObj.resizing({
                target: columnHandle,
                pageX: initialWidth + 50, // Move 50px to right
                pageY: 0,
                preventDefault: function () { }
            });
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(mouseUpEvent);
            expect(activeElement).not.toBe(document.activeElement);
            done();
        });
    });
});
