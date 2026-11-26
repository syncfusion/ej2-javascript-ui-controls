import { officeRelationshipType } from '../../core/xml/office-dialect';
import { arrayAt } from '../../core/util/es5-compat';
/**
 * Detect slide → notesSlide relationship and return a lazy {@link NotesSlide}.
 *
 * @remarks
 * Association is **per-slide relationship**, not notesSlide part number.
 * TargetMode must be Internal. Missing rel → `undefined`. Missing/malformed
 * part fails closed when the handle is first used (or immediately if part
 * absence is checked at construction — see parse path).
 *
 * Citation: ECMA-376 Part 4 notesSlide relationship type;
 * `docs/specs/016-notes-slides.md`.
 */
import { PackagePartAccess } from '../../core/package/package-part-access';
import { Slide } from '../../core/slideimplementation/slide';
import { NOTES_SLIDE_REL_TYPE } from './constants';
import { NotesSlide, NotesMutationOptions, notesAutoPersist } from './notes-slide';
import { PackageRelationship } from '../../core/package/relationships';
/**
 * Returns a notes handle when the slide has an Internal notesSlide relationship.
 *
 * @remarks Does not create notes — use {@link ensureNotes} for create/associate. Does not load notes on presentation open — parse is
 * deferred until the handle reads shapes/text. Never executes notes content. Callers must pass the document's live {@link
 * PackagePartAccess} so body edits can write the part back before save.
 * @example ```ts import { Presentation } from '@syncfusion/ej2-pptx'; import { getNotes } from '@syncfusion/ej2-pptx/notes'; const doc =
 * await Presentation.open(bytes); const notes = getNotes(doc.slides[0]!, doc.packagePartAccess()); const text = (notes == null ? undefined
 * : notes.getBodyText)(); ```
 * @public
 * @param {Slide} slide - Host slide (relationship source).
 * @param {PackagePartAccess} access - Live package access from `Presentation.packagePartAccess()`.
 * @param {NotesMutationOptions} options - Explicit canonical mutation persistence; default preserves manual flush.
 * @returns {NotesSlide | undefined} Notes handle, or `undefined` when no notesSlide rel exists.
 */
export function getNotes(slide: Slide, access: PackagePartAccess, options: NotesMutationOptions = {}): NotesSlide | undefined {
    const capturedOptions: NotesMutationOptions = { autoPersist: notesAutoPersist(options) };
    const rels: ReadonlyArray<PackageRelationship> = access.getRelationships(slide.partName);
    for (let i: number = 0; i < rels.length; i++) {
        const rel: PackageRelationship = arrayAt(rels, i);
        if (!officeRelationshipType(rel.type, NOTES_SLIDE_REL_TYPE)) {
            continue;
        }
        if (rel.targetMode !== 'Internal') {
            continue;
        }
        const targetPartName: string = rel.targetPartName;
        if (targetPartName === undefined) {
            continue;
        }
        return new NotesSlide(targetPartName, access, capturedOptions, (): number => slide.slideNumberValue());

    }
    return undefined;
}
