import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel} from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Paragraph Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Render paragraph block', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ id: 'paragraph-content', contentType: ContentType.Text, content: 'Hello world' }] }
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
            const contentElement = blockElement.querySelector('p');
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toContain('Hello world');

            // Assert Model
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].id).toBe("paragraph");
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');
        });

        it('should update the block model on interaction', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content');
            paragraph.textContent = 'Updated content';
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            editor.blockManager.stateManager.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                // Assert Model
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe("paragraph");
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                done();
            }, 800);
        });
    });
});