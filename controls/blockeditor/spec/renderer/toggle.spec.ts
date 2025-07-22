import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType, getBlockContentElement, setSelectionRange } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('Toggle Blocks', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing toggle block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    type: BlockType.ToggleParagraph,
                    content: [{ type: ContentType.Text, content: 'Toggle Header' }],
                    children: [
                        {
                            type: BlockType.Heading1,
                            content: [{ type: ContentType.Text, content: 'Toggle Item 1' }]
                        },
                        {
                            type: BlockType.Paragraph,
                            content: [{ type: ContentType.Text, content: 'Toggle Item 2' }]
                        },
                        {
                            type: BlockType.Quote,
                            content: [{ type: ContentType.Text, content: 'Toggle Item 3' }]
                        }
                    ]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should render in DOM correctly', () => {
            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            expect(blockElement.classList).toContain('e-toggle-block');
            expect(blockElement.querySelector('.e-toggle-icon')).toBeDefined();
            const toggleChildBlocks = blockElement.querySelectorAll('.e-toggle-content .e-block');
            expect(toggleChildBlocks.length).toBe(3);
            expect(toggleChildBlocks[0].querySelector('h1').textContent).toContain('Toggle Item 1');
            expect(toggleChildBlocks[1].querySelector('p').textContent).toContain('Toggle Item 2');
            expect(toggleChildBlocks[2].querySelector('blockquote').textContent).toContain('Toggle Item 3');
        });

        it('should update the expand collapse state on click', () => {
            const toggleElement = editorElement.querySelector('.e-toggle-block') as HTMLElement;
            const toggleIcon = toggleElement.querySelector('.e-toggle-icon') as HTMLElement;
            const toggleContent = toggleElement.querySelector('.e-toggle-content') as HTMLElement;
            // Should be in collapsed state by default
            expect(toggleElement.getAttribute('data-collapsed')).toBe('true');
            expect(toggleContent.style.display).toBe('none');
            toggleIcon.click();
            expect(toggleElement.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');
        });

        it('should update the header content properly while typing', () => {
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            expect(blockElement).not.toBeNull();
            // const toggleHeader = blockElement.querySelector('.e-toggle-header') as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            expect(contentElement).not.toBeNull();
            contentElement.textContent = 'Updated Toggle Header Content';
            setSelectionRange(contentElement.lastChild as HTMLElement, 0, 4);
            editor.updateContentOnUserTyping(blockElement);
            expect(contentElement.textContent).toBe('Updated Toggle Header Content');
            expect(editor.blocks[0].content[0].content).toBe('Updated Toggle Header Content');
        });

        it('should render default block if children not specified', () => {
            const editorElement2: HTMLElement = createElement('div', { id: 'editor2' });
            document.body.appendChild(editorElement2);
            let editor2: BlockEditor = createEditor({
                blocks: [{
                    id: 'toggle',
                    type: BlockType.ToggleParagraph,
                    content: [{ type: ContentType.Text, content: 'Toggle Paragraph' }]
                }]
            });
            editor2.appendTo('#editor2');
            const toggleChildBlocks = editorElement2.querySelectorAll('.e-toggle-content .e-block');
            expect(toggleChildBlocks.length).toBe(1);
            expect(toggleChildBlocks[0].querySelector('p').textContent.length).toBe(0);
            if (editor2) {
                editor2.destroy();
                editor2 = undefined;
            }
            remove(editorElement2);
            
        });

        it('should render other toggle headings correctly', () => {
            const editorElement3: HTMLElement = createElement('div', { id: 'editor3' });
            document.body.appendChild(editorElement3);
            let editor3: BlockEditor = createEditor({
                blocks: [
                    {
                        type: BlockType.ToggleParagraph,
                        content: [{ type: ContentType.Text, content: 'Toggle Paragraph' }]
                    },
                    {
                        type: BlockType.ToggleHeading1,
                        content: [{ type: ContentType.Text, content: 'Toggle Heading 1' }]
                    },
                    {
                        type: BlockType.ToggleHeading2,
                        content: [{ type: ContentType.Text, content: 'Toggle Heading 2' }]
                    },
                    {
                        type: BlockType.ToggleHeading3,
                        content: [{ type: ContentType.Text, content: 'Toggle Heading 3' }]
                    },
                    {
                        type: BlockType.ToggleHeading4,
                        content: [{ type: ContentType.Text, content: 'Toggle Heading 4' }]
                    }
                ]
            });
            editor3.appendTo('#editor3');
            const toggleBlocks = editorElement3.querySelectorAll('.e-toggle-block');
            expect(toggleBlocks.length).toBe(5);
            expect(toggleBlocks[0].querySelector('.e-toggle-header p').textContent).toContain('Toggle Paragraph');
            expect(toggleBlocks[1].querySelector('.e-toggle-header h1').textContent).toContain('Toggle Heading 1');
            expect(toggleBlocks[2].querySelector('.e-toggle-header h2').textContent).toContain('Toggle Heading 2');
            expect(toggleBlocks[3].querySelector('.e-toggle-header h3').textContent).toContain('Toggle Heading 3');
            expect(toggleBlocks[4].querySelector('.e-toggle-header h4').textContent).toContain('Toggle Heading 4');
            if (editor3) {
                editor3.destroy();
                editor3 = undefined;
            }
            remove(editorElement3);
        });

        it('should collapse toggle block correctly', () => {
            const toggleBlock: HTMLElement = editorElement.querySelector('.e-toggle-block');
            const toggleContent: HTMLElement = toggleBlock.querySelector('.e-toggle-content');
            const toggleIcon: HTMLElement = toggleBlock.querySelector('.e-toggle-icon');
            
            // First expand it
            toggleIcon.click();
            expect(toggleBlock.getAttribute('data-collapsed')).toBe('false');
            expect(toggleContent.style.display).toBe('block');
            
            // Now collapse it
            toggleIcon.click();
            expect(toggleBlock.getAttribute('data-collapsed')).toBe('true');
            expect(toggleContent.style.display).toBe('none');
            
            // Test direct method call with false state
            const toggleRenderer = editor.blockAction.toggleRenderer;
            toggleRenderer.updateToggleBlockExpansion(toggleBlock, false);
            expect(toggleBlock.getAttribute('data-collapsed')).toBe('true');
            expect(toggleContent.style.display).toBe('none');
        });
    });
});
