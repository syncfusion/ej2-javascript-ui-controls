import { relatedNotesMaster, NotesMaster } from './notes-masters';
import { NotesCommonPart } from './notes-common-part';
import { NOTES_SLIDE_CONTENT_TYPE } from './constants';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Notes slide handle bound to a live `p:notes` DOM and package part.
 *
 * @remarks
 * Lazy-parses the notes part once. Body targeting prefers a shape whose
 * `p:ph/@type` is `body` (`ST_PlaceholderType`). Text edits mutate the live DOM
 * and immediately write serialized part bytes via {@link PackagePartAccess.setPart}
 * so {@link Presentation.save} includes them (core flush covers only
 * presentation + slide roots).
 *
 * Citation: Transitional `pml.xsd` `CT_NotesSlide` / element `notes`;
 * `docs/specs/016-notes-slides.md`.
 */
import { PackagePartAccess } from '../../core/package/package-part-access';
import { Shape } from '../../core/shapes/shape';
import { TextBody } from '../../core/text/text-body';
import { NotesError } from './errors';
import { PlaceholderInfo } from '../../core/placeholders/placeholder-info';
import { ParagraphCollection } from '../../core/text/paragraph-collection';
import { TextPart } from '../../core/text/text-part';
import { Paragraph } from '../../core/text/paragraph';
import { PackageLimitError } from '../../core/security/errors';
import { DML_NS } from '../../core/shapes/constants';
import { asMutable } from '../../core/shapes/dom-utils';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../core/xml/index';
import { HeadersFooters } from '../../core/headers-footers/header-footer';

const encoder: TextEncoder = new TextEncoder();
/** Existing notes workflows retain manual flush; gradient authoring may opt into immediate canonical mutation publication. */
export interface NotesMutationOptions {
    /** Publish canonical shape/text/font mutations to the package part immediately; default false preserves existing manual-flush workflows. */
    readonly autoPersist?: boolean;
}
/**
 * Default autonumber scheme for appended numbered notes paragraphs.
 *
 * @remarks Locked by TASK-1106 from the local corpus (`ST_TextAutonumberScheme`
 * token `arabicPeriod`); do not change without re-citing. `startAt` is omitted
 * (schema default 1). Do not emit `buFont`.
 */
const ARABIC_PERIOD: string = 'arabicPeriod';
/**
 * Part-backed notes slide for read/write of existing notes body text.
 *
 * @public
 */
export class NotesSlide extends NotesCommonPart {
    /** @internal
     * @param {string} partName - Actual notes-slide part identity.
     * @param {PackagePartAccess} access - Owning package access.
     * @param {NotesMutationOptions} options - Explicit persistence mode; default keeps the existing manual-flush contract.
     * @param {() => number} slideNumber - 1-based number of the owning slide. */
    constructor(partName: string, access: PackagePartAccess, options: NotesMutationOptions = {}, slideNumber?: () => number) {
        super(partName, access, 'notes', NOTES_SLIDE_CONTENT_TYPE, notesAutoPersist(options));
        this.slideNumber = slideNumber;
    }
    /** 1-based number of the slide that owns this notes page, for an unassigned slide-number field. */
    private readonly slideNumber: (() => number) | undefined;
    /** @returns {NotesMaster | undefined} Master selected by this actual notes part's Internal relationship. */
    get master(): NotesMaster | undefined { this.getRoot(); return relatedNotesMaster(this.partName, this.access); }
    /**
     * Always `true` for handles returned by {@link getNotes} (part was present).
     *
     * @returns {boolean} The result.
     */
    get exists(): boolean {
        return true;
    }
    /**
     * Header, footer, date and time, and slide number for this notes slide.
     *
     * @remarks
     * Placeholder text is on this notes slide. `p:hf` visibility is on the
     * related notes master (`CT_NotesSlide` has no `hf`; `CT_NotesMaster` does).
     * When no notes master is associated, visibility is read from this part.
     * @returns {HeadersFooters} Live entries.
     */
    get headersFooters(): HeadersFooters {
        const root: OoxmlElement = this.getRoot();
        const master = this.master;
        const flags: OoxmlElement = master === undefined ? root : master.getRoot();
        const onFlags: (() => void) | undefined = master === undefined ? undefined : (): void => { master.flush(); };
        return new HeadersFooters(root, this.access.limits, this.partName, flags, (): void => { this.flush(); }, onFlags, 'notes', this.slideNumber);
    }
    /**
     * Notes body shape: first shape with placeholder type `body`, document order.
     *
     * @remarks No weak heuristics (largest txBody, etc.) — fixtures must use `ph` type `body`. Citation: `ST_PlaceholderType` token `body`;
     * `docs/specs/016-notes-slides.md`.
     * @returns {Shape | undefined} The body placeholder shape, or `undefined` when none.
     */
    getBodyShape(): Shape | undefined {
        for (let i: number = 0; i < this.shapes.length; i++) {
            const shape: Shape = arrayAt(this.shapes, i);
            const ph: PlaceholderInfo = shape.placeholder;
            if (ph !== undefined && ph.type === 'body') {
                return shape;
            }

        }
        return undefined;
    }
    /**
     * Direct text body of the notes body placeholder, when present.
     *
     * @returns {TextBody | undefined} The result.
     */
    /**
     * Notes body text frame (`p:ph type="body"` / `p:txBody`).
     *
     * @remarks Alias of {@link NotesSlide.bodyTextBody} for the public authoring
     * surface (`notesSlide.notesTextBody.addParagraph(...)`).
     * @throws {NotesError} When the notes part has no body placeholder or no `txBody`.
     * @returns {TextBody} The result.
     */
    get notesTextBody(): TextBody {
        const frame: TextBody = this.bodyTextBody;
        if (frame === undefined) {
            throw new NotesError('Notes slide has no body placeholder text body (p:ph type="body")', { partName: this.partName });
        }
        return frame;
    }
    /**
     * Direct text body of the notes body placeholder, when present.
     *
     * @returns {TextBody | undefined} The result.
     */
    get bodyTextBody(): TextBody | undefined {
        const body: Shape = this.getBodyShape();
        return body != null ? body.textBody : undefined;
    }
    /**
     * Concatenated direct run text of the body placeholder (all paragraphs/runs).
     *
     * @returns {string | undefined} Joined `a:t` values in document order, or `undefined` when no body/`txBody`.
     */
    getBodyText(): string | undefined {
        const frame: TextBody = this.bodyTextBody;
        if (frame === undefined) {
            return undefined;
        }
        const parts: string[] = [];
        for (let i: number = 0; i < frame.paragraphs.length; i++) {
            const paragraph: Paragraph = arrayAt(frame.paragraphs, i);
            for (let j: number = 0; j < paragraph.textParts.length; j++) {
                const run: TextPart = arrayAt(paragraph.textParts, j);
                parts.push(run.text);

            }

        }
        return parts.join('');
    }
    /**
     * Replaces body placeholder run text with a single paragraph / single run value.
     *
     * @throws {NotesError} When no body placeholder or no editable run is present.
     * @throws {Error} When text exceeds `textNodeLengthBytes`.
     * @remarks Prefer mutating existing `a:r`/`a:t` via core APIs. When at least one run exists, the first run is set and remaining body
     * runs are cleared to empty so the visible body becomes `value`. Flushes the notes part immediately after mutation.
     * @param {string} value - New body text (UTF-8 length limited by package limits).
     * @returns {void} Nothing.
     */
    setBodyText(value: string): void {
        const body: Shape = this.getBodyShape();
        if (body === undefined) {
            throw new NotesError('Notes slide has no body placeholder (p:ph type="body"); cannot write body text',
                                 { partName: this.partName });
        }
        const frame: TextBody = body.textBody;
        if (frame === undefined) {
            throw new NotesError('Notes body placeholder has no txBody; cannot write body text', {
                partName: this.partName
            });
        }
        const paragraphs: ParagraphCollection = frame.paragraphs;
        if (paragraphs.length === 0) {
            throw new NotesError('Notes body txBody has no paragraphs; cannot write body text without inventing markup',
                                 { partName: this.partName });
        }
        let firstRunSet: boolean = false;
        for (let i: number = 0; i < paragraphs.length; i++) {
            const paragraph: Paragraph = arrayAt(paragraphs, i);
            for (let j: number = 0; j < paragraph.textParts.length; j++) {
                const run: TextPart = arrayAt(paragraph.textParts, j);
                if (!firstRunSet) {
                    run.text = value;
                    firstRunSet = true;
                }
                else {
                    run.text = '';
                }

            }

        }
        if (!firstRunSet) {
            throw new NotesError('Notes body has no text runs (a:r); cannot write body text without inventing markup',
                                 { partName: this.partName });
        }
        this.flush();
    }
    /**
     * Appends one numbered-list paragraph to the notes body placeholder.
     *
     * @throws {NotesError} When no body placeholder (`p:ph type="body"`) or no `txBody` is present.
     * @throws {Error} When `text` exceeds `textNodeLengthBytes`.
     * @remarks Port of the .NET `INotesSlide` sample
     * `Notes.AddParagraph(...).ListFormat.Type = Numbered`. Appends one `a:p` carrying
     * `<a:pPr><a:buAutoNum type="arabicPeriod"/></a:pPr>` and one `a:r`/`a:t` run to the body placeholder `txBody`.
     * Existing paragraphs, `sldImg`, other shapes, and unknown children are untouched — use {@link NotesSlide.setBodyText}
     * for the replace-body path. `buFont` and `startAt` are not emitted (schema default start is 1). Does not create a
     * notes part — callers use {@link ensureNotes} first. Flushes the notes part immediately.
     * Citations: Transitional `dml-main.xsd` `EG_TextBullet` `buAutoNum` (`CT_TextAutonumberBullet`, `type` required
     * `ST_TextAutonumberScheme`, `startAt` optional default 1); token `arabicPeriod`; ECMA-376-1 §21.1.2.4.1;
     * `CT_TextParagraph` (`pPr` first, `a:r` before optional `a:endParaRPr`); `docs/specs/043-notes-slide-authoring.md`.
     * @example ```ts const notes = ensureNotes(slide, doc.packagePartAccess()); notes.addNumberedParagraph('Ordered point'); ```
     * @param {string} text - Paragraph text (UTF-8 length limited by package limits).
     * @returns {void} Nothing.
     */
    addNumberedParagraph(text: string): void {
        const body: Shape = this.getBodyShape();
        if (body === undefined) {
            throw new NotesError('Notes slide has no body placeholder (p:ph type="body"); cannot append numbered paragraph',
                                 { partName: this.partName });
        }
        const frame: TextBody = body.textBody;
        if (frame === undefined) {
            throw new NotesError('Notes body placeholder has no txBody; cannot append numbered paragraph', {
                partName: this.partName
            });
        }
        const byteLen: number = utf8ByteLength(text);
        if (byteLen > this.access.limits.textNodeLengthBytes) {
            throw new PackageLimitError('textNodeLengthBytes', {
                partName: this.partName,
                actual: byteLen
            });
        }
        const buAutoNum: OoxmlElement = dmlEl('buAutoNum', [attr('type', ARABIC_PERIOD)], []);
        const pPr: OoxmlElement = dmlEl('pPr', [], [buAutoNum]);
        const rPr: OoxmlElement = dmlEl('rPr', [attr('lang', 'en-US'), attr('dirty', '0')], []);
        const t: OoxmlElement = dmlEl('t', [], [{ kind: 'text' as 'text', text }]);
        const r: OoxmlElement = dmlEl('r', [], [rPr, t]);
        const p: OoxmlElement = dmlEl('p', [], [pPr, r]);
        asMutable(frame.getElement()).children.push(p);
        this.flush();
    }
}

/** @param {NotesMutationOptions} options - Caller-owned options, read before package operations.
 * @returns {boolean} Validated primitive persistence setting.
 * @internal */
export function notesAutoPersist(options: NotesMutationOptions): boolean {
    if (!options || typeof options !== 'object') { throw new NotesError('Notes options must be an object'); }
    const value: boolean | undefined = options.autoPersist;
    if (value !== undefined && typeof value !== 'boolean') { throw new NotesError('Notes autoPersist must be a boolean'); }
    return value === true;
}

/**
 * Builds a DrawingML element bound to the `a:` namespace.
 *
 * @param {string} localName - Element local name.
 * @param {*} attributes - Attributes (empty namespace = unprefixed attribute).
 * @param {*} children - Child nodes (elements or text).
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

/**
 * Builds a no-namespace attribute (unprefixed form).
 *
 * @param {string} localName - Attribute local name.
 * @param {string} value - Attribute value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}

/**
 * UTF-8 byte length of `text` (TextEncoder-free, ES5-safe).
 *
 * @param {string} text - The text value.
 * @returns {number} UTF-8 byte length.
 */
function utf8ByteLength(text: string): number {
    return encoder.encode(text).byteLength;
}
