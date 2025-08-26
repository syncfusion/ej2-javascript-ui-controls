import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('Quote Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Render quote block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'quote', type: BlockType.Quote, content: [{ id: 'quote-content', type: ContentType.Text, content: 'Quote block' }] }
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
            const contentElement = blockElement.querySelector('blockquote');
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toContain('Quote block');
        });

        it('should update the block model on interaction', (done) => {
            const paragraph = editorElement.querySelector('#quote-content');
            paragraph.textContent = 'Updated content';
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            editor.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                done();
            }, 800);
        });

        it('should render quote with Node as existing content (with text node)', () => {
            const quoteBlock: BlockModel = {
                id: 'quote-new',
                type: BlockType.Quote,
                content: [{ id: 'quote-new-content', type: ContentType.Text, content: 'New quote' }]
            };
            
            // Create a document fragment as Node
            const docFragment = document.createDocumentFragment();
            const textNode = document.createTextNode('New quote from Node');
            docFragment.appendChild(textNode);
            
            const blockElement = editor.createElement('div', { 
                className: 'e-block',
                id: quoteBlock.id,
                attrs: { 'data-block-type': quoteBlock.type }
            });
            
            // Directly call the renderQuote method with the Node
            const quoteElement = editor.blockAction.quoteRenderer.renderQuote(
                quoteBlock, 
                blockElement,
                docFragment
            );
            
            expect(quoteElement.tagName).toBe('BLOCKQUOTE');
            expect(quoteElement.textContent).toBe('New quote from Node');
            expect(quoteElement.id).toBe('quote-new-content');
            expect(blockElement.classList.contains('e-quote-block')).toBe(true);
        });

        it('should render quote with Node as existing content (with multiple nodes)', () => {
            const quoteBlock: BlockModel = {
                id: 'quote-multi',
                type: BlockType.Quote,
                content: [{ id: 'quote-multi-content', type: ContentType.Text, content: 'Multi-node quote' }]
            };
            
            // Create a document fragment with multiple nodes
            const docFragment = document.createDocumentFragment();
            const strongNode = document.createElement('strong');
            strongNode.textContent = 'Bold text';
            
            const emNode = document.createElement('em');
            emNode.textContent = 'Italicized text';
            
            docFragment.appendChild(strongNode);
            docFragment.appendChild(emNode);
            
            const blockElement = editor.createElement('div', { 
                className: 'e-block',
                id: quoteBlock.id,
                attrs: { 'data-block-type': quoteBlock.type }
            });
            
            // Directly call the renderQuote method with the Node
            const quoteElement = editor.blockAction.quoteRenderer.renderQuote(
                quoteBlock, 
                blockElement,
                docFragment
            );
            
            expect(quoteElement.tagName).toBe('BLOCKQUOTE');
            expect(quoteElement.innerHTML).toContain('<strong>Bold text</strong>');
            expect(quoteElement.innerHTML).toContain('<em>Italicized text</em>');
            // Since multiple nodes, it shouldn't have the content ID
            expect(quoteElement.id).not.toBe('quote-multi-content');
            expect(blockElement.classList.contains('e-quote-block')).toBe(true);
        });

        it('should render quote with Node as existing content (empty node)', () => {
            const quoteBlock: BlockModel = {
                id: 'quote-empty',
                type: BlockType.Quote,
                content: [{ id: 'quote-empty-content', type: ContentType.Text, content: 'Empty node quote' }]
            };
            
            // Create an empty document fragment
            const docFragment = document.createDocumentFragment();
            
            const blockElement = editor.createElement('div', { 
                className: 'e-block',
                id: quoteBlock.id,
                attrs: { 'data-block-type': quoteBlock.type }
            });
            
            // Directly call the renderQuote method with the empty Node
            const quoteElement = editor.blockAction.quoteRenderer.renderQuote(
                quoteBlock, 
                blockElement,
                docFragment
            );
            
            expect(quoteElement.tagName).toBe('BLOCKQUOTE');
            expect(quoteElement.textContent).toBe(''); // Should be empty
            expect(quoteElement.id).toBe('quote-empty-content');
            expect(blockElement.classList.contains('e-quote-block')).toBe(true);
        });
    });
});