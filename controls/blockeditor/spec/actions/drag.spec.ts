import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../src/blockeditor/base/enums';
import { BlockModel } from '../../src/blockeditor/models';
import { BlockEditor } from '../../src/index';
import { BlockDragEventArgs } from '../../src/blockeditor/base/eventargs';

describe('DragAndDrop', () => {
    let editor: BlockEditor;
    let block1: HTMLElement, block2: HTMLElement, block3: HTMLElement, block4: HTMLElement, block5: HTMLElement;
    let editorElement: HTMLElement;
    function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
        const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        node.dispatchEvent(event);
    }

    function triggerDragEvent(node: HTMLElement, eventType: string, x: number, y: number, dataTransfer: DataTransfer = new DataTransfer()): void {
        const dragEvent = new DragEvent(eventType, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: dataTransfer });
        node.dispatchEvent(dragEvent);
    }    

    describe('DragAndDrop Reordering', () => {
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.BulletList, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.BulletList, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'content3', type: ContentType.Text, content: 'Block 3 content' }] }
            ];
    
            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            block3 = document.getElementById('block3');
        });
    
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
    
        it('should correctly reorder blocks after drag-and-drop', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            // 75px is the padding left value of content present inside the block
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragenter', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + (block3.offsetHeight/2) + 10, dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 1 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);
        });
    
        it('drag the block down and drop on the second block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + (block2.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].id).toBe('block2');
                    expect(updatedBlocks[1].id).toBe('block1');
                    expect(updatedBlocks[2].id).toBe('block3');
                    expect(updatedBlocks[0].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 1 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);
        });
    
        it('drag the block down and dropping on the last block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + (block3.offsetHeight/2) + 10, dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].id).toBe('block2');
                    expect(updatedBlocks[1].id).toBe('block3');
                    expect(updatedBlocks[2].id).toBe('block1');
                    expect(updatedBlocks[0].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 1 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block towards up and dropping on the second block', (done) => {
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, (block2.offsetTop + 10), dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block3');
                    expect(updatedBlocks[2].id).toBe('block2');
                    expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 2 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });
        it('drag the block towards up and dropping on the first block', (done) => {
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block1, 'dragover', 75, block1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, (block1.offsetTop + 10), dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].id).toBe('block3');
                    expect(updatedBlocks[1].id).toBe('block1');
                    expect(updatedBlocks[2].id).toBe('block2');
                    expect(updatedBlocks[0].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 1 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 2 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });
        it('drag and drop on the same block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block1, 'dragover', 75, block1.offsetTop, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, (block1.offsetTop), dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block2');
                    expect(updatedBlocks[2].id).toBe('block3');
                    expect(updatedBlocks[0].textContent).toContain('Block 1 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 3 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Check drag clone when dragging outside and inside of the editor', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            // 75px is the padding left value of content present inside the block
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragenter', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            // drag the block out of editor
            triggerDragEvent(dragIcon, 'drag', 0, block3.offsetTop + (block3.offsetHeight / 2) + 10, dataTransfer);
            const dragClone: HTMLElement = editor.element.querySelector('.dragging-clone');
            expect(dragClone.style.opacity).toBe('0');
            // drag the block inside the editor
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + (block3.offsetHeight/2) + 10, dataTransfer);
            expect(dragClone.style.opacity).not.toBe('0');
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 1 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('dragging check with change in current hovered', (done) => {
            // for assigning current hovered block as null
            triggerMouseMove(editorElement, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            // 75px is the padding left value of content present inside the block
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            // update current hovered block
            triggerMouseMove(block1, 10, 10);
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragenter', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + (block3.offsetHeight/2) + 10, dataTransfer);
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(3);
                    expect(updatedBlocks[0].textContent).toContain('Block 2 content');
                    expect(updatedBlocks[1].textContent).toContain('Block 3 content');
                    expect(updatedBlocks[2].textContent).toContain('Block 1 content');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);

        });

        it('should return when hovered block is null', function (done) {
            editor.currentHoveredBlock = null;
            expect((editor.dragAndDropAction as any).handleDragMove()).toBeUndefined();

            expect((editor.dragAndDropAction as any).handleDragStop()).toBeUndefined();
            done();
        });
    });

    describe('DragAndDrop Event Handling', () => { 
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });       
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });
        it('dynamic prop handling enableDragAndDrop', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] }
            ];
    
            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
    
            // Initially, drag and drop is enabled; now disable it
            editor.enableDragAndDrop = false;
            editor.dataBind();
    
            // Attempt to reorder blocks
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + (block2.offsetHeight/2) + 10, dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    // Ensure no reordering happened
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block2');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);
        });
        it('dynamic prop handling enableDragAndDrop false to true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] }
            ];
    
            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: false
            });
            editor.appendTo('#editor');
    
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
    
            // Initially, drag and drop is enabled; now disable it
            editor.enableDragAndDrop = true;
            editor.dataBind();
    
            // Attempt to reorder blocks
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + (block2.offsetHeight/2) + 10, dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    // Ensure reordering happened
                    expect(updatedBlocks[1].id).toBe('block1');
                    expect(updatedBlocks[0].id).toBe('block2');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 50);
            }, 100);
        });
        it('should cancel drag operation on blockDragStart if event args.cancel is true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] }
            ];
            editor = new BlockEditor({ 
                blocks: blocks,
                blockDragStart: function (args: BlockDragEventArgs) {
                    args.cancel = true
                }
            });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + (block2.offsetHeight/2) + 10, dataTransfer);
    
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
    
                setTimeout(() => {
                    // Ensure no reordering happened
                        const updatedBlocks = editor.element.querySelectorAll('.e-block');
                        expect(updatedBlocks[0].id).toBe('block1');
                        expect(updatedBlocks[1].id).toBe('block2');
                    done();
                }, 50);
            }, 100);
        });
        it('should cancel drop operation on blockDrag if event args.cancel is true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] }
            ];
            editor = new BlockEditor({ 
                blocks: blocks,
                blockDrag: function (args: BlockDragEventArgs) {
                    args.cancel = true
                }
            });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + (block2.offsetHeight/2) + 10, dataTransfer);
            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks[0].id).toBe('block1'); // Ensure no reordering happened
                    expect(updatedBlocks[1].id).toBe('block2');
                    done();
                }, 50);
            }, 100);
        });
    });

    describe('DragAndDrop Reordering Multiple Blocks', () => {

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'block1', type: BlockType.Paragraph, content: [{ id: 'content1', type: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', type: BlockType.Paragraph, content: [{ id: 'content2', type: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', type: BlockType.Paragraph, content: [{ id: 'content3', type: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', type: BlockType.Paragraph, content: [{ id: 'content4', type: ContentType.Text, content: 'Block 4 content' }] },
                { id: 'block5', type: BlockType.Paragraph, content: [{ id: 'content5', type: ContentType.Text, content: 'Block 5 content' }] }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            block3 = document.getElementById('block3');
            block4 = document.getElementById('block4');
            block5 = document.getElementById('block5');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        // Helper function to simulate selecting multiple blocks
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
            const allBlocks = editor.getEditorBlocks();
            const startIdx = allBlocks.findIndex(b => b.id === startBlockId);
            const endIdx = allBlocks.findIndex(b => b.id === endBlockId);
            const selectedBlocks = allBlocks.slice(
                Math.min(startIdx, endIdx),
                Math.max(startIdx, endIdx) + 1
            );
            
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);
        }

        it('drag the block 1 and 2 down and drop below the third block', (done) => {
            // Simulate selection of blocks 1 and 2
            simulateMultiBlockSelection(block1, block2);
            
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + (block3.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block3');
                    expect(updatedBlocks[1].id).toBe('block1');
                    expect(updatedBlocks[2].id).toBe('block2');
                    expect(updatedBlocks[3].id).toBe('block4');
                    expect(updatedBlocks[4].id).toBe('block5');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 2 and 3 down and drop below the fourth block', (done) => {
            simulateMultiBlockSelection(block2, block3);
            
            triggerMouseMove(block2, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block4, 'dragover', 75, block4.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block4.offsetTop + (block4.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block4');
                    expect(updatedBlocks[2].id).toBe('block2');
                    expect(updatedBlocks[3].id).toBe('block3');
                    expect(updatedBlocks[4].id).toBe('block5');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 down and drop below the fifth block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block5, 'dragover', 75, block5.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block5.offsetTop + (block5.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block2');
                    expect(updatedBlocks[2].id).toBe('block5');
                    expect(updatedBlocks[3].id).toBe('block3');
                    expect(updatedBlocks[4].id).toBe('block4');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 up and drop above the first block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block1, 'dragover', 75, block1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, (block1.offsetTop + 10), dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block3');
                    expect(updatedBlocks[1].id).toBe('block4');
                    expect(updatedBlocks[2].id).toBe('block1');
                    expect(updatedBlocks[3].id).toBe('block2');
                    expect(updatedBlocks[4].id).toBe('block5');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 up and drop below the first block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block2, 'dragover', 75, block2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block2.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block3');
                    expect(updatedBlocks[2].id).toBe('block4');
                    expect(updatedBlocks[3].id).toBe('block2');
                    expect(updatedBlocks[4].id).toBe('block5');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 4 and 5 up and drop above the first block', (done) => {
            simulateMultiBlockSelection(block4, block5);
            
            triggerMouseMove(block4, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block1, 'dragover', 75, block1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, (block1.offsetTop + 10), dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block4');
                    expect(updatedBlocks[1].id).toBe('block5');
                    expect(updatedBlocks[2].id).toBe('block1');
                    expect(updatedBlocks[3].id).toBe('block2');
                    expect(updatedBlocks[4].id).toBe('block3');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 4 and 5 up and below below the second block', (done) => {
            simulateMultiBlockSelection(block4, block5);
            
            triggerMouseMove(block4, 10, 10);
            const dragIcon = editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block3.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block2');
                    expect(updatedBlocks[2].id).toBe('block4');
                    expect(updatedBlocks[3].id).toBe('block5');
                    expect(updatedBlocks[4].id).toBe('block3');
                    expect(editor.element.querySelector('.dragging-clone') as HTMLElement).toBeNull();
                    done();
                }, 100);
            }, 100);
        });
    });
});
