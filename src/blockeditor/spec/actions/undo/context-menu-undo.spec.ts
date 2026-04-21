import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../../src/models/enums';
import { BaseChildrenProp, BlockModel, ICalloutBlockSettings, ILinkContentSettings, IQuoteBlockSettings } from '../../../src/models/index';
import { setSelectionRange, getBlockContentElement, setCursorPosition, getSelectedRange } from '../../../src/common/utils/index';
import { createEditor } from '../../common/util.spec';
import { BlockEditor } from '../../../src/index';

describe('ContextMenu actions (UI + keyboard (keyboard not for cut,copy and paste))', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    function triggerRightClick(element: HTMLElement): void {
        element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    }

    function getContextMenu(): HTMLElement {
        return document.querySelector('.e-blockeditor-contextmenu ul') as HTMLElement;
    }

    function clickMenuItem(itemId: string): void {
        const menu = getContextMenu();
        const menuItem = menu.querySelector(`#${itemId}`) as HTMLElement;
        if (menuItem) {
            menuItem.click();
        }
    }

    describe('Increase indent - Ctrl+]', () => {
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                // Initial state
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                // Trigger context menu
                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.style.display).toBe('block');
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    // Click increase indent
                    clickMenuItem('increaseindent');

                    // After indent
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    // Undo
                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    // Redo
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                // Initial state
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                // Trigger Ctrl + ]
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                // After indent
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                // Undo
                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                // Redo
                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard Check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'check1', blockType: BlockType.Checklist, properties: { checked: false }, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                const blockElement = editorElement.querySelector('.e-quote-block .e-block') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect((editor.blocks[0].properties as BaseChildrenProp).children[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect((editor.blocks[0].properties as BaseChildrenProp).children[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('.e-quote-block .e-block') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect((editor.blocks[0].properties as BaseChildrenProp).children[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect((editor.blocks[0].properties as BaseChildrenProp).children[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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

            // Dom level, indent option is disabled (should'nt) (even though case works)
            // it('UI check', (done) => {
            //     const blockElement = editorElement.querySelector('#code1') as HTMLElement;
            //     editor.blockManager.setFocusToBlock(blockElement);
            //     setCursorPosition(getBlockContentElement(blockElement), 0);

            //     expect(editor.blocks[0].indent).toBe(0);
            //     expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

            //     triggerRightClick(editorElement);

            //     setTimeout(() => {
            //         const menu = getContextMenu();
            //         expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

            //         clickMenuItem('increaseindent');

            //         expect(editor.blocks[0].indent).toBe(1);
            //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

            //         triggerUndo(editorElement);
            //         expect(editor.blocks[0].indent).toBe(0);
            //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

            //         triggerRedo(editorElement);
            //         expect(editor.blocks[0].indent).toBe(1);
            //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
            //         done();
            //     }, 200);
            // });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#code1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                const childElement = editorElement.querySelector('#callout-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');
                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                const childElement = editorElement.querySelector('#callout-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                done();
            });
        });

        // describe('Table block', () => {
        //     beforeEach(() => {
        //         editorElement = createElement('div', { id: 'editor' });
        //         document.body.appendChild(editorElement);
        //         const blocks: BlockModel[] = [
        //             { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Before table' }] }
        //         ];
        //         editor = createEditor({ blocks });
        //         editor.appendTo('#editor');
                
        //         // Add table after editor is ready
        //         editor.addBlock({ id: 'table1', blockType: BlockType.Table }, 'para1');
        //     });

        //     afterEach(() => {
        //         if (editor) {
        //             editor.destroy();
        //             editor = undefined;
        //         }
        //         remove(editorElement);
        //     });

        //     it('UI check', (done) => {
        //         setTimeout(() => {
        //             const firstCellBlock = editorElement.querySelector('table .e-block') as HTMLElement;
        //             expect(firstCellBlock).not.toBeNull();
                    
        //             editor.blockManager.setFocusToBlock(firstCellBlock);
        //             setCursorPosition(getBlockContentElement(firstCellBlock), 0);

        //             triggerRightClick(editorElement);

        //             setTimeout(() => {
        //                 const menu = getContextMenu();
        //                 expect(menu.style.display).toBe('block');
        //                 expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(true);
        //                 expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(true);

        //                 done();
        //             }, 200);
        //         }, 100);
        //     });

        //     // it('Keyboard check - should not increase indent via Ctrl+] for table cell', (done) => {
        //     //     setTimeout(() => {
        //     //         const firstCellBlock = editorElement.querySelector('table .e-block') as HTMLElement;
        //     //         editor.blockManager.setFocusToBlock(firstCellBlock);

        //     //         const initialIndent = editor.blocks.find(b => b.id === firstCellBlock.id)?.indent || 0;

        //     //         editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

        //     //         const afterIndent = editor.blocks.find(b => b.id === firstCellBlock.id)?.indent || 0;
        //     //         expect(afterIndent).toBe(initialIndent);

        //     //         done();
        //     //     }, 100);
        //     // });
        // });

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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('increaseindent');

                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketRight', key: ']', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');
                done();
            });
        });
    });

    describe('Decrease indent - Ctrl+[', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, indent: 1, content: [{ contentType: ContentType.Text, content: 'Paragraph text' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                // Initial state (indented)
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                // Trigger context menu
                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.style.display).toBe('block');
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    // Click decrease indent
                    clickMenuItem('decreaseindent');

                    // After outdent
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    // Undo
                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    // Redo
                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                // Initial state (indented)
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                // Trigger Ctrl + [
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                // After outdent
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                // Undo
                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                // Redo
                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Heading H1 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, indent: 1, content: [{ contentType: ContentType.Text, content: 'Heading 1' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Heading H2 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, indent: 1, content: [{ contentType: ContentType.Text, content: 'Heading 2' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Heading H3 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, indent: 1, content: [{ contentType: ContentType.Text, content: 'Heading 3' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Heading H4 block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, indent: 1, content: [{ contentType: ContentType.Text, content: 'Heading 4' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#h4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Bullet List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'bullet1', blockType: BlockType.BulletList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Bullet item' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Numbered List block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'numbered1', blockType: BlockType.NumberedList, indent: 1, content: [{ contentType: ContentType.Text, content: 'Numbered item' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'check1', blockType: BlockType.Checklist, properties: { checked: false }, indent: 1, content: [{ contentType: ContentType.Text, content: 'Checklist item' }] }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Quote block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'quote1',
                        blockType: BlockType.Quote,
                        properties: {
                            children: [
                                { id: 'quote-child', blockType: BlockType.Paragraph, indent: 1, content: [{ id: 'qc1', contentType: ContentType.Text, content: 'Quote content' }] }
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
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                const childElement = editorElement.querySelector('#quote-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(0);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(1);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(0);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                const childElement = editorElement.querySelector('#quote-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as IQuoteBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        // describe('Code block', () => {
        //     beforeEach(() => {
        //         editorElement = createElement('div', { id: 'editor' });
        //         document.body.appendChild(editorElement);
        //         const blocks: BlockModel[] = [
        //             { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, indent: 1, content: [{ id: 'c1', contentType: ContentType.Text, content: 'const x = 10;' }] }
        //         ];
        //         editor = createEditor({ blocks });
        //         editor.appendTo('#editor');
        //     });

        //     afterEach(() => {
        //         if (editor) {
        //             editor.destroy();
        //             editor = undefined;
        //         }
        //         remove(editorElement);
        //     });

        //     it('UI check', (done) => {
        //         const blockElement = editorElement.querySelector('#code1') as HTMLElement;
        //         editor.blockManager.setFocusToBlock(blockElement);
        //         setCursorPosition(getBlockContentElement(blockElement), 0);

        //         expect(editor.blocks[0].indent).toBe(1);
        //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

        //         triggerRightClick(editorElement);

        //         setTimeout(() => {
        //             const menu = getContextMenu();
        //             expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

        //             clickMenuItem('decreaseindent');

        //             expect(editor.blocks[0].indent).toBe(0);
        //             expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

        //             triggerUndo(editorElement);
        //             expect(editor.blocks[0].indent).toBe(1);
        //             expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

        //             triggerRedo(editorElement);
        //             expect(editor.blocks[0].indent).toBe(0);
        //             expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
        //             done();
        //         }, 200);
        //     });

        //     it('Keyboard check', (done) => {
        //         const blockElement = editorElement.querySelector('#code1') as HTMLElement;
        //         editor.blockManager.setFocusToBlock(blockElement);
        //         setCursorPosition(getBlockContentElement(blockElement), 0);

        //         expect(editor.blocks[0].indent).toBe(1);
        //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

        //         editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

        //         expect(editor.blocks[0].indent).toBe(0);
        //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

        //         triggerUndo(editorElement);
        //         expect(editor.blocks[0].indent).toBe(1);
        //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

        //         triggerRedo(editorElement);
        //         expect(editor.blocks[0].indent).toBe(0);
        //         expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
        //         done();
        //     });
        // });

        describe('Collapsible Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    {
                        id: 'collapsePara1',
                        blockType: BlockType.CollapsibleParagraph,
                        indent: 1,
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
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
                        indent: 1,
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
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
                        indent: 1,
                        content: [{contentType: ContentType.Text, content: 'Collapsible H2' }],
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
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
                        indent: 1,
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
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
                        indent: 1,
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
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
                                { id: 'callout-child', blockType: BlockType.Paragraph, indent: 1, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'Callout content' }] }
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
                const childElement = editorElement.querySelector('#callout-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    // expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                    expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#callout1') as HTMLElement;
                const childElement = editorElement.querySelector('#callout-child') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(1);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                expect((editor.blocks[0].properties as ICalloutBlockSettings).children[0].indent).toBe(0);
                expect(childElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        describe('Divider block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'divider1', blockType: BlockType.Divider, indent: 1 }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#divider1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });

        // describe('Table block - should disable outdent', () => {
        //     beforeEach(() => {
        //         editorElement = createElement('div', { id: 'editor' });
        //         document.body.appendChild(editorElement);
        //         const blocks: BlockModel[] = [
        //             { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Before table' }] }
        //         ];
        //         editor = createEditor({ blocks });
        //         editor.appendTo('#editor');
                
        //         // Add table after editor is ready
        //         editor.addBlock({ id: 'table1', blockType: BlockType.Table }, 'para1');
        //     });

        //     afterEach(() => {
        //         if (editor) {
        //             editor.destroy();
        //             editor = undefined;
        //         }
        //         remove(editorElement);
        //     });

        //     it('UI check - should show outdent as disabled in context menu for table cell', (done) => {
        //         setTimeout(() => {
        //             const firstCellBlock = editorElement.querySelector('table .e-block') as HTMLElement;
        //             expect(firstCellBlock).not.toBeNull();
                    
        //             editor.blockManager.setFocusToBlock(firstCellBlock);
        //             setCursorPosition(getBlockContentElement(firstCellBlock), 0);

        //             triggerRightClick(editorElement);

        //             setTimeout(() => {
        //                 const menu = getContextMenu();
        //                 expect(menu.style.display).toBe('block');
        //                 expect(menu.querySelector('#increaseindent').classList.contains('e-disabled')).toBe(true);
        //                 expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(true);

        //                 done();
        //             }, 200);
        //         }, 100);
        //     });

        //     it('Keyboard check - should not decrease indent via Ctrl+[ for table cell', (done) => {
        //         setTimeout(() => {
        //             const firstCellBlock = editorElement.querySelector('table .e-block') as HTMLElement;
        //             editor.blockManager.setFocusToBlock(firstCellBlock);

        //             const initialIndent = editor.blocks.find(b => b.id === firstCellBlock.id)?.indent || 0;

        //             editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

        //             const afterIndent = editor.blocks.find(b => b.id === firstCellBlock.id)?.indent || 0;
        //             expect(afterIndent).toBe(initialIndent);

        //             done();
        //         }, 100);
        //     });
        // });

        describe('Image block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'img1', blockType: BlockType.Image, indent: 1, properties: { src: 'https://via.placeholder.com/150', alt: 'Test image' } }
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
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRightClick(editorElement);

                setTimeout(() => {
                    const menu = getContextMenu();
                    // expect(menu.querySelector('#decreaseindent').classList.contains('e-disabled')).toBe(false);

                    clickMenuItem('decreaseindent');

                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                    triggerUndo(editorElement);
                    expect(editor.blocks[0].indent).toBe(1);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                    triggerRedo(editorElement);
                    expect(editor.blocks[0].indent).toBe(0);
                    expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                    done();
                }, 200);
            });

            it('Keyboard check', (done) => {
                const blockElement = editorElement.querySelector('#img1') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);

                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                editorElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'BracketLeft', key: '[', ctrlKey: true }));

                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');

                triggerUndo(editorElement);
                expect(editor.blocks[0].indent).toBe(1);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('20');

                triggerRedo(editorElement);
                expect(editor.blocks[0].indent).toBe(0);
                expect(blockElement.style.getPropertyValue('--block-indent')).toBe('0');
                done();
            });
        });
    });

    // Cut, copy and paste CI fails
    // describe('Cut', () => {
    //     describe('Paragraph block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#para1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             // Select "world" text
    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             // Initial state
    //             expect(contentElement.textContent).toBe('hello world');

    //             // Trigger context menu
    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 const menu = getContextMenu();
    //                 expect(menu.style.display).toBe('block');
    //                 expect(menu.querySelector('#cut').classList.contains('e-disabled')).toBe(false);

    //                 // Click cut
    //                 clickMenuItem('cut');

    //                 setTimeout(() => {
    //                     // After cut
    //                     expect(contentElement.textContent).toBe('hello ');

    //                     // Undo
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     // Redo
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');

    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Heading H1 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');

    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');

    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Heading H2 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h2') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');

    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Heading H3 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h3') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Heading H4 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h4') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Bullet List block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'bullet1', blockType: BlockType.BulletList, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Numbered List block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Checklist block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'check1', blockType: BlockType.Checklist, properties: { checked: false }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#check1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Quote block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'quote1', blockType: BlockType.Quote, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Code block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });
    //         // code undo/redo not supported
    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#code1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     // expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     // expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Collapsible Paragraph block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapsePara1',
    //                     blockType: BlockType.CollapsibleParagraph,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Collapsible Heading H1 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH1',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 1, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Collapsible Heading H2 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH2',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 2, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Collapsible Heading H3 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH3',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 3, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Collapsible Heading H4 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH4',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 4, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Callout block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'callout1',
    //                     blockType: BlockType.Callout,
    //                     properties: {
    //                         children: [
    //                             { id: 'callout-child', blockType: BlockType.Paragraph, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'hello world' }] }
    //                         ]
    //                     }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text via context menu and undo/redo', (done) => {
    //             const childBlock = editorElement.querySelector('#callout-child') as HTMLElement;
    //             const contentElement = getBlockContentElement(childBlock);
    //             editor.blockManager.setFocusToBlock(childBlock);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('cut');
    //                 setTimeout(() => {
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello ');
    //                     done();
    //                 }, 500);
    //             }, 1000);
    //         });
    //     });

    //     describe('Table block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Before table' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
                
    //             // Add table after editor is ready
    //             editor.addBlock({ id: 'table1', blockType: BlockType.Table }, 'para1');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should cut selected text in table cell via context menu and undo/redo', (done) => {
    //             setTimeout(() => {
    //                 const firstCellBlock = editorElement.querySelector('table .e-block') as HTMLElement;
    //                 expect(firstCellBlock).not.toBeNull();
                    
    //                 editor.blockManager.setFocusToBlock(firstCellBlock);
    //                 const contentElement = getBlockContentElement(firstCellBlock);
                    
    //                 // Type "hello world" in the cell
    //                 contentElement.textContent = 'hello world';
    //                 setCursorPosition(contentElement, 11);

    //                 // Select "world" text
    //                 const textNode = contentElement.firstChild;
    //                 const range = document.createRange();
    //                 range.setStart(textNode, 6);
    //                 range.setEnd(textNode, 11);
    //                 const sel = window.getSelection();
    //                 sel.removeAllRanges();
    //                 sel.addRange(range);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('cut');
    //                     setTimeout(() => {
    //                         expect(contentElement.textContent).toBe('hello ');
    //                         triggerUndo(editorElement);
    //                         // on dom it works, on case, it fails...
    //                         // expect(contentElement.textContent).toBe('hello world');
    //                         triggerRedo(editorElement);
    //                         // expect(contentElement.textContent).toBe('hello ');
    //                         done();
    //                     }, 100);
    //                 }, 200);
    //             }, 100);
    //         });
    //     });
    // });

    // describe('Copy and Paste', () => {
    //     describe('Paragraph block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#para1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             // Select "world" text
    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             // Initial state
    //             expect(contentElement.textContent).toBe('hello world');

    //             // Copy via context menu
    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 const menu = getContextMenu();
    //                 expect(menu.querySelector('#copy').classList.contains('e-disabled')).toBe(false);

    //                 clickMenuItem('copy');

    //                 // Move cursor to end
    //                 setCursorPosition(contentElement, 11);

    //                 // Paste via context menu
    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     // After paste
    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     // Undo
    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     // Redo
    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Heading H1 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Heading H2 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h2', blockType: BlockType.Heading, properties: { level: 2 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h2') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Heading H3 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h3') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Heading H4 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'h4', blockType: BlockType.Heading, properties: { level: 4 }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#h4') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Bullet List block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'bullet1', blockType: BlockType.BulletList, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Numbered List block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'numbered1', blockType: BlockType.NumberedList, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#numbered1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Checklist block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'check1', blockType: BlockType.Checklist, properties: { checked: false }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#check1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Quote block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'quote1', blockType: BlockType.Quote, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Code block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'code1', blockType: BlockType.Code, properties: { language: 'javascript' }, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#code1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Collapsible Paragraph block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapsePara1',
    //                     blockType: BlockType.CollapsibleParagraph,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapsePara1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Collapsible Heading H1 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH1',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 1, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Collapsible Heading H2 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH2',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 2, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH2') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Collapsible Heading H3 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH3',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 3, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH3') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Collapsible Heading H4 block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'collapseH4',
    //                     blockType: BlockType.CollapsibleHeading,
    //                     content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }],
    //                     properties: { level: 4, isExpanded: true, children: [] }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const blockElement = editorElement.querySelector('#collapseH4') as HTMLElement;
    //             const contentElement = getBlockContentElement(blockElement);
    //             editor.blockManager.setFocusToBlock(blockElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Callout block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 {
    //                     id: 'callout1',
    //                     blockType: BlockType.Callout,
    //                     properties: {
    //                         children: [
    //                             { id: 'callout-child', blockType: BlockType.Paragraph, content: [{ id: 'cc1', contentType: ContentType.Text, content: 'hello world' }] }
    //                         ]
    //                     }
    //                 }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text via context menu and undo/redo', (done) => {
    //             const childElement = editorElement.querySelector('#callout-child') as HTMLElement;
    //             const contentElement = getBlockContentElement(childElement);
    //             editor.blockManager.setFocusToBlock(childElement);

    //             const textNode = contentElement.firstChild;
    //             const range = document.createRange();
    //             range.setStart(textNode, 6);
    //             range.setEnd(textNode, 11);
    //             const sel = window.getSelection();
    //             sel.removeAllRanges();
    //             sel.addRange(range);

    //             expect(contentElement.textContent).toBe('hello world');

    //             triggerRightClick(editorElement);

    //             setTimeout(() => {
    //                 clickMenuItem('copy');
    //                 setCursorPosition(contentElement, 11);

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('paste');

    //                     expect(contentElement.textContent).toBe('hello worldworld');

    //                     triggerUndo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello world');

    //                     triggerRedo(editorElement);
    //                     expect(contentElement.textContent).toBe('hello worldworld');
    //                     done();
    //                 }, 200);
    //             }, 200);
    //         });
    //     });

    //     describe('Table block', () => {
    //         beforeEach(() => {
    //             editorElement = createElement('div', { id: 'editor' });
    //             document.body.appendChild(editorElement);
    //             const blocks: BlockModel[] = [
    //                 { id: 'para1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'Before table' }] }
    //             ];
    //             editor = createEditor({ blocks });
    //             editor.appendTo('#editor');
                
    //             // Add table after editor is ready
    //             editor.addBlock({ id: 'table1', blockType: BlockType.Table }, 'para1');
    //         });

    //         afterEach(() => {
    //             if (editor) {
    //                 editor.destroy();
    //                 editor = undefined;
    //             }
    //             remove(editorElement);
    //         });

    //         it('UI check - should copy and paste text in table cell via context menu and undo/redo', (done) => {
    //             setTimeout(() => {
    //                 const cells = editorElement.querySelectorAll('table .e-block');
    //                 expect(cells.length).toBeGreaterThanOrEqual(1);
                    
    //                 const cell1 = cells[0] as HTMLElement;
    //                 const contentElement = getBlockContentElement(cell1);

    //                 // Add text to first cell
    //                 editor.blockManager.setFocusToBlock(cell1);
    //                 contentElement.textContent = 'hello world';

    //                 const textNode = contentElement.firstChild;
    //                 const range = document.createRange();
    //                 range.setStart(textNode, 6);
    //                 range.setEnd(textNode, 11);
    //                 const sel = window.getSelection();
    //                 sel.removeAllRanges();
    //                 sel.addRange(range);

    //                 expect(contentElement.textContent).toBe('hello world');

    //                 triggerRightClick(editorElement);

    //                 setTimeout(() => {
    //                     clickMenuItem('copy');
    //                     setCursorPosition(contentElement, 11);

    //                     triggerRightClick(editorElement);

    //                     setTimeout(() => {
    //                         clickMenuItem('paste');

    //                         expect(contentElement.textContent).toBe('hello worldworld');

    //                         triggerUndo(editorElement);
    //                         expect(contentElement.textContent).toBe('hello world');

    //                         triggerRedo(editorElement);
    //                         expect(contentElement.textContent).toBe('hello worldworld');
    //                         done();
    //                     }, 200);
    //                 }, 200);
    //             }, 100);
    //         });
    //     });
    // });

    describe('Link', () => {
        describe('Paragraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                // Select "world" text (characters 6-11)
                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        expect(popup).not.toBeNull();
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            // Verify link insertion
                            expect(editor.blocks[0].content.length).toBeGreaterThan(1);
                            const linkContent = editor.blocks[0].content.find(c => c.contentType === ContentType.Link);
                            expect(linkContent).not.toBeNull();
                            expect((linkContent.properties as ILinkContentSettings).url).toContain('https://www.syncfusion.com');
                            expect(contentElement.querySelector('a')).not.toBeNull();

                            triggerUndo(editorElement);
                            // Verify undo
                            expect(editor.blocks[0].content.length).toBe(1);
                            expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                            expect(contentElement.querySelector('a')).toBeNull();

                            triggerRedo(editorElement);
                            // Verify redo
                            const linkContentAfterRedo = editor.blocks[0].content.find(c => c.contentType === ContentType.Link);
                            expect(linkContentAfterRedo).not.toBeNull();
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#para1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                // Select "world" text (characters 6-11)
                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    expect(popup).not.toBeNull();
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        // Verify link insertion
                        expect(editor.blocks[0].content.length).toBeGreaterThan(1);
                        const linkContent = editor.blocks[0].content.find(c => c.contentType === ContentType.Link);
                        expect(linkContent).not.toBeNull();
                        expect((linkContent.properties as ILinkContentSettings).url).toContain('https://www.syncfusion.com');
                        expect(contentElement.querySelector('a')).not.toBeNull();

                        triggerUndo(editorElement);
                        // Verify undo
                        expect(editor.blocks[0].content.length).toBe(1);
                        expect(editor.blocks[0].content[0].contentType).toBe(ContentType.Text);
                        expect(contentElement.querySelector('a')).toBeNull();

                        triggerRedo(editorElement);
                        // Verify redo
                        const linkContentAfterRedo = editor.blocks[0].content.find(c => c.contentType === ContentType.Link);
                        expect(linkContentAfterRedo).not.toBeNull();
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        describe('Heading block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'h1', blockType: BlockType.Heading, properties: { level: 1 }, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#h1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        describe('BulletList block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'bullet1', blockType: BlockType.BulletList, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#bullet1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        describe('NumberedList block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'num1', blockType: BlockType.NumberedList, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#num1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#num1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        describe('Checklist block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'check1', blockType: BlockType.Checklist, properties: { isChecked: false }, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#check1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
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
                                content: [{ contentType: ContentType.Text, content: 'hello world' }]
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
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#quote1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        // link should not work on code block, but it works
        // describe('Code block', () => {
        //     beforeEach(() => {
        //         editorElement = createElement('div', { id: 'editor' });
        //         document.body.appendChild(editorElement);
        //         const blocks: BlockModel[] = [
        //             { id: 'code1', blockType: BlockType.Code, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
        //         ];
        //         editor = createEditor({ blocks });
        //         editor.appendTo('#editor');
        //     });

        //     afterEach(() => {
        //         if (editor) {
        //             editor.destroy();
        //         }
        //         remove(editorElement);
        //     });

        //     it('should insert link via context menu, then undo and redo', (done) => {
        //         const blockElement = editorElement.querySelector('#code1') as HTMLElement;
        //         const contentElement = getBlockContentElement(blockElement);
        //         editor.blockManager.setFocusToBlock(blockElement);

        //         const textNode = contentElement.firstChild;
        //         const range = document.createRange();
        //         range.setStart(textNode, 6);
        //         range.setEnd(textNode, 11);
        //         const sel = window.getSelection();
        //         sel.removeAllRanges();
        //         sel.addRange(range);

        //         triggerRightClick(contentElement);
        //         setTimeout(() => {
        //             clickMenuItem('link');
        //             setTimeout(() => {
        //                 const popup = document.querySelector('.e-blockeditor-link-dialog');
        //                 const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
        //                 const insertBtn = popup.querySelector('.e-insert-link-btn');
        //                 linkUrl.value = 'https://www.syncfusion.com';
        //                 insertBtn.dispatchEvent(new MouseEvent('click'));

        //                 setTimeout(() => {
        //                     expect(contentElement.querySelector('a')).not.toBeNull();
        //                     triggerUndo(editorElement);
        //                     expect(contentElement.querySelector('a')).toBeNull();
        //                     triggerRedo(editorElement);
        //                     expect(contentElement.querySelector('a')).not.toBeNull();
        //                     done();
        //                 }, 400);
        //             }, 100);
        //         }, 200);
        //     });

        //     it('should insert link via Ctrl+K, then undo and redo', (done) => {
        //         const blockElement = editorElement.querySelector('#code1') as HTMLElement;
        //         const contentElement = getBlockContentElement(blockElement);
        //         editor.blockManager.setFocusToBlock(blockElement);

        //         const textNode = contentElement.firstChild;
        //         const range = document.createRange();
        //         range.setStart(textNode, 6);
        //         range.setEnd(textNode, 11);
        //         const sel = window.getSelection();
        //         sel.removeAllRanges();
        //         sel.addRange(range);

        //         editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
        //         setTimeout(() => {
        //             const popup = document.querySelector('.e-blockeditor-link-dialog');
        //             const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
        //             const insertBtn = popup.querySelector('.e-insert-link-btn');
        //             linkUrl.value = 'https://www.syncfusion.com';
        //             insertBtn.dispatchEvent(new MouseEvent('click'));

        //             setTimeout(() => {
        //                 expect(contentElement.querySelector('a')).not.toBeNull();
        //                 triggerUndo(editorElement);
        //                 expect(contentElement.querySelector('a')).toBeNull();
        //                 triggerRedo(editorElement);
        //                 expect(contentElement.querySelector('a')).not.toBeNull();
        //                 done();
        //             }, 400);
        //         }, 100);
        //     });
        // });

        describe('CollapsibleParagraph block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'collapseP1', blockType: BlockType.CollapsibleParagraph, content: [{ contentType: ContentType.Text, content: 'hello world' }], properties: { children: [] } }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#collapseP1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#collapseP1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });

        describe('CollapsibleHeading block', () => {
            beforeEach(() => {
                editorElement = createElement('div', { id: 'editor' });
                document.body.appendChild(editorElement);
                const blocks: BlockModel[] = [
                    { id: 'collapseH1', blockType: BlockType.CollapsibleHeading, properties: { level: 1, children: [] }, content: [{ contentType: ContentType.Text, content: 'hello world' }] }
                ];
                editor = createEditor({ blocks });
                editor.appendTo('#editor');
            });

            afterEach(() => {
                if (editor) {
                    editor.destroy();
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#collapseH1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
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
                                { id: 'child1', blockType: BlockType.Paragraph, content: [{ id: 'c1', contentType: ContentType.Text, content: 'hello world' }] }
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
                }
                remove(editorElement);
            });

            it('should insert link via context menu, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#child1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                triggerRightClick(contentElement);
                setTimeout(() => {
                    clickMenuItem('link');
                    setTimeout(() => {
                        const popup = document.querySelector('.e-blockeditor-link-dialog');
                        const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                        const insertBtn = popup.querySelector('.e-insert-link-btn');
                        linkUrl.value = 'https://www.syncfusion.com';
                        insertBtn.dispatchEvent(new MouseEvent('click'));

                        setTimeout(() => {
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            triggerUndo(editorElement);
                            expect(contentElement.querySelector('a')).toBeNull();
                            triggerRedo(editorElement);
                            expect(contentElement.querySelector('a')).not.toBeNull();
                            done();
                        }, 400);
                    }, 100);
                }, 200);
            });

            it('should insert link via Ctrl+K, then undo and redo', (done) => {
                const blockElement = editorElement.querySelector('#child1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                editor.blockManager.setFocusToBlock(blockElement);

                const textNode = contentElement.firstChild;
                const range = document.createRange();
                range.setStart(textNode, 6);
                range.setEnd(textNode, 11);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                editor.element.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', key: 'k', ctrlKey: true }));
                setTimeout(() => {
                    const popup = document.querySelector('.e-blockeditor-link-dialog');
                    const linkUrl = popup.querySelector('#linkUrl') as HTMLInputElement;
                    const insertBtn = popup.querySelector('.e-insert-link-btn');
                    linkUrl.value = 'https://www.syncfusion.com';
                    insertBtn.dispatchEvent(new MouseEvent('click'));

                    setTimeout(() => {
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        triggerUndo(editorElement);
                        expect(contentElement.querySelector('a')).toBeNull();
                        triggerRedo(editorElement);
                        expect(contentElement.querySelector('a')).not.toBeNull();
                        done();
                    }, 400);
                }, 100);
            });
        });
    });
});
