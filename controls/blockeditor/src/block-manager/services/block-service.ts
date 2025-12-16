import { BaseChildrenProp, BaseStylesProp, BlockModel, ContentModel, ILinkContentSettings, StyleModel, Styles, ITextContentSettings, ITableBlockSettings, BlockType, TableColumnModel, TableRowModel, TableCellModel } from '../../models/index';
import { IAddBlockOptions, IRemoveBlockOptions, IDuplicateBlockOptions,
    IIndentBlockOptions, IMoveBlockOptions, IFromBlockData, LinkData} from '../../common/interface';
import { getBlockModelById, getBlockIndexById, getParentBlocksArray } from '../../common/utils/block';
import { generateUniqueId, decoupleReference, getInverseStyle } from '../../common/utils/common';
import { sanitizeBlock } from '../../common/utils/transform';
import * as constants from '../../common/constant';
import { BlockFactory } from './block-factory';

/**
 * Service responsible for core block-related logics that updates model
 */
export class BlockService {

    public blocks: BlockModel[];

    constructor(blocks: BlockModel[]) {
        this.blocks = blocks;
    }

    /**
     * Adds a new block to the provided blocks array
     *
     * @param {IAddBlockOptions} options - Options for creating the block
     * @returns {BlockModel} - The newly added block model
     * @hidden
     */
    public addBlock(options: IAddBlockOptions): BlockModel {
        const targetBlockModel: BlockModel = options.targetBlockId ? getBlockModelById(options.targetBlockId, this.blocks) : null;
        const insertArray: BlockModel[] = targetBlockModel ? getParentBlocksArray(targetBlockModel.id, this.blocks) : this.blocks;
        const indexToInsert: number = this.getIndexToAdjust(insertArray, targetBlockModel, options.isAfter);
        insertArray.splice(indexToInsert, 0, options.block as BlockModel);

        return options.block;
    }

    /**
     * Removes a block model from the blocks array
     *
     * @param {IRemoveBlockOptions} options - Options for removing the block
     * @returns {{ removedBlock: BlockModel, blockIndex: number }} The removed block and its index
     * @hidden
     */
    public removeBlock({ blockId }: IRemoveBlockOptions): { removedBlock: BlockModel, blockIndex: number } {
        const blockModel: BlockModel = getBlockModelById(blockId, this.blocks);
        if (!blockModel) { return { removedBlock: null, blockIndex: -1 }; }

        const containerArray: BlockModel[] = getParentBlocksArray(blockId, this.blocks);
        const blockIndex: number = getBlockIndexById(blockId, this.blocks);
        const [removedBlock] = containerArray.splice(blockIndex, 1);
        return { removedBlock, blockIndex };
    }

    /**
     * Updates a block with the provided properties
     *
     * @param {string} blockId - The ID of the block to update
     * @param {Partial<BlockModel>} properties - The properties to update
     * @returns {BlockModel} Updated block and blocks array
     * @hidden
     */
    public updateBlock(blockId: string, properties: Partial<BlockModel>): BlockModel {
        const blockModel: BlockModel = getBlockModelById(blockId, this.blocks);
        if (!blockModel) { return null; }

        const updatedBlock: BlockModel = this.mergeBlockProperties(blockModel, properties);
        const containerArray: BlockModel[] = getParentBlocksArray(blockId, this.blocks);
        const blockIndex: number = getBlockIndexById(blockId, containerArray);
        containerArray.splice(blockIndex, 1, updatedBlock);
        return updatedBlock;
    }

    /**
     * Duplicates the given block model
     *
     * @param {IDuplicateBlockOptions} options - Options for duplicating the block
     * @returns {BlockModel} The duplicated block model or null
     * @hidden
     */
    public duplicateBlock({ blockId }: IDuplicateBlockOptions): BlockModel {
        const blockModel: BlockModel = getBlockModelById(blockId, this.blocks);
        if (!blockModel) { return null; }

        const containerArray: BlockModel[] = getParentBlocksArray(blockId, this.blocks);
        const blockIndex: number = getBlockIndexById(blockId, containerArray);
        const blockToClone: BlockModel = containerArray[blockIndex as number];
        const clonedBlock: BlockModel = decoupleReference(sanitizeBlock(blockToClone));
        const duplicatedBlockModel: BlockModel = this.generateNewIdsForBlock(clonedBlock);
        return duplicatedBlockModel;
    }

    /**
     * Moves the given block model to a new position
     *
     * @param {IMoveBlockOptions} options - Options for moving the block}
     * @returns {void}
     * @hidden
     */
    public moveBlocks(options: IMoveBlockOptions): IFromBlockData[] {
        const { blockIds, toBlockId, isMovingUp = false }: IMoveBlockOptions = options;
        const toBlockModel: BlockModel = getBlockModelById(toBlockId, this.blocks);
        if (!toBlockModel) { return []; }
        // Collect information about blocks to move
        const fromEntries: IFromBlockData[] = this.gatherBlocksInfoForMove(blockIds);
        if (fromEntries.length === 0) { return []; }
        // Remove blocks from their original positions
        const movedBlocks: IFromBlockData[] = this.removeBlocksForMove(fromEntries);
        // Insert blocks at the target position
        this.insertBlocksAtTarget(movedBlocks, toBlockId, isMovingUp);
        return movedBlocks;
    }

    /**
     * Handles the indent/outdent of block
     *
     * @param {IIndentBlockOptions} options - Options to indent/unindent block
     * @returns {BlockModel} - The updated block model
     * @hidden
     */
    public applyIndentation(options: IIndentBlockOptions): BlockModel {
        const { blockId, shouldDecrease }: IIndentBlockOptions = options;
        const blockModel: BlockModel = getBlockModelById(blockId, this.blocks);
        if (!blockModel) { return null; }

        const blockIndex: number = getBlockIndexById(blockId, this.blocks);
        const parentBlock: BlockModel = getBlockModelById(blockModel.parentId, this.blocks);

        if (shouldDecrease) {
            if (blockModel.indent > 0) {
                blockModel.indent--;
            }
        }
        else {
            // Indent - only allow if previous block is at same or higher level
            const adjacentBlockModel: BlockModel = parentBlock
                ? (parentBlock.properties as BaseChildrenProp).children[blockIndex - 1]
                : this.blocks[blockIndex - 1];
            if (adjacentBlockModel) {
                if (blockModel.indent <= adjacentBlockModel.indent) {
                    blockModel.indent++;
                }
            }
            else {
                blockModel.indent++;
            }
        }
        return blockModel;
    }

    /**
     * Handles the line break of block
     *
     * @param {number} insertOffset - The offset at which to insert the line break
     * @param {ContentModel} contentModel - The content model to update
     * @returns {void}
     * @hidden
     */
    public applyLineBreak(insertOffset: number, contentModel: ContentModel): void {
        if (insertOffset < 0 || !contentModel) { return; }
        contentModel.content =
            contentModel.content.substring(0, insertOffset) +
            '\n' +
            contentModel.content.substring(insertOffset);
    }

    /**
     * Updates the block content with given data
     *
     * @param {string} blockId The id of the block
     * @param {ContentModel[]} content The content to update
     * @returns {void}
     * @hidden
     */
    public updateContent(blockId: string, content: ContentModel[]): void {
        const block: BlockModel = getBlockModelById(blockId, this.blocks);
        block.content = content;
    }

    /**
     * Toggles formatting style on content model
     *
     * @param {ContentModel} content - The content model to update
     * @param {any} format - The format to toggle (eg. Bold, Italic)
     * @param {boolean} force - Whether to force the format intent
     * @param {boolean} formatIntent - Whether to apply or remove the format
     * @param {string} value - The value for non-boolean styles
     * @returns {ContentModel} - The updated content model
     * @hidden
     */
    public toggleContentStyles(
        content: ContentModel,
        format: keyof StyleModel,
        force?: boolean,
        formatIntent?: boolean,
        value?: string
    ): ContentModel {
        const updatedContent: ContentModel = {...content};
        const booleanStyles: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'uppercase', 'lowercase'];
        const togglePairs: string[] = ['superscript', 'subscript', 'uppercase', 'lowercase'];

        const isBooleanStyle: boolean = booleanStyles.indexOf(format) !== -1;
        const isTogglePair: boolean = togglePairs.indexOf(format) !== -1;

        if (!updatedContent.properties) {
            (updatedContent.properties as BaseStylesProp) = { styles: {} };
        }

        if (!(updatedContent.properties as BaseStylesProp).styles) {
            (updatedContent.properties as BaseStylesProp).styles = {};
        }

        const styles: Styles = (updatedContent.properties as BaseStylesProp).styles;
        if (isBooleanStyle) {
            let newValue: boolean = !(styles as Record<keyof StyleModel, string | boolean>)[format as keyof StyleModel] as boolean;
            if (force) {
                newValue = formatIntent;
            }
            if (newValue) {
                (styles as Record<keyof StyleModel, string | boolean>)[format as keyof StyleModel] = true;
            } else {
                delete (styles as Record<keyof StyleModel, string | boolean>)[format as keyof StyleModel];
            }
            if (isTogglePair) {
                const oppositeFormat: keyof StyleModel = getInverseStyle(format);
                delete (styles as  Record<keyof StyleModel, string | boolean>)[oppositeFormat as keyof StyleModel];
            }
        } else {
            if (value) {
                (styles as Record<keyof StyleModel, string | boolean>)[format as keyof StyleModel] = value;
            } else {
                delete (styles as Record<keyof StyleModel, string | boolean>)[format as keyof StyleModel];
            }
        }

        return updatedContent;
    }

    /**
     * Applies link formatting to content model
     *
     * @param {ContentModel} content - The content model to update
     * @param {LinkData} linkData - The link data containing URL, text, and other properties
     * @returns {ContentModel} - The updated content model
     * @hidden
     */
    public applyLinkFormatting(content: ContentModel, linkData: LinkData): ContentModel {
        let updatedContent: ContentModel;
        const textContent: string = linkData.text ? linkData.text : content.content;
        if (!linkData.shouldRemoveLink) {
            updatedContent = BlockFactory.createLinkContent(
                { content: textContent },
                {
                    ...content.properties,
                    url: linkData.url
                }
            );
        }
        else {
            delete (content.properties as ILinkContentSettings).url;
            updatedContent = BlockFactory.createTextContent({
                content: textContent
            }, (content.properties as ITextContentSettings));
        }
        return updatedContent;
    }

    /**
     * Assigns parent ID to multiple blocks
     *
     * @param {BlockModel[]} blocks - The blocks to update
     * @param {string} parentId - The parent ID to assign
     * @returns {void}
     * @hidden
     */
    public assignParentIdToBlocks(blocks: BlockModel[], parentId: string): void {
        blocks.forEach((block: BlockModel) => {
            block.parentId = parentId;
        });
    }

    /**
     * Gets the index to adjust the block based on the given targetBlock.
     *
     * @param {BlockModel[]} insertionArray The target collection of blocks to insert.
     * @param {BlockModel} targetBlock The block after which the new block should be inserted.
     * @param {boolean} isAfter Specifies whether the new block should be inserted after the targetBlock.
     * @returns {number} The index at which the new block should be inserted.
     * @hidden
     */
    public getIndexToAdjust(insertionArray: BlockModel[], targetBlock?: BlockModel, isAfter: boolean = true): number {
        let insertIndex: number = insertionArray.length;

        if (targetBlock) {
            const afterBlockIndex: number = getBlockIndexById(targetBlock.id, insertionArray);
            if (afterBlockIndex !== -1) {
                insertIndex = afterBlockIndex + (isAfter ? 1 : 0);
            }
        }

        return insertIndex;
    }

    /**
     * Gathers information about blocks to be moved
     *
     * @param {string[]} fromBlockIds Array of block IDs to move
     * @returns {IFromBlockData[]} Array of block information objects
     * @hidden
     */
    public gatherBlocksInfoForMove(fromBlockIds: string[]): IFromBlockData[] {
        const entries: IFromBlockData[] = [];
        for (const fromBlockId of fromBlockIds) {
            const blockModel: BlockModel = getBlockModelById(fromBlockId, this.blocks);
            const index: number = getBlockIndexById(fromBlockId, this.blocks);
            if (index >= 0 && blockModel) {
                const parent: BlockModel = getBlockModelById(blockModel.parentId, this.blocks);
                entries.push({ blockId: fromBlockId, model: blockModel, index, parent });
            }
        }
        return entries.sort((a: IFromBlockData, b: IFromBlockData) => b.index - a.index);
    }

    /**
     * Removes blocks from their current position in the model
     *
     * @param {IFromBlockData[]} fromEntries Array of block information objects
     * @returns {IFromBlockData[]} Array of removed block models
     * @hidden
     */
    public removeBlocksForMove(fromEntries: IFromBlockData[]): IFromBlockData[] {
        const allFromModels: IFromBlockData[] = [];

        // Splice safely from the highest index to avoid index shifts
        for (const entry of fromEntries) {
            const { blockId, index, parent }: IFromBlockData = entry;
            const containerArray: BlockModel[] = getParentBlocksArray(blockId, this.blocks);
            const [moved]: BlockModel[] = containerArray.splice(index, 1);
            // allFromModels has the original indexes and parentid before mutation in reverse order
            allFromModels.push({ blockId: blockId, model: moved, parent, index });
        }

        return allFromModels;
    }

    /**
     * Inserts blocks at the target position in the model
     *
     * @param {IFromBlockData[]} movedBlocks Array of block models to insert
     * @param {string} toBlockId Target block ID
     * @param {boolean} isMovingUp Whether blocks are moving up or down
     * @returns {void}
     * @hidden
     */
    private insertBlocksAtTarget(
        movedBlocks: IFromBlockData[],
        toBlockId: string,
        isMovingUp: boolean
    ): void {
        const toBlockIndex: number = getBlockIndexById(toBlockId, this.blocks);
        if (toBlockIndex < 0) { return null; }

        const insertToArray: BlockModel[] = getParentBlocksArray(toBlockId, this.blocks);
        const toBlockModel: BlockModel = getBlockModelById(toBlockId, insertToArray);
        const toParentBlock: BlockModel = getBlockModelById(toBlockModel.parentId, this.blocks);
        const insertIndex: number = getBlockIndexById(toBlockId, insertToArray) + (isMovingUp ? 0 : 1);

        for (const entry of movedBlocks) {
            entry.model.parentId = toParentBlock ? toParentBlock.id : '';
            insertToArray.splice(insertIndex, 0, entry.model);
        }
    }

    /**
     * Replaces a block at specific index in parent's children or root blocks array
     *
     * @param {string} originalBlockId - The ID of the block to replace
     * @param {BlockModel} newBlock - The new block to insert
     * @returns {void}
     * @hidden
     */
    public replaceBlock(originalBlockId: string, newBlock: BlockModel): void {
        const originalBlock: BlockModel = getBlockModelById(originalBlockId, this.blocks);
        if (!originalBlock) { return; }

        const insertToArray: BlockModel[] = getParentBlocksArray(originalBlockId, this.blocks);
        const indexToReplace: number = getBlockIndexById(originalBlock.id, insertToArray);
        // const parentBlock: BlockModel = getBlockModelById(originalBlock.parentId, this.blocks);
        // const insertToArray: BlockModel[] = parentBlock ? (parentBlock.properties as BaseChildrenProp).children : this.blocks;

        insertToArray.splice(indexToReplace, 1, newBlock);
    }

    /**
     * Generates new IDs for the block and its content.
     *
     * @param {BlockModel} block The block model to generate new IDs for.
     * @param {string} parentId The parent ID of the block.
     * @returns {void} The block model with new IDs.
     * @hidden
     */
    public generateNewIdsForBlock(block: BlockModel, parentId?: string): BlockModel {
        block.id = generateUniqueId(constants.BLOCK_ID_PREFIX);

        if (parentId) {
            block.parentId = parentId;
        }

        if (block.blockType === BlockType.Table) {
            return this.generateNewIdsForTableBlock(block);
        }

        if (block.content) {
            block.content = block.content.map((content: ContentModel) => {
                content.id = generateUniqueId(constants.CONTENT_ID_PREFIX);
                return content;
            });
        }
        let children: BlockModel[] = (block.properties && (block.properties as BaseChildrenProp).children)
            ? (block.properties as BaseChildrenProp).children
            : [];

        if (children && children.length > 0) {
            children = children.map((child: BlockModel) =>
                this.generateNewIdsForBlock(child, block.id)
            );
        }

        return block;
    }

    private generateNewIdsForTableBlock(tableBlock: BlockModel): BlockModel {
        const props: ITableBlockSettings = tableBlock.properties as ITableBlockSettings;

        // 1. Regenerate all column IDs + store mapping
        const columnIdMap: Map<string, string> = new Map<string, string>();

        props.columns = props.columns.map((col: TableColumnModel) => {
            const newId: string = generateUniqueId('col_');
            columnIdMap.set(col.id, newId);
            return {
                ...col,
                id: newId
            };
        });

        // 2. Regenerate row IDs and cell IDs + fix columnId references
        props.rows = props.rows.map((row: TableRowModel) => {
            const newRowId: string = generateUniqueId('row_');

            const newCells: TableCellModel[] = row.cells.map((cell: TableCellModel) => {
                const newCellId: string = generateUniqueId('cell_');
                const newColumnId: string = columnIdMap.get(cell.columnId) || cell.columnId;

                // Regenerate IDs for all blocks inside this cell
                const newBlocks: BlockModel[] = cell.blocks.map((innerBlock: BlockModel) =>
                    this.generateNewIdsForBlock(innerBlock, newCellId)
                );

                return {
                    ...cell,
                    id: newCellId,
                    columnId: newColumnId,
                    blocks: newBlocks
                };
            });

            return {
                ...row,
                id: newRowId,
                cells: newCells
            };
        });

        return tableBlock;
    }

    /**
     * Merges partial block properties with an existing block
     *
     * @param {BlockModel} block - Original block model
     * @param {Partial<BlockModel>} properties - Partial properties to merge
     * @returns {BlockModel} Merged block model
     * @hidden
     */
    private mergeBlockProperties(block: BlockModel, properties: Partial<BlockModel>): BlockModel {
        const clonedBlock: BlockModel = decoupleReference(sanitizeBlock(block));
        const mergedBlock: BlockModel = { ...clonedBlock };

        // Merge block-level properties
        Object.keys(properties).forEach((key: keyof BlockModel) => {
            if (key === 'content' && properties.content) {
                mergedBlock.content = this.mergeContentArray(clonedBlock.content, properties.content);
            }
            else if ((key === 'properties' && properties.properties)) {
                (mergedBlock as any)[key as any] = this.mergePrimitiveTypes(
                    (clonedBlock as any)[key as any], (properties as any)[key as any]
                );
            }
            else {
                (mergedBlock as any)[key as any] = (properties as any)[key as any];
            }
        });

        return mergedBlock;
    }

    /**
     * Merges content array updates
     *
     * @param {ContentModel[]} existingContent - Current content array
     * @param {Partial<ContentModel>[]} newContent - New content updates
     * @returns {ContentModel[]} Merged content array
     * @hidden
     */
    private mergeContentArray(existingContent: ContentModel[], newContent: Partial<ContentModel>[]): ContentModel[] {
        if (newContent.length === 0) { return []; }
        const mergedContent: ContentModel[] = [...existingContent];

        for (let i: number = 0; i < newContent.length; i++) {
            const newItem: ContentModel = newContent[i as number];
            // Check if the new item has an ID. If not, replace the whole content array.
            if (!newItem.id) {
                return [BlockFactory.createContentFromPartial(newItem)];
            }
            const index: number = mergedContent.findIndex((item: ContentModel) => item.id === newItem.id);
            if (index === -1) {
                throw new Error(`Content with ID ${newItem.id} not found`);
            }
            mergedContent[index as number] = this.mergeContentModel(mergedContent[index as number], newItem);
        }

        return mergedContent;
    }

    /**
     * Merges a single content model with partial updates
     *
     * @param {ContentModel} existing - Existing content model
     * @param {Partial<ContentModel>} updates - Partial updates
     * @returns {ContentModel} Merged content model
     * @hidden
     */
    private mergeContentModel(existing: ContentModel, updates: Partial<ContentModel>): ContentModel {
        const merged: ContentModel = { ...existing };
        Object.keys(updates).forEach((key: keyof ContentModel) => {
            if (key === 'properties' && updates.properties) {
                if (!merged.properties) { merged.properties = {}; }
                Object.keys(updates.properties).forEach((prop: any) => {
                    if (prop === 'styles' && (updates.properties as BaseStylesProp).styles) {
                        if (!(merged.properties as BaseStylesProp).styles) {
                            (merged.properties as BaseStylesProp).styles = {};
                        }
                        (merged.properties as BaseStylesProp).styles = this.mergeStyleModel(
                            (merged.properties as BaseStylesProp).styles,
                            (updates.properties as BaseStylesProp).styles
                        );
                    }
                    else {
                        (merged as any)[key as keyof ContentModel] = (updates as any)[key as keyof ContentModel];
                    }
                });
            }
            else {
                (merged as any)[key as keyof ContentModel] = (updates as any)[key as keyof ContentModel];
            }
        });
        return merged;
    }

    /**
     * Merges styles with partial updates
     *
     * @param {Styles} existing - Existing style model
     * @param {Styles} updates - Partial updates
     * @returns {Styles} Merged style model
     * @hidden
     */
    private mergeStyleModel(existing: Styles, updates: Styles): Styles {
        const merged: Styles = { ...existing };
        Object.keys(updates).forEach((style: keyof StyleModel) => {
            if (!(updates as any)[style as any]) {
                delete (merged as any)[style as any];
            }
            else {
                (merged as any)[style as any] = (updates as any)[style as any];
            }
        });
        return merged;
    }

    /**
     * Merges a primitive type model with it's partial updates
     *
     * @param {any} existing - Existing model
     * @param {Partial<any>} updates - Partial updates
     * @returns {any} Merged model
     * @hidden
     */
    private mergePrimitiveTypes(existing: any, updates: Partial<any>): any {
        const merged: any = { ...existing };
        Object.keys(updates).forEach((key: any) => {
            (merged as any)[key as any] = (updates as any)[key as any];
        });
        return merged;
    }

    /**
     * Gets the editor blocks data
     *
     * @returns {BlockModel[]} The editor blocks data
     * @hidden
     */
    public getBlocks(): BlockModel[] {
        return this.blocks;
    }

    /**
     * Sets the editor blocks data with the given blocks
     *
     * @param {BlockModel[]} blocks The blocks to set for the editor
     * @returns {void}
     * @hidden
     */
    public setBlocks(blocks: BlockModel[]): void {
        this.blocks = blocks;
    }
}
