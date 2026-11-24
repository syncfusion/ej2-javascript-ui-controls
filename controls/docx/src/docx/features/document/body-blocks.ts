import { registerFeatureBlockHandler, resetFeatureBlockHandlers, tryParseFeatureBlock, serializeFeatureBlock, BodyBlockParseContext, FeatureBlockHandler } from '../../core/registry/block-handlers';
import {
    Paragraph,
    BlockContent,
    shouldEmitPageBreakAfterParagraph,
    createPageBreakAfterParagraphElement
} from './paragraph';
import { isWml } from './wml';
import { OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { tryParseBookmarkStart, tryParseBookmarkEnd, BookmarkStart, BookmarkEnd } from '../bookmarks/index';
import { ParagraphItem } from './paragraph-item';
export { BodyBlockParseContext, FeatureBlockHandler };
export { registerFeatureBlockHandler, resetFeatureBlockHandlers, tryParseFeatureBlock, serializeFeatureBlock };
export function parseBodyBlocks(children: ReadonlyArray<OpenXmlChild>, ctx: BodyBlockParseContext): BlockContent[] {
    const blocks: BlockContent[] = [];

    for (const child of children) {
        if (child.kind !== 'element') {
            continue;
        }
        if (isWml(child, 'p')) {
            const parsed: Paragraph = Paragraph.fromXml(child, ctx);
            blocks.push({ type: 'paragraph', paragraph: parsed });
            continue;
        }

        // Handle bookmarks at body level (between paragraphs)
        const bookmarkStart: BookmarkStart | undefined = tryParseBookmarkStart(child);
        if (bookmarkStart !== undefined) {
            blocks.push({ type: 'bookmark-start', bookmarkStart });
            continue;
        }

        const bookmarkEnd: BookmarkEnd | undefined = tryParseBookmarkEnd(child);
        if (bookmarkEnd !== undefined) {
            blocks.push({ type: 'bookmark-end', bookmarkEnd });
            continue;
        }

        const feature: BlockContent = tryParseFeatureBlock(child, ctx);
        if (feature !== undefined) {
            blocks.push(feature);
            continue;
        }
        blocks.push({ type: 'opaque', xml: child });
    }
    return blocks;
}

/**
 * Stabilize body blocks by moving body-level bookmarks:
 * - BookmarkStart at body level → inject as first item into NEXT paragraph
 * - BookmarkEnd after a table → set isAfterTableMark=true, place in last paragraph of last table cell
 * - BookmarkEnd after a paragraph → set isAfterParagraphMark=true, serialize after paragraph
 *
 * @param {BlockContent[]} blocks - The blocks to stabilize.
 * @returns {BlockContent[]} Stabilized blocks with bookmarks moved into paragraphs/tables.
 * @private
 */
export function stabilizeBodyLevelBookmarks(blocks: BlockContent[]): BlockContent[] {
    const result: BlockContent[] = [];
    const pendingBookmarkStarts: BookmarkStart[] = [];

    for (let i: number = 0; i < blocks.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- array index bounded by loop counter
        const block: BlockContent = blocks[i];

        if (block.type === 'bookmark-start') {
            // BookmarkStart at body level: will inject into next paragraph
            pendingBookmarkStarts.push(block.bookmarkStart);
            continue;
        }

        if (block.type === 'bookmark-end') {
            // BookmarkEnd at body level: check what follows
            const nextBlock: BlockContent | undefined = i + 1 < blocks.length ? blocks[i + 1] : undefined;

            if (nextBlock && nextBlock.type === 'paragraph') {
                // Paragraph follows: set flag to serialize after previous paragraph
                block.bookmarkEnd.isAfterParagraphMark = true;
                if (result.length > 0) {
                    const prevBlock: BlockContent | undefined = result[result.length - 1];
                    if (prevBlock && prevBlock.type === 'paragraph') {
                        prevBlock.paragraph.items.add(block.bookmarkEnd);
                        continue;
                    }
                }
            } else if (nextBlock && nextBlock.type === 'feature') {
                // Check if it's a table (feature blocks include tables)
                // For now, handle tables when we can identify them
                block.bookmarkEnd.isAfterTableMark = true;
            }

            // If we couldn't place it yet, keep it for now (will be in result as opaque)
            result.push(block);
            continue;
        }

        if (block.type === 'paragraph') {
            // Inject pending BookmarkStarts as first items into this paragraph
            for (const bookmarkStart of pendingBookmarkStarts) {
                block.paragraph.items.add(bookmarkStart);
            }
            pendingBookmarkStarts.length = 0;

            result.push(block);
            continue;
        }

        result.push(block);
    }

    return result;
}

export function serializeBodyBlocks(blocks: ReadonlyArray<BlockContent>): OpenXmlElement[] {
    const out: OpenXmlElement[] = [];
    for (const block of blocks) {
        if (block.type === 'paragraph') {
            out.push(block.paragraph.toOpenXml());

            // Emit BookmarkEnd elements with isAfterParagraphMark=true after the paragraph
            const paragraphItems: ReadonlyArray<ParagraphItem> = block.paragraph.items.toArray();
            for (const item of paragraphItems) {
                if (item === undefined) {
                    continue;
                }
                // Only BookmarkEnd with isAfterParagraphMark=true serializes at body level
                if ((item as any).type === 'bookmarkEnd' && (item as any).isAfterParagraphMark === true) {
                    out.push((item as any).toOpenXml());
                }
            }

            // Word pageBreakAfter: emit a separate page-break paragraph after
            // content — never invent w:pageBreakAfter on pPr, and never put the
            // break run inside the content paragraph.
            // Citation: ECMA-376-1 §17.3.3.1 w:br; the format specification
            if (shouldEmitPageBreakAfterParagraph(block.paragraph)) {
                out.push(createPageBreakAfterParagraphElement());
            }
            continue;
        }
        if (block.type === 'feature') {
            out.push(serializeFeatureBlock(block));
            // TODO: Handle BookmarkEnd with isAfterTableMark, isAfterRowMark, isAfterCellMark for tables
            continue;
        }
        if (block.type === 'bookmark-start') {
            out.push(block.bookmarkStart.toOpenXml());
            continue;
        }
        if (block.type === 'bookmark-end') {
            out.push(block.bookmarkEnd.toOpenXml());
            continue;
        }
        out.push(block.xml);
    }
    return out;
}
