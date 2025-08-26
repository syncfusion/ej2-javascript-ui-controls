import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('List Blocks', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing list blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist', type: BlockType.BulletList, content: [{ id: 'bulletlist-content', type: ContentType.Text, content: 'Bullet item' }] },
                { id: 'nested-bullet', type: BlockType.BulletList, indent: 1, content: [{ id: 'nested-bullet-content', type: ContentType.Text, content: 'Nested Bullet item' }] },
                { id: 'numberedlist', type: BlockType.NumberedList, content: [{ id: 'numberedlist-content', type: ContentType.Text, content: 'Numbered item' }] },
                { id: 'nested-nl', type: BlockType.NumberedList, indent: 1, content: [{ id: 'nested-nl-content', type: ContentType.Text, content: 'Nested Numbered item' }] },
                { id: 'deepnested-nl', type: BlockType.NumberedList, indent: 2, content: [{ id: 'deepnested-nl-content', type: ContentType.Text, content: 'Deep Nested Numbered item' }] },
                { id: 'checklist', type: BlockType.CheckList, content: [{ id: 'checklist-content', type: ContentType.Text, content: 'Checklist item' }] }
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

        it('should render list blocks in DOM correctly', () => {
            const listBlocks = editorElement.querySelectorAll('#bulletlist, #numberedlist, #checklist');
            expect(listBlocks.length).toBe(3);
            const contents = editorElement.querySelectorAll('#bulletlist ul, #numberedlist ol, #checklist ul');
            expect(contents.length).toBe(3);
            expect(listBlocks[0].textContent).toBe('Bullet item');
            expect(listBlocks[1].textContent).toBe('Numbered item');
            expect(listBlocks[2].textContent).toBe('Checklist item');
        });

        it('should update markers for list blocks correctly', () => {
            const listItems = editorElement.querySelectorAll('#bulletlist li, #numberedlist li, #checklist li') as NodeListOf<HTMLElement>;
            expect(listItems[0].style.getPropertyValue('list-style-type')).toContain('• ');
            expect(listItems[1].style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(listItems[2].style.getPropertyValue('list-style-type').length).toBe(0);
        });

        it('should update markers for nested list blocks correctly', () => {
            const listItems = editorElement.querySelectorAll('#nested-bullet li, #nested-nl li, #deepnested-nl li') as NodeListOf<HTMLElement>;
            expect(listItems[0].style.getPropertyValue('list-style-type')).toContain('• ');
            expect(listItems[1].style.getPropertyValue('list-style-type')).toContain('a. ');
            expect(listItems[2].style.getPropertyValue('list-style-type')).toContain('i. ');
        });

        it('should toggle the checklist properly', () => {
            const listBlock = editorElement.querySelector('#checklist');
            const checkmark = listBlock.querySelector('.e-checkmark') as HTMLElement;
            const liElement = listBlock.querySelector('li') as HTMLElement;
            const model = editor.blocks[5];
            expect(model.isChecked).toBe(false);

            checkmark.click();
            expect(model.isChecked).toBe(true);
            expect(checkmark.classList.contains('e-checkmark-checked')).toBe(true);
            expect(getComputedStyle(liElement).textDecoration).toContain('line-through');
        });

        it('should update the block model on interaction', (done) => {
            const bulletContent = editorElement.querySelector('#bulletlist-content') as HTMLElement;
            bulletContent.textContent = 'Updated bullet item';
            editor.setFocusToBlock(bulletContent.closest('.e-block') as HTMLElement);
            editor.updateContentOnUserTyping(bulletContent.closest('.e-block') as HTMLElement);
            setTimeout(() => {
                expect(editor.blocks[0].content[0].content).toBe('Updated bullet item');
                done();
            }, 800);
        });
    });
});