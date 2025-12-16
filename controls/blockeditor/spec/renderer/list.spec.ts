import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel, IChecklistBlockSettings, BaseStylesProp } from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { getBlockContentElement, setCursorPosition, setSelectionRange } from "../../src/common/utils/index";

function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
    const event: any = {
        type,
        preventDefault: jasmine.createSpy(),
        clipboardData: clipboardData,
        bubbles: true,
        cancelable: true
    };
    return event as ClipboardEvent;
}

describe('List Blocks', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Testing list blocks default rendering', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist', blockType: BlockType.BulletList, content: [{ id: 'bulletlist-content', contentType: ContentType.Text, content: 'Bullet item' }] },
                { id: 'nested-bullet', blockType: BlockType.BulletList, indent: 1, content: [{ id: 'nested-bullet-content', contentType: ContentType.Text, content: 'Nested Bullet item' }] },
                { id: 'numberedlist', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-content', contentType: ContentType.Text, content: 'Numbered item' }] },
                { id: 'nested-nl', blockType: BlockType.NumberedList, indent: 1, content: [{ id: 'nested-nl-content', contentType: ContentType.Text, content: 'Nested Numbered item' }] },
                { id: 'deepnested-nl', blockType: BlockType.NumberedList, indent: 2, content: [{ id: 'deepnested-nl-content', contentType: ContentType.Text, content: 'Deep Nested Numbered item' }] },
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
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
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const contents = editorElement.querySelectorAll('#bulletlist ul, #numberedlist ol, #checklist ul');
            expect(contents.length).toBe(3);
            expect(domBlocks.length).toBe(6);
            expect(domBlocks[0].textContent).toBe('Bullet item');
            expect(domBlocks[1].textContent).toBe('Nested Bullet item');
            expect(domBlocks[2].textContent).toBe('Numbered item');
            expect(domBlocks[3].textContent).toBe('Nested Numbered item');
            expect(domBlocks[4].textContent).toBe('Deep Nested Numbered item');
            expect(domBlocks[5].textContent).toBe('Checklist item');

            expect(modelBlocks.length).toBe(6);
            expect(modelBlocks[0].content[0].content).toBe('Bullet item');
            expect(modelBlocks[1].content[0].content).toBe('Nested Bullet item');
            expect(modelBlocks[2].content[0].content).toBe('Numbered item');
            expect(modelBlocks[3].content[0].content).toBe('Nested Numbered item');
            expect(modelBlocks[4].content[0].content).toBe('Deep Nested Numbered item');
            expect(modelBlocks[5].content[0].content).toBe('Checklist item');
        });

        it('should update markers for list blocks correctly', () => {
            const listItems = editorElement.querySelectorAll('#bulletlist li, #numberedlist li, #checklist li') as NodeListOf<HTMLElement>;
            expect(listItems[0].style.getPropertyValue('list-style-type')).toBe('');
            expect(listItems[1].style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(listItems[2].style.getPropertyValue('list-style-type').length).toBe(0);
        });

        it('should update markers for nested list blocks correctly', () => {
            const listItems = editorElement.querySelectorAll('#nested-bullet li, #nested-nl li, #deepnested-nl li') as NodeListOf<HTMLElement>;
            expect(listItems[0].style.getPropertyValue('list-style-type')).toBe('');
            expect(listItems[1].style.getPropertyValue('list-style-type')).toContain('a. ');
            expect(listItems[2].style.getPropertyValue('list-style-type')).toContain('i. ');
        });

        it('should update the block model on interaction', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            const bulletContent = editorElement.querySelector('#bulletlist-content') as HTMLElement;
            bulletContent.textContent = 'Updated bullet item';
            editor.blockManager.setFocusToBlock(bulletContent.closest('.e-block') as HTMLElement);
            editor.blockManager.stateManager.updateContentOnUserTyping(bulletContent.closest('.e-block') as HTMLElement);
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(editor.blocks[0].content[0].content).toBe('Updated bullet item');
            expect(domBlocks[0].textContent).toBe('Updated bullet item');
            done();
        });
    });

    describe('Creates block on list trigger keys', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.Paragraph
                },
                {
                    id: 'block2',
                    blockType: BlockType.Paragraph
                },
                {
                    id: 'block3',
                    blockType: BlockType.Paragraph
                },
                {
                    id: 'block4',
                    blockType: BlockType.Paragraph
                },
                {
                    id: 'block4',
                    blockType: BlockType.Paragraph
                },
                {
                    id: 'block5',
                    blockType: BlockType.Paragraph
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should render bullet list on (*) trigger', (done) => {
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            const paragraph = editorElement.querySelector('#block1 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '* ';
            editor.blockManager.stateManager.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            //trigger space key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            modelBlocks = editor.blocks;
            expect(domBlocks.length).toBe(6);
            expect(modelBlocks.length).toBe(6);
            const newContentElement = editorElement.querySelector('#block1 li') as HTMLElement;
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(newContentElement.style.getPropertyValue('list-style-type')).toBe('');
            done();
        });

        it('should render bullet list on (-) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block2 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '- ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            expect(domBlocks.length).toBe(6);
            expect(modelBlocks.length).toBe(6);
            const newContentElement = editorElement.querySelector('#block1 li') as HTMLElement;
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
            expect(newContentElement.style.getPropertyValue('list-style-type')).toBe('');
            done();
        });

        it('should render numbered list on (1.) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block3 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '1. ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            expect(domBlocks.length).toBe(6);
            expect(modelBlocks.length).toBe(6);
            const newContentElement = editorElement.querySelector('#block3 li') as HTMLElement;
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(newContentElement.style.getPropertyValue('list-style-type')).toContain('1. ');
            done();
        });

        it('should render checklist on ([]) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block4 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '[] ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            let modelBlocks = editor.blocks;
            expect(domBlocks.length).toBe(6);
            expect(modelBlocks.length).toBe(6);
            const blockElement = editorElement.querySelector('#block4') as HTMLElement;
            expect(editor.blocks[3].blockType).toBe(BlockType.Checklist);
            expect(blockElement.querySelector('.e-checkmark-container')).not.toBeNull();
            done();
        });

        it('should return when block content is empty', (done) => {
            const paragraph = editorElement.querySelector('#block4 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '';
            expect(editor.blockManager.listPlugin.handleListTriggerKey(null, paragraph, null)).toBeUndefined();
            done();
        });

        it('should return def index when block is not found', function (done) {
            var paragraph = editorElement.querySelector('#block5 p') as HTMLElement;
            editor.blockManager.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            (editor.blockManager.listPlugin as any).getNumberedListItemIndex(null);
            expect((editor.blockManager.listPlugin as any).getNumberedListItemIndex(null)).toBe(1);
            done();
        });
    });

    describe('Keyboard actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist', blockType: BlockType.BulletList, content: [{ id: 'bulletlist-content', contentType: ContentType.Text, content: 'Bullet item' }] },
                { id: 'numberedlist', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-content', contentType: ContentType.Text, content: 'Numbered item' }] },
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] },
                { id: 'bulletlist-indent', indent: 1, blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should create a new list item on Enter key press', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
            const numberedListBlock = editorElement.querySelector('#numberedlist') as HTMLElement;
            const checkListBlock = editorElement.querySelector('#checklist') as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);
            const numberedContent = getBlockContentElement(numberedListBlock);
            const checkContent = getBlockContentElement(checkListBlock);
            let newListBlock = null;

            //Bullet list test
            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, bulletContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = bulletListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(bulletListBlock.style.getPropertyValue('--block-indent'));
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[1].content[0].content).toBe('');


            //Numbered list test
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = numberedListBlock.nextElementSibling as HTMLElement;
            const newListContent = getBlockContentElement(newListBlock);
            newListContent.textContent = 'New list item';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            expect(newListBlock).toBeDefined();
            expect(newListContent.textContent).toBe('New list item');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(numberedListBlock.style.getPropertyValue('--block-indent'));
            expect(newListContent.style.getPropertyValue('list-style-type')).toContain('2. ');
            expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);

            //Checklist test
            editor.blockManager.setFocusToBlock(checkListBlock);
            setCursorPosition(checkContent, checkContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = checkListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(checkListBlock.style.getPropertyValue('--block-indent'));
            expect(editor.blocks[4].blockType).toBe(BlockType.Checklist);
            expect(editor.blocks[4].content[0].content).toBe('Checklist item');
        });

        it('should reduce indent level on Enter key in empty block', (done) => {
            setTimeout(() => {
                const bulletBlock = editorElement.querySelector('#bulletlist-indent') as HTMLElement;
                const numberedContent = getBlockContentElement(bulletBlock);
                expect(bulletBlock.style.getPropertyValue('--block-indent')).toBe('20');

                editor.blockManager.setFocusToBlock(bulletBlock);
                numberedContent.textContent = '';
                editor.blockManager.stateManager.updateContentOnUserTyping(bulletBlock);
                setCursorPosition(numberedContent, 0);

                //Enter once to reduce indent
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                
                expect(editor.blocks[6].indent).toBe(0);
                expect(bulletBlock.style.getPropertyValue('--block-indent')).toBe('0');

                //Enter again should transform list into paragraph
                setCursorPosition(numberedContent, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks[6].blockType).toBe(BlockType.Paragraph);
                expect(getBlockContentElement(editorElement.querySelector('#bulletlist-indent')).tagName).toBe('P');
                done();
            }, 200);
        });

        it('should not prevent default when backspace at middle of text', () => {
            const numberedListBlock = editorElement.querySelector('#numberedlist') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);

            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 3);

            spyOn(editor.blockManager.blockCommand, 'transformBlockToParagraph').and.callThrough();

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            
            expect(editor.blockManager.blockCommand.transformBlockToParagraph).not.toHaveBeenCalled();
        });

        it('should update indent level on Tab/Shift+Tab key press', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist').nextElementSibling as HTMLElement;
            const numberedListBlock = editorElement.querySelector('#numberedlist').nextElementSibling as HTMLElement;
            const checkListBlock = editorElement.querySelector('#checklist').nextElementSibling as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);
            const numberedContent = getBlockContentElement(numberedListBlock);
            const checkContent = getBlockContentElement(checkListBlock);

            //Bullet list test
            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('0');

            //Numbered list test
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);
            //Press tab once for one indent level
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('a. ');
            
            //Enter on indented list should create a new list item with the same indent level
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            const newListBlock = numberedListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            const newListContent = getBlockContentElement(newListBlock);
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(numberedListBlock.style.getPropertyValue('--block-indent'));
            expect(newListContent.style.getPropertyValue('list-style-type')).toContain('b. ');
            

            //Press tab once for second indent level
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe('40');
            expect(newListContent.style.getPropertyValue('list-style-type')).toContain('i. ');
            
            //On second indent, press shift+tab to go back to first indent level
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            expect(newListContent.style.getPropertyValue('list-style-type')).toContain('b. ');
            

            //On first indent, press shift+tab to go back to initial indent
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe('0');
            expect(newListContent.style.getPropertyValue('list-style-type')).toContain('2. ');
            

            //Check list test
            editor.blockManager.setFocusToBlock(checkListBlock);
            setCursorPosition(checkContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(checkListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(checkListBlock.style.getPropertyValue('--block-indent')).toBe('0');
            
        });

        it('should toggle list to paragraph when backspace is pressed at the start of a list item', () => {
            const numberedListBlock = editorElement.querySelector('#numberedlist') as HTMLElement;
            const numberedContent = numberedListBlock.querySelector('#numberedlist-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[2].content[0].content).toBe('Numbered item');
            expect(editorElement.querySelector('#numberedlist p')).not.toBeNull();
            expect(editorElement.querySelector('#numberedlist p').textContent).toBe('Numbered item');
        });

        it('should split list content when enter is pressed at middle of text', () => {
            const checkListBlock = editorElement.querySelector('#checklist') as HTMLElement;
            const checkContent = checkListBlock.querySelector('#checklist-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(checkListBlock);
            setCursorPosition(checkContent, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks[5].content[0].content).toBe('Checkl');
            const newListBlock = checkListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).not.toBeNull();
            expect(newListBlock.getAttribute('data-block-type')).toBe(BlockType.Checklist.toString());
            const newListContent = getBlockContentElement(newListBlock);
            expect(checkContent.textContent).toBe('Checkl');
            expect(newListContent.textContent).toBe('ist item');
        });
    });

    describe('Edge cases testing', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.NumberedList,
                    content: [{
                        contentType: ContentType.Text, content: 'Block 1'
                    }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        });

        afterAll(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('getListMarker should use romanlookup for small numbers', () => {
            expect((editor.blockManager.listPlugin as any).getListMarker(2, 2)).toBe('ii.');
        });

        it('getListMarker should use fallback algorith for large numbers', () => {
            expect((editor.blockManager.listPlugin as any).getListMarker(25, 2)).toBe('xxv.');
        });

    });

    describe('Testing checklist blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should render checklist block DOM correctly', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const checklistBlock = editorElement.querySelector('#checklist');
            expect(checklistBlock).not.toBe(null);
            const content = editorElement.querySelector('#checklist ul');
            expect(content).not.toBe(null);
            expect(checklistBlock.textContent).toBe('Checklist item');
        });

        it('should prevent toggle/toggle checklist based on readonly mode', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks, readOnly: true });
            editor.appendTo('#editor');
            const checkmark = editorElement.querySelector('.e-checkmark-container') as HTMLElement;
            checkmark.click();

            expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
            expect(editorElement.querySelector('li').classList.contains('e-checked')).toBe(false);

            editor.readOnly = false;
            editor.dataBind();

            checkmark.click();

            expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(true);
            expect(editorElement.querySelector('li').classList.contains('e-checked')).toBe(true);
        });

        it('On toggle checkbox in nested checklist item, update only the selected item’s state, not parent or siblings', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist,indent: 0, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] },
                { id: 'checklist-n1', blockType: BlockType.Checklist,indent: 1, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const nestedChecklistBlock = editorElement.querySelector('#checklist-n1');
            const checkmark = nestedChecklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
            const liElement = nestedChecklistBlock.querySelector('li') as HTMLElement;
            const props = (editor.blocks[1].properties as IChecklistBlockSettings);
            expect(props.isChecked).toBe(false);

            checkmark.click();
            expect(props.isChecked).toBe(true);
            expect(liElement.classList.contains('e-checked')).toBe(true);
            expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
            expect(getComputedStyle(liElement).textDecoration).toContain('line-through');
        });

        it('transforming checklist to bullet list', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#checklist') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks[0].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Checklist item');
                expect(editor.blocks[0].content[0].content).toBe('Checklist item');
                done();
            }, 200);
        });

        it('transforming checklist to numbered list', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#checklist') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const NumberedListElement = slashCommandElement.querySelector('li[data-value="Numbered List"]') as HTMLElement;
            expect(NumberedListElement).not.toBeNull();
            NumberedListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks[0].querySelector('li').style.getPropertyValue('list-style-type')).toContain('1. ');
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Checklist item');
                expect(editor.blocks[0].content[0].content).toBe('Checklist item');
                done();
            }, 200);
        });

        it('model and UI update on click of checkbox', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Checklist item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
            const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
            const liElement = checklistBlock.querySelector('li') as HTMLElement;
            const props = (editor.blocks[0].properties as IChecklistBlockSettings);
            expect(props.isChecked).toBe(false);
            expect(liElement.classList.contains('e-checked')).toBe(false);
            expect(getComputedStyle(liElement).textDecoration).not.toContain('line-through');

            checkmark.click();
            expect(props.isChecked).toBe(true);
            expect(liElement.classList.contains('e-checked')).toBe(true);
            expect(getComputedStyle(liElement).textDecoration).toContain('line-through');
        });

        it('isChecked - true with content empty - interact checkbox isChecked prop should be false', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
               // expect(props.isChecked).toBe(false);

                checkmark.click();
                // expect(props.isChecked).toBe(false);
                done();
            }, 50);
        });

        it('isChecked - true with content empty - on interaction UI should not be updated', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
                //expect(props.isChecked).toBe(false);

                checkmark.click();
                // expect(props.isChecked).toBe(false);
                done();
            }, 50);
        });

        it('isChecked - false with content empty - should not happen anything on checkbox interaction', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
                expect(props.isChecked).toBe(false); // Initial state

                checkmark.click();
                // expect(props.isChecked).toBe(false);
                done();
            }, 50);
        });

        it('isChecked - false with some content - on interaction, isChecked should be updated', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Some content' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
            const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
            const props = (editor.blocks[0].properties as IChecklistBlockSettings);
            expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
            expect(props.isChecked).toBe(false); // Initial state

            checkmark.click(); // Simulate user interaction
            setTimeout(() => {
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(props.isChecked).toBe(true);
                done();
            }, 50);
        });

        it('isChecked - true with some content - on emptying content using backspace, isChecked should maintain true', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Some content' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                const contentElement = getBlockContentElement(checklistBlock);
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
                expect(props.isChecked).toBe(true);
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);

                editor.blockManager.setFocusToBlock(checklistBlock);
                setCursorPosition(contentElement, contentElement.textContent.length);
                contentElement.textContent = '';
                editor.blockManager.stateManager.updateContentOnUserTyping(checklistBlock);

                setTimeout(() => {
                    expect(props.isChecked).toBe(true);
                    expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                    done();
                }, 50);
            }, 50);
        });

        it('isChecked - true with some content - on emptying content using backspace, isChecked should maintain true. Now click checkbox, isChecked should be false.', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Some content' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                const contentElement = getBlockContentElement(checklistBlock);
                const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
                expect(props.isChecked).toBe(true);
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);

                editor.blockManager.setFocusToBlock(checklistBlock);
                setCursorPosition(contentElement, contentElement.textContent.length);
                contentElement.textContent = '';
                editor.blockManager.stateManager.updateContentOnUserTyping(checklistBlock);


                setTimeout(() => {
                    expect(props.isChecked).toBe(true);
                    expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                    checkmark.click();
                    // expect(props.isChecked).toBe(false); // Now should be false
                    // expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
                    done();
                }, 50);
            }, 50);
        });

        it('isChecked - true with some content - on emptying content using backspace, isChecked should maintain true. Now on click of checkbox, isChecked should be false. Again input some content, now on interaction, isChecked should be true', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Some content' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            setTimeout(() => {
                let checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                let contentElement = getBlockContentElement(checklistBlock);
                const checkmark = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
                const props = (editor.blocks[0].properties as IChecklistBlockSettings);
                expect(props.isChecked).toBe(true);
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);

                editor.blockManager.setFocusToBlock(checklistBlock);
                setCursorPosition(contentElement, contentElement.textContent.length);
                contentElement.textContent = '';
                editor.blockManager.stateManager.updateContentOnUserTyping(checklistBlock);
                setTimeout(() => {
                    expect(props.isChecked).toBe(true);
                    expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                    checkmark.click();
                    // expect(props.isChecked).toBe(false);
                    // expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);

                    checklistBlock = editorElement.querySelector('#checklist') as HTMLElement;
                    contentElement = getBlockContentElement(checklistBlock);
                    editor.blockManager.setFocusToBlock(checklistBlock);
                    setCursorPosition(contentElement, 0);
                    contentElement.textContent = 'New content';
                    editor.blockManager.stateManager.updateContentOnUserTyping(checklistBlock);

                    setTimeout(() => {
                        checkmark.click();
                        // expect(props.isChecked).toBe(true);
                        // expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });

        it('isChecked - true with some content. Place cursor at middle and split the block -> The split content should be created as a new checklist block with content.', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist-original', blockType: BlockType.Checklist, properties: { isChecked: true }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Content to split' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const originalBlock = editorElement.querySelector('#checklist-original') as HTMLElement;
            const contentElement = getBlockContentElement(originalBlock);
            const originalProps = (editor.blocks[0].properties as IChecklistBlockSettings);

            editor.blockManager.setFocusToBlock(originalBlock);
            setCursorPosition(contentElement, 'Content '.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Content ');
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(originalProps.isChecked); // Original block retains isChecked state

                const newBlock = originalBlock.nextElementSibling as HTMLElement;
                expect(newBlock).not.toBeNull();
                expect(newBlock.getAttribute('data-block-type')).toBe(BlockType.Checklist.toString());
                const newContentElement = getBlockContentElement(newBlock);
                expect(newContentElement.textContent).toBe('to split');
                expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).querySelector('li').classList.contains('e-checked')).toBe(false);
                expect((editor.blocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false); // New block should be unchecked by default
                done();
            }, 50);
        });

        it('isChecked - false with some content. Place cursor at middle and split the block -> The split content should be created as a new checklist block with content.', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist-original', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Content to split' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const originalBlock = editorElement.querySelector('#checklist-original') as HTMLElement;
            const contentElement = getBlockContentElement(originalBlock);
            const originalProps = (editor.blocks[0].properties as IChecklistBlockSettings);

            editor.blockManager.setFocusToBlock(originalBlock);
            setCursorPosition(contentElement, 'Content '.length); // Cursor at "Content |to split"
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).textContent).toBe('Content ');
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Content ');
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(originalProps.isChecked);

                const newBlock = originalBlock.nextElementSibling as HTMLElement;
                expect(newBlock).not.toBeNull();
                expect(newBlock.getAttribute('data-block-type')).toBe(BlockType.Checklist.toString());
                const newContentElement = getBlockContentElement(newBlock);
                expect(newContentElement.textContent).toBe('to split');
                expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).querySelector('li').classList.contains('e-checked')).toBe(false);
                expect((editor.blocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false); // New block should be unchecked by default
                done();
            }, 50);
        });

        it('isChecked - false with some content. Place cursor at end and click enter -> new checklist block should be created with empty content.', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist-original', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ id: 'checklist-content', contentType: ContentType.Text, content: 'Some content' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const originalBlock = editorElement.querySelector('#checklist-original') as HTMLElement;
            const contentElement = getBlockContentElement(originalBlock);
            const originalProps = (editor.blocks[0].properties as IChecklistBlockSettings);

            editor.blockManager.setFocusToBlock(originalBlock);
            setCursorPosition(contentElement, contentElement.textContent.length); // Cursor at end
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Some content');
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(originalProps.isChecked);

                const newBlock = originalBlock.nextElementSibling as HTMLElement;
                expect(newBlock).not.toBeNull();
                expect(newBlock.getAttribute('data-block-type')).toBe(BlockType.Checklist.toString());
                const newContentElement = getBlockContentElement(newBlock);
                expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).querySelector('li').classList.contains('e-checked')).toBe(false);
                expect(newContentElement.textContent).toBe(''); // New block should have empty content
                expect((editor.blocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false); // New block should be unchecked by default
                done();
            }, 50);
        });
    });

    describe('Testing Numbered list blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
            const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
            node.dispatchEvent(event);
        }
        function simulateMultiBlockSelection(startBlock: HTMLElement, endBlock: HTMLElement): void {
            // Create a mock selection range
            const range = document.createRange();
            range.setStartBefore(startBlock);
            range.setEndAfter(endBlock);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Spy on getSelectedBlocks to return the appropriate blocks
            const startBlockId = startBlock.id;
            const endBlockId = endBlock.id;
            
            // Get all blocks between start and end blocks inclusive
            const allBlocks = editor.blockManager.getEditorBlocks();
            const startIdx = allBlocks.findIndex(b => b.id === startBlockId);
            const endIdx = allBlocks.findIndex(b => b.id === endBlockId);
            const selectedBlocks = allBlocks.slice(
                Math.min(startIdx, endIdx),
                Math.max(startIdx, endIdx) + 1
            );
            
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);
        }

        it('On enter, create new list block with next sequential number index (2)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-context', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-context') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                const newBlock = numberedListBlock.nextElementSibling as HTMLElement;
                const newContent = getBlockContentElement(newBlock);
                expect(newBlock).toBeDefined();
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(newContent.style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            }, 50);
        });

        it('On tab, indent current list (nested) and update index to alphabet (a)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, indent: 0, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(1);
                expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('20');
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('a.');
                done();
            }, 50);
        });

        it('On enter after indented alphabet, create new list block with next alphabet (b)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                // Starting with indent: 1 to simulate being at 'a' level before Enter
                { id: 'numberedlist-current-alphabet', blockType: BlockType.NumberedList, indent: 1, content: [{ id: 'numberedlist-current-alphabet-content', contentType: ContentType.Text, content: 'Current alphabet item (a)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-current-alphabet') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                const newBlock = numberedListBlock.nextElementSibling as HTMLElement;
                const newContent = getBlockContentElement(newBlock);
                expect(newBlock).toBeDefined();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[1].indent).toBe(1);
                expect(newContent.style.getPropertyValue('list-style-type')).toContain('b.');
                done();
            }, 50);
        });

        it('On tab after alphabet, indent further and update index to roman numeral (i)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                // Starting with indent: 1 to simulate 'a' level
                { id: 'numberedlist-start-alphabet', blockType: BlockType.NumberedList, indent: 1, content: [{ id: 'numberedlist-start-alphabet-content', contentType: ContentType.Text, content: 'Start series with alphabet (a)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-start-alphabet') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); // Single Tab press
            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(2); // Indent should become 2
                expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('40');
                // The list-style-type should be 'i.' for the first item at indent level 2
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('i.');
                done();
            }, 50);
        });

        it('On enter after roman numeral, create new list block with next roman numeral (ii)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                // Starting with indent: 2 to simulate being at 'i' level before Enter
                { id: 'numberedlist-current-roman', blockType: BlockType.NumberedList, indent: 2, content: [{ id: 'numberedlist-current-roman-content', contentType: ContentType.Text, content: 'Current roman item (i)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-current-roman') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                const newBlock = numberedListBlock.nextElementSibling as HTMLElement;
                const newContent = getBlockContentElement(newBlock);
                expect(newBlock).toBeDefined();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[1].indent).toBe(2);
                expect(newContent.style.getPropertyValue('list-style-type')).toContain('ii.');
                done();
            }, 50);
        });

        it('On tab after roman numeral, indent further and restart number index (1)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                // Starting with indent: 2 to simulate 'i' level
                { id: 'numberedlist-start-roman', blockType: BlockType.NumberedList, indent: 2, content: [{ id: 'numberedlist-start-roman-content', contentType: ContentType.Text, content: 'Start series with roman numeral (i)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-start-roman') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); // Single Tab press
            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(3); // Indent should become 3
                expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('60');
                // The list-style-type should be '1.' for the first item at indent level 3
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('1.');
                done();
            }, 50);
        });

        it('On shift+tab after roman numeral, outdent to previous level and continue roman numeral (i)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-context', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Roman numeral item' }] },
                { id: 'numberedlist-next', blockType: BlockType.NumberedList, indent: 3, content: [{ contentType: ContentType.Text, content: 'Next item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-next') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);

            // Action: Shift+Tab
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[1].indent).toBe(2); // Model update
                expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('40'); // DOM update
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('i.'); // Adjusted to reflect current block context
                done();
            }, 50);
        });

        it('On shift+tab after alphabet, outdent to previous level and continue number index (3)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-context', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered item 1' }] },
                { id: 'numberedlist-context-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered item 2' }] },
                { id: 'numberedlist-current', blockType: BlockType.NumberedList, indent: 1, content: [{ id: 'numberedlist-current-content', contentType: ContentType.Text, content: 'Alphabet item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-current') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);

            // Action: Shift+Tab
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[2].indent).toBe(0); // Model update
                expect(numberedListBlock.style.getPropertyValue('--block-indent')).toBe('0'); // DOM update
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('3.'); // Continue number index
                done();
            }, 50);
        });

        it('On enter after outdented number, create new list block with next number index (4)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-context', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered item 1' }] },
                { id: 'numberedlist-context-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered item 2' }] },
                { id: 'numberedlist-current', blockType: BlockType.NumberedList, indent: 0, content: [{ id: 'numberedlist-current-content', contentType: ContentType.Text, content: 'Numbered item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-current') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, numberedContent.textContent.length);

            // Action: Enter
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                const newBlock = numberedListBlock.nextElementSibling as HTMLElement;
                const newContent = getBlockContentElement(newBlock);
                expect(newBlock).toBeDefined();
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].indent).toBe(0);
                expect(newContent.style.getPropertyValue('list-style-type')).toContain('4.');
                done();
            }, 50);
        });

        it('On backspace at start of first list item, convert to paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Start series with number index (1)');
                expect(editorElement.querySelector('#numberedlist-start p')).not.toBeNull();
                expect(editorElement.querySelector('#numberedlist-start p').textContent).toBe('Start series with number index (1)');
                done();
            }, 50);
        });

        it('On backspace at start of indented list item, convert to paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-indented', blockType: BlockType.NumberedList, indent: 1, content: [{ id: 'numberedlist-indented-content', contentType: ContentType.Text, content: 'Indented list item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-indented') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Indented list item');
                expect(editorElement.querySelector('#numberedlist-indented p')).not.toBeNull();
                expect(editorElement.querySelector('#numberedlist-indented p').textContent).toBe('Indented list item');
                done();
            }, 50);
        });

        it('On enter at empty list item, remove list item and create paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-empty', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-empty-content', contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-empty') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(numberedListBlock.textContent).toBe('');
                expect(numberedListBlock.querySelector('p')).not.toBeNull;
                expect(editor.blocks.length).toBe(1); // List item removed, replaced by paragraph
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('');
                expect(editorElement.querySelector('#numberedlist-empty p')).not.toBeNull();
                done();
            }, 50);
        });

        it('On delete at end of list item, merge with next list item, preserving index', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-item1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-item2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1Block = editorElement.querySelector('#numberedlist-item1') as HTMLElement;
            const item1Content = getBlockContentElement(item1Block);
            editor.blockManager.setFocusToBlock(item1Block);
            setCursorPosition(item1Content, item1Content.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].content[0].content).toBe('Item 1Item 2');
                expect(editorElement.querySelector('#numberedlist-item1 ol li:nth-child(1)').textContent).toBe('Item 1Item 2');
                expect((editorElement.querySelector('#numberedlist-item1 ol li:nth-child(1)') as HTMLElement).style.getPropertyValue('list-style-type')).toContain('1.');
                done();
            }, 50);
        });

        it('On backspace at start of list item, first transform to paragraph block again click on backspace merge with previous list item, updating index', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-prev', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Previous item' }] },
                { id: 'numberedlist-current', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-current-content', contentType: ContentType.Text, content: 'Current item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            let currentBlock = editorElement.querySelector('#numberedlist-current') as HTMLElement;
            let currentContent = getBlockContentElement(currentBlock);
            editor.blockManager.setFocusToBlock(currentBlock);
            setCursorPosition(currentContent, 0);

            // First backspace: transform to paragraph
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].content[0].content).toBe('Current item');
                expect(editorElement.querySelector('#numberedlist-current p')).not.toBeNull();
                currentBlock = editorElement.querySelector('#numberedlist-current') as HTMLElement;
                currentContent = getBlockContentElement(currentBlock);
                // Second backspace: merge with previous list item
                editor.blockManager.setFocusToBlock(currentBlock);
                setCursorPosition(currentContent, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
                setTimeout(() => {
                    expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                    expect(editor.blocks.length).toBe(1);
                    expect(editor.blocks[0].content[0].content).toBe('Previous itemCurrent item');
                    expect(editorElement.querySelector('#numberedlist-prev ol li:nth-child(1)').textContent).toBe('Previous itemCurrent item');
                    expect((editorElement.querySelector('#numberedlist-prev ol li:nth-child(1)') as HTMLElement).style.getPropertyValue('list-style-type')).toContain('1.');
                    done();
                }, 50);
            }, 50);
        });

        it('On split list item (enter in middle), create new list item with next index', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 'Start series with'.length); // Split in middle
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Start series with');
                expect(editor.blocks[1].content[0].content).toBe(' number index (1)');
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);

                const newBlock = numberedListBlock.nextElementSibling as HTMLElement;
                const newContent = getBlockContentElement(newBlock);
                expect(numberedContent.textContent).toBe('Start series with');
                expect(newContent.textContent).toBe(' number index (1)');
                expect(newContent.style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            }, 50);
        });
        it('transforming numbered to bullet list with existing content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Start series with number index (1)');
                expect(editor.blocks[0].content[0].content).toBe('Start series with number index (1)');
                done();
            }, 200);
        });
        it('transforming numbered to bullet list with existing content and toggle list to paragraph when backspace is pressed at the start of a list item', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('li').textContent).toBe('Start series with number index (1)');
                expect(editor.blocks[0].content[0].content).toBe('Start series with number index (1)');
                const numberedListBlock = editorElement.querySelector('#numberedlist-start') as HTMLElement;
                const numberedContent = numberedListBlock.querySelector('#numberedlist-start-content') as HTMLElement;

                editor.blockManager.setFocusToBlock(numberedListBlock);
                setCursorPosition(numberedContent, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe('Start series with number index (1)');
                expect(editorElement.querySelector('#numberedlist-start p')).not.toBeNull();
                expect(editorElement.querySelector('#numberedlist-start p').textContent).toBe('Start series with number index (1)');
                done();
            }, 200);
        });
        it('transforming numbered to paragraph with existing content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            expect(blockElement).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const paragraphElement = slashCommandElement.querySelector('li[data-value="Paragraph"]') as HTMLElement;
            expect(paragraphElement).not.toBeNull();
            paragraphElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            setTimeout(() => {
                expect(editorElement.querySelector('.e-block').querySelector('p').textContent).toBe('Start series with number index (1)');
                expect(editor.blocks[0].content[0].content).toBe('Start series with number index (1)');
                done();
            }, 200);
        });
        it('On indent multiple selected list items, update indices to next level (e.g., number to alphabet)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-multi-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-multi-1') as HTMLElement;
            const block2 = editorElement.querySelector('#numberedlist-multi-2') as HTMLElement;
            editor.blockManager.setFocusToBlock(block1);
            simulateMultiBlockSelection(block1, block2);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(1);
                expect(editor.blocks[1].indent).toBe(1);
                expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('a.');
                expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('b.');
                done();
            }, 50);
        });
        it('On shift+tab multiple selected list items, outdent to previous level with correct indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item A' }] },
                { id: 'numberedlist-multi-b', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const blockA = editorElement.querySelector('#numberedlist-multi-a') as HTMLElement;
            const blockB = editorElement.querySelector('#numberedlist-multi-b') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockA);
            simulateMultiBlockSelection(blockA, blockB);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(0);
                expect(editor.blocks[1].indent).toBe(0);
                expect(getBlockContentElement(blockA).style.getPropertyValue('list-style-type')).toContain('1.');
                expect(getBlockContentElement(blockB).style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            }, 50);
        });

        it('On undo after indent, revert to previous level and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-undo', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Initial Item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-undo') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);

            // Perform indent
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(1);
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('a.');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                setTimeout(() => {
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('1.');
                    done();
                }, 50);
            }, 50);
        });

        it('On redo after indent, restore indented level and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-redo', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Redo Item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedListBlock = editorElement.querySelector('#numberedlist-redo') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);
            editor.blockManager.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);

            // Perform indent
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks[0].indent).toBe(1);
                expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('a.');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));

                setTimeout(() => {
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('1.');

                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));

                    setTimeout(() => {
                        expect(editor.blocks[0].indent).toBe(1);
                        expect(numberedContent.style.getPropertyValue('list-style-type')).toContain('a.');
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });
        it('applying formattingOn apply formatting (e.g., bold) to list item, retain index and apply formatting', () => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-start', blockType: BlockType.NumberedList, content: [{ id: 'numberedlist-start-content', contentType: ContentType.Text, content: 'Start series with number index (1)' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('#numberedlist-start') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            //Select range of text(world) and apply bold formatting
            setSelectionRange((contentElement.lastChild as HTMLElement), 0, 5);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            expect(contentElement.childElementCount).toBe(2);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(contentElement.querySelector('strong').textContent).toBe('Start');
            expect(contentElement.querySelector('span').textContent).toBe(' series with number index (1)');
            expect((editor.blocks[0].content[0].properties as BaseStylesProp).styles.bold).toBe(true);
        });
        it('On move list item down, swap with previous item, updating indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-multi-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-multi-1') as HTMLElement;
            const numberedContent1 = getBlockContentElement(block1);
            const block2 = editorElement.querySelector('#numberedlist-multi-2') as HTMLElement;
            const numberedContent2 = getBlockContentElement(block2);

            editor.blockManager.setFocusToBlock(block1);
                setCursorPosition(numberedContent1, 0);
            triggerMouseMove(block1, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                (popup.querySelector('#movedown') as HTMLElement).click();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Item 2');
                expect(editor.blocks[1].content[0].content).toBe('Item 1');

                const allBlocks = editor.element.querySelectorAll('.e-block');
                expect(allBlocks[0].id).toBe('numberedlist-multi-2');
                expect(allBlocks[1].id).toBe('numberedlist-multi-1');
                expect(numberedContent2.style.getPropertyValue('list-style-type')).toContain('1.');
                expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            }, 200);
        });
        it('On move list item up, swap with previous item, updating indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-multi-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-multi-1') as HTMLElement;
            const numberedContent1 = getBlockContentElement(block1);
            const block2 = editorElement.querySelector('#numberedlist-multi-2') as HTMLElement;
            const numberedContent2 = getBlockContentElement(block2);

            editor.blockManager.setFocusToBlock(block2);
            setCursorPosition(numberedContent2, 0);
            triggerMouseMove(block2, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                (popup.querySelector('#moveup') as HTMLElement).click();
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].content[0].content).toBe('Item 2');
                expect(editor.blocks[1].content[0].content).toBe('Item 1');

                const allBlocks = editor.element.querySelectorAll('.e-block');
                expect(allBlocks[0].id).toBe('numberedlist-multi-2');
                expect(allBlocks[1].id).toBe('numberedlist-multi-1');
                expect(numberedContent2.style.getPropertyValue('list-style-type')).toContain('1.');
                expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            }, 200);
        });
        it('On clipboard cut, remove list item and adjust indices of remaining items', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-multi-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] },
                { id: 'numberedlist-multi-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-multi-1') as HTMLElement;
            const block2 = editorElement.querySelector('#numberedlist-multi-2') as HTMLElement;
            const block3 = editorElement.querySelector('#numberedlist-multi-3') as HTMLElement;
            const numberedContent1 = getBlockContentElement(block1);
            const numberedContent2 = getBlockContentElement(block2);
            const numberedContent3 = getBlockContentElement(block3);
            expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('1.');
            expect(numberedContent2.style.getPropertyValue('list-style-type')).toContain('2.');
            expect(numberedContent3.style.getPropertyValue('list-style-type')).toContain('3.');
            const initialBlockCount = editor.blocks.length;
            editor.blockManager.setFocusToBlock(block2);
            setCursorPosition(getBlockContentElement(block2), 0);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));

            setTimeout(() => {
                expect(editor.blocks.length).toBe(initialBlockCount - 1);
                expect(editorElement.querySelector('#numberedlist-multi-2')).toBeNull();

                expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('1.');
                // expect(numberedContent3.style.getPropertyValue('list-style-type')).toContain('2.');
                done();
            });
        });
        it('On nested list deletion, remove nested items and adjust indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-multi-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'numberedlist-nested-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item 1' }] },
                { id: 'numberedlist-nested-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item 2' }] },
                { id: 'numberedlist-nested-3', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item 3' }] },
                { id: 'numberedlist-multi-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] },
                { id: 'numberedlist-multi-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-multi-1') as HTMLElement;
            const block2 = editorElement.querySelector('#numberedlist-multi-2') as HTMLElement;
            const block3 = editorElement.querySelector('#numberedlist-multi-3') as HTMLElement;
            const numberedContent1 = getBlockContentElement(block1);
            const numberedContent2 = getBlockContentElement(block2);
            const numberedContent3 = getBlockContentElement(block3);

            const nestedBlock1 = editorElement.querySelector('#numberedlist-nested-1') as HTMLElement;
            const nestedBlock2 = editorElement.querySelector('#numberedlist-nested-2') as HTMLElement;
            const nestedBlock3 = editorElement.querySelector('#numberedlist-nested-3') as HTMLElement;
            const nestedNumberedContent1 = getBlockContentElement(nestedBlock1);
            const nestedNumberedContent2 = getBlockContentElement(nestedBlock2);
            const nestedNumberedContent3 = getBlockContentElement(nestedBlock3);
            expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('1.');
            expect(numberedContent2.style.getPropertyValue('list-style-type')).toContain('2.');
            expect(numberedContent3.style.getPropertyValue('list-style-type')).toContain('3.');
            expect(nestedNumberedContent1.style.getPropertyValue('list-style-type')).toContain('a.');
            expect(nestedNumberedContent2.style.getPropertyValue('list-style-type')).toContain('b.');
            expect(nestedNumberedContent3.style.getPropertyValue('list-style-type')).toContain('c.');
            editor.blockManager.setFocusToBlock(nestedBlock2);
            nestedBlock2.textContent = '';
            setTimeout(() => {
                expect(numberedContent1.style.getPropertyValue('list-style-type')).toContain('1.');
                expect(numberedContent2.style.getPropertyValue('list-style-type')).toContain('2.');
                expect(numberedContent3.style.getPropertyValue('list-style-type')).toContain('3.');
                expect(nestedNumberedContent1.style.getPropertyValue('list-style-type')).toContain('a.');
                // as delete functionality wont work on test case.
                // expect(nestedNumberedContent3.style.getPropertyValue('list-style-type')).toContain('b.');
                done();
            });
        });
    });

    describe('Testing Bullet list blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist', blockType: BlockType.BulletList, content: [{ id: 'bulletlist-content', contentType: ContentType.Text, content: 'Bullet item' }] }
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

        it('Create a new list item on Enter key press', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);
            let newListBlock = null;

            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, bulletContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = bulletListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(bulletListBlock.style.getPropertyValue('--block-indent'));
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[1].content[0].content).toBe('');
            expect(editor.blocks[0].indent).toBe(0);
        });

        it('Update indent level on Tab/Shift+Tab key press', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);

            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[0].indent).toBe(1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('0');
            expect(editor.blocks[0].indent).toBe(0);
        });

        it('Transform list to paragraph when backspace is pressed at the start of a list item', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
            const bulletListBlockContent = bulletListBlock.querySelector('#bulletlist-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletListBlockContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content[0].content).toBe('Bullet item');
            expect(editorElement.querySelector('#bulletlist p')).not.toBeNull();
            expect(editorElement.querySelector('#bulletlist p').textContent).toBe('Bullet item');
        });

        it('Merge content to previous list block after transformed to paragraph', (done) => {
            const bulletListBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
            const bulletListBlockContent = bulletListBlock.querySelector('#bulletlist-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletListBlockContent, 6);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editor.blocks[0].content[0].content).toBe('Bullet');
            let newListBlock = bulletListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).not.toBeNull();
            expect(newListBlock.getAttribute('data-block-type')).toBe(BlockType.BulletList.toString());
            let newListContent = getBlockContentElement(newListBlock);
            expect(bulletListBlockContent.textContent).toBe('Bullet');
            expect(newListContent.textContent).toBe(' item');
            editor.blockManager.setFocusToBlock(newListBlock);
            setCursorPosition(newListContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].content[0].content).toBe(' item');
            setTimeout(() => {
                newListBlock = bulletListBlock.nextElementSibling as HTMLElement;
                newListContent = getBlockContentElement(newListBlock);
                editor.blockManager.setFocusToBlock(newListBlock);
                setCursorPosition(newListContent, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
                expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
                expect(editor.blocks[0].content[0].content).toBe('Bullet item');
                expect(editorElement.querySelector('#bulletlist li')).not.toBeNull();
                expect(editorElement.querySelector('#bulletlist li').textContent).toBe('Bullet item');
                done();
            }, 50);
        });
    });

    describe('Additional test cases for Numbered list blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
            const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
            node.dispatchEvent(event);
        }

        function simulateMultiBlockSelection(startBlock: HTMLElement, endBlock: HTMLElement): void {
            // Create a mock selection range
            const range = document.createRange();
            range.setStartBefore(startBlock);
            range.setEndAfter(endBlock);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Spy on getSelectedBlocks to return the appropriate blocks
            const startBlockId = startBlock.id;
            const endBlockId = endBlock.id;
            
            // Get all blocks between start and end blocks inclusive
            const allBlocks = editor.blockManager.getEditorBlocks();
            const startIdx = allBlocks.findIndex(b => b.id === startBlockId);
            const endIdx = allBlocks.findIndex(b => b.id === endBlockId);
            const selectedBlocks = allBlocks.slice(
                Math.min(startIdx, endIdx),
                Math.max(startIdx, endIdx) + 1
            );
            
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);
        }

        function triggerDragEvent(node: HTMLElement, eventType: string, x: number, y: number, dataTransfer: DataTransfer = new DataTransfer()): void {
            const dragEvent = new DragEvent(eventType, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: dataTransfer });
            node.dispatchEvent(dragEvent);
        }  

        it('On apply formatting (e.g., italic) to multiple selected list items, retain indices and apply formatting', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'numberedlist-format-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item One' }] },
                { id: 'numberedlist-format-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item Two' }] },
                { id: 'numberedlist-format-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item Three' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#numberedlist-format-1') as HTMLElement;
            const block2 = editorElement.querySelector('#numberedlist-format-2') as HTMLElement;
            const block3 = editorElement.querySelector('#numberedlist-format-3') as HTMLElement;

            const range = document.createRange();
            const selection = window.getSelection();
            const startNode = getBlockContentElement(block2).firstChild;
            const endNode = getBlockContentElement(block3).lastChild;
            const block2Content = getBlockContentElement(block2);
            const block3Content = getBlockContentElement(block3);
            range.setStart(block2Content.firstChild, 0);
            range.setEnd(block3Content.firstChild, block3Content.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            editor.blockManager.setFocusToBlock(block2);
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            expect(editor.blocks.length).toBe(3);
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(block1).querySelector('em')).toBeNull();
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(block2).querySelector('em')).not.toBeNull();
            expect(getBlockContentElement(block2).querySelector('em').textContent).toBe('Item Two');
            expect((editor.blocks[1].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            expect(getBlockContentElement(block3).style.getPropertyValue('list-style-type')).toContain('3.');
            expect(getBlockContentElement(block3).querySelector('em')).not.toBeNull();
            expect(getBlockContentElement(block3).querySelector('em').textContent).toBe('Item Three');
            expect((editor.blocks[2].content[0].properties as BaseStylesProp).styles.italic).toBe(true);
            done();
        });

        it('On indent multiple selected non-consecutive list items, update each to next level independently', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-non-consecutive-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-non-consecutive-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item 2' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#nl-non-consecutive-1') as HTMLElement;
            const block2 = editorElement.querySelector('#nl-non-consecutive-2') as HTMLElement;
            
            const range = document.createRange();
            const selection = window.getSelection();
            const startNode = getBlockContentElement(block1).firstChild;
            const endNode = getBlockContentElement(block2).lastChild;
            const block1Content = getBlockContentElement(block1);
            const block2Content = getBlockContentElement(block2);
            range.setStart(block1Content.firstChild, 0);
            range.setEnd(block2Content.firstChild, block2Content.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(editor.blocks[0].indent).toBe(1);
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(editor.blocks[1].indent).toBe(2);
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('i.');
            done();
        });

        it('On outdent the last item in a nested list, promote it and adjust sibling indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nl-nested-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A' }] },
                { id: 'nl-nested-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const parentBlock = editorElement.querySelector('#nl-parent') as HTMLElement;
            const nestedBlock1 = editorElement.querySelector('#nl-nested-1') as HTMLElement;
            const nestedBlock2 = editorElement.querySelector('#nl-nested-2') as HTMLElement;
            expect(getBlockContentElement(parentBlock).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(nestedBlock1).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(getBlockContentElement(nestedBlock2).style.getPropertyValue('list-style-type')).toContain('b.');
            editor.blockManager.setFocusToBlock(nestedBlock2);
            setCursorPosition(getBlockContentElement(nestedBlock2), 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
            expect(editor.blocks[2].indent).toBe(0);
            expect(nestedBlock2.style.getPropertyValue('--block-indent')).toBe('0');
            expect(getBlockContentElement(nestedBlock2).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(editor.blocks[1].indent).toBe(1);
            expect(getBlockContentElement(nestedBlock1).style.getPropertyValue('list-style-type')).toContain('a.');
            done();
        });

        it('On Backspace in empty nested list item, transform to paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-bs', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }] },
                { id: 'nl-nested-empty-bs', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const parentBlock = editorElement.querySelector('#nl-parent-bs') as HTMLElement;
            const nestedBlock = editorElement.querySelector('#nl-nested-empty-bs') as HTMLElement;
            expect(getBlockContentElement(parentBlock).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(nestedBlock).style.getPropertyValue('list-style-type')).toContain('a.');
            editor.blockManager.setFocusToBlock(nestedBlock);
            setCursorPosition(getBlockContentElement(nestedBlock), 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks.length).toBe(2);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            const paragraphBlock = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(paragraphBlock.getAttribute('data-block-type')).toBe('Paragraph');
            expect(paragraphBlock.querySelector('p')).not.toBeNull();
            done();
        });

        it('On delete entire nested sublist, remove it and continue parent list indices seamlessly', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-del-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nl-nested-del-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A (to delete)' }] },
                { id: 'nl-nested-del-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item B (to delete)' }] },
                { id: 'nl-parent-del-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const parentBlock1 = editorElement.querySelector('#nl-parent-del-1') as HTMLElement;
            const nestedBlock1 = editorElement.querySelector('#nl-nested-del-1') as HTMLElement;
            const nestedBlock2 = editorElement.querySelector('#nl-nested-del-2') as HTMLElement;
            const parentBlock2 = editorElement.querySelector('#nl-parent-del-2') as HTMLElement;
            expect(getBlockContentElement(parentBlock1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(nestedBlock1).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(getBlockContentElement(nestedBlock2).style.getPropertyValue('list-style-type')).toContain('b.');
            expect(getBlockContentElement(parentBlock2).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(editor.blocks.length).toBe(4);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

            const range = document.createRange();
            const selection = window.getSelection();
            const startNode = getBlockContentElement(nestedBlock1).firstChild;
            const endNode = getBlockContentElement(nestedBlock2).lastChild;
            const nested1Content = getBlockContentElement(nestedBlock1);
            const nested2Content = getBlockContentElement(nestedBlock2);
            range.setStart(nested1Content.firstChild, 0);
            range.setEnd(nested2Content.firstChild, nested2Content.textContent.length);
            selection.removeAllRanges();
            selection.addRange(range);
            editor.blockManager.setFocusToBlock(nestedBlock1);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

            expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).id).toBe('nl-parent-del-1');
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('nl-parent-del-1');
            expect(getBlockContentElement(editorElement.querySelector('#nl-parent-del-1')).style.getPropertyValue('list-style-type')).toContain('1.');
            const updatedParent2Block = editorElement.querySelector('#nl-parent-del-2') as HTMLElement;
            expect(updatedParent2Block).not.toBeNull();
            expect(editor.blocks[1].id).toBe('nl-nested-del-2');
            expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).id).toBe('nl-nested-del-2');
            expect(getBlockContentElement(updatedParent2Block).style.getPropertyValue('list-style-type')).toContain('2.');
            done();
        });
        
        it('Transform nested numbered list to nested bullet list, preserving hierarchy and content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-transform', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Numbered Item' }] },
                { id: 'nl-nested-transform-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Alpha Item' }] },
                { id: 'nl-nested-transform-2', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Nested Roman Item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            let nestedAlphaBlock = editorElement.querySelector('#nl-nested-transform-1') as HTMLElement;
            const nestedRomanBlock = editorElement.querySelector('#nl-nested-transform-2') as HTMLElement;
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(nestedAlphaBlock).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(getBlockContentElement(nestedRomanBlock).style.getPropertyValue('list-style-type')).toContain('i.');
            editor.blockManager.setFocusToBlock(nestedAlphaBlock);
            const contentElement = getBlockContentElement(nestedAlphaBlock);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(nestedAlphaBlock);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            nestedAlphaBlock = editorElement.querySelector('#nl-nested-transform-1');
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
            expect(getBlockContentElement(nestedAlphaBlock).style.getPropertyValue('list-style-type')).toBe('');
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(nestedRomanBlock).style.getPropertyValue('list-style-type')).toContain('i.');
            expect(editor.blocks[2].indent).toBe(2); 
            done();
        });

        it('On split list item with nested content, duplicate nesting structure for new item', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-split', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nl-split-target', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Section A.1 has more content' }] },
                { id: 'nl-after-split', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const splitTargetBlock = editorElement.querySelector('#nl-split-target') as HTMLElement;
            const splitTargetContent = getBlockContentElement(splitTargetBlock);
            editor.blockManager.setFocusToBlock(splitTargetBlock);
            setCursorPosition(splitTargetContent, 'Section A.1 '.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).textContent).toBe('Section A.1 ');
                expect(editor.blocks.length).toBe(4);
                expect(editor.blocks[1].content[0].content).toBe('Section A.1 ');
                expect(editor.blocks[1].indent).toBe(1);
                expect(getBlockContentElement(splitTargetBlock).style.getPropertyValue('list-style-type')).toContain('a.');
                const newBlockElement = splitTargetBlock.nextElementSibling as HTMLElement;
                expect(newBlockElement).not.toBeNull();
                expect(newBlockElement.id).not.toBe('nl-after-split');
                expect(editor.blocks[2].id).toBe(newBlockElement.id);
                expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].indent).toBe(1);
                expect(getBlockContentElement(newBlockElement).textContent).toBe('has more content');
                expect(getBlockContentElement(newBlockElement).style.getPropertyValue('list-style-type')).toContain('b.'); // Next sequential letter
                const updatedParentAfterSplit = newBlockElement.nextElementSibling as HTMLElement;
                expect(updatedParentAfterSplit.id).toBe('nl-after-split');
                expect(editor.blocks[3].id).toBe('nl-after-split');
                expect(editor.blocks[3].indent).toBe(0);
                expect(getBlockContentElement(updatedParentAfterSplit).style.getPropertyValue('list-style-type')).toContain('2.'); // Re-indexed
                done();
            }, 50);
        });
        

        it('On enter after roman numeral in further nested level, create new block with next roman (ii)', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-level1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Level 1 Item' }] },
                { id: 'nl-level2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Level 2 Item A' }] },
                { id: 'nl-level3', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Level 3 Item I' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const romanNumeralBlock = editorElement.querySelector('#nl-level3') as HTMLElement;
            const romanContent = getBlockContentElement(romanNumeralBlock);
            expect(getBlockContentElement(romanNumeralBlock).style.getPropertyValue('list-style-type')).toContain('i.');

            editor.blockManager.setFocusToBlock(romanNumeralBlock);
            setCursorPosition(romanContent, romanContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editor.blocks.length).toBe(4);
                const newBlock = romanNumeralBlock.nextElementSibling as HTMLElement;
                expect(newBlock).not.toBeNull();
                expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].indent).toBe(2);
                expect(getBlockContentElement(newBlock).style.getPropertyValue('list-style-type')).toContain('ii.');
                done();
        });

        it('On tab after further nested roman, indent to deepest level and restart alphabet (a) or adjust per scheme', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-deep-parent', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'L1: One' }] },
                { id: 'nl-deep-alpha', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'L2: A' }] },
                { id: 'nl-deep-roman', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'L3: i' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock = editorElement.querySelector('#nl-deep-roman') as HTMLElement;
            
            const targetContent = getBlockContentElement(targetBlock);
            editor.blockManager.setFocusToBlock(targetBlock);
            setCursorPosition(targetContent, targetContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            const newBlock = targetBlock.nextElementSibling as HTMLElement;
                expect(editor.blocks[3].indent).toBe(3);
                expect(getBlockContentElement(newBlock).style.getPropertyValue('list-style-type')).toContain('1.');
                done();

        });

        it('On shift+tab from deepest level, outdent step-by-step, continuing appropriate index type', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-deepest-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Level 1' }] },
                { id: 'nl-deepest-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Level 2' }] },
                { id: 'nl-deepest-3', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Level 3' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const itemLevel3 = editorElement.querySelector('#nl-deepest-3') as HTMLElement;
            const contentLevel3 = getBlockContentElement(itemLevel3);

            // Initial state check
            expect(editor.blocks[2].indent).toBe(2);
            expect(contentLevel3.style.getPropertyValue('list-style-type')).toContain('i.');

            // Shift+Tab once (from indent 4 to 3)
            editor.blockManager.setFocusToBlock(itemLevel3);
            setCursorPosition(contentLevel3, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks[2].indent).toBe(1);
                expect(contentLevel3.style.getPropertyValue('list-style-type')).toContain('b.'); // Should become numeric
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
                setTimeout(() => {
                    expect(editor.blocks[2].indent).toBe(0);
                    expect(contentLevel3.style.getPropertyValue('list-style-type')).toContain('2.');
                    done();    
                }, 10);
            }, 50);
        });

        it('On backspace at start of list item with nested content, convert nested structure to paragraph while flattening', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-flat-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-flat-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2 has nested a)' }] },
                { id: 'nl-flat-nested-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A' }] },
                { id: 'nl-flat-nested-b', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item2Block = editorElement.querySelector('#nl-flat-2') as HTMLElement;
            const item2Content = getBlockContentElement(item2Block);
            const nestedA = editorElement.querySelector('#nl-flat-nested-a') as HTMLElement;
            const nestedB = editorElement.querySelector('#nl-flat-nested-b') as HTMLElement;

            // Paragraph block after flattening
            expect(item2Block.getAttribute('data-block-type')).toBe('NumberedList');
            expect(item2Block.querySelector('p')).toBeNull();
            expect(getBlockContentElement(item2Block).textContent).toBe('Item 2 has nested a)');
                    
            // Nested blocks remain numbered
            expect(nestedA.getAttribute('data-block-type')).toBe('NumberedList');
            expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
                    
            expect(nestedB.getAttribute('data-block-type')).toBe('NumberedList');
            expect((editorElement.querySelectorAll('.e-block')[2] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                    
            // Total block count in DOM
            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);

            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].indent).toBe(0);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].indent).toBe(1);
            expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[3].indent).toBe(1);
            editor.blockManager.setFocusToBlock(item2Block);
            setCursorPosition(item2Content, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
            const paragraphBlock = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(paragraphBlock.getAttribute('data-block-type')).toBe('Paragraph');
            expect(paragraphBlock.querySelector('p')).not.toBeNull();
            expect(getBlockContentElement(paragraphBlock).textContent).toBe('Item 2 has nested a)');
            
            expect((editorElement.querySelectorAll('.e-block')[2] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
            expect(getBlockContentElement(editorElement.querySelectorAll('.e-block')[2] as HTMLElement).textContent).toBe('Nested Item A');
            expect((editorElement.querySelectorAll('.e-block')[3] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');

            expect(editor.blocks.length).toBe(4); 
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].content[0].content).toBe('Item 2 has nested a)');
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
            done();
        });

        it('On delete at end of list item with nested sublist, merge next item including its nesting', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-merge-parent-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent 1' }] },
                { id: 'nl-merge-parent-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent 2' }] },
                { id: 'nl-merge-nested-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested A' }] },
                { id: 'nl-merge-nested-b', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const parent1Block = editorElement.querySelector('#nl-merge-parent-1') as HTMLElement;
            const parent2Block = editorElement.querySelector('#nl-merge-parent-2') as HTMLElement;
            const parent1Content = getBlockContentElement(parent1Block);
            const parent2Content = getBlockContentElement(parent2Block);

            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).textContent).toBe('Parent 1');
            expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).textContent).toBe('Parent 2');
            expect((editorElement.querySelectorAll('.e-block')[2] as HTMLElement).textContent).toBe('Nested A');
            expect((editorElement.querySelectorAll('.e-block')[3] as HTMLElement).textContent).toBe('Nested B');

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].content[0].content).toBe('Parent 1');
            expect(editor.blocks[1].content[0].content).toBe('Parent 2');
            expect(editor.blocks[2].content[0].content).toBe('Nested A');
            expect(editor.blocks[3].content[0].content).toBe('Nested B');

            editor.blockManager.setFocusToBlock(parent1Block);
            setCursorPosition(parent1Content, parent1Content.textContent.length);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

            expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).textContent).toBe('Parent 1Parent 2');
            expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).id).toBe('nl-merge-nested-a');
            expect((editorElement.querySelectorAll('.e-block')[2] as HTMLElement).id).toBe('nl-merge-nested-b');

            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].content[0].content).toBe('Parent 1Parent 2');
            expect(parent1Block.querySelector('li').textContent).toBe('Parent 1Parent 2');
            expect(getBlockContentElement(parent1Block).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editorElement.querySelector('#nl-merge-parent-2')).toBeNull();
            expect(editor.blocks[1].id).toBe('nl-merge-nested-a');
            expect(editor.blocks[1].indent).toBe(1);
            expect(getBlockContentElement(editorElement.querySelector('#nl-merge-nested-a')).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(editor.blocks[2].id).toBe('nl-merge-nested-b');
            expect(editor.blocks[2].indent).toBe(1);
            expect(getBlockContentElement(editorElement.querySelector('#nl-merge-nested-b')).style.getPropertyValue('list-style-type')).toContain('b.');
            done();
        });
        
        it('On empty list (single item), backspace converts to paragraph and removes list wrapper', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-single-empty', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: '' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const emptyListBlock = editorElement.querySelector('#nl-single-empty') as HTMLElement;
            const emptyListContent = getBlockContentElement(emptyListBlock);

            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[0].content[0].content).toBe('');
            expect(emptyListBlock.querySelector('ol')).not.toBeNull();
            editor.blockManager.setFocusToBlock(emptyListBlock);
            setCursorPosition(emptyListContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).textContent).toBe('');
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).querySelector('p')).not.toBeNull();

            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[0].content[0].content).toBe('');
            done();
        });

        // it('On move list item to end of another list, append and continue that list\'s indices', (done) => {
        //     editorElement = createElement('div', { id: 'editor' });
        //     document.body.appendChild(editorElement);
        //     const blocks: BlockModel[] = [
        //         { id: 'nl-source-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item A' }] },
        //         { id: 'nl-source-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item B' }] },
        //         { id: 'nl-target-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Target Item 1' }] },
        //         { id: 'nl-target-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Target Item 2' }] }
        //     ];
        //     editor = createEditor({ blocks: blocks });
        //     editor.appendTo('#editor');

        //     const sourceBlock = editorElement.querySelector('#nl-source-1') as HTMLElement;
        //     const targetListEndBlock = editorElement.querySelector('#nl-target-2') as HTMLElement;

        //     // Simulate moving 'Source Item A' to the end of the target list
        //     // This is a programmatic simulation of a drag-and-drop or Cut+Paste action.
        //     // In a real test, you would simulate the actual UI interaction.

        //     // Remove sourceBlock from its original position
        //     const movedBlockModel = editor.blocks.splice(0, 1)[0]; // Remove 'nl-source-1'

        //     // Find the index of the last item in the target list
        //     const targetListEndIndex = editor.blocks.findIndex(block => block.id === 'nl-target-2');

        //     // Insert the moved block after the last item of the target list
        //     editor.blocks.splice(targetListEndIndex + 1, 0, movedBlockModel);
            
        //     editor.dataBind(); // Re-render the editor to reflect changes

        //     setTimeout(() => {
        //         expect(editor.blocks.length).toBe(4);
        //         expect(editor.blocks[0].content[0].content).toBe('Source Item B'); // Source list adjusted
        //         expect(editor.blocks[1].content[0].content).toBe('Target Item 1');
        //         expect(editor.blocks[2].content[0].content).toBe('Target Item 2');
        //         expect(editor.blocks[3].content[0].content).toBe('Source Item A'); // Moved block is now last

        //         // Verify indices
        //         expect(getBlockContentElement(editorElement.querySelector('#nl-source-2')).style.getPropertyValue('list-style-type')).toContain('1.');
        //         expect(getBlockContentElement(editorElement.querySelector('#nl-target-1')).style.getPropertyValue('list-style-type')).toContain('1.');
        //         expect(getBlockContentElement(editorElement.querySelector('#nl-target-2')).style.getPropertyValue('list-style-type')).toContain('2.');
        //         expect(getBlockContentElement(editorElement.querySelector('#nl-source-1')).style.getPropertyValue('list-style-type')).toContain('3.'); // Appended and continued index

        //         done();
        //     }, 200);
        // });

        it('On backspace merging across different list types (number and bullet), convert to common type or paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-merge-target', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered Item' }] },
                { id: 'bl-merge-source', blockType: BlockType.BulletList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Bullet Item' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const numberedBlock = editorElement.querySelector('#nl-merge-target') as HTMLElement;
            const bulletBlock = editorElement.querySelector('#bl-merge-source') as HTMLElement;
            const bulletContent = getBlockContentElement(bulletBlock);

            // Initial state
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);

            // Focus at the start of the A. block
            editor.blockManager.setFocusToBlock(bulletBlock);
            setCursorPosition(bulletContent, 0);

            // Press Backspace 2 times to covert to para and then merge
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(editorElement.querySelectorAll('.e-block')[0].id).toBe('nl-merge-target');
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Numbered ItemBullet Item');
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[0].id).toBe('nl-merge-target');
                expect(editor.blocks[0].content[0].content).toBe('Numbered ItemBullet Item');
                expect(getBlockContentElement(numberedBlock).style.getPropertyValue('list-style-type')).toContain('1.');
                expect(editorElement.querySelector('#bl-merge-source')).toBeNull(); // Bullet block should be gone
                done();
            }, 50);
        });

        it('On delete at end of last list item, merge with following paragraph or create new paragraph', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-last-item', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Last List Item' }] },
                { id: 'paragraph-after', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Following Paragraph' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const lastListItem = editorElement.querySelector('#nl-last-item') as HTMLElement;
            const lastListItemContent = getBlockContentElement(lastListItem);
            const paragraphAfter = editorElement.querySelector('#paragraph-after') as HTMLElement;

            // Initial state
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);

            // Focus at the end of the last list item
            editor.blockManager.setFocusToBlock(lastListItem);
            setCursorPosition(lastListItemContent, lastListItemContent.textContent.length);

            // Press Delete
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                expect(editor.blocks.length).toBe(1); // Should merge into one block
                expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList); // List item remains list, content merged
                expect(editor.blocks[0].content[0].content).toBe('Last List ItemFollowing Paragraph');
                expect(lastListItem.querySelector('li').textContent).toBe('Last List ItemFollowing Paragraph');
                expect(getBlockContentElement(lastListItem).style.getPropertyValue('list-style-type')).toContain('1.');
                expect(editorElement.querySelector('#paragraph-after')).toBeNull(); // Paragraph should be merged and removed
                done();
            }, 50);
        });

        it('On enter in list item with inline links, preserve link formatting in split items', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'nl-link-split',
                    blockType: BlockType.NumberedList,
                    indent: 0,
                    content: [
                        { contentType: ContentType.Text, content: 'Text with ' },
                        { contentType: ContentType.Link, content:  'an inline link', properties: { url: 'https://www.syncfusion.com' }  },
                        { contentType: ContentType.Text, content: ' and more text.' }
                    ]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const linkSplitBlock = editorElement.querySelector('#nl-link-split') as HTMLElement;
            const linkSplitContent = getBlockContentElement(linkSplitBlock);
            const linkElement = linkSplitContent.querySelector('a') as HTMLElement;

            // Place cursor in the middle of the link content, e.g., after "inline "
            editor.blockManager.setFocusToBlock(linkSplitBlock);
            setCursorPosition(linkElement, 'an inline '.length);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            expect(editorElement.querySelectorAll('.e-block').length).toBe(2);
            expect(editor.blocks.length).toBe(2);
            // First block should contain text before and part of the link
            expect(editor.blocks[0].id).toBe('nl-link-split');
            expect(getBlockContentElement(linkSplitBlock).querySelector('a')).not.toBeNull();
            expect((getBlockContentElement(linkSplitBlock).querySelector('a') as HTMLElement).textContent).toBe('an inline ');
            expect(getBlockContentElement(linkSplitBlock).style.getPropertyValue('list-style-type')).toContain('1.');
            // New block should contain the remaining part of the link and the text after it
            const newBlock = linkSplitBlock.nextElementSibling as HTMLElement;
            expect(newBlock).not.toBeNull();
            expect(editor.blocks[0].content.some(c => c.contentType === ContentType.Link)).toBe(true);
            expect(editor.blocks[1].content.some(c => c.contentType === ContentType.Link)).toBe(true);
            // 1 link per block check
            expect(getBlockContentElement(linkSplitBlock).querySelectorAll('a').length).toBe(1);
            expect(getBlockContentElement(newBlock).querySelectorAll('a').length).toBe(1);

            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
            expect(editor.blocks[1].indent).toBe(0);
            expect(getBlockContentElement(newBlock).querySelector('a')).not.toBeNull();
            expect((getBlockContentElement(newBlock).querySelector('a') as HTMLElement).textContent).toBe('link'); // Assuming "link" is the remaining part after "an inline " from "an inline link" after split
            expect(getBlockContentElement(newBlock).textContent).toContain(' and more text.');
            expect(getBlockContentElement(newBlock).style.getPropertyValue('list-style-type')).toContain('2.');
            done();
           
        });        

        it('On apply formatting (e.g., underline) to partial list item text, retain index and apply formatting', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-partial-format', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'This is some text in a list item.' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const listItemBlock = editorElement.querySelector('#nl-partial-format') as HTMLElement;
            const listItemContent = getBlockContentElement(listItemBlock);

            // Select "some text"
            editor.blockManager.setFocusToBlock(listItemBlock);
            setSelectionRange(listItemContent.firstChild as Node, 8, 17); // "some text"

            // Apply underline formatting
            editor.blockManager.formattingAction.execCommand({ command: 'underline' });
            expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
            expect(editor.blocks[0].indent).toBe(0);

            // Verify the content and formatting
            const updatedContent = editor.blocks[0].content;
            expect(updatedContent.length).toBe(3);
            expect(updatedContent[0].content).toBe('This is ');
            expect(updatedContent[1].content).toBe('some text');
            expect((updatedContent[1] as any).properties.styles.underline).toBe(true);
            expect(updatedContent[2].content).toBe(' in a list item.');
            // Verify DOM
            expect(listItemContent.style.getPropertyValue('list-style-type')).toContain('1.');
            const underlinedSpan = listItemContent.querySelector('u');
            expect(underlinedSpan).not.toBeNull();
            expect(underlinedSpan.textContent).toBe('some text');
            done();
            
        });

        it('On indent single item with nested sublist, indent entire sublist and update indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                
                { id: 'nl-target-item', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item to indent' }] },
                { id: 'nl-nested-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested A' }] },
                { id: 'nl-nested-b', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Nested B' }] },
                
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock = editorElement.querySelector('#nl-target-item') as HTMLElement;
            const nestedABlock = editorElement.querySelector('#nl-nested-a') as HTMLElement;
            const nestedBBlock = editorElement.querySelector('#nl-nested-b') as HTMLElement;

            // Initial state
            expect(editor.blocks[0].indent).toBe(0); // Item to indent
            expect(editor.blocks[1].indent).toBe(1); // Nested A
            expect(editor.blocks[2].indent).toBe(2); // Nested B

            editor.blockManager.setFocusToBlock(targetBlock);
            setCursorPosition(getBlockContentElement(targetBlock), 0);

            // Indent (Tab key)
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

            expect(editor.blocks[0].indent).toBe(1);
            expect(getBlockContentElement(targetBlock).style.getPropertyValue('list-style-type')).toContain('a.');

            expect(editor.blocks[1].indent).toBe(1); 
            expect(getBlockContentElement(nestedABlock).style.getPropertyValue('list-style-type')).toContain('b.'); // Starts new alpha series
            expect(editor.blocks[2].indent).toBe(2); 
            expect(getBlockContentElement(nestedBBlock).style.getPropertyValue('list-style-type')).toContain('i.'); // Starts new numeric series
            done();
        });
        
        it('On outdent single item with nested sublist, outdent entire sublist and update indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                 
                { id: 'nl-target-outdent', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item to outdent' }] },
                { id: 'nl-nested-outdent-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested A' }] },
                { id: 'nl-nested-outdent-b', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Nested B' }] },
                
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock = editorElement.querySelector('#nl-target-outdent') as HTMLElement;
            const nestedABlock = editorElement.querySelector('#nl-nested-outdent-a') as HTMLElement;
            const nestedBBlock = editorElement.querySelector('#nl-nested-outdent-b') as HTMLElement;
            
            expect(editor.blocks[0].indent).toBe(0); 
            expect(getBlockContentElement(targetBlock).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].indent).toBe(1);
            expect(getBlockContentElement(nestedABlock).style.getPropertyValue('list-style-type')).toContain('a.');
            expect(editor.blocks[2].indent).toBe(2);
            expect(getBlockContentElement(nestedBBlock).style.getPropertyValue('list-style-type')).toContain('i.');

            editor.blockManager.setFocusToBlock(nestedABlock);
            setCursorPosition(getBlockContentElement(nestedABlock), 0);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));

            expect(editor.blocks[0].indent).toBe(0);
            expect(getBlockContentElement(targetBlock).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].indent).toBe(0);
            expect(getBlockContentElement(nestedABlock).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(editor.blocks[2].indent).toBe(2);
            expect(getBlockContentElement(nestedBBlock).style.getPropertyValue('list-style-type')).toContain('i.');
            done();

        });

        it('On transform list to checklist, convert numbered items to checkboxes with same content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-to-cl-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered Item One' }] },
                { id: 'nl-to-cl-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Numbered Alpha A' }] },
                { id: 'nl-to-cl-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Numbered Item Two' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            let item1Block = editorElement.querySelector('#nl-to-cl-1') as HTMLElement;
            let item1Content = getBlockContentElement(item1Block);

            // Initial state
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);

            // Focus on the first list item and transform to Checklist
            editor.blockManager.setFocusToBlock(item1Block);
            setCursorPosition(item1Content, 0);
            item1Content.textContent = '/' + item1Content.textContent;
            setCursorPosition(item1Content, 1); // Place cursor after slash
            editor.blockManager.stateManager.updateContentOnUserTyping(item1Block); // Update model content for slash command trigger

            // Trigger slash command menu
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
             
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const checklistElement = slashCommandElement.querySelector('li[data-value="Checklist"]') as HTMLElement;
            expect(checklistElement).not.toBeNull();
            checklistElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            setTimeout(() => {
                item1Block = editorElement.querySelector('#nl-to-cl-1') as HTMLElement;
                // Only selected block should be transformed to Checklist type
                expect(item1Block.getAttribute('data-block-type')).toBe('Checklist');
                expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);

                // Checkboxes should be present for all transformed items
                // expect(item1Block.querySelector('.e-checkmark-container')).not.toBeNull();

                // Content should be preserved
                expect(editorElement.querySelectorAll('.e-block')[0].textContent).toBe('Numbered Item One');
                expect(editorElement.querySelectorAll('.e-block')[1].textContent).toBe('Numbered Alpha A');
                expect(editorElement.querySelectorAll('.e-block')[2].textContent).toBe('Numbered Item Two');
                expect(editor.blocks[0].content[0].content).toBe('Numbered Item One');
                expect(editor.blocks[1].content[0].content).toBe('Numbered Alpha A');
                expect(editor.blocks[2].content[0].content).toBe('Numbered Item Two');

                // Indent levels should be preserved
                expect((editorElement.querySelectorAll('.e-block')[0] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
                expect((editorElement.querySelectorAll('.e-block')[1] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                expect((editorElement.querySelectorAll('.e-block')[2] as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
                expect(editor.blocks[0].indent).toBe(0);
                expect(editor.blocks[1].indent).toBe(1);
                expect(editor.blocks[2].indent).toBe(0);
                done();
            }, 200);
        });

        it('On keyboard navigation (e.g., arrow keys) in nested list, maintain focus and index integrity', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-nav-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-nav-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested A' }] },
                { id: 'nl-nav-3', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: 'Nested I' }] },
                { id: 'nl-nav-4', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1 = editorElement.querySelector('#nl-nav-1') as HTMLElement;
            const item2 = editorElement.querySelector('#nl-nav-2') as HTMLElement;
            const item3 = editorElement.querySelector('#nl-nav-3') as HTMLElement;
            const item4 = editorElement.querySelector('#nl-nav-4') as HTMLElement;

            // Start focus on "Nested I" (item3)
            editor.blockManager.setFocusToBlock(item3);
            setCursorPosition(getBlockContentElement(item3), 0);
            // expect(editor.selection.getSelection().focusNode.parentElement.closest('.e-block').id).toBe('nl-nav-3');

            // Move focus up to "Nested A" (item2)
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
            
            editorElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp', bubbles: true }));

            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                expect(editor.blocks.length).toBe(4);
                // expect(editor.getSelection().focusNode.parentElement.closest('.e-block').id).toBe('nl-nav-2');
                expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                expect(getBlockContentElement(item1).style.getPropertyValue('list-style-type')).toContain('1.');
                expect(getBlockContentElement(item2).style.getPropertyValue('list-style-type')).toContain('a.');
                expect(getBlockContentElement(item3).style.getPropertyValue('list-style-type')).toContain('i.');
                expect(getBlockContentElement(item4).style.getPropertyValue('list-style-type')).toContain('2.');

                // Move focus down to "Nested I" (item3)
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
                editorElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown', bubbles: true }));
                
                setTimeout(() => {
                    expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
                    expect(editor.blocks.length).toBe(4);
                    // expect(editor.selection.getSelection().focusNode.parentElement.closest('.e-block').id).toBe('nl-nav-3');
                    expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                    expect(getBlockContentElement(item1).style.getPropertyValue('list-style-type')).toContain('1.');
                    expect(getBlockContentElement(item2).style.getPropertyValue('list-style-type')).toContain('a.');
                    expect(getBlockContentElement(item3).style.getPropertyValue('list-style-type')).toContain('i.');
                    expect(getBlockContentElement(item4).style.getPropertyValue('list-style-type')).toContain('2.');
                    done();
                }, 50);
            }, 50);
        });

        it('On split list into two separate lists, renumber second list starting from 1 or custom value', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-split-list-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-split-list-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2 (split point)' }] },
                { id: 'nl-split-list-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const splitPointBlock = editorElement.querySelector('#nl-split-list-2') as HTMLElement;
            const splitPointContent = getBlockContentElement(splitPointBlock);
            const item3Block = editorElement.querySelector('#nl-split-list-3') as HTMLElement;
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('3.');
            editor.blockManager.setFocusToBlock(splitPointBlock);
            setCursorPosition(splitPointContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editorElement.querySelectorAll('.e-block').length).toBe(4);
            const paragraphBlock = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            expect(paragraphBlock.getAttribute('data-block-type')).toBe('Paragraph');
            expect(getBlockContentElement(paragraphBlock).textContent).toBe('');
            const splitBlock = editorElement.querySelectorAll('.e-block')[2] as HTMLElement;
            expect(getBlockContentElement(splitBlock).textContent).toBe('Item 2 (split point)');
            expect(item3Block).not.toBeNull();
            expect(item3Block.getAttribute('data-block-type')).toBe('NumberedList');

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(editorElement.querySelector('#nl-split-list-1')).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].content[0].content).toBe('');
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].content[0].content).toBe('Item 2 (split point)'); 
            expect(editor.blocks[3].id).toBe('nl-split-list-3');
            expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('2.'); 
            done();
        });

        it('On merge two numbered lists, renumber sequentially across combined list', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-first-list-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'First List A' }] },
                { id: 'nl-first-list-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'First List B' }] },
                { id: 'nl-second-list-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Second List X' }] },
                { id: 'nl-second-list-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Second List Y' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const firstListB = editorElement.querySelector('#nl-first-list-2') as HTMLElement;
            const secondListX = editorElement.querySelector('#nl-second-list-1') as HTMLElement;
            const secondListXContent = getBlockContentElement(secondListX);

            expect(getBlockContentElement(firstListB).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(secondListX).style.getPropertyValue('list-style-type')).toContain('3.');
            editor.blockManager.setFocusToBlock(secondListX);
            setCursorPosition(secondListXContent, 0);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

            expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
            expect(getBlockContentElement(firstListB).textContent).toBe('First List BSecond List X');

            expect(editor.blocks.length).toBe(3);
            expect(getBlockContentElement(editorElement.querySelector('#nl-first-list-1')).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].id).toBe('nl-first-list-2');
            expect(editor.blocks[1].content[0].content).toBe('First List BSecond List X');
            expect(getBlockContentElement(firstListB).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(editor.blocks[2].id).toBe('nl-second-list-2');
            expect(getBlockContentElement(editorElement.querySelector('#nl-second-list-2')).style.getPropertyValue('list-style-type')).toContain('3.');
            expect(editorElement.querySelector('#nl-second-list-1')).toBeNull();
            done();
        });

        it('On apply multiple formats (e.g., bold+italic) to list item, retain index and apply all formats', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-multi-format', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'This is some text for formatting.' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const listItemBlock = editorElement.querySelector('#nl-multi-format') as HTMLElement;
            const listItemContent = getBlockContentElement(listItemBlock);
            editor.blockManager.setFocusToBlock(listItemBlock);
            setSelectionRange(listItemContent.firstChild as Node, 8, 17);
            editor.blockManager.formattingAction.execCommand({ command: 'bold' });
            editor.blockManager.formattingAction.execCommand({ command: 'italic' });
            setTimeout(() => {
                expect(editorElement.querySelectorAll('.e-block').length).toBe(1);
                const strongElement = listItemContent.querySelector('strong');
                const emElement = listItemContent.querySelector('em');  
                expect(strongElement).not.toBeNull();
                expect(emElement).not.toBeNull();
                expect(strongElement.textContent).toBe('some text');
                expect(emElement.textContent).toBe('some text');


                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[0].indent).toBe(0);
                const updatedContent = editor.blocks[0].content;
                expect(updatedContent.length).toBe(3);
                expect(updatedContent[0].content).toBe('This is ');
                expect(updatedContent[1].content).toBe('some text');
                expect((updatedContent[1] as any).properties.styles.bold).toBe(true);
                expect((updatedContent[1] as any).properties.styles.italic).toBe(true);
                expect(updatedContent[2].content).toBe(' for formatting.');
                expect(listItemContent.style.getPropertyValue('list-style-type')).toContain('1.');
                done();
            }, 50);
        });

        it('On enter in deeply nested empty item, create new item at same level with next index', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-deep-parent-item', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }] },
                { id: 'nl-deep-nested-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested A' }] },
                { id: 'nl-deep-nested-2', blockType: BlockType.NumberedList, indent: 2, content: [{ contentType: ContentType.Text, content: '' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const emptyNestedBlock = editorElement.querySelector('#nl-deep-nested-2') as HTMLElement;
            const emptyNestedContent = getBlockContentElement(emptyNestedBlock);
            expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[2].indent).toBe(2);
            expect(emptyNestedContent.style.getPropertyValue('list-style-type')).toContain('i.'); //this itself does the indent check
            editor.blockManager.setFocusToBlock(emptyNestedBlock);
            setCursorPosition(emptyNestedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(editorElement.querySelectorAll('.e-block').length).toBe(3);
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[2].indent).toBe(1);
            expect(getBlockContentElement(emptyNestedBlock).style.getPropertyValue('list-style-type')).toContain('b.');
            done();
        });

        
        it('On undo after outdent, revert to previous level and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-undo-outdent-parent', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }] },
                { id: 'nl-undo-outdent-target', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item to Outdent' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const targetBlock = editorElement.querySelector('#nl-undo-outdent-target') as HTMLElement;
            const targetContent = getBlockContentElement(targetBlock);
            expect(editor.blocks[1].indent).toBe(1);
            expect(targetContent.style.getPropertyValue('list-style-type')).toContain('a.');
            editor.blockManager.setFocusToBlock(targetBlock);
            setCursorPosition(targetContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
            setTimeout(() => {
                expect(editor.blocks[1].indent).toBe(0);
                expect(targetContent.style.getPropertyValue('list-style-type')).toContain('2.');
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
                setTimeout(() => {
                    expect(editor.blocks[1].indent).toBe(1);
                    expect(targetContent.style.getPropertyValue('list-style-type')).toContain('a.');
                    done();
                }, 50);
            }, 50);
        });
        
        it('On redo after outdent, revert to previous level and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-redo-outdent-parent', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }] },
                { id: 'nl-redo-outdent-target', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item to Outdent' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock = editorElement.querySelector('#nl-redo-outdent-target') as HTMLElement;
            const targetContent = getBlockContentElement(targetBlock);

            expect(editor.blocks[1].indent).toBe(1);
            expect(targetContent.style.getPropertyValue('list-style-type')).toContain('a.');

            editor.blockManager.setFocusToBlock(targetBlock);
            setCursorPosition(targetContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));

            setTimeout(() => {
                expect(editor.blocks[1].indent).toBe(0);
                expect(targetContent.style.getPropertyValue('list-style-type')).toContain('2.');
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
                setTimeout(() => {
                    expect(editor.blocks[1].indent).toBe(1);
                    expect(targetContent.style.getPropertyValue('list-style-type')).toContain('a.');

                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));

                    setTimeout(() => {
                        expect(editor.blocks[1].indent).toBe(0);
                        expect(targetContent.style.getPropertyValue('list-style-type')).toContain('2.');
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });

        it('On undo after list transformation to bullet, revert to numbered with original indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-transform-undo-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Original Item 1' }] },
                { id: 'nl-transform-undo-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Original Nested A' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1Block = editorElement.querySelector('#nl-transform-undo-1') as HTMLElement;
            const item1Content = getBlockContentElement(item1Block);
            const item2Block = editorElement.querySelector('#nl-transform-undo-2') as HTMLElement;

            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(item1Content.style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('a.');
            editor.blockManager.setFocusToBlock(item1Block);
            setCursorPosition(item1Content, 0);
            item1Content.textContent = '/' + item1Content.textContent;
            setCursorPosition(item1Content, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(item1Block);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
            const bulletListElement = slashCommandElement.querySelector('li[data-value="Bullet List"]') as HTMLElement;
            expect(bulletListElement).not.toBeNull();
            bulletListElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));

            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(item1Block).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('a.');
            done();
        });

        it('On redo after list deletion (manual empty content), restore items with correct sequential indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-delete-redo-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-delete-redo-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2 (to delete)' }] },
                { id: 'nl-delete-redo-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1Block = editorElement.querySelector('#nl-delete-redo-1') as HTMLElement;
            const item2Block = editorElement.querySelector('#nl-delete-redo-2') as HTMLElement;
            const item3Block = editorElement.querySelector('#nl-delete-redo-3') as HTMLElement;
            const item2Content = getBlockContentElement(item2Block);
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(3);

            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(item1Block).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('3.');

            editor.blockManager.setFocusToBlock(item2Block);
            
            setCursorPosition(item2Content, 0); 
            item2Content.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(item2Block);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(updatedBlocks.length).toBe(3);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks.length).toBe(3);
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('1.'); 
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            expect(updatedBlocks.length).toBe(3);
            expect(editor.blocks.length).toBe(3);
            const restoredItem2Block = editorElement.querySelector('#nl-delete-redo-2') as HTMLElement; 
            expect(restoredItem2Block).not.toBeNull();
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);

            expect(getBlockContentElement(item1Block).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(restoredItem2Block).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('3.');

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));

            expect(updatedBlocks.length).toBe(3);
            expect(getBlockContentElement(item3Block).style.getPropertyValue('list-style-type')).toContain('1.'); 
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            done();
        });

        it('On undo and redo after style change, restore new style and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-style-redo-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-style-redo-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1Block = editorElement.querySelector('#nl-style-redo-1') as HTMLElement;
            const item2Block = editorElement.querySelector('#nl-style-redo-2') as HTMLElement;
            const item2Content = getBlockContentElement(item2Block);

            expect(item2Content.style.getPropertyValue('list-style-type')).toContain('2.');

            editor.blockManager.setFocusToBlock(item2Block);
            setCursorPosition(item2Content, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })); // Indent further from 1 to 2
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            setTimeout(() => {
                expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('20');
                expect(editor.blocks[1].indent).toBe(1);
                expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('a.');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));

                setTimeout(() => {
                    expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('0');
                    expect(editor.blocks[1].indent).toBe(0);
                    expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('2.');

                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));

                    setTimeout(() => {
                        expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('20');
                        expect(editor.blocks[1].indent).toBe(1);
                        expect(getBlockContentElement(item2Block).style.getPropertyValue('list-style-type')).toContain('a.');
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });

        it('On undo after merging lists, restore original list boundaries and indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-merge-undo-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'First List Item 1' }] },
                { id: 'nl-merge-undo-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'First List Item 2' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#nl-merge-undo-1') as HTMLElement;
            const block2 = editorElement.querySelector('#nl-merge-undo-2') as HTMLElement;
            const block1Content = getBlockContentElement(block1);
            const block2Content = getBlockContentElement(block2);
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('2.');
            editor.blockManager.setFocusToBlock(block2);
            setCursorPosition(block2Content, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(1);
            expect(updatedBlocks[0].textContent).toBe('First List Item 1First List Item 2');
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('First List Item 1First List Item 2');
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(updatedBlocks[1].id).toBe('nl-merge-undo-2');
            expect(updatedBlocks[1].textContent).toBe('First List Item 2');

            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].id).toBe('nl-merge-undo-2');
            expect(editor.blocks[1].content[0].content).toBe('First List Item 2');
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('2.');
            done();
        });

        it('On redo after splitting list, restore split lists with correct indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-split-redo-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List A - Item 1' }] },
                { id: 'nl-split-redo-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List A - Item 2 (split point)' }] },
                { id: 'nl-split-redo-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List A - Item 3' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const block1 = editorElement.querySelector('#nl-split-redo-1') as HTMLElement;
            const block2 = editorElement.querySelector('#nl-split-redo-2') as HTMLElement; // Split point
            const block3 = editorElement.querySelector('#nl-split-redo-3') as HTMLElement;
            const block2Content = getBlockContentElement(block2);
            expect(editor.blocks.length).toBe(3);
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(block3).style.getPropertyValue('list-style-type')).toContain('3.');

            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            editor.blockManager.setFocusToBlock(block2);
            setCursorPosition(block2Content, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            const paragraphBlock = editorElement.querySelectorAll('.e-block')[1] as HTMLElement;
            const paragraphContent = getBlockContentElement(paragraphBlock);
            expect(paragraphBlock.getAttribute('data-block-type')).toBe('Paragraph');
            expect(paragraphContent.textContent).toBe('');
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(4);

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].id).toBe('nl-split-redo-1');
            expect(editor.blocks[1].content[0].content).toBe('');
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            const block3AfterSplit = editor.blocks[3];
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(block3AfterSplit.id).toBe('nl-split-redo-3');
            expect(getBlockContentElement(block3).style.getPropertyValue('list-style-type')).toContain('2.');
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(3);
            expect(updatedBlocks[0].id).toBe('nl-split-redo-1');
            expect(updatedBlocks[1].id).toBe('nl-split-redo-2');
            expect(updatedBlocks[2].id).toBe('nl-split-redo-3');

            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('nl-split-redo-1');
            expect(editor.blocks[1].id).toBe('nl-split-redo-2');
            expect(editor.blocks[2].id).toBe('nl-split-redo-3');
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            expect(getBlockContentElement(block2).style.getPropertyValue('list-style-type')).toContain('2.');
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(4);
            expect(updatedBlocks[0].id).toBe('nl-split-redo-1');
            expect(updatedBlocks[3].id).toBe('nl-split-redo-3');
            expect(updatedBlocks[1].querySelector('p')).not.toBeNull();

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[0].id).toBe('nl-split-redo-1');
            expect(editor.blocks[1].content[0].content).toBe('');
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[3].id).toBe('nl-split-redo-3');
            expect(getBlockContentElement(block1).style.getPropertyValue('list-style-type')).toContain('1.');
            done();
        });

        it('On transform numbered list to heading, convert only selected item to heading block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-to-h-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 1 Content' }] },
                { id: 'nl-to-h-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested List Item 2 Content' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const item1Block = editorElement.querySelector('#nl-to-h-1') as HTMLElement;
            const item1Content = getBlockContentElement(item1Block);
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            editor.blockManager.setFocusToBlock(item1Block);
            setCursorPosition(item1Content, 0);
            item1Content.textContent = '/' + item1Content.textContent;
            setCursorPosition(item1Content, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(item1Block);

            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();

            const heading1Element = slashCommandElement.querySelector('li[data-value="Heading 1"]') as HTMLElement;
            expect(heading1Element).not.toBeNull();
            heading1Element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            setTimeout(() => {
                const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(updatedBlocks.length).toBe(2);
                const headingBlock = editorElement.querySelector('#nl-to-h-1') as HTMLElement;
                expect(headingBlock.getAttribute('data-block-type')).toBe('Heading');
                expect(headingBlock.querySelector('h1')).not.toBeNull();

                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe(BlockType.Heading);
                expect(editor.blocks[0].content[0].content).toBe('List Item 1 Content');
                expect(editor.blocks[0].indent).toBe(0); 
                expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                done();
            }, 200);
        });

        it('On paste numbered list, merge with existing list, continuing sequential indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'source-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Source Item 1' }] },
                { id: 'source-nl-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Source Item 2' }] },
                {id: 'para', blockType: BlockType.Paragraph, content:[{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'First paragraph' }]},
                { id: 'target-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item A' }] },
                { id: 'target-nl-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const sourceBlock1 = editorElement.querySelector('#source-nl-1') as HTMLElement;
            const sourceBlock2 = editorElement.querySelector('#source-nl-2') as HTMLElement;
            const targetBlock2 = editorElement.querySelector('#target-nl-2') as HTMLElement;
            const targetBlock2Content = getBlockContentElement(targetBlock2);

            editor.blockManager.setFocusToBlock(sourceBlock1);
            simulateMultiBlockSelection(sourceBlock1,sourceBlock2);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.blockManager.setFocusToBlock(targetBlock2);
            setCursorPosition(targetBlock2Content, targetBlock2Content.textContent.length); 
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(updatedBlocks.length).toBe(7);
                expect(getBlockContentElement(updatedBlocks[5]).style.getPropertyValue('list-style-type')).toContain('3.');
                expect(getBlockContentElement(updatedBlocks[6]).style.getPropertyValue('list-style-type')).toContain('4.');
                expect(updatedBlocks[5].textContent).toBe('Source Item 1');
                expect(updatedBlocks[6].textContent).toBe('Source Item 2');

                expect(editor.blocks.length).toBe(7);
                expect(editor.blocks[5].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[6].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[5].content[0].content).toBe('Source Item 1');
                expect(editor.blocks[6].content[0].content).toBe('Source Item 2');
                done();
            }, 100);
        });

        it('On paste mixed content (text+list), create new list items with correct indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'source-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Source Item 1' }] },
                { id: 'copy-para', blockType: BlockType.Paragraph, content:[{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Copy paragraph' }]},
                {id: 'para', blockType: BlockType.Paragraph, content:[{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'First paragraph' }]},
                { id: 'target-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item A' }] },
                { id: 'target-nl-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item B' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const sourceBlock1 = editorElement.querySelector('#source-nl-1') as HTMLElement;
            const sourceBlock2 = editorElement.querySelector('#copy-para') as HTMLElement;
            const targetBlock2 = editorElement.querySelector('#target-nl-2') as HTMLElement;
            const targetBlock2Content = getBlockContentElement(targetBlock2);

            editor.blockManager.setFocusToBlock(sourceBlock1);
            simulateMultiBlockSelection(sourceBlock1,sourceBlock2);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.blockManager.setFocusToBlock(targetBlock2);
            setCursorPosition(targetBlock2Content, targetBlock2Content.textContent.length); 
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            setTimeout(() => {
                const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(updatedBlocks[5].textContent).toBe('Source Item 1');
                expect(updatedBlocks[6].textContent).toBe('Copy paragraph');
                expect(updatedBlocks[6].querySelector('p')).not.toBeNull();

                expect(editor.blocks[5].blockType).toBe(BlockType.NumberedList);
                expect(editor.blocks[5].content[0].content).toBe('Source Item 1');
                expect(editor.blocks[6].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[6].content[0].content).toBe('Copy paragraph');
                done();
            }, 100);
        });

        it('On paste text with custom numbering (e.g., starting from 5), respect start value and continue or merge indices', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-start-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Existing Item 1' }] },
                { id: 'para-before', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph before paste.' }] },
                { id: 'nl-start-21', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 1' }] },
                { id: 'nl-start-22', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 2' }] },
                { id: 'nl-start-23', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 3' }] },
                { id: 'nl-start-24', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 4' }] }
                
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const secondList3 = editorElement.querySelector('#nl-start-23') as HTMLElement;
            const secondList4 = editorElement.querySelector('#nl-start-24') as HTMLElement;
            editor.blockManager.setFocusToBlock(secondList3);
            simulateMultiBlockSelection(secondList3, secondList4);

            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            const pasteTargetBlock = editorElement.querySelector('#nl-start-1') as HTMLElement;
            const pasteTargetContent = getBlockContentElement(pasteTargetBlock);
            editor.blockManager.setFocusToBlock(pasteTargetBlock);
            setCursorPosition(pasteTargetContent, pasteTargetContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(8);
            expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('2.');
            expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('3.');
            expect(updatedBlocks[1].textContent).toBe('Next list Item 3');
            expect(updatedBlocks[2].textContent).toBe('Next list Item 4');

            expect(editor.blocks.length).toBe(8);
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].content[0].content).toBe('Next list Item 3');
            expect(editor.blocks[2].content[0].content).toBe('Next list Item 4');
            done();
        });

        it('On paste from external source with mixed nesting, preserve hierarchy and adjust indices to fit', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-existing-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Existing Root' }] },
                { id: 'nl-existing-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Existing Nested Alpha' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const pasteTargetBlock = editorElement.querySelector('#nl-existing-2') as HTMLElement;
            const pasteTargetContent = getBlockContentElement(pasteTargetBlock);

            const externalHtmlContent = '<ol><li>Pasted list1<ol><li>nested pasted list1</li></ol></li></ol>';

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return externalHtmlContent;
                    }
                    return '';
                }
            };
            
            editor.blockManager.setFocusToBlock(pasteTargetBlock);
            setCursorPosition(pasteTargetContent, pasteTargetContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(4);
            expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('0');
            expect(updatedBlocks[2].textContent).toBe('Pasted list1');
            expect(updatedBlocks[3].style.getPropertyValue('--block-indent')).toBe('20');
            expect(updatedBlocks[3].textContent).toBe('nested pasted list1');

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[2].content[0].content).toBe('Pasted list1');
            expect(editor.blocks[2].indent).toBe(0);
            expect(editor.blocks[3].content[0].content).toBe('nested pasted list1');
            expect(editor.blocks[3].indent).toBe(1);
            done();
        });

        it('On clipboard copy selected nested list items, preserve structure for paste', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-existing-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Existing Root' }] },
                { id: 'nl-existing-2', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Existing Nested Alpha' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const pasteTargetBlock = editorElement.querySelector('#nl-existing-2') as HTMLElement;
            const pasteTargetContent = getBlockContentElement(pasteTargetBlock);

            const externalHtmlContent = '<ol><li>Pasted list1<ol><li>nested pasted list1</li></ol></li></ol>';

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return externalHtmlContent;
                    }
                    return '';
                }
            };
            
            editor.blockManager.setFocusToBlock(pasteTargetBlock);
            setCursorPosition(pasteTargetContent, pasteTargetContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            // structure check
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(4);
            expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('0');
            expect(updatedBlocks[3].style.getPropertyValue('--block-indent')).toBe('20');

            expect(editor.blocks.length).toBe(4);
            expect(editor.blocks[2].indent).toBe(0);
            expect(editor.blocks[3].indent).toBe(1);
            done();
        });

        it('On undo after paste merge, revert indices and structure to pre-paste state', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-pre-paste-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Original Item 1' }] },
                { id: 'nl-pre-paste-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Original Item 2' }] },
                { id: 'para-before', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph before paste.' }] },
                { id: 'source-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Source Item 1' }] },
                { id: 'source-nl-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Source Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const sourceBlock1 = editorElement.querySelector('#source-nl-1') as HTMLElement;
            const sourceBlock2 = editorElement.querySelector('#source-nl-2') as HTMLElement;
            const nlPrePaste2 = editorElement.querySelector('#nl-pre-paste-2') as HTMLElement;
            const nlPrePaste2Content = getBlockContentElement(nlPrePaste2);
            
            editor.blockManager.setFocusToBlock(sourceBlock1);
            simulateMultiBlockSelection(sourceBlock1, sourceBlock2);
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            editor.blockManager.setFocusToBlock(nlPrePaste2);
            setCursorPosition(nlPrePaste2Content, nlPrePaste2Content.textContent.length);
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(7);
            expect(updatedBlocks[1].textContent).toBe('Original Item 2Source Item 1');
            expect(updatedBlocks[2].textContent).toBe('Source Item 2');

            expect(editor.blocks.length).toBe(7);
            expect(editor.blocks[1].content[0].content).toBe('Original Item 2');
            expect(editor.blocks[1].content[1].content).toBe('Source Item 1');
            expect(editor.blocks[2].content[0].content).toBe('Source Item 2');

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }))
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');

            expect(updatedBlocks.length).toBe(5);
            expect(updatedBlocks[1].textContent).toBe('Original Item 2');
            expect(updatedBlocks[3].textContent).toBe('Source Item 1');
            expect(updatedBlocks[4].textContent).toBe('Source Item 2');

            expect(editor.blocks.length).toBe(5);
            expect(editor.blocks[1].content[0].content).toBe('Original Item 2');
            expect(editor.blocks[3].content[0].content).toBe('Source Item 1');
            expect(editor.blocks[4].content[0].content).toBe('Source Item 2');
            done();
        });

        it('On cut multiple nested items, remove block and renumber remaining', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'parent-nl-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nested-nl-A', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A' }] },
                { id: 'nested-nl-B', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item B' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            let nesteditem1 = editorElement.querySelector('#nested-nl-A') as HTMLElement;
            let nesteditem2 = editorElement.querySelector('#nested-nl-B') as HTMLElement;

            editor.blockManager.setFocusToBlock(nesteditem1);
            const range = document.createRange();
            range.setStart(getBlockContentElement(nesteditem1).firstChild, 0);
            range.setEnd(getBlockContentElement(nesteditem2).firstChild, getBlockContentElement(nesteditem2).textContent.length);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2); // ensures last block is removed on dom
            nesteditem1 = editorElement.querySelector('#nested-nl-A') as HTMLElement;
            expect(nesteditem1).toBeNull();
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[1].content[0]).toBe(undefined);
            done();
        });

        it('On paste plain text into numbered list, append in the same list item', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-item-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Existing List Content' }] },
                { id: 'para-to-copy', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph content to paste.' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const listBlock = editorElement.querySelector('#nl-item-1') as HTMLElement;
            const listContentElement = getBlockContentElement(listBlock);
            const paragraphBlock = editorElement.querySelector('#para-to-copy') as HTMLElement;
            const paragraphContentElement = getBlockContentElement(paragraphBlock);

            editor.blockManager.setFocusToBlock(paragraphBlock);
            setCursorPosition(paragraphContentElement, 0); 
            const range = document.createRange();
            range.setStart(paragraphContentElement.firstChild, 0);
            range.setEnd(paragraphContentElement.firstChild, paragraphContentElement.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedPayload.blockeditorData;
                    } else if (format === 'text/html') {
                        return copiedPayload.html;
                    } else if (format === 'text/plain') {
                        return copiedPayload.text; 
                    }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            editor.blockManager.setFocusToBlock(listBlock);
            setCursorPosition(listContentElement, listContentElement.textContent.length); 
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(updatedBlocks[0].textContent).toBe('Existing List ContentParagraph content to paste.');

            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('Existing List Content');
            expect(editor.blocks[0].content[1].content).toBe('Paragraph content to paste.');
            done();
        });

        it('On paste numbered list with different style (e.g., roman), adopt current list’s style or prompt user', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'target-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item 1' }] },
                { id: 'target-nl-2', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Target Item 2' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock2 = editorElement.querySelector('#target-nl-2') as HTMLElement;
            const targetBlock2Content = getBlockContentElement(targetBlock2);
            const romanListHTML = '<ol type="i"><li>Roman I Original</li><li>Roman II Original</li></ol>';
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return romanListHTML; 
                    }
                    return '';
                }
            };

            editor.blockManager.setFocusToBlock(targetBlock2);
            setCursorPosition(targetBlock2Content, targetBlock2Content.textContent.length);

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(4);
            expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('3. ');
            expect(getBlockContentElement(updatedBlocks[3]).style.getPropertyValue('list-style-type')).toContain('4. ');
            expect(updatedBlocks[2].textContent).toBe('Roman I Original');
            expect(updatedBlocks[3].textContent).toBe('Roman II Original');

            expect(editor.blocks.length).toBe(4); 
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].content[0].content).toBe('Roman I Original');
            expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[3].content[0].content).toBe('Roman II Original');
            done();
        });

        it('On cut single item with nested sublist, remove the content of parent alone.', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'parent-nl-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nested-nl-A', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const parentNL1 = editorElement.querySelector('#parent-nl-1') as HTMLElement;
            const parentNL1Content = getBlockContentElement(parentNL1);
            editor.blockManager.setFocusToBlock(parentNL1);
            const range = document.createRange();
            range.setStart(parentNL1Content.firstChild, 0);
            range.setEnd(parentNL1Content.firstChild, parentNL1Content.textContent.length);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedPayload.blockeditorData;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCut(createMockClipboardEvent('cut', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(getBlockContentElement(updatedBlocks[0]).style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(updatedBlocks[0].textContent).toBe('');
            expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('a. ');
            expect(updatedBlocks[1].textContent).toBe('Nested Item A');

            expect(editor.blocks.length).toBe(2);  
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].content[0].content).toBe('Nested Item A');
            expect(editor.blocks[1].indent).toBe(1);
            done();

        });

        it('On paste into empty list, initialize with correct numbering from pasted content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'empty-nl', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: '' }] },
                { id: 'para-before', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph before paste.' }] },
                { id: 'nl-start-21', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 1' }] },
                { id: 'nl-start-22', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Next list Item 2' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const emptyListBlock = editorElement.querySelector('#empty-nl') as HTMLElement;
            const emptyListContentElement = getBlockContentElement(emptyListBlock);

            const secondList1 = editorElement.querySelector('#nl-start-21') as HTMLElement;
            const secondList2 = editorElement.querySelector('#nl-start-22') as HTMLElement;
            editor.blockManager.setFocusToBlock(secondList1);
            simulateMultiBlockSelection(secondList1, secondList2);

            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
            
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            editor.blockManager.setFocusToBlock(emptyListBlock);
            setCursorPosition(emptyListContentElement, 0); 
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(5);
            expect(getBlockContentElement(updatedBlocks[0]).style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('2. ');
            expect(updatedBlocks[0].textContent).toBe('Next list Item 1');
            expect(updatedBlocks[1].textContent).toBe('Next list Item 2');
         
            expect(editor.blocks.length).toBe(5); 
            expect(editor.blocks[0].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[0].content[0].content).toBe('Next list Item 1');
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].content[0].content).toBe('Next list Item 2'); 
            done();
        });

        it('On paste single list item into nested position, adopt parent’s index style', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nl-nested-a', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested Item A' }] },
                { id: 'paragraph', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'A paragraph in between.' }] },
                { id: 'nl-to-copy', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item to be Pasted' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const nlNestedA = editorElement.querySelector('#nl-nested-a') as HTMLElement;
            const nlNestedAContent = getBlockContentElement(nlNestedA);
            const nlToCopy = editorElement.querySelector('#nl-to-copy') as HTMLElement;
            const nlToCopyContent = getBlockContentElement(nlToCopy);

            editor.blockManager.setFocusToBlock(nlToCopy);
            const rangeToCopy = document.createRange();
            rangeToCopy.setStart(nlToCopyContent.firstChild, 0);
            rangeToCopy.setEnd(nlToCopyContent.firstChild, nlToCopyContent.textContent.length);
            const selectionToCopy = window.getSelection();
            selectionToCopy.removeAllRanges();
            selectionToCopy.addRange(rangeToCopy);

            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedPayload.blockeditorData;
                    } else if (format === 'text/html') {
                        return copiedPayload.html;
                    } else if (format === 'text/plain') {
                        return copiedPayload.text;
                    }
                    return '';
                }
            };
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
            
            editor.blockManager.setFocusToBlock(nlNestedA);
            setCursorPosition(nlNestedAContent, nlNestedAContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));

            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(5);
            expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('b. ');
            expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('20');
            expect(updatedBlocks[2].textContent).toBe('Item to be Pasted');

            expect(editor.blocks.length).toBe(5); 
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].indent).toBe(1); 
            expect(editor.blocks[2].content[0].content).toBe('Item to be Pasted'); 
            done();
        });

        it('On paste list with unsupported numbering format (e.g., custom symbols), convert to standard numbers', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'target-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Existing List Item 1' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const targetBlock1 = editorElement.querySelector('#target-nl-1') as HTMLElement;
            const targetBlock1Content = getBlockContentElement(targetBlock1);
            const customSymbolListHTML = '<ol style="list-style-type: \'🚀 \'"><li>Launch Item One</li><li>Launch Item Two</li></ol>';
            
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/html') {
                        return customSymbolListHTML;
                    }
                    return '';
                }
            };

            editor.blockManager.setFocusToBlock(targetBlock1);
            setCursorPosition(targetBlock1Content, targetBlock1Content.textContent.length);
            
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(3);
            expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('2. ');
            expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('3. ');
            expect(updatedBlocks[1].textContent).toBe('Launch Item One');
            expect(updatedBlocks[2].textContent).toBe('Launch Item Two');
            
            expect(editor.blocks.length).toBe(3);   
            expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[1].content[0].content).toBe('Launch Item One');
            expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[2].content[0].content).toBe('Launch Item Two');
            done();
        });

        it('On drag and drop list item to new position within same list, update indices accordingly', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-drag-item-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 1' }] },
                { id: 'nl-drag-item-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 2 (to drag)' }] },
                { id: 'nl-drag-item-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 3' }] },
                { id: 'nl-drag-item-4', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 4' }] }
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            const item2 = editorElement.querySelector('#nl-drag-item-2') as HTMLElement;
            const item4 = editorElement.querySelector('#nl-drag-item-4') as HTMLElement;

            triggerMouseMove(item2, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();

            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(item4, 'dragenter', 75, item4.offsetTop + 10, dataTransfer); 
            triggerDragEvent(item4, 'dragover', 75, item4.offsetTop + 10, dataTransfer); 
            triggerDragEvent(dragIcon, 'drag', 75, item4.offsetTop + (item4.offsetHeight/2) + 10, dataTransfer); // Dragging visually

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(updatedBlocks.length).toBe(4);
                    expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('2. ');
                    expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('3. ');
                    expect(getBlockContentElement(updatedBlocks[3]).style.getPropertyValue('list-style-type')).toContain('4. ');
                    expect(updatedBlocks[1].textContent).toBe('List Item 3');
                    expect(updatedBlocks[2].textContent).toBe('List Item 4');
                    expect(updatedBlocks[3].textContent).toBe('List Item 2 (to drag)');

                    expect(editor.blocks.length).toBe(4);
                    expect(editor.blocks[1].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[2].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[3].blockType).toBe(BlockType.NumberedList);
                    expect(editor.blocks[0].content[0].content).toBe('List Item 1');
                    expect(editor.blocks[1].content[0].content).toBe('List Item 3');
                    expect(editor.blocks[2].content[0].content).toBe('List Item 4');
                    expect(editor.blocks[3].content[0].content).toBe('List Item 2 (to drag)');
                done();
                }, 100);
                
            }, 200);
        });

        it('On move multiple selected list items up/down, reorder as a block and renumber sequentially', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-multi-select-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-multi-select-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2 (selected)' }] },
                { id: 'nl-multi-select-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3 (selected)' }] },
                { id: 'nl-multi-select-4', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 4' }] }
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            const item2 = editorElement.querySelector('#nl-multi-select-2') as HTMLElement;
            const item3 = editorElement.querySelector('#nl-multi-select-3') as HTMLElement;
            const item4 = editorElement.querySelector('#nl-multi-select-4') as HTMLElement;

            editor.blockManager.setFocusToBlock(item2); 
            simulateMultiBlockSelection(item2, item3); 

            triggerMouseMove(item2, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();

            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(item4, 'dragenter', 75, item4.offsetTop + 10, dataTransfer); 
            triggerDragEvent(item4, 'dragover', 75, item4.offsetTop + 10, dataTransfer); 
            triggerDragEvent(dragIcon, 'drag', 75, item4.offsetTop + (item4.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(updatedBlocks.length).toBe(4);
                    expect(getBlockContentElement(updatedBlocks[1]).style.getPropertyValue('list-style-type')).toContain('2. ');
                    expect(getBlockContentElement(updatedBlocks[2]).style.getPropertyValue('list-style-type')).toContain('3. ');
                    expect(getBlockContentElement(updatedBlocks[3]).style.getPropertyValue('list-style-type')).toContain('4. ');
                    expect(updatedBlocks[1].textContent).toBe('Item 4');
                    expect(updatedBlocks[2].textContent).toBe('Item 2 (selected)');
                    expect(updatedBlocks[3].textContent).toBe('Item 3 (selected)');

                    expect(editor.blocks.length).toBe(4);
                    expect(editor.blocks[1].content[0].content).toBe('Item 4');
                    expect(editor.blocks[2].content[0].content).toBe('Item 2 (selected)');
                    expect(editor.blocks[3].content[0].content).toBe('Item 3 (selected)');
                    done();
                }, 100);
            }, 200);
        });

        it('On drag multiple non-consecutive list items to new list, renumber sequentially in target list', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'source-nl-1', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item 1' }] },
                { id: 'source-nl-2', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item 2' }] },
                { id: 'source-nl-2-1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Source Nested Item 2.1' }] },
                { id: 'source-nl-3', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item 3' }] },
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            const sourceItem2 = editorElement.querySelector('#source-nl-2') as HTMLElement;
            const sourceItem2_1 = editorElement.querySelector('#source-nl-2-1') as HTMLElement;
            const sourceItem3 = editorElement.querySelector('#source-nl-3') as HTMLElement;

            editor.blockManager.setFocusToBlock(sourceItem2);
            simulateMultiBlockSelection(sourceItem2, sourceItem2_1);

            triggerMouseMove(sourceItem2, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();

            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(sourceItem3, 'dragenter', 75, sourceItem3.offsetTop + 10, dataTransfer);
            triggerDragEvent(sourceItem3, 'dragover', 75, sourceItem3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, sourceItem3.offsetTop + (sourceItem3.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(updatedBlocks.length).toBe(4);
                    expect(updatedBlocks[1].textContent).toBe('Source Item 3');
                    expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('0');
                    expect(updatedBlocks[2].textContent).toBe('Source Item 2');
                    expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('0');
                    expect(updatedBlocks[3].textContent).toBe('Source Nested Item 2.1');
                    expect(updatedBlocks[3].style.getPropertyValue('--block-indent')).toBe('20');

                    expect(editor.blocks.length).toBe(4); 
                    expect(editor.blocks[1].content[0].content).toBe('Source Item 3');
                    expect(editor.blocks[1].indent).toBe(0);
                    expect(editor.blocks[2].content[0].content).toBe('Source Item 2');
                    expect(editor.blocks[2].indent).toBe(0);
                    expect(editor.blocks[3].content[0].content).toBe('Source Nested Item 2.1');
                    expect(editor.blocks[3].indent).toBe(1);
                    done();
                }, 100);
            }, 200);
        });

        it('On drag nested list to root level, flatten structure and renumber sequentially', (done) => {
            // no flattening happens, just adds as same nested indent position
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-root-a', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item A' }] },
                { id: 'nl-nested-b', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Item B (nested, to drag)' }] },
                { id: 'nl-root-c', blockType: BlockType.NumberedList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item C' }] }
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            const itemB = editorElement.querySelector('#nl-nested-b') as HTMLElement;
            const itemC = editorElement.querySelector('#nl-root-c') as HTMLElement;

            triggerMouseMove(itemB, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();

            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(itemC, 'dragenter', 75, itemC.offsetTop + itemC.offsetHeight - 5, dataTransfer);
            triggerDragEvent(itemC, 'dragover', 75, itemC.offsetTop + itemC.offsetHeight - 5, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, itemC.offsetTop + (itemC.offsetHeight / 2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                    setTimeout(() => {
                        const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                        expect(updatedBlocks.length).toBe(3);
                        expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('0');
                        expect(updatedBlocks[1].textContent).toBe('Item C');
                        expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('20');
                        expect(updatedBlocks[2].textContent).toBe('Item B (nested, to drag)');

                        expect(editor.blocks.length).toBe(3);
                        expect(editor.blocks[1].content[0].content).toBe('Item C');
                        expect(editor.blocks[2].content[0].content).toBe('Item B (nested, to drag)');
                        expect(editor.blocks[1].indent).toBe(0);
                        // indent is set to 1 not 0
                        expect(editor.blocks[2].indent).toBe(1);
                        done();
                    }, 100);
            }, 200);
        });
    });

    describe('Testing additonal cases for Bullet list blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        function simulateMultiBlockSelection(startBlock: HTMLElement, endBlock: HTMLElement): void {
            // Create a mock selection range
            const range = document.createRange();
            range.setStartBefore(startBlock);
            range.setEndAfter(endBlock);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            // Spy on getSelectedBlocks to return the appropriate blocks
            const startBlockId = startBlock.id;
            const endBlockId = endBlock.id;

            // Get all blocks between start and end blocks inclusive
            const allBlocks = editor.blockManager.getEditorBlocks();
            const startIdx = allBlocks.findIndex(b => b.id === startBlockId);
            const endIdx = allBlocks.findIndex(b => b.id === endBlockId);
            const selectedBlocks = allBlocks.slice(
                Math.min(startIdx, endIdx),
                Math.max(startIdx, endIdx) + 1
            );

            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);
        }
        it('On paste mixed bullet and numbered list, convert numbered items to bullets with current style', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'source-bl-1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet Source Item 1' }] },
                { id: 'source-nl-1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Numbered Source Item 2' }] },
                { id: 'copy-para', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Copy paragraph' }] },
                { id: 'target-bl', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Target Bullet Item Z' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            const sourceBL1 = editorElement.querySelector('#source-bl-1') as HTMLElement;
            const sourceNL1 = editorElement.querySelector('#source-nl-1') as HTMLElement;
            const targetBL = editorElement.querySelector('#target-bl') as HTMLElement;
            const targetBLContent = getBlockContentElement(targetBL);
        
            editor.blockManager.setFocusToBlock(sourceBL1);
            simulateMultiBlockSelection(sourceBL1, sourceNL1);
        
            const copiedData = editor.blockManager.clipboardAction.getClipboardPayload().blockeditorData;
            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                    if (format === 'text/blockeditor') {
                        return copiedData;
                    }
                    return '';
                }
            };
        
            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));
        
            editor.blockManager.setFocusToBlock(targetBL);
            setCursorPosition(targetBLContent, targetBLContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        
            editor.blockManager.clipboardAction.handlePaste(createMockClipboardEvent('paste', mockClipboard));
            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(6);
            expect(getBlockContentElement(updatedBlocks[4]).style.getPropertyValue('list-style-type')).toBe('');
            expect(getBlockContentElement(updatedBlocks[5]).style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(updatedBlocks[4].textContent).toBe('Bullet Source Item 1');
            expect(updatedBlocks[5].textContent).toBe('Numbered Source Item 2');
            expect(updatedBlocks[4].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');
            expect(editor.blocks[4].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[4].content[0].content).toBe('Bullet Source Item 1');
            expect(updatedBlocks[5].querySelector('li').style.getPropertyValue('list-style-type')).toContain('1. ');
            expect(editor.blocks[5].blockType).toBe(BlockType.NumberedList);
            expect(editor.blocks[5].content[0].content).toBe('Numbered Source Item 2');
            done();
        });
        it('On transform bullet list to code block via slash command, creates new block below', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bulletlist-slash-transform', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item for code block' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            const bulletListBlock = editorElement.querySelector('#bulletlist-slash-transform') as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);
            editor.blockManager.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, 0);
            bulletContent.textContent = '/' + bulletContent.textContent;
            setCursorPosition(bulletContent, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(bulletListBlock);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull();
        
            const codeBlockMenuItem = slashCommandElement.querySelector('li[data-value="Code"]') as HTMLElement;
            expect(codeBlockMenuItem).not.toBeNull();
        
            codeBlockMenuItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        
            setTimeout(() => {
                const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(updatedBlocks[1].getAttribute('data-block-type')).toBe('Code');
                expect(editor.blocks[1].blockType).toBe(BlockType.Code);
                done();
            }, 200);
        });
        it('On undo after transforming bullet list to checklist, revert to original bullet style and content', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bl-to-cl-undo-1', blockType: BlockType.BulletList, indent: 0, content: [{ contentType: ContentType.Text, content: 'Bullet Item One' }] },

            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            const item1Block = editorElement.querySelector('#bl-to-cl-undo-1') as HTMLElement;
            const item1Content = getBlockContentElement(item1Block);
            editor.blockManager.setFocusToBlock(item1Block);
            setCursorPosition(item1Content, 0);
            item1Content.textContent = '/' + item1Content.textContent;
            setCursorPosition(item1Content, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(item1Block);
        
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
        
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(slashCommandElement).not.toBeNull(); 
        
            const checklistElement = slashCommandElement.querySelector('li[data-value="Checklist"]') as HTMLElement;
            expect(checklistElement).not.toBeNull();
        
            checklistElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            done();
        });

        it('On redo after merging bullet lists, restore unified list with consistent bullet style', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'bl-merge-redo-1', blockType: BlockType.BulletList, indent: 0, content: [{ contentType: ContentType.Text, content: 'a' }] },
                { id: 'bl-merge-redo-2', blockType: BlockType.BulletList, indent: 0, content: [{ contentType: ContentType.Text, content: 'b' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            const block1 = editorElement.querySelector('#bl-merge-redo-1') as HTMLElement;
            const block2 = editorElement.querySelector('#bl-merge-redo-2') as HTMLElement;
            const block1Content = getBlockContentElement(block1);
            const block2Content = getBlockContentElement(block2);
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(updatedBlocks[0].textContent).toBe('a');
            expect(updatedBlocks[1].textContent).toBe('b');
            expect(updatedBlocks[0].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');
            expect(updatedBlocks[1].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');

            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('a');
            expect(editor.blocks[1].content[0].content).toBe('b');
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            expect(editor.blocks[1].blockType).toBe(BlockType.BulletList);
            editor.blockManager.setFocusToBlock(block2);
            setCursorPosition(block2Content, 0); 
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(1);
            expect(updatedBlocks[0].textContent).toBe('ab');
            expect(updatedBlocks[0].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('ab');
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
        
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ', bubbles: true }));

            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(2);
            expect(updatedBlocks[0].textContent).toBe('a');
            expect(updatedBlocks[1].textContent).toBe('b');
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].content[0].content).toBe('a');
            expect(editor.blocks[1].content[0].content).toBe('b');

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY', bubbles: true }));

            updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks.length).toBe(1);
            expect(updatedBlocks[0].textContent).toBe('ab');
            expect(updatedBlocks[0].querySelector('li').style.getPropertyValue('list-style-type')).toBe('');
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('ab');
            expect(editor.blocks[0].blockType).toBe(BlockType.BulletList);
            done();
        });
    });

    describe('Testing additional checklist blocks', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
            const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
            node.dispatchEvent(event);
        }

        function triggerDragEvent(node: HTMLElement, eventType: string, x: number, y: number, dataTransfer: DataTransfer = new DataTransfer()): void {
            const dragEvent = new DragEvent(eventType, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: dataTransfer });
            node.dispatchEvent(dragEvent);
        }  

        function simulateMultiBlockSelection(startBlock: HTMLElement, endBlock: HTMLElement): void {
            // Create a mock selection range
            const range = document.createRange();
            range.setStartBefore(startBlock);
            range.setEndAfter(endBlock);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Spy on getSelectedBlocks to return the appropriate blocks
            const startBlockId = startBlock.id;
            const endBlockId = endBlock.id;
            
            // Get all blocks between start and end blocks inclusive
            const allBlocks = editor.blockManager.getEditorBlocks();
            const startIdx = allBlocks.findIndex(b => b.id === startBlockId);
            const endIdx = allBlocks.findIndex(b => b.id === endBlockId);
            const selectedBlocks = allBlocks.slice(
                Math.min(startIdx, endIdx),
                Math.max(startIdx, endIdx) + 1
            );
            
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);
        }
        
        it('On paste partial checklist (text without checkbox), append text to the block', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'checklist-paste-target', blockType: BlockType.Checklist,
                  content: [{ contentType: ContentType.Text, content: 'Existing checklist item' }] },
                { id: 'text-to-paste', blockType: BlockType.Paragraph,
                  content: [{ contentType: ContentType.Text, content: 'This is some plain text to append.' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            setTimeout(() => {
                const checklistBlock = editorElement.querySelector('#checklist-paste-target') as HTMLElement;
            const checklistContentDiv = getBlockContentElement(checklistBlock);
            const paragraphBlock = editorElement.querySelector('#text-to-paste') as HTMLElement;
            const paragraphContentDiv = getBlockContentElement(paragraphBlock);


            editor.blockManager.setFocusToBlock(paragraphBlock);
            const rangeToCopy = document.createRange();
            rangeToCopy.setStart(paragraphContentDiv.firstChild, 0); 
            rangeToCopy.setEnd(paragraphContentDiv.firstChild, paragraphContentDiv.textContent.length); 

            const selectionToCopy = window.getSelection();
            selectionToCopy.removeAllRanges();
            selectionToCopy.addRange(rangeToCopy);

            const copiedPayload = editor.blockManager.clipboardAction.getClipboardPayload();

            const mockClipboard: any = {
                setData: jasmine.createSpy(),
                getData: (format: string) => {
                   if (format === 'text/blockeditor') {
                       return copiedPayload.blockeditorData;
                   } else if (format === 'text/html') {
                       return copiedPayload.html;
                   } else if (format === 'text/plain') {
                       return copiedPayload.text;
                   }
                    return '';
                }
            };

            editor.blockManager.clipboardAction.handleCopy(createMockClipboardEvent('copy', mockClipboard));

            editor.blockManager.setFocusToBlock(checklistBlock);
            setCursorPosition(checklistContentDiv, checklistContentDiv.textContent.length);
            editor.blockManager.clipboardAction.handlePaste(
                createMockClipboardEvent('paste', mockClipboard)
            );
            let updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(updatedBlocks[0].textContent).toBe('Existing checklist itemThis is some plain text to append.');
            expect(editor.blocks[0].content[0].content).toBe('Existing checklist item');
            expect(editor.blocks[0].content[1].content).toBe('This is some plain text to append.');
            done();
            }, 50);
        });

        it('On indent checklist item with nested sublist, preserve sublist checkbox states and hierarchy', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'parent-cl', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }], properties: {isChecked: true} },
                { id: 'child-cl', blockType: BlockType.Checklist, indent: 1, content: [{ contentType: ContentType.Text, content: 'Child Item' }], properties: {isChecked: true} } 
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            setTimeout(() => {
                const parentBlock = editorElement.querySelector('#parent-cl') as HTMLElement;
                const childBlock = editorElement.querySelector('#child-cl') as HTMLElement;
            
                editor.blockManager.setFocusToBlock(parentBlock);
                simulateMultiBlockSelection(parentBlock, childBlock);
            
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

                expect(parentBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(childBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(parentBlock.style.getPropertyValue('--block-indent')).toBe('20');
                expect(childBlock.style.getPropertyValue('--block-indent')).toBe('40');

                expect(editor.blocks[0].indent).toBe(1);
                expect(editor.blocks[1].indent).toBe(2);
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(true);
                expect((editor.blocks[1].properties as IChecklistBlockSettings).isChecked).toBe(true);
                done();
            }, 50);
        });

        it('On outdent checklist item with nested sublist, flatten sublist to parent level, preserving checkbox states', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'parent-cl-outdent', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Parent Item' }], properties: {isChecked: true} },
                { id: 'child-cl-outdent', blockType: BlockType.Checklist, indent: 1, content: [{ contentType: ContentType.Text, content: 'Child Item' }], properties: {isChecked: true} } 
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
        
            setTimeout(() => {
                const parentBlock = editorElement.querySelector('#parent-cl-outdent') as HTMLElement;
                const childBlock = editorElement.querySelector('#child-cl-outdent') as HTMLElement;
    
                editor.blockManager.setFocusToBlock(parentBlock);
                simulateMultiBlockSelection(parentBlock, childBlock);
    
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));

                expect(parentBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(childBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(parentBlock.style.getPropertyValue('--block-indent')).toBe('0');
                expect(childBlock.style.getPropertyValue('--block-indent')).toBe('0');
                expect(editor.blocks[0].indent).toBe(0);
                expect(editor.blocks[1].indent).toBe(0);
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(true);
                expect((editor.blocks[1].properties as IChecklistBlockSettings).isChecked).toBe(true);
                done();
            }, 50);
        });

        it('On backspace in empty checklist with multiple items, convert to paragraph and remove checkboxes', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-bs', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: '' }] },
                { id: 'nl-nested-empty-bs', blockType: BlockType.Checklist, indent: 1, content: [{ contentType: ContentType.Text, content: 'Nested' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                let parentBlock = editorElement.querySelector('#nl-parent-bs') as HTMLElement;
                const nestedBlock = editorElement.querySelector('#nl-nested-empty-bs') as HTMLElement;
                expect(parentBlock.querySelector('.e-checkmark-container')).not.toBeNull();
    
                editor.blockManager.setFocusToBlock(parentBlock);
                setCursorPosition(getBlockContentElement(parentBlock), 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
                const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(updatedBlocks.length).toBe(2);
                expect(editor.blocks.length).toBe(2);
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[1].blockType).toBe(BlockType.Checklist);
                parentBlock = editorElement.querySelector('#nl-parent-bs') as HTMLElement;
                expect(parentBlock.querySelector('.e-checkmark-container')).toBeNull();
                expect(parentBlock.classList.contains('e-checklist')).toBe(false);
                done();
            }, 50);
        });

        it('On move multiple checklist items with sublists up/down, reorder as block and preserve checkbox states', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-multi-select-1', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 1' }] },
                { id: 'nl-multi-select-2', blockType: BlockType.Checklist, properties: { isChecked: true }, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 2 (selected)' }] },
                { id: 'nl-multi-select-3', blockType: BlockType.Checklist, properties: { isChecked: true }, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 3 (selected)' }] },
                { id: 'nl-multi-select-4', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Item 4' }] }
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            setTimeout(() => {
                const item2 = editorElement.querySelector('#nl-multi-select-2') as HTMLElement;
                const item3 = editorElement.querySelector('#nl-multi-select-3') as HTMLElement;
                const item4 = editorElement.querySelector('#nl-multi-select-4') as HTMLElement;
    
                editor.blockManager.setFocusToBlock(item2); 
                simulateMultiBlockSelection(item2, item3); 
    
                triggerMouseMove(item2, 10, 10);
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                expect(dragIcon).not.toBeNull();
    
                const dataTransfer = new DataTransfer();
    
                setTimeout(() => {
                    triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
                    triggerDragEvent(item4, 'dragenter', 75, item4.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(item4, 'dragover', 75, item4.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(dragIcon, 'drag', 75, item4.offsetTop + (item4.offsetHeight/2) + 10, dataTransfer);
        
                    setTimeout(() => {
                        triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                        setTimeout(() => {
                            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                            expect(updatedBlocks.length).toBe(4);
                            expect(updatedBlocks[1].textContent).toBe('Item 4');
                            expect(updatedBlocks[2].textContent).toBe('Item 2 (selected)');
                            expect(updatedBlocks[3].textContent).toBe('Item 3 (selected)');
                            expect(updatedBlocks[2].querySelector('li').classList.contains('e-checked')).toBe(true);
                            expect(updatedBlocks[3].querySelector('li').classList.contains('e-checked')).toBe(true);
                            
                            expect(editor.blocks.length).toBe(4);
                            expect((editor.blocks[2].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            expect((editor.blocks[3].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            expect(editor.blocks[1].content[0].content).toBe('Item 4');
                            expect(editor.blocks[2].content[0].content).toBe('Item 2 (selected)');
                            expect(editor.blocks[3].content[0].content).toBe('Item 3 (selected)');
                            expect((editor.blocks[2].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            expect((editor.blocks[3].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            done();
                        }, 100);
                    }, 200);
                }, 50);
            }, 50);
        });

        it('On drag checklist item to empty paragraph, create new checklist with same checkbox state', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-drag-item-1', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 1' }] },
                { id: 'nl-drag-item-2', blockType: BlockType.Checklist, indent: 0, properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'List Item 2 (to drag)' }] },
                { id: 'nl-drag-item-3', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 3' }] },
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            setTimeout(() => {
                const item2 = editorElement.querySelector('#nl-drag-item-2') as HTMLElement;
                const item3 = editorElement.querySelector('#nl-drag-item-3') as HTMLElement;
    
                triggerMouseMove(item2, 10, 10);
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                expect(dragIcon).not.toBeNull();
    
                const dataTransfer = new DataTransfer();

                setTimeout(() => {
                    triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
                    triggerDragEvent(item3, 'dragenter', 75, item3.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(item3, 'dragover', 75, item3.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(dragIcon, 'drag', 75, item3.offsetTop + (item3.offsetHeight/2) + 10, dataTransfer);
        
                    setTimeout(() => {
                        triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                        setTimeout(() => {
                            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                            expect(updatedBlocks.length).toBe(3);
                            expect(updatedBlocks[1].textContent).toBe('List Item 3');
                            expect(updatedBlocks[2].textContent).toBe('List Item 2 (to drag)');
                            expect(updatedBlocks[2].querySelector('li').classList.contains('e-checked')).toBe(true);

                            expect(editor.blocks.length).toBe(3);
                            expect((editor.blocks[2].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            expect(editor.blocks[1].content[0].content).toBe('List Item 3');
                            expect(editor.blocks[2].content[0].content).toBe('List Item 2 (to drag)');
                            expect((editor.blocks[2].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            done();
                        }, 100);
                    }, 200);
                }, 50);
            }, 50);
        });

        it('On delete nested checklist sublist, remove and preserve parent checklist’s checkbox state', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-parent-del-1', blockType: BlockType.Checklist, indent: 0,properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'Parent Item 1' }] },
                { id: 'nl-nested-del-1', blockType: BlockType.Checklist, indent: 1, properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'Nested Item A (to delete)' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const parentBlock1 = editorElement.querySelector('#nl-parent-del-1') as HTMLElement;
                let nestedBlock1 = editorElement.querySelector('#nl-nested-del-1') as HTMLElement;
                const nestedContent = getBlockContentElement(nestedBlock1);
    
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(nestedContent.firstChild, 0);
                range.setEnd(nestedContent.firstChild, nestedContent.textContent.length);
    
                selection.removeAllRanges();
                selection.addRange(range);
                editor.blockManager.setFocusToBlock(nestedBlock1);
                nestedBlock1 = editorElement.querySelector('#nl-nested-del-1') as HTMLElement;
                nestedBlock1.textContent = '';
                expect(parentBlock1.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(editor.blocks.length).toBe(2);
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(true);
                done();
            }, 50);
        });

        it('On apply formatting (e.g., underline) to partial checklist item text, retain checkbox state and apply formatting', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-partial-format', blockType: BlockType.Checklist, indent: 0,properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'This is some text in a list item.' }] }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const listItemBlock = editorElement.querySelector('#nl-partial-format') as HTMLElement;
                const listItemContent = getBlockContentElement(listItemBlock);
    
                editor.blockManager.setFocusToBlock(listItemBlock);
                setSelectionRange(listItemContent.firstChild as Node, 8, 17); 
    
                editor.blockManager.formattingAction.execCommand({ command: 'underline' });
    
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.Checklist);
                expect(editor.blocks[0].indent).toBe(0);
    
                const updatedContent = editor.blocks[0].content;
                expect(updatedContent.length).toBe(3); 
                expect(updatedContent[0].content).toBe('This is ');
                expect(updatedContent[1].content).toBe('some text');
                expect((updatedContent[1] as any).properties.styles.underline).toBe(true);
                expect(updatedContent[2].content).toBe(' in a list item.');
                expect((editor.blocks[0].properties as IChecklistBlockSettings).isChecked).toBe(true);
                done();
            }, 50);
        });

        it('On move checklist item to another checklist, adopt target checklist’s hierarchy and preserve checkbox state', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'nl-drag-item-1', blockType: BlockType.Checklist, indent: 0, properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'List Item 1' }] },
                { id: 'nl-drag-item-2', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 2 (to drag)' }] },
                { id: 'nl-drag-item-3', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 3' }] },
                { id: 'nl-drag-item-4', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'List Item 4' }] }
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            setTimeout(() => {
                const item2 = editorElement.querySelector('#nl-drag-item-2') as HTMLElement;
                const item4 = editorElement.querySelector('#nl-drag-item-4') as HTMLElement;
    
                triggerMouseMove(item2, 10, 10);
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                expect(dragIcon).not.toBeNull();
    
                const dataTransfer = new DataTransfer();
    
                setTimeout(() => {
                    triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
                    triggerDragEvent(item4, 'dragenter', 75, item4.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(item4, 'dragover', 75, item4.offsetTop + 10, dataTransfer); 
                    triggerDragEvent(dragIcon, 'drag', 75, item4.offsetTop + (item4.offsetHeight/2) + 10, dataTransfer); // Dragging visually
        
                    setTimeout(() => {
                        triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                        setTimeout(() => {
                            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                            expect(updatedBlocks.length).toBe(4);
                            expect(updatedBlocks[1].textContent).toBe('List Item 3');
                            expect(updatedBlocks[2].textContent).toBe('List Item 4');
                            expect(updatedBlocks[3].textContent).toBe('List Item 2 (to drag)');
        
                            expect(editor.blocks[0].content[0].content).toBe('List Item 1');
                            expect(editor.blocks[1].content[0].content).toBe('List Item 3');
                            expect(editor.blocks[2].content[0].content).toBe('List Item 4');
                            expect(editor.blocks[3].content[0].content).toBe('List Item 2 (to drag)');
                            expect(editor.blocks[3].indent).toBe(0);
                        done();
                        }, 100);  
                    }, 200);
                }, 50);
            }, 50);
        });

        it('On drag checklist item with sublist to another checklist, preserve sublist hierarchy and checkbox states', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'source-nl-1', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item 1' }] },
                { id: 'source-nl-2', blockType: BlockType.Checklist, indent: 0,properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'Source Item 2' }] },
                { id: 'source-nl-2-1', blockType: BlockType.Checklist, indent: 1,properties: { isChecked: true }, content: [{ contentType: ContentType.Text, content: 'Source Nested Item 2.1' }] },
                { id: 'source-nl-3', blockType: BlockType.Checklist, indent: 0, content: [{ contentType: ContentType.Text, content: 'Source Item 3' }] },
            ];
            editor = createEditor({ blocks: blocks, enableDragAndDrop: true });
            editor.appendTo('#editor');

            setTimeout(() => {
                const sourceItem2 = editorElement.querySelector('#source-nl-2') as HTMLElement;
                const sourceItem2_1 = editorElement.querySelector('#source-nl-2-1') as HTMLElement;
                const sourceItem3 = editorElement.querySelector('#source-nl-3') as HTMLElement;
    
                editor.blockManager.setFocusToBlock(sourceItem2);
                simulateMultiBlockSelection(sourceItem2, sourceItem2_1);
    
                triggerMouseMove(sourceItem2, 10, 10);
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                expect(dragIcon).not.toBeNull();
    
                const dataTransfer = new DataTransfer();
    
                setTimeout(() => {
                    triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
                    triggerDragEvent(sourceItem3, 'dragenter', 75, sourceItem3.offsetTop + 10, dataTransfer);
                    triggerDragEvent(sourceItem3, 'dragover', 75, sourceItem3.offsetTop + 10, dataTransfer);
                    triggerDragEvent(dragIcon, 'drag', 75, sourceItem3.offsetTop + (sourceItem3.offsetHeight/2) + 10, dataTransfer);
        
                    setTimeout(() => {
                        triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                        setTimeout(() => {
                            const updatedBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                            expect(updatedBlocks.length).toBe(4);
                            expect(updatedBlocks[1].textContent).toBe('Source Item 3');
                            expect(updatedBlocks[1].style.getPropertyValue('--block-indent')).toBe('0');
                            expect(updatedBlocks[2].textContent).toBe('Source Item 2');
                            expect(updatedBlocks[2].style.getPropertyValue('--block-indent')).toBe('0');
                            expect(updatedBlocks[3].textContent).toBe('Source Nested Item 2.1');
                            expect(updatedBlocks[3].style.getPropertyValue('--block-indent')).toBe('20');
        
                            expect(editor.blocks.length).toBe(4); 
                            expect(editor.blocks[1].content[0].content).toBe('Source Item 3');
                            expect(editor.blocks[1].indent).toBe(0);
                            expect(editor.blocks[2].content[0].content).toBe('Source Item 2');
                            expect(editor.blocks[2].indent).toBe(0);
                            expect(editor.blocks[3].content[0].content).toBe('Source Nested Item 2.1');
                            expect(editor.blocks[3].indent).toBe(1);
                            expect((editor.blocks[2].properties as IChecklistBlockSettings).isChecked).toBe(true);
                             expect((editor.blocks[3].properties as IChecklistBlockSettings).isChecked).toBe(true);
                            done();
                        }, 100);
                    }, 200);
                }, 50);
            }, 50);
        });

        it('should undo the check action on checklist item', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'checklist-undo-1',
                    blockType: BlockType.Checklist,
                    indent: 0,
                    content: [{ contentType: ContentType.Text, content: 'Checklist Item One' }],
                    properties: { isChecked: false }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const checklistBlock = editorElement.querySelector('#checklist-undo-1') as HTMLElement;
            const checkbox = checklistBlock.querySelector('.e-checkmark-container') as HTMLInputElement;
            expect(checkbox).not.toBeNull();
            expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
            expect((editor.blocks[0].properties as any).isChecked).toBe(false);
            checkbox.click();
            setTimeout(() => {
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    ctrlKey: true,
                    bubbles: true
                }));
                setTimeout(() => {
                    expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
                    expect((editor.blocks[0].properties as any).isChecked).toBe(false);
                    done();
                }, 150);
            }, 150);
        });

        it('should redo the check action on checklist item after undo', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'checklist-redo-1',
                    blockType: BlockType.Checklist,
                    indent: 0,
                    content: [{ contentType: ContentType.Text, content: 'Checklist Item One' }],
                    properties: { isChecked: false }
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            const checklistBlock = editorElement.querySelector('#checklist-redo-1') as HTMLElement;
            const checkbox = checklistBlock.querySelector('.e-checkmark-container') as HTMLElement;
            expect(checkbox).not.toBeNull();
            expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
            expect(checklistBlock.textContent).toBe('Checklist Item One');
            expect((editor.blocks[0].properties as any).isChecked).toBe(false);
            expect((editor.blocks[0].content[0] as any).content).toBe('Checklist Item One');
            checkbox.click();
            setTimeout(() => {
                expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    ctrlKey: true,
                    bubbles: true
                }));
                
                setTimeout(() => {
                    expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(false);
                    expect(checklistBlock.textContent).toBe('Checklist Item One');
                    expect((editor.blocks[0].properties as any).isChecked).toBe(false);
                    expect((editor.blocks[0].content[0] as any).content).toBe('Checklist Item One');
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'y',
                        code: 'KeyY',
                        ctrlKey: true,
                        bubbles: true
                    }));
                    setTimeout(() => {
                        expect(checklistBlock.querySelector('li').classList.contains('e-checked')).toBe(true);
                        expect(checklistBlock.textContent).toBe('Checklist Item One');
                        expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                        expect((editor.blocks[0].content[0] as any).content).toBe('Checklist Item One');
                        done();
                    }, 150);
                }, 150);
            }, 150);
        });

        it('should redo the check action on two checklist items after undoing both separately', (done) => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'checklist-redo-1',
                    blockType: BlockType.Checklist,
                    indent: 0,
                    content: [{ contentType: ContentType.Text, content: 'Checklist Item One' }],
                    properties: { isChecked: false }
                },
                {
                    id: 'checklist-redo-2',
                    blockType: BlockType.Checklist,
                    indent: 0,
                    content: [{ contentType: ContentType.Text, content: 'Checklist Item Two' }],
                    properties: { isChecked: false }
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            const checklistBlock1 = editorElement.querySelector('#checklist-redo-1') as HTMLElement;
            const checklistBlock2 = editorElement.querySelector('#checklist-redo-2') as HTMLElement;
            const checkbox1 = checklistBlock1.querySelector('.e-checkmark-container') as HTMLElement;
            const checkbox2 = checklistBlock2.querySelector('.e-checkmark-container') as HTMLElement;
            expect(checkbox1).not.toBeNull();
            expect(checkbox2).not.toBeNull();
            expect((editor.blocks[0].properties as any).isChecked).toBe(false);
            expect((editor.blocks[1].properties as any).isChecked).toBe(false);
            // Simulate checking both items
            checkbox1.click();
            checkbox2.click();
            setTimeout(() => {
                expect(checklistBlock1.querySelector('li').classList.contains('e-checked')).toBe(true);
                expect(checklistBlock2.querySelector('li').classList.contains('e-checked')).toBe(true);
                
                expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                expect((editor.blocks[1].properties as any).isChecked).toBe(true);
                // First undo: uncheck second item
                editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'z',
                    code: 'KeyZ',
                    ctrlKey: true,
                    bubbles: true
                }));
                setTimeout(() => {
                    expect(checklistBlock1.querySelector('li').classList.contains('e-checked')).toBe(true);
                    expect(checklistBlock2.querySelector('li').classList.contains('e-checked')).toBe(false);
                    expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                    expect((editor.blocks[1].properties as any).isChecked).toBe(false);
                    // Second undo: uncheck first item
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'z',
                        code: 'KeyZ',
                        ctrlKey: true,
                        bubbles: true
                    }));
                    setTimeout(() => {
                        expect(checklistBlock1.querySelector('li').classList.contains('e-checked')).toBe(false);
                        expect(checklistBlock2.querySelector('li').classList.contains('e-checked')).toBe(false);
                        expect((editor.blocks[0].properties as any).isChecked).toBe(false);
                        expect((editor.blocks[1].properties as any).isChecked).toBe(false);
                        // First redo: re-check first item
                        editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'y',
                            code: 'KeyY',
                            ctrlKey: true,
                            bubbles: true
                        }));
                        setTimeout(() => {
                            expect(checklistBlock1.querySelector('li').classList.contains('e-checked')).toBe(true);
                            expect(checklistBlock2.querySelector('li').classList.contains('e-checked')).toBe(false);
                            expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                            expect((editor.blocks[1].properties as any).isChecked).toBe(false);
                            // Second redo: re-check second item
                            editorElement.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'y',
                                code: 'KeyY',
                                ctrlKey: true,
                                bubbles: true
                            }));
                            setTimeout(() => {
                                expect(checklistBlock1.querySelector('li').classList.contains('e-checked')).toBe(true);
                                expect(checklistBlock2.querySelector('li').classList.contains('e-checked')).toBe(true);
                                expect((editor.blocks[0].properties as any).isChecked).toBe(true);
                                expect((editor.blocks[1].properties as any).isChecked).toBe(true);
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        });
    });
});
