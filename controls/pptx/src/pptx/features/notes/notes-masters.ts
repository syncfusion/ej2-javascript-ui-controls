/** Actual notes/handout master ownership through canonical package associations. */
import { Presentation } from '../../core/package/presentation';
import { PackagePartAccess } from '../../core/package/package-part-access';
import { PackagePart } from '../../core/package/package-model';
import { PackageRelationship } from '../../core/package/relationships';
import { officeRelationshipType, officeRootNamespace } from '../../core/xml/office-dialect';
import { parseXml, OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { getAttr } from '../../core/shapes/dom-utils';
import { OFFICE_REL_ATTR_NS, PML_NS } from '../../core/presentation/constants';
import { arrayAt } from '../../core/util/es5-compat';
import { NOTES_MASTER_CONTENT_TYPE, NOTES_MASTER_REL_TYPE } from './constants';
import { NotesCommonPart } from './notes-common-part';
import { NotesError } from './errors';
/** Native handout master MIME; ECMA-376 Part1 §13.3.3. */
export const HANDOUT_MASTER_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml';
/** Native handout master relationship; ECMA-376 Part4 handoutMaster part. */
export const HANDOUT_MASTER_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/handoutMaster';
/** Actual notes-master part with direct background, shape and text authoring; no slide impersonation. */
export class NotesMaster extends NotesCommonPart {
    /** @param {string} partName - Actual associated source part.
     * @param {PackagePartAccess} access - Owning package access.
     * @internal */
    constructor(partName: string, access: PackagePartAccess) { super(partName, access, 'notesMaster', NOTES_MASTER_CONTENT_TYPE); }
}
/** Actual presentation handout master; direct authoring does not create a visual editing screen. */
export class HandoutMaster extends NotesCommonPart {
    /** @param {string} partName - Actual associated source part.
     * @param {PackagePartAccess} access - Owning package access.
     * @internal */
    constructor(partName: string, access: PackagePartAccess) { super(partName, access, 'handoutMaster', HANDOUT_MASTER_CONTENT_TYPE); }
}
/**
 * @param {string} sourcePart - Actual notes slide association source.
 * @param {PackagePartAccess} access - Its owning package.
 * @returns {NotesMaster | undefined} Exact associated master, never a first/global part fallback.
 * @internal
 */
export function relatedNotesMaster(sourcePart: string, access: PackagePartAccess): NotesMaster | undefined {
    const matches: ReadonlyArray<PackageRelationship> = access.getRelationships(sourcePart).filter(
        (rel: PackageRelationship): boolean => officeRelationshipType(rel.type, NOTES_MASTER_REL_TYPE));
    if (!matches.length) { return undefined; }
    if (matches.length !== 1) { throw new NotesError('Notes master association is ambiguous', { partName: sourcePart }); }
    return new NotesMaster(internalTarget(arrayAt(matches, 0), sourcePart), access);
}
/**
 * Reads the presentation's actual handout-master ID and Internal relationship.
 *
 * @remarks Does not create masters, rename parts, edit themes or change associations.
 * No master ID means undefined; missing/ambiguous/external references fail safely.
 * @param {Presentation} document - Actual owning presentation, not a source-part filename guess.
 * @returns {HandoutMaster | undefined} Lazy native master handle when explicitly associated.
 * @throws {NotesError} Invalid association or missing source.
 */
export function getHandoutMaster(document: Presentation): HandoutMaster | undefined {
    const access: PackagePartAccess = document.packagePartAccess(); const partName: string = document.presentationPartName;
    const part: PackagePart | undefined = access.getPart(partName);
    if (!part) { throw new NotesError('Presentation source is missing', { partName }); }
    const root: OoxmlElement = parseXml(new TextDecoder().decode(part.data), { limits: access.limits, partName });
    if (root.localName !== 'presentation' || !officeRootNamespace(root.namespaceUri, PML_NS)) {
        throw new NotesError('Handout master requires the actual PresentationML presentation root', { partName });
    }
    const lists: ReadonlyArray<OoxmlElement> = children(root, 'handoutMasterIdLst');
    if (!lists.length) { return undefined; }
    if (lists.length !== 1) { throw new NotesError('Handout master ID list is ambiguous', { partName }); }
    const ids: ReadonlyArray<OoxmlElement> = children(arrayAt(lists, 0), 'handoutMasterId');
    if (ids.length !== 1) { throw new NotesError('Handout master identity is missing or ambiguous', { partName }); }
    const id: string | undefined = getAttr(arrayAt(ids, 0), OFFICE_REL_ATTR_NS, 'id');
    const matches: ReadonlyArray<PackageRelationship> = access.getRelationships(partName).filter(
        (rel: PackageRelationship): boolean => rel.id === id && officeRelationshipType(rel.type, HANDOUT_MASTER_REL_TYPE));
    if (!id || matches.length !== 1) { throw new NotesError('Handout master relationship is missing or ambiguous', { partName }); }
    return new HandoutMaster(internalTarget(arrayAt(matches, 0), partName), access);
}
/** @param {PackageRelationship} rel - Exact selected association.
 * @param {string} partName - Source identity.
 * @returns {string} Actual normalized Internal target; external resources are never followed. */
function internalTarget(rel: PackageRelationship, partName: string): string {
    if (rel.targetMode !== 'Internal' || !rel.targetPartName) {
        throw new NotesError('Notes/handout master requires an Internal target', { partName });
    }
    return rel.targetPartName;
}
/** @param {OoxmlElement} parent - Native source owner.
 * @param {string} name - Exact child name in the actual namespace.
 * @returns {ReadonlyArray<OoxmlElement>} Direct schema-owned children only. */
function children(parent: OoxmlElement, name: string): ReadonlyArray<OoxmlElement> {
    return parent.children.filter((node: OoxmlElement | OoxmlText): node is OoxmlElement =>
        node.kind === 'element' && node.namespaceUri === parent.namespaceUri && node.localName === name);
}
