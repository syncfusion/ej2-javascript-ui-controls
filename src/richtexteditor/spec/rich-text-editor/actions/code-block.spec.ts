import { renderRTE, destroy, setCursorPoint } from '../render.spec';
import { RichTextEditor } from '../../../src/rich-text-editor';
import { CodeBlockSettings } from '../../../src/models/toolbar-settings';

describe('Code Block Module', () => {
    describe('Basic Code Block Functionality', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                },
                codeBlockSettings: {
                    languages: [
                        { language: 'javascript', label: 'JavaScript' },
                        { language: 'typescript', label: 'TypeScript' },
                        { language: 'html', label: 'HTML' }
                    ],
                    defaultLanguage: 'javascript'
                }
            });
        });

        afterAll((done) => {
            destroy(rteObj);
            done();
        });

        it('should create a code block when toolbar button is clicked', (done) => {
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Test content</p>';
            const startNode = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 6);
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.getAttribute('data-language')).toBe('JavaScript');
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toBe('Test content');
            done();
        });
        it('should create a code block with default language using keyboard shortcut', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Test content</p>';
            setCursorPoint(contentEle.querySelector('p').firstChild as Element, 5);
            const keyboardEvent = new KeyboardEvent('keydown', {
                key: 'b',
                code: 'KeyB',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true
            });
            Object.defineProperty(keyboardEvent, 'action', { value: 'code-block' });
            contentEle.dispatchEvent(keyboardEvent);
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.getAttribute('data-language')).toBe('JavaScript');
            done();
        });
        it('should prevent formatting shortcuts when cursor is inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 5);
            const boldShortcutEvent = new KeyboardEvent('keydown', {
                key: 'b',
                ctrlKey: true,
                bubbles: true
            });
            Object.defineProperty(boldShortcutEvent, 'action', { value: 'bold' });
            contentEle.querySelector('code').dispatchEvent(boldShortcutEvent);
            expect(contentEle.querySelector('strong')).toBeNull();
            const italicShortcutEvent = new KeyboardEvent('keydown', {
                key: 'i',
                ctrlKey: true,
                bubbles: true
            });
            Object.defineProperty(italicShortcutEvent, 'action', { value: 'italic' });
            contentEle.querySelector('code').dispatchEvent(italicShortcutEvent);
            expect(contentEle.querySelector('em')).toBeNull();
            done();
        });
        it('When the defaultLanguage property is null, the code block should be created with the first language in the languages collection', (done) => {
            rteObj.codeBlockSettings.defaultLanguage = null;
            rteObj.dataBind();
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Test content</p>';
            const startNode = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 6);
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.getAttribute('data-language')).toBe('JavaScript');
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toBe('Test content');
            done();
        });
    });
    describe('Code Block Edit Behavior', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Underline', 'CodeBlock', 'Undo', 'Redo']
                },
                codeBlockSettings: {
                    languages: [
                        { language: 'javascript', label: 'JavaScript' },
                        { language: 'typescript', label: 'TypeScript' },
                        { language: 'html', label: 'HTML' }
                    ]
                }
            });
        });

        afterAll((done) => {
            destroy(rteObj);
            done();
        });

        it('should disable formatting buttons when cursor is inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 5);
            const letter = new KeyboardEvent('keyup', {
                key: 'i',
                bubbles: true
            });
            contentEle.querySelector('code').dispatchEvent(letter);
            const boldButton = rteObj.element.querySelectorAll('.e-toolbar-item')[0];
            const italicButton = rteObj.element.querySelectorAll('.e-toolbar-item')[1];
            const underlineButton = rteObj.element.querySelectorAll('.e-toolbar-item')[2];
            const codeBlockButton = rteObj.element.querySelectorAll('.e-toolbar-item')[3];
            const undoButton = rteObj.element.querySelectorAll('.e-toolbar-item')[4];
            expect(boldButton.classList.contains('e-overlay')).toBeTruthy();
            expect(italicButton.classList.contains('e-overlay')).toBeTruthy();
            expect(underlineButton.classList.contains('e-overlay')).toBeTruthy();
            expect(codeBlockButton.classList.contains('e-overlay')).toBeFalsy();
            expect(undoButton.classList.contains('e-overlay')).toBeTruthy();
            done();
        });

        it('should disable formatting toolbar items when selection starts outside code block and end inside codeblock', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent as Node, 0, 5);
            (rteObj as any).mouseUp({ target: codeContent });
            const boldButton = rteObj.element.querySelectorAll('.e-toolbar-item')[0];
            const italicButton = rteObj.element.querySelectorAll('.e-toolbar-item')[1];
            const underlineButton = rteObj.element.querySelectorAll('.e-toolbar-item')[2];
            const codeBlockButton = rteObj.element.querySelectorAll('.e-toolbar-item')[3];
            const undoButton = rteObj.element.querySelectorAll('.e-toolbar-item')[4];
            expect(boldButton.classList.contains('e-overlay')).toBeTruthy();
            expect(italicButton.classList.contains('e-overlay')).toBeTruthy();
            expect(underlineButton.classList.contains('e-overlay')).toBeTruthy();
            expect(codeBlockButton.classList.contains('e-overlay')).toBeFalsy();
            expect(undoButton.classList.contains('e-overlay')).toBeTruthy();
            done();
        });
        it('should disable formatting toolbar items when selection starts in code block and ends outside', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            const textBefore = contentEle.querySelectorAll('p')[1].firstChild;
            const codeContent = contentEle.querySelector('code').firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, textBefore as Node, 0, 5);
            (rteObj as any).mouseUp({ target: codeContent });
            const boldButton = rteObj.element.querySelectorAll('.e-toolbar-item')[0];
            const italicButton = rteObj.element.querySelectorAll('.e-toolbar-item')[1];
            const underlineButton = rteObj.element.querySelectorAll('.e-toolbar-item')[2];
            const codeBlockButton = rteObj.element.querySelectorAll('.e-toolbar-item')[3];
            const undoButton = rteObj.element.querySelectorAll('.e-toolbar-item')[4];
            expect(boldButton.classList.contains('e-overlay')).toBeTruthy();
            expect(italicButton.classList.contains('e-overlay')).toBeTruthy();
            expect(underlineButton.classList.contains('e-overlay')).toBeTruthy();
            expect(codeBlockButton.classList.contains('e-overlay')).toBeFalsy();
            expect(undoButton.classList.contains('e-overlay')).toBeTruthy();
            done();
        });
        it('should disable formatting buttons when cursor is inside code block and enable when focus out', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 5);
            const letter = new KeyboardEvent('keyup', {
                key: 'i',
                bubbles: true
            });
            contentEle.querySelector('code').dispatchEvent(letter);
            const boldButton = rteObj.element.querySelectorAll('.e-toolbar-item')[0];
            expect(boldButton.classList.contains('e-overlay')).toBeTruthy();
            setCursorPoint(contentEle.querySelector('p').firstChild as Element, 5);
            (rteObj as any).mouseUp({ target: contentEle.querySelector('p') });
            expect(boldButton.classList.contains('e-overlay')).toBeFalsy();
            done();
        });
    });
    describe('Code Block Edit Behavior', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        'Bold',
                        'Italic',
                        'Underline',
                        'CodeBlock',
                        'SourceCode',
                        {
                            tooltipText: 'Insert Symbol',
                            template:
                                '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
                                '<div class="e-tbar-btn-text" style="font-weight: 400;"> Ω</div></button>',
                        },
                        '|',
                        'Undo',
                        'Redo',
                    ],
                },
                codeBlockSettings: {
                    languages: [
                        { language: 'javascript', label: 'JavaScript' },
                        { language: 'typescript', label: 'TypeScript' },
                        { language: 'html', label: 'HTML' }
                    ]
                }
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should disable formatting buttons when cursor is inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 5);
            const letter = new KeyboardEvent('keyup', {
                key: 'i',
                bubbles: true
            });
            contentEle.querySelector('code').dispatchEvent(letter);
            const boldButton = rteObj.element.querySelectorAll('.e-toolbar-item')[0];
            const italicButton = rteObj.element.querySelectorAll('.e-toolbar-item')[1];
            const underlineButton = rteObj.element.querySelectorAll('.e-toolbar-item')[2];
            const codeBlockButton = rteObj.element.querySelectorAll('.e-toolbar-item')[3];
            expect(boldButton.classList.contains('e-overlay')).toBeTruthy();
            expect(italicButton.classList.contains('e-overlay')).toBeTruthy();
            expect(underlineButton.classList.contains('e-overlay')).toBeTruthy();
            expect(codeBlockButton.classList.contains('e-overlay')).toBeFalsy();
            done();
        });
    });
    describe('Code Block Paste Functionality', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock', 'Bold', 'Italic']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should maintain code formatting when pasting content inside a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 5);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>var foo = "formatted code";</div>');
            dataTransfer.setData('text/plain', 'var foo = "formatted code";');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const codeElement = contentEle.querySelector('code');
                expect(codeElement).not.toBeNull();
                expect(codeElement.textContent.indexOf('formatted code') > -1).toBeTruthy();
                expect(codeElement.innerHTML.indexOf('<div>') === -1).toBeTruthy();
                const preElement = contentEle.querySelector('pre');
                expect(preElement.getAttribute('data-language')).toBe('JavaScript');
                done();
            }, 100);
        });
        it('should pevent the pasecleanup settings when the range is in the code block', (done) => {
            rteObj.pasteCleanupSettings = {
                prompt: false,
                plainText: false,
                keepFormat: true,
            };
            rteObj.dataBind();
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>function test() {</code></pre>';
            setCursorPoint(contentEle.querySelector('code').firstChild as Element, 15);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>var foo = "formatted code";</div>');
            dataTransfer.setData('text/plain', 'var foo = "formatted code";');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const codeElement = contentEle.querySelector('code');
                expect(codeElement).not.toBeNull();
                done();
            }, 100);
        });
        it('should handle paste when selection is in inside a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, codeContent as Node, 1, 4);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>formatted code</div>');
            dataTransfer.setData('text/plain', 'formatted code');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const codeBlockContent = contentEle.querySelector('code').textContent;
                const textChanged = codeBlockContent === "Cformatted code content";
                expect(textChanged).toBe(true);
                done();
            }, 100);
        });
        it('should handle paste when selection spans from outside to inside a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent as Node, 6, 4);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>formatted code</div>');
            dataTransfer.setData('text/plain', 'formatted code');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre[data-language]');
                expect(preElement).not.toBeNull();
                expect(preElement.getAttribute('data-language')).toBe('JavaScript');
                const codeBlockContent = contentEle.querySelector('code').textContent;
                const textChanged = codeBlockContent === "Text bformatted code content";
                expect(textChanged).toBe(true);
                done();
            }, 100);
        });
        it('should handle paste when selection spans from inside code block to outside', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre><p>Code after</p>';
            const codeAfter = contentEle.querySelectorAll('p')[1].firstChild;
            const codeContent = contentEle.querySelector('code').firstChild as Node;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, codeAfter as Node, 6, 4);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>formatted code</div>');
            dataTransfer.setData('text/plain', 'formatted code');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const codeBlockContent = contentEle.querySelector('code').textContent;
                const textChanged = codeBlockContent === "Code cformatted code after";
                expect(textChanged).toBe(true);
                done();
            }, 100);
        });
        it('should handle paste when selection spans from two seperate code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Text before</code></pre><p>Code content</p><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Code after</code></pre>';
            const codeAfter = contentEle.querySelectorAll('pre')[0].firstChild;
            const codeContent = contentEle.querySelectorAll('pre')[1].firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeAfter.firstChild, codeContent.firstChild, 0, codeContent.firstChild.textContent.length);
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', '<div>formatted code</div>');
            dataTransfer.setData('text/plain', 'formatted code');
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
            setTimeout(() => {
                const codeBlockContent = contentEle.querySelector('code').textContent;
                const textChanged = codeBlockContent === "formatted code";
                expect(textChanged).toBe(true);
                expect(contentEle.querySelectorAll('pre').length).toBe(1);
                done();
            }, 100);
        });
    });
    describe('Code Block executeCommand Tests', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                }
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should create a code block with specified language using executeCommand', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Test content for TypeScript</p>';
            const startNode = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 25);
            rteObj.executeCommand('insertCodeBlock', { language: "typescript", label: "TypeScript" });
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.getAttribute('data-language')).toBe('TypeScript');
            expect(preElement.textContent).toBe('Test content for TypeScript');
            expect(preElement.querySelector('code')).not.toBeNull();
            done();
        });
    });
    describe('Code Block Revert Functionality', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock', 'Formats']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should revert code block to normal paragraphs when split button is clicked', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Line 1<br>Line 2<br>Line 3</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                const paragraphs = contentEle.querySelectorAll('p');
                expect(paragraphs.length).toBe(3);
                expect(paragraphs[0].textContent).toBe('Line 1');
                expect(paragraphs[1].textContent).toBe('Line 2');
                expect(paragraphs[2].textContent).toBe('Line 3');
                done();
            }, 100);
        });
        it('Should revert the code block and the range as well', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Heading text<br>Content line</code></pre>';
            const codeElement = contentEle.querySelector('code');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeElement.firstChild, codeElement.firstChild, 3, 10);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                expect(window.getSelection().getRangeAt(0).startOffset === 3).toBe(true);
                expect(window.getSelection().getRangeAt(0).endOffset === 10).toBe(true);
                done();
            }, 100);
        });
        it('should preserve line breaks and empty lines when reverting code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>First line<br><br><br>Last line</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                const paragraphs = contentEle.querySelectorAll('p');
                expect(paragraphs.length).toBe(4);
                expect(paragraphs[0].textContent).toBe('First line');
                expect(paragraphs[1].innerHTML).toContain('<br>');
                expect(paragraphs[2].innerHTML).toContain('<br>');
                expect(paragraphs[3].textContent).toBe('Last line');
                done();
            }, 100);
        });
        it('should not revert code block if split button is not clicked', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-dropdown-btn.e-rte-codeblock-dropdown') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                (document.querySelector('.e-rte-codeblock-dropdown.e-popup-open.e-popup li') as HTMLElement).click();
                const preElement = contentEle.querySelector('pre');
                expect(preElement).not.toBeNull();
                expect(preElement.getAttribute('data-language')).toBe('Plain text');
                done();
            }, 100);
        });
        it('Should revert the code block to normal text when the split button is clicked, and the cursor should be maintained.', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Line 1<br>Line 2<br><br><br><br><br>Line 3</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                expect(contentEle.querySelectorAll('p').length).toBe(7);
                expect((window.getSelection().getRangeAt(0).startContainer as HTMLElement).innerHTML).toBe('<br>');
                done();
            }, 100);
        });
        it('should revert code block to normal text when split button is clicked', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Line 1<br>Line 2<br>Line 3</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                expect(contentEle.childNodes[0].textContent).toBe('Line ');
                expect(contentEle.childNodes[5].textContent).toBe('Line 3');
                done();
            }, 100);
        });
        it('should revert code block to normal text when the range is in the two seperate code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor 1&nbsp;</code></pre><p>Rich Text Editor 2&nbsp;</p><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor 3</code></pre>';
            const codeBlock1 = contentEle.querySelectorAll('pre')[0];
            const codeBlock2 = contentEle.querySelectorAll('pre')[1];
            expect(contentEle.querySelectorAll('pre').length === 2).toBe(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeBlock1.firstChild.firstChild, codeBlock2.firstChild.firstChild, 0, 6);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const formatBtn = toolbar.querySelector('.e-split-btn') as HTMLElement;
            formatBtn.click();
            setTimeout(() => {
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 100);
        });
    });
    describe('Code Block Enter Action Functionality', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 13,
            keyCode: 13,
            which: 13,
            code: 'Enter',
            action: 'enter',
            type: 'keydown'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should insert a line break when Enter is pressed inside a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
            const codeElement = contentEle.querySelector('code').firstChild;
            setCursorPoint(codeElement as Element, 5);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.innerHTML).toBe('Test <br>code');
                done();
            }, 50);
        });
        it('should insert a new paragraph before code block when Enter is pressed at the start with BR', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code><br>Test code</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const paragraph = contentEle.querySelector('p');
                expect(paragraph).not.toBeNull();
                expect(paragraph.previousElementSibling).toBeNull();
                expect(paragraph.nextElementSibling.nodeName).toBe('PRE');
                expect(paragraph.innerHTML).toBe('<br>');
                done();
            }, 50);
        });
        it('should insert a new paragraph after code block when Enter is pressed at the end with multiple BRs', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code<br><br><br></code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement as Element, codeElement.childNodes.length - 1);
            (<any>rteObj).keyDown(keyboardEventArgs);

            setTimeout(() => {
                const paragraph = contentEle.querySelector('p');
                expect(paragraph).not.toBeNull();
                expect(paragraph.previousElementSibling.nodeName).toBe('PRE');
                expect(paragraph.innerHTML).toBe('<br>');
                done();
            }, 50);
        });
        it('should add extra BR element when Enter is pressed at the end of code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Testcode</code></pre>';
            const codeElement = contentEle.querySelector('code').firstChild;
            setCursorPoint(codeElement as Element, codeElement.textContent.length);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.innerHTML).toBe('Testcode<br><br>');
                done();
            }, 50);
        });
        it('should handle Enter when selection spans from outside to inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent, 5, 5);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'PRE').toBe(true);
                expect(window.getSelection().getRangeAt(0).startOffset === 0).toBe(true);
                expect(window.getSelection().getRangeAt(0).endContainer.nodeName === 'PRE').toBe(true);
                expect(window.getSelection().getRangeAt(0).endOffset === 0).toBe(true);
                expect(codeElem.textContent).toBe('content');
                done();
            }, 50);
        });
        it('should handle Enter when selection spans from inside code block to outside', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            const codeContent = contentEle.querySelector('code').firstChild;
            const textAfter = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, textAfter, 5, 5);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const textElem = contentEle.querySelector('p');
                expect(textElem.textContent).toBe('after');
                expect(window.getSelection().getRangeAt(0).startContainer.parentElement.textContent).toBe('after');
                expect(window.getSelection().getRangeAt(0).startOffset === 0).toBe(true);
                expect(window.getSelection().getRangeAt(0).endOffset === 0).toBe(true);
                done();
            }, 50);
        });
        it('should handle Enter when selection is inside the code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre>';
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, codeContent, 2, 6);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const textElem = contentEle.querySelector('code');
                expect(textElem.innerHTML === 'Co<br>ontent').toBe(true);
                done();
            }, 50);
        });
        it('should insert a new DIV before code block when Enter is pressed at the start with BR', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'DIV';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code><br>Test code</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const paragraph = contentEle.querySelector('div');
                expect(paragraph).not.toBeNull();
                expect(paragraph.previousElementSibling).toBeNull();
                expect(paragraph.nextElementSibling.nodeName).toBe('PRE');
                expect(paragraph.innerHTML).toBe('<br>');
                done();
            }, 50);
        });
        it('should place cursor inside code block when Enter is pressed with selection spanning previous element and code block entirely', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const pNode = contentEle.querySelector('p').firstChild;
            const codeNode = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pNode, codeNode, 5, codeNode.textContent.length);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(codeBlock.innerHTML).toBe('<br>');
                done();
            }, 50);
        });
        it('should handle Enter key press with selection spanning from code block to next sibling text', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>Rich <br>Text <br>Editor';
            const pNode = contentEle.querySelector('code').firstChild;
            const codeNode = contentEle.querySelector('pre').nextSibling;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pNode, codeNode, 5, 3);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(codeBlock.innerHTML).toBe("Code ");
                expect(window.getSelection().getRangeAt(0).startContainer === codeBlock.parentElement.nextSibling).toBe(true);
                expect(window.getSelection().getRangeAt(0).startOffset).toBe(0);
                done();
            }, 50);
        });
        it('Should handle Enter key press with selection spanning from code block to next sibling BR. The selection places the cursor at the BR element.', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre><br><br><br><br><br><br><br>';
            const pNode = contentEle.querySelector('code').firstChild;
            const codeNode = contentEle.childNodes[4];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pNode, codeNode, 5, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(window.getSelection().getRangeAt(0).startContainer === codeBlock.parentElement.nextSibling).toBe(true);
                expect(window.getSelection().getRangeAt(0).startOffset).toBe(0);
                done();
            }, 50);
        });
        it('Creates a code element when Enter key is pressed with selection spanning from code block to nextsibling', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><p>Text before</p>';
            const pNode = contentEle.querySelector('code').firstChild;
            const codeNode = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pNode, codeNode, 0, 5);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(window.getSelection().getRangeAt(0).startContainer.textContent === 'before').toBe(true);
                expect(codeBlock.innerHTML === '<br>').toBe(true);
                done();
            }, 50);
        });
        it('Should remove the first line in the code block when creating a previous node while pressing the Enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br>Rich Text Editor</code></pre>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(codeBlock.firstChild.nodeName !== 'BR').toBe(true);
                expect(codeBlock.innerHTML === 'Rich Text Editor').toBe(true);
                done();
            }, 50);
        });
        it('Should remove the last two lines in the code block when creating a next sibling of the code block element while pressing the Enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor<br><br><br></code></pre>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode as Element, codeNode.childNodes.length - 1);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                expect(codeBlock.innerHTML === 'Rich Text Editor<br>').toBe(true);
                done();
            }, 50);
        });
        it('The code block should be removed when the user selects both the entire previous sibling element and the full content of the code block, then presses the Enter key. The entire code block element should be removed from the editor.', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<p>Rich text</p><pre data-language="Plain text" spellcheck="false"><code>Editor</code></pre>';
            const codeNode = contentEle.querySelector('code').firstChild;
            const pNode = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pNode, codeNode, 0, codeNode.textContent.length);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).toBeNull();
                expect(contentEle.innerHTML === '<p><br></p>').toBe(true);
                done();
            }, 50);
        });
        it('Should insert the <li> element *before* the codeblock <li> element when pressing the Enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li>Rich Text Editor 1</li><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br>Rich Text Editor 1</code></pre></li><li>Rich Text Editor 1</li><li>Rich Text Editor 1</li></ol>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const li = contentEle.querySelectorAll('li');
                expect(li.length === 5).toBe(true);
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                done();
            }, 50);
        });
        it('Should insert the <li> element *after* the codeblock <li> element when pressing the Enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li>Rich Text Editor 1</li><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor 1<br><br><br></code></pre></li><li>Rich Text Editor 1</li><li>Rich Text Editor 1</li></ol>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode as Element, 3);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const li = contentEle.querySelectorAll('li');
                expect(li.length === 5).toBe(true);
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                done();
            }, 50);
        });
        it('Should insert the <li> element after the <li> that contains a codeblock and a nested list when pressing the Enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li>Rich Text Editor 1</li><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor 1<br><br><br></code></pre><ol><li>Rich Text Editor 1</li></ol></li><li>Rich Text Editor 1</li></ol>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode as Element, 3);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const li = contentEle.querySelectorAll('li');
                expect(li.length === 5).toBe(true);
                expect((window.getSelection().getRangeAt(0).startContainer as Element).querySelector('ol') !== null).toBe(true);
                const codeBlock = contentEle.querySelector('code');
                expect(codeBlock).not.toBeNull();
                done();
            }, 50);
        });
        it('should set the range to the text node at zero position when inserting a BR element at the current range position and the nextSibling is a text node', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor</code></pre>';
            const codeNode = contentEle.querySelector('code');
            setCursorPoint(codeNode.firstChild as Element, 0);
            (<any>rteObj).keyDown(keyboardEventArgs);
            setTimeout(() => {
                const elem = contentEle.querySelector("pre code");
                expect(elem.innerHTML === '<br>Rich Text Editor').toBe(true);
                expect(window.getSelection().getRangeAt(0).startContainer.textContent == 'Rich Text Editor').toBe(true);
                expect(window.getSelection().getRangeAt(0).startOffset === 0).toBe(true);
                done();
            }, 50);
        });
    });

    describe('Code Block Backspace Action Functionality', () => {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should recreate code element when it is deleted in keyup event', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><br></pre>';
            const codeContent = contentEle.querySelector('pre');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, codeContent, 0, 0);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                expect(codeElem.innerHTML).toBe('<br>');
                done();
            }, 50);
        });
        it('should merge content when backspace is pressed at the start of a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement, 0);
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.querySelector('p');
                expect(pElement.textContent).toBe('Text beforeCode content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 50);
        });
        it('should merge content when backspace is pressed with selection from outside to inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent, 5, 4);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.querySelector('p');
                expect(pElement.textContent).toBe('Text  content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 50);
        });
        it('Should merge the content when the backspace key is pressed, combining the next sibling with the code block.', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><p>Code content</p>';
            const textBefore = contentEle.querySelector('p').firstChild;
            setCursorPoint(textBefore as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.querySelector('code');
                expect(pElement.textContent).toBe('Code contentCode content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement != null).toBe(true);
                done();
            }, 50);
        });
        it('should set cursor at code block start when backspace is pressed with selection from previous element to partially inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent, 0, 4);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.querySelector('p');
                expect(pElement).toBeNull();
                const preElement = contentEle.querySelector('pre');
                expect(preElement !== null).toBe(true);
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'CODE').toBe(true);
                done();
            }, 50);
        });
        it('EnterKey BR - should merge content when backspace is pressed with selection from outside to inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = 'Text before<pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.childNodes[0];
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent, 5, 4);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.textContent;
                expect(pElement).toBe('Text  content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 50);
        });
        it('EnterKey BR - Should merge the content when the backspace key is pressed, combining the next sibling with the code block.', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre>Code content';
            const textBefore = contentEle.childNodes[1];
            setCursorPoint(textBefore as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const pElement = contentEle.querySelector('code');
                expect(pElement.textContent).toBe('Code contentCode content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement != null).toBe(true);
                done();
            }, 50);
        });
        it('should merge code block into previous element when backspace is pressed at start of code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = 'Text 1<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Code<br>Block<br></code></pre>Text 2<br>Text 3<br>';
            const codeElem = contentEle.querySelector('code');
            setCursorPoint(codeElem.childNodes[0] as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const codeElemnt = contentEle.querySelector('code');
                expect(codeElemnt).toBeNull();
                expect(contentEle.innerHTML).toBe('Text 1Code<br>Block<br>Text 2<br>Text 3<br>');
                done();
            }, 50);
        });
        it('should add BR element when missing and skip further code in handleSelectionFromCodeBlockToRegular', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code><br></br></code></pre><p><br></p>';
            const codeElement = contentEle.querySelector('code');
            const textAfter = contentEle.querySelector('p');
            const selection = rteObj.formatter.editorManager.nodeSelection;
            selection.setSelectionText(document, codeElement, textAfter, 0, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const brElement = contentEle.querySelector('code br');
                expect(brElement).not.toBeNull();
                const preElement = contentEle.querySelector('pre');
                expect(preElement).not.toBeNull();
                done();
            }, 50);
        });
        it('Should not add the entire list into the code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code><br></br></code></pre><ol><li>Rich text Editor</li></ol>';
            const textAfter = contentEle.querySelector('ol li');
            setCursorPoint(textAfter.childNodes[0] as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const brElement = contentEle.querySelector('code');
                expect(brElement.textContent === '').toBe(true);
                done();
            }, 50);
        });
        it('should merge with the code block when the cursor is at the start of the next sibling and the backspace key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<ol><li>Rich text</li><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">&nbsp;Editor</code></pre></li></ol><p>editor</p>';
            const textAfter = contentEle.querySelector('p');
            setCursorPoint(textAfter.childNodes[0] as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const brElement = contentEle.querySelector('code');
                expect(brElement).not.toBeNull();
                const preElement = contentEle.querySelector('pre');
                expect(preElement).not.toBeNull();
                expect(preElement.textContent === ' Editoreditor').toBe(true);
                done();
            }, 50);
        });
        it('Should not merge with the code block when pressing the backspace key at the next sibling of the code block element', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich text Editor</code></pre><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td>Rich Text Editor</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
            const textAfter = contentEle.querySelector('table td');
            setCursorPoint(textAfter.childNodes[0] as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const brElement = contentEle.querySelector('table');
                expect(brElement).not.toBeNull();
                done();
            }, 50);
        });
        it('Should create a new element for the focus when pressing backspace when there is no content in the code block element', (done) => {
            (rteObj as any).enterKey = 'P';
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>';
            const textAfter = contentEle.querySelector('pre code');
            setCursorPoint(textAfter as Element, 0);
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                const brElement = contentEle.querySelector('pre');
                expect(brElement).toBeNull();
                done();
            }, 50);
        });
    });

    describe('Code Block Delete Key Action Functionality', () => {
        let rteObj: RichTextEditor;
        let keyBoardEventDel: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should merge content when delete is pressed at the end of a code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            const codeElement = contentEle.querySelector('code').firstChild;
            setCursorPoint(codeElement as Element, codeElement.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.textContent).toBe('Code contentText after');
                const paragraphs = contentEle.querySelectorAll('p');
                expect(paragraphs.length).toBe(0);
                done();
            }, 50);
        });
        it('should merge next element when delete is pressed at the end of code block previous element', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text after</p><pre data-language="JavaScript"><code>Code content</code></pre><br>';
            const codeElement = contentEle.querySelector('p').firstChild;
            setCursorPoint(codeElement as Element, codeElement.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const elements = contentEle.querySelector('p');
                expect(elements.textContent).toBe('Text afterCode content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 50);
        });
        it('should merge content when delete is pressed with selection from inside code block to outside', (done) => {
            const contentEle = (rteObj as any).contentModule.getEditPanel();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><p>Text after</p>';
            const codeContent = contentEle.querySelector('code').firstChild;
            const textAfter = contentEle.querySelector('p').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeContent, textAfter, 5, 4);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.textContent).toBe('Code  after');
                done();
            }, 50);
        });
        it('should merge content when delete is pressed with selection from outside to inside code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Text before</p><pre data-language="JavaScript"><code>Code content</code></pre>';
            const textBefore = contentEle.querySelector('p').firstChild;
            const codeContent = contentEle.querySelector('code').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, textBefore, codeContent, 5, 4);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const pElement = contentEle.querySelector('p');
                expect(pElement.textContent).toBe('Text  content');
                const preElement = contentEle.querySelector('pre');
                expect(preElement).toBeNull();
                done();
            }, 50);
        });
        it('should add the next sibling BR tag into the code block when delete is pressed at the end', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content</code></pre><br>Text after';
            const codeElement = contentEle.querySelector('code').firstChild;
            setCursorPoint(codeElement as Element, codeElement.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.lastChild.nodeName).toBe('BR');
                done();
            }, 50);
        });
        it('should merge next text node when delete is pressed at the end of code block with BR', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content<br><br></code></pre>Text after<br>';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.lastChild as Element, 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.innerHTML).toBe('Code content<br>Text after');
                done();
            }, 50);
        });
        it('should wrap next sibling content until newline element when delete is pressed at the end of code block', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="JavaScript"><code>Code content<br><br></code></pre><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">asdfasdfasdfasdf</span></span></em></strong><br>Rich Text Editor';
            const codeElement = contentEle.querySelector('code');
            setCursorPoint(codeElement.lastChild as Element, codeElement.lastChild.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem.innerHTML).toBe('Code content<br>asdfasdfasdfasdf');
                expect(codeElem.parentElement.nextSibling.nodeName === 'BR').toBe(true);
                done();
            }, 50);
        });
        it('should merge code block into previous element when delete is pressed before code block with BR as enter key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = 'Text 1<pre data-language="Plain Text" spellcheck="false"><code class="language-plaintext">Code<br>Block<br></code></pre>Text 2<br>Text 3<br>';
            setCursorPoint(contentEle.childNodes[0] as Element, contentEle.childNodes[0].textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(contentEle.innerHTML).toBe('Text 1Code<br>Block<br>Text 2<br>Text 3<br>');
                done();
            }, 50);
        });
        it('should remove the code block when it is empty and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName === 'P').toBe(true);
                done();
            }, 50);
        });
        it('should remove the code block when it is empty and the Delete key is pressed while enterKey is set to BR', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(contentEle.firstChild.nodeName === 'BR').toBe(true);
                done();
            }, 50);
        });
        it('should remove the code block and move the cursor to the next sibling element when it exists', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre><p>Rich Text Editor</p>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(window.getSelection().getRangeAt(0).startContainer.textContent === 'Rich Text Editor').toBe(true);
                done();
            }, 50);
        });
        it('should remove the code block and move the cursor to the next BR element', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre><br><br>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(window.getSelection().getRangeAt(0).startContainer.childNodes[window.getSelection().getRangeAt(0).startOffset].nodeName === 'BR').toBe(true);
                done();
            }, 50);
        });
        it('should merge with the code block when the cursor is at the end of the code block and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'BR';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li>Rich text</li><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">&nbsp;Editor</code></pre></li></ol><p>editor</p>';
            setCursorPoint(contentEle.querySelector('pre code').childNodes[0] as Element, contentEle.querySelector('pre code').childNodes[0].textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                expect(codeElem.textContent === ' Editoreditor').toBe(true);
                done();
            }, 50);
        });
        it('should remove the <li> element when the code block is empty and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre></li><li>Rich Text Editor2</li><li>Rich Text Editor3</li></ol>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(rteObj.contentModule.getEditPanel().querySelectorAll('li').length === 2).toBe(true);
                done();
            }, 50);
        });
        it('should remove the <ul> or <ol> element when the code block is empty and contains a single <li> element, while the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = '<ol><li><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre></li></ol><p>Rich Text</p>';
            setCursorPoint(contentEle.querySelector('pre code'), 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).toBeNull();
                expect(rteObj.contentModule.getEditPanel().querySelectorAll('ol').length === 0).toBe(true);
                done();
            }, 50);
        });
        it('should remove the <br> element when the last child of the code block is a <br> and there is no preceding <br>, upon pressing the Delete key', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = `<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich text Editor<br></code></pre><p>Rich Text Editor 1</p>`;
            setCursorPoint(contentEle.querySelector('pre code').firstChild as Element, contentEle.querySelector('pre code').firstChild.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                expect(contentEle.querySelector("pre code").querySelectorAll("BR").length === 0).toBe(true);
                done();
            }, 50);
        });
        it('should merge the first <li> element with the code block when the code block’s next sibling is a list and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = `<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich</code></pre><ol><li>Text</li><li>Editor</li></ol>`;
            setCursorPoint(contentEle.querySelector('pre code').firstChild as Element, contentEle.querySelector('pre code').firstChild.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                expect(contentEle.querySelector("pre code").textContent === 'RichText').toBe(true);
                expect(contentEle.querySelector("ol").querySelectorAll('li').length === 1).toBe(true);
                done();
            }, 50);
        });
        it('Should merge the first <li> element with the code block when the code block’s next sibling contains a nested list and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = `<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich</code></pre><ol><li style="list-style-type: none;"><ol><li>Text</li><li>Text1</li></ol></li><li>Editor</li></ol>`;
            setCursorPoint(contentEle.querySelector('pre code').firstChild as Element, contentEle.querySelector('pre code').firstChild.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                expect(contentEle.querySelector("pre code").textContent === 'RichText').toBe(true);
                done();
            }, 50);
        });
        it('Should node delete the code block while the last is code block and the Delete key is pressed', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = `<p>Rich Text Editor</p><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>`;
            setCursorPoint(contentEle.querySelector('pre code') as Element, 0);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('code');
                expect(codeElem).not.toBeNull();
                done();
            }, 50);
        });
        it('Should remove the empty UL from the DOM', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            rteObj.enterKey = 'P';
            rteObj.dataBind();
            contentEle.innerHTML = `<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor</code></pre><ol><li>Rich 1</li></ol>`;
            setCursorPoint(contentEle.querySelector('pre code').firstChild as Element, contentEle.querySelector('pre code').firstChild.textContent.length);
            (rteObj as any).keyDown(keyBoardEventDel);
            setTimeout(() => {
                const codeElem = contentEle.querySelector('ul,ol');
                expect(codeElem).toBeNull();
                done();
            }, 50);
        });
    });

    describe('RichTextEditor: Code Block with Lists', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CodeBlock']
                },
            });
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
        it('should create a code block when cursor is inside a list item', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<ul><li>List item text</li></ul>';
            setCursorPoint(contentEle.querySelector('li').firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toBe('List item text');
            done();
        });

        it('should create an empty code block when an empty list item is selected', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<ul><li><br></li></ul>';
            setCursorPoint(contentEle.querySelector('li') as Element, 0);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toBe('');
            done();
        });

        it('should create a code block when selection spans multiple list items', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<ul><li>First item</li><li>Second item</li></ul>';
            const firstItem = contentEle.querySelector('li').firstChild;
            const secondItem = contentEle.querySelectorAll('li')[1].firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(
                document, firstItem, secondItem, 0, secondItem.textContent.length
            );
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toContain('First item');
            expect(preElement.textContent).toContain('Second item');
            done();
        });

        it('should create a code block when cursor is in a nested list item', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<ul><li>Parent item<ul><li>Nested item</li></ul></li></ul>';
            setCursorPoint(contentEle.querySelector('ul ul li').firstChild as Element, 5);
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toBe('Nested item');
            done();
        });
        it('should create a code block when selection spans from paragraph to list item', (done) => {
            const contentEle = rteObj.contentModule.getEditPanel();
            contentEle.innerHTML = '<p>Paragraph text</p><ul><li>List item text</li></ul>';
            const pNode = contentEle.querySelector('p').firstChild;
            const liNode = contentEle.querySelector('li').firstChild;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(
                document,
                pNode,
                liNode,
                5,
                6
            );
            const toolbar = rteObj.element.querySelector('.e-toolbar');
            const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
            (codeBlockBtn as HTMLElement).click();
            const preElement = contentEle.querySelector('pre[data-language]');
            expect(preElement).not.toBeNull();
            expect(preElement.querySelector('code')).not.toBeNull();
            expect(preElement.textContent).toContain("Paragraph textList item text");
            done();
        });
    });
});
describe('Code Block with Enter Key BR Functionality', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock']
            },
            enterKey: 'BR'
        });
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });

    it('should handle Tab key inside code block', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        contentEle.innerHTML = '<p>Rich Text Editor</p><p>function test() {</pre><p>Rich Text Editor</p>';
        const element1 = contentEle.querySelectorAll('p')[0].firstChild;
        const element2 = contentEle.querySelectorAll('p')[0].firstChild;
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, element1, element2, 0, 5);
        const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
        (codeBlockBtn as HTMLElement).click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('pre code');
            expect(codeContent).not.toBeNull();
            done();
        }, 50);
    });

    it('should handle Shift+Tab to remove indentation', (done) => {
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = 'Rich <br>Text <br>Editor<br>';
        const element1 = contentEle.childNodes[0];
        const element2 = contentEle.childNodes[4];
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, element1, element2, 0, 2);
        const codeBlockBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_codeBlock');
        (codeBlockBtn as HTMLElement).click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent).toBe('Rich <br>Text <br>Editor');
            done();
        }, 50);
    });
});
describe('Code Block with ReadOnly Property', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock']
            },
            readonly: true,
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' },
                    { language: 'html', label: 'HTML' }
                ]
            }
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('should not open dropdown when readonly property is true', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre>';
        const codeElement = contentEle.querySelector('code');
        setCursorPoint(codeElement.firstChild as Element, 5);
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const formatBtn = toolbar.querySelector('.e-dropdown-btn.e-rte-codeblock-dropdown') as HTMLElement;
        formatBtn.click();
        setTimeout(() => {
            const dropdown = document.querySelector('.e-rte-codeblock-dropdown.e-popup-open.e-popup');
            expect(dropdown === null).toBe(true);
            done();
        }, 100);
    });
});
describe('Code Block Selection All Content', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8, code: 'Backspace' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock']
            },
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('should remove code block when all content is selected and backspace is pressed', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>Test code</code></pre><p>Rich text Editor</p>';
        const codeElement = contentEle.querySelector('code');
        const pTag = contentEle.querySelector('p');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeElement.childNodes[0], pTag.childNodes[0], 0, pTag.childNodes[0].textContent.length);
        (rteObj as any).keyDown(keyBoardEvent);
        (rteObj as any).keyUp(keyBoardEvent);
        setTimeout(() => {
            expect(contentEle.querySelector('pre')).toBeNull();
            expect(contentEle.innerHTML).toBe('<p><br></p>');
            done();
        }, 50);
    });
});
describe('Code Block Indentation Functionality', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: false, which: 9, code: 'Tab' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });

    it('should handle Tab key to indent code within code block', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>function test() {\n  console.log("test");\n}</code></pre>';
        const codeElement = contentEle.querySelector('code').firstChild;
        setCursorPoint(codeElement as Element, 15);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\t')).toBeTruthy();
            done();
        }, 50);
    });

    it('should handle the decrease indentation when outdent toolbar icon is clicked in code block', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>\tfunction test() {\n        console.log("test");\n    }</code></pre>';
        const codeElement = contentEle.querySelector('code').childNodes[0];
        setCursorPoint(codeElement as Element, 1);
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const outdentBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_Outdent') as HTMLElement;
        outdentBtn.click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\t')).toBe(false);
            done();
        }, 50);
    });
    it('should handle the decrease indentation in the middle of the content when outdent toolbar icon is clicked in code block', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>function\ttest() {\n        console.log("test");\n    }</code></pre>';
        const codeElement = contentEle.querySelector('code').childNodes[0];
        setCursorPoint(codeElement as Element, 9);
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const outdentBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_Outdent') as HTMLElement;
        outdentBtn.click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\t')).not.toBeTruthy();
            done();
        }, 50);
    });


    it('should indent multiple lines when selection spans multiple lines', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>line 1<br>line 2<br>line 3</code></pre>';
        const codeElement = contentEle.querySelector('code');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(
            document,
            codeElement.firstChild,
            codeElement.lastChild,
            0,
            6
        );
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const outdentBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_Indent') as HTMLElement;
        outdentBtn.click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\tline 1')).toBeTruthy();
            expect(codeContent.includes('\tline 2')).toBeTruthy();
            expect(codeContent.includes('\tline 3')).toBeTruthy();
            done();
        }, 50);
    });
    it('should outdent multiple lines when selection spans multiple lines', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>\tline 1<br>\tline 2<br>\tline 3</code></pre>';
        const codeElement = contentEle.querySelector('code');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(
            document,
            codeElement.firstChild,
            codeElement.lastChild,
            1,
            4
        );
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const outdentBtn = toolbar.querySelector('#' + rteObj.getID() + '_toolbar_Outdent') as HTMLElement;
        outdentBtn.click();
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('line 1')).toBeTruthy();
            expect(codeContent.includes('line 2')).toBeTruthy();
            expect(codeContent.includes('line 3')).toBeTruthy();
            done();
        }, 50);
    });

    it('should maintain cursor position after indentation', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>var x = 10;</code></pre>';
        const codeElement = contentEle.querySelector('code').firstChild;
        setCursorPoint(codeElement as Element, 4);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            const selection = window.getSelection();
            expect(selection.anchorOffset >= 4).toBeTruthy();
            done();
        }, 50);
    });
});

describe('Code Block Tooltip Functionality', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should add the tooltip for the code block toolbar items', (done) => {
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const codeBlockBtn = toolbar.querySelectorAll('.e-toolbar-item')[0];
        expect((codeBlockBtn as any).title.indexOf("Insert Code Block") !== -1).toBeTruthy();
        done();
    });
});
describe('Code Block Toolbar Preselect', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            },
            value: 'Rich Text Editor'
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should preselect the code block when focusing the code block element', (done) => {
        setCursorPoint(rteObj.contentModule.getEditPanel().childNodes[0] as Element, 0);
        const toolbar = rteObj.element.querySelector('.e-toolbar');
        const codeBlockBtn = toolbar.querySelectorAll('.e-toolbar-item')[0];
        (codeBlockBtn.querySelector('button')).click();
        expect((codeBlockBtn.querySelector('button') as HTMLButtonElement).parentElement.parentElement.classList.contains('e-active')).toBe(true);
        done();
    });
    it('Should preselect the code block when focusing the code block element', (done) => {
        rteObj.value = `<p>Test 1</p><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Rich Text Editor</code></pre><p>Test 1</p>`;
        rteObj.dataBind();
        const contentEle = rteObj.contentModule.getEditPanel();
        const endElement = contentEle.querySelector('pre code').firstChild;
        const startElement = contentEle.querySelectorAll('p')[0].firstChild;
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(
            document,
            startElement,
            endElement,
            0,
            2
        );
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelectorAll('.e-toolbar-item')[0].querySelectorAll('button')[0];
        formatBtn.click();
        setTimeout(function () {
            const codeBlockBtn = toolbar.querySelectorAll('.e-toolbar-item')[0];
            expect((codeBlockBtn.querySelector('button') as HTMLButtonElement).parentElement.parentElement.classList.contains('e-active')).toBe(true);
            done();
        }, 50);
    });
});

describe('Code Block Table Functionality', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: false, which: 9, code: 'Tab' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('should apply code block to all selected table cells', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select e-multi-cells-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class="e-cell-select e-multi-cells-select"><br></td><td style="width: 33.3333%;" class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td></tr></tbody></table>';
        var codeElement = contentEle.querySelectorAll('td')[2];
        setCursorPoint(codeElement, 0);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('table td');
            expect(codeContent[0].querySelector('pre code')).not.toBeNull();
            expect(codeContent[1].querySelector('pre code')).not.toBeNull();
            expect(codeContent[2].querySelector('pre code')).not.toBeNull();
            done();
        }, 50);
    });
    it('should apply code block when cursor is placed inside a single table cell', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class="e-cell-select"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>';
        var codeElement = contentEle.querySelectorAll('td')[0];
        setCursorPoint(codeElement, 0);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('table td');
            expect(codeContent[0].querySelector('pre code')).not.toBeNull();
            expect(codeContent[1].querySelector('pre code')).toBeNull();
            done();
        }, 50);
    });
    it('should apply code block when the selection is inside a table cell containing text', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;" class="e-cell-select">Rich Text Editor</td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>';
        var codeElement = contentEle.querySelectorAll('td')[0];
        setCursorPoint(codeElement, 0);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('table td');
            expect(codeContent[0].querySelector('pre code')).not.toBeNull();
            expect(codeContent[1].querySelector('pre code')).toBeNull();
            done();
        }, 50);
    });
    it('Should split the code block into two, one before the table and one after the table.', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = `<p class="start">Rich Text Editor</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p class="end">Rich Text Editor</p>`;
        var start = contentEle.querySelector('p.start');
        var end = contentEle.querySelector('p.end');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 3, 4);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('pre code');
            expect(codeContent.length === 2).toBe(true);
            done();
        }, 50);
    });
});
describe('Code Block Shift + Tab Functionality', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: true, which: 9, code: 'Tab', action: 'shift-tab' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });

    it('should handle Shift Tab key to outdent code within code block', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>function\ttest() {\n  console.log("test");\n}</code></pre>';
        const codeElement = contentEle.querySelector('code').firstChild;
        setCursorPoint(codeElement as Element, 9);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\t')).not.toBeTruthy();
            done();
        }, 50);
    });
    it('should handle Shift + Tab key to outdent code within code block while selecting a content', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="JavaScript"><code>\tfunctiontest() {\n  console.log("test");\n}</code></pre>';
        const codeElement = contentEle.querySelector('code').firstChild;
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, codeElement, codeElement, 3, 4);
        (rteObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            const codeContent = contentEle.querySelector('code').innerHTML;
            expect(codeContent.includes('\t')).not.toBeTruthy();
            done();
        }, 50);
    });
});
describe('962048 - Pasting code into Code Block moves focus outside and creates Inline Code next to it', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Bold', 'Italic']
            },
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should insert into the code block when paste as a plain text', (done) => {
        const contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = '<pre data-language="Plain text" spellcheck="false"><code class="language-plaintext"><br></code></pre>';
        const codeAfter = contentEle.querySelectorAll('pre')[0].firstChild;
        setCursorPoint(codeAfter, 0);
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', 'formatted code');
        const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
        rteObj.contentModule.getEditPanel().dispatchEvent(pasteEvent);
        setTimeout(() => {
            const codeBlockContent = contentEle.querySelector('code').textContent;
            const textChanged = codeBlockContent === "formatted code";
            expect(textChanged).toBe(true);
            expect(contentEle.querySelectorAll('pre').length).toBe(1);
            done();
        }, 100);
    });
});
describe('Code Block with Blockquote Functionality', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: false, which: 9, code: 'Tab' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });

    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should split the code block into two, one before the Blockquote and one after the Blockquote.', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = `<p class="start">Rich Text Editor 1</p><blockquote>Rich Text Editor 2</blockquote><p class="end">Rich Text Editor 3</p>`;
        var start = contentEle.querySelector('p.start');
        var end = contentEle.querySelector('p.end');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 3, 4);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('pre[data-language]');
            expect(codeContent.length === 3).toBe(true);
            expect(contentEle.innerHTML === `<pre data-language="JavaScript" spellcheck="false"><code class="language-javascript">Rich Text Editor 1</code></pre><blockquote><pre data-language="JavaScript" spellcheck="false"><code class="language-javascript">Rich Text Editor 2</code></pre></blockquote><pre data-language="JavaScript" spellcheck="false"><code class="language-javascript">Rich Text Editor 3</code></pre>`);
            done();
        }, 50);
    });
    it('Should split the code block into two, one before the Blockquote and one after the Blockquote when the code block has multiple block elements', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = `<p class="start">Rich 1</p><blockquote><p>Rich 2</p><p>Rich 3</p></blockquote><p class="end">Rich 4</p>`;
        var start = contentEle.querySelector('p.start');
        var end = contentEle.querySelector('p.end');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 3, 4);
        var toolbar = rteObj.element.querySelector('.e-toolbar');
        var formatBtn: HTMLElement = toolbar.querySelector('.e-split-btn');
        formatBtn.click();
        setTimeout(function () {
            var codeContent = contentEle.querySelectorAll('pre[data-language]');
            expect(codeContent.length === 3).toBe(true);
            done();
        }, 50);
    });
});

describe('977351 - Blazor Server: Unable to Insert Code Block After Deleting Table via Quick Toolbar', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'Tab', stopPropagation: () => { }, shiftKey: false, which: 9, code: 'Tab' };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['CodeBlock', 'Indent', 'Outdent']
            },
            codeBlockSettings: {
                languages: [
                    { language: 'javascript', label: 'JavaScript' },
                    { language: 'typescript', label: 'TypeScript' }
                ]
            }
        });
    });
    afterAll((done) => {
        destroy(rteObj);
        done();
    });
    it('Should set the range to the next sibling after deleting the table', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
   <colgroup>
      <col style="width: 50%;">
      <col style="width: 50%;">
   </colgroup>
   <tbody>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
   </tbody>
</table><h1>Rich Text Editor</h1>`;
        rteObj.focusIn();
        const cell = rteObj.contentModule.getEditPanel().querySelector('td');
        const range = document.createRange();
        range.setStart(cell, 0);
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
            (document.querySelectorAll(".e-rte-quick-toolbar.e-table-quicktoolbar .e-toolbar-item")[1].firstChild as HTMLElement).click()
            setTimeout(() => {
                const range = window.getSelection().getRangeAt(0);
                expect(range.startContainer.parentElement.nodeName === 'H1').toBe(true);
                expect(range.startOffset === 0 && range.endOffset === 0).toBe(true);
                done();
            }, 200);
        }, 200);
    });
    it('Should set the range before the BR element after deleting the table', function (done) {
        var contentEle = rteObj.contentModule.getEditPanel();
        contentEle.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
   <colgroup>
      <col style="width: 50%;">
      <col style="width: 50%;">
   </colgroup>
   <tbody>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
   </tbody>
</table><p><br></p>`;
        rteObj.focusIn();
        const cell = rteObj.contentModule.getEditPanel().querySelector('td');
        const range = document.createRange();
        range.setStart(cell, 0);
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
            (document.querySelectorAll(".e-rte-quick-toolbar.e-table-quicktoolbar .e-toolbar-item")[1].firstChild as HTMLElement).click()
            setTimeout(() => {
                const range = window.getSelection().getRangeAt(0);
                expect(range.startContainer.nodeName === 'P').toBe(true);
                expect(range.startOffset === 0 && range.endOffset === 0).toBe(true);
                done();
            }, 200);
        }, 200);
    });
});
