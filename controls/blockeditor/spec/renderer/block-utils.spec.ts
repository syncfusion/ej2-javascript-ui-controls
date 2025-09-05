import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";
import { handleExistingContentElement } from "../../src/blockeditor/renderer/blocks/block-utils";

describe('Block utils', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing existing element', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', type: BlockType.Paragraph, content: [{ id: 'paragraph-content', type: ContentType.Text, content: 'Hello world' }] }
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

        it('should generate unique id if content model is not provided', () => {
            const quoteBlock: BlockModel = {
                id: 'quote-new',
                type: BlockType.Quote
            };

            // Create a empty document fragment
            const docFragment = document.createDocumentFragment();

            const blockElement = editor.createElement('div', {
                className: 'e-block',
                id: quoteBlock.id,
                attrs: { 'data-block-type': quoteBlock.type.toString() }
            });

            const contentElement = editor.createElement('p', { id: 'quote-new-content' });

            handleExistingContentElement(
                quoteBlock,
                blockElement,
                contentElement,
                docFragment
            );

            expect(contentElement.id).not.toBeNull();
        });
    });
});