/**
 * Thin chart instance read helpers (TASK-1067).
 *
 * @remarks
 * Mirrors diagrams `read-model.ts` for presence queries over
 * {@link ChartInstance.relatedParts}. Does **not** open nested embeddings.
 * `parsed.dataSource` may report `kind: 'none'` when the host passes
 * `pkg: undefined` to xlsx `parseChartSpace` even if an `embeddedPackage`
 * relationship is listed — data-source resolution is deferred until a later
 * task opens the embedding under nested-package limits.
 *
 * Citations: ECMA-376 Part 1 §14.2.1–§14.2.2 / §15.2.11; [MS-ODRAWXML] 2.1.1–2.1.2.
 */
import { ChartInstance, ChartRelatedKind, ChartRelatedPart } from './resolve-chart';
/**
 * Returns true when the instance lists at least one related part of `kind`.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @param {ChartRelatedKind} kind - Related-part classification.
 * @returns {boolean} Whether any related part matches.
 */
export declare function chartHasRelatedKind(instance: ChartInstance, kind: ChartRelatedKind): boolean;
/**
 * Related parts of the given kind (may be empty).
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @param {ChartRelatedKind} kind - Related-part classification.
 * @returns {*} Matching related parts in package order.
 */
export declare function listChartRelatedParts(instance: ChartInstance, kind: ChartRelatedKind): ReadonlyArray<ChartRelatedPart>;
/**
 * Absolute chart part name for the instance.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {string} Package-absolute chart part URI.
 */
export declare function chartPartName(instance: ChartInstance): string;
/**
 * True when a Chart Drawing (userShapes) relationship is present.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {boolean} Whether userShapes related parts exist.
 */
export declare function chartHasUserShapes(instance: ChartInstance): boolean;
/**
 * True when a Chart Colors ([MS-ODRAWXML] 2.1.1) relationship is present.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {boolean} Whether colorStyle related parts exist.
 */
export declare function chartHasColorStyle(instance: ChartInstance): boolean;
/**
 * True when a Chart Style ([MS-ODRAWXML] 2.1.2) relationship is present.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {boolean} Whether style related parts exist.
 */
export declare function chartHasStyle(instance: ChartInstance): boolean;
/**
 * True when an Embedded Package relationship is listed (not opened).
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {boolean} Whether embeddedPackage related parts exist.
 */
export declare function chartHasEmbeddedPackage(instance: ChartInstance): boolean;
/**
 * True when at least one unclassified child relationship is listed.
 *
 * @public
 * @param {ChartInstance} instance - Resolved chart instance.
 * @returns {boolean} Whether unknown related parts exist.
 */
export declare function chartHasUnknownRelatedParts(instance: ChartInstance): boolean;
