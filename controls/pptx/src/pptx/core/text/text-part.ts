import { arrayAt } from '../util/es5-compat';
/**
 * Direct DrawingML regular text run (`a:r` / `CT_RegularTextRun`).
 */
import { asMutable, collectDirectText, findChild, MutableOoxmlElement } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { partNameOptions, ShapeTextError } from '../shapes/errors';
import { PackageLimitError } from '../security/errors';
import { DEFAULT_SECURITY_LIMITS, SecurityLimits } from '../security/limits';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
import { Font } from './font';
import { HyperlinkView } from '../slideimplementation/slide';
import { readTextPartHyperlinkView, removeTextPartHyperlink, setTextPartHyperlink } from '../../features/hyperlinks-actions/facade';
import { FontHost } from './font';
/**
 * UTF-8 byte length of a string (for {@link SecurityLimits.textNodeLengthBytes}).
 *
 * @param {string} text - The text value.
 * @returns {number} The result.
 */
function utf8ByteLength(text: string): number {
    return new TextEncoder().encode(text).byteLength;
}
/**
 * A single text part (`a:r` / regular text run) with **direct** `a:t` content.
 *
 * @remarks
 * `text` reflects only the authored `a:t` value on this run. It does **not** resolve
 * style inheritance from paragraph defaults, list styles, layout, master, or theme.
 * Setting `text` replaces the `a:t` text node(s) only; `a:rPr` (including
 * `a:schemeClr`) and unknown siblings are preserved.
 *
 * Character formatting is exposed via {@link TextPart.font} on `a:rPr`
 * (`CT_TextCharacterProperties`).
 *
 * Spec: `dml-main.xsd` `CT_RegularTextRun` — optional `rPr`, required `t`.
 */
export class TextPart {
    private runElement: OoxmlElement;
    private limits: SecurityLimits;
    private partName: string | undefined;
    /** Optional mutation hook (e.g. digital-signature warning). */
    private onMutate: (() => void) | undefined;
    private fontInstance: Font | undefined;
    /**
     * Creates a text part.
     *
     * Two construction modes are supported:
     *
     * - **Public (detached):** `new TextPart(text)` builds a standalone `a:r` carrying
     *   the supplied `a:t` text (with Office-family `a:rPr` `lang="en-US"`,
     *   `dirty="0"`). The instance is **not** attached to any text body until it is
     *   passed to {@link TextPartCollection.add}. Text and `font` edits made before
     *   attachment are buffered on the standalone element and grafted on attach. The
     *   public constructor uses {@link DEFAULT_SECURITY_LIMITS} until attachment, so a
     *   detached instance never silently bypasses the `textNodeLengthBytes` guard.
     * - **Internal (live):** `new TextPart(runElement, limits, partName?, onMutate?)`
     *   binds to a live `a:r` element of the slide DOM (used by the read surface and
     *   {@link Paragraph.addTextPart}).
     *
     * @throws {Error} When the initial `text` exceeds `textNodeLengthBytes` (public mode).
     * @remarks Detached UI matches API-RULES R1.5 / R5.1 ("every node is constructible detached"). A detached instance's {@link
     * TextPart.font} setters write the standalone `a:rPr` and persist through attach.
     * @example ```ts import { Paragraph, TextPart } from '@syncfusion/ej2-pptx'; const paragraph = new Paragraph();
     * paragraph.textParts.add(new TextPart('Hello')); (shape.textBody == null ? undefined : shape.textBody.paragraphs).add(paragraph); ```
     * @param {string} text - Initial `a:t` character content (public mode).
     */
    constructor(text: string);
    /**
     *
     * @param {OoxmlElement} runElement - The runElement value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     */
    constructor(runElement: OoxmlElement, limits: SecurityLimits, partName?: string, onMutate?: () => void);
    /**
     *
     * @param {string | OoxmlElement} textOrRunElement - The textOrRunElement value.
     * @param {SecurityLimits} limits - The limits value.
     * @param {string} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     */
    constructor(textOrRunElement: string | OoxmlElement, limits: SecurityLimits = DEFAULT_SECURITY_LIMITS, partName?: string,
                onMutate?: () => void) {
        if (typeof textOrRunElement === 'string') {
            const text: string = textOrRunElement;
            const byteLen: number = utf8ByteLength(text);
            if (byteLen > limits.textNodeLengthBytes) {
                throw new PackageLimitError('textNodeLengthBytes',
                                            partName === undefined ? { actual: byteLen } : { partName, actual: byteLen });
            }
            const rPr: OoxmlElement = dmlEl('rPr', [
                { namespaceUri: '', localName: 'lang', value: 'en-US' },
                {
                    namespaceUri: '',
                    localName: 'dirty',
                    value: '0'
                }
            ], []);
            const t: OoxmlElement = dmlEl('t', [], [{ kind: 'text', text }]);
            this.runElement = dmlEl('r', [], [rPr, t]);
            this.limits = limits;
            this.partName = partName;
            this.onMutate = onMutate;
            return;
        }
        this.runElement = textOrRunElement;
        this.limits = limits;
        this.partName = partName;
        this.onMutate = onMutate;
    }
    /**
     * Direct text content of `a:t` under this run.
     *
     * @remarks Getter concatenates direct text children of `a:t`. Setter replaces those text children with a single text node. Does not
     * rewrite `a:rPr` or colour models.
     * @throws {ShapeTextError} When `a:t` is missing.
     * @throws {Error} When the new value exceeds `textNodeLengthBytes`.
     * @returns {string} The result.
     */
    get text(): string {
        const t: OoxmlElement = findChild(this.runElement, DML_NS, 't');
        if (t === undefined) {
            throw new ShapeTextError('Text part is missing required a:t element', partNameOptions(this.partName));
        }
        return collectDirectText(t);
    }
    /**
     *
     * @param {string} value - The value value.
     * @returns {void} Nothing.
     */
    set text(value: string) {
        const byteLen: number = utf8ByteLength(value);
        if (byteLen > this.limits.textNodeLengthBytes) {
            throw new PackageLimitError('textNodeLengthBytes', this.partName === undefined
                ? { actual: byteLen }
                : { partName: this.partName, actual: byteLen });
        }
        const t: OoxmlElement = findChild(this.runElement, DML_NS, 't');
        if (t === undefined) {
            throw new ShapeTextError('Text part is missing required a:t element', partNameOptions(this.partName));
        }
        const mutableT: MutableOoxmlElement = asMutable(t);
        const textNode: OoxmlText = { kind: 'text' as 'text', text: value };
        // Replace only text-bearing children; keep any unexpected element children.
        const keptElements: Array<OoxmlElement | OoxmlText> = [];
        for (let i: number = 0; i < mutableT.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(mutableT.children, i);
            if (child.kind === 'element') {
                keptElements.push(child);
            }

        }
        mutableT.children = [...keptElements, textNode];
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Direct character formatting for this run (`a:rPr` / `CT_TextCharacterProperties`).
     *
     * @remarks Create-on-write: the first property assignment ensures `a:rPr` as the first child of `a:r` (before `a:t`),
         per `CT_RegularTextRun`. Getters remain sparse when `rPr` is absent. Unknown `rPr` children and non-sRGB fills are preserved across partial updates. Citation: Transitional `dml-main.xsd` `CT_RegularTextRun` (`rPr?` then `t`). /
     * @returns {Font} The result.
     */
    get font(): Font {
        if (this.fontInstance === undefined) {
            const partName: string = this.partName;
            const onMutate: () => void = this.onMutate;
            const run: OoxmlElement = this.runElement;
            const host: FontHost = {
                partName,
                drawingNamespace: run.namespaceUri,
                onMutate,
                /**
                 *
                 * @returns {OoxmlElement | undefined} The result.
                 */
                tryGetCharProps(): OoxmlElement | undefined {
                    return findChild(run, run.namespaceUri, 'rPr');
                },
                /**
                 *
                 * @returns {OoxmlElement} The result.
                 */
                ensureCharProps(): OoxmlElement {
                    const existing: OoxmlElement = findChild(run, run.namespaceUri, 'rPr');
                    if (existing !== undefined) {
                        return existing;
                    }
                    const rPr: OoxmlElement = {
                        kind: 'element' as 'element',
                        namespaceUri: run.namespaceUri,
                        localName: 'rPr',
                        attributes: [] as OoxmlAttribute[],
                        children: [],
                        prefixHint: 'a'
                    };
                    const mutable: MutableOoxmlElement = asMutable(run);
                    // CT_RegularTextRun: rPr is first when present (before a:t).
                    mutable.children.unshift(rPr);
                    return rPr;
                }
            };
            this.fontInstance = new Font(host);
        }
        return this.fontInstance;
    }
    /**
     * Live `a:r` element for internal readers (optional feature modules).
     *
     * @remarks Not a public mutation surface. Callers must not invent OOXML or strip unknown siblings under `a:rPr`.
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getElement(): OoxmlElement {
        return this.runElement;
    }
    /**
     * Host part name for diagnostics and relationship scope hints.
     *
     * @internal
     * @returns {string | undefined} The result.
     */
    getPartName(): string | undefined {
        return this.partName;
    }

    /**
     * Sets or replaces the click hyperlink on this run (`a:rPr/a:hlinkClick`).
     *
     * @remarks Same target rules as {@link Shape.setHyperlink}. Does not drop `a:hlinkMouseOver`.
     * @param target - URL, mailto, file name, or 1-based slide index.
     * @returns {HyperlinkView} The click hyperlink just written.
     */
    setHyperlink(target: string): HyperlinkView {
        return setTextPartHyperlink(this, target);
    }
    /**
     * Click hyperlink view, or `undefined` when this run has no `a:hlinkClick`.
     *
     * @returns {HyperlinkView | undefined} The result.
     */
    get hyperlink(): HyperlinkView | undefined {
        return readTextPartHyperlinkView(this);
    }
    /**
     * Removes the run click hyperlink. No-op when absent.
     *
     * @returns {void} Nothing.
     */
    removeHyperlink(): void {
        removeTextPartHyperlink(this);
    }
    /**
     * Re-binds this text part to its (now-live) `a:r` element with the parent
     * paragraph's limits / part name / mutation hook.
     *
     * @remarks Called by {@link Paragraph.addTextPart} / {@link TextPartCollection.add} after a detached {@link TextPart} is grafted into a
     * live paragraph DOM. The `a:r` element held by this instance is the same node that was just appended to the paragraph, so only the
     * binding fields change. The cached {@link Font} handle is invalidated so it re-binds against the new `partName` / `onMutate`.
     * @internal
     * @param {SecurityLimits} limits - The limits value.
     * @param {string | undefined} partName - The partName value.
     * @param {*} onMutate - The onMutate value.
     * @returns {void} Nothing.
     */
    bindTo(limits: SecurityLimits, partName: string | undefined, onMutate: (() => void) | undefined): void {
        this.limits = limits;
        this.partName = partName;
        this.onMutate = onMutate;
        this.fontInstance = undefined;
    }
}
/**
 *
 * @param {string} localName - The localName value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function dmlEl(localName: string, attributes: ReadonlyArray<OoxmlAttribute>,
               children: ReadonlyArray<OoxmlElement | OoxmlText>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName,
        attributes,
        children,
        prefixHint: 'a'
    };
}
