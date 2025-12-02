import { Tooltip } from "@syncfusion/ej2-popups";
import { EditorManager, RichTextEditor } from "../../src";
import { IEditorModel } from '../../src/common/interface'
import { renderRTE, destroy } from "./render.spec";
import { Component, getComponent } from "@syncfusion/ej2-base";
import { DropDownButton } from "@syncfusion/ej2-splitbuttons";
import { BASIC_MOUSE_EVENT_INIT } from "../constant.spec";


describe('Memory leak testing ', () => {
    describe('Toolbar module destroy ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
        });

        it('Should destroy the Toolbar and Base toolbar Module', () => {
            expect(editor.toolbarModule.baseToolbar).not.toBeNull();
            expect(editor.toolbarModule.dropDownModule).not.toBeNull();
            expect(editor.toolbarModule.colorPickerModule).not.toBeNull();
            expect(editor.toolbarModule.isDestroyed).not.toBe(true);
            editor.toolbarModule.destroy();
            expect(editor.toolbarModule.baseToolbar).toBeNull();
            expect(editor.toolbarModule.dropDownModule).toBeNull();
            expect(editor.toolbarModule.colorPickerModule).toBeNull();
            expect(editor.toolbarModule.isDestroyed).toBe(true);
        });
    });

    describe('Quick Toolbar module destroy ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
        });

        it('Should destroy the Toolbar and Base toolbar Module', () => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            expect(editor.quickToolbarModule.linkQTBar.isDestroyed).not.toBe(true);
            expect(editor.quickToolbarModule.audioQTBar.isDestroyed).not.toBe(true);
            expect(editor.quickToolbarModule.videoQTBar.isDestroyed).not.toBe(true);
            expect(editor.quickToolbarModule.imageQTBar.isDestroyed).not.toBe(true);
            expect(editor.quickToolbarModule.tableQTBar.isDestroyed).not.toBe(true);
            expect(editor.quickToolbarModule.isDestroyed).not.toBe(true);
            editor.quickToolbarModule.destroy();
            expect(editor.quickToolbarModule.linkQTBar.isDestroyed).toBe(true);
            expect(editor.quickToolbarModule.audioQTBar.isDestroyed).toBe(true);
            expect(editor.quickToolbarModule.videoQTBar.isDestroyed).toBe(true);
            expect(editor.quickToolbarModule.imageQTBar.isDestroyed).toBe(true);
            expect(editor.quickToolbarModule.tableQTBar.isDestroyed).toBe(true);
            expect(editor.quickToolbarModule.isDestroyed).toBe(true);
        });
    });

    describe('Toolbar Tooltip destroy ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should destroy the Tooltip component on the Toolbar destroy method.', () => {
            const tooltip: Tooltip = getComponent(editor.element.querySelector('.e-toolbar-wrapper') as HTMLElement, 'tooltip');
            expect(tooltip.isDestroyed).toBe(false);
            editor.toolbarModule.destroy();
            expect(tooltip.isDestroyed).toBe(true);
        });
    });

    describe('Toolbar Dropdown destroy ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should destroy the Dropdown component on the Toolbar destroy method.', () => {
            const dropdown: DropDownButton = getComponent(editor.element.querySelector('.e-dropdown-btn.e-formats-tbar-btn') as HTMLElement, 'dropdown-btn');
            expect(dropdown.isDestroyed).toBe(false);
            editor.toolbarModule.destroy();
            expect(dropdown.isDestroyed).toBe(true);
        });
    });

    describe('Rich Text Editor Events destroy ', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should unwire the events on destroy method call', () => {
            const inputElement: HTMLElement = editor.inputElement;
            const eventList: any = (editor.inputElement as any).__eventList;
            expect(eventList.length).not.toBe(0);
            expect((editor as any).onFocusHandler).not.toBeNull();
            expect((editor as any).onBlurHandler).not.toBeNull();
            expect((editor as any).onResizeHandler).not.toBeNull();
            editor.destroy();
            if ((inputElement as any).__eventList.events.length !== 0) {
                throw new Error('Memory leak detected, '+ (inputElement as any).__eventList.events[0].name + 'event is not removed');
            }
            expect((inputElement as any).__eventList.events.length).toBe(0);
            expect((editor as any).onFocusHandler).toBeNull();
            expect((editor as any).onBlurHandler).toBeNull();
            expect((editor as any).onResizeHandler).toBeNull();
        });
    });

    describe('Editor manager destroy ', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({});
        });
        afterEach(() => {
            destroy(editor);
        });
        it ('Should destroy the editor manager', () => {
            expect(editor.formatter.editorManager.currentDocument).not.toBeNull();
            editor.formatter.editorManager.destroy();
            expect(editor.formatter.editorManager.currentDocument).toBeNull();
        });
        it ('Should destroy the editor manager for coverage', () => {
            expect(editor.formatter.editorManager.currentDocument).not.toBeNull();
            let editorManager: any = editor.formatter.editorManager;
            editorManager.editableElement = null;
            editorManager.nodeCutter = null;
            editorManager.domNode = null;
            editorManager.listObj = null;
            editorManager.nodeCutter = null;
            editorManager.formatObj = null;
            editorManager.alignmentObj = null;
            editorManager.indentsObj = null;
            editorManager.linkObj = null;
            editorManager.imageObj = null;
            editorManager.audioObj = null;
            editorManager.videoObj = null;
            editorManager.selectionObj = null;
            editorManager.inserthtmlObj = null;
            editorManager.insertTextObj = null;
            editorManager.clearObj = null;
            editorManager.tableObj = null;
            editorManager.msWordPaste = null;
            editorManager.formatPainterEditor = null;
            editorManager.emojiPickerObj = null;
            editorManager.tableCellSelection = null;
            editor.formatter.editorManager.currentDocument = null;
            editor.formatter.editorManager.destroy();
            expect(editor.formatter.editorManager.currentDocument).toBeNull();
        });
    });

    describe('Generic sub components destroy ', () => {
        let editor: RichTextEditor;
        let instanceArray: Component<HTMLElement>[] = [];

        function recordInstaces(): void {
            const childEle: NodeListOf<Element> = document.querySelectorAll('.e-control');
            for (let i: number = 0; i < childEle.length; i++) {
                const currentEle: Element = childEle[i];
                if (currentEle.classList.contains('e-lib')) {
                    if ((currentEle as any).ej2_instances) {
                        if ((currentEle as any).ej2_instances.length > 0) {
                            for (let j: number = 0; j < (currentEle as any).ej2_instances.length; j++) {
                                instanceArray.push((currentEle as any).ej2_instances[j]);
                            }
                        }
                    }
                }
            }
        }

        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', '|','Bold', 'Italic', 'Underline', 'StrikeThrough', 'SuperScript', 'SubScript', '|',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                        'LowerCase', 'UpperCase', '|',
                        'Formats', 'Alignments', 'Blockquote', '|', 'NumberFormatList', 'BulletFormatList', '|',
                        'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                        '|', 'EmojiPicker', 'Print', '|',
                        'SourceCode', 'FullScreen']
                },
                showCharCount: true,
                placeholder: 'Type something',
                pasteCleanupSettings: { keepFormat: true },
            });
        });
        it('Should destroy the sub components properly after interactions with the editor.', () => {
            // do interactions
            editor.focusIn();
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            recordInstaces();
            destroy(editor);
            setTimeout(() => {
                for (let i: number = 0; i < instanceArray.length; i++) {
                    const currentInstance: Component<HTMLElement> = instanceArray[i as number];
                    if (currentInstance && !currentInstance.isDestroyed) {
                        throw new Error('Memory leak detected, ' + (currentInstance as any).getModuleName() + ' instance is not destroyed');
                    }
                    expect(currentInstance.isDestroyed).toBe(true);
                }
            }, 200);
        });
    });
});