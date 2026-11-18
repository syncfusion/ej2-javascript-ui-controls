/**
 * Notes renderer: paints read-only notes content into the pane body.
 *
 * @module @syncfusion/ej2-pptxeditor/notes/notes-renderer
 *
 * Text is only ever written through `textContent`, so notes cannot inject markup.
 */

import {
    NotesBulletSnapshot, NotesParagraphSnapshot, NotesRunSnapshot, NotesSnapshot, notesToPlainText
} from './notes-model';

const PT_TO_PX: number = 96 / 72;
const HEX_COLOR: RegExp = /^[0-9a-fA-F]{6}$/;
const ALIGNMENTS: Readonly<Record<string, string>> = { l: 'left', ctr: 'center', r: 'right', just: 'justify', dist: 'justify' };

interface NumberCounter {
    readonly scheme: string;
    value: number;
}

function toAlpha(value: number, upper: boolean): string {
    let remaining: number = Math.max(1, value);
    let result: string = '';
    while (remaining > 0) {
        remaining--;
        result = String.fromCharCode(97 + (remaining % 26)) + result;
        remaining = Math.floor(remaining / 26);
    }
    return upper ? result.toUpperCase() : result;
}

function toRoman(value: number, upper: boolean): string {
    const table: Array<[number, string]> = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'],
        [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
    let remaining: number = Math.min(3999, Math.max(1, value));
    let result: string = '';
    table.forEach((entry: [number, string]): void => {
        while (remaining >= entry[0]) {
            result += entry[1];
            remaining -= entry[0];
        }
    });
    return upper ? result.toUpperCase() : result;
}

/**
 * Formats an auto-number marker for an `a:buAutoNum/@type` scheme.
 *
 * @param {number} value - 1-based counter value
 * @param {string} scheme - DrawingML numbering scheme token
 * @returns {string} Marker text, defaulting to `N.` for unknown schemes
 * @internal
 */
export function formatNotesNumber(value: number, scheme: string): string {
    const kind: string = scheme.replace(/(Period|ParenR|ParenBoth|Plain)$/, '');
    const suffix: string = scheme.substring(kind.length);
    let core: string = String(value);
    if (kind === 'alphaLc' || kind === 'alphaUc') {
        core = toAlpha(value, kind === 'alphaUc');
    } else if (kind === 'romanLc' || kind === 'romanUc') {
        core = toRoman(value, kind === 'romanUc');
    }
    if (suffix === 'ParenBoth') {
        return '(' + core + ')';
    }
    if (suffix === 'ParenR') {
        return core + ')';
    }
    return suffix === 'Plain' ? core : core + '.';
}

/**
 * Renders notes paragraphs, line breaks and bold/italic/underline runs.
 * @internal
 */
export class NotesRenderer {
    private renderedSnapshot: NotesSnapshot | undefined = undefined;
    private renderedEmptyText: string | null = null;

    /**
     * Renders `snapshot` into `body`, skipping work when nothing changed.
     *
     * @param {HTMLElement} body - Pane body element
     * @param {NotesSnapshot | undefined} snapshot - Notes to show
     * @param {string} emptyText - Message used when there are no notes
     * @returns {void}
     */
    public render(body: HTMLElement, snapshot: NotesSnapshot | undefined, emptyText: string): void {
        if (this.renderedEmptyText === emptyText && this.renderedSnapshot === snapshot && body.firstChild) {
            return;
        }
        this.renderedSnapshot = snapshot;
        this.renderedEmptyText = emptyText;
        const empty: boolean = notesToPlainText(snapshot) === '';
        body.classList.toggle('ej2-pptx-notes-pane__body--empty', empty);
        const content: DocumentFragment = empty || !snapshot
            ? this.renderEmpty(emptyText)
            : this.renderParagraphs(snapshot);
        // Build first, swap last: a failure while building must never leave the pane blank.
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }
        body.appendChild(content);
    }

    private renderEmpty(emptyText: string): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const message: HTMLElement = document.createElement('p');
        message.className = 'ej2-pptx-notes-pane__empty';
        message.textContent = emptyText;
        fragment.appendChild(message);
        return fragment;
    }

    private renderParagraphs(snapshot: NotesSnapshot): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const counters: Map<number, NumberCounter> = new Map();
        snapshot.paragraphs.forEach((paragraph: NotesParagraphSnapshot): void => {
            try {
                fragment.appendChild(this.renderParagraph(paragraph, this.markerText(paragraph, counters)));
            } catch (error) {
                console.warn('[PptxEditor] Notes paragraph formatting failed; showing plain text.', error);
                fragment.appendChild(this.renderPlainParagraph(paragraph));
            }
        });
        return fragment;
    }

    private renderPlainParagraph(paragraph: NotesParagraphSnapshot): HTMLElement {
        const element: HTMLElement = document.createElement('p');
        element.className = 'ej2-pptx-notes-pane__paragraph';
        const text: string = (paragraph.runs || []).map((run: NotesRunSnapshot): string => run.text || '').join('');
        element.textContent = text;
        if (!text) {
            element.appendChild(document.createElement('br'));
        }
        return element;
    }

    /**
     * Forgets the last render so the next call repaints (e.g. after a locale change).
     *
     * @returns {void}
     */
    public invalidate(): void {
        this.renderedSnapshot = undefined;
        this.renderedEmptyText = null;
    }

    /**
     * Resolves the marker text for one paragraph, advancing per-level number counters.
     * A paragraph without a numbered bullet restarts numbering at its level and deeper.
     */
    private markerText(paragraph: NotesParagraphSnapshot, counters: Map<number, NumberCounter>): string {
        const level: number = paragraph.level || 0;
        const bullet: NotesBulletSnapshot | undefined = paragraph.bullet;
        const hasText: boolean = paragraph.runs.some((run: NotesRunSnapshot): boolean => run.text.length > 0);
        Array.from(counters.keys()).forEach((key: number): void => {
            if (key > level) {
                counters.delete(key);
            }
        });
        if (!bullet || !hasText) {
            if (!bullet) {
                counters.delete(level);
            }
            return '';
        }
        if (bullet.kind === 'character') {
            counters.delete(level);
            return bullet.character || '';
        }
        const scheme: string = bullet.scheme || 'arabicPeriod';
        const previous: NumberCounter | undefined = counters.get(level);
        const counter: NumberCounter = previous && previous.scheme === scheme
            ? { scheme, value: previous.value + 1 }
            : { scheme, value: bullet.startAt || 1 };
        counters.set(level, counter);
        return formatNotesNumber(counter.value, scheme);
    }

    private renderParagraph(paragraph: NotesParagraphSnapshot, marker: string): HTMLElement {
        const element: HTMLElement = document.createElement('p');
        element.className = 'ej2-pptx-notes-pane__paragraph';
        // Notes content is not RTL-aware in this phase; keep it LTR regardless of shell enableRtl.
        element.setAttribute('dir', 'ltr');
        this.applyParagraphStyle(element, paragraph, marker !== '');
        if (marker) {
            element.appendChild(this.renderMarker(marker, paragraph));
        }
        let hasContent: boolean = false;
        paragraph.runs.forEach((run: NotesRunSnapshot): void => {
            if (run.text === '\n') {
                element.appendChild(document.createElement('br'));
                hasContent = true;
            } else if (run.text.length > 0) {
                element.appendChild(this.renderRun(run));
                hasContent = true;
            }
        });
        if (!hasContent) {
            element.appendChild(document.createElement('br'));
        }
        return element;
    }

    private applyParagraphStyle(element: HTMLElement, paragraph: NotesParagraphSnapshot, hasMarker: boolean): void {
        const alignment: string | undefined = paragraph.alignment ? ALIGNMENTS[paragraph.alignment] : undefined;
        if (alignment) {
            element.style.textAlign = alignment;
        }
        const level: number = paragraph.level || 0;
        const leftPt: number | undefined = paragraph.leftMarginPt !== undefined
            ? paragraph.leftMarginPt : (hasMarker ? 18 * (level + 1) : level * 18);
        if (leftPt) {
            element.style.paddingLeft = String(leftPt * PT_TO_PX) + 'px';
        }
        if (paragraph.indentPt) {
            element.style.textIndent = String(paragraph.indentPt * PT_TO_PX) + 'px';
        }
    }

    private renderMarker(marker: string, paragraph: NotesParagraphSnapshot): HTMLElement {
        const element: HTMLElement = document.createElement('span');
        element.className = 'ej2-pptx-notes-pane__marker';
        element.textContent = marker;
        element.setAttribute('aria-hidden', 'true');
        element.style.display = 'inline-block';
        // text-indent is inherited from the paragraph's hanging indent; without a reset the marker's own text
        // is pushed out of the pane and clipped.
        element.style.textIndent = '0';
        const hanging: number = paragraph.indentPt && paragraph.indentPt < 0 ? -paragraph.indentPt : 0;
        if (hanging > 0) {
            element.style.minWidth = String(hanging * PT_TO_PX) + 'px';
        } else {
            element.style.marginRight = '0.5em';
        }
        const first: NotesRunSnapshot | undefined = paragraph.runs.find((run: NotesRunSnapshot): boolean => run.text.length > 0);
        if (first && first.color && HEX_COLOR.test(first.color)) {
            element.style.color = '#' + first.color;
        }
        return element;
    }

    private renderRun(run: NotesRunSnapshot): Node {
        let node: Node = document.createTextNode(run.text);
        const hasStyle: boolean = !!(run.color || run.highlight || run.strike);
        if (hasStyle) {
            const span: HTMLElement = document.createElement('span');
            if (run.color && HEX_COLOR.test(run.color)) {
                span.style.color = '#' + run.color;
            }
            if (run.highlight && HEX_COLOR.test(run.highlight)) {
                span.style.backgroundColor = '#' + run.highlight;
            }
            if (run.strike) {
                span.style.textDecoration = 'line-through';
            }
            span.appendChild(node);
            node = span;
        }
        const wrappers: Array<[boolean | undefined, string]> = [
            [run.underline, 'u'], [run.italic, 'em'], [run.bold, 'strong']
        ];
        wrappers.forEach((entry: [boolean | undefined, string]): void => {
            if (entry[0]) {
                const wrapper: HTMLElement = document.createElement(entry[1]);
                wrapper.appendChild(node);
                node = wrapper;
            }
        });
        return node;
    }
}
