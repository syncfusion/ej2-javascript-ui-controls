/**
 * Public read-model types for hyperlink classification.
 *
 * @remarks
 * Values are **view** data only. Reading never fetches Targets, never invokes
 * `ppaction://`, and never writes resolved navigation back into the package.
 * Citation: Transitional `dml-main.xsd` `CT_Hyperlink`; `docs/specs/015-hyperlinks.md`.
 *
 * @packageDocumentation
 */
import { RelationshipTargetMode } from '../../core/package/relationships';
/**
 * Discriminant for where a hyperlink element was found.
 *
 * @remarks
 * Shape-level hover uses `hlinkHover`; run-level hover uses `hlinkMouseOver`
 * (Transitional `dml-main.xsd`).
 *
 * @public
 */
export type HyperlinkSourceKind = 'shape-click' | 'shape-hover' | 'run-click' | 'run-mouseOver';
/**
 * Readonly view of a DrawingML `CT_Hyperlink` plus optional host-part relationship.
 *
 * @remarks
 * When `rId` is set but no matching relationship exists on the provided list,
 * `target` / `targetMode` / `relationshipType` / `targetPartName` stay `undefined`
 * (soft incomplete info — no invented Target, no throw, no network).
 *
 * @public
 */
export interface HyperlinkInfo {
    /** Location discriminant for the hyperlink element. */
    readonly source: HyperlinkSourceKind;
    /**
     * `r:id` on `CT_Hyperlink` when present.
     * Citation: Transitional `dml-main.xsd` `CT_Hyperlink` attribute ref `r:id`.
     */
    readonly rId: string | undefined;
    /**
     * `@action` string as authored (may be `ppaction://…`). Data only — never invoked.
     */
    readonly action: string | undefined;
    /** `@tooltip` when present. */
    readonly tooltip: string | undefined;
    /** `@invalidUrl` when present. */
    readonly invalidUrl: string | undefined;
    /** `@tgtFrame` when present. */
    readonly tgtFrame: string | undefined;
    /**
     * Relationship `TargetMode` when `rId` resolved on the provided host-part list.
     * External has no package part; Internal may expose `targetPartName`.
     */
    readonly targetMode: RelationshipTargetMode | undefined;
    /**
     * Relationship `Target` string when resolved. Opaque data — never fetched or opened.
     */
    readonly target: string | undefined;
    /**
     * Relationship `Type` when resolved (often the Transitional hyperlink type
     * exposed as `HYPERLINK_REL_TYPE` from this module).
     */
    readonly relationshipType: string | undefined;
    /**
     * Absolute part URI when `targetMode` is Internal and the package resolved it;
     * `undefined` for External or unresolved.
     */
    readonly targetPartName: string | undefined;
}
