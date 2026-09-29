/**
 * Adapter type bridging the UI component layer and the headless
 * `insertTable` command.
 *
 * Mirrors `InsertTablePayload` from `@syncfusion/ej2-headless-editor` and is
 * declared locally so component code does not depend on a headless internal
 * path that is not re-exported from the package's public barrel. Keep these
 * fields in sync with the headless type whenever it changes.
 */
export interface InsertTablePayload {
    rows: number;
    columns: number;
    withHeaderRow?: boolean;
}
