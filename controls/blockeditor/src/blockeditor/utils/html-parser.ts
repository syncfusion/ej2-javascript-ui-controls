import { BlockModel, ContentModel, LinkSettingsModel, StyleModel } from '../models/index';
import { BlockType, ContentType } from '../base/enums';
import { generateUniqueId } from './common';
import { escapeHTML } from './security';
import { FormattingHelper } from './isformatted';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

type ListStack = { type: 'ul' | 'ol'; items: string[]; indent: number }

const hasBlockElements: (element: HTMLElement) => boolean = (element: HTMLElement): boolean => {
    const blockTags: string[] = ['P', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'HR', 'IMG', 'TABLE'];
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
                for (const li of children) {
                    if (li.tagName !== 'LI') { continue; }

                    const block: BlockModel = {
                        id: generateUniqueId('block'),
                        type: isOrdered ? BlockType.NumberedList : BlockType.BulletList,
                        content: convertInlineElementsToContentModels(li as HTMLElement, keepFormat),
                        indent: indentLevel
                    };
                    blocks.push(block);
                    isBlockProcessed = true;

                    // Handle nested lists within <li>
                    Array.from(li.children).forEach((child: HTMLElement) => {
                        if (child.tagName === 'UL' || child.tagName === 'OL') {
                            processNode(child, indentLevel + 1);
                        }
                    });
                }
            }
            else if (tag.match(/^H[1-4]$/)) {
                const level: number = parseInt(tag.substring(1), 10);
                let blockType: BlockType;

                switch (level) {
                case 1: blockType = BlockType.Heading1; break;
                case 2: blockType = BlockType.Heading2; break;
                case 3: blockType = BlockType.Heading3; break;
                case 4: blockType = BlockType.Heading4; break;
                default: blockType = BlockType.Paragraph;
                }

                blocks.push(createBlockFromElement(element, blockType, keepFormat));
                isBlockProcessed = true;
            }
            else if (tag === 'BLOCKQUOTE') {
                blocks.push(createBlockFromElement(element, BlockType.Quote, keepFormat));
                isBlockProcessed = true;
            }
            else if (tag === 'HR') {
                blocks.push({
                    id: generateUniqueId('block'),
                    type: BlockType.Divider
                });
                isBlockProcessed = true;
            }
            else if (tag === 'IMG') {
                const img: HTMLImageElement = element as HTMLImageElement;
                blocks.push({
                    id: generateUniqueId('block'),
                    type: BlockType.Image,
                    imageSettings: {
                        src: img.src,
                        altText: img.alt
                    }
                });
                isBlockProcessed = true;
            }
            else if (tag === 'PRE' && element.querySelector('code')) {
                blocks.push({
                    id: generateUniqueId('block'),
                    type: BlockType.Code,
                    content: [
                        { content: element.textContent, type: ContentType.Text }
                    ]
                });
                isBlockProcessed = true;
            }
            else if (tag === 'P') {
                blocks.push(createBlockFromElement(element, BlockType.Paragraph, keepFormat));
                isBlockProcessed = true;
            }
            else if (tag === 'TABLE') {
                const tablebody: HTMLElement = element.querySelector('tbody');
                const rows: NodeListOf<HTMLElement> = tablebody.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                if (rows.length > 0) {
                    rows.forEach((row: HTMLElement) => {
                        blocks.push(createBlockFromElement(row, BlockType.Paragraph, keepFormat));
                    });
                }
                isBlockProcessed = true;
            }
            if ((tag === 'DIV') && !hasBlockElements(element)) {
                blocks.push(createBlockFromElement(element, BlockType.Paragraph, keepFormat));
                isBlockProcessed = true;
            }
        }
        else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            const block: BlockModel = {
                id: generateUniqueId('block'),
                type: BlockType.Paragraph,
                content: [{
                    id: generateUniqueId('content'),
                    type: ContentType.Text,
                    content: node.textContent.trim()
                }]
            };
            blocks.push(block);
            isBlockProcessed = true;
        }

        return isBlockProcessed;
    };

    const traverseDOM: (element: Node) => void = (element: Node) => {

        const isBlockProcessed: boolean = processNode(element);

        if (!isBlockProcessed && element.nodeType === Node.ELEMENT_NODE) {
            const tagName: string = (element as HTMLElement).tagName;
            // Skip traversing children for elements that are processed as whole units
            const validBlockElements: boolean = ['P', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'HR', 'IMG', 'TABLE'].indexOf(tagName) !== -1 ||
                                       !isNullOrUndefined(tagName.match(/^H[1-4]$/));
            if (!validBlockElements) {
                Array.from(element.childNodes).forEach(traverseDOM);
            }
        }
    };

    Array.from(container.childNodes).forEach((node: Node) => {
        traverseDOM(node);
    });

    return blocks;
}

export function createBlockFromElement(element: HTMLElement, blockType: BlockType, keepFormat: boolean): BlockModel {
    const block: BlockModel = {
        id: generateUniqueId('block'),
        type: blockType,
        content: []
    };

    block.content = convertInlineElementsToContentModels(element, keepFormat);
    return block;
}

export function convertInlineElementsToContentModels(element: HTMLElement, keepFormat: boolean): ContentModel[] {
    const content: ContentModel[] = [];
    if (!keepFormat) {
        if (element.textContent !== '') {
            return [{
                id: generateUniqueId('content'),
                type: ContentType.Text,
                content: element.textContent
            }];
        }
    }

    const styleStack: StyleModel[] = [{}];
    let currentLink: LinkSettingsModel;

    const processNode: (node: Node) => void = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let text: string = node.textContent;
            text = text.replace(/\n/g, '');
            if (text !== '') {
                content.push(createContentModel(text, styleStack[styleStack.length - 1], currentLink));
            }
            return;
        }

        const el: HTMLElement = node as HTMLElement;

        if (el.tagName === 'UL' || el.tagName === 'OL') {
            return;
        }

        if (el.tagName === 'A') {
            const prevLink: LinkSettingsModel = currentLink;
            currentLink = {
                url: el.getAttribute('href') || '',
                openInNewWindow: el.getAttribute('target') === '_blank'
            };
            processChildren(el);
            currentLink = prevLink;
            return;
        }

        if (el.tagName === 'CODE') {
            content.push({
                id: generateUniqueId('content'),
                type: ContentType.Code,
                content: el.textContent || '',
                styles: styleStack[styleStack.length - 1]
            });
            return;
        }

        const newStyles: StyleModel = extractStylesFromElement(el, styleStack[styleStack.length - 1]);
        if (Object.keys(newStyles).length > 0) {
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

    const createContentModel: (text: string, styles: StyleModel, link: LinkSettingsModel) => ContentModel = (
        text: string,
        styles: StyleModel,
        link: LinkSettingsModel
    ): ContentModel => {
        let content: ContentModel = {
            id: generateUniqueId('content'),
            type: ContentType.Text,
            content: text,
            styles: { ...styles },
            stylesApplied: Object.keys(styles).filter((style: string) => (styles as any)[`${style}`])
        };
        if (link) {
            content = {
                ...content,
                type: ContentType.Link,
                linkSettings: {
                    url: link.url,
                    openInNewWindow: link.openInNewWindow
                }
            };
        }
        return content;
    };

    processChildren(element);
    return content;
}

export function extractStylesFromElement(element: HTMLElement, styles: StyleModel = {}): StyleModel {
    const newStyles: StyleModel = { ...styles };

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
        newStyles.bgColor = FormattingHelper.getBackgroundColor(element);
    }

    return newStyles;
}

export function getBlockDataAsHTML(blocks: BlockModel[]): string {
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

        const isList: boolean = ['bulletlist', 'numberedlist', 'checklist'].indexOf(block.type.toLowerCase()) !== -1;
        const listType: 'ul' | 'ol' = block.type.toLowerCase() === 'numberedlist' ? 'ol' : 'ul';
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
            htmlParts.push(renderBlockAsHTML(block));
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
            if (item.styles) {
                const styleOrder: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
                    'subscript', 'uppercase', 'lowercase', 'color', 'bgColor'];
                for (const style of styleOrder) {
                    if ((item.styles as any)[`${style}`]) {
                        switch (style.toLowerCase()) {
                        case 'bold': text = `<strong>${text}</strong>`; break;
                        case 'italic': text = `<em>${text}</em>`; break;
                        case 'underline': text = `<u>${text}</u>`; break;
                        case 'strikethrough': text = `<s>${text}</s>`; break;
                        case 'superscript': text = `<sup>${text}</sup>`; break;
                        case 'subscript': text = `<sub>${text}</sub>`; break;
                        case 'uppercase': text = `<span style="text-transform: uppercase;">${text}</span>`; break;
                        case 'lowercase': text = `<span style="text-transform: lowercase;">${text}</span>`; break;
                        case 'color': text = `<span style="color: ${item.styles.color};">${text}</span>`; break;
                        case 'bgcolor': text = `<span style="background-color: ${item.styles.bgColor};">${text}</span>`; break;
                        case 'custom': text = `<span style="${item.styles.custom};">${text}</span>`; break;
                        }
                    }
                }
            }
            if (item.type === ContentType.Link && item.linkSettings && item.linkSettings.url) {
                const target: string = item.linkSettings.openInNewWindow ? 'target="_blank"' : '';
                text = `<a href="${escapeHTML(item.linkSettings.url)}" ${target}>${text}</a>`;
            }
            return text;
        }).join('');
}

export function renderBlockAsHTML(block: BlockModel): string {
    const contentHTML: string = renderContentAsHTML(block.content);
    switch (block.type.toLowerCase()) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
    case 'heading4': {
        const level: string = block.type.charAt(block.type.length - 1);
        return `<h${level}>${contentHTML}</h${level}>`;
    }
    case 'paragraph':
        return `<p>${contentHTML}</p>`;
    case 'quote':
        return `<blockquote>${contentHTML}</blockquote>`;
    case 'callout': {
        const childrenHTML: string = block.children && block.children.map((child: BlockModel) => renderBlockAsHTML(child)).join('') || '';
        return `<div class="callout">${childrenHTML}</div>`;
    }
    case 'divider':
        return '<hr />';
    case 'code':
        return `<pre><code>${block.content[0].content}</code></pre>`;
    case 'image': {
        if (block.imageSettings && block.imageSettings.src === '') { return ''; }
        return `<img src='${block.imageSettings.src}' alt='${block.imageSettings.altText}' />`;
    }
    case 'toggleparagraph':
    case 'toggleheading1':
    case 'toggleheading2':
    case 'toggleheading3':
    case 'toggleheading4': {
        const childrenHTML: string = block.children && block.children.map((child: BlockModel) => renderBlockAsHTML(child)).join('') || '';
        return `<div class="toggle">${contentHTML} ${childrenHTML}</div>`;
    }
    default:
        return `<div>${contentHTML}</div>`;
    }
}
