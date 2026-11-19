/**
 * Injectable Toolbar feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon
 *
 * Follows the Syncfusion injectable-module pattern: the application injects
 * the feature once per class, and every editor instance mounts it during
 * `render()`:
 *
 * ```typescript
 * import { PptxEditor, Toolbar } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(Toolbar); // inject the optional feature
 * const editor = new PptxEditor({ enableToolbar: true }, '#editor');
 * ```
 *
 * The editor ribbon (`EditorRibbon` chrome — File / Home / Insert / Slideshow /
 * View / Help tabs) is created only when this module is injected **and**
 * {@link PptxEditor.enableToolbar} is `true` (its default). When not
 * injected, the ribbon code is tree-shaken out of the application bundle and
 * the editor renders without the top chrome. When injected but disabled at
 * runtime, the ribbon DOM is absent and every toolbar API is a no-op.
 */

import { PptxEditor } from '../pptxeditor';
import { EditorRibbon } from './ribbon';
import { RibbonGroupInfo, RibbonItemInfo, RibbonTabInfo } from './types';

/**
 * Injectable module that owns the editor ribbon (toolbar) feature.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` declaration (`member: 'toolbar'`), instantiates this
 * class with the editor as its single constructor argument, and attaches the
 * instance to the editor as `toolbarModule`. `ModuleLoader.clean()` calls
 * {@link destroy} during `refresh()` and component destruction.
 *
 * @constructor
 */
export class Toolbar {
    /** Editor host that renders the ribbon feature. */
    private readonly parent: PptxEditor;
    /** Owned ribbon chrome (HTML + CSS only; never canvas). */
    private ribbon: EditorRibbon | null = null;
    /** Ribbon host element inside the editor shell. */
    private container: HTMLElement | null = null;

    /**
     * Creates the Toolbar module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
    }

    /**
     * Module name used by the EJ2 `ModuleLoader` for matching and validation.
     *
     * @returns {string} Module name `'toolbar'`
     */
    public getModuleName(): string {
        return 'toolbar';
    }

    /**
     * Mounts the ribbon DOM when the feature is enabled.
     *
     * Called by the editor after injection and after every `refresh()`. No-op
     * when {@link PptxEditor.enableToolbar} is `false`. When the shell host
     * already exists with prior ribbon chrome, `EditorRibbon.initialize` tears
     * the host chrome down first so only one ribbon is mounted.
     *
     * @param {HTMLElement} container - Shell `.ej2-pptx-ribbon` host
     * @returns {void}
     */
    public initialize(container: HTMLElement): void {
        if (!this.parent.enableToolbar) {
            return;
        }
        if (!this.container) {
            this.container = container;
        }
        if (!this.ribbon) {
            this.ribbon = new EditorRibbon(this.parent);
            this.ribbon.initialize(this.container);
        } else {
            this.ribbon.refresh();
        }
    }

    /**
     * Whether the module currently owns a mounted ribbon.
     *
     * @returns {boolean} True when the ribbon DOM is live
     */
    public isMounted(): boolean {
        return this.ribbon !== null;
    }

    /**
     * Applies the host `enableRtl` value to the mounted ribbon.
     *
     * @param {boolean} rtl - Whether the ribbon renders right-to-left
     * @returns {void}
     */
    public setRtl(rtl: boolean): void {
        if (this.ribbon) {
            this.ribbon.setRtl(rtl);
        }
    }

    /**
     * Re-renders the mounted ribbon after a source or property change.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (this.ribbon) {
            this.ribbon.refresh();
        }
    }

    /**
     * Refreshes tab/state info projected onto the ribbon items.
     *
     * @returns {void}
     */
    public refreshInfo(): void {
        if (this.ribbon) {
            this.ribbon.refreshInfo();
        }
    }

    /**
     * Refreshes enabled/disabled action state on the ribbon items.
     *
     * @returns {void}
     */
    public refreshActionState(): void {
        if (this.ribbon) {
            this.ribbon.refreshActionState();
        }
    }

    /**
     * Refreshes Home Copy enablement and the read-only Font group from the
     * current slide text selection.
     *
     * @returns {void}
     */
    public refreshSelectionState(): void {
        if (this.ribbon) {
            this.ribbon.refreshSelectionState();
        }
    }

    /**
     * Recomputes the ribbon's responsive group collapse after a host resize.
     *
     * @returns {void}
     */
    public refreshSize(): void {
        if (this.ribbon) {
            this.ribbon.refreshSize();
        }
    }

    /**
     * Refreshes responsive layout mode of the ribbon groups.
     *
     * @returns {void}
     */
    public refreshLayout(): void {
        if (this.ribbon) {
            this.ribbon.refreshLayout();
        }
    }

    /**
     * Activates a ribbon tab by its id.
     *
     * @param {string} tabId - Ribbon tab identifier
     * @returns {void}
     */
    public showTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.showTab(tabId);
        }
    }

    /**
     * Hides a ribbon tab by its id.
     *
     * @param {string} tabId - Ribbon tab identifier
     * @returns {void}
     */
    public hideTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.hideTab(tabId);
        }
    }

    /**
     * Enables a ribbon tab by its id.
     *
     * @param {string} tabId - Ribbon tab identifier
     * @returns {void}
     */
    public enableTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.enableTab(tabId);
        }
    }

    /**
     * Disables a ribbon tab by its id.
     *
     * @param {string} tabId - Ribbon tab identifier
     * @returns {void}
     */
    public disableTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.disableTab(tabId);
        }
    }

    /**
     * Inserts a new ribbon tab.
     *
     * @param {RibbonTabInfo} tab - Tab model to add
     * @param {string} targetId - Existing tab id the new tab precedes
     * @returns {void}
     */
    public addTab(tab: RibbonTabInfo, targetId?: string): void {
        if (this.ribbon) {
            this.ribbon.addTab(tab, targetId);
        }
    }

    /**
     * Makes a ribbon group visible.
     *
     * @param {string} groupId - Ribbon group identifier
     * @returns {void}
     */
    public showGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.showGroup(groupId);
        }
    }

    /**
     * Hides a ribbon group.
     *
     * @param {string} groupId - Ribbon group identifier
     * @returns {void}
     */
    public hideGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.hideGroup(groupId);
        }
    }

    /**
     * Enables a ribbon group.
     *
     * @param {string} groupId - Ribbon group identifier
     * @returns {void}
     */
    public enableGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.enableGroup(groupId);
        }
    }

    /**
     * Disables a ribbon group.
     *
     * @param {string} groupId - Ribbon group identifier
     * @returns {void}
     */
    public disableGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.disableGroup(groupId);
        }
    }

    /**
     * Inserts a new ribbon group into a tab.
     *
     * @param {string} tabId - Target ribbon tab id
     * @param {RibbonGroupInfo} group - Group model to add
     * @param {string} targetId - Existing group id the new group precedes
     * @returns {void}
     */
    public addGroup(tabId: string, group: RibbonGroupInfo, targetId?: string): void {
        if (this.ribbon) {
            this.ribbon.addGroup(tabId, group, targetId);
        }
    }

    /**
     * Makes a ribbon item visible.
     *
     * @param {string} itemId - Ribbon item identifier
     * @returns {void}
     */
    public showItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.showItem(itemId);
        }
    }

    /**
     * Hides a ribbon item.
     *
     * @param {string} itemId - Ribbon item identifier
     * @returns {void}
     */
    public hideItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.hideItem(itemId);
        }
    }

    /**
     * Enables a ribbon item.
     *
     * @param {string} itemId - Ribbon item identifier
     * @returns {void}
     */
    public enableItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.enableItem(itemId);
        }
    }

    /**
     * Disables a ribbon item.
     *
     * @param {string} itemId - Ribbon item identifier
     * @returns {void}
     */
    public disableItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.disableItem(itemId);
        }
    }

    /**
     * Inserts a new ribbon item into a group.
     *
     * @param {string} groupId - Target ribbon group id
     * @param {RibbonItemInfo} item - Item model to add
     * @param {string} targetId - Existing item id the new item precedes
     * @returns {void}
     */
    public addItem(groupId: string, item: RibbonItemInfo, targetId?: string): void {
        if (this.ribbon) {
            this.ribbon.addItem(groupId, item, targetId);
        }
    }

    /**
     * Tears down the ribbon DOM and listeners. Idempotent.
     *
     * Called by `ModuleLoader.clean()` on `refresh()` and component destroy,
     * and by the editor when `enableToolbar` flips to `false`.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.ribbon) {
            this.ribbon.destroy();
            this.ribbon = null;
        }
        this.container = null;
    }
}