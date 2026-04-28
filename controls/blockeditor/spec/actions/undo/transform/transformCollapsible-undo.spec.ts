import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../../../src/models/enums';
import { BlockModel } from '../../../../src/models/index';
import { getBlockContentElement, getSelectedRange, setCursorPosition } from '../../../../src/common/utils/index';
import { createEditor } from '../../../common/util.spec';
import { BlockEditor } from '../../../../src/index';
import { findClosestParent } from '../../../../src/common/utils/dom';

describe('transform Collapsible blocks (UI + keyboard)', () => {
    let editor: BlockEditor;
    let block1: HTMLElement;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    describe('CollapsibleParagraph block', () => {
        let openSlashAndPick: (label: string) => void;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.CollapsibleParagraph,
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
            // Helper for opening slash menu and clicking an item
            openSlashAndPick = (label: string) => {
                const target = block1;
                editor.blockManager.setFocusToBlock(target);
                const contentElement = getBlockContentElement(target);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/' + contentElement.textContent;
                setCursorPosition(contentElement, 1);
                editor.blockManager.stateManager.updateContentOnUserTyping(target);
                editorElement
                    .querySelector('.e-mention.e-editable-element')
                    .dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                const popup = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(popup).not.toBeNull();
                const li = popup.querySelector(`li[data-value="${label}"]`) as HTMLElement;
                expect(li).not.toBeNull();
                li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            };
        });
        beforeEach((done: DoneFn) => done());
        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            // cleanup any popup if present
            const popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
            if (popup) {
                remove(popup as any);
            }
            remove(editorElement);
        });
        // UI-based slash command + mouse click for all transformations
        it('collapsiblePara to Heading 1 (UI)', (done) => {
            openSlashAndPick('Heading 1');
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('collapsiblePara to Heading 2 (UI)', (done) => {
            openSlashAndPick('Heading 2');
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('collapsiblePara to Heading 3 (UI)', (done) => {
            openSlashAndPick('Heading 3');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('collapsiblePara to Heading 4 (UI)', (done) => {
            openSlashAndPick('Heading 4');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('collapsiblePara to Collapsible Heading 1 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 1');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('collapsiblePara to Collapsible Heading 2 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 2');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('collapsiblePara to Collapsible Heading 3 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 3');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('collapsiblePara to Collapsible Heading 4 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 4');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
    
        it('Collapsible Paragraph to Para (UI)', (done) => {
            openSlashAndPick('Collapsible Paragraph');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Quote (UI)', (done) => {
            openSlashAndPick('Quote');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // const q = domBlocks[0].querySelector('blockquote') as HTMLElement;
            // expect(q).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Bulleted List (UI)', (done) => {
            // Note: label is "Bullet List" in slash menu
            openSlashAndPick('Bullet List');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
            // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            // let li = ul.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
            // ul = domBlocks[0].querySelector('ul') as HTMLElement;
            // li = ul.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
        it('CollapsiblePara to Numbered List (UI)', (done) => {
            openSlashAndPick('Numbered List');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
            // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            // let li = ol.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
            // ol = domBlocks[0].querySelector('ol') as HTMLElement;
            // li = ol.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
        it('CollapsiblePara to Checklist (UI)', (done) => {
            openSlashAndPick('Checklist');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
            // li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Divider (UI)', (done) => {
            // For non-empty content, divider should create [Paragraph, Divider, Paragraph]
            openSlashAndPick('Divider');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement); // remove trailing paragraph
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement); // remove divider
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // Redo back to [Paragraph, Divider, Paragraph]
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Callout (UI)', (done) => {
            // For non-empty content, behavior should be [Paragraph, Callout, Paragraph]
            openSlashAndPick('Callout');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Code (UI)', (done) => {
            openSlashAndPick('Code');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //1st undo removes extra para added with code block
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //2nd undo removes code block
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //1st redo adds code block
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //2nd redo adds the p block appended with code
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('CollapsiblePara to Table (UI)', (done) => {
            // For non-empty content, expect [Paragraph, Table, Paragraph]
            openSlashAndPick('Table');
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('CollapsiblePara to Image (UI)', (done) => {
            // For non-empty content, expect [Paragraph, Image, Paragraph]
            openSlashAndPick('Image');
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            }, 300);
        });
        // Keyboard shortcut-based for all available shortcuts
        it('CollapsiblePara to Heading 1 (keyboard shortcut)', (done) => {
            const blockElement = block1;
            editor.blockManager.setFocusToBlock(blockElement);
            // Ctrl+Alt+1
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Collapsible Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+6
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '6', code: 'Digit6' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(1);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('CollapsiblePara to Collapsible Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+7
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(2);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('CollapsiblePara to Collapsible Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+8
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '8', code: 'Digit8' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(3);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('CollapsiblePara to Collapsible Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+9
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '9', code: 'Digit9' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
            // expect(((modelBlocks[0].properties) as any).level).toBe(4);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
            // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            done();
        });
        it('Collapsible Paragraph to Para (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'p', code: 'KeyP' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Paragraph');
            // expect(domBlocks[0].querySelector('p').textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Quote (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+Q
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // const q = domBlocks[0].querySelector('blockquote') as HTMLElement;
            // expect(q).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Code (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+K
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //1st undo removes extra para added with code block
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //2nd undo removes code block
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //1st redo adds code block
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            //2nd redo adds the p block appended with code
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('CollapsiblePara to Table (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+T
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('table')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('CollapsiblePara to Callout (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+C
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Divider (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Shift+-
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            triggerUndo(editorElement); // remove trailing paragraph
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement); // remove divider
            modelBlocks = editor.blocks; 
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(1);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1]).toBeUndefined();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            // Redo back to [Paragraph, Divider, Paragraph]
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(2);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(2);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2]).toBeUndefined();
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(3);
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks.length).toBe(3);
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            // expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Checklist (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Shift+7
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
            // li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            done();
        });
        it('CollapsiblePara to Bulleted List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Shift+8
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
            // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            // let li = ul.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
            // ul = domBlocks[0].querySelector('ul') as HTMLElement;
            // li = ul.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
        it('CollapsiblePara to Numbered List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Shift+9
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
            // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            // let li = ol.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
            // ol = domBlocks[0].querySelector('ol') as HTMLElement;
            // li = ol.querySelector('li') as HTMLElement;
            // expect(li.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
        it('CollapsiblePara to Image (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            // Ctrl+Alt+/
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
            // Expect an image block insertion after the paragraph
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            }, 300);
        });
    });

    describe('Collapsible heading blocks', () => {
        function setupCollapsibleHeading(level: 1 | 2 | 3 | 4) {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.CollapsibleHeading,
                    properties: { level },
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        }
    
        function teardown() {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            const popup = document.querySelector('.e-blockeditor-command-menu.e-popup');
            if (popup) {
                remove(popup as any);
            }
            remove(editorElement);
        }
    
        function openSlashAndPick(label: string, host: HTMLElement) {
            editor.blockManager.setFocusToBlock(host);
            const contentElement = getBlockContentElement(host);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/' + contentElement.textContent;
            setCursorPosition(contentElement, 1);
            editor.blockManager.stateManager.updateContentOnUserTyping(host);
            editorElement
                .querySelector('.e-mention.e-editable-element')
                .dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const popup = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            expect(popup).not.toBeNull();
            const li = popup.querySelector(`li[data-value="${label}"]`) as HTMLElement;
            expect(li).not.toBeNull();
            li.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }
        describe('collapsible heading 1', () => {
            beforeEach(() => {
                setupCollapsibleHeading(1);
            });
            beforeEach((done: DoneFn) => done());
            afterEach(() => teardown());
            // UI Checks
            it('collapsible h1 to Paragraph (UI)', (done) => {
                openSlashAndPick('Paragraph', block1);
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h1 to Heading 1 (UI)', (done) => {
                openSlashAndPick('Heading 2', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h1 to Heading 2 (UI)', (done) => {
                openSlashAndPick('Heading 2', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Heading 3 (UI)', (done) => {
                openSlashAndPick('Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Heading 4 (UI)', (done) => {
                openSlashAndPick('Heading 4', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 2 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 2', block1);
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 3 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 4 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 4', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Paragraph (UI)', (done) => {
                openSlashAndPick('Collapsible Paragraph', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Quote (UI)', (done) => {
                openSlashAndPick('Quote', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Bulleted List (UI)', (done) => {
                openSlashAndPick('Bullet List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h1 to Numbered List (UI)', (done) => {
                openSlashAndPick('Numbered List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h1 to Checklist (UI)', (done) => {
                openSlashAndPick('Checklist', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Divider (UI)', (done) => {
                openSlashAndPick('Divider', block1);
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h1 to Callout (UI)', (done) => {
                openSlashAndPick('Callout', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Code (UI)', (done) => {
                openSlashAndPick('Code', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h1 to Table (UI)', (done) => {
                openSlashAndPick('Table', block1);
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h1 to Image (UI)', (done) => {
                openSlashAndPick('Image', block1);
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
            // Keyboard shortcut Checks
            it('collapsible h1 to Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h1 to Heading 1 (keyboard shortcut)', (done) => {
                const blockElement = block1;
                editor.blockManager.setFocusToBlock(blockElement);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h1 to Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Collapsible Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h1 to Quote (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+Q
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Bulleted List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h1 to Numbered List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h1 to Checklist (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Divider (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+-
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h1 to Callout (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+C
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h1 to Code (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+K
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h1 to Table (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+T
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h1 to Image (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+/
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
        });

        describe('collapsible heading 2', () => {
            beforeEach(() => {
                setupCollapsibleHeading(2);
            });
            beforeEach((done: DoneFn) => done());
            afterEach(() => teardown());
            // UI Checks
            it('collapsible h2 to Paragraph (UI)', (done) => {
                openSlashAndPick('Paragraph', block1);
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h2 to Heading 1 (UI)', (done) => {
                openSlashAndPick('Heading 1', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h2 to Heading 2 (UI)', (done) => {
                openSlashAndPick('Heading 2', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Heading 3 (UI)', (done) => {
                openSlashAndPick('Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Heading 4 (UI)', (done) => {
                openSlashAndPick('Heading 4', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 1 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 2', block1);
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 3 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 4 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 4', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Paragraph (UI)', (done) => {
                openSlashAndPick('Collapsible Paragraph', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Quote (UI)', (done) => {
                openSlashAndPick('Quote', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Bulleted List (UI)', (done) => {
                openSlashAndPick('Bullet List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h2 to Numbered List (UI)', (done) => {
                openSlashAndPick('Numbered List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h2 to Checklist (UI)', (done) => {
                openSlashAndPick('Checklist', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Divider (UI)', (done) => {
                openSlashAndPick('Divider', block1);
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h2 to Callout (UI)', (done) => {
                openSlashAndPick('Callout', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Code (UI)', (done) => {
                openSlashAndPick('Code', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h2 to Table (UI)', (done) => {
                openSlashAndPick('Table', block1);
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h2 to Image (UI)', (done) => {
                openSlashAndPick('Image', block1);
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
            // Keyboard shortcut Checks
            it('collapsible h2 to Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h2 to Heading 1 (keyboard shortcut)', (done) => {
                const blockElement = block1;
                editor.blockManager.setFocusToBlock(blockElement);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h2 to Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 1 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Collapsible Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h2 to Quote (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+Q
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Bulleted List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h2 to Numbered List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            
                 let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h2 to Checklist (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Divider (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+-
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h2 to Callout (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+C
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h2 to Code (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+K
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h2 to Table (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+T
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h2 to Image (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+/
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
        });

        describe('collapsible heading 3', () => {
            beforeEach(() => {
                setupCollapsibleHeading(3);
            });
            beforeEach((done: DoneFn) => done());
            afterEach(() => teardown());
            // UI Checks
            it('collapsible h3 to Paragraph (UI)', (done) => {
                openSlashAndPick('Paragraph', block1);
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h3 to Heading 1 (UI)', (done) => {
                openSlashAndPick('Heading 1', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h3 to Heading 2 (UI)', (done) => {
                openSlashAndPick('Heading 2', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Heading 3 (UI)', (done) => {
                openSlashAndPick('Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Heading 4 (UI)', (done) => {
                openSlashAndPick('Heading 4', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 1 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 2', block1);
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 2 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 4 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 4', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Paragraph (UI)', (done) => {
                openSlashAndPick('Collapsible Paragraph', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Quote (UI)', (done) => {
                openSlashAndPick('Quote', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Bulleted List (UI)', (done) => {
                openSlashAndPick('Bullet List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h3 to Numbered List (UI)', (done) => {
                openSlashAndPick('Numbered List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h3 to Checklist (UI)', (done) => {
                openSlashAndPick('Checklist', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Divider (UI)', (done) => {
                openSlashAndPick('Divider', block1);
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h3 to Callout (UI)', (done) => {
                openSlashAndPick('Callout', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Code (UI)', (done) => {
                openSlashAndPick('Code', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h3 to Table (UI)', (done) => {
                openSlashAndPick('Table', block1);
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h3 to Image (UI)', (done) => {
                openSlashAndPick('Image', block1);
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
            // Keyboard shortcut Checks
            it('collapsible h3 to Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h3 to Heading 1 (keyboard shortcut)', (done) => {
                const blockElement = block1;
                editor.blockManager.setFocusToBlock(blockElement);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h3 to Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 1 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Collapsible Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h3 to Quote (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+Q
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Bulleted List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h3 to Numbered List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h3 to Checklist (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Divider (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+-
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h3 to Callout (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+C
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h3 to Code (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+K
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h3 to Table (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+T
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h3 to Image (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+/
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
        });

        describe('collapsible heading 4', () => {
            beforeEach(() => {
                setupCollapsibleHeading(4);
            });
            beforeEach((done: DoneFn) => done());
            afterEach(() => teardown());
            // UI Checks
            it('collapsible h4 to Paragraph (UI)', (done) => {
                openSlashAndPick('Paragraph', block1);
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h4 to Heading 1 (UI)', (done) => {
                openSlashAndPick('Heading 1', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h4 to Heading 2 (UI)', (done) => {
                openSlashAndPick('Heading 2', block1);
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Heading 3 (UI)', (done) => {
                openSlashAndPick('Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Heading 4 (UI)', (done) => {
                openSlashAndPick('Heading 4', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 1 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 2', block1);
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 3 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 3', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 2 (UI)', (done) => {
                openSlashAndPick('Collapsible Heading 4', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Paragraph (UI)', (done) => {
                openSlashAndPick('Collapsible Paragraph', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Quote (UI)', (done) => {
                openSlashAndPick('Quote', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Bulleted List (UI)', (done) => {
                openSlashAndPick('Bullet List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h4 to Numbered List (UI)', (done) => {
                openSlashAndPick('Numbered List', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h4 to Checklist (UI)', (done) => {
                openSlashAndPick('Checklist', block1);
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Divider (UI)', (done) => {
                openSlashAndPick('Divider', block1);
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h4 to Callout (UI)', (done) => {
                openSlashAndPick('Callout', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Code (UI)', (done) => {
                openSlashAndPick('Code', block1);
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h4 to Table (UI)', (done) => {
                openSlashAndPick('Table', block1);
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h4 to Image (UI)', (done) => {
                openSlashAndPick('Image', block1);
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
            // Keyboard shortcut Checks
            it('collapsible h4 to Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
                // transform
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                // undo -> back to h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // redo -> paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h4 to Heading 1 (keyboard shortcut)', (done) => {
                const blockElement = block1;
                editor.blockManager.setFocusToBlock(blockElement);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
            it('collapsible h4 to Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
                
                // transform
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                
                // undo -> h1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                
                // redo -> h2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Heading 4 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
                // expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 1 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(1);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h1')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 3 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(3);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h3')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Heading 2 (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(2);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h2')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Collapsible Paragraph (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1); expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
        
            it('collapsible h4 to Quote (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+Q
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Quote);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks[0].querySelector('blockquote')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Bulleted List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+8
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // let ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // let li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('BulletList');
                // ul = domBlocks[0].querySelector('ul') as HTMLElement;
                // li = ul ? ul.querySelector('li') as HTMLElement : null;
                // expect(ul).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
                done();
            });
        
            it('collapsible h4 to Numbered List (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+9
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // let ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // let li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // expect(li.textContent).toBe('Hello world');
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('NumberedList');
                // ol = domBlocks[0].querySelector('ol') as HTMLElement;
                // li = ol ? ol.querySelector('li') as HTMLElement : null;
                // expect(ol).not.toBeNull();
                // expect(li).not.toBeNull();
                // if (li) { expect(li.textContent).toBe('Hello world'); }
                // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
                done();
            });
        
            it('collapsible h4 to Checklist (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+7
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1); 
                // expect(domBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('Checklist');
                // expect(domBlocks[0].querySelector('li')).not.toBeNull();
                // expect(domBlocks[0].querySelector('li').textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Divider (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Shift+-
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
                let modelBlocks = editor.blocks; 
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove divider
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                // Redo back to [Paragraph, Divider, Paragraph]
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(domBlocks.length).toBe(3);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('hr')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h4 to Callout (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+C
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            });
        
            it('collapsible h4 to Code (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+K
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerUndo(editorElement); // remove trailing paragraph
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement); // remove code
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Code);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                done();
            });
            it('collapsible h4 to Table (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+T
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
                const range: Range = getSelectedRange();
                const focusedBlock = findClosestParent(range.startContainer, '.e-block');
                expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
            
                triggerUndo(editorElement); 
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerUndo(editorElement);
                modelBlocks = editor.blocks; 
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(1);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(1);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1]).toBeUndefined();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
            
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(2);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect(domBlocks.length).toBe(2);
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2]).toBeUndefined();
                // expect(domBlocks[0].textContent).toContain('Hello world');
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // expect(modelBlocks.length).toBe(3);
                // expect(domBlocks.length).toBe(3);
                // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                // expect(modelBlocks[1].blockType).toBe(BlockType.Table);
                // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                // expect(domBlocks[1].querySelector('table')).not.toBeNull();
                // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                done();
            });
        
            it('collapsible h4 to Image (keyboard shortcut)', (done) => {
                editor.blockManager.setFocusToBlock(block1);
                // Ctrl+Alt+/
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
                setTimeout(() => {
                    let modelBlocks = editor.blocks;
                    let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerUndo(editorElement);
                    modelBlocks = editor.blocks; 
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(1);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(1);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1]).toBeUndefined();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(2);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[0].content[0].content).toBe('Hello world');
                    // expect(domBlocks.length).toBe(2);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2]).toBeUndefined();
                    // expect(domBlocks[0].textContent).toContain('Hello world');
                    triggerRedo(editorElement);
                    modelBlocks = editor.blocks;
                    domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                    // expect(modelBlocks.length).toBe(3);
                    // expect(domBlocks.length).toBe(3);
                    // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleHeading);
                    // expect(((modelBlocks[0].properties) as any).level).toBe(4);
                    // expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                    // expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                    // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleHeading');
                    // expect(domBlocks[0].querySelector('h4')).not.toBeNull();
                    // expect(domBlocks[1].querySelector('img')).not.toBeNull();
                    // expect(domBlocks[2].querySelector('p')).not.toBeNull();
                    done();
                }, 300);
            });
        });
    });
});