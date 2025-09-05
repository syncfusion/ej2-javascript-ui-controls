import { BaseChildrenProp, BaseStylesProp, BlockModel, ChecklistProps, CodeProps, CollapsibleProps, ContentModel, HeadingProps, ImageProps, LinkContentProps } from '../../src/blockeditor/models/index';
import { BlockType, ContentType } from '../../src/blockeditor/base/enums';
import { BlockService } from '../../src/blockeditor/services/block-service';
import { getBlockModelById } from '../../src/index';

describe('BlockService', () => {
    let blockService: BlockService;
    let blocks: BlockModel[];

    beforeEach(() => {
        // Initialize with some sample blocks
        blocks = [
            {
                id: 'block1',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content1', type: ContentType.Text, content: 'First paragraph content' }
                ],
                indent: 0
            },
            {
                id: 'block2',
                type: BlockType.Heading,
                props: { level: 1 },
                content: [
                    { id: 'content2', type: ContentType.Text, content: 'Heading content' }
                ],
                indent: 0
            },
            {
                id: 'block3',
                type: BlockType.Paragraph,
                content: [
                    { id: 'content3', type: ContentType.Text, content: 'Second paragraph content' }
                ],
                indent: 0
            }
        ];

        // Initialize service with test blocks
        blockService = new BlockService(blocks);
    });

    describe('addBlock method', () => {
        it('should add a new block after the target block', () => {
            // Create a new block
            const newBlock: BlockModel = {
                id: 'newBlock',
                type: BlockType.Paragraph,
                content: [
                    { id: 'newContent', type: ContentType.Text, content: 'New paragraph content' }
                ]
            };

            // Add block after block2
            const result = blockService.addBlock({
                block: newBlock,
                targetBlockId: 'block2',
                isAfter: true
            });

            // Check the block was added correctly
            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[2].id).toBe('newBlock');
            expect(blocks[2].type).toBe(BlockType.Paragraph);
            expect(blocks[2].content[0].content).toBe('New paragraph content');
        });

        it('should add a new block before the target block', () => {
            const newBlock: BlockModel = {
                id: 'newBlock',
                type: BlockType.Heading,
                props: { level: 2 },
                content: [
                    { id: 'newContent', type: ContentType.Text, content: 'Subheading' }
                ]
            };

            // Add block before block2
            const result = blockService.addBlock({
                block: newBlock,
                targetBlockId: 'block2',
                isAfter: false
            });

            // Check the block was added correctly
            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[1].id).toBe('newBlock');
            expect(blocks[1].type).toBe(BlockType.Heading);
            expect((blocks[1].props as HeadingProps).level).toBe(2);
        });

        it('should add a block at the end if no target block is specified', () => {
            const newBlock: BlockModel = {
                id: 'newBlock',
                type: BlockType.Paragraph,
                content: [
                    { id: 'newContent', type: ContentType.Text, content: 'End paragraph' }
                ]
            };

            // Add block without target
            const result = blockService.addBlock({
                block: newBlock
            });

            // Check the block was added at the end
            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[3].id).toBe('newBlock');
        });

        it('should handle adding a block to an empty block array', () => {
            // Create a service with empty blocks
            const emptyBlocks: BlockModel[] = [];

            const newBlock: BlockModel = {
                id: 'newBlock',
                type: BlockType.Paragraph,
                content: [
                    { id: 'newContent', type: ContentType.Text, content: 'First block' }
                ]
            };

            blockService.blocks = emptyBlocks;
            // Add block to empty array
            const result = blockService.addBlock({
                block: newBlock
            });

            // Check the block was added correctly
            expect(result).not.toBeNull();
            expect(emptyBlocks.length).toBe(1);
            expect(emptyBlocks[0].id).toBe('newBlock');
        });

        it('should add a block as a child of a parent block', () => {
            // Create a parent block with children array
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [{
                        id: 'childBlock1',
                        type: BlockType.Paragraph,
                        parentId: 'parentBlock',
                        content: [{ type: ContentType.Text, content: 'Child content 1' }]
                    }]
                }
            };

            // Add parent block to array
            blocks.push(parentBlock);

            // Create child block
            const childBlock: BlockModel = {
                id: 'childBlock2',
                type: BlockType.Paragraph,
                parentId: 'parentBlock',
                content: [{ type: ContentType.Text, content: 'Child content 2' }]
            };

            // Add child block to parent
            const result = blockService.addBlock({
                block: childBlock,
                targetBlockId: 'childBlock1'
            });

            // Check child block was added correctly
            expect(result).not.toBeNull();
            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(2);
            expect((parentBlock.props as BaseChildrenProp).children[1].id).toBe('childBlock2');
            expect((parentBlock.props as BaseChildrenProp).children[1].parentId).toBe('parentBlock');
        });

        it('should handle adding block with no content array', () => {
            // Block without content array
            const blockWithoutContent: BlockModel = {
                id: 'blockWithoutContent',
                type: BlockType.Divider
            };

            const result = blockService.addBlock({
                block: blockWithoutContent
            });

            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[3].id).toBe('blockWithoutContent');
            expect(blocks[3].content).toBeUndefined();
        });

        it('should preserve all block properties when adding', () => {
            // Block with various properties
            const blockWithProperties: BlockModel = {
                id: 'complexBlock',
                type: BlockType.Checklist,
                indent: 2,
                cssClass: 'custom-class',
                content: [{ id: 'content', type: ContentType.Text, content: 'Complex content' }],
                props: {
                    isChecked: true
                }
            };

            const result = blockService.addBlock({
                block: blockWithProperties
            });

            expect(blocks[3].indent).toBe(2);
            expect((blocks[3].props as ChecklistProps).isChecked).toBe(true);
            expect(blocks[3].cssClass).toBe('custom-class');
        });

        it('should add multiple blocks in sequence', () => {
            // Add three blocks in sequence
            const block1: BlockModel = {
                id: 'sequence1',
                type: BlockType.Paragraph,
                content: [{ id: 'content1', type: ContentType.Text, content: 'First' }]
            };

            const block2: BlockModel = {
                id: 'sequence2',
                type: BlockType.Paragraph,
                content: [{ id: 'content2', type: ContentType.Text, content: 'Second' }]
            };

            const block3: BlockModel = {
                id: 'sequence3',
                type: BlockType.Paragraph,
                content: [{ id: 'content3', type: ContentType.Text, content: 'Third' }]
            };

            blockService.addBlock({ block: block1 });
            blockService.addBlock({ block: block2 });
            blockService.addBlock({ block: block3 });

            expect(blocks.length).toBe(6);
            expect(blocks[3].id).toBe('sequence1');
            expect(blocks[4].id).toBe('sequence2');
            expect(blocks[5].id).toBe('sequence3');
        });

        it('should handle adding block when target block is not found', () => {
            const newBlock: BlockModel = {
                id: 'newBlock',
                type: BlockType.Paragraph,
                content: [{ id: 'content', type: ContentType.Text, content: 'Content' }]
            };

            // Try to add after a non-existent block
            const result = blockService.addBlock({
                block: newBlock,
                targetBlockId: 'nonExistentId',
                isAfter: true
            });

            // Should add at the end since target wasn't found
            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[3].id).toBe('newBlock');
        });

        it('should handle adding a block with children', () => {
            const parentWithChildren: BlockModel = {
                id: 'parentWithChildren',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Parent' }],
                props: {
                    children: [
                        {
                            id: 'child1',
                            type: BlockType.Paragraph,
                            parentId: 'parentWithChildren',
                            content: [{ id: 'childContent', type: ContentType.Text, content: 'Child' }]
                        }
                    ]
                }
            };

            const result = blockService.addBlock({
                block: parentWithChildren
            });

            expect(result).not.toBeNull();
            expect(blocks.length).toBe(4);
            expect(blocks[3].id).toBe('parentWithChildren');
            expect((blocks[3].props as BaseChildrenProp).children.length).toBe(1);
            expect((blocks[3].props as BaseChildrenProp).children[0].id).toBe('child1');
        });
    });

    describe('removeBlock method', () => {
        it('should remove a block by ID', () => {
            // Delete block2
            blockService.removeBlock({
                blockId: 'block2'
            });

            // Check block was removed
            expect(blocks.length).toBe(2);
            expect(blocks[0].id).toBe('block1');
            expect(blocks[1].id).toBe('block3');
        });

        it('should handle removing a non-existent block', () => {
            const initialLength = blocks.length;

            // Try to delete a non-existent block
            blockService.removeBlock({
                blockId: 'nonExistentBlock'
            });

            // Check blocks array is unchanged
            expect(blocks.length).toBe(initialLength);
        });

        it('should remove a child block from parent', () => {
            // Create a parent block with a child
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent', type: ContentType.Text, content: 'Child content' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Delete the child block
            blockService.removeBlock({
                blockId: 'childBlock'
            });

            // Check child was removed
            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(0);
        });

        it('should remove first block in the array', () => {
            blockService.removeBlock({
                blockId: 'block1'
            });

            expect(blocks.length).toBe(2);
            expect(blocks[0].id).toBe('block2');
            expect(blocks[1].id).toBe('block3');
        });

        it('should remove last block in the array', () => {
            blockService.removeBlock({
                blockId: 'block3'
            });

            expect(blocks.length).toBe(2);
            expect(blocks[0].id).toBe('block1');
            expect(blocks[1].id).toBe('block2');
        });

        it('should handle removing a block from an array with only one block', () => {
            const singleBlockArray: BlockModel[] = [
                {
                    id: 'singleBlock',
                    type: BlockType.Paragraph,
                    content: [{ id: 'content', type: ContentType.Text, content: 'Content' }]
                }
            ];

            blockService.blocks = singleBlockArray;
            blockService.removeBlock({
                blockId: 'singleBlock'
            });

            expect(singleBlockArray.length).toBe(0);
        });

        it('should handle removing multiple blocks one after another', () => {
            blockService.removeBlock({
                blockId: 'block1'
            });

            blockService.removeBlock({
                blockId: 'block2'
            });

            expect(blocks.length).toBe(1);
            expect(blocks[0].id).toBe('block3');
        });

        it('should handle removing a block with children', () => {
            // Create a parent block with children
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child content 1' }]
                        },
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child content 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Remove parent block
            blockService.removeBlock({
                blockId: 'parentBlock'
            });

            expect(blocks.length).toBe(3);
            expect(blocks.find(b => b.id === 'parentBlock')).toBeUndefined();
        });

        it('should handle removing one of multiple children from a parent', () => {
            // Create a parent block with multiple children
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child content 1' }]
                        },
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child content 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Remove one child
            blockService.removeBlock({
                blockId: 'childBlock1'
            });

            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(1);
            expect((parentBlock.props as BaseChildrenProp).children[0].id).toBe('childBlock2');
        });
    });

    describe('moveBlock method', () => {
        it('should move a block to a new position', () => {
            // Move block1 to after block3
            blockService.moveBlocks({
                blockIds: ['block1'],
                toBlockId: 'block3'
            });

            // Check block order
            expect(blocks.length).toBe(3);
            expect(blocks[0].id).toBe('block2');
            expect(blocks[1].id).toBe('block3');
            expect(blocks[2].id).toBe('block1');
        });

        it('should move multiple blocks together', () => {
            // Move block1 and block2 after block3
            blockService.moveBlocks({
                blockIds: ['block1', 'block2'],
                toBlockId: 'block3'
            });

            // Check block order
            expect(blocks.length).toBe(3);
            expect(blocks[0].id).toBe('block3');
            expect(blocks[1].id).toBe('block1');
            expect(blocks[2].id).toBe('block2');
        });

        it('should move a block into a parent as a child', () => {
            // Create a parent block
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [{
                        id: 'childBlock1',
                        type: BlockType.Paragraph,
                        parentId: 'parentBlock',
                        content: [{ type: ContentType.Text, content: 'Child content 1' }]
                    }]
                }
            };

            blocks.push(parentBlock);

            // Move block1 to be a child of parentBlock
            blockService.moveBlocks({
                blockIds: ['block1'],
                toBlockId: 'childBlock1'
            });

            // Check block1 is now a child of parentBlock
            expect(blocks.length).toBe(3); // Original array lost one block
            expect(blocks[0].id).toBe('block2');
            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(2);
            expect((parentBlock.props as BaseChildrenProp).children[1].id).toBe('block1');
            expect((parentBlock.props as BaseChildrenProp).children[1].parentId).toBe('parentBlock');
        });

        it('should move a child block out to root level', () => {
            // Create a parent block with a child
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent', type: ContentType.Text, content: 'Child content' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Move childBlock to root level after block2
            blockService.moveBlocks({
                blockIds: ['childBlock'],
                toBlockId: 'block2'
            });

            // Check childBlock is now at root level
            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(0);
            expect(blocks.length).toBe(5);
            expect(blocks[2].id).toBe('childBlock');
            expect(blocks[2].parentId).toBe('');
        });

        it('should move block to the beginning of the array', () => {
            // Move the last block to the beginning
            blockService.moveBlocks({
                blockIds: ['block3'],
                toBlockId: 'block1',
                isMovingUp: true
            });

            expect(blocks.length).toBe(3);
            expect(blocks[0].id).toBe('block3');
            expect(blocks[1].id).toBe('block1');
            expect(blocks[2].id).toBe('block2');
        });

        it('should move block to the end of the array', () => {
            // Move the first block to the end
            blockService.moveBlocks({
                blockIds: ['block1'],
                toBlockId: 'block3'
            });

            expect(blocks.length).toBe(3);
            expect(blocks[0].id).toBe('block2');
            expect(blocks[1].id).toBe('block3');
            expect(blocks[2].id).toBe('block1');
        });

        it('should handle moving blocks when target or source not found', () => {
            // Initial block count
            const initialLength = blocks.length;

            // Try to move with non-existent source
            blockService.moveBlocks({
                blockIds: ['nonExistentSource'],
                toBlockId: 'block2'
            });

            // Nothing should change
            expect(blocks.length).toBe(initialLength);
            expect(blocks[0].id).toBe('block1');

            // Try to move with non-existent target
            blockService.moveBlocks({
                blockIds: ['block1'],
                toBlockId: 'nonExistentTarget'
            });

            // Nothing should change
            expect(blocks.length).toBe(initialLength);
            expect(blocks[0].id).toBe('block1');
        });

        it('should handle moving multiple children blocks from parent to root', () => {
            // Create a parent with multiple children
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child 1' }]
                        },
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Move both children to root
            blockService.moveBlocks({
                blockIds: ['childBlock1', 'childBlock2'],
                toBlockId: 'block3'
            });

            // Check both children moved to root
            expect((parentBlock.props as BaseChildrenProp).children.length).toBe(0);
            expect(blocks.length).toBe(6);
            expect(blocks[3].id).toBe('childBlock1');
            expect(blocks[4].id).toBe('childBlock2');
        });

        it('should handle moving multiple blocks from different parents', () => {
            // Create two parent blocks with children
            const parentBlock1: BlockModel = {
                id: 'parentBlock1',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent1', type: ContentType.Text, content: 'Toggle 1' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock1',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child 1' }]
                        }
                    ]
                }
            };

            const parentBlock2: BlockModel = {
                id: 'parentBlock2',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent2', type: ContentType.Text, content: 'Toggle 2' }],
                props: {
                    children: [
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock2',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock1, parentBlock2);

            // Move children from both parents to root
            blockService.moveBlocks({
                blockIds: ['childBlock1', 'childBlock2'],
                toBlockId: 'block3'
            });

            // Check all children moved properly
            expect((parentBlock1.props as BaseChildrenProp).children.length).toBe(0);
            expect((parentBlock2.props as BaseChildrenProp).children.length).toBe(0);
            expect(blocks.length).toBe(7);
            expect(blocks[4].id).toBe('childBlock1');
            expect(blocks[3].id).toBe('childBlock2');
        });

        it('should handle moving blocks from root to different parent nodes', () => {
            // Create two parent blocks with children
            const parentBlock1: BlockModel = {
                id: 'parentBlock1',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent1', type: ContentType.Text, content: 'Toggle 1' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock1',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child 1' }]
                        }
                    ]
                }
            };

            const parentBlock2: BlockModel = {
                id: 'parentBlock2',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent2', type: ContentType.Text, content: 'Toggle 2' }],
                props: {
                    children: [
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock2',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock1, parentBlock2);

            // Move block1 to parent1
            blockService.moveBlocks({
                blockIds: ['block1'],
                toBlockId: 'childBlock1'
            });

            // Move block2 to parent2
            blockService.moveBlocks({
                blockIds: ['block2'],
                toBlockId: 'childBlock2'
            });

            expect((parentBlock1.props as BaseChildrenProp).children.length).toBe(2);
            expect((parentBlock1.props as BaseChildrenProp).children[1].id).toBe('block1');
            expect((parentBlock2.props as BaseChildrenProp).children.length).toBe(2);
            expect((parentBlock2.props as BaseChildrenProp).children[1].id).toBe('block2');
            expect(blocks.length).toBe(3);
        });
    });

    describe('duplicateBlock method', () => {
        it('should create a duplicate of a block with new ID', () => {
            // Duplicate block2
            const duplicated = blockService.duplicateBlock({
                blockId: 'block2'
            });

            // Check duplication was successful
            expect(duplicated).toBeDefined();
            expect(duplicated.type).toBe(BlockType.Heading);
            expect((duplicated.props as HeadingProps).level).toBe(1);
            expect(duplicated.content[0].content).toBe('Heading content');
            expect(duplicated.id).not.toBe('block2'); // Should have new ID

            // Duplicating doesn't automatically add to blocks array
            expect(blocks.length).toBe(3);
        });

        it('should duplicate block with all properties and structure', () => {
            // Create a complex block
            const complexBlock: BlockModel = {
                id: 'complexBlock',
                type: BlockType.Checklist,
                indent: 2,
                cssClass: 'custom-class',
                content: [
                    { id: 'content1', type: ContentType.Text, content: 'First part', props: { styles: { bold: true } } },
                    { id: 'content2', type: ContentType.Text, content: 'Second part', props: { styles: { italic: true } } }
                ],
                props: {
                    isChecked: true
                }
            };

            blocks.push(complexBlock);

            // Duplicate the complex block
            const duplicated = blockService.duplicateBlock({
                blockId: 'complexBlock'
            });

            // Check all properties were duplicated
            expect(duplicated.id).not.toBe('complexBlock'); // New ID
            expect(duplicated.type).toBe(BlockType.Checklist);
            expect(duplicated.indent).toBe(2);
            expect((duplicated.props as ChecklistProps).isChecked).toBe(true);
            expect(duplicated.cssClass).toBe('custom-class');
            expect(duplicated.content.length).toBe(2);
            expect(duplicated.content[0].content).toBe('First part');
            expect((duplicated.content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect(duplicated.content[1].content).toBe('Second part');
            expect((duplicated.content[1].props as BaseStylesProp).styles.italic).toBe(true);
            expect(duplicated.content[0].id).not.toBe('content1'); // New content IDs
            expect(duplicated.content[1].id).not.toBe('content2');
        });

        it('should duplicate a block with child blocks', () => {
            // Create a parent block with children
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock1',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent1', type: ContentType.Text, content: 'Child 1' }]
                        },
                        {
                            id: 'childBlock2',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent2', type: ContentType.Text, content: 'Child 2' }]
                        }
                    ]
                }
            };

            blocks.push(parentBlock);

            // Duplicate the parent block
            const duplicated = blockService.duplicateBlock({
                blockId: 'parentBlock'
            });

            // Check duplication was successful
            expect(duplicated.type).toBe(BlockType.CollapsibleParagraph);
            expect(duplicated.content[0].content).toBe('Toggle header');
            expect((duplicated.props as BaseChildrenProp).children.length).toBe(2);
            expect((duplicated.props as BaseChildrenProp).children[0].parentId).toBe(duplicated.id); // Child should reference new parent
            expect((duplicated.props as BaseChildrenProp).children[0].content[0].content).toBe('Child 1');
            expect((duplicated.props as BaseChildrenProp).children[1].content[0].content).toBe('Child 2');
        });
    });

    describe('updateBlock method', () => {

        it('should handle updating a non-existent block', () => {
            // Try to update a non-existent block
            const result = blockService.updateBlock('non-existent', { cssClass: 'new-class' });

            // Should return null for non-existent block
            expect(result).toBeNull();
        });

        it('should handle updating a non-existent content model', () => {
            const properties = { content: [{ id: 'non-existent', content: 'New content' }] };
            expect(() => blockService.updateBlock('block1', properties)).toThrow(new Error('Content with ID non-existent not found'));
        });

        it('should update simple properties of a block', () => {
            // Update simple properties of block1
            const result = blockService.updateBlock('block1', {
                cssClass: 'new-class',
                indent: 2,
            });

            // Check that properties were updated
            expect(result).not.toBeNull();
            expect(result.cssClass).toBe('new-class');
            expect(result.indent).toBe(2);

            // Verify that it's also updated in the blocks array
            const updatedBlock = getBlockModelById('block1', blocks);
            expect(updatedBlock.cssClass).toBe('new-class');
            expect(updatedBlock.indent).toBe(2);
        });

        it('should update properties of a child block', () => {
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent', type: ContentType.Text, content: 'Child content' }],
                            indent: 0
                        }
                    ]
                }
            };

            blocks.push(parentBlock);
            // Update simple properties of block1
            const result = blockService.updateBlock('childBlock', {
                cssClass: 'new-class',
                indent: 2,
                props: {
                    isExpanded: true
                }
            });

            // Check that properties were updated
            expect(result).not.toBeNull();
            expect(result.cssClass).toBe('new-class');
            expect(result.indent).toBe(2);
            expect((result.props as CollapsibleProps).isExpanded).toBe(true);

            // Verify that it's also updated in the blocks array
            const updatedBlock = getBlockModelById('childBlock', blocks);
            expect(updatedBlock.cssClass).toBe('new-class');
            expect(updatedBlock.indent).toBe(2);
            expect((updatedBlock.props as CollapsibleProps).isExpanded).toBe(true);
        });

        it('should update content properties', () => {
            // Update content of block1
            const result = blockService.updateBlock('block1', {
                content: [
                    { id: 'content1', content: 'Updated content' }
                ]
            });

            // Check content was updated while preserving other content properties
            expect(result.content[0].content).toBe('Updated content');
            expect(result.content[0].type).toBe(ContentType.Text); // Should preserve original type

            // Verify blocks array was updated
            const updatedBlock = getBlockModelById('block1', blocks);
            expect(updatedBlock.content[0].content).toBe('Updated content');
        });

        it('should replace whole content if id not specified', () => {
            // Update content of block1
            const result = blockService.updateBlock('block1', {
                content: [
                    { content: 'Updated content', type: ContentType.Link, props: { url: 'http://example.com' } }
                ]
            });

            // Check content was updated while preserving other content properties
            expect(result.content[0].content).toBe('Updated content');
            expect(result.content[0].type).toBe(ContentType.Link); // Should have updated type
            expect((result.content[0].props as LinkContentProps).url).toBe('http://example.com');

            // Verify blocks array was updated
            const updatedBlock = getBlockModelById('block1', blocks);
            expect(updatedBlock.content[0].content).toBe('Updated content');
            expect(updatedBlock.content[0].type).toBe(ContentType.Link); // Should have updated type
            expect((updatedBlock.content[0].props as LinkContentProps).url).toBe('http://example.com');

            // Again update same block with different property
            const result2 = blockService.updateBlock('block1', {
                content: [
                    { id: result.content[0].id, props: { url: 'http://updated.com' } }
                ]
            });
            expect((result2.content[0].props as LinkContentProps).url).toBe('http://updated.com');
            const updatedBlock2 = getBlockModelById('block1', blocks);
            expect((updatedBlock2.content[0].props as LinkContentProps).url).toBe('http://updated.com');
        });

        it('should merge styles in content model', () => {
            // Update styles of block1's content
            const result = blockService.updateBlock('block1', {
                content: [
                    { id: 'content1', props: { styles: { bold: true, italic: false } } }
                ]
            });

            // Check styles were merged
            expect((result.content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect((result.content[0].props as BaseStylesProp).styles.italic).toBeUndefined();

            // Verify blocks array was updated
            const updatedBlock = getBlockModelById('block1', blocks);
            expect((updatedBlock.content[0].props as BaseStylesProp).styles.bold).toBe(true);
            expect((updatedBlock.content[0].props as BaseStylesProp).styles.italic).toBeUndefined();
        });

        it('should update properties like codeProps, imageProps', () => {
            blockService.addBlock({
                block: {
                    id: 'codeblock',
                    type: BlockType.Code
                }
            });
            blockService.addBlock({
                block: {
                    id: 'imageblock',
                    type: BlockType.Image
                }
            });
            const codeUpdate = blockService.updateBlock('codeblock', {
                props: {
                    defaultLanguage: 'python',
                }
            });
            const imageUpdate = blockService.updateBlock('imageblock', {
                props: {
                    saveFormat: 'Blob',
                    src: 'new-image.png'
                }
            });

            // Check nested properties were updated
            expect((codeUpdate.props as CodeProps).defaultLanguage).toBe('python');
            expect((imageUpdate.props as ImageProps).saveFormat).toBe('Blob');
            expect((imageUpdate.props as ImageProps).src).toBe('new-image.png');

            // Verify blocks array was updated
            const updatedCodeBlock = getBlockModelById('codeblock', blocks);
            const updatedImageBlock = getBlockModelById('imageblock', blocks);
            expect((updatedCodeBlock.props as CodeProps).defaultLanguage).toBe('python');
            expect((updatedImageBlock.props as ImageProps).saveFormat).toBe('Blob');
            expect((updatedImageBlock.props as ImageProps).src).toBe('new-image.png');
        });
    });

    describe('indentBlock method', () => {
        it('should increase indent level of a block', () => {
            // Indent block1
            blockService.applyIndentation({
                blockId: 'block1'
            });

            // Check indent was applied
            expect(blocks[0].indent).toBe(1);
        });

        it('should increase indent level of a child block', () => {
            const parentBlock: BlockModel = {
                id: 'parentBlock',
                type: BlockType.CollapsibleParagraph,
                content: [{ id: 'parentContent', type: ContentType.Text, content: 'Toggle header' }],
                props: {
                    children: [
                        {
                            id: 'childBlock',
                            type: BlockType.Paragraph,
                            parentId: 'parentBlock',
                            content: [{ id: 'childContent', type: ContentType.Text, content: 'Child content' }],
                            indent: 0
                        }
                    ]
                }
            };

            blocks.push(parentBlock);
            // Indent block2
            blockService.applyIndentation({
                blockId: 'childBlock',
            });

            // Check indent was applied
            expect(getBlockModelById('childBlock', blocks).indent).toBe(1);
        });

        it('should handle multiple indent operations', () => {
            // Indent block1 twice
            blockService.applyIndentation({
                blockId: 'block1'
            });
            blockService.applyIndentation({
                blockId: 'block1'
            });

            // Check indent level
            expect(blocks[0].indent).toBe(2);
        });

        it('should respect maximum indent level', () => {
            // Block can be indented to max 1 level from previous block's indent

            //On first indent, block2 indent is 1
            blockService.applyIndentation({ blockId: 'block2' });
            expect(blocks[1].indent).toBe(1);

            // On second indent, since we reach max indent level, block2 indent will be same
            blockService.applyIndentation({ blockId: 'block2' });
            expect(blocks[1].indent).toBe(1);
        });

        it('should handle non-existent block ID', function () {
            const result = blockService.applyIndentation({
                blockId: 'nonExistentBlock'
            });
            expect(result).toBeNull();
        });

        it('should handle non-existent block ID', () => {
            const result = blockService.applyIndentation({
                blockId: 'nonExistentBlock'
            });

            expect(result).toBeNull();
        });
    });

    describe('outdentBlock method', () => {
        it('should decrease indent level of a block', () => {
            // Set initial indent
            blocks[0].indent = 3;

            // Outdent block1
            blockService.applyIndentation({
                blockId: 'block1',
                shouldDecrease: true
            });

            // Check indent was decreased
            expect(blocks[0].indent).toBe(2);
        });

        it('should not decrease indent below zero', () => {
            // Try to outdent a non-indented block
            blockService.applyIndentation({
                blockId: 'block1',
                shouldDecrease: true
            });

            // Check indent level
            expect(blocks[0].indent).toBe(0);
        });

        it('should handle non-existent block ID', () => {
            const result = blockService.applyIndentation({
                blockId: 'nonExistentBlock',
                shouldDecrease: true
            });

            expect(result).toBeNull();
        });
    });

    describe('Formatting actions', () => {
        let sampleContent: ContentModel;

        beforeEach(() => {
            sampleContent = {
                id: 'testContent',
                type: ContentType.Text,
                content: 'Sample text content',
                props: {
                    styles: {}
                }
            };
        });

        describe('Boolean style formatting', () => {
            it('should apply bold formatting when not present', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'bold', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.bold).toBe(true);
            });

            it('should remove bold formatting when already present', () => {
                (sampleContent.props as BaseStylesProp).styles.bold = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'bold', false, false);

                expect((updatedContent.props as BaseStylesProp).styles.bold).toBeUndefined();
            });

            it('should force apply bold formatting when force is true', () => {
                (sampleContent.props as BaseStylesProp).styles.bold = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'bold', true, true);

                expect((updatedContent.props as BaseStylesProp).styles.bold).toBe(true);
            });

            it('should force remove bold formatting when force is true and formatIntent is false', () => {
                (sampleContent.props as BaseStylesProp).styles.bold = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'bold', true, false);

                expect((updatedContent.props as BaseStylesProp).styles.bold).toBeUndefined();
            });

            it('should apply italic formatting', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'italic', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.italic).toBe(true);
            });

            it('should apply underline formatting', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'underline', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.underline).toBe(true);
            });

            it('should apply strikethrough formatting', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'strikethrough', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.strikethrough).toBe(true);
            });

            it('should apply multiple formatting styles', () => {
                const updatedContent1 = blockService.toggleContentStyles(sampleContent, 'bold', false, true);
                const updatedContent2 = blockService.toggleContentStyles(sampleContent, 'italic', false, true);
                const updatedContent3 = blockService.toggleContentStyles(sampleContent, 'underline', false, true);

                expect((updatedContent1.props as BaseStylesProp).styles.bold).toBe(true);
                expect((updatedContent2.props as BaseStylesProp).styles.italic).toBe(true);
                expect((updatedContent3.props as BaseStylesProp).styles.underline).toBe(true);
            });
        });

        describe('Toggle pair formatting (superscript/subscript, uppercase/lowercase)', () => {
            it('should apply superscript and remove subscript', () => {
                (sampleContent.props as BaseStylesProp).styles.subscript = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'superscript', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.superscript).toBe(true);
                expect((updatedContent.props as BaseStylesProp).styles.subscript).toBeUndefined();
            });

            it('should apply subscript and remove superscript', () => {
                (sampleContent.props as BaseStylesProp).styles.superscript = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'subscript', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.subscript).toBe(true);
                expect((updatedContent.props as BaseStylesProp).styles.superscript).toBeUndefined();
            });

            it('should apply uppercase and remove lowercase', () => {
                (sampleContent.props as BaseStylesProp).styles.lowercase = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'uppercase', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.uppercase).toBe(true);
                expect((updatedContent.props as BaseStylesProp).styles.lowercase).toBeUndefined();
            });

            it('should apply lowercase and remove uppercase', () => {
                (sampleContent.props as BaseStylesProp).styles.uppercase = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'lowercase', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.lowercase).toBe(true);
                expect((updatedContent.props as BaseStylesProp).styles.uppercase).toBeUndefined();
            });

            it('should remove superscript when already applied', () => {
                (sampleContent.props as BaseStylesProp).styles.superscript = true;

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'superscript', false, false);

                expect((updatedContent.props as BaseStylesProp).styles.superscript).toBeUndefined();
            });
        });

        describe('Non-boolean style formatting (color, bgColor, etc)', () => {
            it('should apply text color with specified value', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'color', false, true, '#FF0000');

                expect((updatedContent.props as BaseStylesProp).styles.color).toBe('#FF0000');
            });

            it('should apply background color with specified value', () => {
                const updatedContent = blockService.toggleContentStyles(sampleContent, 'bgColor', false, true, '#00FF00');

                expect((updatedContent.props as BaseStylesProp).styles.bgColor).toBe('#00FF00');
            });

            it('should remove color style when no value provided', () => {
                (sampleContent.props as BaseStylesProp).styles.color = '#FF0000';

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'color', false, true);

                expect((updatedContent.props as BaseStylesProp).styles.color).toBeUndefined();
            });

            it('should update existing color style value', () => {
                (sampleContent.props as BaseStylesProp).styles.color = '#FF0000';

                const updatedContent = blockService.toggleContentStyles(sampleContent, 'color', false, true, '#0000FF');

                expect((updatedContent.props as BaseStylesProp).styles.color).toBe('#0000FF');
            });
        });

        describe('Props initialization and handling', () => {
            it('should initialize props when not present', () => {
                const contentWithoutProps: ContentModel = {
                    id: 'testContent',
                    type: ContentType.Text,
                    content: 'Sample text'
                };

                const updatedContent = blockService.toggleContentStyles(contentWithoutProps, 'bold', false, true);

                expect(updatedContent.props).toBeDefined();
                expect((updatedContent.props as BaseStylesProp).styles).toBeDefined();
                expect((updatedContent.props as BaseStylesProp).styles.bold).toBe(true);
            });

            it('should initialize styles when not present but props exist', () => {
                const contentWithoutStyles: ContentModel = {
                    id: 'testContent',
                    type: ContentType.Text,
                    content: 'Sample text',
                    props: {}
                };

                const updatedContent = blockService.toggleContentStyles(contentWithoutStyles, 'italic', false, true);

                expect((updatedContent.props as BaseStylesProp).styles).toBeDefined();
                expect((updatedContent.props as BaseStylesProp).styles.italic).toBe(true);
            });
        });
    });

    describe('Link actions', () => {
        let sampleContent: ContentModel;

        beforeEach(() => {
            sampleContent = {
                id: 'testContent',
                type: ContentType.Text,
                content: 'Sample link text',
                props: {}
            };
        });

        describe('Apply link', () => {
            it('should convert text content to link content', () => {
                const linkData = {
                    url: 'https://example.com',
                    text: 'Example Link',
                    openInNewWindow: true,
                    shouldRemoveLink: false
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Link);
                expect((updatedContent.props as LinkContentProps).url).toBe('https://example.com');
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBe(true);
                expect(updatedContent.content).toBe('Example Link');
            });

            it('should apply link without changing text when text not provided', () => {
                const originalText = sampleContent.content;
                const linkData = {
                    url: 'https://example.com',
                    openInNewWindow: false,
                    shouldRemoveLink: false
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Link);
                expect((updatedContent.props as LinkContentProps).url).toBe('https://example.com');
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBe(false);
                expect(updatedContent.content).toBe(originalText);
            });
        });

        describe('Remove link', () => {
            beforeEach(() => {
                // Set up as an existing link
                sampleContent.type = ContentType.Link;
                sampleContent.props = {
                    url: 'https://example.com',
                    openInNewWindow: true
                };
                sampleContent.content = 'Existing Link';
            });

            it('should convert link content back to text content', () => {
                const linkData = {
                    text: 'Plain Text',
                    shouldRemoveLink: true
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Text);
                expect((updatedContent.props as LinkContentProps).url).toBeUndefined();
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBeUndefined();
                expect(updatedContent.content).toBe('Plain Text');
            });

            it('should preserve existing text when removing link without new text', () => {
                const originalText = sampleContent.content;
                const linkData = {
                    shouldRemoveLink: true
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Text);
                expect((updatedContent.props as LinkContentProps).url).toBeUndefined();
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBeUndefined();
                expect(updatedContent.content).toBe(originalText);
            });

            it('should preserve other properties when removing link', () => {
                sampleContent.props = {
                    url: 'https://example.com',
                    openInNewWindow: true,
                    styles: { bold: true, color: '#FF0000' }
                };

                const linkData = {
                    text: 'No longer a link',
                    shouldRemoveLink: true
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Text);
                expect((updatedContent.props as BaseStylesProp).styles.bold).toBe(true);
                expect((updatedContent.props as BaseStylesProp).styles.color).toBe('#FF0000');
                expect((updatedContent.props as LinkContentProps).url).toBeUndefined();
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBeUndefined();
            });
        });

        describe('Update existing link', () => {
            beforeEach(() => {
                sampleContent.type = ContentType.Link;
                sampleContent.props = {
                    url: 'https://oldexample.com',
                    openInNewWindow: false
                };
                sampleContent.content = 'Old Link';
            });

            it('should update URL of existing link', () => {
                const linkData = {
                    url: 'https://newexample.com',
                    openInNewWindow: true,
                    shouldRemoveLink: false
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.type).toBe(ContentType.Link);
                expect((updatedContent.props as LinkContentProps).url).toBe('https://newexample.com');
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBe(true);
            });

            it('should update text of existing link', () => {
                const linkData = {
                    url: 'https://newexample.com',
                    text: 'Updated Link Text',
                    openInNewWindow: false,
                    shouldRemoveLink: false
                };

                const updatedContent = blockService.applyLinkFormatting(sampleContent, linkData);

                expect(updatedContent.content).toBe('Updated Link Text');
                expect((updatedContent.props as LinkContentProps).url).toBe('https://newexample.com');
            });
        });

        describe('Edge cases and error handling', () => {
            it('should handle content without props', () => {
                const contentWithoutProps: ContentModel = {
                    id: 'testContent',
                    type: ContentType.Text,
                    content: 'Sample text'
                };

                const linkData = {
                    url: 'https://example.com',
                    text: 'Link Text',
                    openInNewWindow: true,
                    shouldRemoveLink: false
                };

                const updatedContent = blockService.applyLinkFormatting(contentWithoutProps, linkData);

                expect(updatedContent.type).toBe(ContentType.Link);
                expect((updatedContent.props as LinkContentProps).url).toBe('https://example.com');
                expect((updatedContent.props as LinkContentProps).openInNewWindow).toBe(true);
            });
        });
    });
});