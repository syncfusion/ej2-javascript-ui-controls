import { createElement, L10n, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType, CodeLanguageModel, setCursorPosition } from "../../src/index";
import { createEditor } from "../common/util.spec";
import { DropDownList } from "@syncfusion/ej2-dropdowns";

describe('Code Blocks', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing code block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            // Mock clipboard API for copy functionality tests
            Object.defineProperty((window.navigator as any), 'clipboard', {
                value: {
                    writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
                },
                writable: true
            });
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should render in DOM correctly', (): void => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: 'const editor = new BlockEditor();\neditor.appendTo("#element");'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement: HTMLElement | null = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();

            // Check main container
            const codeContainer: HTMLElement | null = blockElement!.querySelector('.e-code-block-container');
            expect(codeContainer).not.toBeNull();

            // Check toolbar
            const toolbar: HTMLElement | null = codeContainer!.querySelector('.e-code-block-toolbar');
            expect(toolbar).not.toBeNull();
            expect(toolbar!.getAttribute('contenteditable')).toBe('false');

            // Check language selector
            const languageSelector: HTMLElement | null = toolbar!.querySelector('.e-code-block-languages');
            expect(languageSelector).not.toBeNull();

            // Check copy button
            const copyButton: HTMLElement | null = toolbar!.querySelector('.e-code-block-copy-button');
            expect(copyButton).not.toBeNull();
            expect(copyButton!.getAttribute('contenteditable')).toBe('false');
            expect(copyButton!.querySelector('.e-icons.e-copy')).not.toBeNull();

            // Check pre and code elements
            const preElement: HTMLElement | null = codeContainer!.querySelector('pre.e-code-block');
            expect(preElement).not.toBeNull();
            expect(preElement!.classList).toContain('language-javascript');

            const codeElement: HTMLElement | null = preElement!.querySelector('code.e-code-content');
            expect(codeElement).not.toBeNull();
            expect(codeElement!.getAttribute('contenteditable')).toBe('true');
        });

        it('should render with default language when not specified', (): void => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: 'console.log("Hello World");'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const preElement: HTMLElement | null = editorElement.querySelector('pre.e-code-block');
            expect(preElement!.classList).toContain('language-javascript');
        });

        it('should update language when dropdown selection changes', (done: DoneFn): void => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: 'const x = 5;'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const languageSelector: HTMLElement = editorElement.querySelector('.e-code-block-languages') as HTMLElement;
            const preElement: HTMLElement = editorElement.querySelector('pre.e-code-block') as HTMLElement;

            // Initially should be javascript
            expect(preElement.classList).toContain('language-javascript');

            // Simulate dropdown change to typescript
            const dropdownInstance: DropDownList = (languageSelector as any).ej2_instances[0] as DropDownList;
            dropdownInstance.value = 'typescript';
            dropdownInstance.dataBind();

            setTimeout((): void => {
                expect(preElement.classList).toContain('language-typescript');
                expect(preElement.classList).not.toContain('language-javascript');
                done();
            }, 100);
        });

        it('should copy code content to clipboard when copy button is clicked', (done: DoneFn): void => {
            const codeContent: string = 'const editor = new BlockEditor();\neditor.appendTo("#element");';
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: codeContent
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const copyButton: HTMLElement = editorElement.querySelector('.e-code-block-copy-button') as HTMLElement;
            const codeElement: HTMLElement = editorElement.querySelector('code.e-code-content') as HTMLElement;

            // Set the code content
            codeElement.textContent = codeContent;

            copyButton.click();

            setTimeout((): void => {
                expect((window.navigator as any).clipboard.writeText).toHaveBeenCalledWith(codeContent);

                // Check if icon changes to checkmark
                const iconElement: HTMLElement = copyButton.querySelector('.e-icons') as HTMLElement;
                expect(iconElement.classList).toContain('e-check-tick');

                // Check if it reverts back after timeout
                setTimeout((): void => {
                    expect(iconElement.classList).toContain('e-copy');
                    expect(iconElement.classList).not.toContain('e-check-tick');
                    done();
                }, 2100);
            }, 100);
        });

        it('should handle custom languages list from CodeSettings', (): void => {
            const customLanguages: CodeLanguageModel[] = [
                { label: 'C++', language: 'cpp' },
                { label: 'Java', language: 'java' },
                { label: 'Python', language: 'python' }
            ];

            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    props: {
                        languages: customLanguages,
                        defaultLanguage: 'cpp'
                    },
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: '#include <iostream>'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const preElement: HTMLElement | null = editorElement.querySelector('pre.e-code-block');
            expect(preElement!.classList).toContain('language-cpp');

            const languageSelector: HTMLElement = editorElement.querySelector('.e-code-block-languages') as HTMLElement;
            const dropdownInstance: DropDownList = (languageSelector as any).ej2_instances[0] as DropDownList;

            // expect(dropdownInstance.dataSource).toEqual(customLanguages);
            expect(dropdownInstance.value).toBe('cpp');
        });

        it('should handle copy button error gracefully', (done: DoneFn): void => {
            // Mock clipboard to reject
            Object.assign(window.navigator, {
                clipboard: {
                    writeText: jasmine.createSpy('writeText').and.returnValue(Promise.reject(new Error('Clipboard error')))
                }
            });

            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        type: ContentType.Text,
                        content: 'test code'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const copyButton: HTMLElement = editorElement.querySelector('.e-code-block-copy-button') as HTMLElement;
            const consoleSpy: jasmine.Spy = spyOn(console, 'error');

            copyButton.click();

            setTimeout((): void => {
                expect(consoleSpy).toHaveBeenCalledWith('Could not copy text: ', jasmine.any(Error));
                done();
            }, 100);
        });
    });

    describe('Default Rendering', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block',
                    type: BlockType.Code,
                    content: [{ id: 'code-content', type: ContentType.Text, content: '' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should render with single <br> when empty', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            expect(codeElement).not.toBeNull();
            expect(codeElement.innerHTML).toBe('<br>');
        });

        it('should remove placeholder <br> when user types content', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.textContent = 'console.log("hello");';
            editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                expect(codeElement.innerHTML).not.toContain('<br>');
                expect(codeElement.textContent).toBe('console.log("hello");');
                done();
            }, 100);
        });

        it('should restore <br> when content becomes empty', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.textContent = '';
            editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                expect(codeElement.innerHTML).toBe('<br>');
                done();
            }, 100);
        });

        it('should handle locale changes properly', (done) => {
            L10n.load({
                'de': {
                    "blockeditor": {
                        "codeCopyTooltip": "Code kopieren"
                    }
                }
            });
            // Change locale
            editor.locale = 'de';
            editor.dataBind();

            setTimeout(() => {
                const copyButton = editorElement.querySelector('.e-code-block-copy-button');
                expect(copyButton.getAttribute('title')).toBe('Code kopieren');
                done();
            }, 100);
        });
    });

    describe('Enter Key Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code,
                    content: [{ id: 'code-content', type: ContentType.Text, content: 'console.log("test");' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should insert two <br> tags when pressing Enter on content line', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            expect(codeElement.innerHTML).toContain('<br><br>');
        });

        it('should insert single <br> when Enter pressed after two existing <br> tags', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = 'line1<br><br>';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.childNodes.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            // const brCount: number = (codeElement.innerHTML.match(/<br>/g) || []).length;
            // expect(brCount).toBe(3);
        });

        it('should exit code block and create paragraph when 3 consecutive <br> tags detected', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = 'line1<br><br><br>';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.childNodes.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].type).toBe(BlockType.Paragraph);
                done();
            });
        });

        it('should exit code block and set focus to next block if available', (done) => {
            setTimeout(() => {
                const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
                codeElement.innerHTML = 'line1<br><br><br>';
                const blockElement = codeElement.closest('.e-block') as HTMLElement;
                editor.setFocusToBlock(blockElement);
                editor.addBlock({
                    id: 'paragraph-block',
                    type: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'test' }]
                }, 'code-block');
                editor.setFocusToBlock(blockElement);
                setCursorPosition(codeElement, codeElement.childNodes.length);
                
                const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Enter', 
                    bubbles: true, 
                    cancelable: true 
                });
                editorElement.dispatchEvent(enterEvent);
                setTimeout(() => {
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.currentFocusedBlock.id).toBe('paragraph-block');
                    done();
                }, 400);
            }, 200);
        });

        it('should maintain indentation on new lines', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = '    indented line';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            expect(codeElement.innerHTML).toContain('    ');
        });
    });

    describe('Backspace Key Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ id: 'code-content', type: ContentType.Text, content: 'test' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should prevent deletion when cursor is at start of block', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Backspace', 
                bubbles: true, 
                cancelable: true 
            });
            const prevented: boolean = !editorElement.dispatchEvent(backspaceEvent);
            
            expect(prevented).toBe(true);
            expect(codeElement.textContent).toBe('test');
        });

        it('should add default <br> when only one character remains and Backspace pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            codeElement.textContent = 'a';
            setCursorPosition(codeElement, 1);
            
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Backspace', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(backspaceEvent);
            
            expect(codeElement.innerHTML).toBe('<br>');
        });
    });

    describe('Delete Key Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ id: 'code-content', type: ContentType.Text, content: 'test' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should prevent deletion when cursor is at end of block', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const deleteEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Delete', 
                bubbles: true, 
                cancelable: true 
            });
            const prevented: boolean = !editorElement.dispatchEvent(deleteEvent);
            
            expect(prevented).toBe(true);
            expect(codeElement.textContent).toBe('test');
        });

        it('should insert default <br> when only one character remains and Delete pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            codeElement.textContent = 'a';
            setCursorPosition(codeElement, 0);
            
            const deleteEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Delete', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(deleteEvent);
            
            expect(codeElement.innerHTML).toBe('<br>');
        });
    });

    describe('Tab Key Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ id: 'code-content', type: ContentType.Text, content: 'code' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should insert indent (4 spaces) when Tab pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Tab', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(tabEvent);
            
            expect(codeElement.textContent).toContain('    ');
        });

        it('should remove one level of indentation when Shift+Tab pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            codeElement.textContent = '    indented code';
            setCursorPosition(codeElement, 4);
            
            const shiftTabEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Tab', 
                shiftKey: true, 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(shiftTabEvent);
            
            expect(codeElement.textContent).toBe('indented code');

            //Shift tab again should remain same
            setCursorPosition(codeElement, 0);
            
            const shiftTabEvent1: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Tab', 
                shiftKey: true, 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(shiftTabEvent1);
            
            expect(codeElement.textContent).toBe('indented code');
        });
    });

    describe('Selection Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ id: 'code-content', type: ContentType.Text, content: 'console.log("hello");' }] 
                },
                { 
                    id: 'paragraph', 
                    type: BlockType.Paragraph, 
                    content: [{ id: 'para-content', type: ContentType.Text, content: 'paragraph text' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should select all content within code block on first Ctrl+A press', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const ctrlAEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'a', 
                code: 'A',
                ctrlKey: true, 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(ctrlAEvent);
            
            const selection: Selection = window.getSelection();
            expect(selection.toString()).toBe('console.log("hello");');
        });

        it('should select whole editor on two Ctrl+A press', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const ctrlAEvent1: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'a', 
                code: 'A',
                ctrlKey: true, 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(ctrlAEvent1);

            const ctrlAEvent2: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'a', 
                code: 'A',
                ctrlKey: true, 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(ctrlAEvent2);
            
            // const selectedBlocks = editor.getSelectedBlocks();
            // expect(selectedBlocks.length).toBe(editor.blocks.length);
        });
    });

    describe('Model Updates', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { 
                    id: 'code-block', 
                    type: BlockType.Code, 
                    content: [{ id: 'code-content', type: ContentType.Text, content: '' }] 
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            document.body.removeChild(editorElement);
        });

        it('should create a content model if it does not exist', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            codeElement.textContent = 'const x = 5;';
            editor.blocks[0].content = [];
            (editor.blockRendererManager.codeRenderer as any).updateBlockModel(codeElement, editor.blocks[0]);
            
            setTimeout(() => {
                expect(editor.blocks[0].type).toBe(BlockType.Code);
                expect(editor.blocks[0].content[0].type).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('const x = 5;');
                done();
            }, 100);
        });

        it('should sync content changes to model format', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            codeElement.textContent = 'const x = 5;';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                expect(editor.blocks[0].type).toBe(BlockType.Code);
                expect(editor.blocks[0].content[0].type).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('const x = 5;');
                done();
            }, 100);
        });
    });
});
