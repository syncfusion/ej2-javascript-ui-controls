/**
 * Create and associate a notesSlide part when the slide has none.
 *
 * @remarks
 * Idempotent: when an Internal notesSlide relationship already exists, returns the
 * same handle as {@link getNotes}. Create path allocates a free
 * `/ppt/notesSlides/notesSlideN.xml` part, content-type Override, and slide
 * relationship using corpus-cited template bytes — never invents relationship
 * types, content types, or markup beyond the cited template.
 *
 * Does **not** create a notesMaster (preserve-only; prove master requirement with
 * fixtures before adding). Does not share one notes part across slides.
 *
 * Citation: `docs/specs/016-notes-slides.md`; ECMA-376 Part 4 notesSlide
 * relationship; ECMA-376 Part 1 notesSlide content type; Transitional `CT_NotesSlide`.
 *
 * @packageDocumentation
 */
import { allocateNextRelationshipId } from '../../core/package/allocate-relationship-id';
import { PackagePartAccess } from '../../core/package/package-part-access';
import { PackageRelationship } from '../../core/package/relationships';
import { relativeTarget } from '../../core/package/paths';
import { Slide } from '../../core/slideimplementation/slide';
import { InvalidPackageError, PackageLimitError } from '../../core/security/errors';
import { NOTES_SLIDE_CONTENT_TYPE, NOTES_SLIDE_REL_TYPE } from './constants';
import { getNotes } from './get-notes';
import { buildMinimalNotesSlidePartBytes, NOTES_CREATE_CONTENT_TYPE } from './notes-create-template';
import { NotesSlide, NotesMutationOptions, notesAutoPersist } from './notes-slide';
/**
 * Returns an existing notes handle or creates/associates a new notesSlide part.
 *
 * @throws {Error} When `relationshipsPerPart`, `entryCount`, or `singlePartUncompressedBytes` would be exceeded.
 * @throws {Error} When a free notes part name cannot be allocated.
 * @remarks Second call on the same slide is idempotent (same part association; no second relationship). Template includes `p:ph
 * type="body"` with an empty run so {@link NotesSlide.setBodyText} works immediately. Internal Targets use Office-authoring-form relative
 * paths (`../notesSlides/...`).
 * @example ```ts import { Presentation } from '@syncfusion/ej2-pptx'; import { ensureNotes } from '@syncfusion/ej2-pptx/notes'; const doc =
 * await Presentation.open(bytes); const notes = ensureNotes(doc.slides[0]!, doc.packagePartAccess()); notes.setBodyText('Speaker notes');
 * await doc.save(); ```
 * @public
 * @param {Slide} slide - Host slide (relationship source).
 * @param {PackagePartAccess} access - Live package access from `Presentation.packagePartAccess()`.
 * @param {NotesMutationOptions} options - Explicit canonical mutation persistence; default preserves manual flush.
 * @returns {NotesSlide} Notes handle bound to the (existing or new) notesSlide part.
 */
export function ensureNotes(slide: Slide, access: PackagePartAccess, options: NotesMutationOptions = {}): NotesSlide {
    const capturedOptions: NotesMutationOptions = { autoPersist: notesAutoPersist(options) };
    const existing: NotesSlide = getNotes(slide, access, capturedOptions);
    if (existing !== undefined) {
        return existing;
    }
    const templateBytes: Uint8Array = buildMinimalNotesSlidePartBytes(slide.getRoot().namespaceUri);
    if (templateBytes.byteLength > access.limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', {
            partName: slide.partName,
            actual: templateBytes.byteLength
        });
    }
    const nextEntryCount: number = access.partCount() + 1;
    if (nextEntryCount > access.limits.entryCount) {
        throw new PackageLimitError('entryCount', {
            partName: slide.partName,
            actual: nextEntryCount
        });
    }
    const existingRels: ReadonlyArray<PackageRelationship> = access.getRelationships(slide.partName);
    if (existingRels.length + 1 > access.limits.relationshipsPerPart) {
        throw new PackageLimitError('relationshipsPerPart', {
            partName: slide.partName,
            actual: existingRels.length + 1
        });
    }
    const notesPartName: string = allocateNextNotesSlidePartName(access);
    const relationshipId: string = allocateNextRelationshipId(existingRels);
    access.setPart({
        name: notesPartName,
        contentType: NOTES_CREATE_CONTENT_TYPE,
        data: templateBytes
    });
    access.ensureContentTypeOverride(notesPartName, NOTES_SLIDE_CONTENT_TYPE);
    const newRel: PackageRelationship = {
        id: relationshipId,
        type: slide.getRoot().namespaceUri === 'http://purl.oclc.org/ooxml/presentationml/main' ?
            'http://purl.oclc.org/ooxml/officeDocument/relationships/notesSlide' : NOTES_SLIDE_REL_TYPE,
        target: relativeTarget(slide.partName, notesPartName),
        targetMode: 'Internal',
        targetPartName: notesPartName
    };
    access.replaceRelationships(slide.partName, [...existingRels, newRel]);
    return new NotesSlide(notesPartName, access, capturedOptions);
}
/**
 * Next free `/ppt/notesSlides/notesSlideN.xml` absolute part name.
 *
 * @internal
 * @param {PackagePartAccess} access - The access value.
 * @returns {string} The result.
 */
function allocateNextNotesSlidePartName(access: PackagePartAccess): string {
    let n: number = 1;
    for (;;) {
        const name: string = `/ppt/notesSlides/notesSlide${String(n)}.xml`;
        if (access.getPart(name) === undefined) {
            return name;
        }
        n += 1;
        if (n > 1000000) {
            throw new InvalidPackageError('Cannot allocate notesSlide part name: exhausted search', {});
        }
    }
}
