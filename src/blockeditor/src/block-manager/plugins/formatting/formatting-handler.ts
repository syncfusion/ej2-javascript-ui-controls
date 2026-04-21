import { ExecCommandOptions, LinkData } from '../../../common/interface';
import { findClosestParent, getNodesInRange } from '../../../common/utils/dom';
import { BlockManager } from '../../base/block-manager';
import { FormattingHelper } from '../../../common/utils/isformatted';
import { getInverseStyle } from '../../../common/utils/common';
import { getBlockSpecificRange } from '../../../common/utils/block';

export class FormattingHandler {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Applies or removes a specific formatting style to a given node within a selection range.
     *
     * This method handles the process of wrapping the target node with the appropriate formatting element
     * or unwrapping/removing styles if the formatting is already present. It ensures that the formatting
     * is correctly applied or removed without disrupting the document structure.
     *
     * @param {Range} range - Optional range object representing the current selection, used for precise node splicing.
     * @param {string} format - The style property to modify, such as 'bold', 'italic', 'color', etc.
     * @param {ExecCommandOptions} options - Options to apply formatting
     * @returns {void}
     */
    public executeFormat(range: Range, format: string, options: ExecCommandOptions): void {
        const { value, shouldRemoveGlobally } = options;
        // STEP 1: Get all text nodes in selection
        const nodes: Node[] = getNodesInRange(range);

        // STEP 2: Decide apply or remove based on format state
        const shouldRemove: boolean = shouldRemoveGlobally !== undefined
            ? shouldRemoveGlobally
            : FormattingHelper.shouldRemoveFormat(nodes, format);
        const valueBasedFormats: string[] = ['color', 'backgroundColor', 'link'];
        const isValueBased: boolean = valueBasedFormats.indexOf(format as string) !== -1;

        // STEP 3: Process each node
        for (const node of nodes) {
            const isMentionNode: HTMLElement = findClosestParent(node, '.e-mention-chip');
            if (isMentionNode) { continue; }

            const formatNode: HTMLElement = FormattingHelper.getFormattedNode(node, format);

            if ((formatNode && shouldRemove) || (formatNode && isValueBased && !value)) {
                // Node HAS format and we're REMOVING (boolean styles)
                // Node HAS format, user intent to empty it so we're REMOVING (value based styles)
                this.removeFormatFromNode(node, format, range);
            } else if (formatNode && isValueBased && value) {
                // Node HAS format and we're REPLACING value (value-based styles)
                // Replace the value instead of wrapping again
                this.updateNodeValue(node, format, value, range);
            } else if (!formatNode && !shouldRemove) {
                // Node LACKS format and we're APPLYING
                this.applyFormatToNode(node, format, value, range);
            }
        }

        // STEP 4: Handle toggle pairs (superscript↔subscript, uppercase↔lowercase)
        // When applying a format that has a toggle pair, remove its opposite
        if (!shouldRemove) {
            const togglePairs: string[] = ['superscript', 'subscript', 'uppercase', 'lowercase'];
            if (togglePairs.indexOf(format as string) !== -1) {
                const oppositeFormat: string = getInverseStyle(format);
                for (const node of nodes) {
                    const conflictNode: HTMLElement = FormattingHelper.getFormattedNode(node, oppositeFormat);
                    if (conflictNode) {
                        this.parent.formattingAction.nodeSelection.restoreSelection();
                        const blockRange: Range = getBlockSpecificRange(
                            this.parent.nodeSelection.getRange(),
                            findClosestParent(range.startContainer, '.e-block')
                        );
                        this.removeFormatFromNode(node, oppositeFormat, blockRange);
                    }
                }
            }
        }

        // STEP 5: Final cleanup
        this.cleanupRange(range);
    }

    /**
     * Applies or removes a specific formatting style to a given node within a selection range.
     *
     * @param {Node} node - The DOM node to which the formatting will be applied or removed.
     * @param {string} format - The style property to modify, such as 'bold', 'italic', 'color', etc.
     * @param {string} value - Optional value for the style, e.g., color, bgColor or link.
     * @param {Range} range - Optional range object representing the current selection, used for precise node splicing.
     * @returns {void}
     */
    private applyFormatToNode(
        node: Node,
        format: string,
        value?: string | LinkData,
        range?: Range
    ): void {
        // Step 1: Split to isolate selected content
        const splitNode: Node = this.parent.nodeCutter.getSpliceNode(range, node as HTMLElement);

        // Step 2: Create format wrapper element
        const wrapper: HTMLElement = this.createFormatElement(format, value);

        // Step 3: Wrap the split node
        const parent: Node = splitNode.parentNode;
        if (parent) {
            parent.insertBefore(wrapper, splitNode);
            wrapper.appendChild(splitNode);
        }
    }

    /**
     * Remove formatting from a node by unwrapping or clearing styles.
     *
     * This method locates the formatted node within the selection,
     * then either unwraps it from its formatting element or clears inline styles.
     *
     * @param {Node} node - The node from which to remove formatting.
     * @param {string} format - The format type to remove.
     * @param {Range} [range] - Optional range to assist in node splicing.
     * @returns {void}
     */
    private removeFormatFromNode(
        node: Node,
        format: string,
        range?: Range
    ): void {
        const formatNode: HTMLElement = FormattingHelper.getFormattedNode(node, format);
        const splitNode: Node = this.parent.nodeCutter.getSpliceNode(range, formatNode);

        if (this.isStyleBased(format)) {
            this.removeStyleFromElement(splitNode as HTMLElement, format);

            const elem: HTMLElement = splitNode as HTMLElement;
            if (elem.getAttribute('style') === '' || !elem.getAttribute('style')) {
                elem.removeAttribute('style');
                if (!elem.hasAttributes()) {
                    this.unwrapElement(elem);
                }
            }
        } else {
            this.unwrapElement(splitNode as HTMLElement);
        }
    }

    private unwrapElement(element: HTMLElement): void {
        const parent: Node = element.parentNode;

        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }

        element.remove();
        parent.normalize();
    }

    private createFormatElement(format: string, value?: string | LinkData): HTMLElement | null {
        const tagMap: Record<string, string> = {
            'bold': 'strong',
            'italic': 'em',
            'underline': 'u',
            'strikethrough': 's',
            'subscript': 'sub',
            'superscript': 'sup',
            'inlineCode': 'code',
            'link': 'a'
        };

        const tagName: string = tagMap[format as keyof typeof tagMap];

        if (this.isStyleBased(format)) {
            return this.createStyledSpan(format, value as string);
        }

        const elem: HTMLElement = document.createElement(tagName);
        if (format === 'inlineCode') {
            elem.className = 'e-be-inline-code';
        }
        else if (format === 'link') {
            const linkData: LinkData = value as LinkData;
            if (linkData && !linkData.shouldRemoveLink) {
                (elem as HTMLAnchorElement).href = linkData.url;
                (elem as HTMLAnchorElement).target = '_blank';
                (elem as HTMLAnchorElement).title = linkData.url;
            }
        }
        return elem;
    }

    private createStyledSpan(format: string, value: string): HTMLElement {
        const span: HTMLElement = document.createElement('span');

        switch (format) {
        case 'color':
            span.style.color = value;
            break;
        case 'backgroundColor':
            span.style.backgroundColor = value;
            break;
        case 'uppercase':
            span.style.textTransform = 'uppercase';
            break;
        case 'lowercase':
            span.style.textTransform = 'lowercase';
            break;
        }

        return span;
    }

    /**
     * Update the style value of an element for value-based formats.
     * This replaces the existing value instead of removing and re-wrapping.
     *
     * @param {Node} node - The node containing the styled content
     * @param {string} format - The format to update
     * @param {string} value - The new value for the style
     * @param {Range} range - Optional range for node splicing
     * @returns {void}
     */
    private updateNodeValue(node: Node, format: string, value: string | LinkData, range?: Range): void {
        const formatNode: HTMLElement = FormattingHelper.getFormattedNode(node, format);
        const splitNode: Node = this.parent.nodeCutter.getSpliceNode(range, formatNode);
        if (!splitNode) { return; }

        // Update the style directly without unwrapping
        const elem: HTMLElement = splitNode as HTMLElement;
        switch (format) {
        case 'color':
            elem.style.color = value as string;
            break;
        case 'backgroundColor':
            elem.style.backgroundColor = value as string;
            break;
        case 'link':
            (elem as HTMLAnchorElement).href = (value as LinkData).url;
            (elem as HTMLAnchorElement).title = (value as LinkData).url;
        }
    }

    private removeStyleFromElement(elem: HTMLElement, format: string): void {
        switch (format) {
        case 'color':
            elem.style.color = '';
            break;
        case 'backgroundColor':
            elem.style.backgroundColor = '';
            break;
        case 'uppercase':
        case 'lowercase':
            elem.style.textTransform = '';
            break;
        }
    }

    private isStyleBased(format: string): boolean {
        const styleBased: string[] = ['color', 'backgroundColor', 'uppercase', 'lowercase'];
        return styleBased.indexOf(format) !== -1;
    }

    private cleanupRange(range: Range): void {
        const ancestor: HTMLElement = range.commonAncestorContainer as HTMLElement;
        const container: HTMLElement = (ancestor.nodeType === Node.TEXT_NODE) ? ancestor.parentElement : ancestor;

        this.mergeAdjacentTags(container);
        container.normalize();
    }

    private mergeAdjacentTags(container: HTMLElement): void {
        const children: ChildNode[] = Array.from(container.childNodes);

        let i: number = 0;
        while (i < children.length - 1) {
            const current: Node = children[i as number];
            const next: Node = children[(i + 1) as number];

            if (current.nodeType !== Node.ELEMENT_NODE || next.nodeType !== Node.ELEMENT_NODE) {
                i++;
                continue;
            }

            const currEl: HTMLElement = current as HTMLElement;
            const nextEl: HTMLElement = next as HTMLElement;

            if (currEl.tagName !== nextEl.tagName) {
                i++;
                continue;
            }

            if (currEl.tagName === 'SPAN' && currEl.style.cssText !== nextEl.style.cssText) {
                i++;
                continue;
            }

            while (nextEl.firstChild) {
                currEl.appendChild(nextEl.firstChild);
            }
            nextEl.remove();
            children.splice(i + 1, 1);
        }
    }
}
