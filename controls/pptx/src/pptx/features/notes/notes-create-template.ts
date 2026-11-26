import { InvalidPackageError } from '../../core/security/errors';
import { ownerNamespace, officeRootNamespace } from '../../core/xml/office-dialect';
/**
 * Corpus-cited minimal notesSlide part template for {@link ensureNotes}.
 *
 * @remarks
 * Markup is taken from the inspected TASK-1027 / TASK-1028 fixture shape used in
 * `tests/features/notes/*` (notes `p:notes` / `CT_NotesSlide` with required `cSld`
 * `spTree`, slide-image placeholder, and body placeholder with an empty `a:r`/`a:t`
 * so {@link NotesSlide.setBodyText} can write without inventing runs).
 *
 * Schema citations (local corpus — do not invent elements):
 * - Transitional `pml.xsd` `CT_NotesSlide` / element `notes` (required `cSld`)
 * - `ST_PlaceholderType` tokens `body`, `sldImg` (Phase 2 placeholders)
 * - ECMA-376 Part 1 package path advisory `/ppt/notesSlides/notesSlideN.xml`
 * - `docs/specs/016-notes-slides.md` create path
 *
 * Does **not** include notesMaster markup or master relationships — create path
 * associates only the slide → notesSlide Internal relationship.
 *
 * @internal
 */
import { OFFICE_REL_ATTR_NS, PML_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { NOTES_SLIDE_CONTENT_TYPE } from './constants';
const encoder: TextEncoder = new TextEncoder();
/**
 * Content type applied to created notesSlide parts.
 *
 * @internal
 */
export const NOTES_CREATE_CONTENT_TYPE: string = NOTES_SLIDE_CONTENT_TYPE as 'application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml';
/**
 * UTF-8 bytes for a minimal writable notesSlide part.
 *
 * @remarks Structure (fixture-aligned): ```text p:notes p:cSld p:spTree nvGrpSpPr / grpSpPr p:sp ph type=sldImg p:sp ph type=body txBody
 * a:p/a:r/a:t (empty) ```
 * @internal
 * @param {string} namespace - Actual source slide PresentationML dialect.
 * @param {number} slideNumber - 1-based number cached in the default slide-number field.
 * @returns {Uint8Array} The result.
 */
export function buildMinimalNotesSlidePartBytes(namespace: string = PML_NS, slideNumber: number = 1): Uint8Array {
    if (!officeRootNamespace(namespace, PML_NS)) { throw new InvalidPackageError('Invalid notes source dialect', {}); }
    // IDs 1 (group), 2 (sldImg), 3 (body) — stable within this new part only.
    const xml: string = '<?xml version="1.0" encoding="UTF-8"?>' +
        `<p:notes xmlns:p="${namespace}" xmlns:a="${ownerNamespace(namespace, DML_NS)}" xmlns:r="${ownerNamespace(namespace, OFFICE_REL_ATTR_NS)}">` +
        '<p:cSld><p:spTree>' +
        '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
        '<p:sp>' +
        '<p:nvSpPr>' +
        '<p:cNvPr id="2" name="Slide Image Placeholder 1"/>' +
        '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>' +
        '<p:nvPr><p:ph type="sldImg" idx="0"/></p:nvPr>' +
        '</p:nvSpPr>' +
        '<p:spPr/>' +
        '</p:sp>' +
        '<p:sp>' +
        '<p:nvSpPr>' +
        '<p:cNvPr id="3" name="Notes Placeholder 2"/>' +
        '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>' +
        '<p:nvPr><p:ph type="body" idx="1"/></p:nvPr>' +
        '</p:nvSpPr>' +
        '<p:spPr/>' +
        '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:t></a:t></a:r></a:p></p:txBody>' +
        '</p:sp>' +
        '<p:sp>' +
        '<p:nvSpPr>' +
        '<p:cNvPr id="4" name="Slide Number Placeholder 3"/>' +
        '<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>' +
        '<p:nvPr><p:ph type="sldNum" sz="quarter" idx="5"/></p:nvPr>' +
        '</p:nvSpPr>' +
        '<p:spPr/>' +
        '<p:txBody><a:bodyPr/><a:lstStyle/><a:p>' +
        '<a:fld id="{B5F0D3C1-6A5E-4C0B-9E0A-2D3F5B7A9C11}" type="slidenum"><a:rPr lang="en-US"/>' +
        `<a:t>${String(slideNumber)}</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody>` +
        '</p:sp>' +
        '</p:spTree></p:cSld>' +
        '</p:notes>';
    return encoder.encode(xml);
}
