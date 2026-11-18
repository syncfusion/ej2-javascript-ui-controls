import * as Y from '../yjs-types';
import { DeltaOp, InternalYRuntime, YjsDelta } from '../base/interface';
import { ContentModel } from '../../../models/content/content-model';
import { ContentType } from '../../../models/enums';
import { flattenObj, unflatten } from './dom-offset';
import { BlockFactory } from '../../../block-manager/services/block-factory';
import { BlockModel } from '../../../models/block/block-model';
import { BaseChildrenProp, ITableBlockSettings, TableCellModel, TableColumnModel, TableRowModel } from '../../../models/block/block-props';
import { isChildrenTypeBlock } from '../../../common/utils/block';
import { Collaboration } from '../base/collaboration';

// ============================================================================
// BlockEditor → Yjs Conversion
// ============================================================================

/**
 * Converts between BlockEditor and Yjs data structures
 *
 * @hidden
 */
export class Conversion {
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(manager: Collaboration) {
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Converts a BlockEditor BlockModel to a Y.XmlElement
     *
     * @param {BlockModel} block - The BlockModel to convert
     * @returns {Y.XmlElement} Y.XmlElement representing the block
     * @hidden
     */
    public blockModelToYElement(
        block: BlockModel
    ): Y.XmlElement {
        const yBlock: Y.XmlElement = new this.YRuntime.XmlElement(block.blockType);

        yBlock.setAttribute('id', block.id);

        if (block.indent) {
            yBlock.setAttribute('indent', String(block.indent));
        }

        if (block.properties) {
            const props: Record<string, any> = { ...block.properties };
            delete props.children;
            delete props.rows;
            delete props.columns;

            for (const key of Object.keys(props)) {
                const value: any = props[`${key}`];
                yBlock.setAttribute(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
            }
        }

        if (this.isStructuralBlock(block.blockType)) {
            this.convertStructuralContent(block, yBlock);
        } else {
            const yText: Y.XmlText = this.contentToYXmlText(block.content);
            yBlock.insert(0, [yText]);
        }

        return yBlock;
    }

    /**
     * Converts array of content models to Y.XmlText
     *
     * @param {ContentModel[]} content - Array of content models to convert
     * @returns {Y.XmlText} Y.XmlText with formatted content
     * @hidden
     */
    public contentToYXmlText(
        content: ContentModel[]
    ): Y.XmlText {
        const yText: Y.XmlText = new this.YRuntime.XmlText();

        const delta: DeltaOp[] = content.map((content: ContentModel) => {
            const op: DeltaOp = { insert: content.content };

            if (content.properties) {
                op.attributes = this.segmentPropertiesToAttributes(content.properties);
            }

            return op;
        });

        if (delta.length > 0) {
            yText.applyDelta(delta);
        }

        return yText;
    }

    /**
     * Converts content properties to Y.Text attributes
     *
     * @param {Record<string, any>} properties - Properties to convert
     * @returns {Record<string, any>} Flattened attributes object
     * @hidden
     */
    public segmentPropertiesToAttributes(
        properties: Record<string, any>
    ): Record<string, any> {
        const flattenedProps: Record<string, any> = flattenObj(properties);
        const attrs: Record<string, any> = {};

        for (const key of Object.keys(flattenedProps)) {
            const value: any = flattenedProps[`${key}`];
            attrs[`${key}`] = value;
        }

        return attrs;
    }

    private convertStructuralContent(
        block: BlockModel,
        yBlock: Y.XmlElement
    ): void {
        const blockType: string = block.blockType;

        if (isChildrenTypeBlock(blockType) && (block.properties as BaseChildrenProp).children) {
            if (blockType.toString().startsWith('Collapsible')) {
                yBlock.insert(0, [this.contentToYXmlText(block.content)]);
            }
            // Callout and Quote children are direct child elements
            for (const child of (block.properties as BaseChildrenProp).children) {
                const yChild: Y.XmlElement = this.blockModelToYElement(child);
                yBlock.push([yChild]);
            }
        } else if (blockType === 'Table') {
            // Columns first (tableColumn elements), then rows
            for (const col of ((block.properties as ITableBlockSettings).columns)) {
                const yCol: Y.XmlElement = new this.YRuntime.XmlElement('tableColumn');
                if (col.id) { yCol.setAttribute('id', col.id); }
                if (col.type) { yCol.setAttribute('type', String(col.type)); }
                if (col.headerText !== undefined) { yCol.setAttribute('headerText', col.headerText); }
                if (col.width !== undefined) { yCol.setAttribute('width', String(col.width)); }
                yBlock.push([yCol]);
            }

            // Rows: table > row > cell > blocks
            for (const row of ((block.properties as ITableBlockSettings).rows)) {
                const yRow: Y.XmlElement = new this.YRuntime.XmlElement('tableRow');
                if (row.id) { yRow.setAttribute('id', row.id); }

                for (const cell of row.cells) {
                    const yCell: Y.XmlElement = new this.YRuntime.XmlElement('tableCell');
                    if (cell.id) { yCell.setAttribute('id', cell.id); }
                    if (cell.columnId) { yCell.setAttribute('columnId', cell.columnId); }

                    for (const cellBlock of cell.blocks) {
                        yCell.push([this.blockModelToYElement(cellBlock)]);
                    }
                    yRow.push([yCell]);
                }
                yBlock.push([yRow]);
            }
        }
    }

    // ============================================================================
    // Yjs → BlockEditor Conversion
    // ============================================================================

    /**
     * Converts Y.XmlElement to BlockEditor BlockModel
     *
     * @param {Y.XmlElement} yBlock - Y.XmlElement to convert
     * @param {string} parentId - Optional parent block ID
     * @returns {BlockModel} BlockModel representation
     * @hidden
     */
    public yElementToBlockModel(
        yBlock: Y.XmlElement,
        parentId?: string
    ): any {
        const blockType: string = yBlock.nodeName;
        const id: string = yBlock.getAttribute('id');
        const indent: number = parseInt(yBlock.getAttribute('indent'), 10) || 0;

        const properties: Record<string, any> = {};
        const attrs: Record<string, any> = yBlock.getAttributes();

        for (const key of Object.keys(attrs)) {
            const value: any = attrs[`${key}`];
            // Skip internal attributes
            if (key === 'id' || key === 'indent') { continue; }
            try {
                properties[`${key}`] = JSON.parse(value as string);
            } catch {
                properties[`${key}`] = value;
            }
        }

        let content: ContentModel[] = [];

        if (this.isStructuralBlockType(blockType)) {
            this.convertYStructuralContent(yBlock, properties);
            if (blockType.toString().startsWith('Collapsible')) {
                const yText: Y.XmlText = yBlock.get(0) as Y.XmlText;
                if (yText instanceof this.YRuntime.XmlText) {
                    content = this.yTextToContentModel(yText);
                }
            }
        } else {
            // Convert inline content from Y.XmlText
            const yText: Y.XmlText = yBlock.get(0) as Y.XmlText;
            if (yText instanceof this.YRuntime.XmlText) {
                content = this.yTextToContentModel(yText);
            }
        }

        const block: BlockModel = {
            id,
            blockType,
            content,
            indent
        };

        if (parentId) {
            block.parentId = parentId;
        }

        if (Object.keys(properties).length > 0) {
            block.properties = properties;
        }

        return block;
    }

    /**
     * Converts Y.XmlText to array of content models
     *
     * @param {Y.XmlText} yText - Y.XmlText to convert
     * @returns {ContentModel[]} Array of content models
     * @hidden
     */
    public yTextToContentModel(
        yText: Y.XmlText
    ): ContentModel[] {
        const delta: YjsDelta[] = yText.toDelta();
        const segments: ContentModel[] = [];

        for (const op of delta) {
            const segment: ContentModel = BlockFactory.createContentFromPartial({
                contentType: 'Text',
                content: op.insert as string
            });

            if (op.attributes) {
                const flattenedProps: Record<string, any> = {};
                for (const key of Object.keys(op.attributes)) {
                    const value: any = op.attributes[`${key}`];
                    (flattenedProps as any)[`${key}`] = value;

                    if (key === 'url') { segment.contentType = ContentType.Link; }
                    else if (key === 'labelId') { segment.contentType = ContentType.Label; }
                    else if (key === 'userId') { segment.contentType = ContentType.Mention; }
                }
                segment.properties = unflatten(flattenedProps);
            }

            segments.push(segment);
        }

        return segments;
    }

    private convertYStructuralContent(
        yBlock: Y.XmlElement,
        properties: Record<string, any>
    ): void {
        const blockType: string = yBlock.nodeName;
        const blockId: string = yBlock.getAttribute('id');

        if (isChildrenTypeBlock(blockType)) {
            const children: BlockModel[] = [];
            yBlock.toArray().forEach((child: any) => {
                if (child instanceof this.YRuntime.XmlElement && child.nodeName !== '_text') {
                    children.push(this.yElementToBlockModel(child, blockId));
                }
            });
            if (children.length > 0) {
                properties.children = children;
            }
        } else if (blockType === 'Table') {
            const columns: TableColumnModel[] = [];
            const rows: TableRowModel[] = [];

            yBlock.toArray().forEach((child: Y.XmlElement) => {
                if (child.nodeName === 'tableColumn') {
                    const col: TableColumnModel = {};
                    const id: string = child.getAttribute('id');
                    const type: string = child.getAttribute('type');
                    const headerText: string = child.getAttribute('headerText');
                    const width: string = child.getAttribute('width');
                    if (id) { col.id = id; }
                    if (type) { col.type = type as any; }
                    if (headerText) { col.headerText = headerText; }
                    if (width) { col.width = width; }
                    columns.push(col);
                } else if (child.nodeName === 'tableRow') {
                    const row: any = {};
                    const rowId: string = child.getAttribute('id');
                    if (rowId) { row.id = rowId; }

                    const cells: TableCellModel[] = [];
                    child.toArray().forEach((yCell: Y.XmlElement) => {
                        const cell: TableCellModel = {};
                        const cellId: string = yCell.getAttribute('id');
                        const columnId: string = yCell.getAttribute('columnId');
                        if (cellId) { cell.id = cellId; }
                        if (columnId) { cell.columnId = columnId; }

                        const cellBlocks: BlockModel[] = [];
                        yCell.toArray().forEach((yCellContent: Y.XmlElement) => {
                            cellBlocks.push(this.yElementToBlockModel(yCellContent, cellId));
                        });
                        if (cellBlocks.length > 0) { cell.blocks = cellBlocks; }
                        cells.push(cell);
                    });

                    if (cells.length > 0) { row.cells = cells; }
                    rows.push(row);
                }
            });

            if (columns.length > 0) {
                properties.columns = columns;
            } else if (Array.isArray(properties['columns'])) {
                // Migration fallback: honour legacy JSON attribute written before this change
            } else {
                properties.columns = [];
            }

            if (rows.length > 0) { properties.rows = rows; }
        }
    }

    /**
     * Converts Y.XmlFragment to array of BlockModels
     *
     * @param {Y.XmlFragment} yFragment - Fragment to convert
     * @returns {BlockModel[]} Array of block models
     * @hidden
     */
    public yFragmentToBlocks(
        yFragment: Y.XmlFragment
    ): BlockModel[] {
        const blocks: BlockModel[] = [];

        yFragment.toArray().forEach((child: any) => {
            if (child instanceof this.YRuntime.XmlElement) {
                blocks.push(this.yElementToBlockModel(child));
            }
        });

        return blocks;
    }

    /**
     * Checks if block type is structural (has children or special layout)
     *
     * @param {string} blockType - Block type name to check
     * @returns {boolean} True if block is structural
     * @hidden
     */
    public isStructuralBlock(blockType: string): boolean {
        const type: string = blockType.toLowerCase();
        return type === 'callout' || type === 'table' || type.startsWith('collapsible') || type === 'quote';
    }

    private isStructuralBlockType(blockType: string): boolean {
        return this.isStructuralBlock(blockType);
    }

}
