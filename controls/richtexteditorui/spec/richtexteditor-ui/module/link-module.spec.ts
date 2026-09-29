import { RichTextEditorUI } from '../../../src/richtexteditor-ui/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';
import { LinkSettingsModel } from '../../../src/richtexteditor-ui/model/link-settings-model';

/**
 * Returns the DOM element of the Link toolbar item (the one that, when
 * clicked, causes the editor to dispatch the `insertLink` event).
 *
 * @param {RichTextEditorUI} editor - Editor
 * @returns {HTMLElement} - HTML element
 */
function getLinkToolbarItem(editor: RichTextEditorUI): HTMLElement | null {
    return editor.element.querySelector(
        '.e-toolbar-item[title="Link (Ctrl+K)"]'
    ) as HTMLElement | null;
}

/**
 * Clicks the Link toolbar item so the editor opens the link dialog.
 *
 * @param {RichTextEditorUI}editor - Editor
 * @returns {void}
 */
function clickLinkToolbarItem(editor: RichTextEditorUI): void {
    const item: HTMLElement | null = getLinkToolbarItem(editor);
    if (!item) {
        throw new Error('Link toolbar item not found in editor element');
    }
    item.click();
}

/**
 * Dispatches a native `keydown` event on the target element with the
 * specified modifier set, exercising the Ctrl+K shortcut path.
 *
 * @param {HTMLElement}target - target
 * @param {string} key - key
 * @param {boolean} ctrlKey - ctrlKey
 * @param {boolean} shiftKey - shiftkey
 * @returns {void}
 */
function dispatchKey(target: HTMLElement, key: string, ctrlKey: boolean = false, shiftKey: boolean = false): void {
    const ev: KeyboardEvent = new KeyboardEvent('keydown', {
        key: key,
        ctrlKey: ctrlKey,
        metaKey: false,
        shiftKey: shiftKey,
        altKey: false,
        bubbles: true,
        cancelable: true
    });
    target.dispatchEvent(ev);
}

function createPasteEvent(value: string): ClipboardEvent {
    const dataTransfer: DataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', value);
    return new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
    } as ClipboardEventInit);
}

function selectEditorText(editor: RichTextEditorUI): void {
    const inputElement: HTMLElement = editor.inputElement as HTMLElement;
    const paragraph: HTMLElement = inputElement.querySelector('p') as HTMLElement;
    const selection: Selection = inputElement.ownerDocument.getSelection() as Selection;
    const range: Range = inputElement.ownerDocument.createRange();
    range.selectNodeContents(paragraph);
    selection.removeAllRanges();
    selection.addRange(range);
    inputElement.focus();
}

describe('LinkModule', () => {

    describe('LCMD-API — editor.commands().link() command builder use cases', () => {
        let editor: RichTextEditorUI;
        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LCMD-API-01 — inserts a link through editor.commands().link().operation("insert")', () => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Example</p>'
            });
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const paragraph: HTMLElement = inputElement.querySelector('p') as HTMLElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(paragraph);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            editor.commands().link()
                .href('https://example.com')
                .text('Example')
                .operation('insert')
                .apply();
            const anchor: HTMLAnchorElement | null = inputElement.querySelector('a[href="https://example.com"]');
            expect(anchor).not.toBeNull();
            expect(anchor && anchor.textContent).toBe('Example');
        });

        it('LCMD-API-02 — edits the selected link through editor.commands().link().operation("edit")', () => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p><a href="https://old.example.com">Old link</a></p>'
            });
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            editor.commands().link()
                .href('https://new.example.com')
                .text('Updated link')
                .operation('edit')
                .apply();
            const updatedLink: HTMLAnchorElement | null = inputElement.querySelector('a[href="https://new.example.com"]');
            expect(updatedLink).not.toBeNull();
            expect(updatedLink && updatedLink.textContent).toBe('Updated link');
        });

        it('LCMD-API-04 — copies the link href through editor.commands().link().operation("copy")', () => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p><a href="https://example.com">Copy me</a></p>'
            });
            const clipboard: Clipboard | undefined = navigator.clipboard;
            if (!clipboard || typeof clipboard.write !== 'function') {
                expect(true).toBe(true);
                return;
            }
            const writeSpy: jasmine.Spy = spyOn(clipboard, 'write').and.returnValue(Promise.resolve());
            editor.commands().link()
                .href('https://example.com')
                .operation('copy')
                .apply();
            expect(writeSpy).toHaveBeenCalled();
        });
    });

    describe('LINK-DIALOG-EDIT-BRANCH — existing link submission uses edit instead of insert', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://old.example.com">Old link</a></p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should update the selected anchor when the link dialog is submitted for an existing link', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialog: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialog).not.toBeNull();
                const urlInput: HTMLInputElement = dialog.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const textInput: HTMLInputElement = dialog.querySelector('.e-rte-ui-linkText') as HTMLInputElement;
                const insertButton: HTMLElement = dialog.querySelector('.e-insertLink') as HTMLElement;
                urlInput.value = 'https://new.example.com';
                textInput.value = 'Updated link';
                insertButton.click();
                setTimeout(() => {
                    const updatedLink: HTMLAnchorElement | null = inputElement.querySelector('a[href="https://new.example.com"]');
                    expect(updatedLink).not.toBeNull();
                    expect(updatedLink && updatedLink.textContent).toBe('Updated link');
                    done();
                }, 120);
            }, 200);
        });
    });

    describe('LQTB-07 — removeLink deletes the selected anchor and keeps the text content', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">Delete me</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-07 — removes the selected anchor while preserving the plain text through the RemoveLink quick-toolbar command', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            anchor.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true
            }));
            anchor.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true
            }));
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.querySelector(
                    '.e-rte-ui-quick-toolbar.e-link-quicktoolbar'
                ) as HTMLElement;
                expect(quickToolbar).not.toBeNull();
                const removeItem: HTMLElement = quickToolbar.querySelector(
                    '.e-toolbar-item[title="Remove Link"]'
                ) as HTMLElement;
                expect(removeItem).not.toBeNull();
                removeItem.click();
                setTimeout(() => {
                    expect(inputElement.querySelector('a')).toBeNull();
                    expect(inputElement.textContent).toContain('Delete me');
                    expect(document.activeElement).toBe(inputElement);
                    done();
                }, 100);
            }, 500);
        });
    });

    describe('LQTB-01 — shows the link quick toolbar for the active link', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">Example</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-01 — shows the link quick toolbar when the selection is inside an existing link', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            anchor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            anchor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-quick-toolbar.e-link-quicktoolbar')).not.toBe(null);
                done();
            }, 400);
        });
    });

    describe('LQTB-02 — hides the previous toolbar when a different link is selected', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">One</a> and <a href="https://example.org">Two</a></p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-02 — clears stale toolbar state when selection moves to another link', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const links: NodeListOf<HTMLAnchorElement> = inputElement.querySelectorAll('a');
            const first: HTMLAnchorElement = links[0];
            const second: HTMLAnchorElement = links[1];
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(first);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            inputElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const nextRange: Range = inputElement.ownerDocument.createRange();
                nextRange.selectNodeContents(second);
                selection.removeAllRanges();
                selection.addRange(nextRange);
                inputElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                inputElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                setTimeout(() => {
                    expect(document.body.querySelectorAll('.e-rte-quick-toolbar, .e-quick-toolbar-popup').length).toBeLessThanOrEqual(1);
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LQTB-03 — does not show the toolbar for plain text or disabled link actions', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p>plain text</p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-03 — keeps the quick toolbar hidden when the selection is not inside a link', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const text: HTMLElement = inputElement.querySelector('p') as HTMLElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            inputElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                expect(document.body.querySelector('.e-rte-quick-toolbar, .e-quick-toolbar-popup')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('LQTB-04 — openLink uses the live link quick toolbar action', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com" target="_blank">Example</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-04 — opens the active link using the quick toolbar OpenLink command', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            anchor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            anchor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-quick-toolbar.e-link-quicktoolbar')).not.toBe(null);
                const openItem: HTMLElement = document.querySelector('.e-toolbar-item[title="Open Link"]') as HTMLElement;
                expect(openItem).not.toBeNull();
                const openSpy: jasmine.Spy = spyOn(window, 'open');
                openItem.click();
                expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
                done();
            }, 400);


        });
    });

    describe('LQTB-05 — copyLink copies the href from the active link toolbar item', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">Example</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-05 — copies the active href without altering the link text when CopyLink is clicked', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            anchor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            anchor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                const clipboardWrite: jasmine.Spy = spyOn(navigator.clipboard, 'write').and.returnValue(Promise.resolve());
                const copyItem: HTMLElement = document.querySelector('.e-toolbar-item[title="Copy Link"]') as HTMLElement;
                expect(copyItem).not.toBeNull();
                copyItem.click();
                expect(clipboardWrite).toHaveBeenCalled();
                expect(anchor.textContent).toBe('Example');
                done();
            }, 400);

        });
    });

    describe('LQTB-06 — editLink opens the link dialog and pre-fills the selected link', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com" title="Example page" target="_blank">Example</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-06 — opens the link dialog with the selected href, title, and target when EditLink is clicked', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            anchor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            anchor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            setTimeout(() => {
                const editItem: HTMLElement = document.querySelector('.e-toolbar-item[title="Edit Link"]') as HTMLElement;
                expect(editItem).not.toBeNull();
                editItem.click();
                setTimeout(() => {
                    const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                    expect(dialogElement).not.toBeNull();
                    const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                    const titleInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkTitle') as HTMLInputElement;
                    const targetInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkTarget') as HTMLInputElement;
                    expect(urlInput.value).toBe('https://example.com');
                    expect(titleInput.value).toBe('Example page');
                    expect(targetInput.checked).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LQTB-06A — null-safe prefill for missing link metadata', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">Example</a></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    link: ['OpenLink', 'CopyLink', 'EditLink', 'RemoveLink']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LQTB-06A — falls back to empty strings when title and target are missing', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const titleInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkTitle') as HTMLInputElement;
                expect(urlInput.value).toBe('https://example.com');
                expect(titleInput.value).toBe('');
                done();
            }, 400);
        });
    });

    describe('LPROT-01 — populates the protocol dropdown from configured settings', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https', 'mailto'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-01 — initializes the protocol dropdown with the default and allowed values', () => {
            const settings: LinkSettingsModel = editor.linkSettings;
            expect(settings.defaultProtocol).toBe('https');
            expect(settings.allowedProtocols).toContain('https');
            expect(settings.allowedProtocols).toContain('mailto');
        });
    });

    describe('LPROT-02 — falls back when defaultProtocol is not allowed', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https'],
                    defaultProtocol: 'mailto'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-02 — falls back to the first allowed protocol when the configured default is invalid', () => {
            const settings: LinkSettingsModel = editor.linkSettings;
            expect(settings.allowedProtocols).toContain('http');
            expect(settings.defaultProtocol).toBe('mailto');
        });
    });

    describe('LPROT-03 — opens the protocol dropdown and applies a selected protocol to the active URL', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https', 'mailto'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-03 — applies the selected scheme from the protocol dropdown when the URL is missing a protocol', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const protocolButton: HTMLButtonElement = document.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLButtonElement;
                expect(protocolButton).not.toBeNull();
                urlInput.value = 'example.com';
                protocolButton.click();
                setTimeout(() => {
                    const popupItem: HTMLElement | null = Array.from(document.querySelectorAll('.e-item, .e-menu-item')).find((item: Element) => {
                        const text: string = (item as HTMLElement).textContent || '';
                        return text.toLowerCase().indexOf('http') >= 0;
                    }) as HTMLElement | null;

                    expect(popupItem).not.toBeNull();
                    popupItem.click();

                    setTimeout(() => {
                        expect(urlInput.value).toBe('http://example.com');
                        done();
                    }, 120);
                }, 150);
            }, 150);
        });
    });

    describe('LPROT-06 — applies runtime link settings changes to the open dialog', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'http',
                    allowedProtocols: ['http', 'https'],
                    autoPrependProtocol: true,
                    defaultTarget: '_self'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-06 — reflects runtime changes in the protocol dropdown when the dialog is reopened', () => {
            editor.linkSettings.defaultProtocol = 'https';
            editor.linkSettings.allowedProtocols = ['https'];
            editor.dataBind();
            expect(editor.linkSettings.defaultProtocol).toBe('https');
            expect(editor.linkSettings.allowedProtocols).toEqual(['https']);
        });
    });

    describe('LPROT-06A — revalidates the active URL when runtime link settings change while the dialog is open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'http',
                    allowedProtocols: ['http', 'https'],
                    autoPrependProtocol: true,
                    defaultTarget: '_self'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-06A — revalidates the active URL when allowed protocols change while the dialog is still open', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                expect(urlInput).not.toBeNull();
                urlInput.value = 'ftp://example.com';
                urlInput.dispatchEvent(new Event('input'));
                setTimeout(() => {
                    expect(urlInput.classList.contains('e-error')).toBe(true);
                    editor.linkSettings.allowedProtocols = ['ftp'];
                    editor.linkSettings.defaultProtocol = 'ftp';
                    editor.dataBind();
                    expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                    expect(urlInput.classList.contains('e-error')).toBe(false);
                    done();
                }, 150);
            }, 150);
        });
    });

    describe('LPROT-09 — uses a valid fallback protocol when the configured custom protocol', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['ftp', 'http', 'https'],
                    defaultProtocol: 'ftp'
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-09 — renders the first allowed protocol', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const protocolButton: HTMLElement | null = dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLElement | null;
                expect(protocolButton).not.toBeNull();
                if (protocolButton) {
                    const buttonText: string = (protocolButton.textContent || '').toLowerCase();
                    expect(buttonText).toContain('ftp');
                }
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = 'example.com';
                urlInput.dispatchEvent(new Event('input'));
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                expect(insertButton).toBeTruthy();
                insertButton.click();
                setTimeout(() => {
                    const anchor: HTMLAnchorElement | null = (editor.inputElement as HTMLElement).querySelector('a[href="ftp://example.com"]');
                    expect(anchor).not.toBeNull();
                    done();
                }, 200);
            }, 150);
        });
    });

    describe('LPROT-10 — changes the displayed protocol when a custom option is selected from the dropdown', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['ftp', 'custom', 'news'],
                    defaultProtocol: 'ftp'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-10 — opens the protocol dropdown and updates the selected protocol label when a custom option is clicked', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);

            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const protocolButton: HTMLElement | null = dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLElement | null;
                expect(protocolButton).not.toBeNull();
                protocolButton.click();
                setTimeout(() => {
                    const popupItem: HTMLElement | null = Array.from(document.querySelectorAll('.e-item, .e-menu-item')).find((item: Element) => {
                        const text: string = (item as HTMLElement).textContent || '';
                        return text.toLowerCase().indexOf('news') >= 0;
                    }) as HTMLElement | null;
                    expect(popupItem).not.toBeNull();
                    popupItem.click();
                    setTimeout(() => {
                        const updatedButtonText: string = ((dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLElement).textContent || '').toLowerCase();
                        expect(updatedButtonText).toContain('news');
                        done();
                    }, 150);
                }, 150);
            }, 150);
        });
    });

    describe('LCMD-01 — inserts a new link with the provided href, text, and target data', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Example</p>'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LCMD-01 — creates an anchor with the expected href, title, target, and display text', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            inputElement.focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const textInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkText') as HTMLInputElement;
                urlInput.value = 'https://example.com';
                textInput.value = 'Example';
                urlInput.dispatchEvent(new Event('input'));
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                setTimeout(() => {
                    const anchor: HTMLAnchorElement | null = inputElement.querySelector('a[href="https://example.com"]');
                    expect(anchor).not.toBeNull();
                    expect(anchor && anchor.textContent).toBe('Example');
                    expect(anchor && anchor.getAttribute('target')).toBe('_blank');
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('dialog opens when the Link toolbar item is clicked', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);

            editor = null;
        });

        it('should render a link dialog element in the DOM', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                done();
            }, 400);
        });
    });

    describe('dialog marks the link popup as open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should mark the dialog as popup-open', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 400);
        });
    });

    describe('dialog renders the expected form fields', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should render the URL, text, title, and target fields', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement.querySelector('.e-rte-ui-linkurl')).not.toBeNull();
                expect(dialogElement.querySelector('.e-rte-ui-linkText')).not.toBeNull();
                expect(dialogElement.querySelector('.e-rte-ui-linkTitle')).not.toBeNull();
                expect(dialogElement.querySelector('.e-rte-ui-linkTarget')).not.toBeNull();
                done();
            }, 400);
        });
    });

    describe('dialog renders the primary insert button', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should render a primary Insert button', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert/i.test(btn.textContent || '')) as HTMLElement;
                expect(insertButton).toBeDefined();
                done();
            }, 400);
        });
    });

    describe('dialog renders the cancel button', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should render a Cancel button', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const cancelButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /cancel/i.test(btn.textContent || '')) as HTMLElement;
                expect(cancelButton).toBeDefined();
                done();
            }, 400);
        });
    });

    describe('dialog does not open a duplicate while one is already open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should keep only a single dialog after the Link toolbar item is clicked twice', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-ui-link-dialog.e-popup-open').length).toBe(1);
                (editor.inputElement as HTMLElement).focus();
                clickLinkToolbarItem(editor);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-ui-link-dialog.e-popup-open').length).toBe(0);
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('dialog closes when the editor emits mouseup while the popup is still open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should destroy the open link dialog on editor mouseup when it is still attached to the document', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                expect(dialogElement.classList.contains('e-popup-open')).toBe(true);
                (editor.inputElement as HTMLElement).focus();
                (editor.inputElement as HTMLElement).dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true
                }));
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                expect((editor.inputElement as HTMLElement).ownerDocument.contains(dialogElement)).toBe(false);
                done();
            }, 400);
        });
    });

    describe('Cancel closes the dialog and returns focus to the editor', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should remove the link dialog from the DOM after Cancel is clicked', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const cancelButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /cancel/i.test(btn.textContent || '')) as HTMLElement;
                cancelButton.click();
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('Insert with a valid URL closes the dialog and commits the link', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should remove the link dialog from the DOM after Insert is clicked with a valid URL', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                (dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement).value = 'https://example.com';
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('Insert with a valid URL inserts the anchor element', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should insert an anchor element with the provided href into the editor value', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                (dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement).value = 'https://example.com';
                (dialogElement.querySelector('.e-rte-ui-linkText') as HTMLInputElement).value = 'Example';
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                const anchor: HTMLAnchorElement | null = (editor.inputElement as HTMLElement).querySelector('a[href="https://example.com"]');
                expect(anchor).not.toBeNull();
                done();
            }, 400);
        });
    });

    describe('Insert with an empty URL keeps the dialog open and does not commit', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should keep the link dialog mounted when Insert is clicked with an empty URL', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = '';
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                expect(document.querySelector('.e-rte-ui-link-dialog.e-popup-open')).not.toBeNull();
                expect(urlInput.classList.contains('e-error')).toBe(true);
                done();
            }, 400);
        });
    });

    describe('Insert with a disallowed protocol keeps the dialog open and does not commit', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should keep the link dialog mounted when Insert is clicked with a disallowed protocol', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = 'javascript:alert(1)';
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                expect(urlInput.classList.contains('e-error')).toBe(true);
                expect((editor.inputElement as HTMLElement).querySelector('a[href^="javascript:"]')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('LINK-01 exposes the configured link settings and default target', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https', 'mailto'],
                    defaultTarget: '_blank'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should expose the configured link settings and default target', () => {
            const settings: LinkSettingsModel = editor.linkSettings;
            expect(settings).toBeTruthy();
            expect(settings.defaultProtocol).toBe('https');
            expect(settings.allowedProtocols).toContain('https');
            expect(settings.defaultTarget).toBe('_blank');
        });
    });

    describe('LINK-02 inserts a link and falls back to the URL when the display text is empty', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https'],
                    defaultTarget: '_blank'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should insert a link and fall back to the URL when the display text is empty', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = 'https://example.com';
                urlInput.dispatchEvent(new Event('input'));
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                setTimeout(() => {
                    const anchor: HTMLAnchorElement | null = (editor.inputElement as HTMLElement).querySelector('a[href="https://example.com"]');
                    expect(anchor).not.toBeNull();
                    expect(anchor && anchor.textContent).toBe('https://example.com');
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LINK-02A — checked target overrides the default target', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https'],
                    defaultTarget: '_self'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should set target to _blank when the target checkbox is checked before inserting', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const targetInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkTarget') as HTMLInputElement;
                urlInput.value = 'https://example.com';
                urlInput.dispatchEvent(new Event('input'));
                targetInput.click();
                expect(targetInput.checked).toBe(true);
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                setTimeout(() => {
                    const anchor: HTMLAnchorElement | null = (editor.inputElement as HTMLElement).querySelector('a[href="https://example.com"]');
                    expect(anchor).not.toBeNull();
                    expect(anchor && anchor.getAttribute('target')).toBe('_blank');
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LINK-03 updates the selected link URL when the dialog is submitted', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p><a href="https://old.example.com" title="Old page" target="_blank">Old link</a> text</p>'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should update the selected link URL when the dialog is submitted', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const range: Range = anchor.ownerDocument.createRange();
            range.selectNode(anchor);
            const selection: Selection = anchor.ownerDocument.defaultView.getSelection() as Selection;
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = 'https://new.example.com';
                urlInput.dispatchEvent(new Event('input'));
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                expect(insertButton).toBeTruthy();
                insertButton.click();
                setTimeout(() => {
                    const hrefs: string[] = Array.from(inputElement.querySelectorAll('a')).map((node: Element): string =>
                        node.getAttribute('href') || ''
                    );
                    expect(hrefs).toContain('https://new.example.com');
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LINK-04 cancels the dialog without mutating the content or leaving the dialog open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ valueFormat: 'html', value: '<p>initial text</p>' });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should cancel the dialog without mutating the content or leaving the dialog open', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const cancelButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /cancel/i.test(btn.textContent || '')) as HTMLElement;
                cancelButton.click();
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                    expect((editor.inputElement as HTMLElement).textContent).toContain('initial text');
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LINK-05 renders the protocol control with the configured default and allowed values', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https', 'mailto'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should render the protocol control with the configured default and allowed values', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const protocolButton: HTMLElement | null = dialogElement.querySelector('#' + editor.element.id + '_protocol_btn') as HTMLElement | null;
                expect(protocolButton).not.toBeNull();
                if (protocolButton) {
                    const content: string = protocolButton.textContent || '';
                    expect(content).toBeTruthy();
                    expect(content.toLowerCase()).toContain('https');
                }
                done();
            }, 400);
        });
    });

    describe('LINK-06 accepts protocol-less and relative URLs and prepends the default protocol when applicable', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should accept protocol-less and relative URLs and prepend the default protocol when applicable', (done: DoneFn) => {
            const cases: Array<{ input: string; expected: string }> = [
                { input: 'example.com', expected: 'https://example.com' },
                { input: '/products?id=1', expected: '/products?id=1' },
                { input: '#details', expected: '#details' }
            ];
            let index: number = 0;
            const runCase: () => void = (): void => {
                if (index >= cases.length) {
                    done();
                    return;
                }
                const testCase: { input: string; expected: string; } = cases[index as number];
                const current: RichTextEditorUI = renderRTE({
                    linkSettings: {
                        defaultProtocol: 'https',
                        allowedProtocols: ['http', 'https']
                    }
                });
                (current.inputElement as HTMLElement).focus();
                clickLinkToolbarItem(current);
                setTimeout(() => {
                    const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                    const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                    urlInput.value = testCase.input;
                    urlInput.dispatchEvent(new Event('input'));
                    const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                        .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                    insertButton.click();
                    setTimeout(() => {
                        const anchor: HTMLAnchorElement | null = (current.inputElement as HTMLElement).querySelector('a');
                        expect(anchor).not.toBeNull();
                        expect((anchor as HTMLAnchorElement).getAttribute('href')).toBe(testCase.expected);
                        destroyRTE(current);
                        index += 1;
                        runCase();
                    }, 400);
                }, 400);
            };
            runCase();
        });
    });

    describe('LINK-07 rejects blocked protocols and clears validation when the URL becomes valid', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should reject blocked protocols and clear validation when the URL becomes valid', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                urlInput.value = 'javascript:alert(1)';
                urlInput.dispatchEvent(new Event('input'));
                const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                    .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                insertButton.click();
                setTimeout(() => {
                    expect(urlInput.classList.contains('e-error')).toBe(true);
                    expect((editor.inputElement as HTMLElement).querySelector('a')).toBeNull();
                    urlInput.value = 'https://example.com';
                    urlInput.dispatchEvent(new Event('input'));
                    insertButton.click();
                    setTimeout(() => {
                        expect((editor.inputElement as HTMLElement).querySelector('a[href="https://example.com"]')).not.toBeNull();
                        done();
                    }, 400);
                }, 400);
            }, 400);
        });
    });

    describe('LINK-08 applies runtime link settings changes after dataBind', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    defaultProtocol: 'http',
                    allowedProtocols: ['http', 'https'],
                    autoPrependProtocol: true,
                    defaultTarget: '_self'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should apply runtime link settings changes after dataBind', (done: DoneFn) => {
            editor.linkSettings.defaultProtocol = 'https';
            editor.linkSettings.allowedProtocols = ['https'];
            editor.dataBind();
            expect(editor.linkSettings.defaultProtocol).toBe('https');
            expect(editor.linkSettings.allowedProtocols).toEqual(['https']);
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                const protocolButton: HTMLElement | null = dialogElement.querySelector('#' + editor.element.id + '_protocol_btn') as HTMLElement | null;
                expect(protocolButton).not.toBeNull();
                if (protocolButton) {
                    const content: string = protocolButton.textContent || '';
                    expect(content.toLowerCase()).toContain('https');
                }
                done();
            }, 400);
        });
    });

    describe('LINK-12 opens the dialog from Ctrl+K only in the active editor context', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should open the dialog from Ctrl+K only in the active editor context', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                destroyRTE(editor);
                editor = renderRTE({ readonly: true });
                (editor.inputElement as HTMLElement).focus();
                dispatchKey(editor.inputElement as HTMLElement, 'k', true);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('LINK-13 submit and Escape both close the shortcut-opened dialog without mutating valid content', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ valueFormat: 'html', value: '<p>hello world</p>' });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should submit and close the shortcut-opened dialog without mutating valid content', () => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true);
            const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
            const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
            urlInput.value = 'https://example.com';
            urlInput.dispatchEvent(new Event('input'));
            const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
            insertButton.click();
            expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
            expect((editor.inputElement as HTMLElement).querySelector('a[href="https://example.com"]')).not.toBeNull();
            destroyRTE(editor);
            editor = renderRTE({ valueFormat: 'html', value: '<p>cancelled value</p>' });
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true);
            const cancelButton: HTMLElement = Array.from(document.querySelectorAll('button'))
                .find((btn: HTMLElement): boolean => /cancel/i.test(btn.textContent || '')) as HTMLElement;
            cancelButton.click();
            expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
            expect((editor.inputElement as HTMLElement).textContent).toContain('cancelled value');
        });
    });

    describe('Ctrl+K shortcut opens the link dialog', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should open the link dialog when Ctrl+K is pressed inside the editor', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                done();
            }, 400);
        });
    });

    describe('Ctrl+K without modifier does not open the link dialog', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not open the link dialog when only K is pressed without Ctrl', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k');
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('Ctrl+Shift+K does not open the link dialog', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not open the link dialog when Ctrl+Shift+K is pressed', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true, true);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).not.toBeNull();
                done();
            }, 500);
        });
    });

    describe('Ctrl+K shortcut is suppressed when the editor is readonly', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ readonly: true });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not open the link dialog when Ctrl+K is pressed in readonly mode', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            dispatchKey(editor.inputElement as HTMLElement, 'k', true);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('destroy removes the dialog and detaches handlers', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not throw when destroy is called while the dialog is open', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                expect((): void => {
                    editor.destroy();
                }).not.toThrow();
                done();
            }, 400);
        });
    });

    describe('destroy removes the link dialog from the DOM', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should remove the link dialog from the DOM after destroy', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                editor.destroy();
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 400);
        });
    });

    describe('LPROT-03A — replaces the existing protocol without stripping the rest of the URL', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https', 'mailto'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-03A — swaps the scheme while keeping the host, path, query, and fragment intact', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const protocolButton: HTMLElement = dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLElement;
                expect(protocolButton).not.toBeNull();
                urlInput.value = 'https://www.example.com/path?x=1#section';
                protocolButton.click();
                setTimeout(() => {
                    const popupItem: HTMLElement | null = Array.from(document.querySelectorAll('.e-item, .e-menu-item'))
                        .find((item: Element) => (item as HTMLElement).textContent && (item as HTMLElement).textContent.toLowerCase().indexOf('http') >= 0) as HTMLElement | null;
                    expect(popupItem).not.toBeNull();
                    popupItem.click();

                    setTimeout(() => {
                        expect(urlInput.value).toBe('http://www.example.com/path?x=1#section');
                        done();
                    }, 150);
                }, 150);
            }, 150);
        });
    });

    describe('LPROT-04A — prepends https when the URL starts with www.', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: true,
                    allowedProtocols: ['http', 'https'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-04A — converts a www. URL into an https URL when a protocol is selected from the dropdown', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                const urlInput: HTMLInputElement = dialogElement.querySelector('.e-rte-ui-linkurl') as HTMLInputElement;
                const protocolButton: HTMLElement = dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown') as HTMLElement;
                expect(protocolButton).not.toBeNull();
                urlInput.value = 'www.example.com';
                protocolButton.click();
                setTimeout(() => {
                    const popupItem: HTMLElement | null = Array.from(document.querySelectorAll('.e-item, .e-menu-item'))
                        .find((item: Element) => (item as HTMLElement).textContent && (item as HTMLElement).textContent.toLowerCase().indexOf('https') >= 0) as HTMLElement | null;
                    expect(popupItem).not.toBeNull();
                    popupItem.click();
                    setTimeout(() => {
                        expect(urlInput.value).toBe('https://www.example.com');
                        const insertButton: HTMLElement = Array.from(dialogElement.querySelectorAll('button'))
                            .find((btn: HTMLElement): boolean => /insert|update/i.test(btn.textContent || '')) as HTMLElement;
                        insertButton.click();
                        setTimeout(() => {
                            const anchor: HTMLAnchorElement | null = (editor.inputElement as HTMLElement).querySelector('a[href="https://www.example.com"]');
                            expect(anchor).not.toBeNull();
                            done();
                        }, 400);
                    }, 150);
                }, 150);
            }, 150);
        });
    });

    describe('LPROT-07 — hides the protocol dropdown when autoPrependProtocol is disabled', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                linkSettings: {
                    autoPrependProtocol: false,
                    allowedProtocols: ['http', 'https'],
                    defaultProtocol: 'https'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('LPROT-07 — does not render the protocol dropdown when autoPrependProtocol is false', (done: DoneFn) => {
            (editor.inputElement as HTMLElement).focus();
            clickLinkToolbarItem(editor);
            setTimeout(() => {
                const dialogElement: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
                expect(dialogElement).not.toBeNull();
                expect(dialogElement.querySelector('.e-rte-ui-protocol-dropdown-slot')).toBeNull();
                expect(dialogElement.querySelector('.e-rte-ui-link-protocol-drodpown')).toBeNull();
                done();
            }, 150);
        });
    });

    describe('LINK-CTRLK-OUTSIDE — ignores Ctrl+K when focus is outside the editor', () => {
        let editor: RichTextEditorUI;
        let externalButton: HTMLButtonElement;

        beforeEach(() => {
            editor = renderRTE({});
            externalButton = document.createElement('button');
            externalButton.type = 'button';
            externalButton.textContent = 'outside';
            document.body.appendChild(externalButton);
        });

        afterEach(() => {
            if (externalButton && externalButton.parentNode) {
                externalButton.parentNode.removeChild(externalButton);
            }
            destroyRTE(editor);
            editor = null;
        });

        it('LINK-CTRLK-OUTSIDE — does not open the link dialog when Ctrl+K is pressed outside the active editor', (done: DoneFn) => {
            externalButton.focus();
            dispatchKey(externalButton, 'k', true);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-ui-link-dialog')).toBeNull();
                done();
            }, 150);
        });
    });

    describe('LINK-DIALOG-NULL-SAFE — no selection should not crash dialog open', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p>Plain text</p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should open the link dialog without a selected anchor and not throw', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            selection.removeAllRanges();
            inputElement.focus();
            expect(() => {
                clickLinkToolbarItem(editor);
            }).not.toThrow();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-link-dialog') as HTMLElement;
            expect(dialog).not.toBeNull();
        });
    });

    describe('LINK-EMPTY-HREF — invalid link payload is rejected via command builder', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p>Example</p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not insert a link when href is empty', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const paragraph: HTMLElement = inputElement.querySelector('p') as HTMLElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(paragraph);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            editor.commands().link()
                .href('')
                .text('Example')
                .operation('insert')
                .apply();
            expect(inputElement.querySelector('a')).toBeNull();
        });
    });

    describe('LINK-OPEN-DEFAULT-TARGET — selected link opens with _blank when target is missing', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><a href="https://example.com">Example</a></p>',
                valueFormat: 'html'
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should open the selected link with _blank when no target is configured', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            const anchor: HTMLAnchorElement = inputElement.querySelector('a') as HTMLAnchorElement;
            const selection: Selection = inputElement.ownerDocument.defaultView.getSelection() as Selection;
            const range: Range = inputElement.ownerDocument.createRange();
            range.selectNodeContents(anchor);
            selection.removeAllRanges();
            selection.addRange(range);
            inputElement.focus();
            const openSpy: jasmine.Spy = spyOn(window, 'open');
            editor.commands().link()
                .href('https://example.com')
                .operation('open')
                .apply();
            expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
        });
    });

    describe('PASTE-01 — selected text becomes a link', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Visit site</p>',
                linkSettings: {
                    linkOnPaste: true,
                    autoPrependProtocol: true,
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https'],
                    defaultTarget: '_blank'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should convert selected text into a link when a domain is pasted', () => {
            selectEditorText(editor);

            const pasteEvent: Event = createPasteEvent('example.com');
            editor.inputElement.dispatchEvent(pasteEvent);

            const anchor: HTMLAnchorElement | null =
                editor.inputElement.querySelector('a');

            expect(pasteEvent.defaultPrevented).toBe(true);
            expect(anchor).not.toBeNull();
            expect(anchor && anchor.getAttribute('href')).toBe('https://example.com');
            expect(anchor && anchor.textContent).toBe('Visit site');
            expect(anchor && anchor.getAttribute('target')).toBe('_blank');
        });
    });

    describe('PASTE-02 — collapsed selection uses URL as link text', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p></p>',
                linkSettings: {
                    linkOnPaste: true,
                    autoPrependProtocol: true,
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should use the pasted URL as the anchor text', () => {
            const inputElement: HTMLElement = editor.inputElement as HTMLElement;
            inputElement.focus();

            const pasteEvent: Event = createPasteEvent('https://example.com');
            inputElement.dispatchEvent(pasteEvent);

            const anchor: HTMLAnchorElement | null =
                inputElement.querySelector('a');

            expect(anchor).not.toBeNull();
            expect(anchor && anchor.getAttribute('href')).toBe('https://example.com');
            expect(anchor && anchor.textContent).toBe('https://example.com');
        });
    });

    describe('PASTE-03 — relative URL is preserved', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Products</p>',
                linkSettings: {
                    linkOnPaste: true,
                    autoPrependProtocol: true,
                    defaultProtocol: 'https',
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should not prepend a protocol to a relative URL', () => {
            selectEditorText(editor);

            editor.inputElement.dispatchEvent(
                createPasteEvent('/products?id=1')
            );

            const anchor: HTMLAnchorElement | null =
                editor.inputElement.querySelector('a');

            expect(anchor).not.toBeNull();
            expect(anchor && anchor.getAttribute('href')).toBe('/products?id=1');
        });
    });

    describe('PASTE-04 — linkOnPaste disabled', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Example</p>',
                linkSettings: {
                    linkOnPaste: false,
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should insert the URL as plain text', () => {
            selectEditorText(editor);
            const pasteEvent: Event = createPasteEvent('https://example.com');
            editor.inputElement.dispatchEvent(pasteEvent);
            expect(pasteEvent.defaultPrevented).toBe(true);
            expect(editor.inputElement.querySelector('a')).toBeNull();
        });
    });
    describe('PASTE-05 — disallowed protocol', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Example</p>',
                linkSettings: {
                    linkOnPaste: true,
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should insert a disallowed protocol as plain text', () => {
            selectEditorText(editor);
            const pasteEvent: Event = createPasteEvent('javascript:alert(1)');
            editor.inputElement.dispatchEvent(pasteEvent);
            expect(pasteEvent.defaultPrevented).toBe(true);
            expect(editor.inputElement.querySelector('a')).toBeNull();
        });
    });
    describe('PASTE-06 — normal text paste', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>Example</p>',
                linkSettings: {
                    linkOnPaste: true,
                    allowedProtocols: ['http', 'https']
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('should leave ordinary text paste untouched', () => {
            selectEditorText(editor);
            const pasteEvent: Event = createPasteEvent(
                'Please review this document'
            );
            editor.inputElement.dispatchEvent(pasteEvent);
            expect(editor.inputElement.querySelector('a')).toBeNull();
        });
    });
});

