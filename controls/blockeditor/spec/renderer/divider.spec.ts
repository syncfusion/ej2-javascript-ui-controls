import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType } from "../../src/index";
import { createEditor } from "../common/util.spec";

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
                    { id: 'divider', type: BlockType.Divider }
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
            });

            it('should add selected class on click', (done) => {
                const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
                expect(blockElement).not.toBeNull();
                blockElement.click();
                setTimeout(() => {
                    expect(blockElement.classList).toContain('e-divider-selected');
                    done();
                }, 200);
            });
        });
});