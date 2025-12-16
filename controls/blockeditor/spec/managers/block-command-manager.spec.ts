import { createElement, remove } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, IHeadingBlockSettings, ITableBlockSettings  } from '../../src/models/index';
import { createEditor } from '../common/util.spec';
import { BlockFactory } from '../../src/block-manager/services/index';
import { setCursorPosition, getBlockContentElement } from '../../src/common/utils/index';
import { BlockType, ContentType, CommandName } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { NodeCutter } from '../../src/block-manager/plugins/common/node';

describe('Block Command Manager:', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('Block Command actions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'heading3', blockType: BlockType.Heading, properties: { level: 3 }, content: [{ id: 'heading3-content', contentType: ContentType.Text, content: 'Hello world' }] },
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
                },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: '' }] },
                { id: 'quote', blockType: BlockType.Quote, content: [{ contentType: ContentType.Text, content: 'Quote block' }] },
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

        it('Transform ToggleBlocks during deletion action at the start of the block', () => {
            let blockElement = editorElement.querySelector('#toggleblock') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);
            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement: blockElement, mergeDirection: 'previous'
            });

            // Assert Model
            expect(editor.blocks.length).toBe(7);
            expect(editor.blocks[1].blockType).toBe(BlockType.Callout);
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[2].content[0].content).toBe("Click here to expand");
            expect((editor.blocks[2].properties as BaseChildrenProp).children.length).toBe(0);
            expect(editor.blocks[3].blockType).toBe(BlockType.Checklist);
            expect(editor.blocks[3].content[0].content).toBe("Todo");
            expect(editor.blocks[4].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[4].content[0].content).toBe("Toggle child 2");
            expect(editor.blocks[5].blockType).toBe(BlockType.Paragraph);
            const toggleBlock = editor.blocks.find(block => block.blockType === BlockType.CollapsibleParagraph);
            expect(toggleBlock).toBeUndefined();

            // Assert Dom
            blockElement = editorElement.querySelector('#toggleblock') as HTMLElement;
            expect(editor.blocks[2].blockType).toBe(BlockType.Paragraph);
            expect(blockElement.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect(blockElement.textContent).toBe("Click here to expand");
            const checlistEle: HTMLInputElement = blockElement.nextElementSibling as HTMLInputElement;
            // expect(checlistEle.id).toBe("togglechild1");
            // expect(checlistEle.textContent).toBe("Todo");
            // const toggleChild2: HTMLInputElement = checlistEle.nextElementSibling as HTMLInputElement;
            // expect(toggleChild2.id).toBe("togglechild2");
            // expect(toggleChild2.textContent).toBe("Toggle child 2");
        });

        it('Divider block deletion', () => {
            if (editor) editor.destroy();
            const blocks: BlockModel[] = [
                { id: 'divider', blockType: BlockType.Divider },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: '' }] },
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');
            const blockElement = editorElement.querySelector('#divider') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement, mergeDirection: 'previous'
            });
            // Assert Model - one block remains
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].id).toBe('paragraph2');
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);

            // Assert DOM - divider removed and only paragraph2 exists
            expect(editorElement.querySelector('#divider')).toBeNull();
            const allBlocks = editorElement.querySelectorAll('.e-block');
            expect(allBlocks.length).toBe(1);
            const onlyBlock = allBlocks[0] as HTMLElement;
            expect(onlyBlock.id).toBe('paragraph2');
            expect(onlyBlock.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
        });

        it('deleting a child block inside callout', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.blockManager.blockCommand.deleteBlock({
                blockElement, mergeDirection: 'previous'
            });

            // Assert Model - only one child remains in callout
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(1);
            expect(((editor.blocks[1].properties as BaseChildrenProp).children[0]).id).toBe('calloutchild1');

            // Assert DOM - deleted child removed; remaining child exists
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            expect(editorElement.querySelector('#calloutchild2')).toBeNull();
            const remaining = calloutEl.querySelector('#calloutchild1') as HTMLElement;
            expect(remaining).not.toBeNull();
            const outerNext = (calloutEl.nextElementSibling as HTMLElement);
            expect(outerNext && outerNext.id).toBe('toggleblock');
        });

        it('duplicating table block generates completely new IDs for table structure', () => {
            // 1. Insert a table block
            editor.addBlock(
                {
                    id: 'table_blk',
                    blockType: BlockType.Table,
                    properties: {
                        columns: [
                            { id: 'col_orig_1', headerText: 'Name' },
                            { id: 'col_orig_2', headerText: 'Age' }
                        ],
                        rows: [
                            {
                                id: 'row_orig_1',
                                cells: [
                                    {
                                        id: 'cell_orig_1',
                                        columnId: 'col_orig_1',
                                        blocks: [{
                                            id: 'blk_inner_1',
                                            blockType: BlockType.Paragraph,
                                            content: [{ contentType: ContentType.Text, content: 'John' }]
                                        }]
                                    },
                                    {
                                        id: 'cell_orig_2',
                                        columnId: 'col_orig_2',
                                        blocks: [{
                                            id: 'blk_inner_2',
                                            blockType: BlockType.Paragraph,
                                            content: [{ contentType: ContentType.Text, content: '30' }]
                                        }]
                                    }
                                ]
                            }
                        ]
                    }
                },
                'quote'
            );

            const tableBlockEle = editorElement.querySelector('#table_blk') as HTMLElement;
            editor.blockManager.blockCommand.duplicateBlock({ blockElement: tableBlockEle, direction: 'below' });

            // 2. Get source and duplicated blocks
            const sourceBlk = editor.blocks.find(b => b.id === 'table_blk') as BlockModel;
            const duplicatedBlk = editor.blocks[editor.blocks.length - 1] as BlockModel;

            const sourceProps = sourceBlk.properties as ITableBlockSettings;
            const dupProps = duplicatedBlk.properties as ITableBlockSettings;

            // 3. Basic structure checks
            expect(duplicatedBlk.id).not.toBe(sourceBlk.id);
            expect(duplicatedBlk.blockType).toBe(BlockType.Table);
            expect(dupProps.rows.length).toBe(sourceProps.rows.length);
            expect(dupProps.columns.length).toBe(sourceProps.columns.length);

            // 4. Deep ID regeneration checks
            const origColIds = new Set(sourceProps.columns.map(c => c.id));
            const origRowIds = new Set(sourceProps.rows.map(r => r.id));

            // Column IDs must be new
            dupProps.columns.forEach(col => {
                expect(origColIds.has(col.id)).toBe(false, `Column ID ${col.id} was reused`);
            });

            // Row IDs must be new
            dupProps.rows.forEach(row => {
                expect(origRowIds.has(row.id)).toBe(false, `Row ID ${row.id} was reused`);
            });

            // Cell IDs + columnId references must be updated correctly
            dupProps.rows.forEach((row, rIdx) => {
                row.cells.forEach((cell, cIdx) => {
                    const origCell = sourceProps.rows[rIdx].cells[cIdx];

                    // Cell ID must be new
                    expect(cell.id).not.toBe(origCell.id);

                    // columnId must point to the NEW column ID
                    const matchingNewCol = dupProps.columns.find(c => c.headerText === sourceProps.columns[cIdx].headerText);
                    expect(cell.columnId).toBe(matchingNewCol.id);
                    expect(cell.columnId).not.toBe(origCell.columnId);

                    // Inner blocks must have new IDs
                    cell.blocks.forEach((innerBlock, bIdx) => {
                        const origInner = origCell.blocks[bIdx];
                        expect(innerBlock.id).not.toBe(origInner.id);
                    });
                });
            });

            // 5. DOM assertions
            const duplicatedTableEle = tableBlockEle.nextElementSibling as HTMLElement;
            expect(duplicatedTableEle).toBeTruthy();
            expect(duplicatedTableEle.id).not.toBe(tableBlockEle.id);
            expect(duplicatedTableEle.id).toBe(duplicatedBlk.id);

            // Verify a few DOM cell IDs match model
            const firstDupCell = duplicatedTableEle.querySelector('td[data-row="1"][data-col="0"] .e-cell-blocks-container') as HTMLElement;
            const firstDupCellModelId = dupProps.rows[0].cells[0].id;
            expect(firstDupCell.id).toBe(firstDupCellModelId);

            const innerBlockInDom = firstDupCell.querySelector('.e-block') as HTMLElement;
            const innerBlockModelId = dupProps.rows[0].cells[0].blocks[0].id;
            expect(innerBlockInDom.id).toBe(innerBlockModelId);
        });

        it('duplicating code block', () => {
            const blockElement = editorElement.querySelector('#quote') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.addBlock({ id: 'code_blk', blockType: BlockType.Code, content: [ { contentType: 'Text', content: 'Hello world\nProgram starts' } ] }, 'quote');

            const codeBlockEle = editorElement.querySelector('#code_blk') as HTMLElement;
            editor.blockManager.blockCommand.duplicateBlock({ blockElement: codeBlockEle , direction: 'below' });

            // Assert Model
            const sourceBlk = editor.blocks.find(block => block.id === 'code_blk');
            const duplicatedTableBlk = editor.blocks[editor.blocks.length - 1];

            expect(duplicatedTableBlk.id).not.toBe(sourceBlk.id);
            expect(duplicatedTableBlk.content[0].content).toBe(sourceBlk.content[0].content);

            // Assert DOM
            const duplicatedTableBlkEle = codeBlockEle.nextElementSibling;
            expect(duplicatedTableBlkEle.id).not.toBe(codeBlockEle.id);
            expect(duplicatedTableBlkEle.textContent).toBe(codeBlockEle.textContent);
        });

        it('duplicating a child block inside callout', () => {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);

            editor.blockManager.blockCommand.duplicateBlock({ blockElement, direction: 'below' });

            // Assert Model
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(3);
            // Assert DOM - callout now has 3 child blocks
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            const childEls = calloutEl.querySelectorAll('.e-block');
            expect(childEls.length).toBe(3);
            // Ensure outer neighbors are unchanged
            const outerNext = (calloutEl.nextElementSibling as HTMLElement);
            expect(outerNext && outerNext.id).toBe('toggleblock');
        });

        it('moving a child block present inside callout', function () {
            const blockElement = editorElement.querySelector('#calloutchild2') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            editor.blockManager.blockCommand.moveBlock({
                fromBlockIds: ['calloutchild2'], toBlockId: 'calloutchild1'
            });
            // Assert Model
            expect((editor.blocks[1].properties as BaseChildrenProp).children.length).toBe(2);
            expect((editor.blocks[1].properties as BaseChildrenProp).children[0].id).toBe('calloutchild2');
            expect((editor.blocks[1].properties as BaseChildrenProp).children[1].id).toBe('calloutchild1');
            // Assert DOM - order reflected
            const moved = editorElement.querySelector('#calloutchild2') as HTMLElement;
            const next = moved.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe('calloutchild1');
            // Ensure outer neighbors are unchanged
            const calloutEl = editorElement.querySelector('#calloutblock') as HTMLElement;
            const outerNext = (calloutEl.nextElementSibling as HTMLElement);
            expect(outerNext && outerNext.id).toBe('toggleblock');
        });

        it('generateNewIdsForBlock should generate properly', () => {
            const newcontent = [
                BlockFactory.createTextContent({ id: 'heading3-content', contentType: ContentType.Text, content: 'Hello world' }),
                BlockFactory.createLabelContent({ id: 'progress', contentType: ContentType.Label }),
                BlockFactory.createMentionContent({ id: 'user1', contentType: ContentType.Mention }),
            ];
            editor.blockManager.blockService.replaceBlock(editor.blocks[0].id, {
                ...editor.blocks[0],
                content: newcontent
            });
            editor.blockManager.stateManager.updateManagerBlocks();
            editor.blockManager.blockRenderer.reRenderBlockContent(editor.blocks[0]);
            const labelId = editor.blocks[0].content[1].id;
            const mentionId = editor.blocks[0].content[2].id;
            const firstBlockId = editor.blocks[0].id;
            const firstBlockContentId = editor.blocks[0].content[0].id;
            const newBlock = editor.blockManager.blockService.generateNewIdsForBlock(editor.blocks[0]);
            // Assert Model
            expect(newBlock.id).not.toBe(firstBlockId);
            expect(newBlock.content[0].id).not.toBe(firstBlockContentId);
            expect(newBlock.content[1].id).not.toBe(labelId);
            expect(newBlock.content[2].id).not.toBe(mentionId);

            const child1Id = (editor.blocks[1].properties as BaseChildrenProp).children[0].id;
            const child1ContentId = (editor.blocks[1].properties as BaseChildrenProp).children[0].content[0].id;
            const newChildBlock = editor.blockManager.blockService.generateNewIdsForBlock((editor.blocks[1].properties as BaseChildrenProp).children[0]);
            expect(newChildBlock.id).not.toBe(child1Id);
            expect(newChildBlock.content[0].id).not.toBe(child1ContentId);

            // Assert DOM - DOM remains unchanged after id generation helper
            const headingEl = editorElement.querySelector('#heading3') as HTMLElement;
            expect(headingEl).not.toBeNull();
        });

        it('enter action on beggining of heading should maintain the blocktype', () => {
            const blockElement = editorElement.querySelector('#heading3') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.blockCommand.splitBlock();

            // Assert Model - new paragraph inserted before heading
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[1].blockType).toBe(BlockType.Heading);
            expect((editor.blocks[1].properties as IHeadingBlockSettings ).level).toBe(3);

            // Assert DOM - first block is new paragraph with id as heading3
            const transFormedEle = editorElement.querySelector('#heading3') as HTMLElement;
            expect(transFormedEle).not.toBeNull();
            const headingEle = transFormedEle.nextElementSibling as HTMLElement;
            expect(headingEle).not.toBeNull();
            expect(transFormedEle.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
            expect(headingEle.getAttribute('data-block-type')).toBe(BlockType.Heading);
            expect(headingEle.querySelector('h3')).not.toBeNull();
            const firstBlockEl = editorElement.querySelector('.e-block') as HTMLElement;
            expect(firstBlockEl).toBe(transFormedEle);
        });

        it('enter action on beggining of quote should maintain the blocktype', () => {
            const blockElement = editorElement.querySelector('#quote') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.blockCommand.splitBlock();

            // Assert Model - new paragraph inserted before quote
            expect(editor.blocks[4].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[5].blockType).toBe(BlockType.Quote);

            // Assert DOM - quote has previous paragraph sibling
            const transFormedEle = editorElement.querySelector('#quote') as HTMLElement;
            expect(transFormedEle).not.toBeNull();
            const quoteEle = transFormedEle.nextElementSibling as HTMLElement;
            expect(quoteEle).not.toBeNull();
            expect(quoteEle.getAttribute('data-block-type')).toBe(BlockType.Quote);
        });

        it('enter action on beggining of paragraph should proceed asusual', () => {
            const blockElement = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement = getBlockContentElement(blockElement) as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            setCursorPosition(contentElement, 0);

            editor.blockManager.blockCommand.splitBlock();

            // Assert Model - split into two paragraphs around original paragraph2
            expect(editor.blocks[3].blockType).toBe(BlockType.Paragraph);
            expect(editor.blocks[4].blockType).toBe(BlockType.Paragraph);

            // Assert DOM - a new paragraph is inserted before paragraph2
            const transFormedEle = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(transFormedEle).not.toBeNull();
            const para2 = transFormedEle.nextElementSibling as HTMLElement;
            expect(para2).not.toBeNull();
            expect(para2.getAttribute('data-block-type')).toBe(BlockType.Paragraph);
        });

    });

    describe('NodeCutter -> splitContent method checking - DOM fragment splitting', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeAll(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
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

        // Helper to create content elements for testing
        const setupContentElement = (html: string): HTMLElement => {
            const element = document.createElement('div');
            element.innerHTML = html;
            return element;
        };

        // Helper to verify fragment content
        const fragmentToHTML = (fragment: DocumentFragment): string => {
            const div = document.createElement('div');
            div.appendChild(fragment.cloneNode(true));
            return div.innerHTML;
        };

        it('should split simple text node correctly', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 5;

            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);

            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('Hello');
            expect(fragmentToHTML(result.afterFragment)).toBe(' World');
        });

        it('should split at beginning of text node', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 0; // Beginning of text

            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('');
            expect(fragmentToHTML(result.afterFragment)).toBe('Hello World');
        });

        it('should split at end of text node', () => {
            // Setup
            const contentElement = setupContentElement('Hello World');
            const splitNode = contentElement.firstChild;
            const splitOffset = 11; // End of text
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('Hello World');
            expect(fragmentToHTML(result.afterFragment)).toBe('');
        });

        it('should split text within a single element node', () => {
            // Setup
            const contentElement = setupContentElement('<strong>Hello World</strong>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 5;
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            expect(((result.beforeFragment.childNodes[0] as HTMLElement).tagName)).toBe('STRONG');
            expect(((result.beforeFragment.childNodes[0] as HTMLElement).textContent)).toBe('Hello');
            expect(((result.afterFragment.childNodes[0] as HTMLElement).tagName)).toBe('STRONG');
            expect(((result.afterFragment.childNodes[0] as HTMLElement).textContent)).toBe(' World');
        });

        it('should split between multiple element nodes', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong>Hello</strong><em>World</em>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 3;

            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).textContent).toBe('Hel');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('lo');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

    it('should handle nested element splitting', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong><em>Hello</em></strong><em>World</em>');
            const emElement = contentElement.querySelector('em');
            const splitNode = emElement.firstChild;
            const splitOffset = 3;
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            
            const beforeEm = (result.beforeFragment.childNodes[1] as HTMLElement).querySelector('em');
            expect(beforeEm.textContent).toBe('Hel');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            
            const afterEm = (result.afterFragment.childNodes[0] as HTMLElement).querySelector('em');
            expect(afterEm.textContent).toBe('lo');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

        it('should handle case when splitNode is an element node itself', () => {
            // Setup
            const contentElement = setupContentElement('<span>Hi</span><strong>Hello</strong><em>World</em>');
            const strongElement = contentElement.querySelector('strong');
            // Split at the strong element itself
            const splitNode = strongElement.firstChild;
            const splitOffset = 0;
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('Hello');
            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });

        it('should handle content element with no children', () => {
            // Setup
            const contentElement = document.createElement('div');
            // No children
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, contentElement, 0);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toBe('');
            expect(fragmentToHTML(result.afterFragment)).toBe('');
        });

        it('should preserve inline styles in split elements', () => {
            // Setup
            const contentElement = setupContentElement('<span style="font-weight:bold;">Hi</span><strong style="color:red;">Hello</strong>');
            const strongElement = contentElement.querySelector('strong');
            const splitNode = strongElement.firstChild;
            const splitOffset = 3;
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(fragmentToHTML(result.beforeFragment)).toContain('style="font-weight:bold;"');
            expect(fragmentToHTML(result.beforeFragment)).toContain('style="color:red;"');
            expect(fragmentToHTML(result.beforeFragment)).toContain('Hel');
            
            expect(fragmentToHTML(result.afterFragment)).toContain('style="color:red;"');
            expect(fragmentToHTML(result.afterFragment)).toContain('lo');
        });

        it('should handle deeply nested structures', () => {
            // Setup
            const contentElement = setupContentElement(
                '<span>Hi</span><strong id="rootid"><em><i> Hello </i></em></strong><em>World</em>'
            );
            const italic = contentElement.querySelector('i');
            const splitNode = italic.firstChild;
            const splitOffset = 4;
            
            // Execute
            const result = NodeCutter.splitContent(contentElement, splitNode, splitOffset);
            
            // Assert
            expect(result.beforeFragment.childNodes.length).toBe(2);
            expect((result.beforeFragment.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((result.beforeFragment.childNodes[0] as HTMLElement).textContent).toBe('Hi');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).tagName).toBe('STRONG');
            expect((result.beforeFragment.childNodes[1] as HTMLElement).textContent).toBe(' Hel');
            expect((result.beforeFragment.childNodes[1].childNodes[0] as HTMLElement).tagName).toBe('EM');
            expect((result.beforeFragment.childNodes[1].childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('I');

            expect(result.afterFragment.childNodes.length).toBe(2);
            expect((result.afterFragment.childNodes[0] as HTMLElement).tagName).toBe('STRONG');
            expect((result.afterFragment.childNodes[0] as HTMLElement).textContent).toBe('lo ');
            expect((result.afterFragment.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[0].childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('I');

            expect((result.afterFragment.childNodes[1] as HTMLElement).tagName).toBe('EM');
            expect((result.afterFragment.childNodes[1] as HTMLElement).textContent).toBe('World');
        });
    });

    describe('Check content merging through deletion', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
             const blocks: BlockModel[] = [
                { id: 'paragraph1', blockType: BlockType.Paragraph, content: [{ id: 'paragraph1-content', contentType: ContentType.Text, content: 'Hello world' }] },
                { id: 'paragraph2', blockType: BlockType.Paragraph, content: [{ id: 'paragraph2-content', contentType: ContentType.Text, content: 'Paragraph 2' }] },
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

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('should delete contents and merge into empty block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            contentElement1.textContent = '';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement1);
            editor.blockManager.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            // Assert Model
            expect(editor.blocks[0].id).toBe('paragraph2');
            expect(editor.blocks[0].content[0].content).toBe('Paragraph 2');
            // Assert DOM
            // paragraph1 removed since it is empty and paragraph2 is merged up
            expect(editorElement.querySelector('#paragraph1')).toBeNull();
            const para2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(para2.textContent).toBe('Paragraph 2');
            const next = para2.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe('paragraph3');
        });

        it('should delete contents and merge into formatted block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            editor.setSelection('paragraph1-content', 6, 11);
            editor.executeToolbarAction(CommandName.Bold);

            editor.blockManager.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            // Assert Model
            expect(editor.blocks[0].content.length).toBe(3);
            expect(editor.blocks[0].content[0].content).toBe('Hello ');
            expect(editor.blocks[0].content[1].content).toBe('world');
            expect(editor.blocks[0].content[2].content).toBe('Paragraph 2');
            // Assert DOM - paragraph2 removed, neighbor after paragraph1 is paragraph3
            const para1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            expect(para1.textContent).toBe('Hello worldParagraph 2');
            expect(editorElement.querySelector('#paragraph2')).toBeNull();
            const next = para1.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe('paragraph3');
        });

        it('should delete formatted contents and merge into unformatted block properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph3') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            editor.blockManager.setFocusToBlock(blockElement2);
            setCursorPosition(contentElement2, 0);
            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement: blockElement2,
                mergeDirection: 'previous'
            });

            // Assert Model
            expect(editor.blocks[1].content.length).toBe(3);
            expect(editor.blocks[1].content[0].content).toBe('Paragraph 2');
            expect(editor.blocks[1].content[1].content).toBe('Bold');
            expect(editor.blocks[1].content[2].content).toBe('Italic');
            // Assert DOM - paragraph3 removed; paragraph2 text and neighbor
            const para2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            expect(para2.textContent).toBe('Paragraph 2BoldItalic');
            expect(editorElement.querySelector('#paragraph3')).toBeNull();
            const next = para2.nextElementSibling as HTMLElement;
            expect(next && next.id).toBe('paragraph4');
        });

        it('Check Model update using updateContentModelsForDeletion, it should handle empty content model deletions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement1 = blockElement1.querySelector('.e-block-content') as HTMLElement;

            const blockElement2 = editorElement.querySelector('#paragraph2') as HTMLElement;
            const contentElement2 = blockElement2.querySelector('.e-block-content') as HTMLElement;

            const originalContent = editor.blocks[1].content.slice();
            //Merging empty content into a block with content
            editor.blocks[1].content = [];
            (editor.blockManager.blockCommand as any).updateContentModelsForDeletion(
                contentElement1, contentElement2,
                editor.blocks[0], editor.blocks[1]
            );
            // Assert Model
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Hello world');

            editor.blocks[1].content = originalContent;
            //Merging a block with content into a empty content
            editor.blocks[0].content = [];
            (editor.blockManager.blockCommand as any).updateContentModelsForDeletion(
                contentElement1, contentElement2,
                editor.blocks[0], editor.blocks[1]
            );
            // Assert Model
            expect(editor.blocks[0].content.length).toBe(1);
            expect(editor.blocks[0].content[0].content).toBe('Paragraph 2');
        });

        it('should handle divider deletions properly', () => {
            const blockElement1 = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement1);
            editor.selectAllBlocks();
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));
            expect(editor.blocks.length).toBe(1);

            // Add a divider block
            const blockElement = editorElement.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blockElement);
            const contentElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, 0);
            contentElement.textContent = '/';
            editor.blockManager.stateManager.updateContentOnUserTyping(blockElement);
            setCursorPosition(contentElement, 1);
            editorElement.querySelector('.e-mention.e-editable-element').dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', bubbles: true }));
            const slashCommandElement = document.querySelector('.e-popup.e-blockeditor-command-menu') as HTMLElement;
            // click divider li element inside the popup
            const dividerLiElement = slashCommandElement.querySelector('li[data-value="Divider"]') as HTMLElement;
            dividerLiElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            // Assert Model after insert
            expect(editor.blocks[0].blockType).toBe(BlockType.Divider);
            expect(editor.blocks[1].blockType).toBe(BlockType.Paragraph);
            // Assert DOM after insert
            expect(editorElement.querySelector('.e-divider-block')).not.toBeNull();
            
            // Delete the divider block
            const dividerElement = editorElement.querySelector('.e-divider-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(dividerElement);
            editor.blockManager.blockCommand.deleteBlockAtCursor({
                blockElement: dividerElement,
                mergeDirection: 'previous'
            });

            // Deleting the divider, focus should be set to next block
            expect(editor.blockManager.currentFocusedBlock.id).toBe(editor.blocks[0].id);
            // Assert Model - divider removed
            expect(editor.blocks.length).toBe(1);
            expect(editor.blocks[0].blockType).toBe(BlockType.Paragraph);
            // Assert DOM - divider removed
            expect(editorElement.querySelector('.e-divider-block')).toBeNull();
            expect(editorElement.querySelector('.e-block').getAttribute('data-block-type')).toBe(BlockType.Paragraph);
        });

        it('should handle null values properly', () => {
            const blockElement = editorElement.querySelector('#paragraph1') as HTMLElement;
            const contentElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            expect(editor.blockManager.blockCommand.addBulkBlocks({ blocks: []})).toBeUndefined();

            expect(editor.blockManager.blockCommand.deleteBlock({ blockElement: null })).toBeUndefined();

            expect(editor.blockManager.blockCommand.deleteBlock({ blockElement: document.createElement('div') })).toBeUndefined();

            expect(editor.blockManager.blockCommand.moveBlock({ fromBlockIds: [] })).toBeUndefined();

            expect(editor.blockManager.blockCommand.moveBlock({ fromBlockIds: ['invalid'], toBlockId: 'invalid' })).toBeUndefined();

            expect(editor.blockManager.blockCommand.duplicateBlock({ blockElement: null, direction: 'below' })).toBeUndefined();

            expect(editor.blockManager.blockCommand.duplicateBlock({ blockElement: document.createElement('div'), direction: 'below' })).toBeUndefined();

            expect(editor.blockManager.blockCommand.handleMultipleBlockDeletion([{ id: 'invalid' }, { id: 'invalid' }])).toBe(false);

            expect(editor.blockManager.blockCommand.deleteBlockAtCursor({ blockElement: null })).toBeUndefined();
            expect(editor.blockManager.blockCommand.deleteBlockAtCursor({ blockElement: blockElement, mergeDirection: 'next' })).toBeUndefined();

            expect(editor.blockManager.blockCommand.transformToggleBlocksAsRegular(document.createElement('div'))).toBeUndefined();

            const prevFocused = editor.blockManager.currentFocusedBlock;
            editor.blockManager.currentFocusedBlock = null;
            expect(editor.blockManager.adjustViewForFocusedBlock()).toBeUndefined();
            editor.blockManager.currentFocusedBlock = prevFocused;
        });
        
    });
});