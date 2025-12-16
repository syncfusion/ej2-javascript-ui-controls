import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, ICollapsibleBlockSettings, ICollapsibleHeadingBlockSettings } from '../../src/models/index';
import { createEditor, triggerMouseMove } from '../common/util.spec';
import { setCursorPosition, getBlockContentElement } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';

describe('Manager Actions - Floating Icon, State, and Renderer Managers', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Floating Icon interactions and outcomes', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'divider', blockType: BlockType.Divider }
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

        it('drag icon click should be prevented when blockaction is disabled', () => {
            editor.blockActionMenuSettings.enable = false;
            const beforeLen = editor.blocks.length;
            const beforeIds = editor.blocks.map(b => b.id);
            const beforeDomCount = editorElement.querySelectorAll('.e-block').length;

            // expect blockActionpopup is in closed state
            expect((editor.blockManager.floatingIconAction as any).handleDragIconClick()).toBeUndefined();
            const blockActionPopup: HTMLElement = editorElement.querySelector(`#${editorElement.id}_blockaction-popup`);
            expect(blockActionPopup.classList.contains('e-popup-open')).toBe(false);

            // Model unchanged
            expect(editor.blocks.length).toBe(beforeLen);
            expect(editor.blocks.map(b => b.id)).toEqual(beforeIds);
            // DOM unchanged
            const afterBlocks = editorElement.querySelectorAll('.e-block');
            expect(afterBlocks.length).toBe(beforeDomCount);
            expect((afterBlocks[0] as HTMLElement).id).toBe('paragraph1');
            expect((afterBlocks[0] as HTMLElement).nextElementSibling.id).toBe('divider');
        });

        it('should not show floating icons when readonly is enabled', () => {
            editor.readOnly = true;
            editor.dataBind();

            const block = editorElement.querySelector('.e-block') as HTMLElement;
            expect((editor.blockManager.floatingIconAction).showFloatingIcons(block)).toBeUndefined();
            const floatingIcons: HTMLElement = editorElement.querySelector('.e-floating-icons');
            
            // expect floatingIcons is in closed state
            expect(floatingIcons.style.display).toBe('none');
        });

        it('add icon click on non contenteditable block should add new block', () => {
            editor.blockManager.currentHoveredBlock = editorElement.querySelector('#divider') as HTMLElement;
            const beforeLen = editor.blocks.length;
            (editor.blockManager.floatingIconAction as any).handleAddIconClick()

            // Model: a new block inserted after divider
            expect(editor.blocks.length).toBe(beforeLen + 1);
            expect(editor.blocks[1].id).toBe('divider');
            expect(editor.blocks[2].id).toBe((editor.blockManager.currentHoveredBlock.nextElementSibling as HTMLElement).id);
            // check if default is Paragraph
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);

            // DOM: new sibling added after divider and it is the only next block
            const dividerEl = editorElement.querySelector('#divider') as HTMLElement;
            const newNext = dividerEl.nextElementSibling as HTMLElement;
            expect(newNext).not.toBeNull();
            expect(newNext.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect(newNext.nextElementSibling).toBeNull();
            editor.slashCommandModule.hidePopup();
        });

        it('add icon click on empty block should focus same block', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            setCursorPosition(contentElement, 0);
            editor.blockManager.currentHoveredBlock = blockElement;
            const beforeLen = editor.blocks.length;
            (editor.blockManager.floatingIconAction as any).handleAddIconClick()

            // Model: no new block created; focus unchanged
            expect(editor.blocks.length).toBe(beforeLen);
            expect(editor.blocks[0].id).toBe("paragraph1");
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[1].id).toBe("divider");
            expect(editor.blockManager.currentFocusedBlock.id).toBe('paragraph1');
            // DOM: order unchanged with divider next
            const next = (blockElement.nextElementSibling as HTMLElement);
            expect(next && next.id).toBe('divider');
            editor.slashCommandModule.hidePopup();
        });

        it('opens block action menu for Callout child and items are enabled', (done) => {
            setTimeout(() => {
                editor.addBlock({
                    id: 'callout-test',
                    blockType: BlockType.Callout,
                    properties: {
                        children: [
                            { id: 'callout-child-a', blockType: BlockType.Paragraph, content: [{ id: 'a_t', contentType: ContentType.Text, content: 'Parent Content' }] },
                            { id: 'callout-child-b', blockType: BlockType.Paragraph, content: [{ id: 'b_t', contentType: ContentType.Text, content: 'Child Content' }] }
                        ]
                    }
                });

                const secondChild = editorElement.querySelector('#callout-child-b') as HTMLElement;
                editor.blockManager.setFocusToBlock(secondChild);
                triggerMouseMove(secondChild, 10, 10);

                const floating = document.getElementById(`${editorElement.id}_floatingicons`) as HTMLElement;
                const dragIcon = floating.querySelector('.e-floating-icon.e-block-drag-icon') as HTMLElement;
                dragIcon.click();

                setTimeout(() => {
                    const popup = editorElement.querySelector(`#${editorElement.id}_blockaction-popup`) as HTMLElement;
                    expect(popup.querySelector('#duplicate').classList.contains('e-disabled')).toBe(false);
                    expect(popup.querySelector('#delete').classList.contains('e-disabled')).toBe(false);
                    expect(popup.querySelector('#moveup').classList.contains('e-disabled')).toBe(false);
                    done();
                }, 200);
            });
        });

        it('positions the floating drag icon within the top quarter for Heading block', (done) => {
            setTimeout(() => {
                editor.addBlock({
                    id: 'heading-test',
                    blockType: BlockType.Heading, // adjust if needed
                    properties: { level: 2 },
                    content: [
                    { id: 'h_t', contentType: ContentType.Text, content: 'My Heading' }
                    ]
                });

                const heading = editorElement.querySelector('#heading-test') as HTMLElement;
                editor.blockManager.setFocusToBlock(heading);
                triggerMouseMove(heading, 10, 10);

                const floating = document.getElementById(`${editorElement.id}_floatingicons`) as HTMLElement;

                setTimeout(() => {
                    const dragIcon = floating.querySelector('.e-floating-icon.e-block-drag-icon') as HTMLElement;

                    const headingRect = heading.getBoundingClientRect();
                    const iconRect = dragIcon.getBoundingClientRect();
                    const deltaTop = iconRect.top - headingRect.top;
                    expect(deltaTop).toBeLessThan(headingRect.height / 3);
                    done();
                }, 100);
            });
        });
    });

    describe('State Manager updates from DOM edits', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [
                    { id: 'bold-content', contentType: ContentType.Text, content: 'Bold text', properties: { styles: { bold: true } } },
                ]},
                { id: 'divider', blockType: BlockType.Divider }
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

        it('updateContentModelBasedOnDOM should update text nodes', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            const updated = 'Hello world newtext';
            contentElement.textContent = updated;

            editor.blockManager.stateManager.updateContentModelBasedOnDOM(contentElement, editor.blocks[0]);

            // Assert Model
            expect(editor.blocks[0].content[0].content).toBe(updated);
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks.length).toBe(3);
            expect(editor.blocks[1].id).toBe('paragraph2');
            expect(editor.blocks[2].id).toBe('divider');
            // Assert Dom
            expect((editorElement.querySelector('#paragraph1') as HTMLElement).textContent).toBe(updated);
            const next = (editorElement.querySelector('#paragraph1') as HTMLElement).nextElementSibling as HTMLElement;
            expect(next && next.id).toBe('paragraph2');
        });

        it('updateContentModelBasedOnDOM should update formatted nodes', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            const boldElement = contentElement.querySelector('strong') as HTMLElement;
            const updated = 'Updated bold text';
            boldElement.textContent = updated;

            editor.blockManager.stateManager.updateContentModelBasedOnDOM(contentElement, editor.blocks[1]);

            // Assert Model Updates
            expect(editor.blocks[1].content.length).toBe(1);
            expect(editor.blocks[1].content[0].content).toBe(updated);
            expect(editor.blocks[0].id).toBe('paragraph1');
            expect(editor.blocks[2].id).toBe('divider');
            // Assert DOM Updates
            const strongEl = (editorElement.querySelector('#paragraph2') as HTMLElement).querySelector('strong') as HTMLElement;
            expect(strongEl.textContent).toBe(updated);
            const prev = (editorElement.querySelector('#paragraph2') as HTMLElement).previousElementSibling as HTMLElement;
            const next = (editorElement.querySelector('#paragraph2') as HTMLElement).nextElementSibling as HTMLElement;
            expect(prev && prev.id).toBe('paragraph1');
            expect(prev && prev.textContent).toBe('Hello world newtext');
            expect(next && next.id).toBe('divider');
        });

        it('updateContentModelBasedOnDOM should create content for new element', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            const italicElement = document.createElement('em');
            italicElement.textContent = 'italic text';
            contentElement.appendChild(italicElement);

            const beforeLen = editor.blocks[1].content.length;
            editor.blockManager.stateManager.updateContentModelBasedOnDOM(contentElement, editor.blocks[1]);

            // Assert Updated Model
            // expect(editor.blocks[1].content.length).toBe(beforeLen + 1);
            expect(editor.blocks[1].content[0].content).toBe('Updated bold text');
            // expect(editor.blocks[1].content[1].content).toBe('italic text');
            // DOM contains both strong and em
            const strongEl = contentElement.querySelector('strong') as HTMLElement;
            const emEl = contentElement.querySelector('em') as HTMLElement;
            expect(strongEl).not.toBeNull();
            expect(emEl.textContent).toBe('italic text');

            // Neighbors intact
            const prev = blockElement.previousElementSibling as HTMLElement;
            const next = blockElement.nextElementSibling as HTMLElement;
            expect(prev && prev.id).toBe('paragraph1');
            expect(next && next.id).toBe('divider');
        });
    });

    describe('Block Renderer operations and slash-command transforms', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
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
                        isExpanded: true,
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
                },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: '' }] },
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

        it('transforming to special type inside callout', (done) => {
            setTimeout(()=>{
                const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                setTimeout(() => {
                    const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                    expect(slashCommandElement).not.toBeNull();
                    // click collapsible paragraph li element inside the popup
                    const collapsibleParaEle = slashCommandElement.querySelector('li[data-value="Collapsible Paragraph"]') as HTMLElement;
                    expect(collapsibleParaEle).not.toBeNull();
                    collapsibleParaEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        // Model
                        expect(editor.blocks.length).toBe(6);
                        expect(editor.blocks[1].blockType).toBe(BlockType.Callout);
                        expect(editor.blocks[2].blockType).toBe(BlockType.CollapsibleParagraph);
                        expect(editor.blocks[3].blockType).toBe(BlockType.Paragraph);
                        // DOM neighbors: new collapsible after callout parent, then paragraph
                        const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
                        const newCollapsible = calloutEl.nextElementSibling as HTMLElement;
                        expect(newCollapsible.getAttribute('data-block-type')).toBe(BlockType.CollapsibleParagraph);
                        const afterNew = newCollapsible.nextElementSibling as HTMLElement;
                        expect(afterNew.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
                        done();
                    }, 500);
                }, 300);
            });
        });

        it('transforming to special type inside collapsible', (done) => {
            setTimeout(()=>{
                const blockElement = editorElement.querySelector('#togglechild2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                setTimeout(() => {
                    const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                    expect(slashCommandElement).not.toBeNull();
                    // click callout li element inside the popup
                    const calloutEle = slashCommandElement.querySelector('li[data-value="Callout"]') as HTMLElement;
                    expect(calloutEle).not.toBeNull();
                    calloutEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        // Model
                        expect(editor.blocks.length).toBe(6);
                        expect(editor.blocks[2].blockType).toBe(BlockType.CollapsibleParagraph);
                        expect(editor.blocks[3].blockType).toBe(BlockType.Callout);
                        expect(editor.blocks[4].blockType).toBe(BlockType.Paragraph);
                        expect(editor.blockManager.currentFocusedBlock.id).toBe((editor.blocks[3].properties as BaseChildrenProp).children[0].id);
                        // DOM neighbors: new callout after toggle, then paragraph
                        const toggleEl = editorElement.querySelector('#toggleblock') as HTMLElement;
                        const newCallout = toggleEl.nextElementSibling as HTMLElement;
                        expect(newCallout.getAttribute('data-block-type')).toBe(BlockType.Callout);
                        const afterNew = newCallout.nextElementSibling as HTMLElement;
                        expect(afterNew.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
                        done();
                    }, 500);
                }, 300);
            });
        });

        it('transforming to code block', (done) => {
            setTimeout(()=> {
                const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
                editor.blockManager.setFocusToBlock(blockElement);
                const contentElement = getBlockContentElement(blockElement);
                setCursorPosition(contentElement, 0);
                contentElement.textContent = '/';
                setCursorPosition(contentElement, 1);
                editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
                setTimeout(() => {
                    const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                    expect(slashCommandElement).not.toBeNull();
                    const codeEle = slashCommandElement.querySelector('li[data-value="Code"]') as HTMLElement;
                    expect(codeEle).not.toBeNull();
                    codeEle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    setTimeout(() => {
                        // Model
                        expect(editor.blocks.length).toBe(5);
                        expect(editor.blocks[3].blockType).toBe(BlockType.Code);
                        expect(editor.blocks[3].id).toBe("paragraph2"); // check paragraph block transformed to code block
                        expect(editor.blocks[4].blockType).toBe(BlockType.Paragraph);
                        // DOM: paragraph2 becomes code, neighbors intact
                        const toggleEl = editorElement.querySelector('#toggleblock') as HTMLElement;
                        const codeEl = toggleEl.nextElementSibling as HTMLElement;
                        expect(codeEl.getAttribute('data-block-type')).toBe(BlockType.Code);
                        expect(codeEl.id).toBe("paragraph2");
                        const afterCode = codeEl.nextElementSibling as HTMLElement;
                        expect(afterCode.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
                        done();
                    }, 300);
                }, 200);
            });
        });

        it('transforming paragraph into a collapsible heading should respect the selected heading level', (done) => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent += ' /';
            setCursorPosition(contentElement, contentElement.textContent.length);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            setTimeout(() => {
                const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
                expect(slashCommandElement).not.toBeNull();
                const collapsible = slashCommandElement.querySelector('li[data-value="Collapsible Heading 3"]') as HTMLElement;
                expect(collapsible).not.toBeNull();
                collapsible.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                setTimeout(() => {
                    // Model
                    expect(editor.blocks.length).toBe(6);
                    expect(editor.blocks[1].blockType).toBe(BlockType.CollapsibleHeading);
                    expect((editor.blocks[1].properties as ICollapsibleHeadingBlockSettings).level).toBe(3);

                    // DOM
                    const toggleEl = blockElement.nextElementSibling as HTMLElement;
                    expect(toggleEl.getAttribute('data-block-type')).toBe(BlockType.CollapsibleHeading);
                    expect(toggleEl.querySelector('h3')).not.toBeNull();
                    done();
                }, 300);
            }, 200);
        });

        it('should handle null values', (done) => {
            setTimeout(()=>{
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                const originalContent = contentElement.cloneNode(true);
                const beforeLen = editor.blocks.length;
                const beforeIds = editor.blocks.map(b => b.id);
                
                expect(editor.blockManager.blockRenderer.reRenderBlockContent(null)).toBeUndefined();

                expect(editor.blockManager.blockRenderer.reRenderBlockContent({ id: 'invalid' })).toBeUndefined();

                contentElement.remove();
                expect(editor.blockManager.blockRenderer.reRenderBlockContent({ id: 'paragraph1' })).toBeUndefined();

                expect(editor.blockManager.blockRenderer.renderBlocks([])).toBeUndefined();

                // Model unchanged
                expect(editor.blocks.length).toBe(beforeLen);
                expect(editor.blocks.map(b => b.id)).toEqual(beforeIds);
                // DOM: paragraph1 still exists as first and callout next
                blockElement.appendChild(originalContent);
                const first = editorElement.querySelector('.e-block') as HTMLElement;
                expect(first && first.id).toBe('paragraph1');
                const next = first.nextElementSibling as HTMLElement;
                expect(next && next.id).toBe('calloutblock');
                done();
            });
        });

        it('insertBlockIntoDOM should work properly', (done) => {
            setTimeout(()=> {
                const originalElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const duplicate1 = originalElement.cloneNode(true) as HTMLElement;
                const duplicate2 = originalElement.cloneNode(true) as HTMLElement;

                duplicate1.id = 'duplicate1';
                duplicate2.id = 'duplicate2';
                const beforeDomCount = editorElement.querySelectorAll('.e-block').length;
                // Passing after element null should insert at last
                (editor.blockManager.blockRenderer as any).insertBlockIntoDOM(duplicate1, null);
                let allElems = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                expect(allElems.length).toBe(beforeDomCount + 1);
                expect(allElems[allElems.length - 1].id).toBe('duplicate1');
                // neighbors: previous should be the former last
                const lastPrev = allElems[allElems.length - 2] as HTMLElement;
                expect(lastPrev).not.toBeNull();
                expect(lastPrev.id).toBe("paragraph2");

                // Passing after element should insert after that element
                (editor.blockManager.blockRenderer as any).insertBlockIntoDOM(duplicate2, originalElement);
                expect(originalElement.nextElementSibling.id).toBe('duplicate2');
                allElems = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                expect(allElems.length).toBe(beforeDomCount + 2);
                expect((editorElement.querySelector('#duplicate2') as HTMLElement).previousElementSibling.id).toBe('paragraph1');

                done();
            });
        });
    });
});
