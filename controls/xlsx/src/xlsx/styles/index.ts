/**
 * Stylesheet model and workbook style façade.
 *
 * Root packaging entry for `generateRootFiles` (`styles.ts` → `./src/xlsx/styles/index`).
 *
 * `workbook-styles` re-exports many symbols from `styles-xml`; only `WorkbookStyles`
 * is re-exported here to avoid TS2308 duplicate-export errors.
 */

export * from './styles-xml';
export { WorkbookStyles } from './workbook-styles';
