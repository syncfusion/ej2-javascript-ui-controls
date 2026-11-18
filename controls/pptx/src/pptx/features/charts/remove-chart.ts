/**
 * Remove a classic DrawingML chart from a slide (`removeChart`).
 *
 * @remarks
 * Algorithm (spec 037 / TASK-1069):
 * 1. Verify handle belongs to this slide.
 * 2. Splice `graphicFrame` from `p:spTree` (no shape-id renumber).
 * 3. GC chart part + relatedParts (userShapes/style/colorStyle/unknown children).
 * 4. GC embedding when no other chart still references it.
 * 5. Filter relationships targeting removed parts; notifyMutate.
 *
 * Citations: ECMA-376 chart + package embedding rels; ADR 2026-09-18; TASK-1069.
 *
 * @packageDocumentation
 */
import { PackagePartAccess } from '../../core/package/package-part-access';
import { Presentation } from '../../core/package/presentation';
import { PackageRelationship } from '../../core/package/relationships';
import { InvalidPackageError } from '../../core/security/errors';
import { findSpTree } from '../../core/shapes/add-text-box';
import { Slide } from '../../core/slideimplementation/slide';
import { Chart } from './chart';
import { ChartsError, partNameOptions } from './errors';
import { asChartSync, ChartInstance, ChartRelatedPart } from './resolve-chart';
import { getCachedXlsxRoot } from './xlsx-surface';
import { OoxmlElement } from '../../core/xml/dom';
import { Shape } from '../../core/shapes/shape';
/**
 * Removes a chart graphic frame and unreferenced chart/embedding parts.
 *
 * @param slide - Host slide that owns the frame.
 * @param chart - Handle from this slide’s `charts` or `addChart`.
 *
 * @throws {Error} When the handle is not on this slide or not bound.
 * @throws {Error} When `p:spTree` is missing.
 *
 * @remarks
 * Does not renumber remaining shape ids. Shared embeddings referenced by other
 * charts are retained. Other shapes and foreign markup stay.
 *
 * @public
 */
import { stringIncludes, arrayAt } from '../../core/util/es5-compat';
/**
 *
 * @param {Slide} slide - The slide value.
 * @param {Chart} chart - The chart value.
 * @returns {void} Nothing.
 */
export function removeChart(slide: Slide, chart: Chart): void {
    const document: Presentation = slide.getPresentation();
    if (document === undefined) {
        throw new ChartsError('Slide is not bound to a presentation document; cannot remove chart', partNameOptions(slide.partName));
    }
    if (chart.getPresentation() !== document) {
        throw new ChartsError('Chart does not belong to this presentation', partNameOptions(slide.partName));
    }
    const frame: OoxmlElement = chart.shape.getElement();
    const onThisSlide: boolean = slide.shapes.some((shape: Shape) => shape.id === chart.shape.id && shape.getElement() === frame);
    if (!onThisSlide) {
        throw new ChartsError('Chart graphic frame is not on this slide', partNameOptions(slide.partName));
    }
    const root: OoxmlElement = slide.getRoot();
    const spTree: OoxmlElement = findSpTree(root);
    if (spTree === undefined) {
        throw new InvalidPackageError('Slide has no p:spTree; cannot remove chart', {
            partName: slide.partName
        });
    }
    const removedFrame: boolean = removeDirectChild(spTree, frame);
    if (!removedFrame) {
        throw new ChartsError('Chart graphic frame is not a direct child of p:spTree', partNameOptions(slide.partName));
    }
    const instance: ChartInstance = chart.getInternalInstance();
    const access: PackagePartAccess = document.packagePartAccess();
    const removed: ReadonlyArray<string> = collectRemovablePartNames(document, instance);
    applyRemovedParts(access, removed);
    filterRelationshipsTargeting(document, access, new Set(removed));
    slide.notifyMutate();
}
/**
 * Chart part + related children; embedding only when unreferenced elsewhere.
 *
 * @param {Presentation} document - The document value.
 * @param {ChartInstance} instance - The instance value.
 * @returns {*} The result.
 */
function collectRemovablePartNames(document: Presentation, instance: ChartInstance): ReadonlyArray<string> {
    const names: Set<string> = new Set<string>();
    names.add(instance.partName);
    for (let i: number = 0; i < instance.relatedParts.length; i++) {
        const rel: any = arrayAt(instance.relatedParts, i); // eslint-disable-line
        if (rel.kind === 'embeddedPackage') {
            continue;
        }
        if (stringIncludes(rel.targetPartName, '..')) {
            throw new ChartsError(`Refusing to delete related part with path traversal: "${rel.targetPartName}"`);
        }
        names.add(rel.targetPartName);

    }
    const embeddingTargets: Array<string> = instance.relatedParts
        .filter((r: ChartRelatedPart) => r.kind === 'embeddedPackage')
        .map((r: ChartRelatedPart) => r.targetPartName);
    for (let i: number = 0; i < embeddingTargets.length; i++) {
        const emb: string = arrayAt(embeddingTargets, i);
        if (stringIncludes(emb, '..')) {
            throw new ChartsError(`Refusing to delete embedding with path traversal: "${emb}"`);
        }
        if (!isEmbeddingReferencedByOtherCharts(document, instance.partName, emb)) {
            names.add(emb);
        }

    }
    return [...names];
}
/**
 * True when another chart graphicFrame still targets the same embedding part.
 *
 * @param {Presentation} document - The document value.
 * @param {string} removedChartPartName - The removedChartPartName value.
 * @param {string} embeddingPartName - The embeddingPartName value.
 * @returns {boolean} The result.
 */
function isEmbeddingReferencedByOtherCharts(document: Presentation, removedChartPartName: string, embeddingPartName: string): boolean {
    // Need warmed xlsx for asChartSync; if cold, be conservative and keep embedding.
    if (getCachedXlsxRoot() === undefined) {
        return true;
    }
    for (let i: number = 0; i < document.slides.length; i++) {
        const slide: Slide = arrayAt(document.slides, i);
        for (let j: number = 0; j < slide.shapes.length; j++) {
            const shape: Shape = arrayAt(slide.shapes, j);
            let other: ChartInstance | undefined;
            try {
                other = asChartSync(shape, document);
            }
            catch {
                continue;
            }
            if (other === undefined) {
                continue;
            }
            if (other.partName === removedChartPartName) {
                continue;
            }
            for (let k: number = 0; k < other.relatedParts.length; k++) {
                const rel: any = arrayAt(other.relatedParts, k); // eslint-disable-line
                if (rel.kind === 'embeddedPackage' && rel.targetPartName === embeddingPartName) {
                    return true;
                }

            }
            // Also check package relationships on the chart part directly.
            const relationships: ReadonlyArray<PackageRelationship> = document.getRelationships(other.partName);
            for (let k: number = 0; k < relationships.length; k++) {
                const pkgRel: PackageRelationship = arrayAt(relationships, k);
                if (pkgRel.targetMode === 'Internal' &&
                    pkgRel.targetPartName === embeddingPartName) {
                    return true;
                }

            }

        }

    }
    return false;
}
/**
 * @param {object} parent - The parent value.
 * @param {*} parent.children - The parent.children value.
 * @param {*} child - The child value.
 * @returns {boolean} The result.
 */
function removeDirectChild(parent: {
    readonly children: ReadonlyArray<unknown>;
}, child: unknown): boolean {
    const mutable: { children: unknown[]; } = parent as {
        children: unknown[];
    };
    const idx: number = mutable.children.indexOf(child);
    if (idx < 0) {
        return false;
    }
    mutable.children.splice(idx, 1);
    return true;
}
/**
 *
 * @param {PackagePartAccess} access - The access value.
 * @param {*} removedPartNames - The removedPartNames value.
 * @returns {void} Nothing.
 */
function applyRemovedParts(access: PackagePartAccess, removedPartNames: ReadonlyArray<string>): void {
    for (let i: number = 0; i < removedPartNames.length; i++) {
        const name: string = arrayAt(removedPartNames, i);
        if (stringIncludes(name, '..')) {
            throw new ChartsError(`Refusing to delete part with path traversal: "${name}"`);
        }
        access.deletePart(name);

    }
}
/**
 * Drops internal relationships whose resolved target is a removed part.
 *
 * @param {Presentation} document - The document value.
 * @param {PackagePartAccess} access - The access value.
 * @param {ReadonlySet<string>} removed - The removed value.
 * @returns {void} Nothing.
 */
function filterRelationshipsTargeting(document: Presentation, access: PackagePartAccess, removed: ReadonlySet<string>): void {
    const sources: Set<string> = new Set<string>(['/']);
    const listPartNames2: string[] = document.listPartNames();
    for (let i: number = 0; i < listPartNames2.length; i++) {
        const name: string = arrayAt(listPartNames2, i);
        sources.add(name);

    }
    for (let i: number = 0; i < document.slides.length; i++) {
        const slide: Slide = arrayAt(document.slides, i);
        sources.add(slide.partName);

    }
    const sourceList: string[] = Array.from(sources);
    for (let i2: number = 0; i2 < sourceList.length; i2++) {
        const source: string = arrayAt(sourceList, i2);
        if (removed.has(source)) {
            continue;
        }
        const current: ReadonlyArray<PackageRelationship> = access.getRelationships(source);
        const filtered: PackageRelationship[] = [];
        let changed: boolean = false;
        for (let j: number = 0; j < current.length; j++) {
            const rel: PackageRelationship = arrayAt(current, j);
            if (rel.targetMode === 'Internal' &&
                rel.targetPartName !== undefined &&
                removed.has(rel.targetPartName)) {
                changed = true;
                continue;
            }
            filtered.push(rel);

        }
        if (changed) {
            access.replaceRelationships(source, filtered);
        }

    }
}
