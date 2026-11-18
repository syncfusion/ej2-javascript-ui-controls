/**
 * Injectable Navigation feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/navigation
 *
 * Follows the Syncfusion injectable-module pattern: the application injects
 * the feature once per class, and every editor instance mounts it during
 * `render()`:
 *
 * ```typescript
 * import { PptxEditor, Navigation } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(Navigation); // inject the optional feature
 * const editor = new PptxEditor({ enableNavigation: true }, '#editor');
 * ```
 *
 * The slide-navigation feature (keyboard slide navigation — Arrow /
 * PageUp / PageDown / Home / End — and the `goToSlide` / `nextSlide` /
 * `previousSlide` / `firstSlide` / `lastSlide` behaviour gate) is active only
 * when this module is injected **and**
 * {@link PptxEditor.enableNavigation} is `true` (its default). When not
 * injected, the module code is tree-shaken out of the application bundle and
 * slide navigation is inert. When injected but disabled at runtime, the
 * keyboard navigation keys and navigation APIs are no-ops.
 *
 * `goToSlide` remains the single source of truth for slide changes: the
 * editor keeps the state transition, `slideChange` event, thumbnail/status
 * sync, and announcements; this module owns the keyboard bindings and the
 * feature gate.
 */

import { PptxEditor } from '../pptxeditor';

/**
 * Injectable module that owns the slide navigation feature.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` declaration (`member: 'navigation'`), instantiates this
 * class with the editor as its single constructor argument, and attaches the
 * instance to the editor as `navigationModule`. `ModuleLoader.clean()` calls
 * {@link destroy} during `refresh()` and component destruction.
 *
 * @constructor
 */
export class Navigation {
    /** Editor host that owns the slide state single source of truth. */
    private readonly parent: PptxEditor;

    /**
     * Creates the Navigation module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
    }

    /**
     * Module name used by the EJ2 `ModuleLoader` for matching and validation.
     *
     * @returns {string} Module name `'navigation'`
     */
    public getModuleName(): string {
        return 'navigation';
    }

    /**
     * Whether the navigation feature is currently active on the host editor.
     *
     * Active only while the module is injected ({@link getModuleName} matched)
     * **and** {@link PptxEditor.enableNavigation} is `true`.
     *
     * @returns {boolean} True when navigation keys and APIs act on the host
     */
    public isEnabled(): boolean {
        return this.parent.enableNavigation;
    }

    /**
     * Handles one keyboard slide-navigation step for the host editor.
     *
     * Called by the host `onEditorKeyDown` for the navigation key set
     * (ArrowLeft / ArrowRight / ArrowUp / ArrowDown / PageUp / PageDown /
     * Home / End) after its own target/modifier guards. Vertical arrows
     * match the horizontal pair so a focused slide preview moves without
     * requiring Enter. No-op while the feature is disabled.
     *
     * @param {KeyboardEvent} event - Key-down event carrying the navigation key
     * @returns {boolean} True when the event was consumed by navigation
     */
    public handleNavigationKey(event: KeyboardEvent): boolean {
        if (!this.parent.enableNavigation) {
            return false;
        }
        const key: string = event.key;
        switch (key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
                this.parent.nextSlide();
                return true;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                this.parent.previousSlide();
                return true;
            case 'Home':
                this.parent.firstSlide();
                return true;
            case 'End':
                this.parent.lastSlide();
                return true;
            default:
                return false;
        }
    }

    /**
     * Navigates the host to a 0-based slide index (feature gate).
     *
     * Delegates to the host `goToSlide` single source of truth. No-op while
     * the feature is disabled.
     *
     * @param {number} index - Target slide index
     * @returns {void}
     */
    public goToSlide(index: number): void {
        if (!this.parent.enableNavigation) {
            return;
        }
        this.parent.goToSlide(index);
    }

    /**
     * Tears down the navigation feature. Idempotent.
     *
     * Called by `ModuleLoader.clean()` on `refresh()` and component destroy,
     * and by the editor when `enableNavigation` flips to `false`.
     *
     * @returns {void}
     */
    public destroy(): void {
        // No DOM or listener state is owned by this module; the host owns the
        // key bindings. Kept for the ModuleLoader.clean() contract.
    }
}