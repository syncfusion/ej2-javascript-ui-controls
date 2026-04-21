import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../../src/models/enums';
import { BaseChildrenProp, BlockModel, ICalloutBlockSettings, IChecklistBlockSettings, ICollapsibleBlockSettings, IHeadingBlockSettings, IImageBlockSettings } from '../../../src/models/index';
import { createEditor } from '../../common/util.spec';
import { BlockEditor } from '../../../src/index';

describe('ActionMenu actions (UI + keyboard)', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
        const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        node.dispatchEvent(event);
    }

    describe('duplicate', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph text' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                expect(domBlocks[0].textContent).toBe('Paragraph text');
                
                // Open action menu
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(domBlocks[0].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                    expect(domBlocks[0].textContent).toBe('Paragraph text');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                    expect(domBlocks[1].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[1].content[0].content).toBe('Paragraph text');
                    expect(domBlocks[1].textContent).toBe('Paragraph text');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(domBlocks[0].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                    expect(domBlocks[0].textContent).toBe('Paragraph text');
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(domBlocks[0].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                    expect(domBlocks[1].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[1].content[0].content).toBe('Paragraph text');
                    expect(domBlocks[1].textContent).toBe('Paragraph text');
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);

                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                expect(domBlocks[0].textContent).toBe('Paragraph text');
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                expect(domBlocks[0].textContent).toBe('Paragraph text');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[1].querySelector('p')).not.toBeNull();
                expect(modelBlocks[1].content[0].content).toBe('Paragraph text');
                expect(domBlocks[1].textContent).toBe('Paragraph text');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Paragraph text');
                expect(domBlocks[0].textContent).toBe('Paragraph text');
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(domBlocks[1].querySelector('p')).not.toBeNull();
                expect(modelBlocks[1].content[0].content).toBe('Paragraph text');
                expect(domBlocks[1].textContent).toBe('Paragraph text');
                done();
            });
        });
        
        describe('Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ contentType: ContentType.Text, content: 'Heading 1' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                expect(domBlocks[0].textContent).toBe('Heading 1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                    expect(domBlocks[0].textContent).toBe('Heading 1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                    expect(domBlocks[1].textContent).toBe('Heading 1');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                    expect(domBlocks[1]).toBeUndefined();
                    expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                    expect(domBlocks[0].textContent).toBe('Heading 1');
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                    expect(domBlocks[0].textContent).toBe('Heading 1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                    expect(domBlocks[1].textContent).toBe('Heading 1');
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                expect(domBlocks[0].textContent).toBe('Heading 1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(domBlocks[1].textContent).toBe('Heading 1');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                expect(domBlocks[0].textContent).toBe('Heading 1');
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                expect(domBlocks[0].textContent).toBe('Heading 1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(domBlocks[1].textContent).toBe('Heading 1');
                done();
            });
        });

        describe('Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ contentType: ContentType.Text, content: 'Heading 2' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[0].content[0].content).toBe('Heading 2');
                expect(domBlocks[0].textContent).toBe('Heading 2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 2');
                    expect(domBlocks[1].textContent).toBe('Heading 2');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                
                done();
            });
        });

        describe('Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ contentType: ContentType.Text, content: 'Heading 3' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[0].content[0].content).toBe('Heading 3');
                expect(domBlocks[0].textContent).toBe('Heading 3');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 3');
                    expect(domBlocks[1].textContent).toBe('Heading 3');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                    
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                
                done();
            });
        });

        describe('Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ contentType: ContentType.Text, content: 'Heading 4' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                expect(modelBlocks[0].content[0].content).toBe('Heading 4');
                expect(domBlocks[0].textContent).toBe('Heading 4');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 4');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[1].querySelector('h4')).not.toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h4')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(domBlocks[1].querySelector('h4')).not.toBeNull();
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                
                done();
            });
        });

        describe('Bullet List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'bullet1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[0].querySelector('ul')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Bullet item');
                expect(domBlocks[0].textContent).toBe('Bullet item');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                    expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                    expect(modelBlocks[1].content[0].content).toBe('Bullet item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].querySelector('ul')).not.toBeNull();
                    expect(domBlocks[1].querySelector('ul')).not.toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[0].querySelector('ul')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[0].querySelector('ul')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[1].querySelector('ul')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[0].querySelector('ul')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                expect(domBlocks[1].querySelector('ul')).not.toBeNull();
                
                done();
            });
        });

        describe('Numbered List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[0].querySelector('ol')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('Numbered item');
                expect(domBlocks[0].textContent).toBe('Numbered item');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                    expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                    expect(modelBlocks[1].content[0].content).toBe('Numbered item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].querySelector('ol')).not.toBeNull();
                    expect(domBlocks[1].querySelector('ol')).not.toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[0].querySelector('ol')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[0].querySelector('ol')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[1].querySelector('ol')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[0].querySelector('ol')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                expect(domBlocks[1].querySelector('ol')).not.toBeNull();
                
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'check1', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect((modelBlocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
                expect(modelBlocks[0].content[0].content).toBe('Checklist item');
                expect(domBlocks[0].textContent).toBe('Checklist item');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                    expect((modelBlocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                    expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                    expect(modelBlocks[1].content[0].content).toBe('Checklist item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                    expect(domBlocks[1].getAttribute('data-block-type')).toBe('Checklist');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                    expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect((modelBlocks[0].properties as IChecklistBlockSettings).isChecked).toBe(false);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[1].getAttribute('data-block-type')).toBe('Checklist');
                expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                expect(domBlocks[1].getAttribute('data-block-type')).toBe('Checklist');
                
                done();
            });
        });

        describe('Quote block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'quote1', blockType: BlockType.Quote,
                        properties: {
                            children: [{
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'Quote text' }]
                            }]
                        }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                expect((modelBlocks[0].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                expect(domBlocks[0].textContent).toBe('Quote text');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(4);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                    expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                    expect((modelBlocks[0].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                    expect(domBlocks[0].textContent).toBe('Quote text');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                    expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                    expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                    expect(domBlocks[1].textContent).toBe('Quote text');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                    expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                    expect((modelBlocks[0].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                    expect(domBlocks[0].textContent).toBe('Quote text');
                    expect(domBlocks[2]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(4);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                    expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                    expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                    expect(domBlocks[1].textContent).toBe('Quote text');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(4);
                expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                expect(domBlocks[2]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(4);
                expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                
                done();
            });
        });

        describe('Code block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ contentType: ContentType.Text, content: 'const x = 10;' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                expect(modelBlocks[0].content[0].content).toBe('const x = 10;');
                // it takes the plain text too (lang option)
                // expect(domBlocks[0].textContent).toBe('const x = 10;');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                    expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('const x = 10;');
                    // expect(domBlocks[0].textContent).toBe('const x = 10;');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                    expect(domBlocks[1].querySelector('pre')).not.toBeNull();
                    expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                    // expect(domBlocks[1].textContent).toBe('const x = 10;');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                    expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('const x = 10;');
                    // expect(domBlocks[0].textContent).toBe('const x = 10;');
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                    expect(domBlocks[1].querySelector('pre')).not.toBeNull();
                    expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                    // expect(domBlocks[1].textContent).toBe('const x = 10;');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                expect(domBlocks[1].querySelector('pre')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Code);
                expect(domBlocks[0].querySelector('pre')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                expect(domBlocks[1].querySelector('pre')).not.toBeNull();
                
                done();
            });
        });

        describe('Collapsible Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapsePara1',
                        blockType: BlockType.CollapsibleParagraph,
                        content: [{ contentType: ContentType.Text, content: 'Collapsible Para' }],
                        properties: { isExpanded: true, children: [] }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[0].content[0].content).toBe('Collapsible Para');
                expect(domBlocks[0].textContent).toContain('Collapsible Para');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                    expect(domBlocks[0].querySelector('p')).not.toBeNull();
                    expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[0].content[0].content).toBe('Collapsible Para');
                    expect(domBlocks[0].textContent).toContain('Collapsible Para');
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                    expect(domBlocks[1].querySelector('p')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                    expect(domBlocks[1].textContent).toContain('Collapsible Para');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                    expect(domBlocks[0].querySelector('p')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('Collapsible Para');
                    expect(domBlocks[0].textContent).toContain('Collapsible Para');
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                    expect(domBlocks[1].querySelector('p')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                    expect(domBlocks[1].textContent).toContain('Collapsible Para');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[1].querySelector('p')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[0].querySelector('p')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                expect(domBlocks[1].querySelector('p')).not.toBeNull();
                
                done();
            });
        });

        describe('Collapsible Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapseH1',
                        blockType: BlockType.CollapsibleHeading,
                        content: [{ contentType: ContentType.Text, content: 'Collapsible H1' }],
                        properties: { level: 1, isExpanded: true, children: [] }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[0].content[0].content).toBe('Collapsible H1');
                expect(domBlocks[0].textContent).toContain('Collapsible H1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                    expect(domBlocks[1].textContent).toContain('Collapsible H1');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                    expect(modelBlocks[0].content[0].content).toBe('Collapsible H1');
                    expect(domBlocks[0].textContent).toContain('Collapsible H1');
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                    expect(domBlocks[1].textContent).toContain('Collapsible H1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h1')).not.toBeNull();
                
                done();
            });
        });

        describe('Collapsible Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapseH2',
                        blockType: BlockType.CollapsibleHeading,
                        content: [{ contentType: ContentType.Text, content: 'Collapsible H2' }],
                        properties: { level: 2, isExpanded: true, children: [] }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[0].content[0].content).toBe('Collapsible H2');
                expect(domBlocks[0].textContent).toContain('Collapsible H2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                    expect(domBlocks[1].textContent).toContain('Collapsible H2');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                    expect(domBlocks[1].textContent).toContain('Collapsible H2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                expect(domBlocks[1].textContent).toContain('Collapsible H2');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h2')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                expect(domBlocks[1].textContent).toContain('Collapsible H2');
                
                done();
            });
        });

        describe('Collapsible Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapseH3',
                        blockType: BlockType.CollapsibleHeading,
                        content: [{ contentType: ContentType.Text, content: 'Collapsible H3' }],
                        properties: { level: 3, isExpanded: true, children: [] }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[0].content[0].content).toBe('Collapsible H3');
                expect(domBlocks[0].textContent).toContain('Collapsible H3');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H3');
                    expect(domBlocks[1].textContent).toContain('Collapsible H3');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(domBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(domBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H3');
                    expect(domBlocks[1].textContent).toContain('Collapsible H3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H3');
                expect(domBlocks[1].textContent).toContain('Collapsible H3');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(domBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks[1].querySelector('h3')).not.toBeNull();
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H3');
                expect(domBlocks[1].textContent).toContain('Collapsible H3');
                
                done();
            });
        });

        describe('Collapsible Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapseH4',
                        blockType: BlockType.CollapsibleHeading,
                        content: [{ contentType: ContentType.Text, content: 'Collapsible H4' }],
                        properties: { level: 4, isExpanded: true, children: [] }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(modelBlocks[0].content[0].content).toBe('Collapsible H4');
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(4);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(Array.isArray((modelBlocks[0].properties as ICollapsibleBlockSettings).children)).toBe(true);
                expect(domBlocks.length).toBe(1);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(4);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(Array.isArray((modelBlocks[1].properties as ICollapsibleBlockSettings).children)).toBe(true);
                    expect(domBlocks.length).toBe(2);
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(4);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(4);
                expect((modelBlocks[0].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(domBlocks.length).toBe(1);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(4);
                expect(domBlocks.length).toBe(2);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect(domBlocks.length).toBe(2);
                
                done();
            });
        });

        describe('Callout block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'callout1',
                        blockType: BlockType.Callout,
                        properties: {
                            children: [
                                { id: 'callout-child', blockType: BlockType.Paragraph, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'Callout content' }] }
                            ]
                        }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Callout);
                expect(Array.isArray((modelBlocks[0].properties as ICalloutBlockSettings).children)).toBe(true);
                expect((modelBlocks[0].properties as ICalloutBlockSettings).children.length).toBe(1);
                expect(domBlocks.length).toBe(1);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Callout);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                    expect((modelBlocks[1].properties as ICalloutBlockSettings).children.length).toBe(1);
                    expect((modelBlocks[1].properties as ICalloutBlockSettings).children[0].content[0].content).toBe('Callout content');
                    expect(domBlocks.length).toBe(2);
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Callout);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                    expect((modelBlocks[1].properties as ICalloutBlockSettings).children.length).toBe(1);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Callout);
                expect(Array.isArray((modelBlocks[0].properties as ICalloutBlockSettings).children)).toBe(true);
                expect(domBlocks.length).toBe(1);
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Callout);
                expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                expect(domBlocks.length).toBe(2);
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                expect(domBlocks.length).toBe(2);
                done();
            });
        });

        describe('Divider block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'divider1', blockType: BlockType.Divider }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });
        
            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });
        
            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
                expect(domBlocks.length).toBe(1);
                expect(document.querySelector('#divider1 hr')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].querySelector('hr')).not.toBeNull();
                    expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });
        
            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
                expect(domBlocks.length).toBe(1);
                expect(document.querySelector('#divider1 hr')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Divider);
                expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                expect(domBlocks.length).toBe(2);
                
                done();
            });
        });

        describe('Image block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'img1', blockType: BlockType.Image, properties: { src: 'https://via.placeholder.com/150', alt: 'Test image' } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Image);
                expect((modelBlocks[0].properties as IImageBlockSettings).src).toBe('https://via.placeholder.com/150');
                expect(domBlocks.length).toBe(1);
                expect(document.querySelector('#img1 img')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#duplicate') as HTMLElement).click();
                    
                    // After duplicate
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Image);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    expect((modelBlocks[1].properties as IImageBlockSettings).src).toBe('https://via.placeholder.com/150');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].querySelector('img')).not.toBeNull();
                    expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].blockType).toBe(BlockType.Image);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    expect((modelBlocks[1].properties as IImageBlockSettings).src).toBe('https://via.placeholder.com/150');
                    expect(domBlocks.length).toBe(2);
                    
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before duplicate
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Image);
                expect((modelBlocks[0].properties as IImageBlockSettings).src).toBe('https://via.placeholder.com/150');
                expect(domBlocks.length).toBe(1);
                expect(document.querySelector('#img1 img')).not.toBeNull();
                
                // Trigger Ctrl+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true }));
                
                // After duplicate
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Image);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect((modelBlocks[1].properties as IImageBlockSettings).src).toBe('https://via.placeholder.com/150');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[1].querySelector('img')).not.toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[1]).toBeUndefined();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(domBlocks.length).toBe(2);
                
                done();
            });
        });
    });
    describe('delete', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('First paragraph');
                expect(domBlocks[1].id).toBe('para2');
                expect(domBlocks[1].textContent).toBe('Second paragraph');
                expect(document.getElementById('para2')).not.toBeNull();
                
                // Open action menu and delete
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('First paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('para2')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[1].id).toBe('para2');
                    expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('First paragraph');
                    expect(domBlocks[1].id).toBe('para2');
                    expect(domBlocks[1].textContent).toBe('Second paragraph');
                    expect(document.getElementById('para2')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('First paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('para2')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].id).toBe('para2');
                expect(domBlocks.length).toBe(2);
                expect(document.getElementById('para2')).not.toBeNull();
                
                // Trigger Ctrl+Shift+D
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('First paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('para2')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('First paragraph');
                expect(domBlocks[1].id).toBe('para2');
                expect(domBlocks[1].textContent).toBe('Second paragraph');
                expect(document.getElementById('para2')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('First paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('para2')).toBeNull();
                
                done();
            });
        });

        describe('Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ contentType: ContentType.Text, content: 'Heading 1' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h1');
                expect(document.getElementById('h1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('h1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('h1');
                    expect(document.getElementById('h1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h1');
                expect(document.getElementById('h1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('h1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h1');
                expect(document.getElementById('h1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ contentType: ContentType.Text, content: 'Heading 2' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Heading 2');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h2');
                expect(document.getElementById('h2')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h2')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('h2');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 2');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('h2');
                    expect(document.getElementById('h2')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h2')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Heading 2');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h2');
                expect(document.getElementById('h2')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('h2')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Heading 2');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h2');
                expect(document.getElementById('h2')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ contentType: ContentType.Text, content: 'Heading 3' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h3');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Heading 3');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h3');
                expect(document.getElementById('h3')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h3')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('h3');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 3');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('h3');
                    expect(document.getElementById('h3')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h3')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h3');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Heading 3');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h3');
                expect(document.getElementById('h3')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('h3')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h3');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Heading 3');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h3');
                expect(document.getElementById('h3')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ contentType: ContentType.Text, content: 'Heading 4' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h4');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                expect(modelBlocks[1].content[0].content).toBe('Heading 4');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h4');
                expect(document.getElementById('h4')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h4')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('h4');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                    expect(modelBlocks[1].content[0].content).toBe('Heading 4');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('h4');
                    expect(document.getElementById('h4')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('h4')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h4');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                expect(modelBlocks[1].content[0].content).toBe('Heading 4');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h4');
                expect(document.getElementById('h4')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('h4')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('h4');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(4);
                expect(modelBlocks[1].content[0].content).toBe('Heading 4');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('h4');
                expect(document.getElementById('h4')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Bullet List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'bullet1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('bullet1');
                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].content[0].content).toBe('Bullet item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('bullet1');
                expect(document.getElementById('bullet1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('bullet1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('bullet1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                    expect(modelBlocks[1].content[0].content).toBe('Bullet item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('bullet1');
                    expect(document.getElementById('bullet1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('bullet1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('bullet1');
                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].content[0].content).toBe('Bullet item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('bullet1');
                expect(document.getElementById('bullet1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('bullet1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('bullet1');
                expect(modelBlocks[1].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].content[0].content).toBe('Bullet item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('bullet1');
                expect(document.getElementById('bullet1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Numbered List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('numbered1');
                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].content[0].content).toBe('Numbered item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('numbered1');
                expect(document.getElementById('numbered1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('numbered1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('numbered1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                    expect(modelBlocks[1].content[0].content).toBe('Numbered item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('numbered1');
                    expect(document.getElementById('numbered1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('numbered1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('numbered1');
                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].content[0].content).toBe('Numbered item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('numbered1');
                expect(document.getElementById('numbered1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('numbered1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('numbered1');
                expect(modelBlocks[1].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].content[0].content).toBe('Numbered item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('numbered1');
                expect(document.getElementById('numbered1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'check1', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('check1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                expect(modelBlocks[1].content[0].content).toBe('Checklist item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('check1');
                expect(document.getElementById('check1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('check1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('check1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                    expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                    expect(modelBlocks[1].content[0].content).toBe('Checklist item');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('check1');
                    expect(document.getElementById('check1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('check1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('check1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                expect(modelBlocks[1].content[0].content).toBe('Checklist item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('check1');
                expect(document.getElementById('check1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('check1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('check1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Checklist);
                expect((modelBlocks[1].properties as IChecklistBlockSettings).isChecked).toBe(false);
                expect(modelBlocks[1].content[0].content).toBe('Checklist item');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('check1');
                expect(document.getElementById('check1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Quote block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    {
                        id: 'quote1', blockType: BlockType.Quote,
                        properties: {
                            children: [{
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'Quote text' }]
                            }]
                        }
                    }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('quote1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('quote1');
                expect(document.getElementById('quote1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('quote1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('quote1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                    expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                    expect(domBlocks.length).toBe(3);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('quote1');
                    expect(document.getElementById('quote1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('quote1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('quote1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('quote1');
                expect(document.getElementById('quote1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[2]).toBeUndefined();
                expect(document.getElementById('quote1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('quote1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
                expect((modelBlocks[1].properties as BaseChildrenProp).children[0].content[0].content).toBe('Quote text');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('quote1');
                expect(document.getElementById('quote1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Code block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ contentType: ContentType.Text, content: 'const x = 10;' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('code1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('code1');
                expect(document.getElementById('code1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('code1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('code1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                    expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('code1');
                    expect(document.getElementById('code1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('code1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('code1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('code1');
                expect(document.getElementById('code1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('code1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('code1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                expect(modelBlocks[1].content[0].content).toBe('const x = 10;');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('code1');
                expect(document.getElementById('code1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Collapsible Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'collapsePara1', blockType: BlockType.CollapsibleParagraph, content: [{ contentType: ContentType.Text, content: 'Collapsible Para' }], properties: { isExpanded: true, children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapsePara1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapsePara1');
                expect(document.getElementById('collapsePara1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapsePara1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('collapsePara1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('collapsePara1');
                    expect(document.getElementById('collapsePara1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapsePara1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapsePara1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapsePara1');
                expect(document.getElementById('collapsePara1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('collapsePara1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapsePara1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleParagraph);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible Para');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapsePara1');
                expect(document.getElementById('collapsePara1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Collapsible Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'collapseH1', blockType: BlockType.CollapsibleHeading, content: [{ contentType: ContentType.Text, content: 'Collapsible H1' }], properties: { level: 1, isExpanded: true, children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapseH1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapseH1');
                expect(document.getElementById('collapseH1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH1')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1].id).toBe('collapseH1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1].id).toBe('collapseH1');
                    expect(document.getElementById('collapseH1')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[0].textContent).toBe('Paragraph');
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH1')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapseH1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapseH1');
                expect(document.getElementById('collapseH1')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('collapseH1')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapseH1');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(1);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings).isExpanded).toBe(true);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H1');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(domBlocks[1].id).toBe('collapseH1');
                expect(document.getElementById('collapseH1')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[0].textContent).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Collapsible Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'collapseH2', blockType: BlockType.CollapsibleHeading, content: [{ contentType: ContentType.Text, content: 'Collapsible H2' }], properties: { level: 2, isExpanded: true, children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1].id).toBe('collapseH2');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('collapseH2');
                expect(document.getElementById('collapseH2')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks.length).toBe(1);
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH2')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].id).toBe('collapseH2');
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                    expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                    expect(domBlocks.length).toBe(2);
                    expect(domBlocks[1].id).toBe('collapseH2');
                    expect(document.getElementById('collapseH2')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH2')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].id).toBe('collapseH2');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H2');
                expect(domBlocks.length).toBe(2);
                expect(document.getElementById('collapseH2')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                // After delete
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].content[0].content).toBe('Paragraph');
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks[1]).toBeUndefined();
                expect(document.getElementById('collapseH2')).toBeNull();
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(2);
                expect(document.getElementById('collapseH2')).not.toBeNull();
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(domBlocks[1]).toBeUndefined();
                
                done();
            });
        });

        describe('Collapsible Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'collapseH3', blockType: BlockType.CollapsibleHeading, content: [{ contentType: ContentType.Text, content: 'Collapsible H3' }], properties: { level: 3, isExpanded: true, children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before delete
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[1].id).toBe('collapseH3');
                expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                expect(modelBlocks[1].content[0].content).toBe('Collapsible H3');
                expect(domBlocks.length).toBe(2);
                expect(document.getElementById('collapseH3')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    // After delete
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(domBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH3')).toBeNull();
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(2);
                    expect(modelBlocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((modelBlocks[1].properties as ICollapsibleBlockSettings & IHeadingBlockSettings).level).toBe(3);
                    expect(document.getElementById('collapseH3')).not.toBeNull();
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH3')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                let modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(2);
                expect(document.getElementById('collapseH3')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[1]).toBeUndefined();
                expect(document.getElementById('collapseH3')).toBeNull();
                
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('collapseH3')).not.toBeNull();
                
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                expect(document.getElementById('collapseH3')).toBeNull();
                
                done();
            });
        });

        describe('Collapsible Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'collapseH4', blockType: BlockType.CollapsibleHeading, content: [{ contentType: ContentType.Text, content: 'Collapsible H4' }], properties: { level: 4, isExpanded: true, children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                let modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(2);
                expect(document.getElementById('collapseH4')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    modelBlocks = editor.blocks;
                    expect(modelBlocks.length).toBe(1);
                    expect(modelBlocks[1]).toBeUndefined();
                    expect(document.getElementById('collapseH4')).toBeNull();
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks.length).toBe(2);
                    expect(document.getElementById('collapseH4')).not.toBeNull();
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks.length).toBe(1);
                    expect(document.getElementById('collapseH4')).toBeNull();
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('collapseH4')).not.toBeNull();
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks.length).toBe(1);
                expect(document.getElementById('collapseH4')).toBeNull();
                
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('collapseH4')).not.toBeNull();
                
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                
                done();
            });
        });

        describe('Callout block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'callout1', blockType: BlockType.Callout, properties: { children: [{ id: 'callout-child', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Callout content' }] }] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('callout1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    expect(editor.blocks.length).toBe(1);
                    expect(document.getElementById('callout1')).toBeNull();
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks.length).toBe(2);
                    expect(document.getElementById('callout1')).not.toBeNull();
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks.length).toBe(1);
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks.length).toBe(2);
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks.length).toBe(1);
                expect(document.getElementById('callout1')).toBeNull();
                
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                
                done();
            });
        });

        describe('Divider block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'divider1', blockType: BlockType.Divider }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('divider1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    expect(editor.blocks.length).toBe(1);
                    expect(document.getElementById('divider1')).toBeNull();
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks.length).toBe(2);
                    expect(document.getElementById('divider1')).not.toBeNull();
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks.length).toBe(1);
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks.length).toBe(2);
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks.length).toBe(1);
                expect(document.getElementById('divider1')).toBeNull();
                
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                
                done();
            });
        });

        describe('Image block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Paragraph' }] },
                    { id: 'img1', blockType: BlockType.Image, properties: { src: 'https://via.placeholder.com/150', alt: 'Test image' } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks.length).toBe(2);
                expect(document.getElementById('img1')).not.toBeNull();
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#delete') as HTMLElement).click();
                    
                    expect(editor.blocks.length).toBe(1);
                    expect(document.getElementById('img1')).toBeNull();
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks.length).toBe(2);
                    expect(document.getElementById('img1')).not.toBeNull();
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks.length).toBe(1);
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+D)', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks.length).toBe(2);
                
                 editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD', key: 'D', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks.length).toBe(1);
                expect(document.getElementById('img1')).toBeNull();
                
                triggerUndo(editorElement);
                expect(editor.blocks.length).toBe(2);
                
                triggerRedo(editorElement);
                expect(editor.blocks.length).toBe(1);
                
                done();
            });
        });
    });
    describe('moveup', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] },
                    { id: 'para3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Third paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before moveup
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(modelBlocks[2].id).toBe('para3');
                expect(modelBlocks[2].content[0].content).toBe('Third paragraph');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('para2');
                expect(domBlocks[2].id).toBe('para3');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    // After moveup
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('para2');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
                    expect(modelBlocks[1].id).toBe('para1');
                    expect(modelBlocks[1].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[2].id).toBe('para3');
                    expect(modelBlocks[2].content[0].content).toBe('Third paragraph');
                    expect(domBlocks.length).toBe(3);
                    expect(domBlocks[0].id).toBe('para2');
                    expect(domBlocks[1].id).toBe('para1');
                    expect(domBlocks[2].id).toBe('para3');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[0].content[0].content).toBe('First paragraph');
                    expect(modelBlocks[1].id).toBe('para2');
                    expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                    expect(modelBlocks[2].id).toBe('para3');
                    expect(domBlocks.length).toBe(3);
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[1].id).toBe('para2');
                    expect(domBlocks[2].id).toBe('para3');
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('para2');
                    expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
                    expect(modelBlocks[1].id).toBe('para1');
                    expect(modelBlocks[2].id).toBe('para3');
                    expect(domBlocks[0].id).toBe('para2');
                    expect(domBlocks[1].id).toBe('para1');
                    expect(domBlocks[2].id).toBe('para3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before moveup
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(modelBlocks[2].id).toBe('para3');
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('para2');
                expect(domBlocks[2].id).toBe('para3');
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                // After moveup
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para2');
                expect(modelBlocks[0].content[0].content).toBe('Second paragraph');
                expect(modelBlocks[1].id).toBe('para1');
                expect(modelBlocks[2].id).toBe('para3');
                expect(domBlocks[0].id).toBe('para2');
                expect(domBlocks[1].id).toBe('para1');
                expect(domBlocks[2].id).toBe('para3');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[2].id).toBe('para3');
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('para2');
                
                // Redo
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para2');
                expect(modelBlocks[1].id).toBe('para1');
                expect(modelBlocks[2].id).toBe('para3');
                
                done();
            });
        });

        describe('Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ contentType: ContentType.Text, content: 'Heading 1' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before moveup
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(1);
                expect(modelBlocks[1].content[0].content).toBe('Heading 1');
                expect(modelBlocks[2].id).toBe('para2');
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('h1');
                expect(domBlocks[2].id).toBe('para2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    // After moveup
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('h1');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                    expect(modelBlocks[0].content[0].content).toBe('Heading 1');
                    expect(modelBlocks[1].id).toBe('para1');
                    expect(modelBlocks[2].id).toBe('para2');
                    expect(domBlocks[0].id).toBe('h1');
                    expect(domBlocks[1].id).toBe('para1');
                    expect(domBlocks[2].id).toBe('para2');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[1].id).toBe('h1');
                    expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                    expect(modelBlocks[2].id).toBe('para2');
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[1].id).toBe('h1');
                    
                    // Redo
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    expect(modelBlocks[0].id).toBe('h1');
                    expect(modelBlocks[1].id).toBe('para1');
                    expect(modelBlocks[2].id).toBe('para2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before moveup
                let modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect(modelBlocks[2].id).toBe('para2');
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                // After moveup
                modelBlocks = editor.blocks;
                expect(modelBlocks[0].id).toBe('h1');
                expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                expect(modelBlocks[1].id).toBe('para1');
                expect(modelBlocks[2].id).toBe('para2');
                
                // Undo
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[2].id).toBe('para2');
                
                // Redo
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('h1');
                expect(editor.blocks[1].id).toBe('para1');
                
                done();
            });
        });

        describe('Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ contentType: ContentType.Text, content: 'Heading 2' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                let modelBlocks = editor.blocks;
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('h2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(2);
                expect(modelBlocks[2].id).toBe('para2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    modelBlocks = editor.blocks;
                    expect(modelBlocks[0].id).toBe('h2');
                    expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                    expect(modelBlocks[1].id).toBe('para1');
                    expect(modelBlocks[2].id).toBe('para2');
                    
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[1].id).toBe('h2');
                    expect(modelBlocks[2].id).toBe('para2');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('h2');
                    expect(editor.blocks[1].id).toBe('para1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                let modelBlocks = editor.blocks;
                expect(modelBlocks[1].id).toBe('h2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                modelBlocks = editor.blocks;
                expect(modelBlocks[0].id).toBe('h2');
                expect(modelBlocks[1].id).toBe('para1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h2');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('h2');
                
                done();
            });
        });

        describe('Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ contentType: ContentType.Text, content: 'Heading 3' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                let modelBlocks = editor.blocks;
                expect(modelBlocks[1].id).toBe('h3');
                expect((modelBlocks[1].properties as IHeadingBlockSettings).level).toBe(3);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('h3');
                    expect(editor.blocks[1].id).toBe('para1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h3');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('h3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks[1].id).toBe('h3');
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('h3');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h3');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('h3');
                
                done();
            });
        });

        describe('Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ contentType: ContentType.Text, content: 'Heading 4' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('h4');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('h4');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h4');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('h4');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('h4');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h4');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('h4');
                
                done();
            });
        });

        describe('Bullet List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'bullet1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('bullet1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('bullet1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('bullet1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('bullet1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('bullet1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('bullet1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('bullet1');
                
                done();
            });
        });

        describe('Numbered List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('numbered1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('numbered1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('numbered1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('numbered1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('numbered1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('numbered1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('numbered1');
                
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'check1', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('check1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('check1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('check1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('check1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('check1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('check1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('check1');
                
                done();
            });
        });

        describe('Quote block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    {
                        id: 'quote1', blockType: BlockType.Quote,
                        properties: {
                            children: [{
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'Quote text' }]
                            }]
                        }
                    },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('quote1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('quote1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('quote1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('quote1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('quote1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('quote1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('quote1');
                
                done();
            });
        });

        describe('Code block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ contentType: ContentType.Text, content: 'const x = 10;' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('code1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('code1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('code1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('code1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('code1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('code1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('code1');
                
                done();
            });
        });

        describe('Collapsible Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapsePara1', blockType: BlockType.CollapsibleParagraph, properties: { isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible Para' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('collapsePara1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('collapsePara1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapsePara1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('collapsePara1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('collapsePara1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapsePara1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('collapsePara1');
                
                done();
            });
        });

        describe('Collapsible Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH1', blockType: BlockType.CollapsibleHeading, properties: { level: 1, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H1' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('collapseH1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('collapseH1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('collapseH1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('collapseH1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('collapseH1');
                
                done();
            });
        });

        describe('Collapsible Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH2', blockType: BlockType.CollapsibleHeading, properties: { level: 2, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H2' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('collapseH2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('collapseH2');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH2');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('collapseH2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('collapseH2');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH2');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('collapseH2');
                
                done();
            });
        });

        describe('Collapsible Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH3', blockType: BlockType.CollapsibleHeading, properties: { level: 3, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H3' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('collapseH3');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('collapseH3');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH3');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('collapseH3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('collapseH3');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH3');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('collapseH3');
                
                done();
            });
        });

        describe('Collapsible Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH4', blockType: BlockType.CollapsibleHeading, properties: { level: 4, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H4' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('collapseH4');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('collapseH4');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH4');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('collapseH4');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('collapseH4');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH4');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('collapseH4');
                
                done();
            });
        });

        describe('Callout block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'callout1', blockType: BlockType.Callout, properties: { children: [{ id: 'callout-child', blockType: BlockType.Paragraph, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'Callout content' }] }] } },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('callout1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('callout1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('callout1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('callout1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('callout1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('callout1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('callout1');
                
                done();
            });
        });

        describe('Divider block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'divider1', blockType: BlockType.Divider },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('divider1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('divider1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('divider1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('divider1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('divider1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('divider1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('divider1');
                
                done();
            });
        });

        describe('Image block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'img1', blockType: BlockType.Image, properties: { src: 'https://via.placeholder.com/150', alt: 'Test image' } },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('img1');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#moveup') as HTMLElement).click();
                    
                    expect(editor.blocks[0].id).toBe('img1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('img1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].id).toBe('img1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowUp)', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[0].id).toBe('img1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('img1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[0].id).toBe('img1');
                
                done();
            });
        });
    });
    describe('movedown', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] },
                    { id: 'para3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Third paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                // Before movedown
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].id).toBe('para1');
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[1].content[0].content).toBe('Second paragraph');
                expect(modelBlocks[2].id).toBe('para3');
                expect(domBlocks[0].id).toBe('para1');
                expect(domBlocks[1].id).toBe('para2');
                expect(domBlocks[2].id).toBe('para3');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    // After movedown
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                    expect(modelBlocks.length).toBe(3);
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[1].id).toBe('para3');
                    expect(modelBlocks[2].id).toBe('para2');
                    expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    expect(modelBlocks[2].content[0].content).toBe('Second paragraph');
                    expect(domBlocks[0].id).toBe('para1');
                    expect(domBlocks[1].id).toBe('para3');
                    expect(domBlocks[2].id).toBe('para2');
                    
                    // Undo
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks;
                    expect(modelBlocks[0].id).toBe('para1');
                    expect(modelBlocks[1].id).toBe('para2');
                    expect(modelBlocks[2].id).toBe('para3');
                    
                    // Redo
                    triggerRedo(editorElement);
                    expect(editor.blocks[1].id).toBe('para3');
                    expect(editor.blocks[2].id).toBe('para2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#para2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                // Before movedown
                let modelBlocks = editor.blocks;
                expect(modelBlocks[1].id).toBe('para2');
                expect(modelBlocks[1].blockType).toBe(BlockType.Paragraph);
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                // After movedown
                modelBlocks = editor.blocks;
                expect(modelBlocks[1].id).toBe('para3');
                expect(modelBlocks[2].id).toBe('para2');
                
                // Undo
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('para2');
                
                // Redo
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('para2');
                
                done();
            });
        });

        describe('Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ contentType: ContentType.Text, content: 'Heading 1' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                let modelBlocks = editor.blocks;
                expect(modelBlocks[1].id).toBe('h1');
                expect(modelBlocks[1].blockType).toBe(BlockType.Heading);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    modelBlocks = editor.blocks;
                    expect(modelBlocks[1].id).toBe('para2');
                    expect(modelBlocks[2].id).toBe('h1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('h1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                expect(editor.blocks[1].id).toBe('h1');
                
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('h1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('h1');
                
                done();
            });
        });

        describe('Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ contentType: ContentType.Text, content: 'Heading 2' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                expect(editor.blocks[1].id).toBe('h2');
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('h2');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h2');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('h2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('h2');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h2');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('h2');
                
                done();
            });
        });

        describe('Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ contentType: ContentType.Text, content: 'Heading 3' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('h3');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h3');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('h3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('h3');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h3');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('h3');
                
                done();
            });
        });

        describe('Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ contentType: ContentType.Text, content: 'Heading 4' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('h4');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('h4');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('h4');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('h4');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('h4');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('h4');
                
                done();
            });
        });

        describe('Bullet List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'bullet1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('bullet1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('bullet1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('bullet1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('bullet1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('bullet1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('bullet1');
                
                done();
            });
        });

        describe('Numbered List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('numbered1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('numbered1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('numbered1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('numbered1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('numbered1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('numbered1');
                
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'check1', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('check1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('check1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('check1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('check1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('check1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('check1');
                
                done();
            });
        });

        describe('Quote block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    {
                        id: 'quote1', blockType: BlockType.Quote,
                        properties: {
                            children: [{
                                blockType: BlockType.Paragraph,
                                content: [{ contentType: ContentType.Text, content: 'Quote text' }]
                            }]
                        }
                    },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('quote1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('quote1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('quote1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('quote1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('quote1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('quote1');
                
                done();
            });
        });

        describe('Code block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ contentType: ContentType.Text, content: 'const x = 10;' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('code1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('code1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('code1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('code1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('code1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('code1');
                
                done();
            });
        });

        describe('Collapsible Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapsePara1', blockType: BlockType.CollapsibleParagraph, properties: { isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible Para' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('collapsePara1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapsePara1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('collapsePara1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('collapsePara1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapsePara1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('collapsePara1');
                
                done();
            });
        });

        describe('Collapsible Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH1', blockType: BlockType.CollapsibleHeading, properties: { level: 1, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H1' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('collapseH1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('collapseH1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('collapseH1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('collapseH1');
                
                done();
            });
        });

        describe('Collapsible Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH2', blockType: BlockType.CollapsibleHeading, properties: { level: 2, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H2' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('collapseH2');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH2');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('collapseH2');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('collapseH2');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH2');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('collapseH2');
                
                done();
            });
        });

        describe('Collapsible Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH3', blockType: BlockType.CollapsibleHeading, properties: { level: 3, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H3' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('collapseH3');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH3');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('collapseH3');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('collapseH3');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH3');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('collapseH3');
                
                done();
            });
        });

        describe('Collapsible Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'collapseH4', blockType: BlockType.CollapsibleHeading, properties: { level: 4, isExpanded: true, children: [] }, content: [{ contentType: ContentType.Text, content: 'Collapsible H4' }] },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('collapseH4');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('collapseH4');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('collapseH4');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('collapseH4');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('collapseH4');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('collapseH4');
                
                done();
            });
        });

        describe('Callout block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'callout1', blockType: BlockType.Callout, properties: { children: [{ id: 'callout-child', blockType: BlockType.Paragraph, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'Callout content' }] }] } },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('callout1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('callout1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('callout1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('callout1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('callout1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('callout1');
                
                done();
            });
        });

        describe('Divider block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'divider1', blockType: BlockType.Divider },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('divider1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('divider1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('divider1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('divider1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('divider1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('divider1');
                
                done();
            });
        });

        describe('Image block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'First paragraph' }] },
                    { id: 'img1', blockType: BlockType.Image, properties: { src: 'https://via.placeholder.com/150', alt: 'Test image' } },
                    { id: 'para2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Second paragraph' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                    editor = undefined;
                }
                remove(editorElement);
            });

            it('UI check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                
                const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
                dragIcon.click();
                
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-blockaction-popup');
                    (popup.querySelector('#movedown') as HTMLElement).click();
                    
                    expect(editor.blocks[2].id).toBe('img1');
                    
                    triggerUndo(editorElement);
                    expect(editor.blocks[1].id).toBe('img1');
                    
                    triggerRedo(editorElement);
                    expect(editor.blocks[2].id).toBe('img1');
                    
                    done();
                }, 200);
            });

            it('Keyboard check (Ctrl+Shift+ArrowDown)', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                triggerMouseMove(blockElement, 10, 10);
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true, shiftKey: true }));
                
                expect(editor.blocks[2].id).toBe('img1');
                
                triggerUndo(editorElement);
                expect(editor.blocks[1].id).toBe('img1');
                
                triggerRedo(editorElement);
                expect(editor.blocks[2].id).toBe('img1');
                
                done();
            });
        });
    });
});