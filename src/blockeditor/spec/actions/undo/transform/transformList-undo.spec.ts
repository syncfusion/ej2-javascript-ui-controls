import { createElement, remove } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../../../src/models/enums';
import { BlockModel, IHeadingBlockSettings } from '../../../../src/models/index';
import { getBlockContentElement, getSelectedRange, setCursorPosition } from '../../../../src/common/utils/index';
import { createEditor } from '../../../common/util.spec';
import { BlockEditor } from '../../../../src/index';
import { findClosestParent } from '../../../../src/common/utils/dom';

describe('transform List blocks (UI + keyboard)', () => {
    let editor: BlockEditor;
    let block1: HTMLElement;
    let editorElement: HTMLElement;

    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
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
    describe('bullet list block', () => {
        let block1: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.BulletList,
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });
        
        beforeEach((done: DoneFn) => done());
        
        afterEach(() => teardown());
        
        // UI transforms
        it('bullet to Paragraph (UI)', (done) => {
            openSlashAndPick('Paragraph', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 1 (UI)', (done) => {
            openSlashAndPick('Heading 1', block1);
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 2 (UI)', (done) => {
            openSlashAndPick('Heading 2', block1);
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 3 (UI)', (done) => {
            openSlashAndPick('Heading 3', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 4 (UI)', (done) => {
            openSlashAndPick('Heading 4', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Collapsible Heading 1 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 1', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 2 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 2', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 3 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 3', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 4 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 4', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Paragraph (UI)', (done) => {
            openSlashAndPick('Collapsible Paragraph', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        
        it('bullet to Numbered List (UI)', (done) => {
            openSlashAndPick('Numbered List', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            let li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul = domBlocks[0].querySelector('ul') as HTMLElement;
            const li2 = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li2).not.toBeNull();
            if (li2) expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> NumberedList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            ol = domBlocks[0].querySelector('ol') as HTMLElement;
            li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
        
        it('bullet to Checklist (UI)', (done) => {
            openSlashAndPick('Checklist', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul = domBlocks[0].querySelector('ul') as HTMLElement;
            const li2 = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li2).not.toBeNull();
            expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> Checklist
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            done();
        });
        
        // Feature
        // it('bullet to Quote (UI)', (done) => {
        //     openSlashAndPick('Quote', block1);
         
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     // transform check
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
         
        //     // undo -> BulletList
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     expect(modelBlocks.length).toBe(2);
        //     expect(domBlocks.length).toBe(3);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
        //     const ul = domBlocks[0].querySelector('ul') as HTMLElement;
        //     const li = ul ? ul.querySelector('li') as HTMLElement : null;
        //     expect(ul).not.toBeNull();
        //     expect(li).not.toBeNull();
        //     if (li) expect(li.textContent).toBe('Hello world');
        //     expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
        
        // Special blocks: Divider, Callout, Code, Table, Image
        // Important: use .e-block-container > .e-block and check after each undo/redo (2 undos, 2 redos)
        
        it('bullet to Divider (UI)', (done) => {
            openSlashAndPick('Divider', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
         
            // undo 2 -> remove divider (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1]).toBeUndefined();
            expect(domBlocks[2]).toBeUndefined();
         
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });
        
        it('bullet to Callout (UI)', (done) => {
            openSlashAndPick('Callout', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove callout (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add callout
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        
        it('bullet to Code (UI)', (done) => {
            openSlashAndPick('Code', block1);
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove code (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add code
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        
        it('bullet to Table (UI)', (done) => {
            openSlashAndPick('Table', block1);
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove table (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add table
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            done();
        });
        
        it('bullet to Image (UI)', (done) => {
            openSlashAndPick('Image', block1);
         
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                // transform -> [BulletList, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 1 -> remove trailing paragraph
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2]).toBeUndefined();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 2 -> remove image (back to single BulletList)
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 1 -> add image
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 2 -> add trailing paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
        
        // Keyboard transforms (representative set)
        it('bullet to Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'p', code: 'KeyP' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            expect(ul1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('bullet to Collapsible Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
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
        it('bullet to Collapsible Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            // const ul1 = domBlocks[0].querySelector('ul') as HTMLElement;
            // const li1 = ul1 ? ul1.querySelector('li') as HTMLElement : null;
            // expect(ul1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        
        it('bullet to Numbered List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            let li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul = domBlocks[0].querySelector('ul') as HTMLElement;
            const li2 = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li2).not.toBeNull();
            if (li2) expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> NumberedList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            ol = domBlocks[0].querySelector('ol') as HTMLElement;
            li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
        
        it('bullet to Checklist (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
         
            // undo -> BulletList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            const ul = domBlocks[0].querySelector('ul') as HTMLElement;
            const li2 = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li2).not.toBeNull();
            expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
            // redo -> Checklist
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            done();
        });
        // Feature
        // it('bullet to Quote (keyboard shortcuts)', (done) => {
        //     editor.blockManager.setFocusToBlock(block1);
        //     editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
         
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     // transform check
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
         
        //     // undo -> BulletList
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     expect(modelBlocks.length).toBe(2);
        //     expect(domBlocks.length).toBe(3);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
        //     const ul = domBlocks[0].querySelector('ul') as HTMLElement;
        //     const li = ul ? ul.querySelector('li') as HTMLElement : null;
        //     expect(ul).not.toBeNull();
        //     expect(li).not.toBeNull();
        //     if (li) expect(li.textContent).toBe('Hello world');
        //     expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
         
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
         
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
        
        it('bullet to Divider (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
         
            // undo 2 -> remove divider (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1]).toBeUndefined();
            expect(domBlocks[2]).toBeUndefined();
         
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            done();
        });
        
        it('bullet to Callout (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove callout (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add callout
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        
        it('bullet to Code (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove code (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add code
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        
        it('bullet to Table (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
         
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            // transform -> [BulletList, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // undo 2 -> remove table (back to single BulletList)
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 1 -> add table
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
         
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
         
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            done();
        });
        
        it('bullet to Image (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
         
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                // transform -> [BulletList, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 1 -> remove trailing paragraph
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2]).toBeUndefined();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 2 -> remove image (back to single BulletList)
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 1 -> add image
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 2 -> add trailing paragraph
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
    });

    describe('numbered list block', () => {
        let block1: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.NumberedList,
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });
    
        beforeEach((done: DoneFn) => done());
    
        afterEach(() => teardown());
    
        // UI transforms
        it('numbered to Paragraph (UI)', (done) => {
            openSlashAndPick('Paragraph', block1);
        
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
        
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
        
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 1 (UI)', (done) => {
            openSlashAndPick('Heading 1', block1);
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 2 (UI)', (done) => {
            openSlashAndPick('Heading 2', block1);
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 3 (UI)', (done) => {
            openSlashAndPick('Heading 3', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 4 (UI)', (done) => {
            openSlashAndPick('Heading 4', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Collapsible Heading 1 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 1', block1);
            
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
            
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
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
        it('numbered to Collapsible Heading 2 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 2', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Heading 3 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 3', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Heading 4 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 4', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Paragraph (UI)', (done) => {
            openSlashAndPick('Collapsible Paragraph', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('numbered to Bullet List (UI)', (done) => {
            openSlashAndPick('Bullet List', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            let li = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol = domBlocks[0].querySelector('ol') as HTMLElement;
            const li2 = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li2).not.toBeNull();
            expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo -> BulletList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            ul = domBlocks[0].querySelector('ul') as HTMLElement;
            li = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
        it('numbered to Checklist (UI)', (done) => {
            openSlashAndPick('Checklist', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol = domBlocks[0].querySelector('ol') as HTMLElement;
            const li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo -> Checklist
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            done();
        });
        // Feature
        // it('numbered to Quote (UI)', (done) => {
        //     openSlashAndPick('Quote', block1);
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     // transform check
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     // undo -> NumberedList
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(2);
        //     expect(domBlocks.length).toBe(3);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
        //     const ol = domBlocks[0].querySelector('ol') as HTMLElement;
        //     const li = ol ? ol.querySelector('li') as HTMLElement : null;
        //     expect(ol).not.toBeNull();
        //     expect(li).not.toBeNull();
        //     expect(li.textContent).toBe('Hello world');
        //     expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
        // Special blocks: Divider, Callout, Code, Table, Image
        // Use .e-block-container > .e-block and 2-step undo/redo with checks
        it('numbered to Divider (UI)', (done) => {
            openSlashAndPick('Divider', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2 -> remove divider
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Callout (UI)', (done) => {
            openSlashAndPick('Callout', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Code (UI)', (done) => {
            openSlashAndPick('Code', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Table (UI)', (done) => {
            openSlashAndPick('Table', block1);
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Image (UI)', (done) => {
            openSlashAndPick('Image', block1);
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // [NumberedList, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // undo 1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // undo 2
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[0].textContent).toBe('Hello world');
                // redo 1
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // redo 2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
        // Keyboard transforms
        it('numbered to Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'p', code: 'KeyP' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
        
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
        
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            expect(ol1).not.toBeNull();
            expect(li1).not.toBeNull();
            expect(li1.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('numbered to Collapsible Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            
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
        it('numbered to Collapsible Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
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
        it('numbered to Collapsible Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            // const ol1 = domBlocks[0].querySelector('ol') as HTMLElement;
            // const li1 = ol1 ? ol1.querySelector('li') as HTMLElement : null;
            // expect(ol1).not.toBeNull();
            // expect(li1).not.toBeNull();
            // expect(li1.textContent).toBe('Hello world');
            // expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
        it('numbered to Bullet List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            let li = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol = domBlocks[0].querySelector('ol') as HTMLElement;
            const li2 = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li2).not.toBeNull();
            expect(li2.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo -> BulletList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            ul = domBlocks[0].querySelector('ul') as HTMLElement;
            li = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
        it('numbered to Checklist (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '7', code: 'Digit7' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform check
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            // undo -> NumberedList
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            const ol = domBlocks[0].querySelector('ol') as HTMLElement;
            const li = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(li).not.toBeNull();
            expect(li.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // redo -> Checklist
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            expect(cli.textContent).toBe('Hello world');
            done();
        });
        // Feature
        // it('numbered to Quote (keyboard shortcut)', (done) => {
        //     editor.blockManager.setFocusToBlock(block1);
        //     editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     // transform check
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     // undo -> NumberedList
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(2);
        //     expect(domBlocks.length).toBe(3);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
        //     const ol = domBlocks[0].querySelector('ol') as HTMLElement;
        //     const li = ol ? ol.querySelector('li') as HTMLElement : null;
        //     expect(ol).not.toBeNull();
        //     expect(li).not.toBeNull();
        //     expect(li.textContent).toBe('Hello world');
        //     expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(3);
        //     expect(domBlocks.length).toBe(4);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
        it('numbered to Divider (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1 -> remove trailing paragraph
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2 -> remove divider
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2 -> add trailing paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Callout (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Code (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Table (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [NumberedList, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('numbered to Image (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                // [NumberedList, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // undo 1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // undo 2
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[0].textContent).toBe('Hello world');
                // redo 1
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                // redo 2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
    });
    
    describe('checklist block', () => {
        let block1: HTMLElement;
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'block1',
                    blockType: BlockType.Checklist,
                    content: [{ contentType: ContentType.Text, content: 'Hello world' }]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
            block1 = document.getElementById('block1');
        });
    
        beforeEach((done: DoneFn) => done());
    
        afterEach(() => teardown());
    
        // UI transforms
        it('checklist to Paragraph (UI)', (done) => {
            openSlashAndPick('Paragraph', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 1 (UI)', (done) => {
            openSlashAndPick('Heading 1', block1);
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 2 (UI)', (done) => {
            openSlashAndPick('Heading 2', block1);
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 3 (UI)', (done) => {
            openSlashAndPick('Heading 3', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 4 (UI)', (done) => {
            openSlashAndPick('Heading 4', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Collapsible Heading 1 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 1', block1);
            
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
            
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
            
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
        it('checklist to Collapsible Heading 2 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 2', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('checklist to Collapsible Heading 3 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 3', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('checklist to Collapsible Heading 4 (UI)', (done) => {
            openSlashAndPick('Collapsible Heading 4', block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('numbered to Collapsible Paragraph (UI)', (done) => {
            openSlashAndPick('Collapsible Paragraph', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
    
        it('checklist to Bullet List (UI)', (done) => {
            openSlashAndPick('Bullet List', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            let bli = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(bli).not.toBeNull();
            if (bli) expect(bli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            if (cli) expect(cli.textContent).toBe('Hello world');
            // redo -> BulletList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            ul = domBlocks[0].querySelector('ul') as HTMLElement;
            bli = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(bli).not.toBeNull();
            if (bli) expect(bli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
    
        it('checklist to Numbered List (UI)', (done) => {
            openSlashAndPick('Numbered List', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            let nli = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(nli).not.toBeNull();
            if (nli) expect(nli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            const cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            if (cli) expect(cli.textContent).toBe('Hello world');
            // redo -> NumberedList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            ol = domBlocks[0].querySelector('ol') as HTMLElement;
            nli = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(nli).not.toBeNull();
            if (nli) expect(nli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
    
        // Feature
        // it('checklist to Quote (UI)', (done) => {
        //     openSlashAndPick('Quote', block1);
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     // transform
        //     expect(modelBlocks.length).toBe(3);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks.length).toBe(4);
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     // undo -> Checklist
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(2);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
        //     const cli = domBlocks[0].querySelector('li') as HTMLElement;
        //     expect(cli).not.toBeNull();
        //     if (cli) expect(cli.textContent).toBe('Hello world');
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(3);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
    
        // Special blocks (Divider, Callout, Code, Table, Image) 2-step undo/redo
        it('checklist to Divider (UI)', (done) => {
            openSlashAndPick('Divider', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1 -> remove trailing p
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2 -> remove divider
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2 -> add trailing p
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Callout (UI)', (done) => {
            openSlashAndPick('Callout', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Code (UI)', (done) => {
            openSlashAndPick('Code', block1);
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Table (UI)', (done) => {
            openSlashAndPick('Table', block1);
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Image (UI)', (done) => {
            openSlashAndPick('Image', block1);
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                // [Checklist, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 2
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 1
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
    
        // Keyboard transforms
        it('checklist to Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'p', code: 'KeyP' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Paragraph');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo -> Paragraph
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('p')).not.toBeNull();
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '1', code: 'Digit1' }));
            // transform check
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(1);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h1')).not.toBeNull();
            expect(domBlocks[0].querySelector('h1').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '2', code: 'Digit2' }));
            // transform
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            // undo
            triggerUndo(editorElement);
            // undo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            // redo
            triggerRedo(editorElement);
            // redo check
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(2);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h2')).not.toBeNull();
            expect(domBlocks[0].querySelector('h2').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '3', code: 'Digit3' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(3);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h3')).not.toBeNull();
            expect(domBlocks[0].querySelector('h3').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '4', code: 'Digit4' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(domBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let li = domBlocks[0].querySelector('li') as HTMLElement;
            expect(li).not.toBeNull();
            if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks[0].blockType).toBe(BlockType.Heading);
            expect((modelBlocks[0].properties as IHeadingBlockSettings).level).toBe(4);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].querySelector('h4')).not.toBeNull();
            expect(domBlocks[0].querySelector('h4').textContent).toBe('Hello world');
            done();
        });
        it('checklist to Collapsible Heading 1 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
            
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
        it('checklist to Collapsible Heading 2 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('checklist to Collapsible Heading 3 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('checklist to Collapsible Heading 4 (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
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
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
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
        it('checklist to Collapsible Paragraph (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '5', code: 'Digit5' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // CollapsibleParagraph replaces current block
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks.length).toBe(1);
            // expect(domBlocks.length).toBe(1);
            // expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            // let li = domBlocks[0].querySelector('li') as HTMLElement;
            // expect(li).not.toBeNull();
            // if (li) expect(li.textContent).toBe('Hello world');
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // expect(modelBlocks[0].blockType).toBe(BlockType.CollapsibleParagraph);
            // expect(modelBlocks[0].content[0].content).toBe('Hello world');
            // expect((domBlocks[0] as HTMLElement).getAttribute('data-block-type')).toBe('CollapsibleParagraph');
            // expect(domBlocks[0].classList.contains('e-toggle-block')).toBe(true);
            // expect(domBlocks[0].textContent).toContain('Hello world');
            done();
        });
    
        it('checklist to Bullet List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '8', code: 'Digit8' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            let ul = domBlocks[0].querySelector('ul') as HTMLElement;
            let bli = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(bli).not.toBeNull();
            if (bli) expect(bli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            let cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            if (cli) expect(cli.textContent).toBe('Hello world');
            // redo -> BulletList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.BulletList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('BulletList');
            ul = domBlocks[0].querySelector('ul') as HTMLElement;
            bli = ul ? ul.querySelector('li') as HTMLElement : null;
            expect(ul).not.toBeNull();
            expect(bli).not.toBeNull();
            if (bli) expect(bli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('');
            done();
        });
        it('checklist to Numbered List (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '9', code: 'Digit9' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            // transform
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            let ol = domBlocks[0].querySelector('ol') as HTMLElement;
            let nli = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(nli).not.toBeNull();
            if (nli) expect(nli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            // undo -> Checklist
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            const cli = domBlocks[0].querySelector('li') as HTMLElement;
            expect(cli).not.toBeNull();
            if (cli) expect(cli.textContent).toBe('Hello world');
            // redo -> NumberedList
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.NumberedList);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('NumberedList');
            ol = domBlocks[0].querySelector('ol') as HTMLElement;
            nli = ol ? ol.querySelector('li') as HTMLElement : null;
            expect(ol).not.toBeNull();
            expect(nli).not.toBeNull();
            if (nli) expect(nli.textContent).toBe('Hello world');
            expect(getBlockContentElement(domBlocks[0]).style.getPropertyValue('list-style-type')).toBe('"1. "');
            done();
        });
    
        // Feature
        // it('checklist to Quote (keyboard shortcut)', (done) => {
        //     editor.blockManager.setFocusToBlock(block1);
        //     editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'q', code: 'KeyQ' }));
        //     let modelBlocks = editor.blocks;
        //     let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     // transform
        //     expect(modelBlocks.length).toBe(3);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks.length).toBe(4);
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     // undo -> Checklist
        //     triggerUndo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(2);
        //     expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
        //     const cli = domBlocks[0].querySelector('li') as HTMLElement;
        //     expect(cli).not.toBeNull();
        //     if (cli) expect(cli.textContent).toBe('Hello world');
        //     // redo -> Quote
        //     triggerRedo(editorElement);
        //     modelBlocks = editor.blocks;
        //     domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block');
        //     expect(modelBlocks.length).toBe(3);
        //     expect(modelBlocks[1].blockType).toBe(BlockType.Quote);
        //     expect(modelBlocks[0].content[0].content).toBe('Hello world');
        //     expect(domBlocks[1].querySelector('blockquote')).not.toBeNull();
        //     expect(domBlocks[0].textContent).toBe('Hello world');
        //     done();
        // });
    
        // Special blocks (Divider, Callout, Code, Table, Image) 2-step undo/redo
        it('checklist to Divider (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: '-', code: 'Minus' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Divider, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1 -> remove trailing p
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2 -> remove divider
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1 -> add divider
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2 -> add trailing p
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Divider);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('hr')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Callout (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'c', code: 'KeyC' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Callout, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Callout);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('.e-callout-content')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Code (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 'k', code: 'KeyK' }));
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Code, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2]).toBeUndefined();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Code);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('pre, code')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Table (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: 't', code: 'KeyT' }));
            const range: Range = getSelectedRange();
            const focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock.parentElement.parentElement.tagName).toBe('TD');
            let modelBlocks = editor.blocks;
            let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            // [Checklist, Table, Paragraph]
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 1
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // undo 2
            triggerUndo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(1);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(1);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 1
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(2);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(domBlocks.length).toBe(2);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            // redo 2
            triggerRedo(editorElement);
            modelBlocks = editor.blocks;
            domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            expect(modelBlocks.length).toBe(3);
            expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
            expect(modelBlocks[1].blockType).toBe(BlockType.Table);
            expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
            expect(modelBlocks[0].content[0].content).toBe('Hello world');
            expect(domBlocks.length).toBe(3);
            expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
            expect(domBlocks[1].querySelector('table')).not.toBeNull();
            expect(domBlocks[2].querySelector('p')).not.toBeNull();
            expect(domBlocks[0].textContent).toBe('Hello world');
            done();
        });
    
        it('checklist to Image (keyboard shortcut)', (done) => {
            editor.blockManager.setFocusToBlock(block1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, altKey: true, key: '/', code: 'Slash' }));
            setTimeout(() => {
                let modelBlocks = editor.blocks;
                let domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
            
                // [Checklist, Image, Paragraph]
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 1
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // undo 2
                triggerUndo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(1);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(1);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 1
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(2);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(domBlocks.length).toBe(2);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
            
                // redo 2
                triggerRedo(editorElement);
                modelBlocks = editor.blocks;
                domBlocks = editor.element.querySelectorAll<HTMLElement>('.e-block-container > .e-block');
                expect(modelBlocks.length).toBe(3);
                expect(modelBlocks[0].blockType).toBe(BlockType.Checklist);
                expect(modelBlocks[1].blockType).toBe(BlockType.Image);
                expect(modelBlocks[2].blockType).toBe(BlockType.Paragraph);
                expect(modelBlocks[0].content[0].content).toBe('Hello world');
                expect(domBlocks.length).toBe(3);
                expect(domBlocks[0].getAttribute('data-block-type')).toBe('Checklist');
                expect(domBlocks[1].querySelector('.e-image-placeholder')).not.toBeNull();
                expect(domBlocks[2].querySelector('p')).not.toBeNull();
                expect(domBlocks[0].textContent).toBe('Hello world');
                done();
            }, 300);
        });
    });
});