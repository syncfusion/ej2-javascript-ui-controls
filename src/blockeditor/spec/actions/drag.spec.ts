import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockModel, ITableBlockSettings } from '../../src/models/index';
import { BlockDragEventArgs } from '../../src/models/eventargs';
import { BlockEditor } from '../../src/index';

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
                { id: 'block1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 3 content' }] }
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
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 1 content');
                    done();
                }, 50);
            }, 100);
        });
    
        it('drag the block down and drop on the second block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('block2');
                    expect(editor.blocks[1].id).toBe('block1');
                    expect(editor.blocks[2].id).toBe('block3');
                    expect(editor.blocks[0].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 1 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 3 content');
                    done();
                }, 50);
            }, 100);
        });
    
        it('drag the block down and dropping on the last block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('block2');
                    expect(editor.blocks[1].id).toBe('block3');
                    expect(editor.blocks[2].id).toBe('block1');
                    expect(editor.blocks[0].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 1 content');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block towards up and dropping on the second block', (done) => {
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block3');
                    expect(editor.blocks[2].id).toBe('block2');
                    expect(editor.blocks[0].content[0].content).toContain('Block 1 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 2 content');
                    done();
                }, 100);
            }, 100);
        });
        it('drag the block towards up and dropping on the first block', (done) => {
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('block3');
                    expect(editor.blocks[1].id).toBe('block1');
                    expect(editor.blocks[2].id).toBe('block2');
                    expect(editor.blocks[0].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 1 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 2 content');
                    done();
                }, 100);
            }, 100);
        });
        it('drag and drop on the same block', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    expect(editor.blocks[2].id).toBe('block3');
                    expect(editor.blocks[0].content[0].content).toContain('Block 1 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 3 content');
                    done();
                }, 100);
            }, 100);
        });

        it('Check drag clone when dragging outside and inside of the editor', (done) => {
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();
    
            const dataTransfer = new DataTransfer();
            // 75px is the padding left value of content present inside the block
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block3, 'dragenter', 75, block3.offsetTop + 10, dataTransfer);
            triggerDragEvent(block3, 'dragover', 75, block3.offsetTop + 10, dataTransfer);
            // drag the block out of editor
            triggerDragEvent(dragIcon, 'drag', 0, block3.offsetTop + (block3.offsetHeight / 2) + 10, dataTransfer);
            const dragClone: HTMLElement = editor.element.querySelector('.e-be-dragging-clone');
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 1 content');
                    done();
                }, 50);
            }, 100);
        });

        it('dragging check with change in current hovered', (done) => {
            // for assigning current hovered block as null
            triggerMouseMove(editorElement, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].content[0].content).toContain('Block 2 content');
                    expect(editor.blocks[1].content[0].content).toContain('Block 3 content');
                    expect(editor.blocks[2].content[0].content).toContain('Block 1 content');
                    done();
                }, 50);
            }, 100);

        });

        it('should return when hovered block is null', function (done) {
            editor.blockManager.currentHoveredBlock = null;
            expect((editor.blockManager.dragAndDropAction as any).handleDragMove()).toBeUndefined();

            expect((editor.blockManager.dragAndDropAction as any).handleDragStop()).toBeUndefined();
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
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] }
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
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    done();
                }, 50);
            }, 100);
        });
        it('dynamic prop handling enableDragAndDrop false to true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] }
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
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks[1].id).toBe('block1');
                    expect(editor.blocks[0].id).toBe('block2');
                    done();
                }, 50);
            }, 100);
        });
        it('should cancel drag operation on blockDragStart if event args.cancel is true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] }
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
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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

                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    done();
                }, 50);
            }, 100);
        });
        it('should cancel drop operation on blockDrag if event args.cancel is true', (done) => {
            const blocks: BlockModel[] = [
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] }
            ];
            editor = new BlockEditor({ 
                blocks: blocks,
                blockDragging: function (args: BlockDragEventArgs) {
                    args.cancel = true
                }
            });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
            block2 = document.getElementById('block2');
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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

                    expect(editor.blocks[0].id).toBe('block1'); // Ensure no reordering happened
                    expect(editor.blocks[1].id).toBe('block2');
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
                { id: 'block1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 1 content' }] },
                { id: 'block2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 2 content' }] },
                { id: 'block3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 3 content' }] },
                { id: 'block4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 4 content' }] },
                { id: 'block5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Block 5 content' }] }
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
            const allBlocks = editor.blockManager.getEditorBlocks();
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
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block3');
                    expect(editor.blocks[1].id).toBe('block1');
                    expect(editor.blocks[2].id).toBe('block2');
                    expect(editor.blocks[3].id).toBe('block4');
                    expect(editor.blocks[4].id).toBe('block5');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 2 and 3 down and drop below the fourth block', (done) => {
            simulateMultiBlockSelection(block2, block3);
            
            triggerMouseMove(block2, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block4');
                    expect(editor.blocks[2].id).toBe('block2');
                    expect(editor.blocks[3].id).toBe('block3');
                    expect(editor.blocks[4].id).toBe('block5');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 down and drop below the fifth block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    expect(editor.blocks[2].id).toBe('block5');
                    expect(editor.blocks[3].id).toBe('block3');
                    expect(editor.blocks[4].id).toBe('block4');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 up and drop above the first block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block3');
                    expect(editor.blocks[1].id).toBe('block4');
                    expect(editor.blocks[2].id).toBe('block1');
                    expect(editor.blocks[3].id).toBe('block2');
                    expect(editor.blocks[4].id).toBe('block5');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 3 and 4 up and drop below the first block', (done) => {
            simulateMultiBlockSelection(block3, block4);
            
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block3');
                    expect(editor.blocks[2].id).toBe('block4');
                    expect(editor.blocks[3].id).toBe('block2');
                    expect(editor.blocks[4].id).toBe('block5');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 4 and 5 up and drop above the first block', (done) => {
            simulateMultiBlockSelection(block4, block5);
            
            triggerMouseMove(block4, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block4');
                    expect(editor.blocks[1].id).toBe('block5');
                    expect(editor.blocks[2].id).toBe('block1');
                    expect(editor.blocks[3].id).toBe('block2');
                    expect(editor.blocks[4].id).toBe('block3');
                    done();
                }, 100);
            }, 100);
        });

        it('drag the block 4 and 5 up and below below the second block', (done) => {
            simulateMultiBlockSelection(block4, block5);
            
            triggerMouseMove(block4, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
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
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    expect(editor.blocks[2].id).toBe('block4');
                    expect(editor.blocks[3].id).toBe('block5');
                    expect(editor.blocks[4].id).toBe('block3');
                    done();
                }, 100);
            }, 100);
        });

        it('drag different block block1 and block2 while multiple blocks are selected - only dragged block should move', (done) => {
            // Select blocks 1 and 2
            simulateMultiBlockSelection(block1, block2);

            // Move mouse to block3 (different block) to trigger drag icon
            triggerMouseMove(block3, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            // Start dragging block3 (not the selected blocks)
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block5, 'dragover', 75, block5.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block5.offsetTop + (block5.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    // Only block3 should move to after block5
                    // Blocks 1 and 2 remain in their original positions
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block1');
                    expect(updatedBlocks[1].id).toBe('block2');
                    expect(updatedBlocks[2].id).toBe('block4');
                    expect(updatedBlocks[3].id).toBe('block5');
                    expect(updatedBlocks[4].id).toBe('block3');
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block1');
                    expect(editor.blocks[1].id).toBe('block2');
                    expect(editor.blocks[2].id).toBe('block4');
                    expect(editor.blocks[3].id).toBe('block5');
                    expect(editor.blocks[4].id).toBe('block3');
                    done();
                }, 100);
            }, 100);
        });

        it('drag different block while multiple blocks are selected - only dragged block should move', (done) => {
            // Select blocks 2 and 3
            simulateMultiBlockSelection(block2, block3);

            // Move mouse to block1 (different block) to trigger drag icon
            triggerMouseMove(block1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            // Start dragging block1 (not the selected blocks)
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(block5, 'dragover', 75, block5.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, block5.offsetTop + (block5.offsetHeight/2) + 10, dataTransfer);

            setTimeout(() => {
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);

                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block');
                    // Only block1 should move to after block5
                    // Blocks 2 and 3 remain in their original positions
                    expect(updatedBlocks.length).toBe(5);
                    expect(updatedBlocks[0].id).toBe('block2');
                    expect(updatedBlocks[1].id).toBe('block3');
                    expect(updatedBlocks[2].id).toBe('block4');
                    expect(updatedBlocks[3].id).toBe('block5');
                    expect(updatedBlocks[4].id).toBe('block1');
                    expect(editor.element.querySelector('.e-be-dragging-clone') as HTMLElement).toBeNull();

                    expect(editor.blocks.length).toBe(5);
                    expect(editor.blocks[0].id).toBe('block2');
                    expect(editor.blocks[1].id).toBe('block3');
                    expect(editor.blocks[2].id).toBe('block4');
                    expect(editor.blocks[3].id).toBe('block5');
                    expect(editor.blocks[4].id).toBe('block1');
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('DragAndDrop with Table Blocks', () => {
        it('drag last paragraph and drop above table → inserts before table', (done) => {
            // Ensure editor container exists for this isolated test
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);

            // Setup blocks: para1 → table → para2
            const blocks: BlockModel[] = [
                // First paragraph
                { 
                    id: 'para1', 
                    blockType: BlockType.Paragraph, 
                    content: [{ contentType: ContentType.Text, content: 'First paragraph' }] 
                },
                // Table block (using proper nested structure)
                { 
                    id: 'table1', 
                    blockType: BlockType.Table, 
                    properties: {
                        enableHeader: true,
                        enableRowNumbers: true,
                        columns: [
                            { id: 'c1', headerText: 'Column A' },
                            { id: 'c2', headerText: 'Column B' }
                        ],
                        rows: [
                            {
                                cells: [
                                    { 
                                        columnId: 'c1', 
                                        blocks: [{ 
                                            id: 'cell-p1', 
                                            blockType: BlockType.Paragraph, 
                                            content: [{ contentType: ContentType.Text, content: 'Row 1 Col 1' }] 
                                        }] 
                                    },
                                    { 
                                        columnId: 'c2', 
                                        blocks: [{ 
                                            id: 'cell-p2', 
                                            blockType: BlockType.Paragraph, 
                                            content: [{ contentType: ContentType.Text, content: 'Row 1 Col 2' }] 
                                        }] 
                                    }
                                ]
                            },
                            {
                                cells: [
                                    { 
                                        columnId: 'c1', 
                                        blocks: [{ 
                                            id: 'cell-p3', 
                                            blockType: BlockType.Paragraph, 
                                            content: [{ contentType: ContentType.Text, content: 'Row 2 Col 1' }] 
                                        }] 
                                    },
                                    { 
                                        columnId: 'c2', 
                                        blocks: [{ 
                                            id: 'cell-p4', 
                                            blockType: BlockType.Paragraph, 
                                            content: [{ contentType: ContentType.Text, content: 'Row 2 Col 2' }] 
                                        }] 
                                    }
                                ]
                            }
                        ]
                    } as ITableBlockSettings
                },
                // Last paragraph (the one we'll drag)
                { 
                    id: 'para2', 
                    blockType: BlockType.Paragraph, 
                    content: [{ contentType: ContentType.Text, content: 'Last paragraph - will be moved' }] 
                }
            ];
        
            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');
        
            // Get DOM elements
            const para1 = document.getElementById('para1');
            const tableBlock = document.getElementById('table1');
            const para2 = document.getElementById('para2');
        
            expect(para1).not.toBeNull('para1 not found');
            expect(tableBlock).not.toBeNull('table1 not found');
            expect(para2).not.toBeNull('para2 not found');
        
            // Show drag handle
            triggerMouseMove(para2, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer
                .querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull('Drag icon not visible');
        
            const dataTransfer = new DataTransfer();
        
            // Start dragging the last paragraph
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
        
            // Drop target: near the **top** of the table block
            // → should insert BEFORE the table
            const dropY = tableBlock.offsetTop + 15; // small offset from top to target "above"
        
            triggerDragEvent(tableBlock, 'dragenter', 75, dropY, dataTransfer);
            triggerDragEvent(tableBlock, 'dragover', 75, dropY, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, dropY, dataTransfer);
        
            setTimeout(() => {
                // Complete the drop
                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
            
                setTimeout(() => {
                    const updatedBlocks = editor.element.querySelectorAll('.e-block-container > .e-block');
                    const modelBlocks = editor.blocks;
                    expect(updatedBlocks.length).toBe(3);
                    expect(modelBlocks.length).toBe(3);
                
                    // Expected final order: para1 → para2 → table1
                    expect(updatedBlocks[0].id).toBe('para1');
                    expect(updatedBlocks[1].id).toBe('para2');
                    expect(updatedBlocks[2].id).toBe('table1');
                    
                
                    // Also verify model order
                    expect(editor.blocks.map(b => b.id)).toEqual(['para1', 'para2', 'table1']);
                
                    // Cleanup check
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                
                    // Optional: basic content verification
                    expect(updatedBlocks[0].textContent).toBe('First paragraph');
                    expect(updatedBlocks[1].textContent).toBe('Last paragraph - will be moved');
                    expect(updatedBlocks[2].textContent).toContain('Row 1 Col 1'); // table content visible
                    expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[1].content[0].content).toBe('Last paragraph - will be moved');

                    // cleanup
                    editor.destroy();
                    remove(editorElement);

                    done();
                }, 80);
            }, 120);
        });
    });

    describe('DragAndDrop Nested Block Restrictions', () => {
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

        it('should hide drop indicator when dragging a Quote over another Quote', (done) => {
            const blocks: BlockModel[] = [
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'First quote' }]
                        }]
                    }
                },
                { 
                    id: 'quote2', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote2',
                            content: [{ contentType: ContentType.Text, content: 'Second quote' }]
                        }]
                    }
                },
                { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const quote1 = document.getElementById('quote1');
            const quote2 = document.getElementById('quote2');

            triggerMouseMove(quote1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(quote2, 'dragover', 75, quote2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, quote2.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                // Check that drop indicator is not visible (cleaned up)
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).toBeNull('Drop indicator should be hidden for nested quote over quote');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should hide drop indicator when dragging a Callout over a Callout', (done) => {
            const blocks: BlockModel[] = [
                { 
                    id: 'callout1', 
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'callout1',
                            content: [{ contentType: ContentType.Text, content: 'First callout' }]
                        }]
                    }
                },
                { 
                    id: 'callout2', 
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'callout2',
                            content: [{ contentType: ContentType.Text, content: 'Second callout' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const callout1 = document.getElementById('callout1');
            const callout2 = document.getElementById('callout2');

            triggerMouseMove(callout1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(callout2, 'dragover', 75, callout2.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, callout2.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).toBeNull('Drop indicator should be hidden for nested callout over callout');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should hide drop indicator when dragging CollapsibleParagraph over CollapsibleHeading', (done) => {
            const blocks: BlockModel[] = [
                { 
                    id: 'collPara1', 
                    blockType: BlockType.CollapsibleParagraph,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'collPara1',
                            content: [{ contentType: ContentType.Text, content: 'Collapsible paragraph' }]
                        }]
                    }
                },
                { 
                    id: 'collHead1', 
                    blockType: BlockType.CollapsibleHeading,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'collHead1',
                            content: [{ contentType: ContentType.Text, content: 'Collapsible heading' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const collPara1 = document.getElementById('collPara1');
            const collHead1 = document.getElementById('collHead1');

            triggerMouseMove(collPara1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(collHead1, 'dragover', 75, collHead1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, collHead1.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).toBeNull('Drop indicator should be hidden for nested collapsible blocks');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should show drop indicator when dragging a Paragraph over a Quote', (done) => {
            const blocks: BlockModel[] = [
                { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph to drag' }] },
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'Quote block' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const para1 = document.getElementById('para1');
            const quote1 = document.getElementById('quote1');

            triggerMouseMove(para1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(quote1, 'dragover', 75, quote1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, quote1.offsetTop + (quote1.offsetHeight / 2) + 10, dataTransfer);

            setTimeout(() => {
                // Check that drop indicator IS visible (not cleaned up)
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).not.toBeNull('Drop indicator should be visible for non-nested block over nested block');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should show drop indicator when dragging a Quote next to (not inside) another Quote', (done) => {
            const blocks: BlockModel[] = [
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'First quote' }]
                        }]
                    }
                },
                { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph separator' }] },
                { 
                    id: 'quote2', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote2',
                            content: [{ contentType: ContentType.Text, content: 'Second quote' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const quote1 = document.getElementById('quote1');
            const para1 = document.getElementById('para1');

            triggerMouseMove(quote1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            // Drag to a non-nested block (para1), not to another nested block
            triggerDragEvent(para1, 'dragover', 75, para1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, para1.offsetTop + (para1.offsetHeight / 2) + 10, dataTransfer);

            setTimeout(() => {
                // Drop indicator should be visible when dropping outside nested context
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).not.toBeNull('Drop indicator should be visible for nested block dropping outside nested context');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should hide drop indicator when dragging multiple blocks including a Callout over a Quote', (done) => {
            const blocks: BlockModel[] = [
                { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                { 
                    id: 'callout1', 
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'callout1',
                            content: [{ contentType: ContentType.Text, content: 'Callout' }]
                        }]
                    }
                },
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'Quote' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const para1 = document.getElementById('para1');
            const callout1 = document.getElementById('callout1');
            const quote1 = document.getElementById('quote1');

            // Simulate selection of para1 and callout1
            const range = document.createRange();
            range.setStartBefore(para1);
            range.setEndAfter(callout1);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const allBlocks = editor.blockManager.getEditorBlocks();
            const selectedBlocks = allBlocks.slice(0, 2);
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);

            triggerMouseMove(para1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(quote1, 'dragover', 75, quote1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, quote1.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                // Drop indicator should be hidden because draggedBlocks includes a Callout (nested-capable)
                // and quote1 is itself a nested-capable block
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).toBeNull('Drop indicator should be hidden when mixed selection includes nested block');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should show drop indicator when dragging multiple non-nested blocks over a Callout', (done) => {
            const blocks: BlockModel[] = [
                { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph 1' }] },
                { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph 2' }] },
                { 
                    id: 'callout1', 
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'callout1',
                            content: [{ contentType: ContentType.Text, content: 'Callout' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const para1 = document.getElementById('para1');
            const para2 = document.getElementById('para2');
            const callout1 = document.getElementById('callout1');

            // Simulate selection of para1 and para2
            const range = document.createRange();
            range.setStartBefore(para1);
            range.setEndAfter(para2);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const allBlocks = editor.blockManager.getEditorBlocks();
            const selectedBlocks = allBlocks.slice(0, 2);
            spyOn(editor, 'getSelectedBlocks').and.returnValue(selectedBlocks);

            triggerMouseMove(para1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(callout1, 'dragover', 75, callout1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, callout1.offsetTop + (callout1.offsetHeight / 2) + 10, dataTransfer);

            setTimeout(() => {
                // Drop indicator should be visible because all dragged blocks are non-nested
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).not.toBeNull('Drop indicator should be visible when dragging only non-nested blocks');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should hide drop indicator when dragging a Quote over CollapsibleHeading inside Callout', (done) => {
            // This tests deep nesting: Quote → over CollapsibleHeading that is inside Callout
            const blocks: BlockModel[] = [
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'Quote to drag' }]
                        }]
                    }
                },
                { 
                    id: 'callout1', 
                    blockType: BlockType.Callout,
                    properties: {
                        children: [{
                            id: 'collHead1',
                            blockType: BlockType.CollapsibleHeading,
                            parentId: 'callout1',
                            content: [{ contentType: ContentType.Text, content: 'Collapsible inside' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const quote1 = document.getElementById('quote1');
            const collHead1 = document.getElementById('collHead1');

            triggerMouseMove(quote1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(collHead1, 'dragover', 75, collHead1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, collHead1.offsetTop + 10, dataTransfer);

            setTimeout(() => {
                // Drop indicator should be hidden because:
                // - quote1 is a nested-capable block (Quote)
                // - collHead1 is a nested-capable block
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).toBeNull('Drop indicator should be hidden for quote over nested-capable block');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });

        it('should show drop indicator when dragging a Heading over a Quote (non-nested block)', (done) => {
            const blocks: BlockModel[] = [
                { id: 'heading1', blockType: BlockType.Heading, content: [{ contentType: ContentType.Text, content: 'Heading to drag' }] },
                { 
                    id: 'quote1', 
                    blockType: BlockType.Quote,
                    properties: {
                        children: [{
                            blockType: BlockType.Paragraph,
                            parentId: 'quote1',
                            content: [{ contentType: ContentType.Text, content: 'Quote' }]
                        }]
                    }
                }
            ];

            editor = new BlockEditor({ 
                blocks: blocks,
                enableDragAndDrop: true
            });
            editor.appendTo('#editor');

            const heading1 = document.getElementById('heading1');
            const quote1 = document.getElementById('quote1');

            triggerMouseMove(heading1, 10, 10);
            const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
            expect(dragIcon).not.toBeNull();

            const dataTransfer = new DataTransfer();
            triggerDragEvent(dragIcon, 'dragstart', 10, 10, dataTransfer);
            triggerDragEvent(quote1, 'dragover', 75, quote1.offsetTop + 10, dataTransfer);
            triggerDragEvent(dragIcon, 'drag', 75, quote1.offsetTop + (quote1.offsetHeight / 2) + 10, dataTransfer);

            setTimeout(() => {
                // Drop indicator should be visible because Heading is not a nested-capable block
                const dropIndicator = editor.element.querySelector('.e-be-drop-indicator');
                expect(dropIndicator).not.toBeNull('Drop indicator should be visible for non-nested block (Heading) over nested block');

                triggerDragEvent(dragIcon, 'dragend', 0, 0, dataTransfer);
                
                setTimeout(() => {
                    expect(editor.element.querySelector('.e-be-dragging-clone')).toBeNull();
                    done();
                }, 50);
            }, 100);
        });
    });
});
