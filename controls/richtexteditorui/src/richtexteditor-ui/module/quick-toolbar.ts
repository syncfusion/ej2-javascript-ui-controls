import { EventHandler, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { BaseQuickToolbar, QuickToolbarType } from '../../base/renderer/base-quick-toolbar';
import { QuickToolbarSettings } from '../model/quick-toolbar-settings';
import { QuickToolbarSettingsModel } from '../model/quick-toolbar-settings-model';
import { RichTextEditorUI } from '../richtexteditor-ui';
import { BaseModule } from './base-module';
import { ToolbarStatusUpdater } from '../../base/renderer/toolbar-status-updater';
import { ToolbarRenderer } from '../../base/renderer/toolbar-renderer';
import { EditorCore } from '../../core/base/editor-core';
import { FormattingState } from '../../common/services/formatting-state.service';
import * as classes from '../../base/classes';
import * as constant from '../../common/constant';

/** Coordinates the base quick-toolbar instances for each RTE context. */
export class QuickToolbarModule extends BaseModule {
    public quickToolbars: Record<QuickToolbarType, BaseQuickToolbar> = {
        Audio: undefined,
        Image: undefined,
        Inline: undefined,
        Link: undefined,
        Table: undefined,
        Text: undefined,
        Video: undefined
    };
    /** Per-type ToolbarStatusUpdater bound to each quick toolbar's renderer. */
    private quickToolbarStatusUpdaters: Record<string, ToolbarStatusUpdater | null> = {};
    private isToolbarInteracting: boolean = false;
    private skipBlurClose: boolean = false;

    constructor(parent: RichTextEditorUI, locale: L10n) {
        super(parent, locale);
        parent.quickToolbarModule = this;
        this.render();
    }

    public getModuleName(): string {
        return 'quickToolbar';
    }

    protected addEventListener(): void {
        this.parent.on(constant.editorMouseup, this.mouseUpHandler, this);
        this.parent.on(constant.blurred, this.blurHandler, this);
        this.parent.on(constant.parentScroll, this.viewportChangeHandler, this);
        this.parent.on(constant.editorKeyup, this.editorKeyUpHandler, this);
        this.parent.on(constant.editorSelectionChange, this.selectionChangeHandler, this);
        this.parent.on(constant.documentMouseDown, this.documentMouseDownHandler, this);
        this.parent.on(constant.documentMouseUp, this.documentMouseUpHandler, this);
        this.parent.on(constant.contentscroll, this.viewportChangeHandler, this);
        this.parent.on(constant.windowResize, this.viewportChangeHandler, this);
    }

    protected removeEventListener(): void {
        this.parent.off(constant.editorMouseup, this.mouseUpHandler);
        this.parent.off(constant.blurred, this.blurHandler);
        this.parent.off(constant.parentScroll, this.viewportChangeHandler);
        this.parent.off(constant.editorKeyup, this.editorKeyUpHandler);
        this.parent.off(constant.editorSelectionChange, this.selectionChangeHandler);
        this.parent.off(constant.documentMouseDown, this.documentMouseDownHandler);
        this.parent.off(constant.documentMouseUp, this.documentMouseUpHandler);
        this.parent.off(constant.windowResize, this.viewportChangeHandler);
        this.parent.off(constant.contentscroll, this.viewportChangeHandler);
        this.unwireToolbarEvents();
    }

    protected onReadOnlyChange(readonly: boolean): void {
        if (readonly) {
            this.hideQuickToolbars(true);
        }
    }

    protected onEnabledChange(enabled: boolean): void {
        if (!enabled) {
            this.hideQuickToolbars(true);
        }
    }

    private mouseUpHandler(args: { originalEvent?: MouseEvent }): void {
        const event: MouseEvent | undefined = args && args.originalEvent ? args.originalEvent : undefined;
        const selectedBlock: HTMLElement = this.parent.editorController.getSelectedBlockElem();
        const target: HTMLElement | null = selectedBlock.querySelector('.is-selected');
        if (target && target.querySelector('img') && this.canRenderImageToolbar(this.parent.quickToolbarSettings)) {
            this.showImageQuickToolbar(target, event);
            const imageToolbar: BaseQuickToolbar | null = this.getToolbar('Image');
            if (imageToolbar && imageToolbar.isRendered) {
                if (this.parent.imageModule) {
                    this.parent.imageModule.setSelectedImage(target.querySelector('img') as HTMLImageElement);
                }
            }
            return;
        }
        const tableWrapper: HTMLElement | null = selectedBlock.classList?.contains('tableWrapper') ? selectedBlock : selectedBlock.closest('.tableWrapper');
        if (tableWrapper) {
            return;
        }
        const linkToolbar: BaseQuickToolbar | null = this.getToolbar('Link');
        if (linkToolbar && linkToolbar.isRendered && this.canRenderLinkToolbar(this.parent.quickToolbarSettings)) {
            return;
        }
        this.showTextQuickToolbar(event);
        const originalEvent: MouseEvent | undefined = args && args.originalEvent ? args.originalEvent : undefined;
        this.showTextQuickToolbar(originalEvent);
    }

    public render(): void {
        const settings: QuickToolbarSettingsModel = this.parent.quickToolbarSettings;
        this.unwireToolbarEvents();
        this.destroyToolbars();
        if (!this.canRenderTextToolbar(settings)) {
            if (!this.canRenderImageToolbar(settings)) {
                if (!this.canRenderLinkToolbar(settings)) {
                    if (!this.canRenderTableToolbar(settings)) {
                        return;
                    }
                }
            }
        }
        if (this.canRenderTextToolbar(settings)) {
            this.createToolbar('Text', settings.text);
        }
        if (this.canRenderImageToolbar(settings)) {
            this.createToolbar('Image', settings.image);
        }
        if (this.canRenderLinkToolbar(settings)) {
            this.createToolbar('Link', settings.link);
        }
        if (this.canRenderTableToolbar(settings)) {
            this.createToolbar('Table', settings.table);
        }
        this.wireToolbarEvents();
    }

    public updateLocale(): void {
        this.render();
    }

    protected onModelPropertyChanged(prop: string, e: { newProp: { quickToolbarSettings?: QuickToolbarSettingsModel } }): void {
        const newProp: { quickToolbarSettings?: QuickToolbarSettingsModel } = e && e.newProp ? e.newProp : undefined;
        const settings: QuickToolbarSettingsModel = newProp && newProp.quickToolbarSettings;
        if (prop !== 'quickToolbarSettings' || !settings) {
            return;
        }
        if (!this.canRenderTextToolbar(settings) && !this.canRenderLinkToolbar(settings) &&
            !this.canRenderTableToolbar(settings) && !this.canRenderImageToolbar(settings)) {
            this.hideQuickToolbars(true);
        }
        this.render();
    }

    public getToolbar(type: QuickToolbarType): BaseQuickToolbar | null {
        return this.quickToolbars[type as QuickToolbarType] || null;
    }

    public destroyModule(): void {
        this.hideQuickToolbars(true);
        this.destroyToolbars();
        this.removeEventListener();
    }

    private createToolbar(type: QuickToolbarType, items: QuickToolbarSettings['text']): void {
        const toolbar: BaseQuickToolbar = new BaseQuickToolbar(type, this.parent);
        const refresh: () => void = (): void => {
            this.updateQuickToolbarStatus(type);
        };
        toolbar.render({
            popupType: type,
            mode: 'MultiRow',
            toolbarItems: items,
            cssClass: this.parent.cssClass,
            statusRefresh: refresh
        });
        this.quickToolbars[type as QuickToolbarType] = toolbar;
        this.createQuickToolbarStatusUpdater(type);
    }

    private destroyToolbars(): void {
        for (const type of Object.keys(this.quickToolbars) as QuickToolbarType[]) {
            if (!isNullOrUndefined(this.quickToolbars[type as QuickToolbarType])) {
                this.quickToolbars[type as QuickToolbarType].destroy();
            }
        }
        this.quickToolbars = {} as Record<QuickToolbarType, BaseQuickToolbar>;
        this.quickToolbarStatusUpdaters = {};
    }

    /**
     * Builds and caches a {@link ToolbarStatusUpdater} for the quick toolbar
     * of the given type. The updater reuses the toolbar's own
     * {@link ToolbarRenderer} so active/disabled/dropdown states are applied
     * only to quick-toolbar items (never the main toolbar).
     *
     * @param {QuickToolbarType} type - The quick toolbar type identifier
     * @returns {void}
     * @private
     */
    private createQuickToolbarStatusUpdater(type: QuickToolbarType): void {
        const toolbar: BaseQuickToolbar | null = this.getToolbar(type);
        const editorCore: EditorCore | null = this.getEditorCore();
        const editorToolbar: { getRenderer?: () => ToolbarRenderer | null } | null =
            toolbar.quickTBarObj as unknown as { getRenderer?: () => ToolbarRenderer | null } | null;
        const renderer: ToolbarRenderer | null =
            editorToolbar && typeof editorToolbar.getRenderer === 'function'
                ? editorToolbar.getRenderer()
                : null;
        this.quickToolbarStatusUpdaters[type as QuickToolbarType] = new ToolbarStatusUpdater(editorCore, renderer);
        renderer.setPopupSync((kind: string, popup: HTMLElement | null | undefined): void => {
            const updater: ToolbarStatusUpdater | null = this.quickToolbarStatusUpdaters[type as QuickToolbarType];
            if (!updater) {
                return;
            }
            updater.onDropdownBeforeOpen(kind, popup);
        });
    }

    /**
     * Handles the formattingStateUpdated event from EditorController.onSuccess.
     * Applies the shared formatting state to all rendered quick toolbars.
     *
     * @param {FormattingState} state - The formatting state to apply
     * @returns {void}
     * @private
     */
    public applyFormattingState(state: FormattingState): void {
        for (const type of Object.keys(this.quickToolbarStatusUpdaters) as QuickToolbarType[]) {
            const toolbar: BaseQuickToolbar | null = this.quickToolbars[type as QuickToolbarType];
            if (!toolbar || !toolbar.isRendered) {
                continue;
            }
            const updater: ToolbarStatusUpdater | null = this.quickToolbarStatusUpdaters[type as QuickToolbarType];
            if (updater) {
                updater.applyFormattingState(state);
            }
        }
    }

    private getEditorCore(): EditorCore | null {
        const host: { baseEditorCore?: EditorCore } = this.parent as unknown as { baseEditorCore?: EditorCore };
        const candidate: EditorCore | undefined = host.baseEditorCore;
        if (!candidate) {
            return null;
        }
        return candidate;
    }

    private canRenderTextToolbar(settings: QuickToolbarSettingsModel): boolean {
        return !!(settings && settings.enable && settings.text && settings.text.length > 0);
    }

    private canRenderImageToolbar(settings: QuickToolbarSettingsModel): boolean {
        return !!(settings && settings.enable && settings.image && settings.image.length > 0);
    }

    private canRenderLinkToolbar(settings: QuickToolbarSettingsModel): boolean {
        return !!(settings && settings.enable && settings.link && settings.link.length > 0);
    }

    private canRenderTableToolbar(settings: QuickToolbarSettingsModel): boolean {
        return !!(settings && settings.enable && settings.table && settings.table.length > 0);
    }

    private wireToolbarEvents(): void {
        for (const type of Object.keys(this.quickToolbars) as QuickToolbarType[]) {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            if (!toolbar || !toolbar.element) {
                continue;
            }
            EventHandler.add(toolbar.element, 'keyup', this.onQuickToolbarKeyUp, this);
            EventHandler.add(toolbar.element, 'mousedown', this.onQuickToolbarMouseDown, this);
        }
    }

    private unwireToolbarEvents(): void {
        for (const type of Object.keys(this.quickToolbars) as QuickToolbarType[]) {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            if (!toolbar || !toolbar.element) {
                continue;
            }
            EventHandler.remove(toolbar.element, 'keyup', this.onQuickToolbarKeyUp);
            EventHandler.remove(toolbar.element, 'mousedown', this.onQuickToolbarMouseDown);
        }
    }

    private editorKeyUpHandler(args: { originalEvent?: KeyboardEvent }): void {
        const e: KeyboardEvent = args && args.originalEvent ? args.originalEvent : undefined;
        if (e && (e.which === 27 || e.key === 'Escape')) {
            this.hideQuickToolbars(false, 'Escape', e);
            return;
        }
        const linkToolbar: BaseQuickToolbar | null = this.getToolbar('Link');
        if (linkToolbar && linkToolbar.isRendered) {
            return;
        }
        const tableToolbar: BaseQuickToolbar | null = this.getToolbar('Table');
        if (tableToolbar && tableToolbar.isRendered) {
            return;
        }
        const imageToolbar: BaseQuickToolbar | null = this.getToolbar('Image');
        if (imageToolbar && imageToolbar.isRendered) {
            return;
        }
        if (this.hasValidTextSelection()) {
            this.showTextQuickToolbar(e);
            return;
        }
        this.hideQuickToolbars(false, 'SelectionChange', e);
    }

    private selectionChangeHandler(): void {
        if (!this.isAnyToolbarOpen() || this.isToolbarInteracting) {
            return;
        }
        // The link and table popups are governed by `<a>` / `<table>` presence
        // at the cursor, not by selection state. Selection-change-driven
        // dismiss only applies to the Text toolbar.
        const linkToolbar: BaseQuickToolbar | null = this.getToolbar('Link');
        if (linkToolbar && linkToolbar.isRendered) {
            return;
        }
        const tableToolbar: BaseQuickToolbar | null = this.getToolbar('Table');
        if (tableToolbar && tableToolbar.isRendered) {
            return;
        }
        const imageToolbar: BaseQuickToolbar | null = this.getToolbar('Image');
        if (imageToolbar && imageToolbar.isRendered) {
            return;
        }
        if (!this.hasValidTextSelection()) {
            this.hideQuickToolbars(false, 'SelectionChange');
        }
    }

    private documentMouseDownHandler(args: { originalEvent?: MouseEvent }): void {
        const e: MouseEvent = args && args.originalEvent ? args.originalEvent : undefined;
        if (!e) {
            return;
        }
        const target: Node = e.target as Node;
        if (this.isToolbarElement(target) || this.isEditorSubComponentElement(target)) {
            this.isToolbarInteracting = true;
            this.skipBlurClose = true;
            return;
        }
        this.isToolbarInteracting = false;
        this.skipBlurClose = true;
        if (this.isAnyToolbarOpen() && !this.isEditorElement(target)) {
            this.hideQuickToolbars(false, 'OutsideInteraction', e);
        }
    }

    private documentMouseUpHandler(): void {
        this.isToolbarInteracting = false;
        this.skipBlurClose = false;
    }

    private onQuickToolbarKeyUp(e: KeyboardEvent): void {
        if (e.which === 27 || e.key === 'Escape') {
            this.hideQuickToolbars(false, 'Escape', e);
        }
    }

    private onQuickToolbarMouseDown(): void {
        this.isToolbarInteracting = true;
        this.skipBlurClose = true;
    }

    private hasValidTextSelection(): boolean {
        if (!this.parent.inputElement || !this.isEnabled || this.parent.readonly ||
            !this.canRenderTextToolbar(this.parent.quickToolbarSettings)) {
            return false;
        }
        if (!this.parent.isSelectionInRTE()) {
            return false;
        }
        const ownerDocument: Document = this.parent.inputElement.ownerDocument;
        const selection: Selection = ownerDocument ? ownerDocument.getSelection() : null;
        return !!(selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed);
    }

    private showTextQuickToolbar(originalEvent?: MouseEvent | KeyboardEvent): void {
        const textToolbar: BaseQuickToolbar = this.getToolbar('Text');
        const blockNode: HTMLElement = this.parent.editorController.getSelectedBlockElem();
        if (!textToolbar || !blockNode || !this.hasValidTextSelection()) {
            return;
        }
        this.updateQuickToolbarStatus('Text');
        textToolbar.showPopup(blockNode, originalEvent);
    }

    private updateQuickToolbarStatus(type: QuickToolbarType): void {
        const updater: ToolbarStatusUpdater | null = this.quickToolbarStatusUpdaters[type as string];
        updater.updateToolbarStatus();
    }
    private showImageQuickToolbar(target: HTMLElement, originalEvent?: MouseEvent): void {
        const imageToolbar: BaseQuickToolbar = this.getToolbar('Image');
        if (!imageToolbar || !this.parent.inputElement.contains(target)) {
            return;
        }
        imageToolbar.showPopup(target, originalEvent);
    }

    /**
     * Selects an inserted image after its load event and opens its quick
     * toolbar using the same path as a user mouse-up interaction.
     *
     * @param {HTMLImageElement} image - Loaded image to select.
     * @returns {void}
     */
    public showImageToolbarAfterLoad(image: HTMLImageElement): void {
        if (!image || !this.parent.inputElement.contains(image) ||
            !this.canRenderImageToolbar(this.parent.quickToolbarSettings)) {
            return;
        }
        if (this.parent.imageModule) {
            this.parent.imageModule.setSelectedImage(image);
        }
        this.showImageQuickToolbar(image);
    }

    public hideQuickToolbars(force: boolean = false, reason: string = 'SelectionChange', originalEvent?: Event): void {
        for (const type of Object.keys(this.quickToolbars) as QuickToolbarType[]) {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            if (!toolbar || !toolbar.isRendered) {
                continue;
            }
            if (force) {
                toolbar.hidePopup();
                if (type === 'Image') {
                    if (this.parent.imageModule) {
                        this.parent.imageModule.clearSelectedImage();
                    }
                }
                continue;
            }
            const eventArgs: {
                cancel: boolean;
                element: HTMLElement;
                target: HTMLElement;
                originalEvent: Event;
                event: Event;
                reason: string;
                subType: string;
            } = {
                cancel: false,
                element: toolbar.element,
                target: toolbar.previousTarget || this.parent.inputElement,
                originalEvent: originalEvent,
                event: originalEvent,
                reason: reason,
                subType: type
            };
            this.parent.trigger('beforePopupClose', eventArgs as never, (closeArgs: { cancel?: boolean }): void => {
                if (!closeArgs.cancel) {
                    toolbar.hidePopup();
                    if (type === 'Image') {
                        if (this.parent.imageModule) {
                            this.parent.imageModule.clearSelectedImage();
                        }
                    }
                }
            });
        }
        this.isToolbarInteracting = false;
    }

    private isAnyToolbarOpen(): boolean {
        return Object.keys(this.quickToolbars).some((type: string) => {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            return !!(toolbar && toolbar.isRendered);
        });
    }

    private isEditorElement(target: Node): boolean {
        return !!(target && this.parent.element && this.parent.element.contains(target));
    }

    private isToolbarElement(target: Node): boolean {
        return Object.keys(this.quickToolbars).some((type: string) => {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            return !!(toolbar && toolbar.element && target && toolbar.element.contains(target));
        });
    }

    private isEditorSubComponentElement(target: Node): boolean {
        if (!(target instanceof Element)) {
            return false;
        }
        return !!target.closest('.' + classes.CLS_RTE_ELEMENTS);
    }

    private viewportChangeHandler(args: { originalEvent: MouseEvent} ): void {
        this.refreshQuickToolbarPopup(args.originalEvent);
    }

    private blurHandler(args: { originalEvent?: FocusEvent }): void {
        if (!this.isAnyToolbarOpen()) {
            return;
        }
        if (this.skipBlurClose) {
            this.skipBlurClose = false;
            return;
        }
        const focusEvent: FocusEvent = args && args.originalEvent ? args.originalEvent : undefined;
        const relatedTarget: Node = focusEvent && focusEvent.relatedTarget ? focusEvent.relatedTarget as Node : null;
        if (this.isToolbarInteracting || this.isToolbarElement(relatedTarget) || this.isEditorElement(relatedTarget)) {
            return;
        }
        this.hideQuickToolbars(false, 'EditorBlur', focusEvent);
    }

    /**
     * Refreshes the quick toolbar popups by hiding and then displaying them again
     * at a target element's location. This method iterates over all available quick
     * toolbars, checking their rendered state and visibility. If a toolbar is
     * currently visible, it is hidden and then shown again to refresh its position
     * based on the specified mouse event. Additionally, for text toolbars, any
     * previously stored status is restored after the refresh.
     *
     * @param {MouseEvent} e - The mouse event that triggers the refresh, used to
     *                         determine the new position for the toolbars.
     * @returns {void}
     */
    public refreshQuickToolbarPopup(e?: MouseEvent): void {
        for (const type of Object.keys(this.quickToolbars) as QuickToolbarType[]) {
            const toolbar: BaseQuickToolbar = this.quickToolbars[type as QuickToolbarType];
            if (toolbar && toolbar.isRendered && toolbar.element && toolbar.element.classList.contains('e-popup-open')) {
                toolbar.hidePopup();
                const target: HTMLElement = toolbar.previousTarget as HTMLElement;
                toolbar.showPopup(target, e);
                if (toolbar.type === 'Text') {
                    this.updateQuickToolbarStatus('Text');
                }
            }
        }
    }
}
