/**
 * Editor ribbon module (shell + File + Home tabs).
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon
 */

import {
    Ribbon,
    RibbonButton,
    RibbonComboBox,
    RibbonDropDown,
    RibbonFileMenu,
    RibbonLayout,
    RibbonItemType,
    RibbonItemSize,
    RibbonTabModel,
    RibbonGroupModel,
    RibbonItemModel,
    RibbonCollectionModel
} from '@syncfusion/ej2-ribbon';
import { initializeCSPTemplate } from '@syncfusion/ej2-base';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { SelectionFontState } from '../semantic/semantic-clipboard';
import { buildFileMenu, buildFileMenuItems } from './file-tab';
import { buildHomeTab, isMobileViewport } from './home-tab';
import { buildSlideshowTab } from './slideshow-tab';
import { buildViewTab } from './view-tab';
import { SplitButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import {
    RibbonGroupInfo,
    RibbonHost,
    RibbonItemId,
    RibbonItemInfo,
    RibbonLayoutMode,
    RibbonTabInfo
} from './types';
import { localize } from '../localization/localization';

/** Accept attribute for the Open from Device file picker. */
const PPTX_FILE_ACCEPT: string =
  '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation';

/** Minimal EJ2 instance shape used when clearing orphaned host chrome. */
interface Ej2InstanceLike {
    isDestroyed?: boolean;
    destroy?: () => void;
    value?: string | null;
    text?: string | null;
    dataBind?: () => void;
    dataSource?: string[];
    resizeHandler?: (() => void) | null;
    boundResizeHandler?: (() => void) | null;
}

/**
 * Manages the EJ2 Ribbon instance for the PowerPoint Editor.
 *
 * Mounts into `.ej2-pptx-ribbon`, builds five tabs (File, Home, Slide Show,
 * View, Help), and exposes thin customization wrappers over EJ2 APIs.
 * @constructor
 */
export class EditorRibbon {
    private readonly host: RibbonHost;
    private container: HTMLElement | null = null;
    private ribbon: Ribbon | null = null;
    private fileInput: HTMLInputElement | null = null;
    private presentButton: SplitButton | null = null;
    private destroyed: boolean = false;
    /** Whether the current item models were built for a phone-sized viewport. */
    private builtForMobile: boolean = false;
    /** Combo boxes created for the current build, so their window resize handlers can be released. */
    private comboInstances: Ej2InstanceLike[] = [];
    /** Tab to select on the next build (kept when the ribbon is rebuilt on a breakpoint change). */
    private pendingTabIndex: number = 0;
    /** Keeps the slide text selection alive when a ribbon layout-switcher button is pressed. */
    private readonly onSwitcherPointerDownBound: (event: Event) => void = (event: Event): void => {
        const target: Element | null = event.target instanceof Element ? event.target : null;
        const onSwitcher: boolean = !!target && !!target.closest('.e-ribbon-collapse-btn, .e-ribbon-expand-btn');
        if (onSwitcher && (this.builtForMobile || isMobileViewport())) {
            // A focusable button takes focus on mousedown, which clears the document selection.
            // Cancelling the default keeps the selection (and its handles); `click` still fires.
            event.preventDefault();
        }
    };
    /** Phone-breakpoint media query; its changes rebuild the ribbon without a page reload. */
    private mobileQuery: MediaQueryList | null = null;
    private readonly onMobileQueryChangeBound: () => void = (): void => {
        this.onViewportBreakpointChanged();
    };

    /** Last applied Copy / Font group state, to skip redundant DOM updates. */
    private selectionSignature: string = '';
    private readonly onFileInputChangeBound: () => void = (): void => {
        this.onFileInputChange();
    };

    /**
     * Creates a editor ribbon bound to a host.
     *
     * @param {RibbonHost} host - Editor host implementing download/print/open
     */
    public constructor(host: RibbonHost) {
        this.host = host;
    }

    /**
     * Initializes the EJ2 Ribbon into the host element.
     *
     * @param {HTMLElement} container - `.ej2-pptx-ribbon` element
     * @returns {void}
     */
    public initialize(container: HTMLElement): void {
        if (this.destroyed) {
            return;
        }
        this.container = container;
        this.container.removeEventListener('mousedown', this.onSwitcherPointerDownBound, true);
        this.container.addEventListener('mousedown', this.onSwitcherPointerDownBound, true);
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Presentation ribbon');

        // Class-field define after EJ2 `super()` can wipe `ribbonModule` while the
        // first Ribbon DOM remains. Clear any prior ribbon chrome before append so
        // recoverAfterSuper / StrictMode remount never stacks a second ribbon.
        this.teardownHostRibbon(container);
        this.selectionSignature = '';

        this.ensureFileInput();

        Ribbon.Inject(RibbonButton, RibbonComboBox, RibbonDropDown, RibbonFileMenu);

        this.builtForMobile = isMobileViewport();
        const tabs: RibbonTabModel[] = [
            buildHomeTab(this.host),
            buildSlideshowTab(this.host),
            buildViewTab(this.host)
        ];

        this.trackComboBoxes(tabs);
        const layout: RibbonLayout = this.resolveEj2Layout(this.host.ribbonLayout);

        this.ribbon = new Ribbon({
            activeLayout: layout,
            cssClass: 'ej2-pptx-ribbon-control',
            enableRtl: !!this.host.enableRtl,
            width: '100%',
            selectedTab: this.pendingTabIndex,
            fileMenu: buildFileMenu(this.host, {
                openDevice: (): void => {
                    this.invokeOpenDevice();
                }
            }),
            // The ribbon's own layout switcher flips `activeLayout` without telling the editor.
            ribbonLayoutSwitched: (args: { activeLayout?: string }): void => {
                this.onRibbonLayoutSwitched(args && args.activeLayout);
            },
            helpPaneTemplate: initializeCSPTemplate(function (this: EditorRibbon): HTMLElement[] {
                return [this.buildPresentButton()];
            }, this),
            tabs
        });
        this.ribbon.appendTo(container);
        this.syncHelpPaneWidth();
        this.watchViewportBreakpoint();
        // EJ2 only paints groups for the initial selected tab. Pre-create every
        // tab's groups so Slide Show / View / Help match File / Home on first open.
        this.materializeAllTabGroups();
    }

    /**
     * Applies RTL to the EJ2 Ribbon and the Present split button.
     *
     * @param {boolean} rtl - Whether to render right-to-left
     * @returns {void}
     */
    public setRtl(rtl: boolean): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.ribbon.enableRtl = rtl;
        this.ribbon.dataBind();
        if (this.presentButton && !this.presentButton.isDestroyed) {
            this.presentButton.enableRtl = rtl;
            this.presentButton.dataBind();
        }
    }

    /**
     * Refreshes enable state, layout, and Info labels from the host.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.refreshLayout();
        this.refreshActionState();
        this.refreshInfo();
    }

    /**
     * Applies host gates to Home, Slide Show, and View action items and
     * re-syncs the File menu and layout switcher.
     *
     * Updates item models first, then asks EJ2 to sync the live control. EJ2
     * enable/disable looks up DOM targets; under incomplete layout those calls
     * can throw — model state remains authoritative for subsequent reads.
     *
     * @returns {void}
     */
    public refreshActionState(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.syncFileMenu();

        this.applySelectionState();

        const slideShowModuleMissing: boolean = this.host.hasSlideShowModule === false;
        const startSlideShowDisabled: boolean =
            this.host.canStartSlideShow !== true || slideShowModuleMissing;
        this.setItemDisabled(RibbonItemId.StartFromBeginning, startSlideShowDisabled);
        this.safeEnableDisableItem(RibbonItemId.StartFromBeginning, startSlideShowDisabled);
        this.setItemDisabled(RibbonItemId.StartFromCurrent, startSlideShowDisabled);
        this.safeEnableDisableItem(RibbonItemId.StartFromCurrent, startSlideShowDisabled);

        // View → Zoom: inert without the injectable Magnification module.
        const magnificationModuleMissing: boolean = this.host.hasMagnificationModule === false;
        const zoomIds: string[] = [RibbonItemId.ZoomDropdown, RibbonItemId.FitWindow];
        for (let i: number = 0; i < zoomIds.length; i++) {
            this.setItemDisabled(zoomIds[i], magnificationModuleMissing);
            this.safeEnableDisableItem(zoomIds[i], magnificationModuleMissing);
        }

        this.syncFitWindowPressed(magnificationModuleMissing);
        this.syncPresentButton();

        // View → Show: Notes / Thumbnails toggles track host visibility.
        this.syncShowThumbnailsItem();
        this.syncShowNotesItem();
    }

    /**
     * Re-syncs Home Copy enablement and the read-only Font group after the slide
     * text selection changed. Skips all DOM work when nothing visible changed.
     *
     * @returns {void}
     */
    public refreshSelectionState(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.applySelectionState();
    }

    /**
     * Copy is enabled only while slide text is selected (PowerPoint behaviour);
     * the Font group mirrors the selection formatting, PowerPoint-style.
     *
     * @returns {void}
     */
    private applySelectionState(): void {
        const font: SelectionFontState | undefined = typeof this.host.getSelectionFontState === 'function'
            ? this.host.getSelectionFontState() : undefined;
        const hasSelection: boolean = typeof this.host.getSelectionFontState === 'function'
            ? font !== undefined : this.host.hasSlideTextSelection !== false;
        const copyDisabled: boolean = this.host.enableCopy === false || !hasSelection;
        const signature: string = JSON.stringify([copyDisabled, font || null]);
        if (signature === this.selectionSignature) {
            return;
        }
        this.selectionSignature = signature;
        this.setItemDisabled(RibbonItemId.Copy, copyDisabled);
        this.safeEnableDisableItem(RibbonItemId.Copy, copyDisabled);
        this.syncFontGroup(font);
    }

    /**
     * Mirrors the selection formatting into the read-only Font group. Mixed font
     * name / size show blank; B / I / U / S are pressed only when every selected
     * run has the format.
     *
     * @param {SelectionFontState|undefined} font - Aggregated selection formatting
     * @returns {void}
     */
    private syncFontGroup(font: SelectionFontState | undefined): void {
        this.setFontCombo(RibbonItemId.FontFamily, font && font.family !== undefined ? font.family : '');
        this.setFontCombo(
            RibbonItemId.FontSize,
            font && font.sizePt !== undefined ? String(Math.round(font.sizePt * 100) / 100) : ''
        );
        this.setFontFormat(RibbonItemId.FontBold, !!font && font.bold);
        this.setFontFormat(RibbonItemId.FontItalic, !!font && font.italic);
        this.setFontFormat(RibbonItemId.FontUnderline, !!font && font.underline);
        this.setFontFormat(RibbonItemId.FontStrikethrough, !!font && font.strike);
    }

    private setFontCombo(itemId: string, value: string): void {
        const model: RibbonItemModel | null = this.findItemModel(itemId);
        if (model && model.comboBoxSettings) {
            model.comboBoxSettings.value = value;
        }
        const el: Element | null = this.container ? this.container.querySelector('#' + CSS.escape(itemId)) : null;
        const instances: Ej2InstanceLike[] | undefined = el
            ? (el as HTMLElement & { ej2_instances?: Ej2InstanceLike[] }).ej2_instances : undefined;
        const combo: Ej2InstanceLike | undefined = instances && instances[0];
        if (combo && !combo.isDestroyed) {
            // A ComboBox clears values missing from its list; authored fonts / sizes are open-ended.
            if (value !== '' && Array.isArray(combo.dataSource) && combo.dataSource.indexOf(value) < 0) {
                combo.dataSource = combo.dataSource.concat([value]);
            }
            combo.value = value === '' ? null : value;
            combo.text = value === '' ? null : value;
            if (typeof combo.dataBind === 'function') {
                combo.dataBind();
            }
        }
    }

    private setFontFormat(itemId: string, on: boolean): void {
        const model: RibbonItemModel | null = this.findItemModel(itemId);
        if (model && model.buttonSettings) {
            const base: string = (model.buttonSettings.cssClass || '')
                .replace(/\s*ej2-pptx-ribbon-format--on/g, '').trim();
            model.buttonSettings.cssClass = on ? base + ' ej2-pptx-ribbon-format--on' : base;
        }
        const el: Element | null = this.container ? this.container.querySelector('#' + CSS.escape(itemId)) : null;
        if (el) {
            el.classList.toggle('ej2-pptx-ribbon-format--on', on);
            el.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
    }

    /**
     * Marks the Fit to Window button as pressed while the slide is in fit-to-window
     * mode (the default); any zoom action clears it.
     *
     * @param {boolean} inert - True when the Magnification module is unavailable
     * @returns {void}
     */
    private syncFitWindowPressed(inert: boolean): void {
        if (!this.container) {
            return;
        }
        const active: boolean = !inert && this.host.isFitToWindowActive !== false;
        // Same mechanism as the Thumbnails toggle: the model carries `e-active`, so the
        // pressed look survives ribbon re-renders and matches the other toggles.
        const item: RibbonItemModel | null = this.findItemModel(RibbonItemId.FitWindow);
        if (this.ribbon && item && item.buttonSettings) {
            const wanted: string = active ? 'e-active' : '';
            if (item.buttonSettings.cssClass !== wanted) {
                item.buttonSettings.cssClass = wanted;
                if (typeof this.ribbon.updateItem === 'function') {
                    try {
                        this.ribbon.updateItem(item);
                    } catch {
                        // Model already updated; live control will catch up on next layout.
                    }
                }
            }
        }
        const el: Element | null = this.container.querySelector(
            '#' + CSS.escape(RibbonItemId.FitWindow)
        );
        if (el) {
            el.classList.toggle('pptx-ribbon-btn-active', active);
            el.setAttribute('aria-pressed', active ? 'true' : 'false');
        }
    }

    /**
     * Compatibility hook kept for host callers. The Info group was removed from
     * the File menu in the current design, so there is nothing to refresh.
     *
     * @returns {void}
     */
    public refreshInfo(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.syncFileMenu();
    }

    /**
     * Recomputes the ribbon's responsive group collapse after a host resize.
     *
     * @returns {void}
     */
    public refreshSize(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        this.syncHelpPaneWidth();
        if (typeof this.ribbon.refreshLayout === 'function') {
            this.ribbon.refreshLayout();
        }
    }

    /**
     * EJ2 measures the help pane (Present button) once, at creation, and reserves that width
     * from the tab row. When responsive CSS later shrinks the button (icon only on small
     * screens) the stale width leaves the tabs no room, so re-measure it.
     *
     * @returns {void}
     */
    private syncHelpPaneWidth(): void {
        if (!this.container) {
            return;
        }
        const help: HTMLElement | null = this.container.querySelector('.e-ribbon-help-template');
        const tabEl: HTMLElement | null = help ? help.parentElement : null;
        if (!help || !tabEl) {
            return;
        }
        // Hidden (display:none on small screens) reserves no width; otherwise use the measured one.
        const hidden: boolean = window.getComputedStyle(help).display === 'none';
        if (hidden || help.offsetWidth > 0) {
            tabEl.style.setProperty('--helpTemplateWidth', hidden ? '0px' : String(help.offsetWidth) + 'px');
        }
    }

    /**
     * Listens for the phone breakpoint so the ribbon follows window resizes, orientation changes
     * and the browser's device-mode toggle without a page reload. Registered once per ribbon.
     *
     * @returns {void}
     */
    private watchViewportBreakpoint(): void {
        if (this.mobileQuery || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }
        this.mobileQuery = window.matchMedia('(max-width: 767.98px)');
        if (typeof this.mobileQuery.addEventListener === 'function') {
            this.mobileQuery.addEventListener('change', this.onMobileQueryChangeBound);
        } else if (typeof this.mobileQuery.addListener === 'function') {
            this.mobileQuery.addListener(this.onMobileQueryChangeBound);
        }
    }

    private unwatchViewportBreakpoint(): void {
        if (!this.mobileQuery) {
            return;
        }
        if (typeof this.mobileQuery.removeEventListener === 'function') {
            this.mobileQuery.removeEventListener('change', this.onMobileQueryChangeBound);
        } else if (typeof this.mobileQuery.removeListener === 'function') {
            this.mobileQuery.removeListener(this.onMobileQueryChangeBound);
        }
        this.mobileQuery = null;
    }

    /**
     * The viewport crossed the phone breakpoint: item sizes, labels and group overflow are chosen
     * when the ribbon is built, so rebuild it for the new class of device, keeping the open tab.
     *
     * @returns {void}
     */
    private onViewportBreakpointChanged(): void {
        if (this.destroyed || !this.container || !this.ribbon || this.builtForMobile === isMobileViewport()) {
            return;
        }
        this.rebuildKeepingTab(this.container);
    }

    /**
     * Rebuilds the ribbon for the current device class / layout and re-selects the tab that was
     * open, so a layout or breakpoint switch never drops the user back to Home. Falls back to the
     * first tab only when the previous index does not exist in the rebuilt ribbon.
     *
     * @param {HTMLElement} container - `.ej2-pptx-ribbon` host
     * @returns {void}
     */
    private rebuildKeepingTab(container: HTMLElement): void {
        const current: number = this.ribbon && typeof this.ribbon.selectedTab === 'number' ? this.ribbon.selectedTab : 0;
        this.pendingTabIndex = current;
        try {
            this.initialize(container);
        } finally {
            this.pendingTabIndex = 0;
        }
        const count: number = this.ribbon && this.ribbon.tabs ? this.ribbon.tabs.length : 0;
        if (this.ribbon && count > 0 && this.ribbon.selectedTab !== (current < count ? current : 0)) {
            this.ribbon.selectedTab = current < count ? current : 0;
        }
        this.refreshActionState();
    }

    /**
     * Handles the ribbon's built-in layout switcher. On phones the item models differ per layout
     * (icon-only vs labelled), so the ribbon is rebuilt for the layout the user picked. Desktop
     * keeps EJ2's in-place switch untouched.
     *
     * @param {string|undefined} activeLayout - Layout EJ2 switched to
     * @returns {void}
     */
    private onRibbonLayoutSwitched(activeLayout: string | undefined): void {
        if (this.destroyed || !this.container || !(this.builtForMobile || isMobileViewport())) {
            return;
        }
        const container: HTMLElement = this.container;
        this.host.ribbonLayout = activeLayout === 'Classic' ? 'Classic' : 'Simplified';
        // Rebuild after EJ2 finishes its own switch; destroying the ribbon inside its event is unsafe.
        window.setTimeout((): void => {
            if (this.destroyed || this.container !== container) {
                return;
            }
            this.rebuildKeepingTab(container);
        }, 0);
    }

    /**
     * Syncs EJ2 `activeLayout` from host `ribbonLayout`.
     *
     * @returns {void}
     */
    public refreshLayout(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        const layout: RibbonLayout = this.resolveEj2Layout(this.host.ribbonLayout);
        if (this.ribbon.activeLayout !== layout && this.container && (this.builtForMobile || isMobileViewport())) {
            // Phone builds choose icon-only (Simplified) or labelled (Classic) item models up front.
            // Rebuild when the models came from a phone build (even if the screen is now wider) or
            // the screen is phone-sized now; otherwise stale icon-only items would show in Classic.
            this.rebuildKeepingTab(this.container);
            return;
        }
        if (this.ribbon.activeLayout !== layout) {
            this.ribbon.activeLayout = layout;
            this.ribbon.dataBind();
            if (typeof this.ribbon.refreshLayout === 'function') {
                this.ribbon.refreshLayout();
            }
        }
    }

    /**
     * Returns the underlying EJ2 Ribbon instance (for tests).
     *
     * @returns {Ribbon|null} Ribbon instance or null
     */
    public getRibbonInstance(): Ribbon | null {
        return this.ribbon;
    }

    /**
     * Returns built-in tab models currently configured (for tests).
     *
     * @returns {RibbonTabModel[]} Tab models or empty array
     */
    public getTabs(): RibbonTabModel[] {
        if (!this.ribbon || !this.ribbon.tabs) {
            return [];
        }
        return this.ribbon.tabs;
    }

    // —— Customization API (thin wrappers) ————————————————————————————————

    /**
     * Shows a ribbon tab by id.
     *
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public showTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.showTab(tabId);
        }
    }

    /**
     * Hides a ribbon tab by id.
     *
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public hideTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.hideTab(tabId);
        }
    }

    /**
     * Enables a ribbon tab by id.
     *
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public enableTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.enableTab(tabId);
        }
    }

    /**
     * Disables a ribbon tab by id.
     *
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public disableTab(tabId: string): void {
        if (this.ribbon) {
            this.ribbon.disableTab(tabId);
        }
    }

    /**
     * Adds a tab from a public {@link RibbonTabInfo} descriptor.
     *
     * @param {RibbonTabInfo} tab - Tab info
     * @param {string} targetId - Optional existing tab id to insert before
     * @returns {void}
     */
    public addTab(tab: RibbonTabInfo, targetId?: string): void {
        if (!this.ribbon) {
            return;
        }
        const model: RibbonTabModel = this.toTabModel(tab);
        if (typeof targetId === 'string' && targetId.length > 0) {
            this.ribbon.addTab(model, targetId);
        } else {
            this.ribbon.addTab(model);
        }
        if (tab.visible === false) {
            this.ribbon.hideTab(tab.id);
        }
    }

    /**
     * Shows a group by id.
     *
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public showGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.showGroup(groupId);
        }
    }

    /**
     * Hides a group by id.
     *
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public hideGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.hideGroup(groupId);
        }
    }

    /**
     * Enables a group by id.
     *
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public enableGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.enableGroup(groupId);
        }
    }

    /**
     * Disables a group by id.
     *
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public disableGroup(groupId: string): void {
        if (this.ribbon) {
            this.ribbon.disableGroup(groupId);
        }
    }

    /**
     * Adds a group to a tab.
     *
     * @param {string} tabId - Target tab id
     * @param {RibbonGroupInfo} group - Group info
     * @param {string} targetId - Optional existing group id to insert before
     * @returns {void}
     */
    public addGroup(tabId: string, group: RibbonGroupInfo, targetId?: string): void {
        if (!this.ribbon) {
            return;
        }
        const model: RibbonGroupModel = this.toGroupModel(group);
        if (typeof targetId === 'string' && targetId.length > 0) {
            this.ribbon.addGroup(tabId, model, targetId);
        } else {
            this.ribbon.addGroup(tabId, model);
        }
        if (group.visible === false) {
            this.ribbon.hideGroup(group.id);
        }
    }

    /**
     * Shows an item by id.
     *
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public showItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.showItem(itemId);
        }
    }

    /**
     * Hides an item by id.
     *
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public hideItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.hideItem(itemId);
        }
    }

    /**
     * Enables an item by id.
     *
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public enableItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.enableItem(itemId);
        }
    }

    /**
     * Disables an item by id.
     *
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public disableItem(itemId: string): void {
        if (this.ribbon) {
            this.ribbon.disableItem(itemId);
        }
    }

    /**
     * Adds an item to a group (primary collection).
     *
     * @param {string} groupId - Target group id
     * @param {RibbonItemInfo} item - Item info
     * @param {string} targetId - Optional existing item id to insert before
     * @returns {void}
     */
    public addItem(groupId: string, item: RibbonItemInfo, targetId?: string): void {
        if (!this.ribbon) {
            return;
        }
        // EJ2 addItem targets a collection id. Locate the first collection under the group.
        const collectionId: string | null = this.findFirstCollectionId(groupId);
        if (!collectionId) {
            return;
        }
        const model: RibbonItemModel = this.toItemModel(item);
        if (typeof targetId === 'string' && targetId.length > 0) {
            this.ribbon.addItem(collectionId, model, targetId);
        } else {
            this.ribbon.addItem(collectionId, model);
        }
        if (item.visible === false) {
            this.ribbon.hideItem(item.id);
        }
        if (item.disabled === true) {
            this.ribbon.disableItem(item.id);
        }
    }

    /**
     * Destroys the EJ2 Ribbon and releases helpers.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.unwatchViewportBreakpoint();

        if (this.container) {
            this.container.removeEventListener('mousedown', this.onSwitcherPointerDownBound, true);
            this.teardownHostRibbon(this.container);
            this.container = null;
        } else if (this.ribbon) {
            if (!this.ribbon.isDestroyed) {
                this.ribbon.destroy();
            }
            this.ribbon = null;
        }

        this.fileInput = null;
    }

    // —— Private helpers ————————————————————————————————————————————————

    /**
     * Forces EJ2 to create group DOM for every tab (lazy path only paints the
     * selected tab). Restores the original selected index afterward.
     *
     * @returns {void}
     */
    private materializeAllTabGroups(): void {
        if (!this.ribbon || this.destroyed) {
            return;
        }
        const tabs: RibbonTabModel[] = this.ribbon.tabs;
        if (!tabs || tabs.length === 0) {
            return;
        }
        const host: HTMLElement | null = this.ribbon.element;
        const originalIndex: number =
      typeof this.ribbon.selectedTab === 'number' ? this.ribbon.selectedTab : 0;
        for (let i: number = 0; i < tabs.length; i++) {
            if (i === originalIndex) {
                continue;
            }
            this.ribbon.selectedTab = i;
            this.ribbon.dataBind();
            // Property change may not fire ribbonTabSelected in all hosts; click the
            // toolbar header so createGroups runs when content is still empty.
            const tabId: string | undefined = tabs[i].id;
            const groupsLength: number = (tabs[i].groups && tabs[i].groups.length) || 0;
            if (host && tabId && groupsLength > 0) {
                const content: Element | null = host.querySelector(
                    '#' + CSS.escape(tabId) + '_content'
                );
                if (content && !content.querySelector('.e-ribbon-group')) {
                    const header: Element | null = host.querySelector(
                        '.e-toolbar-item[data-id="' + CSS.escape(tabId) + '"]'
                    );
                    if (header instanceof HTMLElement) {
                        header.click();
                    }
                }
            }
        }
        if (this.ribbon.selectedTab !== originalIndex) {
            this.ribbon.selectedTab = originalIndex;
            this.ribbon.dataBind();
        }
    }

    /**
     * Maps public layout mode to EJ2 RibbonLayout.
     *
     * @param {RibbonLayoutMode|string|undefined} mode - Public layout string
     * @returns {RibbonLayout} EJ2 layout enum value
     */
    private resolveEj2Layout(mode: RibbonLayoutMode | string | undefined): RibbonLayout {
        if (mode === 'Classic' || mode === RibbonLayout.Classic) {
            return RibbonLayout.Classic;
        }
        return RibbonLayout.Simplified;
    }

    /**
     * Destroys any EJ2 instances under the ribbon host and resets the host DOM.
     *
     * Used before mount and on destroy so a second initialize cannot leave two
     * full ribbon chrome rows (e.g. after class-field wipe + recoverAfterSuper).
     * EJ2 `appendTo` on a host that still carries `.e-ribbon` / prior tab DOM
     * stacks a second chrome row instead of replacing the first.
     *
     * @param {HTMLElement} host - `.ej2-pptx-ribbon` element
     * @returns {void}
     */
    private teardownHostRibbon(host: HTMLElement): void {
        this.releaseWindowResizeHandlers(host);
        if (this.ribbon && !this.ribbon.isDestroyed) {
            try {
                this.ribbon.destroy();
            } catch {
                // Continue host reset even if EJ2 destroy throws in incomplete layout.
            }
        }
        this.ribbon = null;
        if (this.presentButton && !this.presentButton.isDestroyed) {
            this.presentButton.destroy();
        }
        this.presentButton = null;

        if (this.fileInput) {
            this.fileInput.removeEventListener('change', this.onFileInputChangeBound);
            this.fileInput = null;
        }

        this.destroyEj2InstancesIn(host);
        this.resetRibbonHostElement(host);
    }

    /**
     * Detaches the `window` resize listener EJ2 left on a drop-down (`resizeHandler`) or on a
     * readonly combo box (`boundResizeHandler`, only removed by EJ2 for non-readonly boxes).
     *
     * @param {Ej2InstanceLike|undefined} instance - EJ2 control
     * @returns {void}
     */
    private removeResizeHandler(instance: Ej2InstanceLike | undefined): void {
        if (!instance) {
            return;
        }
        if (typeof instance.resizeHandler === 'function') {
            window.removeEventListener('resize', instance.resizeHandler);
        }
        if (typeof instance.boundResizeHandler === 'function') {
            window.removeEventListener('resize', instance.boundResizeHandler);
            instance.boundResizeHandler = null;
        }
    }

    /**
     * Remembers every combo box the ribbon creates (including the ones that live in the closed
     * overflow popup, which is not in the DOM) via its `created` callback.
     *
     * @param {RibbonTabModel[]} tabs - Tab models about to be handed to the ribbon
     * @returns {void}
     */
    private trackComboBoxes(tabs: RibbonTabModel[]): void {
        const instances: Ej2InstanceLike[] = this.comboInstances;
        for (const tab of tabs) {
            for (const group of tab.groups || []) {
                for (const collection of group.collections || []) {
                    for (const item of collection.items || []) {
                        const settings: { created?: (this: Ej2InstanceLike) => void } | undefined = item.comboBoxSettings;
                        if (!settings) {
                            continue;
                        }
                        const original: ((this: Ej2InstanceLike) => void) | undefined = settings.created;
                        settings.created = function (this: Ej2InstanceLike): void {
                            instances.push(this);
                            if (original) {
                                original.call(this);
                            }
                        };
                    }
                }
            }
        }
    }

    /**
     * EJ2 drop-down / combo box controls register a `window` resize handler and do not always
     * remove it on destroy. A destroyed control then throws on every later resize, and every
     * ribbon rebuild would leak more of them, so detach them before the controls are destroyed.
     *
     * @param {HTMLElement} root - Ribbon host that is about to be torn down
     * @returns {void}
     */
    private releaseWindowResizeHandlers(root: HTMLElement): void {
        for (const combo of this.comboInstances) {
            this.removeResizeHandler(combo);
        }
        this.comboInstances = [];
        const nodes: Element[] = Array.from(root.querySelectorAll('*'));
        nodes.push(root);
        // Overflow popups are attached to <body>, outside the host; reach the ribbon's own controls by id.
        const doc: Document = root.ownerDocument;
        Array.prototype.push.apply(nodes, Array.from(doc.querySelectorAll('[id^="pptx-ribbon-"]')));
        for (const node of nodes) {
            const instances: Ej2InstanceLike[] | undefined =
                (node as HTMLElement & { 'ej2_instances'?: Ej2InstanceLike[] })['ej2_instances'];
            if (!instances) {
                continue;
            }
            for (const instance of instances) {
                this.removeResizeHandler(instance);
            }
        }
    }

    /**
     * Destroys EJ2 components registered on the host or its descendants.
     *
     * Walks deepest nodes first so child controls are torn down before parents.
     *
     * @param {HTMLElement} root - Host element that may still hold orphaned ribbon chrome
     * @returns {void}
     */
    private destroyEj2InstancesIn(root: HTMLElement): void {
        const nodes: Element[] = Array.from(root.querySelectorAll('*'));
        nodes.push(root);
        // Destroy from deepest child to root so parent destroy does not skip kids.
        for (let i: number = nodes.length - 1; i >= 0; i--) {
            const node: Element = nodes[i];
            const typed: HTMLElement & { 'ej2_instances'?: Ej2InstanceLike[] } =
                node as HTMLElement & { 'ej2_instances'?: Ej2InstanceLike[] };
            const instances: Ej2InstanceLike[] | undefined = typed['ej2_instances'];
            if (!instances || instances.length === 0) {
                continue;
            }
            // Copy: destroy mutates the live ej2_instances array.
            for (const instance of instances.slice()) {
                if (
                    instance &&
          instance.isDestroyed !== true &&
          typeof instance.destroy === 'function'
                ) {
                    try {
                        instance.destroy();
                    } catch {
                        // Best-effort cleanup of orphaned chrome; continue clearing host.
                    }
                }
            }
            try {
                delete typed['ej2_instances'];
            } catch {
                typed['ej2_instances'] = [];
            }
        }
    }

    /**
     * Empties ribbon host markup and strips leftover EJ2 control classes.
     *
     * @param {HTMLElement} host - `.ej2-pptx-ribbon` element
     * @returns {void}
     */
    private resetRibbonHostElement(host: HTMLElement): void {
        host.innerHTML = '';
        // Keep only the editor host marker; EJ2 re-adds control classes on appendTo.
        // Leaving `.e-ribbon` / `.e-control` on the host makes a later appendTo stack
        // a second tab + command row (dual ribbon chrome).
        const preserved: string[] = [];
        const classNames: string[] = host.className.split(/\s+/);
        for (let i: number = 0; i < classNames.length; i++) {
            const className: string = classNames[i];
            if (!className) {
                continue;
            }
            if (className === 'ej2-pptx-ribbon' || className.indexOf('ej2-pptx-') === 0) {
                if (className !== 'ej2-pptx-ribbon-control') {
                    preserved.push(className);
                }
                continue;
            }
            // Drop EJ2 runtime classes (e-control, e-ribbon, e-lib, e-rbn, …).
            if (className.charAt(0) === 'e' && (className.length === 1 || className.charAt(1) === '-')) {
                continue;
            }
            preserved.push(className);
        }
        if (preserved.indexOf('ej2-pptx-ribbon') < 0) {
            preserved.unshift('ej2-pptx-ribbon');
        }
        host.className = preserved.join(' ');
        host.removeAttribute('style');
        host.removeAttribute('tabindex');
    }

    /**
     * Ensures a hidden file input exists for Open from Device.
     *
     * @returns {void}
     */
    private ensureFileInput(): void {
        if (this.fileInput || !this.container) {
            return;
        }
        const existing: HTMLInputElement | null = this.container.querySelector(
            'input.ej2-pptx-ribbon-file-input'
        );
        if (existing) {
            existing.addEventListener('change', this.onFileInputChangeBound);
            this.fileInput = existing;
            return;
        }
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = PPTX_FILE_ACCEPT;
        input.className = 'ej2-pptx-ribbon-file-input';
        input.setAttribute('aria-hidden', 'true');
        input.tabIndex = -1;
        input.style.position = 'absolute';
        input.style.width = '1px';
        input.style.height = '1px';
        input.style.opacity = '0';
        input.style.overflow = 'hidden';
        input.style.pointerEvents = 'none';
        input.addEventListener('change', this.onFileInputChangeBound);
        this.container.appendChild(input);
        this.fileInput = input;
    }

    /**
     * Handles file input change for Open from Device.
     *
     * @returns {void}
     */
    private onFileInputChange(): void {
        if (!this.fileInput || !this.fileInput.files || this.fileInput.files.length === 0) {
            return;
        }
        const file: File | null = this.fileInput.files.item(0);
        // Reset so the same file can be re-selected later.
        this.fileInput.value = '';
        if (file) {
            this.host.openFromFile(file);
        }
    }

    /**
     * Triggers the device file picker.
     *
     * @returns {void}
     */
    private invokeOpenDevice(): void {
        this.ensureFileInput();
        if (this.fileInput) {
            this.fileInput.click();
        }
    }

    /**
     * Re-applies host gates to the File menu entries (Export / Print).
     *
     * @returns {void}
     */
    private syncFileMenu(): void {
        if (!this.ribbon) {
            return;
        }
        const items: MenuItemModel[] = buildFileMenuItems(this.host);
        try {
            this.ribbon.fileMenu.menuItems = items;
            this.ribbon.dataBind();
        } catch {
            // Incomplete ribbon DOM (unit tests / early property thrash).
        }
    }

    /**
     * Syncs a toggle button's pressed state and tooltip.
     *
     * @param {string} itemId - Item id
     * @param {boolean} pressed - Pressed state
     * @param {string} tooltip - Tooltip text
     * @returns {void}
     */
    private syncToggleItem(itemId: string, pressed: boolean, tooltip: string): void {
        const item: RibbonItemModel | null = this.findItemModel(itemId);
        if (!this.ribbon || !item || !item.buttonSettings) {
            return;
        }
        item.buttonSettings.cssClass = pressed ? 'e-active' : '';
        if (item.ribbonTooltipSettings) {
            item.ribbonTooltipSettings.title = tooltip;
        }
        if (typeof this.ribbon.updateItem === 'function') {
            try {
                this.ribbon.updateItem(item);
            } catch {
                // Model already updated; live control will catch up on next layout.
            }
        }
    }

    /**
     * Syncs the View → Show → Thumbnails toggle with host visibility.
     *
     * @returns {void}
     */
    private syncShowThumbnailsItem(): void {
        // Inert without the injectable ThumbnailView module — the panel can never mount.
        const missing: boolean = this.host.hasThumbnailModule === false;
        this.setItemDisabled(RibbonItemId.ShowThumbnails, missing);
        this.safeEnableDisableItem(RibbonItemId.ShowThumbnails, missing);
        if (missing) {
            return;
        }
        const visible: boolean =
            typeof this.host.isThumbnailPanelVisible === 'function'
                ? this.host.isThumbnailPanelVisible() === true
                : true;
        this.syncToggleItem(
            RibbonItemId.ShowThumbnails,
            visible,
            localize(this.host.locale, visible ? 'HideThumbnails' : 'ShowThumbnails')
        );
    }

    /**
     * Syncs the View → Show → Notes toggle with host visibility.
     *
     * @returns {void}
     */
    private syncShowNotesItem(): void {
        const visible: boolean = this.host.notesPaneVisible === true;
        this.syncToggleItem(RibbonItemId.ShowNotes, visible, localize(this.host.locale, visible ? 'HideNotes' : 'ShowNotes'));
    }

    /**
     * Builds the "Present" split button shown at the right of the tab row
     * (EJ2 Ribbon help pane): From Beginning / From Current Slide / Presenter View.
     *
     * @returns {HTMLElement} Wrapper element containing the Present button
     */
    private buildPresentButton(): HTMLElement {
        // EJ2 SplitButton inserts its wrapper before the element, so the button
        // must already have a parent when `appendTo` runs.
        const wrapper: HTMLElement = document.createElement('span');
        wrapper.className = 'ej2-pptx-ribbon-present-host';
        const hostEl: HTMLButtonElement = document.createElement('button');
        wrapper.appendChild(hostEl);
        hostEl.setAttribute('type', 'button');
        hostEl.className = 'ej2-pptx-ribbon-present';
        hostEl.setAttribute('aria-label', localize(this.host.locale, 'Present'));
        const items: ItemModel[] = [
            { id: 'from-beginning', text: localize(this.host.locale, 'FromBeginning'), iconCss: 'e-icons e-ribbon-icon-pptx pptx-icon-play' },
            { id: 'from-current', text: localize(this.host.locale, 'FromCurrentSlide'), iconCss: 'e-icons e-ribbon-icon-pptx pptx-icon-play-current' },
            { id: 'presenter', text: localize(this.host.locale, 'PresenterView'), iconCss: 'e-icons e-ribbon-icon-pptx pptx-icon-presenter' }
        ];
        const run: (id: string) => void = (id: string): void => {
            if (id === 'from-beginning') {
                this.host.startSlideShowFromBeginning();
            } else if (id === 'from-current') {
                this.host.startSlideShowFromCurrent();
            } else if (id === 'presenter') {
                this.host.startPresenterView();
            }
        };
        const button: SplitButton = new SplitButton({
            content: localize(this.host.locale, 'Present'),
            iconCss: 'ej2-pptx-icon-present',
            cssClass: 'ej2-pptx-ribbon-present-btn',
            enableRtl: !!this.host.enableRtl,
            items,
            // Right-align the menu with the split button instead of its left edge.
            open: (args: { element?: HTMLElement }): void => {
                const popup: HTMLElement | undefined = args ? args.element : undefined;
                const anchor: HTMLElement | null = hostEl.parentElement;
                if (!popup || !anchor) {
                    return;
                }
                if (this.host.enableRtl) {
                    // Mirror: align the menu with the split button's left edge.
                    const rtlDelta: number = anchor.getBoundingClientRect().left - popup.getBoundingClientRect().left;
                    if (rtlDelta > 0) {
                        popup.style.left = (parseFloat(popup.style.left) || 0) + rtlDelta + 'px';
                    }
                    return;
                }
                const delta: number = popup.getBoundingClientRect().right - anchor.getBoundingClientRect().right;
                if (delta > 0) {
                    popup.style.left = (parseFloat(popup.style.left) || 0) - delta + 'px';
                }
            },
            click: (): void => {
                run('from-beginning');
            },
            select: (args: MenuEventArgs): void => {
                run(args && args.item && args.item.id ? args.item.id : '');
            }
        });
        button.appendTo(hostEl);
        this.presentButton = button;
        this.syncPresentButton();
        return wrapper;
    }

    /**
     * Applies slide-show availability to the Present split button.
     *
     * @returns {void}
     */
    private syncPresentButton(): void {
        if (!this.presentButton || this.presentButton.isDestroyed) {
            return;
        }
        this.presentButton.disabled =
            this.host.canStartSlideShow === false || this.host.hasSlideShowModule === false;
        this.presentButton.dataBind();
    }

    /**
     * Sets the `disabled` flag on a ribbon item model when present.
     *
     * @param {string} itemId - Item id
     * @param {boolean} disabled - Disabled state
     * @returns {void}
     */
    private setItemDisabled(itemId: string, disabled: boolean): void {
        const item: RibbonItemModel | null = this.findItemModel(itemId);
        if (item) {
            item.disabled = disabled;
        }
    }

    /**
     * Calls EJ2 enableItem/disableItem without letting DOM-lookup failures escape.
     *
     * @param {string} itemId - Item id
     * @param {boolean} disabled - When true, disable; otherwise enable
     * @returns {void}
     */
    private safeEnableDisableItem(itemId: string, disabled: boolean): void {
        if (!this.ribbon) {
            return;
        }
        try {
            if (disabled) {
                this.ribbon.disableItem(itemId);
            } else {
                this.ribbon.enableItem(itemId);
            }
        } catch {
            // Incomplete ribbon DOM (common in unit tests / early property thrash).
        }
    }

    /**
     * Locates an item model by id across all tabs.
     *
     * @param {string} itemId - Item id
     * @returns {RibbonItemModel|null} Item model or null
     */
    private findItemModel(itemId: string): RibbonItemModel | null {
        if (!this.ribbon || !this.ribbon.tabs) {
            return null;
        }
        const tabs: RibbonTabModel[] = this.ribbon.tabs;
        for (let t: number = 0; t < tabs.length; t++) {
            const groups: RibbonGroupModel[] | undefined = tabs[t].groups;
            if (!groups) {
                continue;
            }
            for (let g: number = 0; g < groups.length; g++) {
                const collections: RibbonCollectionModel[] | undefined =
          groups[g].collections;
                if (!collections) {
                    continue;
                }
                for (let c: number = 0; c < collections.length; c++) {
                    const items: RibbonItemModel[] | undefined = collections[c].items;
                    if (!items) {
                        continue;
                    }
                    for (let i: number = 0; i < items.length; i++) {
                        if (items[i].id === itemId) {
                            return items[i];
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Finds the first collection id under a group (for addItem).
     *
     * @param {string} groupId - Group id
     * @returns {string|null} Collection id or null
     */
    private findFirstCollectionId(groupId: string): string | null {
        if (!this.ribbon || !this.ribbon.tabs) {
            return null;
        }
        const tabs: RibbonTabModel[] = this.ribbon.tabs;
        for (let t: number = 0; t < tabs.length; t++) {
            const groups: RibbonGroupModel[] | undefined = tabs[t].groups;
            if (!groups) {
                continue;
            }
            for (let g: number = 0; g < groups.length; g++) {
                if (groups[g].id !== groupId) {
                    continue;
                }
                const collections: RibbonCollectionModel[] | undefined = groups[g].collections;
                if (!collections || collections.length === 0) {
                    return null;
                }
                const first: RibbonCollectionModel = collections[0];
                if (typeof first.id === 'string' && first.id.length > 0) {
                    return first.id;
                }
                // EJ2 may auto-assign ids; fall back to group id when collection id missing.
                return groupId;
            }
        }
        return null;
    }

    /**
     * Maps {@link RibbonTabInfo} to EJ2 tab model.
     *
     * @param {RibbonTabInfo} tab - Public tab info
     * @returns {RibbonTabModel} EJ2 tab model
     */
    private toTabModel(tab: RibbonTabInfo): RibbonTabModel {
        const groups: RibbonGroupModel[] = [];
        if (tab.groups) {
            for (let i: number = 0; i < tab.groups.length; i++) {
                groups.push(this.toGroupModel(tab.groups[i]));
            }
        }
        return {
            id: tab.id,
            header: tab.header || tab.id,
            groups
        };
    }

    /**
     * Maps {@link RibbonGroupInfo} to EJ2 group model.
     *
     * @param {RibbonGroupInfo} group - Public group info
     * @returns {RibbonGroupModel} EJ2 group model
     */
    private toGroupModel(group: RibbonGroupInfo): RibbonGroupModel {
        const items: RibbonItemModel[] = [];
        if (group.items) {
            for (let i: number = 0; i < group.items.length; i++) {
                items.push(this.toItemModel(group.items[i]));
            }
        }
        return {
            id: group.id,
            header: group.header || group.id,
            isCollapsible: true,
            collections: [
                {
                    items
                }
            ]
        };
    }

    /**
     * Maps {@link RibbonItemInfo} to EJ2 item model (button).
     *
     * @param {RibbonItemInfo} item - Public item info
     * @returns {RibbonItemModel} EJ2 item model
     */
    private toItemModel(item: RibbonItemInfo): RibbonItemModel {
        const clicked: (() => void) | undefined = item.clicked;
        return {
            id: item.id,
            type: RibbonItemType.Button,
            disabled: item.disabled === true,
            allowedSizes:
        RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
            buttonSettings: {
                content: item.text || item.id,
                iconCss: item.iconCss || '',
                clicked: (): void => {
                    if (typeof clicked === 'function') {
                        clicked();
                    }
                }
            },
            ribbonTooltipSettings: {
                title: item.tooltip || item.text || item.id
            }
        };
    }
}
