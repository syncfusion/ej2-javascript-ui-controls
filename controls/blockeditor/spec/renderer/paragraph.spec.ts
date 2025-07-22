import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";

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

        it('should render in DOM correctly', () => {
            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            const contentElement = blockElement.querySelector('p');
            expect(contentElement).not.toBeNull();
            expect(contentElement.textContent).toContain('Hello world');
        });

        it('should update the block model on interaction', (done) => {
            const paragraph = editorElement.querySelector('#paragraph-content');
            paragraph.textContent = 'Updated content';
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            editor.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                done();
            }, 800);
        });
    });
});