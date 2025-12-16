import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BaseStylesProp, BlockChange, BlockChangedEventArgs, BlockModel, ICollapsibleBlockSettings } from '../../src/models/index';
import { createEditor } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement, getSelectedRange } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Event Manager - keyboard, mouse, selection, and block change behaviors:', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
        const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        node.dispatchEvent(event);
    }

    describe('Keyboard and mouse interactions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: 'Hello world 2' }] },
                {
                    id: 'calloutblock',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                        {
                            id: 'calloutchild1',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'callout-child1-content', contentType: ContentType.Text, content: 'Callout child 1' }]
                        },
                        {
                            id: 'calloutchild2',
                            blockType: BlockType.Paragraph,
                            content: [{ id: 'callout-child2-content', contentType: ContentType.Text, content: 'Callout child 2' }]
                        }
                    ]
                    }
                },
                {
                    id: 'toggleblock',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', contentType: ContentType.Text, content: 'Click here to expand' }],
                    properties: {
                        children: [
                        {
                            id: 'togglechild1',
                            blockType: BlockType.Checklist,
                            content: [{ contentType: ContentType.Text, content: 'Todo' }]
                        },
                        {
                            id: 'togglechild2',
                            blockType: BlockType.Paragraph,
                            content: [{ contentType: ContentType.Text, content: 'Toggle child 2' }]
                        }
                    ]
                    }
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

        it('should update focused blocks on mousemove', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);

            triggerMouseMove(blockElement2, 10, 10);
            expect(editor.blockManager.currentHoveredBlock.id).toBe(blockElement2.id);
            // Neighbor DOM/model unchanged
            expect((blockElement2.previousElementSibling as HTMLElement).id).toBe('paragraph1');
            expect((blockElement2.nextElementSibling as HTMLElement).id).toBe('calloutblock');
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[1].id).toBe('paragraph2');

            triggerMouseMove(editorElement, 0, 0);
            expect(editor.blockManager.currentHoveredBlock).toBeNull();
        });

        it('should update focused blocks on mouseup', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);

            blockElement2.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement2.id);
            // DOM neighbors around focused block
            expect((blockElement2.previousElementSibling as HTMLElement).id).toBe('paragraph1');
            expect((blockElement2.nextElementSibling as HTMLElement).id).toBe('calloutblock');
        });

        it('should update focused blocks on arrow keys', (done) => {
            setTimeout(() => {
                const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement1);
                setCursorPosition(contentElement2, 3);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp' }));
                setTimeout(() => {
                    expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement1.id);
                    editor.blockManager.setFocusToBlock(blockElement1);
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown' }));
                    setTimeout(() => {
                        expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement2.id);
                        done();
                    }, 300);
                }, 300);
            }, 200);
        });

        it('should handle home and end key actions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, 5);

            //Trigger home key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', code: 'Home' }));
            expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement1.id);
            expect(editor.blockManager.nodeSelection.getRange().startOffset).toBe(0);
            // Neighbors unchanged
            expect((blockElement1.nextElementSibling as HTMLElement).id).toBe('paragraph2');

            //Trigger end key
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', code: 'End' }));
            expect(editor.blockManager.currentFocusedBlock.id).toBe(blockElement1.id);
            expect(editor.blockManager.nodeSelection.getRange().startOffset).toBe(contentElement1.textContent.length)
            expect((blockElement1.nextElementSibling as HTMLElement).id).toBe('paragraph2');
        });

        it('should exit callout on enter press in empty block', () => {
            const blockElement1 = editorElement.querySelector('#calloutchild2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            // check childlength before enter action
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(2);
            // On first enter, a new child block should be created
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(3);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe("calloutchild1");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe("calloutchild2");
            // DOM: new child exists as last child under callout
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            const childEls = calloutEl.querySelectorAll('.e-block');
            expect(childEls.length).toBe(3);
            expect(childEls[0].id).toBe("calloutchild1");
            expect(childEls[1].id).toBe("calloutchild2");

            // On second enter, the callout should be exited since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[2].properties as BaseChildrenProp).children[0].id).toBe("calloutchild1");
            expect((editor.blocks[2].properties as BaseChildrenProp).children[1].id).toBe("calloutchild2");
            expect(editor.blockManager.currentFocusedBlock.id).toBe(editor.blocks[3].id);
            // DOM neighbors after exit: callout next is toggleblock
            // expect((calloutEl.nextElementSibling as HTMLElement).id).toBe('toggleblock');
        });

        it('should expand the collapsible block on enter press when content is empty', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, contentElement1.textContent.length);

            editor.addBlock({
                id: 'newtoggle',
                blockType: BlockType.CollapsibleParagraph
            }, 'paragraph1');

            const newBlockElement = editorElement.querySelector('#newtoggle') as HTMLElement;
            const newBlockContent = newBlockElement.querySelector('.e-block-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(newBlockElement);
            setCursorPosition(newBlockContent, 0);

            // On enter, the collapsible block should be expanded and focus should be moved to children block
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[1].properties as BaseChildrenProp).children[0].blockType).toBe(BlockType.Paragraph);
            // expect((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe("");
            expect(editor.blockManager.currentFocusedBlock.id).toBe((editor.blocks[1].properties as BaseChildrenProp).children[0].id);
            // DOM: one child element exists
            const toggleDom = editorElement.querySelector('#newtoggle') as HTMLElement;
            expect(toggleDom.querySelectorAll('.e-block').length).toBe(1);
            expect(toggleDom.querySelectorAll('.e-block')[0].textContent).toBe("");
            
            // On second enter, new block is created
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[1].properties as BaseChildrenProp).children[1].blockType).toBe(BlockType.Paragraph);
            // expect((editor.blocks[1].properties as BaseChildrenProp).children[1].content[0].content).toBe("");
            expect(toggleDom.querySelectorAll('.e-block').length).toBe(2);
            expect(toggleDom.querySelectorAll('.e-block')[1].textContent).toBe("");

            // On third enter, the collapsible should be exited since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(1);
            expect((editor.blocks[1].properties as BaseChildrenProp).children[0].blockType).toBe(BlockType.Paragraph);
            // expect((editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe("");
            // expect(editor.blockManager.currentFocusedBlock.id).toBe(editor.blocks[2].id);
            // DOM neighbor: next after newtoggle is original paragraph2
            // expect((toggleDom.nextElementSibling as HTMLElement).id).toBe('paragraph2');
        });

        it('should reduce indent on empty block while enter press', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            setCursorPosition(contentElement1, 5);

            editor.blockManager.blockCommand.handleBlockIndentation({
                blockIDs: ['paragraph1'],
                shouldDecrease: false,
            });
            // Assert Model
            expect(editor.blocks[0].indent).toBe(1);
            // Assert Dom
            expect((editorElement.querySelector('#paragraph1') as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
            contentElement1.textContent = '';
            setCursorPosition(contentElement1, 0);

            // On enter, the indent should be reduced since the block is empty
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            expect(editor.blocks[0].indent).toBe(0);
            expect((editorElement.querySelector('#paragraph1') as HTMLElement).style.getPropertyValue('--block-indent')).toBe('0');
            // Model neighbors unaffected
            expect(editor.blocks[1].id).toBe("newtoggle");
            // DOM neighbors unaffected
            const next = (blockElement1.nextElementSibling as HTMLElement);
            expect(next && next.id).toBe('newtoggle');
        });
        
    });

    describe('Block change event emission and side effects', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let blockChanges: BlockChange[];

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world 1' }] },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: 'Hello world 2' }] },
                { id: 'paragraph3', blockType: BlockType.Paragraph, content: [{ id: 'paragraph3-content', contentType: ContentType.Text, content: 'Hello world 3' }] },
                { id: 'paragraph4', blockType: BlockType.Paragraph, content: [{ id: 'paragraph4-content', contentType: ContentType.Text, content: 'Hello world 4' }] },
                { id: 'paragraph5', blockType: BlockType.Paragraph, content: [{ id: 'paragraph5-content', contentType: ContentType.Text, content: 'Hello world 5' }] },
            ];
            editor = createEditor({
                blocks: blocks,
                blockChanged: (args: BlockChangedEventArgs) => {
                    blockChanges = args.changes;
                }
            });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
                blockChanges = null;
            }
            remove(editorElement);
        });

        it('Should trigger Update action for content change', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = getBlockContentElement(blockElement1) as HTMLElement;

            contentElement1.textContent = 'Updated';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement1);

            expect(blockChanges.length).toBe(1);
            expect(blockChanges[0].action).toBe('Update');

            expect(blockChanges[0].data.prevBlock.content[0].content).toBe('Hello world 1');
            expect(blockChanges[0].data.block.content[0].content).toBe('Updated');
            // Model neighbors
            expect(editor.blocks[1].id).toBe('paragraph2');
            // DOM reflects change and neighbors intact
            expect((editorElement.querySelector('#paragraph1') as HTMLElement).textContent).toContain('Updated');
            expect(((editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement).id).toBe('paragraph2');
        });

        it('Should trigger Update action for formatting', () => {
            editor.setSelection('paragraph1-content', 2, 3);
            editor.executeToolbarAction(CommandName.Bold);

            expect(blockChanges.length).toBe(1);
            expect(blockChanges[0].action).toBe('Update');

            expect(blockChanges[0].data.prevBlock.content.length).toBe(1);
            expect(blockChanges[0].data.block.content.length).toBe(3);
            expect((blockChanges[0].data.block.content[1].properties as BaseStylesProp).styles.bold).toBe(true);
            // DOM contains strong
            const strong = (editorElement.querySelector('#paragraph1') as HTMLElement).querySelector('strong');
            expect(strong).not.toBeNull();
            const spanEles = (editorElement.querySelector('#paragraph1') as HTMLElement).querySelectorAll('span');
            expect(spanEles.length).toBe(2);
            expect(spanEles[0].textContent).toBe("He");
            expect(strong.textContent).toBe("l");
            expect(spanEles[1].textContent).toBe("lo world 1");
        });

        it('Should trigger Update action when indent single block', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);

                editor.blockManager.blockCommand.handleBlockIndentation({
                    blockIDs: [blockElement.id],
                    shouldDecrease: false
                });
                // Assert Model
                expect(blockChanges.length).toBe(1);
                expect(blockChanges[0].action).toBe('Update');

                expect(blockChanges[0].data.prevBlock.indent).toBe(0);
                expect(blockChanges[0].data.block.indent).toBe(1);
                // Dom Assertion
                expect((editorElement.querySelector('#paragraph1') as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                // DOM neighbors unchanged
                const next = blockElement.nextElementSibling as HTMLElement;
                expect(next && next.id).toBe('paragraph2');
                done();
            }, 100);
        });

        it('Should trigger Update action when inserting line breaks', (done) => {
            setTimeout(() => {
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 4);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, code: 'Enter' }));

                expect(blockChanges.length).toBe(1);
                expect(blockChanges[0].action).toBe('Update');

                expect(blockChanges[0].data.prevBlock.content[0].content).not.toContain('\n');
                expect(blockChanges[0].data.block.content[0].content).toContain('\n');
                expect(blockChanges[0].data.block.content[0].content).toBe('Hell\no world 1');
                // DOM content contains line break
                expect((getBlockContentElement(blockElement) as HTMLElement).textContent).toContain('\n');
                expect((getBlockContentElement(blockElement) as HTMLElement).textContent).toBe('Hell\no world 1');
                done();
            }, 100);
        });

        it('Should trigger Update action when indent multi blocks', (done) => {
            setTimeout(() => {
                const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
                const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
                const blockElement3 = editorElement.querySelector('#paragraph3') as HTMLElement;
                const blockElement4 = editorElement.querySelector('#paragraph4') as HTMLElement;
                const blockElement5 = editorElement.querySelector('#paragraph5') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement1);

                editor.blockManager.blockCommand.handleBlockIndentation({
                    blockIDs: ['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5'],
                    shouldDecrease: false
                });

                expect(blockChanges.length).toBe(5);
                expect(blockChanges[0].action).toBe('Update');
                expect(blockChanges[1].action).toBe('Update');
                expect(blockChanges[2].action).toBe('Update');
                expect(blockChanges[3].action).toBe('Update');
                expect(blockChanges[4].action).toBe('Update');
                
                // First block
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockChanges[0].data.block.indent).toBe(1);
                // DOM content contains line break
                expect(((blockElement1) as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');

                // Second block
                expect(editor.blocks[1].indent).toBe(1);
                expect(blockChanges[1].data.block.indent).toBe(1);
                // DOM content contains line break
                expect(((blockElement2) as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');

                // Third block
                expect(editor.blocks[2].indent).toBe(1);
                expect(blockChanges[2].data.block.indent).toBe(1);
                // DOM content contains line break
                expect(((blockElement3) as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');

                // Fourth block
                expect(editor.blocks[3].indent).toBe(1);
                expect(blockChanges[3].data.block.indent).toBe(1);
                // DOM content contains line break
                expect(((blockElement4) as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');

                // Fifth block
                expect(editor.blocks[4].indent).toBe(1);
                expect(blockChanges[4].data.block.indent).toBe(1);
                // DOM content contains line break
                expect(((blockElement5) as HTMLElement).style.getPropertyValue('--block-indent')).toBe('20');
                done();
            }, 100);
        });

        it('Should trigger Update & Insertion action on Enter', (done) => {
            setTimeout(() => {
                const blockElement = document.getElementById('paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, blockElement.textContent.length);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

                expect(blockChanges.length).toBe(2);
                expect(blockChanges[0].action).toBe('Update');
                expect(blockChanges[1].action).toBe('Insertion');

                expect(blockChanges[0].data.block.id).toBe(editor.blocks[0].id);
                expect(blockChanges[1].data.block.id).toBe(editor.blocks[1].id);
                expect(blockChanges[1].data.prevBlock).toBeUndefined();
                // DOM neighbor check: new block inserted after paragraph1
                const para1 = editorElement.querySelector('#paragraph1') as HTMLElement;
                const next = para1.nextElementSibling as HTMLElement;
                expect(next && next.id).toBe(editor.blocks[1].id);
                done();
            }, 100);
        });

        it('Should trigger Update & Deletion action on Backspace', (done) => {
            setTimeout(() => {
                const blockElement = document.getElementById('paragraph2') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(contentElement, 0);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

                expect(blockChanges.length).toBe(2);
                expect(blockChanges[0].action).toBe('Update');
                expect(blockChanges[1].action).toBe('Deletion');

                expect(blockChanges[1].data.block.id).toBe('paragraph2');
                expect(blockChanges[1].data.prevBlock).toBeUndefined();
                // Model order and DOM: paragraph2 removed; paragraph1 next is paragraph3
                const para1 = editorElement.querySelector('#paragraph1') as HTMLElement;
                expect(editorElement.querySelector('#paragraph2')).toBeNull();
                // Check Paragraph2 removed
                const next = para1.nextElementSibling as HTMLElement;
                expect(next && next.id).toBe('paragraph3');
                done();
            }, 100);
        });

        it('Should trigger Moved action on Moving blocks', (done) => {
            const blockElement = editor.element.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            triggerMouseMove(blockElement, 10, 10);
            editor.blockManager.blockActionMenuModule.toggleBlockActionPopup(false);
            setTimeout(() => {
                expect(editor.blockManager.blockActionMenuModule.popupObj.element.classList.contains('e-popup-open')).toBe(true);
                const popup = document.querySelector('.e-blockeditor-blockaction-popup');

                //Move down (button id may be moveup per test setup)
                (popup.querySelector('#moveup') as HTMLElement).click();
                expect(blockChanges.length).toBe(1);
                expect(blockChanges[0].action).toBe('Moved');

                expect(blockChanges[0].data.block.id).toBe('paragraph2');
                expect(blockChanges[0].data.prevBlock).toBeUndefined();
                expect(editor.blocks[0].id).toBe('paragraph2');
                expect(editor.blocks[1].id).toBe('paragraph1');
                expect(editor.blocks[2].id).toBe('paragraph3');
                expect(editor.blocks[0].content[0].content).toBe('Hello world 2');
                expect(editor.blocks[1].content[0].content).toBe('Hello world 1');
                expect(editor.blocks[2].content[0].content).toBe('Hello world 3');
                // DOM order reflects move (paragraph2 position changed)
                const all = Array.from(editorElement.querySelectorAll('.e-block')) as HTMLElement[];
                expect(all[0].id).toBe('paragraph2');
                expect(all[1].id).toBe('paragraph1');
                expect(all[2].id).toBe('paragraph3');
                expect(all[0].textContent).toBe('Hello world 2');
                expect(all[1].textContent).toBe('Hello world 1');
                expect(all[2].textContent).toBe('Hello world 3');
                done();
            }, 200);
        });

        it('Should trigger actions properly on MultiBlock Deletions', (done) => {
            setTimeout(() => {
                const range = document.createRange();
                const selection = document.getSelection();
                const startBlockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const startNode = getBlockContentElement(startBlockElement).firstChild;
                const startOffset = 5;
                const endBlockElement = editorElement.querySelector('#paragraph5') as HTMLElement;
                const endNode = getBlockContentElement(endBlockElement).firstChild;
                const endOffset = 5;

                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                selection.removeAllRanges();
                selection.addRange(range);
                editor.blockManager.setFocusToBlock(startBlockElement);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));

                expect(blockChanges.length).toBe(5);
                expect(blockChanges[0].action).toBe('Update');
                expect(blockChanges[1].action).toBe('Deletion');
                expect(blockChanges[2].action).toBe('Deletion');
                expect(blockChanges[3].action).toBe('Deletion');
                expect(blockChanges[4].action).toBe('Deletion');
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe("paragraph1");
                expect(editor.blocks[0].content[0].content).toBe("Hello world 5");
                // DOM: remaining blocks should be paragraph1 and paragraph5 merged area
                const all = editorElement.querySelectorAll('.e-block');
                expect(all.length).toBe(1);
                expect(all[0].textContent).toBe("Hello world 5");
                done();
            }, 100);
        });

        it('Should trigger actions properly on Entire editor Deletions', (done) => {
            setTimeout(() => {
                const range = document.createRange();
                const selection = document.getSelection();
                const startBlockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const startNode = getBlockContentElement(startBlockElement).firstChild;
                const startOffset = 0;
                const endBlockElement = editorElement.querySelector('#paragraph5') as HTMLElement;
                const endNode = getBlockContentElement(endBlockElement).firstChild;
                const endOffset = endBlockElement.textContent.length;

                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                selection.removeAllRanges();
                selection.addRange(range);
                editor.blockManager.setFocusToBlock(startBlockElement);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));

                expect(blockChanges.length).toBe(6);
                expect(blockChanges[0].action).toBe('Deletion');
                expect(blockChanges[1].action).toBe('Deletion');
                expect(blockChanges[2].action).toBe('Deletion');
                expect(blockChanges[3].action).toBe('Deletion');
                expect(blockChanges[4].action).toBe('Deletion');
                expect(blockChanges[5].action).toBe('Insertion');
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
                expect(editor.blocks[0].content[0].content).toBe("");
                // DOM: only one block exists after clearing editor
                const all = editorElement.querySelectorAll('.e-block');
                expect(all.length).toBe(1);
                expect(all[0].id).toBe(editor.blocks[0].id);
                expect(all[0].textContent).toBe("");
                done();
            }, 100);
        });
    });

    describe('Edge cases and null handling', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.BulletList, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', blockType: BlockType.BulletList, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: 'Paragraph 2' }] },
                { id: 'paragraph3', blockType: BlockType.Paragraph,
                    content: [
                        { id: 'bold', contentType: ContentType.Text, content: 'Bold', properties: { styles: { bold: true } } },
                        { id: 'italic', contentType: ContentType.Text, content: 'Italic', properties: { styles: { italic: true } } },
                    ]
                },
                { id: 'paragraph4', blockType: BlockType.Paragraph,
                    content: [
                        { id: 'underline', contentType: ContentType.Text, content: 'Underline', properties: { styles: { underline: true } } },
                        { id: 'strikethrough', contentType: ContentType.Text, content: 'Strikethrough', properties: { styles: { strikethrough: true } } },
                    ]
                },
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

        it('should handle null values properly', (done) => {
            const rangeSpy1 = spyOn(editor.blockManager.nodeSelection, 'getRange').and.returnValue(null);
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            
            expect((editor.blockManager.eventAction as any).handleEditorSelection()).toBeUndefined();
            expect((editor.blockManager.eventAction as any).handleLineBreaksOnBlock(blockElement1)).toBeUndefined();
            rangeSpy1.calls.reset();

            editor.readOnly = true;
            editor.dataBind();
            expect((editor.blockManager.eventAction as any).handleMouseUpActions()).toBeUndefined();
            expect((editor.blockManager.eventAction as any).handleMouseDownActions()).toBeUndefined();
            editor.readOnly = false;
            
            spyOn(editor.blockManager.observer, 'notify').and.callFake(function () { done(); });
            editorElement.dispatchEvent(new ClipboardEvent('copy'));
            editorElement.dispatchEvent(new ClipboardEvent('paste'));
            editorElement.dispatchEvent(new ClipboardEvent('cut'));

            editor.getRange = jasmine.createSpy().and.returnValue({
                commonAncestorContainer: editorElement
            });
            spyOn(editor.blockManager.inlineToolbarModule, 'hideInlineToolbar').and.callThrough();
            expect((editor.blockManager.eventAction as any).handleTextSelection());
            expect(editor.blockManager.inlineToolbarModule.hideInlineToolbar).toHaveBeenCalled();

            setCursorPosition(contentElement1, 0);
            const range = getSelectedRange();
            expect((editor.blockManager.eventAction as any).handleArrowKeyActions({ key: 'ArrowUp' }, range, blockElement1 )).toBeUndefined();

            // DOM unchanged
            const all = editorElement.querySelectorAll('.e-block');
            expect((all[0] as HTMLElement).id).toBe('paragraph1');
            expect((all[1] as HTMLElement).id).toBe('paragraph2');
            expect((all[2] as HTMLElement).id).toBe('paragraph3');
            expect((all[3] as HTMLElement).id).toBe('paragraph4');
            done();
        });
        
    });
});