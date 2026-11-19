/**
 * Always-on body/run/inline / package-part feature bootstrap (tables,
 * content-controls, images, drawing, bookmarks, fields, numbering, sections,
 * headers-footers, comments, revisions).
 *
 * Core never imports feature modules. Feature entry side-effects (and the main
 * `@syncfusion/ej2-docx` entry) register idempotent `register*Feature` callbacks here so
 * every `WordDocument.create` / `fromPackage` re-arms handlers after test resets.
 * Numbering uses the same hook to re-arm its `registerFeaturePartHandler` for
 * `/word/numbering.xml`. Headers/footers and comments re-arm
 * `registerFeatureMultiPartHandler` for their relationship types (comments also
 * registers inline/run-leaf handlers for range markers and `commentReference`).
 * Sections re-arm WordDocument.create wrapping and feature registration for typed
 * `w:sectPr` (not classic body-block handlers). Revisions re-arm inline/block
 * track-change handlers and move-range markers (no package part).
 *
 * @private
 */

const bootstraps: Array<() => void> = [];

/**
 * Register a callback invoked before main-document body parse/create.
 * Idempotent registration of the feature itself is the callee's job.
 *
 * @param {Function} fn - The fn.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerAlwaysOnBodyFeatureBootstrap(fn: () => void): void {
    bootstraps.push(fn);
}

/**
 * Run all always-on body feature bootstraps. Safe when none are registered
 * (pure core without main entry / feature imports).
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function ensureAlwaysOnBodyFeaturesRegistered(): void {
    for (const fn of bootstraps) {
        fn();
    }
}

/**
 * @private
 * Test hook — clear bootstrap list (does not unregister handlers). */

export function resetAlwaysOnBodyFeatureBootstrapsForTests(): void {
    bootstraps.length = 0;
}
