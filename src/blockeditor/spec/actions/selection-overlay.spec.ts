import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor } from '../../src/index';
import { createEditor } from '../common/util.spec';
import { BlockType, ContentType } from '../../src/models/enums';
import { getBlockContentElement } from '../../src/common/utils/index';
import { setCursorPosition } from '../../src/common/utils/selection';

function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
    const ev = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
    node.dispatchEvent(ev);
}

function getModelIds(ed: BlockEditor): string[] {
    return ed.blocks.map(b => b.id);
}

describe('Selection Overlay actions', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    afterEach(() => {
        if (editor) { editor.destroy(); editor = undefined as any; }
        if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
    });

    const buildEditor = (blocks?: any[]): void => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        editor = createEditor({
            blocks: blocks || [
                { id: 'divider1', blockType: BlockType.Divider, content: [] },
                { id: 'p1', blockType: BlockType.Paragraph, content: [ { contentType: ContentType.Text, content: 'Hello' } ] },
                { id: 'p2', blockType: BlockType.Paragraph, content: [ { contentType: ContentType.Text, content: 'World' } ] },
            ]
        });
        editor.appendTo('#editor');
    };

    // 1
    it('Backspace at start with previous special block shows overlay and sets selectionOverlayInfo', (done) => {
        buildEditor();
        const textBlock = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(textBlock);
        const content = getBlockContentElement(textBlock);
        setCursorPosition(content, 0);

        const prevSpecial = editor.element.querySelector('#divider1') as HTMLElement;
        expect(prevSpecial).not.toBeNull();

        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe('divider1');
            //Dom assertion
            const domBlocks1 = editor.element.querySelectorAll('.e-block');
            expect(domBlocks1.length).toBe(3);
            expect(editor.element.querySelector('#divider1')).not.toBeNull();
            expect(editor.element.querySelector('#p1')).not.toBeNull();
            expect(editor.element.querySelector('#p2')).not.toBeNull();

            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');

            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).not.toBeNull();
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo.element.id).toBe('divider1');
            done();
        }, 2000);
    });

    // 2
    it('Second Backspace deletes soft-selected block and hides overlay', (done) => {
        buildEditor();
        const p1 = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(p1);
        setCursorPosition(getBlockContentElement(p1), 0);
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay.style.display).toBe('block');
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
            setTimeout(() => {
                const modelBlocks = editor.blocks;
                const domDivider = editor.element.querySelector('#divider1');
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                //Model assertion
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('p1');
                expect(modelBlocks[1].id).toBe('p2');
                //Dom assertion
                expect(domDivider).toBeNull();
                const domBlocks2 = editor.element.querySelectorAll('.e-block');
                expect(domBlocks2.length).toBe(2);
                expect((domBlocks2[0] as HTMLElement).id).toBe('p1');
                expect((domBlocks2[1] as HTMLElement).id).toBe('p2');
                //Overlay state
                expect(overlay.style.display).toBe('none');
                expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
                done();
            }, 50);
        }, 30);
    });

    // 3
    it('Backspace at start with previous normal block merges without overlay', (done) => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        editor = createEditor({
            blocks: [
                { id: 'p1', blockType: BlockType.Paragraph, content: [ { contentType: ContentType.Text, content: 'Hello' } ] },
                { id: 'p2', blockType: BlockType.Paragraph, content: [ { contentType: ContentType.Text, content: ' World' } ] }
            ]
        });
        editor.appendTo('#editor');

        const p2 = editor.element.querySelector('#p2') as HTMLElement;
        editor.blockManager.setFocusToBlock(p2);
        setCursorPosition(getBlockContentElement(p2), 0);
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));

        setTimeout(() => {
            //Dom assertion
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            if (overlay) { expect(overlay.style.display).not.toBe('block'); }
            const domBlocks = editor.element.querySelectorAll('.e-block');
            expect(domBlocks.length).toBe(1);
            expect((domBlocks[0] as HTMLElement).id).toBe('p1');
            expect(domBlocks[0].textContent).toBe('Hello World');
            //Model assertion
            const modelBlocks = editor.blocks;
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].id).toBe('p1');
            expect(modelBlocks[0].content[0].content).toBe('Hello World');
            done();
        }, 50);
    });

    // 4
    it('Drag icon click sets overlay and opens action menu', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);

        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        expect(dragIcon).not.toBeNull();
        dragIcon.click();

        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
            //Dom assertion
            expect(dragIcon.classList.contains('e-drag-icon-selected')).toBe(true);
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe('p1');
            const domBlocks3 = editor.element.querySelectorAll('.e-block');
            expect(domBlocks3.length).toBe(3);
            expect((domBlocks3[0] as HTMLElement).id).toBe('divider1');
            expect((domBlocks3[1] as HTMLElement).id).toBe('p1');
            expect((domBlocks3[2] as HTMLElement).id).toBe('p2');
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');
            //selectionOverlayInfo
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).not.toBeNull();
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo.element.id).toBe('p1');
            done();
        }, 150);
    });

    it('Drag icon click sets overlay and opens action menu when rtl enabled', (done) => {
        buildEditor();
        editor.enableRtl = true;
        editor.dataBind();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);

        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        expect(dragIcon).not.toBeNull();
        dragIcon.click();

        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
            //Dom assertion
            expect(dragIcon.classList.contains('e-drag-icon-selected')).toBe(true);
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe('p1');
            const domBlocks3 = editor.element.querySelectorAll('.e-block');
            expect(domBlocks3.length).toBe(3);
            expect((domBlocks3[0] as HTMLElement).id).toBe('divider1');
            expect((domBlocks3[1] as HTMLElement).id).toBe('p1');
            expect((domBlocks3[2] as HTMLElement).id).toBe('p2');
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');
            //selectionOverlayInfo
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).not.toBeNull();
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo.element.id).toBe('p1');
            done();
        }, 150);
    });

    // 5
    it('Action menu delete removes block and clears overlay/selectionOverlayInfo', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();

        setTimeout(() => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
            (popup.querySelector('#delete') as HTMLElement).click();
            setTimeout(() => {
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                const domTarget = editor.element.querySelector('#p1');
                const modelBlocks = editor.blocks;
                //Model assertion
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].id).toBe('divider1');
                expect(modelBlocks[1].id).toBe('p2');
                //Dom assertion
                expect(domTarget).toBeNull();
                const domBlocks4 = editor.element.querySelectorAll('.e-block');
                expect(domBlocks4.length).toBe(2);
                expect((domBlocks4[0] as HTMLElement).id).toBe('divider1');
                expect((domBlocks4[1] as HTMLElement).id).toBe('p2');
                done();
            }, 120);
        }, 150);
    });

    // 6
    it('Undo after Backspace deletion restores block and overlay', (done) => {
        buildEditor();
        const p1 = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(p1);
        setCursorPosition(getBlockContentElement(p1), 0);
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
            setTimeout(() => {
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    const restored = editor.element.querySelector('#divider1') as HTMLElement;
                    const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                    //Dom assertion
                    expect(restored).not.toBeNull();
                    expect(overlay).not.toBeNull();
                    expect(overlay.style.display).toBe('block');
                    expect(overlay.getAttribute('data-target-id')).toBe('divider1');
                    const domBlocks5 = editor.element.querySelectorAll('.e-block');
                    expect(domBlocks5.length).toBe(3);
                    expect((domBlocks5[0] as HTMLElement).id).toBe('divider1');
                    expect((domBlocks5[1] as HTMLElement).id).toBe('p1');
                    expect((domBlocks5[2] as HTMLElement).id).toBe('p2');
                    //Model assertion
                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('divider1');
                    expect(editor.blocks[1].id).toBe('p1');
                    expect(editor.blocks[2].id).toBe('p2');
                    done();
                }, 120);
            }, 60);
        }, 40);
    });

    // 7
    it('Redo after undo removes block again and hides overlay', (done) => {
        buildEditor();
        const p1 = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(p1);
        setCursorPosition(getBlockContentElement(p1), 0);
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
            setTimeout(() => {
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
                    setTimeout(() => {
                        const domDivider = editor.element.querySelector('#divider1');
                        const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                        //Dom assertion
                        expect(domDivider).toBeNull();
                        if (overlay) { expect(overlay.style.display).toBe('none'); }
                        const domBlocks6 = editor.element.querySelectorAll('.e-block');
                        expect(domBlocks6.length).toBe(2);
                        expect((domBlocks6[0] as HTMLElement).id).toBe('p1');
                        expect((domBlocks6[1] as HTMLElement).id).toBe('p2');
                        //Model assertion
                        expect(editor.blocks.length).toBe(2);
                        expect(editor.blocks[0].id).toBe('p1');
                        expect(editor.blocks[1].id).toBe('p2');
                        done();
                    }, 120);
                }, 100);
            }, 50);
        }, 40);
    });

    // 8
    it('Document click outside clears overlay and drag icon selection', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();
        setTimeout(() => {
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            setTimeout(() => {
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                //Dom assertion
                if (overlay) { expect(overlay.style.display).toBe('none'); }
                const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
                if (popup) { expect(popup.classList.contains('e-popup-open')).toBe(false); }
                expect(dragIcon.classList.contains('e-drag-icon-selected')).toBe(false);
                const domBlocks7 = editor.element.querySelectorAll('.e-block');
                expect(domBlocks7.length).toBe(3);
                expect((domBlocks7[0] as HTMLElement).id).toBe('divider1');
                expect((domBlocks7[1] as HTMLElement).id).toBe('p1');
                expect((domBlocks7[2] as HTMLElement).id).toBe('p2');
                //Model assertion
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].id).toBe('divider1');
                expect(editor.blocks[1].id).toBe('p1');
                expect(editor.blocks[2].id).toBe('p2');
                expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
                done();
            }, 50);
        }, 120);
    });

    // 9
    it('Mouseup inside editor clears overlay', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();
        setTimeout(() => {
            editor.element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            setTimeout(() => {
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                //Dom assertion
                if (overlay) { expect(overlay.style.display).toBe('none'); }
                const domBlocks8 = editor.element.querySelectorAll('.e-block');
                expect(domBlocks8.length).toBe(3);
                expect((domBlocks8[0] as HTMLElement).id).toBe('divider1');
                expect((domBlocks8[1] as HTMLElement).id).toBe('p1');
                expect((domBlocks8[2] as HTMLElement).id).toBe('p2');
                //Model assertion
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].id).toBe('divider1');
                expect(editor.blocks[1].id).toBe('p1');
                expect(editor.blocks[2].id).toBe('p2');
                expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
                done();
            }, 40);
        }, 120);
    });

    // 10
    it('Arrow key clears overlay', (done) => {
        buildEditor();
        const textBlock = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(textBlock);
        const content = getBlockContentElement(textBlock);
        setCursorPosition(content, 0);

        const prevSpecial = editor.element.querySelector('#divider1') as HTMLElement;
        expect(prevSpecial).not.toBeNull();

        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe('divider1');
            //Dom assertion
            const domBlocks1 = editor.element.querySelectorAll('.e-block');
            expect(domBlocks1.length).toBe(3);
            expect(editor.element.querySelector('#divider1')).not.toBeNull();
            expect(editor.element.querySelector('#p1')).not.toBeNull();
            expect(editor.element.querySelector('#p2')).not.toBeNull();

            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');

            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).not.toBeNull();
            expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo.element.id).toBe('divider1');
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', ctrlKey: true  }));
            setTimeout(() => {
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                //Dom assertion
                if (overlay) { expect(overlay.style.display).toBe('none'); }
                const domBlocks9 = editor.element.querySelectorAll('.e-block');
                expect(domBlocks9.length).toBe(3);
                expect((domBlocks9[0] as HTMLElement).id).toBe('divider1');
                expect((domBlocks9[1] as HTMLElement).id).toBe('p1');
                expect((domBlocks9[2] as HTMLElement).id).toBe('p2');
                //Model assertion
                expect(editor.blocks.length).toBe(3);
                expect(editor.blocks[0].id).toBe('divider1');
                expect(editor.blocks[1].id).toBe('p1');
                expect(editor.blocks[2].id).toBe('p2');
                expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
                done();
            }, 40);
        }, 50);
    });

    // 11
    it('Input clears overlay', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();
        setTimeout(() => {
            editor.element.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                if (overlay) { expect(overlay.style.display).toBe('none'); }
                expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
                done();
            }, 40);
        }, 120);
    });

    // 12
    it('Window resize triggers overlay reposition', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        const spy = spyOn((editor.blockManager as any).selectionOverlay, 'reposition').and.callThrough();
        (editor.blockManager as any).selectionOverlay.show('p1');
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            //Dom assertion
            expect(overlay).not.toBeNull();
            expect(overlay.getAttribute('data-target-id')).toBe('p1');
            const domBlocks10 = editor.element.querySelectorAll('.e-block');
            expect(domBlocks10.length).toBe(3);
            expect((domBlocks10[0] as HTMLElement).id).toBe('divider1');
            expect((domBlocks10[1] as HTMLElement).id).toBe('p1');
            expect((domBlocks10[2] as HTMLElement).id).toBe('p2');
            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');
            done();
        }, 50);
    });

    // 13
    it('Destroy overlay removes DOM and show recreates it', (done) => {
        buildEditor();
        (editor.blockManager as any).selectionOverlay.show('p1');
        let overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
        //Dom assertion
        expect(overlay).not.toBeNull();
        (editor.blockManager as any).selectionOverlay.destroy();
        overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).toBeNull();
        (editor.blockManager as any).selectionOverlay.show('p1');
        setTimeout(() => {
            const recreated = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(recreated).not.toBeNull();
            expect(recreated.style.display).toBe('block');
            //Model assertion
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[0].id).toBe('divider1');
            expect(editor.blocks[1].id).toBe('p1');
            expect(editor.blocks[2].id).toBe('p2');
            done();
        }, 40);
    });

    // 14
    it('EventAction.destroy clears overlay', () => {
        buildEditor();
        (editor.blockManager as any).selectionOverlay.show('p1');
        const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        (editor.blockManager as any).eventAction.destroy();
        //Dom assertion
        const after = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
        if (after) { expect(after.style.display).toBe('none'); }
        const domBlocks11 = editor.element.querySelectorAll('.e-block');
        expect(domBlocks11.length).toBe(3);
        expect((domBlocks11[0] as HTMLElement).id).toBe('divider1');
        expect((domBlocks11[1] as HTMLElement).id).toBe('p1');
        expect((domBlocks11[2] as HTMLElement).id).toBe('p2');
        //Model assertion
        expect(editor.blocks.length).toBe(3);
        expect(editor.blocks[0].id).toBe('divider1');
        expect(editor.blocks[1].id).toBe('p1');
        expect(editor.blocks[2].id).toBe('p2');
        expect((editor.blockManager as any).selectionOverlay.selectionOverlayInfo).toBeNull();
    });

    // 15
    it('Drag delete then undo restores block and overlay', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();
        setTimeout(() => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
            (popup.querySelector('#delete') as HTMLElement).click();
            setTimeout(() => {
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    const restored = editor.element.querySelector('#p1') as HTMLElement;
                    const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                    expect(restored).not.toBeNull();
                    //Dom assertion
                    expect(overlay).not.toBeNull();
                    expect(overlay.style.display).toBe('block');
                    expect(overlay.getAttribute('data-target-id')).toBe('p1');
                    const domBlocks12 = editor.element.querySelectorAll('.e-block');
                    expect(domBlocks12.length).toBe(3);
                    expect((domBlocks12[0] as HTMLElement).id).toBe('divider1');
                    expect((domBlocks12[1] as HTMLElement).id).toBe('p1');
                    expect((domBlocks12[2] as HTMLElement).id).toBe('p2');
                    //Model assertion
                    expect(editor.blocks.length).toBe(3);
                    expect(editor.blocks[0].id).toBe('divider1');
                    expect(editor.blocks[1].id).toBe('p1');
                    expect(editor.blocks[2].id).toBe('p2');
                    done();
                }, 120);
            }, 120);
        }, 150);
    });

    // 16
    it('Redo after 15 removes block and hides overlay', (done) => {
        buildEditor();
        const target = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(target);
        editor.blockManager.currentHoveredBlock = target;
        triggerMouseMove(target, 10, 10);
        const dragIcon = editor.floatingIconRenderer.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.click();
        setTimeout(() => {
            const popup = document.querySelector('.e-blockeditor-blockaction-popup') as HTMLElement;
            (popup.querySelector('#delete') as HTMLElement).click();
            setTimeout(() => {
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
                    setTimeout(() => {
                        const domTarget = editor.element.querySelector('#p1');
                        const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                        //Dom assertion
                        expect(domTarget).toBeNull();
                        if (overlay) { expect(overlay.style.display).toBe('none'); }
                        const domBlocks13 = editor.element.querySelectorAll('.e-block');
                        expect(domBlocks13.length).toBe(2);
                        expect((domBlocks13[0] as HTMLElement).id).toBe('divider1');
                        expect((domBlocks13[1] as HTMLElement).id).toBe('p2');
                        //Model assertion
                        expect(editor.blocks.length).toBe(2);
                        expect(editor.blocks[0].id).toBe('divider1');
                        expect(editor.blocks[1].id).toBe('p2');
                        done();
                    }, 120);
                }, 120);
            }, 120);
        }, 150);
    });

    // Special type block deletion tests (Backspace/Delete with Undo/Redo)
    function buildWithSpecialBefore(specialId: string, specialType: BlockType): void {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        editor = createEditor({
            blocks: [
                { id: specialId, blockType: specialType, content: [] },
                { id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello' }] }
            ]
        });
        editor.appendTo('#editor');
    }
    function buildWithSpecialAfter(specialId: string, specialType: BlockType): void {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
        editor = createEditor({
            blocks: [
                { id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Hello' }] },
                { id: specialId, blockType: specialType, content: [] }
            ]
        });
        editor.appendTo('#editor');
    }

    function runBackspaceUndoRedoFlow(specialId: string, specialType: BlockType, done: any): void {
        buildWithSpecialBefore(specialId, specialType);
        const p1 = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(p1);
        setCursorPosition(getBlockContentElement(p1), 0);

        // Trigger soft selection via Backspace
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe(specialId);
            //Dom assertion
            const domBlocks = editor.element.querySelectorAll('.e-block');
            expect(domBlocks.length).not.toBe(1);
            const specialBlock: HTMLElement = editor.element.querySelector(`#${specialId}`);
            const paraEle: HTMLElement = editor.element.querySelector('#p1');
            expect(specialBlock).not.toBeNull();
            expect(paraEle).not.toBeNull();
            //Model assertion
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].id).toBe(specialId);
            expect(editor.blocks[1].id).toBe('p1');

            // Second Backspace - delete
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' } as any));
            setTimeout(() => {
                //Dom assertion
                expect(editor.element.querySelector('#' + specialId)).toBeNull();
                const domAfter = editor.element.querySelectorAll('.e-block');
                expect(domAfter.length).toBe(1);
                expect((domAfter[0] as HTMLElement).id).toBe('p1');
                //Model assertion
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe('p1');
                const ov2 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                if (ov2) { expect(ov2.style.display).toBe('none'); }

                // Undo restore
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    const ov3 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                    //Dom assertion
                    expect(editor.element.querySelector('#' + specialId)).not.toBeNull();
                    const specialBlock: HTMLElement = editor.element.querySelector(`#${specialId}`);
                    const paraEle: HTMLElement = editor.element.querySelector('#p1');
                    expect(specialBlock).not.toBeNull();
                    expect(paraEle).not.toBeNull();
                    expect(ov3).not.toBeNull();
                    expect(ov3.style.display).toBe('block');
                    expect(ov3.getAttribute('data-target-id')).toBe(specialId);
                    //Model assertion
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].id).toBe(specialId);
                    expect(editor.blocks[1].id).toBe('p1');

                    // Redo remove again
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
                    setTimeout(() => {
                        //Dom assertion
                        expect(editor.element.querySelector('#' + specialId)).toBeNull();
                        const domAfterRedo = editor.element.querySelectorAll('.e-block');
                        expect(domAfterRedo.length).toBe(1);
                        expect((domAfterRedo[0] as HTMLElement).id).toBe('p1');
                        const ov4 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                        if (ov4) { expect(ov4.style.display).toBe('none'); }
                        //Model assertion
                        expect(editor.blocks.length).toBe(1);
                        expect(editor.blocks[0].id).toBe('p1');
                        done();
                    }, 120);
                }, 120);
            }, 100);
        }, 80);
    }

    function runDeleteUndoRedoFlow(specialId: string, specialType: BlockType, done: any): void {
        buildWithSpecialAfter(specialId, specialType);
        const p1 = editor.element.querySelector('#p1') as HTMLElement;
        editor.blockManager.setFocusToBlock(p1);
        const content = getBlockContentElement(p1);
        setCursorPosition(content, content.textContent.length);

        // Trigger soft selection via Delete (next block)
        editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' } as any));
        setTimeout(() => {
            const overlay = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');
            expect(overlay.getAttribute('data-target-id')).toBe(specialId);
            //Dom assertion
            const domBlocks = editor.element.querySelectorAll('.e-block');
            expect(domBlocks.length).not.toBe(1);
            const specialBlock: HTMLElement = editor.element.querySelector(`#${specialId}`);
            const paraEle: HTMLElement = editor.element.querySelector('#p1');
            expect(specialBlock).not.toBeNull();
            expect(paraEle).not.toBeNull();
            //Model assertion
            expect(editor.blocks.length).toBe(2);
            expect(editor.blocks[0].id).toBe('p1');
            expect(editor.blocks[1].id).toBe(specialId);

            // Second Delete - delete
            editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' } as any));
            setTimeout(() => {
                //Dom assertion
                expect(editor.element.querySelector('#' + specialId)).toBeNull();
                const domAfter = editor.element.querySelectorAll('.e-block');
                expect(domAfter.length).toBe(1);
                expect((domAfter[0] as HTMLElement).id).toBe('p1');
                //Model assertion
                expect(editor.blocks.length).toBe(1);
                expect(editor.blocks[0].id).toBe('p1');
                const ov2 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                if (ov2) { expect(ov2.style.display).toBe('none'); }

                // Undo restore
                editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
                setTimeout(() => {
                    const ov3 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                    //Dom assertion
                    expect(editor.element.querySelector('#' + specialId)).not.toBeNull();
                    const domBlocks = editor.element.querySelectorAll('.e-block');
                    expect(domBlocks.length).not.toBe(1);
                    const specialBlock: HTMLElement = editor.element.querySelector(`#${specialId}`);
                    const paraEle: HTMLElement = editor.element.querySelector('#p1');
                    expect(specialBlock).not.toBeNull();
                    expect(paraEle).not.toBeNull();
                    expect(ov3).not.toBeNull();
                    expect(ov3.style.display).toBe('block');
                    expect(ov3.getAttribute('data-target-id')).toBe(specialId);
                    //Model assertion
                    expect(editor.blocks.length).toBe(2);
                    expect(editor.blocks[0].id).toBe('p1');
                    expect(editor.blocks[1].id).toBe(specialId);

                    // Redo remove again
                    editor.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
                    setTimeout(() => {
                        //Dom assertion
                        expect(editor.element.querySelector('#' + specialId)).toBeNull();
                        const domAfterRedo = editor.element.querySelectorAll('.e-block');
                        expect(domAfterRedo.length).toBe(1);
                        expect((domAfterRedo[0] as HTMLElement).id).toBe('p1');
                        const ov4 = editor.element.querySelector('.e-be-selection-overlay') as HTMLElement;
                        if (ov4) { expect(ov4.style.display).toBe('none'); }
                        //Model assertion
                        expect(editor.blocks.length).toBe(1);
                        expect(editor.blocks[0].id).toBe('p1');
                        done();
                    }, 120);
                }, 120);
            }, 100);
        }, 80);
    }

    it('Quote deletion with Backspace undo redo', (done) => runBackspaceUndoRedoFlow('quote1', BlockType.Quote, done));
    it('Quote deletion with Delete undo redo', (done) => runDeleteUndoRedoFlow('quote2', BlockType.Quote, done));

    it('Toggle Paragraph deletion with Backspace undo redo', (done) => runBackspaceUndoRedoFlow('toggle1', BlockType.CollapsibleParagraph, done));
    it('Toggle Paragraph deletion with Delete undo redo', (done) => runDeleteUndoRedoFlow('toggle2', BlockType.CollapsibleParagraph, done));

    it('Callout deletion with Backspace undo redo', (done) => runBackspaceUndoRedoFlow('callout1', BlockType.Callout, done));
    it('Callout deletion with Delete undo redo', (done) => runDeleteUndoRedoFlow('callout2', BlockType.Callout, done));

    it('Code deletion with Backspace undo redo', (done) => runBackspaceUndoRedoFlow('code1', BlockType.Code, done));
    it('Code deletion with Delete undo redo', (done) => runDeleteUndoRedoFlow('code2', BlockType.Code, done));

    it('Divider deletion with Backspace undo redo', (done) => runBackspaceUndoRedoFlow('div1', BlockType.Divider, done));
    it('Divider deletion with Delete undo redo', (done) => runDeleteUndoRedoFlow('div2', BlockType.Divider, done));

});
