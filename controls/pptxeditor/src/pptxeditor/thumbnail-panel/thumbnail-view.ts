/**
 * Injectable ThumbnailView feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/thumbnail-view
 *
 * Follows the Syncfusion injectable-module pattern: the application injects
 * the feature once per class, and every editor instance mounts it during
 * `render()`:
 *
 * ```typescript
 * import { PptxEditor, ThumbnailView } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(ThumbnailView); // inject the optional feature
 * const editor = new PptxEditor({ enableThumbnail: true }, '#editor');
 * ```
 *
 * The thumbnail panel DOM is created only when this module is injected **and**
 * {@link PptxEditor.enableThumbnail} is `true` (its default). When not
 * injected, the module code is tree-shaken out of the application bundle and
 * the editor main slide area takes the full width. When injected but disabled
 * at runtime, the panel DOM is absent and the ribbon thumbnail toggle is a
 * no-op.
 */

import { PptxEditor } from '../pptxeditor';
import { ThumbnailPanel } from './thumbnail-panel';

/**
 * Injectable module that owns the left thumbnail panel feature.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` declaration (`member: 'thumbnail'`), instantiates this
 * class with the editor as its single constructor argument, and attaches the
 * instance to the editor as `thumbnailViewModule`. `ModuleLoader.clean()`
 * calls {@link destroy} during `refresh()` and component destruction.
 *
 * @constructor
 */
export class ThumbnailView {
    /** Editor host that renders the thumbnail feature. */
    private readonly parent: PptxEditor;
    /** Owned thumbnail panel (never canvas; same HTML/CSS/SVG pipeline). */
    private panel: ThumbnailPanel | null = null;
    /** Panel host element inside the editor shell. */
    private container: HTMLElement | null = null;

    /**
     * Creates the ThumbnailView module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
    }

    /**
     * Module name used by the EJ2 `ModuleLoader` for matching and validation.
     *
     * @returns {string} Module name `'thumbnail'`
     */
    public getModuleName(): string {
        return 'thumbnail';
    }

    /**
     * Mounts the thumbnail panel DOM when the feature is enabled.
     *
     * Called by the editor after injection and after every `refresh()`. No-op
     * when {@link PptxEditor.enableThumbnail} is `false`.
     *
     * @param {HTMLElement} container - Shell `.ej2-pptx-slide-panel` host
     * @returns {void}
     */
    public initialize(container: HTMLElement): void {
        if (!this.parent.enableThumbnail) {
            return;
        }
        if (!this.container) {
            this.container = container;
        }
        if (!this.panel) {
            this.panel = new ThumbnailPanel(this.parent);
            this.panel.initialize(this.container);
        } else {
            this.panel.refresh();
        }
    }

    /**
     * Whether the module currently owns a mounted panel.
     *
     * @returns {boolean} True when the panel DOM is live
     */
    public isMounted(): boolean {
        return this.panel !== null;
    }

    /**
     * Pass-through refresh used after source geometry changes.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (this.panel) {
            this.panel.refresh();
        }
    }

    /**
     * Syncs active highlight and scroll when the host `slideIndex` changes.
     *
     * @returns {void}
     */
    public onSlideIndexChanged(): void {
        if (this.panel) {
            this.panel.onSlideIndexChanged();
        }
    }

    /**
     * Applies host visibility (expand/collapse) to the panel.
     *
     * @param {boolean} visible - True to expand
     * @returns {void}
     */
    public applyVisibilityFromHost(visible: boolean): void {
        if (this.panel) {
            this.panel.applyVisibilityFromHost(visible);
        }
    }

    /**
     * Applies a host width (clamped) to the panel.
     *
     * @param {number} widthPx - Width in CSS px
     * @returns {void}
     */
    public applyWidthFromHost(widthPx: number): void {
        if (this.panel) {
            this.panel.applyWidthFromHost(widthPx);
        }
    }

    /**
     * Re-evaluates the responsive default after the host element was resized.
     *
     * @returns {void}
     */
    public onHostResized(): void {
        if (this.panel) {
            this.panel.onHostResized();
        }
    }

    /**
     * Marks that the user explicitly toggled visibility.
     *
     * @returns {void}
     */
    public markUserVisibilityOverride(): void {
        if (this.panel) {
            this.panel.markUserVisibilityOverride();
        }
    }

    /**
     * Whether the owned panel is currently expanded.
     *
     * @returns {boolean} True when expanded
     */
    public isExpanded(): boolean {
        return this.panel ? this.panel.isExpanded() : false;
    }

    /**
     * Tears down the panel DOM and listeners. Idempotent.
     *
     * Called by `ModuleLoader.clean()` on `refresh()` and component destroy,
     * and by the editor when `enableThumbnail` flips to `false`.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.panel) {
            this.panel.destroy();
            this.panel = null;
        }
        this.container = null;
    }
}