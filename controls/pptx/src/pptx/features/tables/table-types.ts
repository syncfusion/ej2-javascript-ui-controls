/**
 * Read-only table merge and direct cell property types.
 *
 * @remarks
 * Merge attributes are preserve-only in Phase 3 (TASK-1023/1024). XSD defaults apply
 * on the **read** surface when attributes are absent; the library must not invent
 * written merge markup. Citation: Transitional `dml-main.xsd` `CT_TableCell`,
 * `CT_TableCellProperties`.
 *
 * @packageDocumentation
 */
/**
 * Read-only merge attributes for a table cell (`CT_TableCell`).
 *
 * @public
 */
export interface TableMergeInfo {
    /**
     * `rowSpan` — XSD default `1` when absent.
     */
    readonly rowSpan: number;
    /**
     * `gridSpan` — XSD default `1` when absent.
     */
    readonly gridSpan: number;
    /**
     * `hMerge` — XSD default `false` when absent.
     */
    readonly hMerge: boolean;
    /**
     * `vMerge` — XSD default `false` when absent.
     */
    readonly vMerge: boolean;
}
/**
 * Direct `a:tcPr` attributes modelled in Phase 3 (margins, orientation, anchor).
 *
 * @remarks
 * On **read**, XSD defaults apply when the attribute (or entire `tcPr`) is absent.
 * Line/fill children under `tcPr` are not represented here and must be preserved on
 * write. Citation: Transitional `dml-main.xsd` `CT_TableCellProperties`.
 *
 * @public
 */
export interface DirectTableCellProperties {
    /**
     * Left margin EMUs (`marL`) — XSD default `91440` when absent.
     */
    readonly marL: number;
    /**
     * Right margin EMUs (`marR`) — XSD default `91440` when absent.
     */
    readonly marR: number;
    /**
     * Top margin EMUs (`marT`) — XSD default `45720` when absent.
     */
    readonly marT: number;
    /**
     * Bottom margin EMUs (`marB`) — XSD default `45720` when absent.
     */
    readonly marB: number;
    /**
     * Text vertical type (`vert`) — XSD default `horz` when absent (`ST_TextVerticalType`).
     */
    readonly vert: string;
    /**
     * Vertical anchor (`anchor`) — XSD default `t` when absent (`ST_TextAnchoringType`).
     */
    readonly anchor: string;
    /**
     * Anchor center (`anchorCtr`) — XSD default `false` when absent.
     */
    readonly anchorCtr: boolean;
    /**
     * Horizontal overflow (`horzOverflow`) — XSD default `clip` when absent
     * (`ST_TextHorzOverflowType`).
     */
    readonly horzOverflow: string;
}
/**
 * Patch bag for {@link TableCell.setDirectCellProperties}.
 *
 * @remarks
 * Only defined keys are written to `tcPr`. Omitted keys leave existing attributes
 * unchanged. Does not invent attributes for keys the caller did not supply.
 *
 * @public
 */
export type DirectTableCellPropertiesPatch = {
    [K in keyof DirectTableCellProperties]?: DirectTableCellProperties[K];
};
