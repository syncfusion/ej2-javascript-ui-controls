import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel} from "../../src/models/index";
import { BlockType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Divider Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing divider block', () => {
            let editor: BlockEditor;
            let editorElement: HTMLElement;
    
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'divider', blockType: BlockType.Divider }
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
                const contentElement = blockElement.querySelector('hr');
                expect(contentElement).not.toBeNull();

                // Assert Model
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe("divider");
                expect(editor.blocks[0].content.length).toBe(0);
            });

            it('should add selected class on click', (done) => {
                const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
                expect(blockElement).not.toBeNull();
                blockElement.click();
                expect(blockElement.classList).toContain('e-divider-selected');

                // Assert Model
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe("divider");
                expect(editor.blocks[0].content.length).toBe(0);
                done();
            });
        });
});