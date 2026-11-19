/**
 * Remove the slide → notesSlide association and unreferenced notes parts (TASK-1108).
 *
 * @remarks
 * Locked API (human 2026-10-14): `slide.removeNotesSlide(): void` — **no
 * parameters**. The slide supplies package access internally via
 * `Slide.getPresentation()` (feature-module bridge; core stays free of notes
 * authoring imports). Absent notes is a no-op, never a throw.
 *
 * Algorithm (spec 043 / TASK-1108):
 * 1. No Internal notesSlide relationship on the slide → return (no throw).
 * 2. Remove that relationship from the slide’s `.rels`.
 * 3. Delete the notesSlide part + content-type Override **only when no other
 *    relationship in the package still targets that part** (shared odd
 *    packages keep the part and Override).
 * 4. Never delete notesMaster parts. Never rename surviving notes parts.
 *    Never renumber slide shape IDs.
 *
 * Fail-closed: when shared-target detection cannot prove uniqueness (slide
 * not bound to a presentation), the relationship removal is still skipped
 * only if package access is unavailable — otherwise rel removal proceeds and
 * part deletion is conservative (kept).
 *
 * Citations: ECMA-376 Part 4 notesSlide relationship type; ECMA-376 Part 1
 * notesSlide content type; OPC — a content-type Override for a deleted part
 * must not remain (`[Content_Types].xml` consistency);
 * `docs/specs/016-notes-slides.md` / `docs/specs/043-notes-slide-authoring.md`.
 *
 * @packageDocumentation
 */
import { PackagePartAccess } from '../../core/package/package-part-access';
import { Presentation } from '../../core/package/presentation';
import { PackageRelationship } from '../../core/package/relationships';
import { arrayAt, stringIncludes } from '../../core/util/es5-compat';
import { Slide } from '../../core/slideimplementation/slide';
import { NOTES_SLIDE_REL_TYPE } from './constants';
import { getNotes } from './get-notes';
const REMOVE_NOTES_SLIDE_PROP: string = 'removeNotesSlide';
/**
 * Removes the notesSlide relationship from `slide` and the notesSlide part
 * when no other relationship still targets it.
 *
 * @throws {Error} Never for absent notes (no-op). Only core invalid-package conditions on use.
 * @remarks No parameters (human lock 2026-10-14). Does not delete notesMaster. Does not renumber shape ids or rename parts. Shared
 * notesSlide parts (odd packages) are kept while another relationship targets them; the requested slide’s relationship is always removed.
 * @example ```ts import { Presentation } from '@syncfusion/ej2-pptx'; import '@syncfusion/ej2-pptx/notes'; const doc = await
 * Presentation.open(bytes); doc.slides[0]!.removeNotesSlide(); // absent notes: no-op await doc.save(); ```
 * @public
 * @param {Slide} slide - Host slide (relationship source). Provided by the method form `slide.removeNotesSlide()`.
 * @returns {void} Nothing.
 */
export function removeNotesSlide(slide: Slide): void {
    const document: Presentation | undefined = slide.getPresentation();
    if (document === undefined) {
        // No package bridge: cannot prove relationship state. No-op, never throw.
        return;
    }
    const access: PackagePartAccess = document.packagePartAccess();
    const rels: ReadonlyArray<PackageRelationship> = access.getRelationships(slide.partName);
    const notesRels: PackageRelationship[] = [];
    for (let i: number = 0; i < rels.length; i++) {
        const rel: PackageRelationship = arrayAt(rels, i) as PackageRelationship;
        if (rel.type === NOTES_SLIDE_REL_TYPE && rel.targetMode === 'Internal' &&
            rel.targetPartName !== undefined) {
            notesRels.push(rel);
        }
    }
    if (notesRels.length === 0) {
        // Absent notes: no-op (locked; no throw).
        return;
    }
    const removedPartNames: Set<string> = new Set<string>();
    for (let i: number = 0; i < notesRels.length; i++) {
        const rel: PackageRelationship = notesRels[i];
        const targetPartName: string = rel.targetPartName as string;
        if (stringIncludes(targetPartName, '..')) {
            // Path traversal target: fail closed — keep part, drop relationship only.
            continue;
        }
        if (isNotesPartStillTargeted(document, access, targetPartName, slide.partName)) {
            // Shared part: keep part bytes + Override; drop only this slide's rel.
            continue;
        }
        removedPartNames.add(targetPartName);
    }
    // Drop the slide's notesSlide relationships (always).
    const kept: PackageRelationship[] = [];
    for (let i: number = 0; i < rels.length; i++) {
        const rel: PackageRelationship = arrayAt(rels, i) as PackageRelationship;
        if (rel.type === NOTES_SLIDE_REL_TYPE && rel.targetMode === 'Internal') {
            continue;
        }
        kept.push(rel);
    }
    access.replaceRelationships(slide.partName, kept);
    // Delete unshared notes parts + their relationship-map entries. deletePart
    // also drops the content-type Override (no dangling Override; OPC).
    const names: string[] = Array.from(removedPartNames);
    for (let i: number = 0; i < names.length; i++) {
        access.deletePart(arrayAt(names, i));
    }
}
/**
 * True when any relationship **other than from `excludeSource`** still
 * targets `targetPartName`.
 *
 * @param {Presentation} document - Owning document.
 * @param {PackagePartAccess} access - Live package access.
 * @param {string} targetPartName - Notes part candidate for deletion.
 * @param {string} excludeSource - Slide whose relationships are being removed.
 * @returns {boolean} The result.
 */
function isNotesPartStillTargeted(document: Presentation, access: PackagePartAccess,
                                  targetPartName: string, excludeSource: string): boolean {
    const listPartNames: string[] = document.listPartNames();
    for (let i: number = 0; i < listPartNames.length; i++) {
        const source: string = listPartNames[i];
        const current: ReadonlyArray<PackageRelationship> = access.getRelationships(source);
        for (let j: number = 0; j < current.length; j++) {
            const rel: PackageRelationship = arrayAt(current, j) as PackageRelationship;
            if (rel.targetMode !== 'Internal' || rel.targetPartName !== targetPartName) {
                continue;
            }
            // Slide relationships are being filtered in this same call;
            // the removed source itself no longer counts.
            if (source === excludeSource) {
                continue;
            }
            // Any other source still targeting the part makes it shared.
            return true;

        }

    }
    return false;
}

/**
 * Whether `source` is a slide part (`/ppt/slides/slideN.xml`).
 *
 * @param {string} source - The source value.
 * @returns {boolean} The result.
 */
function isSlidePartName(source: string): boolean {
    return stringIncludes(source, '/ppt/slides/');
}
/**
 * Attaches the public `slide.removeNotesSlide()` method onto {@link Slide}.
 *
 * @remarks API-RULES R6.2 (same prototype-assignment pattern as charts):
 * optional feature augments core after import. Core remains free of notes
 * authoring imports; only `@syncfusion/ej2-pptx/notes` patches Slide.
 *
 * @internal
 * @returns {void} Nothing.
 */
export function attachRemoveNotesToSlide(): void {
    if (!Object.prototype.hasOwnProperty.call(Slide.prototype, REMOVE_NOTES_SLIDE_PROP)) {
        Object.defineProperty(Slide.prototype, REMOVE_NOTES_SLIDE_PROP, {
            configurable: true,
            enumerable: false,
            writable: false,
            /**
             *
             * @param {Slide} this - The this value.
             * @returns {void} Nothing.
             */
            value(this: Slide): void {
                removeNotesSlide(this);
            }
        });
    }
}
attachRemoveNotesToSlide();