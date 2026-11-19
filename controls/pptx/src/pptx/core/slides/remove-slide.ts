/**
 * Slide removal — package teardown shared by `slides.remove` (instance) and
 * `slides.removeAt` (index) (TASK-1077 / TASK-1078).
 *
 * @remarks
 * Algorithm (TASK-1077 / requirement 003 §3):
 * 1. Locate the slide by instance identity in the model slide array.
 * 2. Drop the slide part, its part relationships map entry, and its
 *    `[Content_Types].xml` Override.
 * 3. Drop the presentation→slide relationship whose `@id` is the slide's
 *    `relationshipId`.
 * 4. Splice the slide out of the model slide array; `p:sldIdLst` is rebuilt
 *    from survivors on the next `save()` via `flushPresentationModel`.
 *
 * No slide part URIs are renamed. Survivor `ST_SlideId` values are stable and
 * enumeration order follows the new `p:sldIdLst` (requirement 003 §3). The freed
 * `ST_SlideId` of the removed slide is **not** reused on a subsequent
 * `slides.add` because `addSlideToPresentation` allocates the next id as
 * `max(existing, ST_SLIDE_ID_MIN - 1) + 1`.
 *
 * Citations: `pml.xsd` `CT_Presentation` / `CT_SlideIdList` / `CT_SlideIdListEntry`;
 * OPC `[Content_Types].xml` Override slice (ECMA-376-1 §15.2); relationship
 * schema under `opc-relationships.xsd`.
 *
 * @packageDocumentation
 */
import { OpcPackage } from '../package/package-model';
import { PresentationModel } from '../presentation/load';
import { Slide } from '../slideimplementation/slide';
import { PresentationError, PresentationErrorCode } from '../errors';
import { arrayAt } from '../util/es5-compat';
import { PackageRelationship } from '../package/relationships';
/**
 * Removes `slide` from `model.slides` and tears down its package part,
 * presentation→slide relationship, and `[Content_Types].xml` override.
 *
 * @throws {Error} When `slide` is not present in `model.slides` (instance identity).
 * @remarks Idempotent-safe by instance check: passing a slide already removed does nothing destructive at the package map level because the
 * relationship id lookup in the presentation relationships is filtered to a no-op. Callers are expected to guard against double removal by
 * checking the collection first; this helper throws to make the caller's mistake visible. Side-effect teardown of parts only reachable from
 * the removed slide (notes slides, embedded media, comments parts) is **out of scope** for TASK-1077 — such cleanup, if required, is a
 * follow-up task so deferred-link cleanup stays isolated from this entry point (TASK-1077 scope §out-of-scope).
 * @internal
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @param {PresentationModel} model - Live presentation model (slides array is mutated).
 * @param {Slide} slide - Slide instance that must currently be in `model.slides`.
 * @returns {void} Nothing.
 */
export function removeSlideFromPresentation(pkg: OpcPackage, model: PresentationModel, slide: Slide): void {
    const index: number = model.slides.indexOf(slide);
    if (index < 0) {
        throw new Error('Slide is not a member of this presentation; cannot remove. Use a slide from presentation.slides.');
    }
    const partName: string = slide.partName;
    const relationshipId: string = slide.relationshipId;
    // 1. Drop the slide package part (no ZIP entry will be written on save).
    pkg.parts.delete(partName);
    // 2. Drop the slide part's relationships map entry (and thus its .rels).
    pkg.partRelationships.delete(partName);
    // 3. Drop the slide's [Content_Types].xml Override; the save path also
    //    strips overrides for parts no longer present, but we keep the in-memory
    //    model consistent so a no-mutation probe does not regress.
    pkg.contentTypes.overrides.delete(partName);
    // 4. Drop the presentation→slide relationship row identified by @id.
    const presentationRels: Array<PackageRelationship> = pkg.partRelationships.get(model.presentationPartName);
    if (presentationRels !== undefined) {
        const filtered: Array<PackageRelationship> = presentationRels.filter((rel: PackageRelationship) => rel.id !== relationshipId);
        if (filtered.length !== presentationRels.length) {
            pkg.partRelationships.set(model.presentationPartName, filtered);
        }
    }
    // 5. Detach the slide from the model list. `flushPresentationModel`
    //    rebuilds `p:sldIdLst` from `model.slides` and recomputes
    //    `/docProps/app.xml` slide count on the next save.
    (model.slides as Slide[]).splice(index, 1);
}
/**
 * Removes the slide at the given 0-based `index` from the presentation and
 * tears down its package surface. This is the index-based entry point that
 * reuses {@link removeSlideFromPresentation} for the shared teardown.
 *
 * @throws {Error} With code `model/out-of-range` when `index` is not a valid slide position (`index < 0` or `index >=
 * model.slides.length`), per API-RULES R3.1 / R7.2.
 * @remarks Bounds are checked against the live model slide array **before** any package mutation. A negative `index` is out-of-range (no
 * wrap-around), and any valid signed integer below `length` is permitted. The shared teardown guarantees are inherited from {@link
 * removeSlideFromPresentation}: survivor part URIs unchanged; survivor `ST_SlideId` values stable; freed id not reused; `slideNumber`
 * recomputed by enumeration position on the next save. Citation: `pml.xsd` `CT_SlideIdList` / `CT_SlideIdListEntry`; requirement 003 §3;
 * API-RULES R3.1 (indexed access), R5.5, R5.6, R7.2; TASK-1078.
 * @internal
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @param {PresentationModel} model - Live presentation model (slides array is mutated).
 * @param {number} index - 0-based position in enumeration order.
 * @returns {void} Nothing.
 */
export function removeSlideAtIndex(pkg: OpcPackage, model: PresentationModel, index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= model.slides.length) {
        throw new PresentationError(OUT_OF_RANGE_CODE,
                                    `Slide index ${String(index)} is out of range (length ${String(model.slides.length)}).`);
    }
    const slide: Slide = arrayAt(model.slides, index);
    if (slide === undefined) {
        // Defensive: bounds check above guarantees membership; kept explicit because
        // `noUncheckedIndexedAccess` types index access as `T | undefined`.
        throw new PresentationError(OUT_OF_RANGE_CODE,
                                    `Slide index ${String(index)} is out of range (length ${String(model.slides.length)}).`);
    }
    removeSlideFromPresentation(pkg, model, slide);
}
/**
 * Stable error code surfaced via {@link PresentationError.code} for the
 * out-of-range contract on {@link removeSlideAtIndex}.
 */
const OUT_OF_RANGE_CODE: PresentationErrorCode = 'model/out-of-range';
