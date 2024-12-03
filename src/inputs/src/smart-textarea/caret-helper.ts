
type CSSProperties = { [key: string]: string | number };
export type CaretPosition = { left: number, top: number, height: number, pos?: number, elemStyle?: CSSStyleDeclaration };

export class CaretPositionHelper {
    private static properties: string[] = [
        'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle',
        'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth',
        'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing',
        'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop',
        'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom',
        'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow',
        'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap', 'width'
    ];

    private static createStyledDiv(target: HTMLElement, htmlContent: string): HTMLDivElement {
        const div: HTMLDivElement = document.createElement('div');
        const styles: CSSProperties = {
            position: 'absolute',
            left: -9999,
            top: 0,
            zIndex: -2000
        };
        this.properties.forEach((prop: string) => {
            styles[`${prop}`] = getComputedStyle(target)[prop as any];
        });
        Object.keys(styles).forEach((key: string) => {
            div.style[`${key}` as any] = styles[`${key}`] as any;
        });
        const scrollbarWidth: number = target.offsetWidth - target.clientWidth;
        div.style.width = (target.clientWidth + scrollbarWidth) + 'px';
        div.innerHTML = htmlContent;
        if (target && target.parentNode) {
            target.parentNode.insertBefore(div, target.nextSibling);
        }
        return div;
    }

    private static createCaretMarker(target: HTMLElement, htmlContent: string): CaretPosition {
        const div: HTMLDivElement = this.createStyledDiv(target, htmlContent);
        const marker: HTMLElement = div.ownerDocument.getElementById('caret-position-marker');
        const position: CaretPosition = {
            left: marker!.offsetLeft,
            top: marker!.offsetTop,
            height: marker!.offsetHeight
        };
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
        return position;
    }

    private static escapeHtml(value: string): string {
        return value.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>');
    }

    static getCaretPosition(target: HTMLInputElement | HTMLTextAreaElement): CaretPosition {
        const position: number = target.selectionStart || 0;
        const textBeforeCaret: string = target.value.slice(0, position);
        const textAfterCaret: string = target.value.slice(position);
        let content: string = `<span style="position: relative; display: inline;">${this.escapeHtml(textBeforeCaret)}</span>`;
        content += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
        content += `<span style="position: relative; display: inline;">${this.escapeHtml(textAfterCaret)}</span>`;
        const rect: CaretPosition = this.createCaretMarker(target, content);
        rect.pos = position;
        return rect;
    }

    static adjustScrollToCaretPosition(element: HTMLInputElement | HTMLTextAreaElement): void {
        const caretPosition: CaretPosition = this.getCaretPosition(element);
        const lineHeight: number = parseFloat(window.getComputedStyle(element).lineHeight);
        if (caretPosition.top > element.clientHeight + element.scrollTop - lineHeight) {
            element.scrollTop = caretPosition.top - element.clientHeight + lineHeight;
        }
    }

    static getTextAreaPosition(element: HTMLInputElement | HTMLTextAreaElement): CaretPosition {
        const computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
        const position: CaretPosition = this.getCaretPosition(element);
        return {
            top: position.top + parseFloat(computedStyle.borderTopWidth) + element.offsetTop - element.scrollTop,
            left: position.left + parseFloat(computedStyle.borderLeftWidth) + element.offsetLeft - element.scrollLeft - 0.25,
            height: position.height,
            elemStyle: computedStyle
        };
    }

    static insertCharacter(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
        let start: number = element.selectionStart;
        const end: number = element.selectionEnd;
        element.value = element.value.substring(0, start) + text + element.value.substring(end);
        start += text.length;
        element.setSelectionRange(start, start);
    }
}
