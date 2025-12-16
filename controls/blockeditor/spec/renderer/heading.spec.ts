import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel} from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

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
                { id: 'heading1', blockType: BlockType.Heading, properties: { level: 1 },
                    content: [{ id: 'heading1-content', contentType: ContentType.Text, content: 'Heading 1' }] 
                },
                { id: 'heading2', blockType: BlockType.Heading, properties: { level: 2 },
                    content: [{ id: 'heading2-content', contentType: ContentType.Text, content: 'Heading 2' }] 
                },
                { id: 'heading3', blockType: BlockType.Heading, properties: { level: 3 },
                    content: [{ id: 'heading3-content', contentType: ContentType.Text, content: 'Heading 3' }] 
                },
                { id: 'heading4', blockType: BlockType.Heading, properties: { level: 4 },
                    content: [{ id: 'heading4-content', contentType: ContentType.Text, content: 'Heading 4' }] 
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
            const headingblocks = editorElement.querySelectorAll('#heading1, #heading2, #heading3, #heading4');
            expect(headingblocks.length).toBe(4);
            const headingContents = editorElement.querySelectorAll('h1, h2, h3, h4');
            expect(headingContents.length).toBe(4);
            expect(headingContents[0].textContent).toBe('Heading 1');
            expect(headingContents[1].textContent).toBe('Heading 2');
            expect(headingContents[2].textContent).toBe('Heading 3');
            expect(headingContents[3].textContent).toBe('Heading 4');

            // Assert Model
            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].id).toBe("heading1");
            expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Heading 1');
            expect(editor.blocks[1].id).toBe("heading2");
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[1].content.length).toBe(1);
            expect(editor.blocks[1].content[0].content).toBe('Heading 2');
            expect(editor.blocks[2].id).toBe("heading3");
            expect(editor.blocks[2].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[2].content.length).toBe(1);
            expect(editor.blocks[2].content[0].content).toBe('Heading 3');
            expect(editor.blocks[3].id).toBe("heading4");
            expect(editor.blocks[3].blockType).toBe(BlockType.Heading);
            expect(editor.blocks[3].content.length).toBe(1);
            expect(editor.blocks[3].content[0].content).toBe('Heading 4');
        });

        it('should update the block model on interaction', (done) => {
            const heading1 = editorElement.querySelector('#heading1-content');
            heading1.textContent = 'Updated content';
            editor.blockManager.setFocusToBlock(heading1.closest('.e-block') as HTMLElement);
            editor.blockManager.stateManager.updateContentOnUserTyping(heading1.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[0].content[0].content).toBe('Updated content');
                expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                expect(editor.blocks[0].content.length).toBe(1);
                done();
            }, 150);
        });
    });
});