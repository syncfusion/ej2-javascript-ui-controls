import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('Heading Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Render heading block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'heading1', type: BlockType.Heading1, content: [{ id: 'heading1-content', type: ContentType.Text, content: 'Heading 1' }] },
                { id: 'heading2', type: BlockType.Heading2, content: [{ id: 'heading2-content', type: ContentType.Text, content: 'Heading 2' }] },
                { id: 'heading3', type: BlockType.Heading3, content: [{ id: 'heading3-content', type: ContentType.Text, content: 'Heading 3' }] },
                { id: 'heading4', type: BlockType.Heading4, content: [{ id: 'heading4-content', type: ContentType.Text, content: 'Heading 4' }] }
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
            const headingblocks = editorElement.querySelectorAll('#heading1, #heading2, #heading3, #heading4');
            expect(headingblocks.length).toBe(4);
            const headingContents = editorElement.querySelectorAll('h1, h2, h3, h4');
            expect(headingContents.length).toBe(4);
            expect(headingContents[0].textContent).toBe('Heading 1');
            expect(headingContents[1].textContent).toBe('Heading 2');
            expect(headingContents[2].textContent).toBe('Heading 3');
            expect(headingContents[3].textContent).toBe('Heading 4');
        });

        it('should update the block model on interaction', (done) => {
            const heading1 = editorElement.querySelector('#heading1-content');
            heading1.textContent = 'Updated content';
            editor.setFocusToBlock(heading1.closest('.e-block') as HTMLElement);
            editor.updateContentOnUserTyping(heading1.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                done();
            }, 150);
        });

        it('should render heading with Node as existing content (with text node)', () => {
            const headingBlock: BlockModel = {
                id: 'heading-new',
                type: BlockType.Heading2,
                content: [{ id: 'heading-new-content', type: ContentType.Text, content: 'New heading' }]
            };
            
            // Create a document fragment as Node
            const docFragment = document.createDocumentFragment();
            const textNode = document.createTextNode('New heading from Node');
            docFragment.appendChild(textNode);
            
            const blockContainer = editorElement.querySelector('.e-blockeditor-container');
            const blockElement = editor.createElement('div', { 
                className: 'e-block',
                id: headingBlock.id,
                attrs: { 'data-block-type': headingBlock.type }
            });
            
            // Directly call the renderHeading method with the Node
            const headingElement = editor.blockAction.headingRenderer.renderHeading(
                headingBlock, 
                blockElement,
                docFragment
            );
            
            expect(headingElement.tagName).toBe('H2');
            expect(headingElement.textContent).toBe('New heading from Node');
            expect(headingElement.id).toBe('heading-new-content');
        });

        it('should render heading with Node as existing content (with multiple nodes)', () => {
            const headingBlock: BlockModel = {
                id: 'heading-multi',
                type: BlockType.Heading3,
                content: [{ id: 'heading-multi-content', type: ContentType.Text, content: 'Multi-node heading' }]
            };
            
            // Create a document fragment with multiple nodes
            const docFragment = document.createDocumentFragment();
            const spanNode = document.createElement('span');
            spanNode.textContent = 'Span text';
            spanNode.id = 'span-node';
            
            const emNode = document.createElement('em');
            emNode.textContent = 'Emphasized text';
            
            docFragment.appendChild(spanNode);
            docFragment.appendChild(emNode);
            
            const blockContainer = editorElement.querySelector('.e-blockeditor-container');
            const blockElement = editor.createElement('div', { 
                className: 'e-block',
                id: headingBlock.id,
                attrs: { 'data-block-type': headingBlock.type }
            });
            
            // Directly call the renderHeading method with the Node
            const headingElement = editor.blockAction.headingRenderer.renderHeading(
                headingBlock, 
                blockElement,
                docFragment
            );
            
            expect(headingElement.tagName).toBe('H3');
            expect(headingElement.innerHTML).toContain('<span id="span-node">Span text</span>');
            expect(headingElement.innerHTML).toContain('<em>Emphasized text</em>');
            expect(headingElement.id).not.toBe('heading-multi-content');
        });

        it('should render heading with Node as existing content (empty node)', () => {
            const headingBlock: BlockModel = {
                id: 'heading-empty',
                type: BlockType.Heading1,
                content: [{ id: 'heading-empty-content', type: ContentType.Text, content: 'Empty node heading' }]
            };
            
            // Create an empty document fragment
            const docFragment = document.createDocumentFragment();
            
            const blockContainer = editorElement.querySelector('.e-blockeditor-container');
            const blockElement = editor.createElement('div', {
                className: 'e-block',
                id: headingBlock.id,
                attrs: { 'data-block-type': headingBlock.type }
            });
            
            // Directly call the renderHeading method with the empty Node
            const headingElement = editor.blockAction.headingRenderer.renderHeading(
                headingBlock, 
                blockElement,
                docFragment
            );
            
            expect(headingElement.tagName).toBe('H1');
            expect(headingElement.textContent).toBe(''); // Should be empty
            expect(headingElement.id).toBe('heading-empty-content');
        });
    });
});