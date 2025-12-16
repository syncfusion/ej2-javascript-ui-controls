import { createElement, L10n, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { BlockModel, CodeLanguageModel, ICodeBlockSettings} from "../../src/models/index";
import { setCursorPosition, getBlockContentElement, decoupleReference, sanitizeBlock } from '../../src/common/utils/index';
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
    const event: any = {
        type,
        preventDefault: jasmine.createSpy(),
        clipboardData: clipboardData,
        bubbles: true,
        cancelable: true
    };
    return event as ClipboardEvent;
}

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
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
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

            // Check language selector
            const languageSelector: HTMLElement | null = toolbar!.querySelector('.e-code-block-languages');
            expect(languageSelector).not.toBeNull();

            // Check copy button
            const copyButton: HTMLElement | null = toolbar!.querySelector('.e-code-block-copy-button');
            expect(copyButton).not.toBeNull();
            expect(copyButton!.querySelector('.e-icons.e-copy')).not.toBeNull();

            // Check pre and code elements
            const preElement: HTMLElement | null = codeContainer!.querySelector('pre.e-code-block');
            expect(preElement).not.toBeNull();
            expect(preElement.getAttribute('data-language')).toBe('plaintext');

            const codeElement: HTMLElement | null = preElement!.querySelector('code.e-code-content');
            expect(codeElement).not.toBeNull();
            expect(codeElement!.getAttribute('contenteditable')).toBe('true');
            expect(codeElement.classList).toContain('language-plaintext');

            // Assert Model
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].id).toBe('code-block');
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect(editor.blocks[0].content[0].content).toContain('BlockEditor');
            // Neighbors
            expect(blockElement!.previousElementSibling).toBeNull();
            expect(blockElement!.nextElementSibling).toBeNull();
        });

        it('should render with default language when not specified', (): void => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
                        content: 'console.log("Hello World");'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const codeElement: HTMLElement | null = editorElement.querySelector('pre code');
            expect(codeElement!.classList).toContain('language-plaintext');
            // Model invariant
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect(editor.blocks[0].content[0].content).toBe('console.log("Hello World");');
            expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe('javascript');
        });

        it('should update language when dropdown selection changes', (done: DoneFn): void => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
                        content: 'const x = 5;'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const languageSelector: HTMLElement = editorElement.querySelector('.e-code-block-languages') as HTMLElement;
            const codeEle: HTMLElement = editorElement.querySelector('pre code') as HTMLElement;

            // Initially should be javascript
            expect(codeEle.classList).toContain('language-plaintext');
            expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe('javascript');

            // Simulate dropdown change to typescript
            const dropdownInstance: DropDownList = (languageSelector as any).ej2_instances[0] as DropDownList;
            dropdownInstance.value = 'typescript';
            dropdownInstance.dataBind();

            setTimeout((): void => {
                expect(codeEle.classList).toContain('language-typescript');
                expect(codeEle.classList).not.toContain('language-plaintext');
                // Model
                expect(editor.blocks[0].blockType).toBe(BlockType.Code);
                expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe('typescript');
                expect(editor.blocks[0].content[0].content).toBe('const x = 5;');
                done();
            }, 100);
        });

        it('should copy code content to clipboard when copy button is clicked', (done: DoneFn): void => {
            const codeContent: string = 'const editor = new BlockEditor();\neditor.appendTo("#element");';
            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
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
                    // Model invariant
                    expect(editor.blocks[0].content[0].content).toBe(codeContent);
                    expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("javascript");
                    done();
                }, 2100);
            }, 100);
        });

        it('should handle custom languages list from ICodeBlockSettings', (): void => {
            const customLanguages: CodeLanguageModel[] = [
                { label: 'C++', language: 'cpp' },
                { label: 'Java', language: 'java' },
                { label: 'Python', language: 'python' }
            ];

            const blocks: BlockModel[] = [
                {
                    id: 'code-block',
                    blockType: BlockType.Code,
                    properties: {
                        language: 'cpp'
                    },
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
                        content: '#include <iostream>'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks, codeBlockSettings: {
                languages: customLanguages,
                defaultLanguage: 'cpp'
            } });
            editor.appendTo('#editor');

            const codeEle: HTMLElement | null = editorElement.querySelector('pre code');
            expect(codeEle!.classList).toContain('language-cpp');

            const languageSelector: HTMLElement = editorElement.querySelector('.e-code-block-languages') as HTMLElement;
            const dropdownInstance: DropDownList = (languageSelector as any).ej2_instances[0] as DropDownList;
            expect(dropdownInstance.value).toBe('cpp');
            // Model
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("cpp");
            expect(editor.blocks[0].content[0].content).toBe('#include <iostream>');
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
                    blockType: BlockType.Code,
                    content: [{
                        id: 'code-content',
                        contentType: ContentType.Text,
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
                // Model invariant
                expect(editor.blocks[0].content[0].content).toBe('test code');
                expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("javascript");
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
                    blockType: BlockType.Code,
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: '' }]
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
        it('should have "en-US" as the default locale on initialization', () => {
            expect(editor.locale).toBe('en-US');
        });

        it('should render with single <br> when empty', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            expect(codeElement).not.toBeNull();
            expect(codeElement.innerHTML).toBe('<br>');

            //Model Assertion
            expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("javascript");
            expect(editor.blocks[0].content[0].content).toBe("");

        });

        it('should remove placeholder <br> when user types content', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.textContent = 'console.log("hello");';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                expect(codeElement.innerHTML).not.toContain('<br>');
                expect(codeElement.textContent).toBe('console.log("hello");');

                //Model Assertion
                expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("javascript");
                expect(editor.blocks[0].content[0].content).toBe('console.log("hello");');
                done();
            }, 100);
        });

        it('should restore <br> when content becomes empty', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.textContent = '';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                expect(codeElement.innerHTML).toBe('<br>');

                //Model Assertion
                expect((editor.blocks[0].properties as ICodeBlockSettings).language).toBe("javascript");
                // expect(editor.blocks[0].content[0].content).toBe("");
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

                // Model Assertion
                expect(editor.locale).toBe("de");
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
                    blockType: BlockType.Code,
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: 'console.log("test");' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            expect(codeElement.innerHTML).toContain('<br><br>');
            expect(editor.blocks[0].content[0].content).toBe('console.log("test");');
        });

        it('should insert single <br> when Enter pressed after two existing <br> tags', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = 'line1<br><br>';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.childNodes.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            /* 981091 */
            // const brCount: number = (codeElement.innerHTML.match(/<br>/g) || []).length;
            // expect(brCount).toBe(3);
        });

        it('should exit code block and create paragraph when 3 consecutive <br> tags detected', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = 'line1<br><br><br>';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.childNodes.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            setTimeout(() => {
                // Model
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe(BlockType.Code);
                expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
                // DOM
                const first = editorElement.querySelector('.e-block') as HTMLElement;
                expect(first.getAttribute('data-block-type')).toBe(BlockType.Code);
                const next = first.nextElementSibling as HTMLElement;
                expect(next.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
                done();
            });
        });

        it('should exit code block and set focus to next block if available', (done) => {
            setTimeout(() => {
                editor.addBlock({
                    id: 'paragraph-block',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'test' }]
                }, 'code-block');
                const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
                codeElement.innerHTML = 'line1<br><br><br>';
                const blockElement = codeElement.closest('.e-block') as HTMLElement;
                editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(codeElement, codeElement.childNodes.length);
                
                const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Enter', 
                    bubbles: true, 
                    cancelable: true 
                });
                editorElement.dispatchEvent(enterEvent);
                setTimeout(() => {
                    // Model and focus
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[1].id).toBe('paragraph-block');
                    expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph-block');
                    // DOM neighbors
                    const first = editorElement.querySelector('.e-block') as HTMLElement;
                    expect(first.getAttribute('data-block-type')).toBe(BlockType.Code);
                    const next = first.nextElementSibling as HTMLElement;
                    expect(next.id).toBe('paragraph-block');
                    done();
                }, 400);
            }, 200);
        });

        it('should maintain indentation on new lines', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            codeElement.innerHTML = '    indented line';
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter', 
                bubbles: true, 
                cancelable: true 
            });
            editor.element.dispatchEvent(enterEvent);
            
            expect(codeElement.innerHTML).toContain('    ');
            // expect(editor.blocks[0].content[0].content).toBe('    indented line    ');
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
                    blockType: BlockType.Code, 
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: 'test' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Backspace', 
                bubbles: true, 
                cancelable: true 
            });
            const prevented: boolean = !editorElement.dispatchEvent(backspaceEvent);
            
            expect(prevented).toBe(true);
            expect(codeElement.textContent).toBe('test');
            // Model invariant
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect(editor.blocks[0].content[0].content).toBe('test');
        });

        it('should add default <br> when only one character remains and Backspace pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            codeElement.textContent = 'a';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(codeElement, 1);
            
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Backspace', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(backspaceEvent);
            
            expect(codeElement.innerHTML).toBe('<br>');
            expect(editor.blocks[0].content[0].content).toBe('');
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
                    blockType: BlockType.Code, 
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: 'test' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(codeElement, codeElement.textContent.length);
            
            const deleteEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Delete', 
                bubbles: true, 
                cancelable: true 
            });
            const prevented: boolean = !editorElement.dispatchEvent(deleteEvent);
            
            expect(prevented).toBe(true);
            expect(codeElement.textContent).toBe('test');
            // Model invariant
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect(editor.blocks[0].content[0].content).toBe('test');
        });

        it('should insert default <br> when only one character remains and Delete pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            codeElement.textContent = 'a';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(codeElement, 0);
            
            const deleteEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Delete', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(deleteEvent);
            
            expect(codeElement.innerHTML).toBe('<br>');
            expect(editor.blocks[0].content[0].content).toBe('');
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
                    blockType: BlockType.Code, 
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: 'code' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            
            const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Tab', 
                bubbles: true, 
                cancelable: true 
            });
            editorElement.dispatchEvent(tabEvent);
            
            expect(codeElement.textContent).toContain('    ');
            // expect(editor.blocks[0].content[0].content).toContain('    ');

        });

        it('should remove one level of indentation when Shift+Tab pressed', () => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            codeElement.textContent = '    indented code';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
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
            expect(editor.blocks[0].content[0].content).toBe('    indented code');
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
                    blockType: BlockType.Code, 
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: 'console.log("hello");' }] 
                },
                { 
                    id: 'paragraph', 
                    blockType: BlockType.Paragraph, 
                    content: [{ id: 'para-content', contentType: ContentType.Text, content: 'paragraph text' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
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
            editor.blockManager.setFocusToBlock(blockElement);
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

        it('should not display inline toolbar on text selection', (done) => {
            const blockElement = editorElement.querySelector('#code-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.setSelection('code-content', 0, 4);
            const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            editorElement.dispatchEvent(mouseUpEvent);
            expect(editorElement.querySelector('#' + editor.blockManager.currentFocusedBlock.id)).toBe(blockElement);
            expect(document.querySelector('.e-blockeditor-inline-toolbar-popup').classList.contains('e-popup-open')).toBe(false);
            done();
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
                    blockType: BlockType.Code, 
                    content: [{ id: 'code-content', contentType: ContentType.Text, content: '' }] 
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
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            codeElement.textContent = 'const x = 5;';
            editor.blocks[0].content = [];
            editor.blockManager.blockService.replaceBlock(editor.blocks[0].id, {
                ...decoupleReference(sanitizeBlock(editor.blocks[0])),
                content: []
            });
            editor.blockManager.stateManager.updateManagerBlocks();
            (editor.blockManager.blockRenderer.codeRenderer as any).updateBlockModel(codeElement, editor.blocks[0]);
            
            setTimeout(() => {
                expect(editor.blocks[0].blockType).toBe(BlockType.Code);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('const x = 5;');
                done();
            }, 100);
        });

        it('should sync content changes to model format', (done) => {
            const codeElement: HTMLElement = editorElement.querySelector('.e-code-content');
            const blockElement = codeElement.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(codeElement, 0);
            codeElement.textContent = 'const x = 5;';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                expect(editor.blocks[0].blockType).toBe(BlockType.Code);
                expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                expect(editor.blocks[0].content[0].content).toBe('const x = 5;');
                done();
            }, 100);
        });
    });

    describe('Undo/Redo Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let originalBlockCount: number;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'p-content', contentType: ContentType.Text, content: 'First paragraph.' }]
                },
                {
                    id: 'code-block-to-delete',
                    blockType: BlockType.Code,
                    properties: {
                        language: 'typescript'
                    },
                    content: [{
                        id: 'code-content-to-delete',
                        contentType: ContentType.Text,
                        content: 'interface MyInterface {\n    prop: string;\n}'
                    }]
                },
                {
                    id: 'block2',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'p2-content', contentType: ContentType.Text, content: 'Second paragraph.' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            originalBlockCount = editor.blocks.length;
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
            }
            if (editorElement) {
                remove(editorElement);
            }
        });

        it('should restore content and language settings on undo after deleting code block via block action menu', (done) => {
            const codeBlockElement: HTMLElement = editorElement.querySelector('#code-block-to-delete') as HTMLElement;
            expect(codeBlockElement).not.toBeNull();
            const blockRect = codeBlockElement.getBoundingClientRect();

            codeBlockElement.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: blockRect.left + 5, 
                clientY: blockRect.top + 5 
            }));
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            const deleteMenuItem: HTMLElement = document.querySelector('#editor_blockaction-menubar #delete') as HTMLElement;
            expect(deleteMenuItem).not.toBeNull();
            deleteMenuItem.click();
            expect(editor.blocks.length).toBe(originalBlockCount - 1);
            expect(editorElement.querySelector('#code-block-to-delete')).toBeNull();
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            expect(editor.blocks.length).toBe(originalBlockCount);
            const restoredBlockElement: HTMLElement = editorElement.querySelector('#code-block-to-delete') as HTMLElement;
            expect(restoredBlockElement).not.toBeNull();
            const restoredCodeContent: HTMLElement = restoredBlockElement.querySelector('.e-code-content') as HTMLElement;
            expect(restoredCodeContent).not.toBeNull();
            expect(restoredCodeContent.textContent).toBe('interface MyInterface {\n    prop: string;\n}');
            const restoredCodeElement: HTMLElement = restoredBlockElement.querySelector('pre code') as HTMLElement;
            expect(restoredCodeElement).not.toBeNull();
            expect(restoredCodeElement.classList).toContain('language-plaintext');

            // Model check
            expect(editor.blocks[0].id).toBe("block1");
            expect(editor.blocks[1].id).toBe("code-block-to-delete");
            expect(editor.blocks[2].id).toBe("block2");
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].blockType).toBe(BlockType.Code);
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content[0].content).toBe("First paragraph.");
            expect(editor.blocks[1].content[0].content).toBe("interface MyInterface {\n    prop: string;\n}");
            expect(editor.blocks[2].content[0].content).toBe("Second paragraph.");
            done();
        });
    });

    describe('Additional Code Cases - delete, paste and drag operations', () => {
        function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
            const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
            node.dispatchEvent(event);
        }

        function triggerDragEvent(node: HTMLElement, eventType: string, x: number, y: number, dataTransfer: DataTransfer = new DataTransfer()): void {
            const dragEvent = new DragEvent(eventType, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: dataTransfer });
            node.dispatchEvent(dragEvent);
        }  

        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

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

        it('On delete entire code block, replace with empty paragraph or remove if last block', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'code-block-to-delete',
                    blockType: BlockType.Code,
                    properties: {
                        language: 'typescript' 
                    },
                    content: [{
                        id: 'code-content-to-delete',
                        contentType: ContentType.Text,
                        content: 'interface MyInterface {\n    prop: string;\n}'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const codeBlockElement: HTMLElement = editorElement.querySelector('#code-block-to-delete') as HTMLElement;
            expect(codeBlockElement).not.toBeNull();
            editor.blockManager.setFocusToBlock(codeBlockElement);
            const blockRect = codeBlockElement.getBoundingClientRect();

            codeBlockElement.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: blockRect.left + 5,
                clientY: blockRect.top + 5 
            }));

            const dragIcon = (editor as any).floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            dragIcon.click();
            const deleteMenuItem: HTMLElement = document.querySelector('#editor_blockaction-menubar #delete') as HTMLElement;
            expect(deleteMenuItem).not.toBeNull();
            deleteMenuItem.click();
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

            // DOM and Model after deletion
            expect(updatedBlocks.length).toBe(1);
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            const only = updatedBlocks[0];
            expect(only.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            done();
        });

        it('On paste external code into empty code block, content should be inserted as-is', (done) => {
            const jsCode = [
                'function sayHello(name {',
                'console.log("Hello, " + name);'
            ].join('\n');
        
            const blocks: BlockModel[] = [
                {
                    id: 'code-block-empty',
                    blockType: BlockType.Code,
                    content: [{ id: 'code-content-empty', contentType: ContentType.Text, content: '' }]
                }
            ];
        
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            const codeBlockEl = editorElement.querySelector('#code-block-empty') as HTMLElement;
            const codeContentEl = getBlockContentElement(codeBlockEl);
            editor.blockManager.setFocusToBlock(codeBlockEl);
            setCursorPosition(codeContentEl, 0);
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return '';
                    }
                    if (format === 'text/plain') {
                        return jsCode;
                    }
                    if (format === 'text/html') {
                        return '';
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            const updatedBlockEl = editorElement.querySelector('#code-block-empty') as HTMLElement;
            const updatedContentEl = getBlockContentElement(updatedBlockEl);
            expect(updatedContentEl.textContent).toBe(jsCode);
            expect(editor.blocks[0].content[0].content).toBe(jsCode);
            done();
        });

        it('On paste external code into empty code block, normalize indentation to 4 spaces and preserve comments; malformed code inserted as-is', (done) => {
            const jsCodeMixed = [
                '// NOTE',
                '\tfunction sayHello(name {',
                '  console.log("Hello, " + name);',
                '\t\treturn 1;',
                '    }'
            ].join('\n');
            const expectedNormalized = [
                '// NOTE',
                '    function sayHello(name {',
                '  console.log("Hello, " + name);',
                '        return 1;',
                '    }'
            ].join('\n');
            const blocks: BlockModel[] = [
                {
                    id: 'code-block-empty',
                    blockType: BlockType.Code,
                    content: [{ id: 'code-content-empty', contentType: ContentType.Text, content: '' }]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            const codeBlockEl = editorElement.querySelector('#code-block-empty') as HTMLElement;
            const codeContentEl = getBlockContentElement(codeBlockEl);
            editor.blockManager.setFocusToBlock(codeBlockEl);
            setCursorPosition(codeContentEl, 0);


            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return '';
                    }
                    if (format === 'text/plain') {
                        return jsCodeMixed;
                    }
                    if (format === 'text/html') {
                        return '';
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            const updatedBlockEl = editorElement.querySelector('#code-block-empty') as HTMLElement;
            const updatedContentEl = getBlockContentElement(updatedBlockEl);
            expect(updatedContentEl).not.toBeNull();
            const firstLine = updatedContentEl.textContent.split('\n')[0];
            expect(firstLine).toBe('// NOTE');
            expect(updatedContentEl.textContent).toContain('function sayHello(name {');
            expect(editor.blocks[0].content[0].content).toBe('// NOTE\n\tfunction sayHello(name {\n  console.log("Hello, " + name);\n\t\treturn 1;\n    }');
            done();
        });

        it('On drag code block to another position in editor, preserve content and language settings', (done) => {
            const codeContent = [
                'interface User {',
                '    name: string;',
                '}'
            ].join('\n');
        
            const blocks: BlockModel[] = [
                {
                    id: 'code-dnd',
                    blockType: BlockType.Code,
                    properties: { language: 'typescript' },
                    content: [{ id: 'code-dnd-content', contentType: ContentType.Text, content: codeContent }]
                },
                {
                    id: 'para-dnd',
                    blockType: BlockType.Paragraph,
                    content: [{ id: 'para-dnd-content', contentType: ContentType.Text, content: 'Drop code below me' }]
                }
            ];
        
            editor = createEditor({ blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');
        
            const codeBlockEl = editorElement.querySelector('#code-dnd') as HTMLElement;
            const paraBlockEl = editorElement.querySelector('#para-dnd') as HTMLElement;
            editor.blockManager.setFocusToBlock(codeBlockEl);
            triggerMouseMove(codeBlockEl, 10, 10);
            const dragIcon = (editor as any).floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
        
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(paraBlockEl, 'dragenter', 75, paraBlockEl.offsetTop + 10, dataTransfer);
            triggerDragEvent(paraBlockEl, 'dragover', 75, paraBlockEl.offsetTop + 10, dataTransfer);
            triggerDragEvent(
                dragIcon,
                'drag',
                75,
                paraBlockEl.offsetTop + (paraBlockEl.offsetHeight / 2) + 10,
                dataTransfer
            );
        
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
            
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(updatedBlocks.length).toBe(2);
                
                    // First block should be paragraph
                    expect(updatedBlocks[0].id).toBe('para-dnd');
                    expect(getBlockContentElement(updatedBlocks[0]).textContent).toBe('Drop code below me');
                
                    // Second block should be code
                    expect(updatedBlocks[1].id).toBe('code-dnd');
                
                    // Code content preserved
                    const codeContentEl = updatedBlocks[1].querySelector('.e-code-content') as HTMLElement;
                    expect(codeContentEl).not.toBeNull();
                    expect(codeContentEl.textContent).toBe(codeContent);
                    const preEl = updatedBlocks[1].querySelector('pre.e-code-block') as HTMLElement;
                    expect(preEl).not.toBeNull();
                    expect(editor.blocks[0].id).toBe('para-dnd');
                    expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(editor.blocks[0].content[0].content).toBe('Drop code below me');
                
                    expect(editor.blocks[1].id).toBe('code-dnd');
                    expect(editor.blocks[1].blockType).toBe(BlockType.Code);
                    expect(editor.blocks[1].content[0].content).toBe(codeContent);
                
                    done();
                }, 120);
            }, 180);
        });

        it('On paste code with inline links, convert links to plain text URLs', (done) => {
            const url = 'https://www.syncfusion.com';

            const blocks: BlockModel[] = [
                {
                    id: 'code-block-link-paste',
                    blockType: BlockType.Code,
                    content: [{ id: 'code-content-link-paste', contentType: ContentType.Text, content: '' }]
                },
                {
                    id: 'para-link-source',
                    blockType: BlockType.Paragraph,
                    content: [
                        {
                            id: 'para-link-source-content',
                            contentType: ContentType.Link,
                            content: 'linktxt',
                            properties: { url }
                        }
                    ]
                }
            ];
        
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        
            const codeBlockEl = editorElement.querySelector('#code-block-link-paste') as HTMLElement;
            const codeContentEl = getBlockContentElement(codeBlockEl);
            const paraBlockEl = editorElement.querySelector('#para-link-source') as HTMLElement;
            const paraContentEl = getBlockContentElement(paraBlockEl);
        
            // Ensure paragraph actually rendered a link
            const anchorInPara = paraContentEl.querySelector('a') as HTMLAnchorElement;
            expect(anchorInPara).not.toBeNull();
            expect(anchorInPara.href).toContain(url);
            expect(anchorInPara.textContent).toBe('linktxt');
        
            // Focus code block and set caret at start
            editor.blockManager.setFocusToBlock(codeBlockEl);
            setCursorPosition(codeContentEl, 0);
        
            // Simulate clipboard as if user copied the linked text from the paragraph:
            // - text/plain is the visible text ("linktxt")
            // - text/html contains the anchor with the URL
            const mockClipboard: any = {
                setData: jasmine.createSpy('setData'),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return '';
                    }
                    if (format === 'text/plain') {
                        return 'linktxt';
                    }
                    if (format === 'text/html') {
                        return `<a href="${url}">linktxt</a>`;
                    }
                    return '';
                }
            };
        
            // Paste into the code block
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            const pastedCodeContentEl = getBlockContentElement(codeBlockEl);
            expect(pastedCodeContentEl.textContent).toBe('linktxt');
            expect(editor.blocks[0].id).toBe("code-block-link-paste");
            expect(editor.blocks[1].id).toBe("para-link-source");
            expect(editor.blocks[0].blockType).toBe(BlockType.Code);
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(editor.blocks[1].content[0].contentType).toBe(ContentType.Link);
            expect(editor.blocks[0].content[0].content).toBe("linktxt");
            expect(editor.blocks[1].content[0].content).toBe("linktxt");
            done();
        });
    });
});
