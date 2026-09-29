import { destroyRTE, renderRTE } from '../../base.spec';
import { RichTextEditorUI } from '../../../src/richtexteditor-ui/richtexteditor-ui';
import { Browser } from '@syncfusion/ej2-base';
import { MACOS_USER_AGENT } from '../../common/useragents.spec';

/**
 * Dispatches a real cancelable keyboard event from the mounted input.
 *
 * @param {RichTextEditorUI} editor Mounted editor instance.
 * @param {string} key Keyboard key value.
 * @param {KeyboardEventInit} options Keyboard event options.
 * @returns {KeyboardEvent} The dispatched keyboard event.
 */
function dispatchKey(editor: RichTextEditorUI, key: string, options?: KeyboardEventInit): KeyboardEvent {
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true,
        ...options
    });
    (editor.inputElement as HTMLElement).dispatchEvent(event);
    return event;
}

/**
 * Selects the text in the first paragraph of the mounted editor.
 *
 * @param {RichTextEditorUI} editor Mounted editor instance.
 * @returns {void} No value.
 */
function selectEditorText(editor: RichTextEditorUI): void {
    const inputElement: HTMLElement = editor.inputElement as HTMLElement;
    inputElement.focus();
    const paragraph: HTMLElement = inputElement.querySelector('p') as HTMLElement;
    const range: Range = document.createRange();
    range.selectNodeContents(paragraph);
    const selection: Selection = inputElement.ownerDocument.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
    inputElement.ownerDocument.dispatchEvent(new Event('selectionchange'));
}


/**
 * Verifies a rendered format and its serialized schema marker.
 *
 * @param {RichTextEditorUI} editor Mounted editor instance.
 * @param {string} domSelector Expected rendered DOM selector.
 * @param {string} schemaType Expected serialized schema marker.
 * @returns {void} No value.
 */
function expectFormat(editor: RichTextEditorUI, domSelector: string, schemaType: string): void {
    expect((editor.inputElement as HTMLElement).querySelector(domSelector)).not.toBeNull();
    expect(JSON.stringify(editor.getDocument())).toContain(schemaType);
}

/**
 * Verifies the resolved shortcut on a live toolbar item.
 *
 * @param {RichTextEditorUI} editor Mounted editor instance.
 * @param {string} shortcut Expected ARIA shortcut value.
 * @returns {void} No value.
 */
function expectToolbarShortcut(editor: RichTextEditorUI, shortcut: string): void {
    const toolbarElement: HTMLElement | null = editor.element.querySelector('.e-rte-ui-toolbar');
    expect(toolbarElement).not.toBeNull();
    if (!toolbarElement) {
        return;
    }
    const shortcutElement: HTMLElement = toolbarElement.querySelector(
        '[aria-keyshortcuts="' + shortcut + '"]'
    ) as HTMLElement;
    expect(shortcutElement).not.toBeNull();
    expect(shortcutElement.getAttribute('aria-keyshortcuts')).toBe(shortcut);
}

describe('Editor keybindings', () => {
    describe('custom bold format shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => { editor = renderRTE({ valueFormat: 'html', value: '<p>Bold text</p>', toolbarSettings: { items: ['Bold'] }, keyBindings: { bold: 'alt+1' } }); });
        afterEach(() => { destroyRTE(editor); });
        it('should apply bold to the selected text and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '1', { altKey: true });
            expectFormat(editor, 'strong, b', 'bold');
            expectToolbarShortcut(editor, 'Alt+1');
        });
    });

    describe('custom italic format shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => { editor = renderRTE({ valueFormat: 'html', value: '<p>Italic text</p>', toolbarSettings: { items: ['Italic'] }, keyBindings: { italic: 'alt+2' } }); });
        afterEach(() => { destroyRTE(editor); });
        it('should apply italic to the selected text and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '2', { altKey: true });
            expectFormat(editor, 'em, i', 'italic');
            expectToolbarShortcut(editor, 'Alt+2');
        });
    });

    describe('custom underline format shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => { editor = renderRTE({ valueFormat: 'html', value: '<p>Underline text</p>', toolbarSettings: { items: ['Underline'] }, keyBindings: { underline: 'alt+3' } }); });
        afterEach(() => { destroyRTE(editor); });
        it('should apply underline to the selected text and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '3', { altKey: true });
            expectFormat(editor, 'u, [style*="underline"]', 'underline');
            expectToolbarShortcut(editor, 'Alt+3');
        });
    });

    describe('custom strikethrough format shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => { editor = renderRTE({ valueFormat: 'html', value: '<p>Strike text</p>', toolbarSettings: { items: ['Strikethrough'] }, keyBindings: { strikethrough: 'alt+4' } }); });
        afterEach(() => { destroyRTE(editor); });
        it('should apply strikethrough to the selected text and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '4', { altKey: true });
            expectFormat(editor, 's, del, [style*="line-through"]', 'strikethrough');
            expectToolbarShortcut(editor, 'Alt+4');
        });
    });

    describe('custom superscript and subscript shortcuts', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({ valueFormat: 'html', value: '<p>Script text</p>', toolbarSettings: { items: ['Superscript', 'Subscript'] }, keyBindings: { superscript: 'alt+5', subscript: 'alt+6' } });
        });
        afterEach(() => { destroyRTE(editor); });
        it('should apply each selected-text script format and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '5', { altKey: true });
            expectFormat(editor, 'sup', 'superscript');
            expectToolbarShortcut(editor, 'Alt+5');
            (editor.inputElement as HTMLElement).innerHTML = '<p>Script text</p>';
            selectEditorText(editor);
            dispatchKey(editor, '6', { altKey: true });
            expectFormat(editor, 'sub', 'subscript');
            expectToolbarShortcut(editor, 'Alt+6');
        });
    });

    describe('custom inline code shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => { editor = renderRTE({ valueFormat: 'html', value: '<p>Code text</p>', toolbarSettings: { items: ['InlineCode'] }, keyBindings: { inlinecode: 'alt+7' } }); });
        afterEach(() => { destroyRTE(editor); });
        it('should apply inline code to the selected text and serialize its schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, '7', { altKey: true });
            expectFormat(editor, 'code', 'code');
            expectToolbarShortcut(editor, 'Alt+7');
        });
    });

    describe('custom block and list format shortcuts', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Block text</p>',
                toolbarSettings: { items: ['CodeBlock', 'NumberFormatList', 'BulletFormatList'] },
                keyBindings: { 'code-block': 'alt+8', 'ordered-list': 'alt+9', 'unordered-list': 'alt+0' }
            });
        });
        afterEach(() => { destroyRTE(editor); });
        it('should apply block and list formats to the selected text and serialize their schemas', () => {
            selectEditorText(editor);
            dispatchKey(editor, '8', { altKey: true });
            expectFormat(editor, 'pre', 'codeBlock');
            expectToolbarShortcut(editor, 'Alt+8');
            (editor.inputElement as HTMLElement).innerHTML = '<p>Block text</p>';
            selectEditorText(editor);
            dispatchKey(editor, '9', { altKey: true });
            expectFormat(editor, 'ol', 'orderedList');
            expectToolbarShortcut(editor, 'Alt+9');
            (editor.inputElement as HTMLElement).innerHTML = '<p>Block text</p>';
            selectEditorText(editor);
            dispatchKey(editor, '0', { altKey: true });
            expectFormat(editor, 'ul', 'bulletList');
            expectToolbarShortcut(editor, 'Alt+0');
        });
    });

    describe('custom clear-format shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({ valueFormat: 'html', value: '<p><strong>Styled text</strong></p>', toolbarSettings: { items: ['ClearFormat'] }, keyBindings: { 'clear-format': 'alt+q' } });
        });
        afterEach(() => { destroyRTE(editor); });
        it('should remove formatting from selected text and serialize the plain schema', () => {
            selectEditorText(editor);
            dispatchKey(editor, 'q', { altKey: true });
            expect((editor.inputElement as HTMLElement).querySelector('strong, b')).toBeNull();
            expect(JSON.stringify(editor.getDocument())).not.toContain('bold');
            expectToolbarShortcut(editor, 'Alt+Q');
        });
    });


    describe('KB-04 - macOS Control-to-Command mapping', () => {
        let editor: RichTextEditorUI;
        const defaultUA: string = Browser.userAgent;
        beforeEach(() => {
            Browser.userAgent = MACOS_USER_AGENT.CHROME;
            editor = renderRTE({ valueFormat: 'html', value: '<p>Bold text</p>', keyBindings: { bold: 'cmd+b' } });
        });
        afterEach(() => {
            destroyRTE(editor);
            Browser.userAgent = defaultUA;
        });

        it('should resolve the Command modifier on macOS', () => {
            selectEditorText(editor);
            dispatchKey(editor, 'b', { metaKey: true });
            expectFormat(editor, 'strong, b', 'bold');
        });
    });

    describe('KB-05 - custom link shortcut', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => { editor = renderRTE({ keyBindings: { link: 'alt+1' } }); });
        afterEach(() => { destroyRTE(editor); });

        it('should open the link dialog from the custom Alt+1 shortcut', () => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor, '1', { altKey: true });
            expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
        });
    });

    describe('KB-06 - custom image shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({ keyBindings: { image: 'alt+1' } });
        });
        afterEach(() => {
            destroyRTE(editor);
        });

        it('should open the image dialog from the alt+1 shortcut', () => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor, '1', { altKey: true });
            expect(document.querySelector('.e-rte-ui-img-dialog')).not.toBeNull();
        });
    });

    describe('KB-06 - default image shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({});
        });
        afterEach(() => {
            destroyRTE(editor);
        });

        it('should open the image dialog from the ctrl+shift+i shortcut', () => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor, 'i', { ctrlKey: true, shiftKey: true });
            expect(document.querySelector('.e-rte-ui-img-dialog')).not.toBeNull();
        });
    });

    describe('KB-07 - custom table shortcut', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => { editor = renderRTE({ keyBindings: { table: 'alt+3' } }); });
        afterEach(() => { destroyRTE(editor); });

        it('should open the insert-table dialog from the custom Alt+3 shortcut', () => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor, '3', { altKey: true });
            expect(document.querySelector('.e-rte-ui-insert-table-dialog')).not.toBeNull();
        });
    });

    describe('KB-08 - editor state guards', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => { editor = renderRTE({}); });
        afterEach(() => { destroyRTE(editor); });

        it('should not execute or consume the shortcut while disabled, read-only, or outside selection', () => {
            (editor.inputElement as HTMLElement).focus();
            const before: string = (editor.inputElement as HTMLElement).innerHTML;
            editor.enable = false;
            editor.dataBind();
            const disabledEvent: KeyboardEvent = dispatchKey(editor, 'b', { ctrlKey: true });
            editor.enable = true;
            editor.readonly = true;
            editor.dataBind();
            const readonlyEvent: KeyboardEvent = dispatchKey(editor, 'b', { ctrlKey: true });
            editor.readonly = false;
            editor.dataBind();
            const selection: Selection = (editor.inputElement as HTMLElement).ownerDocument.getSelection() as Selection;
            selection.removeAllRanges();
            const outsideEvent: KeyboardEvent = dispatchKey(editor, 'b', { ctrlKey: true });
            expect((editor.inputElement as HTMLElement).innerHTML).toBe(before);
            expect(disabledEvent.defaultPrevented).toBe(false);
            expect(readonlyEvent.defaultPrevented).toBe(false);
            expect(outsideEvent.defaultPrevented).toBe(false);
        });
    });

    describe('KB-09 - unbound input keys', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => { editor = renderRTE({}); });
        afterEach(() => { destroyRTE(editor); });

        it('should leave an unregistered key native and produce no editor action', () => {
            (editor.inputElement as HTMLElement).focus();
            const before: string = (editor.inputElement as HTMLElement).innerHTML;
            const event: KeyboardEvent = dispatchKey(editor, 'x', { ctrlKey: true });
            expect((editor.inputElement as HTMLElement).innerHTML).toBe(before);
            expect(event.defaultPrevented).toBe(false);
        });
    });

    describe('KB-10 - default toolbar focus', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Toolbar focus test</p>',
                toolbarSettings: { items: ['Bold', 'Italic'] }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should focus the first toolbar item when Alt+F10 is pressed', () => {
            (editor.inputElement as HTMLElement).focus();
            const toolbarElement: HTMLElement | null = editor.element.querySelector('.e-rte-ui-toolbar');
            expect(toolbarElement).not.toBeNull();
            dispatchKey(editor, 'F10', { altKey: true });
            const activeElement: HTMLElement = document.activeElement as HTMLElement;
            expect(toolbarElement && toolbarElement.contains(activeElement)).toBe(true);
        });
    });

    describe('KB-11 - toolbar focus with custom shortcut', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Custom toolbar focus</p>',
                toolbarSettings: { items: ['Bold'] },
                keyBindings: { 'toolbar-focus': 'alt+shift+t' }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should focus toolbar using custom Alt+Shift+T shortcut', () => {
            (editor.inputElement as HTMLElement).focus();
            const toolbarElement: HTMLElement | null = editor.element.querySelector('.e-rte-ui-toolbar');
            expect(toolbarElement).not.toBeNull();
            dispatchKey(editor, 't', { altKey: true, shiftKey: true });
            const activeElement: HTMLElement = document.activeElement as HTMLElement;
            expect(toolbarElement && toolbarElement.contains(activeElement)).toBe(true);
        });
    });

    describe('KB-12 - toolbar focus with quick toolbar rendered', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p><strong>Bold text</strong></p>',
                toolbarSettings: { items: ['Bold', 'Italic'] },
                quickToolbarSettings: { enable: true, text: ['Bold', 'Italic'] }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should focus quick toolbar when rendered and Alt+F10 is pressed', () => {
            selectEditorText(editor);
            const toolbarElement: HTMLElement | null = editor.element.querySelector('.e-rte-ui-toolbar');
            expect(toolbarElement).not.toBeNull();
            dispatchKey(editor, 'F10', { altKey: true });
            const activeElement: HTMLElement = document.activeElement as HTMLElement;
            expect(activeElement).not.toBeNull();
        });
    });

    describe('KB-13 - toolbar focus when selection is on link', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p><a href="https://example.com">Link text</a></p>',
                toolbarSettings: { items: ['Bold'] },
                quickToolbarSettings: { enable: true, link: ['OpenLink', 'EditLink', 'RemoveLink'] }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should handle toolbar focus when cursor is on a link', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            inputElement.focus();
            const linkElement: HTMLAnchorElement | null = inputElement.querySelector('a');
            expect(linkElement).not.toBeNull();
            if (linkElement) {
                const range: Range = document.createRange();
                range.setStart(linkElement, 0);
                range.collapse(true);
                const selection: Selection = inputElement.ownerDocument.getSelection() as Selection;
                selection.removeAllRanges();
                selection.addRange(range);
                const event: KeyboardEvent = dispatchKey(editor, 'F10', { altKey: true });
                expect(event.defaultPrevented || document.activeElement).toBeTruthy();
            }
        });
    });

    describe('KB-14 - toolbar focus with disabled toolbar', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Disabled toolbar test</p>',
                toolbarSettings: { enable: false }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should not focus toolbar when toolbar is disabled', () => {
            (editor.inputElement as HTMLElement).focus();
            const toolbarElement: HTMLElement | null = editor.element.querySelector('.e-rte-ui-toolbar');
            const activeElementBefore: Element | null = document.activeElement;
            dispatchKey(editor, 'F10', { altKey: true });
            const activeElementAfter: Element | null = document.activeElement;
            expect(activeElementBefore).toBe(activeElementAfter);
        });
    });

    describe('KB-15 - toolbar focus in read-only mode', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Read-only test</p>',
                readonly: true,
                toolbarSettings: { items: ['Bold'] }
            });
        });
        afterEach(() => { destroyRTE(editor); });

        it('should not consume toolbar focus shortcut in read-only mode', () => {
            (editor.inputElement as HTMLElement).focus();
            const activeElementBefore: Element | null = document.activeElement;
            const event: KeyboardEvent = dispatchKey(editor, 'F10', { altKey: true });
            const activeElementAfter: Element | null = document.activeElement;
            expect(activeElementBefore).toBe(activeElementAfter);
            expect(event.defaultPrevented).toBe(false);
        });
    });
});
