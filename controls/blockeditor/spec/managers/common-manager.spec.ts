import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel } from '../../src/blockeditor/models';
import { BlockEditor, BlockType, ContentType, setCursorPosition, getBlockContentElement } from '../../src/index';
import { createEditor } from '../common/util.spec';

describe('Common Manager Actions', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Floating Icon Manager:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
                { id: 'divider', type: BlockType.Divider }
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
            editor.blockActionsMenu.enable = false;
            expect((editor.floatingIconManager as any).handleDragIconClick()).toBeUndefined();
        });

        it('add icon click on non contenteditable block should add new block', () => {
            editor.currentHoveredBlock = editorElement.querySelector('#divider') as HTMLElement;
            spyOn(editor.blockCommandManager, 'addNewBlock').and.callFake(() => { });
            (editor.floatingIconManager as any).handleAddIconClick()
            expect(editor.blockCommandManager.addNewBlock).toHaveBeenCalled();
            editor.slashCommandModule.hidePopup();
        });

        it('add icon click on empty block should focus same block', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement);
            contentElement.textContent = '';
            setCursorPosition(contentElement, 0);
            editor.currentHoveredBlock = blockElement;
            (editor.floatingIconManager as any).handleAddIconClick()
            expect(editor.currentFocusedBlock.id).toBe('paragraph1');
            editor.slashCommandModule.hidePopup();
        });
    });

    describe('State Manager:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
                { id: 'divider', type: BlockType.Divider }
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

        it('updateContentChangesToModel should handle invalid blockelement', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            blockElement.id = 'invalid';
            expect(editor.stateManager.updateContentChangesToModel(blockElement, null)).toBeUndefined();
        });
    });

    describe('Block Renderer Manager:', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', type: BlockType.Paragraph, content: [{ id: 'paragraph1-content', type: ContentType.Text, content: 'Hello world' }] },
                {
                    id: 'calloutblock',
                    type: BlockType.Callout,
                    props: {
                        children: [
                        {
                            id: 'calloutchild1',
                            type: BlockType.Paragraph,
                            content: [{ id: 'callout-child1-content', type: ContentType.Text, content: 'Callout child 1' }]
                        },
                        {
                            id: 'calloutchild2',
                            type: BlockType.Paragraph,
                            content: [{ id: 'callout-child2-content', type: ContentType.Text, content: 'Callout child 2' }]
                        }
                    ]
                    }
                },
                {
                    id: 'toggleblock',
                    type: BlockType.CollapsibleParagraph,
                    content: [{ id: 'toggle-content-1', type: ContentType.Text, content: 'Click here to expand' }],
                    props: {
                        isExpanded: true,
                        children: [
                            {
                                id: 'togglechild1',
                                type: BlockType.Checklist,
                                content: [{ type: ContentType.Text, content: 'Todo' }]
                            },
                            {
                                id: 'togglechild2',
                                type: BlockType.Paragraph,
                                content: [{ type: ContentType.Text, content: 'Toggle child 2' }]
                            }
                        ]
                    }
                },
                { id: 'paragraph2', type: BlockType.Paragraph, content: [{ id: 'paragraph2-content', type: ContentType.Text, content: '' }] },
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
                editor.setFocusToBlock(blockElement);
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
                        // collapsible paragraph should be created outside the callout child as a sibling to callout parent
                        expect(editor.blocks.length).toBe(6);
                        expect(editor.blocks[2].type).toBe(BlockType.CollapsibleParagraph);
                        expect(editor.blocks[3].type).toBe(BlockType.Paragraph);
                        done();
                    }, 500);
                }, 300);
            });
        });

        it('transforming to special type inside collapsible', (done) => {
            setTimeout(()=>{
                const blockElement = editorElement.querySelector('#togglechild2') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                        // callout should be created outside the collapsible child as a sibling to collapsible parent
                        expect(editor.blocks.length).toBe(6);
                        expect(editor.blocks[3].type).toBe(BlockType.Callout);
                        expect(editor.blocks[4].type).toBe(BlockType.Paragraph);
                        expect(editor.currentFocusedBlock.id).toBe((editor.blocks[3].props as BaseChildrenProp).children[0].id);
                        done();
                    }, 500);
                }, 300);
            });
        });

        it('transforming to code block', (done) => {
            setTimeout(()=> {
                const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
                editor.setFocusToBlock(blockElement);
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
                        expect(editor.blocks.length).toBe(5);
                        expect(editor.blocks[3].type).toBe(BlockType.Code);
                        expect(editor.blocks[4].type).toBe(BlockType.Paragraph);
                        done();
                    }, 300);
                }, 200);
            });
        });

        it('should handle null values', (done) => {
            setTimeout(()=>{
                const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
                const contentElement = getBlockContentElement(blockElement);
                const originalContent = contentElement.cloneNode(true);
                
                expect(editor.blockRendererManager.reRenderBlockContent(null)).toBeUndefined();

                expect(editor.blockRendererManager.reRenderBlockContent({ id: 'invalid' })).toBeUndefined();

                contentElement.remove();
                expect(editor.blockRendererManager.reRenderBlockContent({ id: 'paragraph1' })).toBeUndefined();

                expect(editor.blockRendererManager.renderBlocks([])).toBeUndefined();

                blockElement.appendChild(originalContent);
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
                // Passing after element null should insert at last
                (editor.blockRendererManager as any).insertBlockIntoDOM(duplicate1, null);
                const allElems = editorElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;
                expect(allElems[allElems.length - 1].id).toBe('duplicate1');

                // Passing after element should insert after that element
                (editor.blockRendererManager as any).insertBlockIntoDOM(duplicate2, originalElement);
                expect(originalElement.nextElementSibling.id).toBe('duplicate2');

                done();
            });
        });
    });
});
