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
import { PackagePart } from '../../core/package/package-model';
import { OoxmlElement } from '../../core/xml/dom';
import { NOTES_MASTER_CONTENT_TYPE, NOTES_MASTER_REL_TYPE, NOTES_SLIDE_CONTENT_TYPE, NOTES_SLIDE_REL_TYPE } from './constants';
import { buildMinimalNotesMasterPartBytes, NOTES_MASTER_CREATE_CONTENT_TYPE } from './notes-master-template';
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
    const templateBytes: Uint8Array = buildMinimalNotesSlidePartBytes(slide.getRoot().namespaceUri, slide.slideNumberValue());
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
    ensureNotesMaster(access, notesPartName, slide.getRoot().namespaceUri);
    const notesRels: ReadonlyArray<PackageRelationship> = access.getRelationships(notesPartName);
    access.replaceRelationships(notesPartName, [...notesRels, {
        id: allocateNextRelationshipId(notesRels),
        type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide',
        target: relativeTarget(notesPartName, slide.partName),
        targetMode: 'Internal',
        targetPartName: slide.partName
    }]);
    return new NotesSlide(notesPartName, access, capturedOptions, (): number => slide.slideNumberValue());
}

/**
 * Associates the shared notes master. A notes slide without one has no font,
 * alignment, or placeholder geometry, so PowerPoint draws the body as a dashed box.
 *
 * @param access - Live package access.
 * @param notesPartName - Newly created notes slide part.
 * @param namespace - PresentationML dialect.
 */
function ensureNotesMaster(access: PackagePartAccess, notesPartName: string, namespace: string): void {
    let masterName: string = '/ppt/notesMasters/notesMaster1.xml';
    if (access.getPart(masterName) === undefined) {
        const bytes: Uint8Array = buildMinimalNotesMasterPartBytes(namespace);
        access.setPart({
            name: masterName,
            contentType: NOTES_MASTER_CREATE_CONTENT_TYPE,
            data: bytes
        });
        access.ensureContentTypeOverride(masterName, NOTES_MASTER_CONTENT_TYPE);
        attachNotesMasterTheme(access, masterName);
    }
    const existing: ReadonlyArray<PackageRelationship> = access.getRelationships(notesPartName);
    const already: boolean = existing.some((rel: PackageRelationship): boolean => rel.type === NOTES_MASTER_REL_TYPE);
    if (already) {
        return;
    }
    const masterRel: PackageRelationship = {
        id: allocateNextRelationshipId(existing),
        type: namespace === 'http://purl.oclc.org/ooxml/presentationml/main' ?
            'http://purl.oclc.org/ooxml/officeDocument/relationships/notesMaster' : NOTES_MASTER_REL_TYPE,
        target: relativeTarget(notesPartName, masterName),
        targetMode: 'Internal',
        targetPartName: masterName
    };
    access.replaceRelationships(notesPartName, [...existing, masterRel]);
    registerNotesMaster(access, masterName, namespace);
}

/**
 * Gives a created notes master its own copy of the presentation theme (a master requires a theme part).
 *
 * @param access - Live package access.
 * @param masterName - Notes master part name.
 */
function attachNotesMasterTheme(access: PackagePartAccess, masterName: string): void {
    const presRels: ReadonlyArray<PackageRelationship> = access.getRelationships('/ppt/presentation.xml');
    let source: PackagePart | undefined = undefined;
    for (let i: number = 0; i < presRels.length && source === undefined; i += 1) {
        const rel: PackageRelationship = presRels[i] as PackageRelationship;
        if (rel.type.endsWith('/relationships/theme') && rel.targetPartName !== undefined) {
            source = access.getPart(rel.targetPartName);
        }
    }
    if (source === undefined) {
        return;
    }
    let n: number = 2;
    while (access.getPart(`/ppt/theme/theme${String(n)}.xml`) !== undefined) {
        n += 1;
    }
    const themeName: string = `/ppt/theme/theme${String(n)}.xml`;
    access.setPart({ name: themeName, contentType: source.contentType, data: source.data });
    access.ensureContentTypeOverride(themeName, source.contentType);
    access.replaceRelationships(masterName, [{
        id: 'rId1',
        type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
        target: relativeTarget(masterName, themeName),
        targetMode: 'Internal',
        targetPartName: themeName
    }]);
}

/**
 * Adds `p:notesMasterIdLst` when the presentation does not already list the notes master.
 *
 * @param access - Live package access.
 * @param masterName - Notes master part name.
 * @param namespace - PresentationML dialect.
 */
function registerNotesMaster(access: PackagePartAccess, masterName: string, namespace: string): void {
    const presentationName: string = '/ppt/presentation.xml';
    const existing: ReadonlyArray<PackageRelationship> = access.getRelationships(presentationName);
    let relationshipId: string | undefined = undefined;
    for (let i: number = 0; i < existing.length; i += 1) {
        const rel: PackageRelationship = existing[i] as PackageRelationship;
        if (rel.targetPartName === masterName || rel.type === NOTES_MASTER_REL_TYPE) {
            relationshipId = rel.id;
            break;
        }
    }
    if (relationshipId === undefined) {
        relationshipId = allocateNextRelationshipId(existing);
        const presentationRel: PackageRelationship = {
            id: relationshipId,
            type: namespace === 'http://purl.oclc.org/ooxml/presentationml/main' ?
                'http://purl.oclc.org/ooxml/officeDocument/relationships/notesMaster' : NOTES_MASTER_REL_TYPE,
            target: relativeTarget(presentationName, masterName),
            targetMode: 'Internal',
            targetPartName: masterName
        };
        access.replaceRelationships(presentationName, [...existing, presentationRel]);
    }
    const root: OoxmlElement | undefined = access.presentationRoot;
    if (root === undefined || root.children.some((child: OoxmlElement | { kind: string }): boolean =>
        child.kind === 'element' && (child as OoxmlElement).localName === 'notesMasterIdLst')) {
        return;
    }
    const list: OoxmlElement = {
        kind: 'element',
        namespaceUri: root.namespaceUri,
        localName: 'notesMasterIdLst',
        prefixHint: 'p',
        attributes: [],
        children: [{
            kind: 'element',
            namespaceUri: root.namespaceUri,
            localName: 'notesMasterId',
            prefixHint: 'p',
            attributes: [{
                namespaceUri: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
                localName: 'id',
                value: relationshipId,
                prefix: 'r'
            }],
            children: []
        }]
    };
    const children: Array<OoxmlElement | { kind: string }> = root.children as Array<OoxmlElement | { kind: string }>;
    let insertAt: number = children.length;
    for (let i: number = 0; i < children.length; i += 1) {
        const child = children[i] as OoxmlElement | undefined;
        if (child !== undefined && child.kind === 'element' &&
            (child.localName === 'sldIdLst' || child.localName === 'handoutMasterIdLst' || child.localName === 'sldSz')) {
            insertAt = i;
            break;
        }
    }
    children.splice(insertAt, 0, list);
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
