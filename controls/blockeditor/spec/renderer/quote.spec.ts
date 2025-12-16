import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel} from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

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
                { id: 'quote', blockType: BlockType.Quote, content: [{ id: 'quote-content', contentType: ContentType.Text, content: 'Quote block' }] }
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

            // Assert Model
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].id).toBe("quote");
            expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Quote block');
        });

        it('should update the block model on interaction', (done) => {
            const paragraph = editorElement.querySelector('#quote-content');
            paragraph.textContent = 'Updated content';
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            editor.blockManager.stateManager.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                // Assert Model
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe("quote");
                expect(editor.blocks[0].blockType).toBe(BlockType.Quote);
                expect(editor.blocks[0].content.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                done();
            }, 800);
        });
    });
});