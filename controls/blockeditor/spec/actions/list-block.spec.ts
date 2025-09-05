import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('List Block Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
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
                    type: BlockType.Paragraph
                },
                {
                    id: 'block2',
                    type: BlockType.Paragraph
                },
                {
                    id: 'block3',
                    type: BlockType.Paragraph
                },
                {
                    id: 'block4',
                    type: BlockType.Paragraph
                },
                {
                    id: 'block4',
                    type: BlockType.Paragraph
                },
                {
                    id: 'block5',
                    type: BlockType.Paragraph
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
            const paragraph = editorElement.querySelector('#block1 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '* ';
            editor.stateManager.updateContentOnUserTyping(paragraph.closest('.e-block') as HTMLElement);
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            //trigger space key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            setTimeout(() => {
                const newContentElement = editorElement.querySelector('#block1 li') as HTMLElement;
                expect(editor.blocks[0].type).toBe(BlockType.BulletList);
                expect(newContentElement.style.getPropertyValue('list-style-type')).toContain('• ');
                done();
            }, 800);
        });

        it('should render bullet list on (-) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block2 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '- ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            setTimeout(() => {
                const newContentElement = editorElement.querySelector('#block1 li') as HTMLElement;
                expect(editor.blocks[1].type).toBe(BlockType.BulletList);
                expect(newContentElement.style.getPropertyValue('list-style-type')).toContain('• ');
                done();
            }, 800);
        });

        it('should render numbered list on (1.) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block3 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '1. ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            setTimeout(() => {
                const newContentElement = editorElement.querySelector('#block3 li') as HTMLElement;
                expect(editor.blocks[2].type).toBe(BlockType.NumberedList);
                expect(newContentElement.style.getPropertyValue('list-style-type')).toContain('1. ');
                done();
            }, 800);
        });

        it('should render checklist on ([]) trigger', (done) => {
            const paragraph = editorElement.querySelector('#block4 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '[] ';
            editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#block4') as HTMLElement;
                expect(editor.blocks[3].type).toBe(BlockType.Checklist);
                expect(blockElement.querySelector('.e-checkmark-container')).not.toBeNull();
                done();
            }, 800);
        });

        it('should return when block content is empty', (done) => {
            const paragraph = editorElement.querySelector('#block4 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            paragraph.textContent = '';
            expect(editor.listBlockAction.handleListTriggerKey(null, paragraph, null)).toBeUndefined();
            done();
        });

        it('should return def index when block is not found', function (done) {
            var paragraph = editorElement.querySelector('#block5 p') as HTMLElement;
            editor.setFocusToBlock(paragraph.closest('.e-block') as HTMLElement);
            setCursorPosition(paragraph, 0);
            (editor.listBlockAction as any).getNumberedListItemIndex(null);
            expect((editor.listBlockAction as any).getNumberedListItemIndex(null)).toBe(1);
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
                { id: 'bulletlist', type: BlockType.BulletList, content: [{ id: 'bulletlist-content', type: ContentType.Text, content: 'Bullet item' }] },
                { id: 'numberedlist', type: BlockType.NumberedList, content: [{ id: 'numberedlist-content', type: ContentType.Text, content: 'Numbered item' }] },
                { id: 'checklist', type: BlockType.Checklist, content: [{ id: 'checklist-content', type: ContentType.Text, content: 'Checklist item' }] }
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
            editor.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, bulletContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = bulletListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(bulletListBlock.style.getPropertyValue('--block-indent'));

            //Numbered list test
            editor.setFocusToBlock(numberedListBlock);
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

            //Checklist test
            editor.setFocusToBlock(checkListBlock);
            setCursorPosition(checkContent, checkContent.textContent.length);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            newListBlock = checkListBlock.nextElementSibling as HTMLElement;
            expect(newListBlock).toBeDefined();
            expect(newListBlock.textContent).toBe('');
            expect(newListBlock.style.getPropertyValue('--block-indent')).toBe(checkListBlock.style.getPropertyValue('--block-indent'));
        });

        it('should reduce indent level on Enter key in empty block', (done) => {
            setTimeout(() => {
                editor.blocks[0].indent = 1;
                editor.dataBind();
                const bulletBlock = editorElement.querySelector('#bulletlist') as HTMLElement;
                const numberedContent = getBlockContentElement(bulletBlock);
                expect(bulletBlock.style.getPropertyValue('--block-indent')).toBe('20');

                editor.setFocusToBlock(bulletBlock);
                numberedContent.textContent = '';
                editor.blocks[0].content[0].content = '';
                setCursorPosition(numberedContent, 0);

                //Enter once to reduce indent
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                
                expect(editor.blocks[0].indent).toBe(0)
                expect(bulletBlock.style.getPropertyValue('--block-indent')).toBe('0');

                //Enter again should transform list into paragraph
                setCursorPosition(numberedContent, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                expect(editor.blocks[0].type).toBe(BlockType.Paragraph);
                expect(getBlockContentElement(editorElement.querySelector('#bulletlist')).tagName).toBe('P');
                done();
            }, 200);
        });

        it('should not prevent default when backspace at middle of text', () => {
            const numberedListBlock = editorElement.querySelector('#numberedlist') as HTMLElement;
            const numberedContent = getBlockContentElement(numberedListBlock);

            editor.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 3);

            spyOn(editor.blockRendererManager, 'transformBlockToParagraph').and.callThrough();

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            
            expect(editor.blockRendererManager.transformBlockToParagraph).not.toHaveBeenCalled();
        });

        it('should update indent level on Tab/Shift+Tab key press', () => {
            const bulletListBlock = editorElement.querySelector('#bulletlist').nextElementSibling as HTMLElement;
            const numberedListBlock = editorElement.querySelector('#numberedlist').nextElementSibling as HTMLElement;
            const checkListBlock = editorElement.querySelector('#checklist').nextElementSibling as HTMLElement;
            const bulletContent = getBlockContentElement(bulletListBlock);
            const numberedContent = getBlockContentElement(numberedListBlock);
            const checkContent = getBlockContentElement(checkListBlock);

            //Bullet list test
            editor.setFocusToBlock(bulletListBlock);
            setCursorPosition(bulletContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(bulletListBlock.style.getPropertyValue('--block-indent')).toBe('0');

            //Numbered list test
            editor.setFocusToBlock(numberedListBlock);
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
            editor.setFocusToBlock(checkListBlock);
            setCursorPosition(checkContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
            expect(checkListBlock.style.getPropertyValue('--block-indent')).toBe('20');
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
            expect(checkListBlock.style.getPropertyValue('--block-indent')).toBe('0');
        });

        it('should toggle list to paragraph when backspace is pressed at the start of a list item', () => {
            const numberedListBlock = editorElement.querySelector('#numberedlist') as HTMLElement;
            const numberedContent = numberedListBlock.querySelector('#numberedlist-content') as HTMLElement;

            editor.setFocusToBlock(numberedListBlock);
            setCursorPosition(numberedContent, 0);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            expect(editor.blocks[2].type).toBe(BlockType.Paragraph);
            expect(editor.blocks[2].content[0].content).toBe('Numbered item');
            expect(editorElement.querySelector('#numberedlist p')).not.toBeNull();
            expect(editorElement.querySelector('#numberedlist p').textContent).toBe('Numbered item');
        });

        it('should split list content when enter is pressed at middle of text', () => {
            const checkListBlock = editorElement.querySelector('#checklist') as HTMLElement;
            const checkContent = checkListBlock.querySelector('#checklist-content') as HTMLElement;

            editor.setFocusToBlock(checkListBlock);
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

    describe('Other actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    type: BlockType.NumberedList,
                    content: [{
                        type: ContentType.Text, content: 'Block 1'
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
            expect((editor.listBlockAction as any).getListMarker(2, 2)).toBe('ii.');
        });

        it('getListMarker should use fallback algorith for large numbers', () => {
            expect((editor.listBlockAction as any).getListMarker(25, 2)).toBe('xxv.');
        });

    });
});
