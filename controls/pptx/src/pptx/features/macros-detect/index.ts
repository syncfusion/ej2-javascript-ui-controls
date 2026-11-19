/**
 * Optional macro-detection module (`@syncfusion/ej2-pptx/macros-detect`).
 *
 * @remarks
 * Phase 4 is **detect + preserve in core**: {@link Presentation.hasMacros}
 * already covers the normative content-type and `vbaProject` relationship paths.
 * This entry is a tree-shakeable stub so consumers can import an explicit enable
 * hook and so the package export is reserved for future extended analysis.
 *
 * The module does **not** parse MS-OVBA, execute VBA, or remove macros.
 *
 * Citation: ECMA-376-1 §11.4; [MS-OFFMACRO2]; MS-OVBA;
 * `docs/specs/025-vba-macro-detect.md`.
 *
 * @packageDocumentation
 */
/**
 * Feature id for optional macro-detection extensions (reserved).
 *
 * @public
 */
export const MACROS_DETECT_FEATURE_ID: string = 'macros-detect';
/**
 * Phase 4 no-op enable hook for future extended macro packaging analysis.
 *
 * @remarks
 * Core {@link Presentation.hasMacros} does not require this import.
 * Call when an application wants an explicit opt-in surface without relying on
 * future side-effect registration alone.
 *
 * @returns {void} Nothing.
 */
export function enableMacrosDetect(): void {
    // Phase 4: stub only. Future tasks may register finer-grained analysis hooks.
}
