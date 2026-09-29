import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('readonly property', () => {
    describe('should keep toolbar items enabled when readonly is false on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ readonly: false });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should render the editor in editable mode', () => {
            expect(editor.readonly).toBe(false);
            expect(editor.inputElement.getAttribute('contenteditable')).toBe('true');
        });
    });

    describe('should disable toolbar items when readonly is true on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ readonly: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should render the editor in read-only mode', () => {
            const toolbarElement: HTMLElement = editor.getToolbarElement() as HTMLElement;
            const toolbarItems: HTMLElement[] = Array.from(toolbarElement.querySelectorAll('.e-toolbar-item'));
            expect(editor.readonly).toBe(true);
            expect(editor.inputElement.getAttribute('contenteditable')).toBe('false');
            expect(toolbarItems.length > 0).toBe(true);
            expect(editor.element.querySelector('.e-rte-ui-toolbar').classList.contains('e-overlay'));
        });
    });

    describe('should update toolbar items when readonly changes at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ readonly: false });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should call toolbar renderer to disable items when readonly becomes true', () => {
            editor.readonly = true;
            editor.dataBind();
            expect(editor.readonly).toBe(true);
            expect(editor.inputElement.getAttribute('contenteditable')).toBe('false');
        });
    });

    describe('should update toolbar items when readonly is false on runtime changes at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ readonly: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should call toolbar renderer to disable items when readonly becomes true', () => {
            editor.readonly = false;
            editor.dataBind();
            expect(editor.readonly).toBe(false);
            expect(editor.inputElement.getAttribute('contenteditable')).toBe('true');
            const toolbarElement: HTMLElement = editor.getToolbarElement() as HTMLElement;
            const toolbarItems: HTMLElement[] = Array.from(toolbarElement.querySelectorAll('.e-toolbar-item'));
            expect(toolbarItems.length > 0).toBe(true);
            expect(toolbarItems.every((item: HTMLElement) =>
                item.classList.contains('e-overlay')
            )).toBe(false);
        });
    });

    describe('Readonly - closes Quick Toolbar when enabled dynamically', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                readonly: false,
                valueFormat: 'html',
                value: '<p>This is sample text</p>',
                quickToolbarSettings: {
                    enable: true,
                    text: ['Bold', 'Italic']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should close the Quick Toolbar when readonly is enabled dynamically', (done) => {
            const paragraph: HTMLElement = editor.inputElement.querySelector('p') as HTMLElement;
            const textNode: Text = paragraph.firstChild as Text;
            const range: Range = document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(textNode, 4);
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            editor.inputElement.focus();
            editor.inputElement.ownerDocument.dispatchEvent(new Event('selectionchange'));
            editor.inputElement.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true
            }));
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.querySelector('.e-rte-ui-quick-toolbar') as HTMLElement;
                expect(quickToolbar).not.toBeNull();
                editor.readonly = true;
                editor.dataBind();
                expect(editor.readonly).toBe(true);
                expect(
                    document.querySelector('.e-rte-ui-quick-toolbar:not(.e-popup-close)')
                ).toBeNull();
                done();
            }, 100);
        });
    });

    describe('Readonly - closes open dialogs when enabled dynamically', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                readonly: false,
                valueFormat: 'html',
                value: '<p>This is sample text</p>'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        const expectDialogToCloseWhenReadonlyIsEnabled: (
            toolbarItemName: string, dialogSelector: string, done: DoneFn
        ) => void = (
            toolbarItemName: string, dialogSelector: string, done: DoneFn
        ): void => {
            const toolbarItem: HTMLElement = editor.element.querySelector(
                '.e-toolbar-item[title^="' + toolbarItemName + '"]'
            ) as HTMLElement;
            expect(toolbarItem).not.toBeNull();
            editor.inputElement.focus();
            toolbarItem.click();

            setTimeout(() => {
                const dialog: HTMLElement = document.querySelector(dialogSelector) as HTMLElement;
                expect(dialog).not.toBeNull();
                expect(dialog.classList.contains('e-popup-open')).toBe(true);

                editor.readonly = true;
                editor.dataBind();

                expect(editor.readonly).toBe(true);
                expect(document.querySelector(dialogSelector + '.e-popup-open')).toBeNull();
                done();
            }, 200);
        };

        it('should close the Link dialog when readonly is enabled dynamically', (done: DoneFn) => {
            expectDialogToCloseWhenReadonlyIsEnabled('Link (Ctrl+K)', '.e-rte-ui-link-dialog', done);
        });

        it('should close the Image dialog when readonly is enabled dynamically', (done: DoneFn) => {
            expectDialogToCloseWhenReadonlyIsEnabled('Image (Ctrl+Shift+I)', '.e-rte-ui-img-dialog', done);
        });

        it('should close the Table dialog when readonly is enabled dynamically', (done: DoneFn) => {
            editor.inputElement.focus();
            const toolbarItem: HTMLElement = editor.toolbarModule.element.querySelector(
                '#' + editor.element.id + '_toolbar_Table'
            ) as HTMLElement;
            expect(toolbarItem).not.toBeNull();
            toolbarItem.click();

            setTimeout(() => {
                const insertTableButton: HTMLElement = document.querySelector(
                    '.e-insert-table-btn'
                ) as HTMLElement;
                expect(insertTableButton).not.toBeNull();
                insertTableButton.click();

                setTimeout(() => {
                    const dialog: HTMLElement = document.querySelector(
                        '.e-rte-ui-insert-table-dialog'
                    ) as HTMLElement;
                    expect(dialog).not.toBeNull();
                    expect(dialog.classList.contains('e-popup-open')).toBe(true);

                    editor.readonly = true;
                    editor.dataBind();

                    expect(editor.readonly).toBe(true);
                    expect(document.querySelector(
                        '.e-rte-ui-insert-table-dialog.e-popup-open'
                    )).toBeNull();
                    done();
                }, 200);
            }, 200);
        });
    });
});
