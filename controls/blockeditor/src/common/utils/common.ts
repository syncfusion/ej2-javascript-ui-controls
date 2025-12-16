import { compile, select } from '@syncfusion/ej2-base';
import { StyleModel } from '../../models/index';

/**
 * Generates a unique ID with an optional prefix.
 *
 * @param {string} [prefix] - An optional prefix to differentiate models (e.g., "block", "user").
 * @returns {string} A unique ID consisting of a timestamp and random characters.
 */
export function generateUniqueId(prefix?: string): string {
    const timestamp: string = Date.now().toString(36); // Base36 timestamp (millisecond precision)
    const randomPart: string = getRandomNumber().toString(36).substring(2, 10); // 8 random characters
    return `${prefix ? prefix + '-' : ''}${timestamp}${randomPart}`.toLowerCase();
}

/**
 * Calculates the absolute offset of a given node within its parent element.
 *
 * @param {HTMLElement} element - The parent element.
 * @param {Node} node - The node to calculate the offset for.
 * @param {number} relativeOffset - The offset relative to the node.
 * @returns {number} The absolute offset of the node within the parent element.
 */
export function getAbsoluteOffset(element: HTMLElement, node: Node, relativeOffset: number): number {
    let absoluteOffset: number = 0;
    const walker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
        const textNode: Node = walker.currentNode;
        if (textNode === node) { return absoluteOffset + relativeOffset; }
        absoluteOffset += textNode.textContent.length || 0;
    }
    return absoluteOffset;
}

/**
 * Cleans up an HTML element by removing it from the DOM and setting its reference to null.
 *
 * @param {HTMLElement} element - The HTML element to clean up.
 * @returns {void}
 */
export function cleanupElement(element: HTMLElement | null): void {
    if (element) {
        element.remove();
    }
    element = null;
}

/**
 * Gets template content based on the template property value.
 *
 * @param {string | Function} template - Template property value.
 * @returns {Function} - Return template function.
 * @hidden
 */
export function getTemplateFunction(template: string | HTMLElement | Function): Function {
    if (typeof template === 'string') {
        let content: string = '';
        try {
            const tempEle: HTMLElement = select(template);
            if (tempEle) {
                //Return innerHTML incase of jsrenderer script else outerHTML
                content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
            } else {
                content = template;
            }
        } catch (e) {
            content = template;
        }
        return compile(content);
    } else {
        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        return compile(template as any);
    }
}

/**
 * Normalizes the range to handle edge cases where selection spans element boundaries
 *
 * @param {Range} range - The range to normalize.
 * @returns {Range} - The normalized range.
 */
export function normalizeRange(range: Range): Range {
    // Clone the range to avoid modifying the original
    const newRange: Range = range.cloneRange();

    // Case 1: Selection starts at end of one element and ends at start of another
    if (
        range.startContainer !== range.endContainer &&
        range.startOffset === (range.startContainer.nodeType === Node.TEXT_NODE ? (range.startContainer as Text).length : 0)) {

        // Adjust to select only the end container
        newRange.setStart(range.endContainer, 0);
        newRange.setEnd(
            range.endContainer,
            range.endContainer.nodeType === Node.TEXT_NODE ? (range.endContainer as Text).length : 0
        );
    }
    // Case 2: Partial selection across element boundaries
    else if (range.startContainer !== range.endContainer) {
        // Check if we should expand to full elements
        const startTextSelected: boolean = range.startOffset > 0;
        const endTextSelected: boolean =
            range.endOffset <
            (range.endContainer.nodeType === Node.TEXT_NODE ? (range.endContainer as Text).length : 0);

        if (startTextSelected || endTextSelected) {
            // Expand to include full elements
            newRange.setStartBefore(range.startContainer);
            newRange.setEndAfter(range.endContainer);
        }
    }
    return newRange;
}

/**
 * Creates an isolated copy of a model with independent references for all nested objects.
 *
 * This function creates a new instance of a model where all nested objects (including props,
 * styles, and other references) are also copied, preventing unintended modifications to the
 * original model or shared references. Use this function when you need to manipulate a model
 * without affecting other parts of the application that may reference the same object.
 *
 * @template T The type of the model to isolate
 * @param {T} item The original model to create an isolated copy from
 * @returns {T} A new instance of the model with independent references
 */
export function decoupleReference<T>(item: T): T {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const seen: WeakMap<object, T> = new WeakMap<object, T>();

    const cloneInternal: (obj: any) => any = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') { return obj; }
        if (seen.has(obj)) { return seen.get(obj); }

        const copy: any = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
        seen.set(obj, copy);

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[`${key}`] = cloneInternal(obj[`${key}`]);
            }
        }

        return copy;
    };

    return cloneInternal(item);
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export function getInverseStyle(style: keyof StyleModel): keyof StyleModel {
    const oppositeStyleMap: Record<string, keyof StyleModel> = {
        superscript: 'subscript',
        subscript: 'superscript',
        uppercase: 'lowercase',
        lowercase: 'uppercase'
    };
    return oppositeStyleMap[`${style}`];
}

/**
 * Normalize URL by adding protocol if missing
 *
 * @param {string} url - URL to normalize.
 * @returns {string} - Normalized URL.
 */
export function normalizeUrl(url: string): string {
    if (!url.match(/^https?:\/\//i) && !url.startsWith('/')) {
        return 'https://' + url;
    }
    return url;
}

/**
 * Denormalize URL by removing protocol if present
 *
 * @param {string} url - URL to denormalize.
 * @returns {string} - Denormalized URL.
 */
export function denormalizeUrl(url: string): string {
    if (url.startsWith('https://')) {
        return url.slice(8);
    } else if (url.startsWith('http://')) {
        return url.slice(7);
    }
    return url;
}

/**
 * Checks whether the given node is around special elements.
 * Some special elements are 'a', etc.
 *
 * @param {Node | null} node - The node to check.
 * @returns {boolean} - True if the node is around special elements, false otherwise.
 */
export function isNodeAroundSpecialElements(node: Node | null): boolean {
    const specialElements: string[] = ['A'];
    const prevSibling: Node | null = node.previousSibling;
    const nextSibling: Node | null = node.nextSibling;
    return (
        (prevSibling && specialElements.indexOf(prevSibling.nodeName) > -1) ||
        (nextSibling && specialElements.indexOf(nextSibling.nodeName) > -1) ||
        (prevSibling && (prevSibling as HTMLElement).classList &&
        (prevSibling as HTMLElement).classList.contains('e-mention-chip')) ||
        (nextSibling && (nextSibling as HTMLElement).classList &&
        (nextSibling as HTMLElement).classList.contains('e-mention-chip')) ||
        (prevSibling && (prevSibling as HTMLElement).classList &&
        (prevSibling as HTMLElement).classList.contains('e-label-chip')) ||
        (nextSibling && (nextSibling as HTMLElement).classList &&
        (nextSibling as HTMLElement).classList.contains('e-label-chip'))
    );
}


/**
 * Gets the deepest text node within an element
 *
 * @param {HTMLElement} element - The container element
 * @returns {Node} - The deepest text node or null if no text node is found
 */
export function getDeepestTextNode(element: HTMLElement): Node {
    const treeWalker: TreeWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
    );

    let deepestNode: Node | null = null;
    while (treeWalker.nextNode()) {
        deepestNode = treeWalker.currentNode;
    }

    return deepestNode;
}

/**
 * Returns the auto generated avatar color based on the seed.
 *
 * @param {string} seed - The seed string to generate the color.
 * @returns {string} - The generated color.
 */
export function getAutoAvatarColor(seed: string): string {
    const colors: string[] = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#845EC2'];
    let hash: number = 0;
    for (let i: number = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * Returns the user initials based on the name.
 *
 * @param {string} name - The name to generate initials from.
 * @returns {string} - The generated initials.
 */
export function getUserInitials(name: string): string {
    const parts: string[] = name.trim().split(' ');
    const initials: string = parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`
        : parts[0][0];
    return initials.toUpperCase();
}

/**
 * Returns the best accessible foreground color (black or white)
 * for a given background color to ensure good contrast.
 *
 * @param {string} backgroundColor - The background color in any CSS-supported format (hex, rgb, etc.)
 * @returns {string} - '#000000' or '#ffffff'
 */
export function getAccessibleTextColor(backgroundColor: string): string {
    const rgb: { r: number; g: number; b: number } = parseColor(backgroundColor);
    if (!rgb) { return '#000000'; }

    const luminance: number = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

function parseColor(color: string): { r: number; g: number; b: number } {
    if (color.startsWith('#')) {
        let hex: string = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map((c: string) => c + c).join('');
        }
        if (hex.length !== 6) { return null; }
        const bigint: number = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    const rgbMatch: RegExpMatchArray = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    return null;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
    const [R, G, B]: number[] = [r, g, b].map((channel: number) => {
        const c: number = channel / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getNormalizedKey(e: KeyboardEvent): string {
    const keys: string[] = [];

    if (e.ctrlKey || e.metaKey) { keys.push('ctrl'); }
    if (e.altKey) { keys.push('alt'); }
    if (e.shiftKey) { keys.push('shift'); }

    const key: string = normalizeCode(e.code);
    keys.push(key);

    return keys.join('+');
}

export function normalizeCode(code: string): string {
    if (code.startsWith('Digit')) {
        return code.slice(5); // Digit1 -> 1
    }
    if (code.startsWith('Key')) {
        return code.slice(3).toLowerCase(); // KeyA -> a
    }

    const specialMap: Record<string, string> = {
        'Minus': '-',             // Ctrl+Shift+-
        'Equal': '=',             // Ctrl+=
        'Backquote': '`',         // Ctrl+Shift+`
        'BracketLeft': '[',       // Ctrl+[
        'BracketRight': ']',      // Ctrl+]
        'Backslash': '\\',
        'Semicolon': ';',
        'Quote': '\'',
        'Comma': ',',
        'Period': '.',            // Ctrl+Shift+.
        'Slash': '/',             // Ctrl+/
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'Enter': 'enter',
        'Space': 'space',
        'Tab': 'tab'
    };

    return specialMap[`${code}`] || code.toLowerCase();
}

export function createSvgElement<K extends keyof SVGElementTagNameMap>(
    tagName: K,
    attributes: { [key: string]: string | undefined }
): SVGElementTagNameMap[K] {
    const SVG_NS: string = 'http://www.w3.org/2000/svg';
    const element: SVGElementTagNameMap[K] = document.createElementNS(SVG_NS, tagName) as SVGElementTagNameMap[K];

    for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            const value: string = attributes[`${key}`];
            element.setAttribute(key, value);
        }
    }

    return element;
}

export function createBaseSvg(viewBox: string = '0 0 24 24'): SVGSVGElement {
    return createSvgElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox,
        fill: 'none',
        width: '18',
        height: '18'
    });
}

/**
 * @returns {number} A cryptographically secure random number.
 * @hidden
 */
export function getRandomNumber(): number {
    const array: Uint32Array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
}
