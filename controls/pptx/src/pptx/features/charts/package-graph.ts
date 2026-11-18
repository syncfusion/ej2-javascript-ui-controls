import { arrayAt } from '../../core/util/es5-compat';
/**
 * Build a host-local chart package graph from an open presentation.
 *
 * @remarks
 * Mirrors the diagrams bridge pattern (TASK-1058) with host-owned types —
 * charts do not reuse office-common diagram graph types. Maps every package
 * part to UTF-8 text and every internal relationship to absolute
 * `targetPartName` + `source`. External relationships are omitted.
 *
 * Does not invent relationship types or content types. Unknown chart child
 * parts remain listed so callers can preserve them (req 022).
 *
 * Citations: ECMA-376 Part 1 chart part; Part 4 chart / chartUserShapes
 * package relationship Sources; [MS-ODRAWXML] chartColorStyle / chartStyle.
 * TASK-1067.
 */
import { PackageRelationship } from '../../core/package/relationships';
import { Presentation } from '../../core/package/presentation';
import { PackagePart } from '../../core/package/package-model';
import { Slide } from '../../core/slideimplementation/slide';
const utf8: TextDecoder = new TextDecoder('utf-8');
/**
 * One package part snapshot for the chart bridge (UTF-8 text view).
 *
 * @public
 */
export interface ChartPackagePart {
    /** Absolute part name (leading `/`). */
    readonly name: string;
    /** Content type from `[Content_Types].xml`. */
    readonly contentType: string;
    /** Part payload decoded as UTF-8 (binary embeddings appear as opaque text). */
    readonly xml: string;
}
/**
 * One internal package relationship with absolute target + source.
 *
 * @public
 */
export interface ChartPackageRelationship {
    /** Relationship id (`rId…`). */
    readonly id: string;
    /** Relationship type URI (corpus value). */
    readonly type: string;
    /** Absolute target part name. */
    readonly target: string;
    /** Absolute source part name (`/` for package root). */
    readonly source: string;
}
/**
 * Host-local package graph for chart resolve / read-model (TASK-1067).
 *
 * @public
 */
export interface ChartPackageGraph {
    /** Parts included in the chart package graph export (name + payload descriptors). */
    readonly parts: ReadonlyArray<ChartPackagePart>;
    /** Relationships among parts in the chart package graph. */
    readonly relationships: ReadonlyArray<ChartPackageRelationship>;
}
/**
 * Collects relationship source part names (package root, all parts, slides).
 *
 * @param {Presentation} document - Open presentation.
 * @returns {string[]} Unique absolute source keys for {@link Presentation.getRelationships}.
 */
function collectRelationshipSources(document: Presentation): string[] {
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
    return [...sources];
}
/**
 * Builds a {@link ChartPackageGraph} snapshot from the live package.
 *
 * @remarks Part `xml` is decoded as UTF-8. Relationship `target` uses resolved `targetPartName` (absolute). External relationships and
 * targets without an absolute part name are omitted. `getPart` returns copies — safe for read-only bridge use (TASK-1067).
 * @public
 * @param {Presentation} document - Open presentation (read-only snapshot of parts + rels).
 * @returns {ChartPackageGraph} Host-local graph for chart discovery and related-part listing.
 */
export function buildChartPackageGraph(document: Presentation): ChartPackageGraph {
    const parts: ChartPackagePart[] = [];
    const listPartNames2: string[] = document.listPartNames();
    for (let i: number = 0; i < listPartNames2.length; i++) {
        const name: string = arrayAt(listPartNames2, i);
        const part: PackagePart = document.getPart(name);
        if (part === undefined) {
            continue;
        }
        parts.push({
            name: part.name,
            contentType: part.contentType,
            xml: utf8.decode(part.data)
        });

    }
    const relationships: ChartPackageRelationship[] = [];
    const collectRelationshipSourcesResult: string[] = collectRelationshipSources(document);
    for (let i2: number = 0; i2 < collectRelationshipSourcesResult.length; i2++) {
        const source: string = arrayAt(collectRelationshipSourcesResult, i2);
        const sourceKey: string = source === '' ? '/' : source;
        const relationships2: ReadonlyArray<PackageRelationship> = document.getRelationships(sourceKey);
        for (let j: number = 0; j < relationships2.length; j++) {
            const rel: PackageRelationship = arrayAt(relationships2, j);
            if (rel.targetMode === 'External') {
                continue;
            }
            const target: string = rel.targetPartName;
            if (target === undefined) {
                continue;
            }
            relationships.push({
                id: rel.id,
                type: rel.type,
                target,
                source: sourceKey
            });

        }

    }
    return { parts, relationships };
}
