/**
 * Injectable Magnification feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/magnification
 *
 * Follows the Syncfusion injectable-module pattern: the application injects
 * the feature once per class, and every editor instance mounts it during
 * `render()`:
 *
 * ```typescript
 * import { PptxEditor, Magnification } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(Magnification); // inject the optional feature
 * const editor = new PptxEditor({ enableMagnification: true }, '#editor');
 * ```
 *
 * The magnification feature (zoom percentage control — `setZoom` / `zoomIn` /
 * `zoomOut` / `zoomTo100`, fit modes `fitToWindow` / `fitWidth`, and the
 * fit-scale display sync) is active only when this module is injected **and**
 * {@link PptxEditor.enableMagnification} is `true` (its default). When not
 * injected, the module code is tree-shaken out of the application bundle and
 * every zoom API on the editor is a no-op. When injected but disabled at
 * runtime, zoom stays inert.
 *
 * Zoom state (`zoom`) stays on the editor as the single source of truth; this
 * module owns the request validation, clamp, and application through the
 * host's internal zoom-apply seams.
 */

import { PptxEditor } from '../pptxeditor';

/**
 * Injectable module that owns the magnification (zoom) feature.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` declaration (`member: 'magnification'`), instantiates
 * this class with the editor as its single constructor argument, and attaches
 * the instance to the editor as `magnificationModule`. `ModuleLoader.clean()`
 * calls {@link destroy} during `refresh()` and component destruction.
 *
 * @constructor
 */
export class Magnification {
    /** Editor host that owns the zoom state single source of truth. */
    private readonly parent: PptxEditor;

    /**
     * Creates the Magnification module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
    }

    /**
     * Module name used by the EJ2 `ModuleLoader` for matching and validation.
     *
     * @returns {string} Module name `'magnification'`
     */
    public getModuleName(): string {
        return 'magnification';
    }

    /**
     * Whether the magnification feature is currently active on the host editor.
     *
     * @returns {boolean} True while zoom APIs act on the host
     */
    public isEnabled(): boolean {
        return this.parent.enableMagnification;
    }

    /**
     * Sets zoom percentage, clamping to 10–400 without throwing.
     *
     * Delegates the clamp + application to the host `applyZoomScale` seam.
     * No-op while the feature is disabled.
     *
     * @param {number} percent - Requested zoom percentage
     * @returns {void}
     */
    public setZoom(percent: number): void {
        if (!this.parent.enableMagnification) {
            return;
        }
        this.parent.applyZoomScale(percent, 'percentage');
    }

    /**
     * Syncs host zoom percent from a fit-mode layout without switching zoom mode.
     *
     * Used by the main slide area so the toolbar ComboBox matches the fit
     * scale. No-op while the feature is disabled.
     *
     * @param {number} percent - Computed fit zoom percentage
     * @returns {void}
     */
    public syncZoomDisplay(percent: number): void {
        if (!this.parent.enableMagnification) {
            return;
        }
        this.parent.applyZoomScaleDisplay(percent);
    }

    /**
     * Increases zoom by 10 percentage points (clamped).
     *
     * @returns {void}
     */
    public zoomIn(): void {
        this.setZoom(this.parent.zoom + 10);
    }

    /**
     * Decreases zoom by 10 percentage points (clamped).
     *
     * @returns {void}
     */
    public zoomOut(): void {
        this.setZoom(this.parent.zoom - 10);
    }

    /**
     * Sets zoom to 100%.
     *
     * @returns {void}
     */
    public zoomTo100(): void {
        this.setZoom(100);
    }

    /**
     * Fits the whole slide in the view area.
     *
     * @returns {void}
     */
    public fitToWindow(): void {
        if (!this.parent.enableMagnification) {
            return;
        }
        this.parent.applyFitToWindow();
    }

    /**
     * Fits slide width in the view area (aspect ratio preserved).
     *
     * @returns {void}
     */
    public fitWidth(): void {
        if (!this.parent.enableMagnification) {
            return;
        }
        this.parent.applyFitWidth();
    }

    /**
     * Tears down the magnification feature. Idempotent.
     *
     * Called by `ModuleLoader.clean()` on `refresh()` and component destroy,
     * and by the editor when `enableMagnification` flips to `false`.
     *
     * @returns {void}
     */
    public destroy(): void {
        // No DOM or listener state is owned by this module; the host owns the
        // zoom state. Kept for the ModuleLoader.clean() contract.
    }
}