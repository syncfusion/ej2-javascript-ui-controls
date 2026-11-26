/**
 * Shared secure rendered table snapshots, independent of optional export modules.
 *
 * @hidden
 */
export class RenderedStyleUtil {
    /**
     * Captures allowlisted computed table styles before removing styling ancestors and active content.
     *
     * @param {HTMLElement} table - The live rendered table.
     * @returns {HTMLElement} A safe standalone styled table, preserving report spans.
     * @hidden
     */
    public static table(table: HTMLElement): HTMLElement {
        const clone: HTMLElement = table.cloneNode(true) as HTMLElement;
        const originals: Element[] = [table].concat(Array.from(table.querySelectorAll('*')));
        const copies: Element[] = [clone].concat(Array.from(clone.querySelectorAll('*')));
        const snapshots: string[] = originals.map((node: Element) => this.tableStyle(node));
        // Grid-only hidden sizing groups are not report rows. Preserve meaningful empty cells/rows.
        clone.querySelectorAll('tbody.e-hide, thead.e-hide').forEach((node: Element) => node.remove());
        originals.forEach((node: Element, index: number) => {
            if (node.tagName === 'CAPTION' && window.getComputedStyle(node).display === 'none') { copies[index as number].remove(); }
        });
        clone.querySelectorAll('script, iframe, object, embed, style, link, img, input, button, select, textarea, svg, math')
            .forEach((node: Element) => node.remove());
        [clone as Element].concat(Array.from(clone.querySelectorAll('*'))).forEach((node: Element) => {
            const tag: string = node.tagName.toLowerCase();
            if (/^(table|caption|colgroup|col|tbody|thead|tfoot|tr|td|th|a)$/.test(tag)) {
                Array.from(node.attributes).forEach((attribute: Attr) => {
                    if (tag === 'a' && attribute.name === 'href' && /^(https?:|mailto:)/i.test(attribute.value.trim())) {
                        node.setAttribute('href', attribute.value.trim());
                    } else if ((tag === 'td' || tag === 'th') && /^(colspan|rowspan)$/.test(attribute.name) &&
                        /^[1-9][0-9]*$/.test(attribute.value)) {
                        node.setAttribute(attribute.name, attribute.value);
                    } else { node.removeAttribute(attribute.name); }
                });
            } else {
                while (node.firstChild) { node.parentNode.insertBefore(node.firstChild, node); }
                node.remove();
            }
        });
        copies.forEach((node: Element, index: number) => {
            if (clone.contains(node) || node === clone) {
                (node as HTMLElement).style.cssText = snapshots[index as number];
            }
        });
        if (clone.querySelector('colgroup col')) {
            clone.querySelectorAll('th,td').forEach((cell: HTMLElement) => { cell.style.width = 'auto'; });
        }
        return clone;
    }

    /**
     * Resolves safe visual properties from a live table element.
     *
     * @param {Element} node - Live table element.
     * @returns {string} Allowlisted resolved CSS declarations.
     */
    private static tableStyle(node: Element): string {
        const computed: CSSStyleDeclaration = window.getComputedStyle(node);
        const style: CSSStyleDeclaration = document.createElement('span').style;
        // No URLs, generated content, custom properties, positioning, or external fonts/resources.
        const properties: string[] = ['background-color', 'color', 'font-family', 'font-size', 'font-weight',
            'font-style', 'line-height', 'text-align', 'vertical-align', 'white-space', 'direction',
            'border-collapse', 'border-spacing', 'box-sizing', 'width', 'height',
            'padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
        ['top', 'right', 'bottom', 'left'].forEach((side: string) => {
            ['color', 'style', 'width'].forEach((part: string) => properties.push('border-' + side + '-' + part));
        });
        properties.forEach((property: string) => {
            const value: string = computed.getPropertyValue(property);
            if (!/url\s*\(|expression|[<>\\]|[^\u0020-\uffff]/i.test(value)) { style.setProperty(property, value); }
        });
        let ancestor: Element = node;
        while (ancestor && (!style.backgroundColor || style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            style.backgroundColor === 'transparent')) {
            style.backgroundColor = window.getComputedStyle(ancestor).backgroundColor;
            ancestor = ancestor.parentElement;
        }
        // Computed widths are rounded to three decimals. Preserve layout-unit precision
        // so merged header constraints do not expand the final column by a whole pixel.
        if (node.tagName === 'COL' || (/^(TH|TD)$/.test(node.tagName) && computed.boxSizing === 'border-box')) {
            style.width = node.getBoundingClientRect().width + 'px';
        }
        // Material3 expresses its surface tint as a constant-color gradient, not
        // background-color. Resolve that paint into a solid color for HTML and native SVG.
        const tint: RegExpMatchArray = computed.backgroundImage.match(/rgba?\([\d.,\s]+\)/g);
        if (tint && tint.every((color: string) => color === tint[0]) &&
            !/url\s*\(/i.test(computed.backgroundImage)) {
            const foreground: number[] = tint[0].match(/[\d.]+/g).map(Number);
            const background: number[] = style.backgroundColor.match(/[\d.]+/g).map(Number);
            const alpha: number = foreground.length === 4 ? foreground[3] : 1;
            style.backgroundColor = 'rgb(' + background.slice(0, 3).map((value: number, index: number) =>
                Math.round(foreground[index as number] * alpha + value * (1 - alpha))).join(',') + ')';
        }
        // Header labels have theme rules of their own; flattening their wrappers must not
        // replace their foreground/font with the th's (different) computed values.
        if (/^(TH|TD)$/.test(node.tagName)) {
            const label: HTMLElement = node.querySelector('.e-cellvalue');
            if (label) {
                const text: CSSStyleDeclaration = window.getComputedStyle(label);
                ['color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height'].forEach((property: string) => {
                    const value: string = text.getPropertyValue(property);
                    if (!/url\s*\(|expression|[<>\\]|[^\u0020-\uffff]/i.test(value)) { style.setProperty(property, value); }
                });
                const cellRect: ClientRect = node.getBoundingClientRect();
                const textRect: ClientRect = label.getBoundingClientRect();
                if (computed.textAlign === 'right' || computed.textAlign === 'end') {
                    style.paddingRight = Math.max(0, cellRect.right - textRect.right - parseFloat(computed.borderRightWidth)) + 'px';
                } else {
                    style.paddingLeft = Math.max(0, textRect.left - cellRect.left - parseFloat(computed.borderLeftWidth)) + 'px';
                }
            }
        }
        return style.cssText;
    }

    /** Copies only resolved border properties from a visible grid boundary.
     *
     * @param {HTMLElement} target - Sanitized snapshot box.
     * @param {Element} source - Live boundary box.
     * @param {string} side - Border edge.
     * @returns {void} Nothing.
     * @hidden
     */
    public static boundary(target: HTMLElement, source: Element, side: string): void {
        const computed: CSSStyleDeclaration = window.getComputedStyle(source);
        ['width', 'style', 'color'].forEach((part: string) => {
            const property: string = 'border-' + side + '-' + part;
            target.style.setProperty(property, computed.getPropertyValue(property));
        });
    }

}
