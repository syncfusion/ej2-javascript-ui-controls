import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BaseStylesProp, BlockModel, ContentModel, IHeadingBlockSettings, IImageBlockSettings,
    ILinkContentSettings, StyleModel, Styles, TableCellModel, TableColumnModel, ITableBlockSettings, TableRowModel} from '../../models/index';
import { escapeHTML, sanitizeHelper } from './security';
import * as constants from '../../common/constant';
import { FormattingHelper } from './isformatted';
import { BlockFactory } from '../../block-manager/services/block-factory';
import { BlockType, ContentType } from '../../models/enums';
import { TableClipboardPayload } from '../../block-manager/base/interface';
import { buildTableClipboardPayload, extractPlainTextMatrixFromPayload, htmlTableFromMatrix } from './clipboard-utils';
import { focusAllCellsInTable, removeFocusFromAllCells } from './table-utils';
import { LinkData } from '../interface';

type ListStack = { type: 'ul' | 'ol'; items: string[]; indent: number }

const hasBlockElements: (element: HTMLElement) => boolean = (element: HTMLElement): boolean => {
    const blockTags: string[] = ['H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'HR', 'IMG', 'TABLE'];
    return blockTags.some((tag: string) => element.querySelector(tag) !== null);
};

export function convertHtmlElementToBlocks(container: HTMLElement, keepFormat: boolean): BlockModel[] {
    const blocks: BlockModel[] = [];

    const processNode: (node: Node, indentLevel?: number) => boolean = (node: Node, indentLevel: number = 0) => {
        let isBlockProcessed: boolean = false;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') { return isBlockProcessed; }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element: HTMLElement = node as HTMLElement;
            const tag: string = element.tagName;

            if (tag === 'UL' || tag === 'OL') {
                const isOrdered: boolean = tag === 'OL';
                const children: HTMLElement[] = Array.from(element.children) as HTMLElement[];
                for (const child of children) {
                    if (child.tagName === 'LI') {
                        // Create list item block from <li> content
                        blocks.push(
                            BlockFactory.createBlockFromPartial({
                                blockType: isOrdered ? BlockType.NumberedList : BlockType.BulletList,
                                content: convertInlineElementsToContentModels(child, keepFormat),
                                indent: indentLevel
                            })
                        );

                        // Recurse into **nested lists** inside this <li>
                        Array.from(child.children).forEach((nested: HTMLElement) => {
                            if (nested.tagName === 'UL' || nested.tagName === 'OL') {
                                processNode(nested, indentLevel + 1);
                            }
                        });
                    }

                    if (child.tagName === 'UL' || child.tagName === 'OL') {
                        // Recurse into **nested lists** if any, inside this <ul>
                        processNode(child, indentLevel + 1);
                    }

                    isBlockProcessed = true;
                }
            }
            else if (tag.match(/^H[1-4]$/)) {
                const level: number = parseInt(tag.substring(1), 10);

                blocks.push(
                    BlockFactory.createHeadingBlock(
                        { content: convertInlineElementsToContentModels(element, keepFormat) },
                        { level: level }
                    )
                );
                isBlockProcessed = true;
            }
            else if (tag === 'BLOCKQUOTE') {
                blocks.push(
                    BlockFactory.createQuoteBlock(
                        { content: convertInlineElementsToContentModels(element, keepFormat) }
                    )
                );
                isBlockProcessed = true;
            }
            else if (tag === 'HR') {
                blocks.push(BlockFactory.createDividerBlock());
                isBlockProcessed = true;
            }
            else if (tag === 'IMG') {
                const sanitizedHtml: string = sanitizeHelper(element.outerHTML, true);
                const temp: HTMLElement = document.createElement('div');
                temp.innerHTML = sanitizedHtml;
                const img: HTMLImageElement = temp.firstChild as HTMLImageElement;
                if (img) {
                    blocks.push(
                        BlockFactory.createImageBlock(
                            {},
                            {
                                src: img.src,
                                altText: img.alt
                            }
                        )
                    );
                }
                isBlockProcessed = true;
            }
            else if (tag === 'PRE' && element.querySelector('code')) {
                blocks.push(
                    BlockFactory.createCodeBlock(
                        { content: [BlockFactory.createTextContent({ content: element.textContent })] }
                    )
                );
                isBlockProcessed = true;
            }
            else if ((tag === 'P') && !hasBlockElements(element)) {
                blocks.push(
                    BlockFactory.createParagraphBlock(
                        { content: convertInlineElementsToContentModels(element, keepFormat) }
                    )
                );
                isBlockProcessed = true;
            }
            else if (tag === 'TABLE') {
                const model: BlockModel = parseHtmlTableToBlock(element);
                if (model) { blocks.push(model); }
                isBlockProcessed = true;
            }
            if ((tag === 'DIV') && !hasBlockElements(element)) {
                blocks.push(
                    BlockFactory.createParagraphBlock(
                        { content: convertInlineElementsToContentModels(element, keepFormat) }
                    )
                );
                isBlockProcessed = true;
            }
        }
        else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            blocks.push(
                BlockFactory.createParagraphBlock({
                    content: [ BlockFactory.createTextContent({ content: node.textContent.trim() }) ]
                })
            );
            isBlockProcessed = true;
        }

        return isBlockProcessed;
    };

    const traverseDOM: (element: Node) => void = (element: Node) => {

        const isBlockProcessed: boolean = processNode(element);

        if (!isBlockProcessed && element.nodeType === Node.ELEMENT_NODE) {
            const tagName: string = (element as HTMLElement).tagName;
            // Skip traversing children for elements that are processed as whole units
            const ignorableNestedChildren: boolean = ['PRE', 'HR', 'IMG', 'TABLE'].indexOf(tagName) !== -1;
            if (!ignorableNestedChildren) {
                Array.from(element.childNodes).forEach(traverseDOM);
            }
        }
    };

    Array.from(container.childNodes).forEach((node: Node) => {
        traverseDOM(node);
    });

    return blocks;
}

export function convertInlineElementsToContentModels(element: HTMLElement, keepFormat: boolean): ContentModel[] {
    const content: ContentModel[] = [];
    if (!keepFormat) {
        if (element.textContent !== '') {
            return [BlockFactory.createTextContent({ content: element.textContent })];
        }
    }

    const styleStack: Styles[] = [{} as any];
    let linkProps: ILinkContentSettings;

    const processNode: (node: Node) => void = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let text: string = node.textContent;
            text = text.replace(/\n/g, '');
            if (text !== '') {
                content.push(createContentModel(text, styleStack[styleStack.length - 1], linkProps));
            }
            return;
        }

        const el: HTMLElement = node as HTMLElement;

        if (el.classList.contains('e-mention-chip')) {
            let chipModel: ContentModel;
            if (el.classList.contains('e-user-chip')) {
                const userId: string = el.getAttribute('data-user-id');
                chipModel = BlockFactory.createMentionContent(
                    { content: el.textContent },
                    { userId }
                );
            } else {
                const labelId: string = el.getAttribute('data-label-id');
                chipModel = BlockFactory.createLabelContent(
                    { content: el.textContent },
                    { labelId }
                );
            }

            content.push(chipModel);
            return;
        }

        if (el.tagName === 'UL' || el.tagName === 'OL') {
            return;
        }

        if (el.tagName === 'A') {
            const prevLink: ILinkContentSettings = linkProps;
            linkProps = {
                url: el.getAttribute('href') || ''
            };
            processChildren(el);
            linkProps = prevLink;
            return;
        }

        // <br> → insert linebreak
        if (el.tagName === 'BR') {
            content.push(createContentModel('\n', styleStack[styleStack.length - 1], linkProps));
            return;
        }

        const newStyles: Styles = extractStylesFromElement(el, styleStack[styleStack.length - 1]);
        if (newStyles && Object.keys(newStyles).length > 0) {
            styleStack.push(newStyles);
            processChildren(el);
            styleStack.pop();
        } else {
            processChildren(el);
        }
    };

    const processChildren: (node: Node) => void = (parent: Node) => {
        Array.from(parent.childNodes).forEach(processNode);
    };

    type createContentFunction = (text: string, styles: Styles, link: ILinkContentSettings) => ContentModel;

    const createContentModel: createContentFunction = (
        text: string,
        styles: Styles,
        link: ILinkContentSettings
    ): ContentModel => {
        if (link) {
            return BlockFactory.createLinkContent(
                {
                    content: text
                },
                {
                    styles: { ...styles },
                    url: link.url
                }
            );
        }

        return BlockFactory.createTextContent({ content: text }, { styles: { ...styles } });
    };

    processChildren(element);
    return content;
}

export function extractStylesFromElement(
    element: HTMLElement,
    styles: (Styles | LinkData) = {} as any
): Styles {
    const newStyles: Styles = { ...styles } as any;

    const isBold: boolean = FormattingHelper.isBold(element);
    if (isBold) {
        newStyles.bold = isBold;
    }
    const isItalic: boolean = FormattingHelper.isItalic(element);
    if (isItalic) {
        newStyles.italic = isItalic;
    }
    const isUnderline: boolean = FormattingHelper.isUnderline(element);
    if (isUnderline) {
        newStyles.underline = isUnderline;
    }
    const isStrikethrough: boolean = FormattingHelper.isStrikethrough(element);
    if (isStrikethrough) {
        newStyles.strikethrough = isStrikethrough;
    }
    const isSuperscript: boolean = FormattingHelper.isSuperscript(element);
    if (isSuperscript) {
        newStyles.superscript = isSuperscript;
    }
    const isSubscript: boolean = FormattingHelper.isSubscript(element);
    if (isSubscript) {
        newStyles.subscript = isSubscript;
    }
    if (element.style.color) {
        newStyles.color = FormattingHelper.getFontColor(element);
    }
    if (element.style.backgroundColor) {
        newStyles.backgroundColor = FormattingHelper.getBackgroundColor(element);
    }
    const isInlineCode: boolean = FormattingHelper.isInlineCode(element);
    if (isInlineCode) {
        newStyles.inlineCode = isInlineCode;
    }
    const isUppercase: boolean = element.style.textTransform === 'uppercase';
    if (isUppercase) {
        newStyles.uppercase = isUppercase;
    }
    const isLowercase: boolean = element.style.textTransform === 'lowercase';
    if (isLowercase) {
        newStyles.lowercase = isLowercase;
    }
    const isLink: boolean = FormattingHelper.isLink(element);
    if (isLink) {
        (newStyles as LinkData).url = FormattingHelper.getLinkUrl(element);
    }

    return newStyles;
}

/**
 * Detects all active formats for a specific text node.
 * Traverses upward through DOM to find format-containing ancestors.
 *
 * @param {Text} node - The text node to analyze
 * @returns {Styles} - All detected formats on this node
 * @hidden
 */
export function detectFormatsForTextNode(node: Node): Styles {
    const merged: Styles = {};
    let currentElement: HTMLElement = node.parentElement;

    while (currentElement) {
        // Stop at block boundary (element with id)
        if (currentElement.id) {
            break;
        }

        const newStyles: Styles = extractStylesFromElement(currentElement, merged);
        Object.assign(merged, newStyles);

        currentElement = currentElement.parentElement;
    }

    return merged;
}

export function parseHtmlTableToMatrix(root: HTMLElement): { matrix: HTMLElement[][]; hasHeader: boolean } {
    const table: HTMLTableElement = (root.tagName === 'TABLE' ? root : root.querySelector('table')) as HTMLTableElement;
    if (!table) { return { matrix: [], hasHeader: false }; }

    const thead: HTMLTableSectionElement = table.querySelector('thead') as HTMLTableSectionElement;
    const tbody: HTMLTableSectionElement = table.querySelector('tbody') as HTMLTableSectionElement;
    const hasHeader: boolean = !!thead && !!thead.rows && thead.rows.length > 0;
    const rows: HTMLTableRowElement[] = [];
    const matrix: HTMLElement[][] = [];

    if (thead && thead.rows && thead.rows.length) { rows.push(thead.rows[0 as number]); }
    if (tbody) {
        Array.from(tbody.querySelectorAll('tr')).forEach((tr: HTMLTableRowElement) => rows.push(tr));
    }

    for (const tr of rows) {
        const cells: HTMLElement[] = Array.from(tr.querySelectorAll('th,td')) as HTMLElement[];
        // Ignore row-number column if present by class
        const filtered: HTMLElement[] = cells.filter((c: HTMLElement) => !c.classList.contains('e-row-number'));
        matrix.push(filtered);
    }

    // Normalize to rectangular grid by padding shorter rows
    const maxCols: number = Math.max(0, ...matrix.map((r: HTMLElement[]) => r.length));
    matrix.forEach((row: HTMLElement[]) => {
        while (row.length < maxCols) { row.push(document.createElement('td')); }
    });
    return { matrix, hasHeader };
}

export function parseHtmlTableToBlock(element: HTMLElement): BlockModel {
    const { matrix, hasHeader }: { matrix: HTMLElement[][]; hasHeader: boolean } = parseHtmlTableToMatrix(element);
    if (!matrix.length) { return null; }

    const bodyStart: number = hasHeader ? 1 : 0;
    const colsCount: number = matrix[0 as number].length;

    // Build columns with header text (plain for header)
    const columns: TableColumnModel[] = new Array(colsCount).fill(0).map((_: number, idx: number) => ({
        id: `col_${idx}`, width: '', headerText: hasHeader ? (matrix[0 as number][idx as number].textContent).trim() : ''
    }));

    // Build row models with blocks per cell using existing conversion
    const rows: TableRowModel[] = [];
    for (let r: number = bodyStart; r < matrix.length; r++) {
        const cells: TableCellModel[] = [];
        for (let c: number = 0; c < colsCount; c++) {
            const cellEl: HTMLElement = matrix[r as number][c as number];
            const blocks: BlockModel[] = hasBlockElements(cellEl) ? convertHtmlElementToBlocks(cellEl, true) : [];
            // Fallback to plain text paragraph if no blocks detected
            const cellBlocks: BlockModel[] = blocks.length
                ? blocks
                : [BlockFactory.createParagraphBlock({ content: convertInlineElementsToContentModels(cellEl, true) })];
            cells.push({ columnId: columns[c as number].id, blocks: cellBlocks });
        }
        rows.push({ cells });
    }

    const properties: ITableBlockSettings = {
        enableHeader: hasHeader,
        enableRowNumbers: true,
        columns,
        rows
    };
    return BlockFactory.createBlockFromPartial({ blockType: 'Table', properties});
}

export function getBlockDataAsHTML(blocks: BlockModel[], editorId?: string): string {
    if (!blocks || blocks.length === 0) { return ''; }

    const htmlParts: string[] = [];
    const listStack: ListStack[] = [];
    let currentIndent: number = -1;

    const closeListsToLevel: (targetIndent: number) => void = (targetIndent: number) => {
        while (listStack.length > 0 && listStack[parseInt((listStack.length - 1).toString(), 10)].indent >= targetIndent) {
            const finishedList: ListStack = listStack.pop()!;
            const listHtml: string = `<${finishedList.type}>${finishedList.items.map((item: string) =>
                item + '</li>').join('')}</${finishedList.type}>`;

            if (listStack.length > 0) {
                const parentList: ListStack = listStack[parseInt((listStack.length - 1).toString(), 10)];
                const lastIdx: number = parentList.items.length - 1;
                parentList.items[parseInt(lastIdx.toString(), 10)] += listHtml;
            } else {
                htmlParts.push(listHtml);
            }
        }
    };

    for (const block of blocks) {
        if (!block) { continue; }

        const isList: boolean = ['bulletlist', 'numberedlist', 'checklist'].indexOf(block.blockType.toLowerCase()) !== -1;
        const listType: 'ul' | 'ol' = block.blockType.toLowerCase() === 'numberedlist' ? 'ol' : 'ul';
        const indent: number = block.indent || 0;

        if (isList) {
            // Close deeper lists when moving to a higher level (less indentation)
            if (listStack.length === 0 ||
                listStack[listStack.length - 1].type !== listType ||
                indent < currentIndent) {
                closeListsToLevel(indent);
            }

            // Start new list if:
            // 1. First list item
            // 2. Different list type
            // 3. Increased indentation
            if (listStack.length === 0 ||
                listStack[parseInt((listStack.length - 1).toString(), 10)].type !== listType ||
                indent > currentIndent
            ) {
                listStack.push({
                    type: listType,
                    items: [],
                    indent
                });
                currentIndent = indent;
            }

            const contentHtml: string = renderContentAsHTML(block.content);
            listStack[parseInt((listStack.length - 1).toString(), 10)].items.push(`<li>${contentHtml}`);
        } else {
            closeListsToLevel(0);
            currentIndent = -1;
            htmlParts.push(renderBlockAsHTML(block, editorId));
        }
    }

    closeListsToLevel(0);
    return htmlParts.join('');
}

export function renderContentAsHTML(content: ContentModel[] = []): string {
    return content
        .map((item: ContentModel) => {
            if (!item || !item.content) { return ''; }

            let text: string = escapeHTML(item.content);
            const props: BaseStylesProp = item.properties as BaseStylesProp;
            const styles: Styles = (props && props.styles) ? props.styles : {};
            const keys: string[] = Object.keys(styles);
            if (keys.length > 0) {
                for (const style of keys) {
                    if (styles[style as keyof StyleModel]) {
                        switch (style.toLowerCase()) {
                        case 'bold': text = `<strong>${text}</strong>`; break;
                        case 'italic': text = `<em>${text}</em>`; break;
                        case 'underline': text = `<u>${text}</u>`; break;
                        case 'strikethrough': text = `<s>${text}</s>`; break;
                        case 'superscript': text = `<sup>${text}</sup>`; break;
                        case 'subscript': text = `<sub>${text}</sub>`; break;
                        case 'uppercase': text = `<span style="text-transform: uppercase;">${text}</span>`; break;
                        case 'lowercase': text = `<span style="text-transform: lowercase;">${text}</span>`; break;
                        case 'color': text = `<span style="color: ${styles.color};">${text}</span>`; break;
                        case 'backgroundcolor': text = `<span style="background-color: ${styles.backgroundColor};">${text}</span>`; break;
                        case 'inlinecode': text = `<code>${text}</code>`; break;
                        }
                    }
                }
            }
            if (item.contentType === ContentType.Link && item.properties) {
                const props: ILinkContentSettings = item.properties as ILinkContentSettings;
                const target: string = 'target="_blank"';
                text = `<a href="${escapeHTML(props.url)}" ${target}>${text}</a>`;
            }
            return text;
        }).join('');
}

export function renderBlockAsHTML(block: BlockModel, editorId?: string): string {
    const contentHTML: string = renderContentAsHTML(block.content);
    switch (block.blockType.toLowerCase()) {
    case 'heading': {
        const level: number = (block.properties as IHeadingBlockSettings).level;
        return renderElementWithWrapper(`h${level}`, contentHTML);
    }
    case 'paragraph':
        return renderElementWithWrapper('p', contentHTML);
    case 'quote': {
        const children: BlockModel[] = (block.properties as BaseChildrenProp).children;
        const childrenHTML: string = children && children.map((child: BlockModel) => renderBlockAsHTML(child)).join('') || '';
        return renderElementWithWrapper('blockquote', childrenHTML);
    }
    case 'callout': {
        const children: BlockModel[] = (block.properties as BaseChildrenProp).children;
        const childrenHTML: string = children && children.map((child: BlockModel) => renderBlockAsHTML(child)).join('') || '';
        return renderElementWithWrapper('div', childrenHTML, 'callout');
    }
    case 'divider':
        return '<hr />';
    case 'code':
        return `<pre><code>${block.content[0].content}</code></pre>`;
    case 'image': {
        const props: IImageBlockSettings = block.properties as IImageBlockSettings;
        if (props && props.src === '') { return ''; }
        return `<img src='${props.src}' alt='${props.altText}' />`;
    }
    case 'collapsibleparagraph':
    case 'collapsibleheading': {
        const children: BlockModel[] = (block.properties as BaseChildrenProp).children;
        const childrenHTML: string = children && children.map((child: BlockModel) => renderBlockAsHTML(child)).join('') || '';
        return renderElementWithWrapper('div', (contentHTML + ' ' + childrenHTML), 'collapsible');
    }
    case 'table': {
        const editorRoot: HTMLElement = document.querySelector(`#${editorId}`);
        const tableBlockEl: HTMLTableElement = editorRoot.querySelector(`#${block.id}`);
        focusAllCellsInTable(tableBlockEl);
        const payload: TableClipboardPayload = buildTableClipboardPayload(tableBlockEl, block);
        const matrixText: string[][] = extractPlainTextMatrixFromPayload(payload, block);
        const html: string = htmlTableFromMatrix(
            matrixText, { hasHeader: payload.meta.enableHeader, hasRowNumbers: payload.meta.enableRowNumbers }
        );
        removeFocusFromAllCells(tableBlockEl);
        return html;
    }
    default:
        return renderElementWithWrapper('div', contentHTML);
    }
}

export function renderElementWithWrapper(tagName: string, content: string, className?: string): string {
    const classAttr: string = className ? ` class="${className}"` : '';
    return `<${tagName}${classAttr}>${content}</${tagName}>`;
}
