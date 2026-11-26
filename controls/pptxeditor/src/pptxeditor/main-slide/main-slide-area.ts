import {} from '../dom-compat';

/**
 * Main Slide Area module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/main-slide
 *
 * Renders the centered, zoomable slide surface inside `.ej2-pptx-slide-area`.
 * Shell / layout only — slide content HTML/CSS/SVG is mounted later by the
 * rendering pipeline into {@link MainSlideArea.getContentHost}.
 */

import { createElement } from '@syncfusion/ej2-base';
import {
    ContextMenu,
    BeforeOpenCloseMenuEventArgs,
    MenuEventArgs,
    MenuItemModel
} from '@syncfusion/ej2-navigations';
import {
    DEFAULT_SLIDE_HEIGHT_PT,
    DEFAULT_SLIDE_WIDTH_PT,
    FIT_PADDING_PX,
    ZoomMode,
    computeDisplayLayout,
    DisplayLayout
} from './layout';
import {
    FontProvider, SlideRenderModel, SlideShapeLevels, SlideShapeSnapshot, TextMeasureError, TextMeasurer,
    createFontProvider, createTextMeasurer
} from '../render';
import { PictureMediaProvider, SlideFrameEmitter } from './slide-frame-emitter';
import { localize } from '../localization/localization';

/**
 * Stable id for the context-menu Copy Text item.
 * @internal
 */
export const MAIN_SLIDE_COPY_TEXT_ID: string = 'pptx-main-slide-copy-text';

/**
 * Host contract implemented by {@link PptxEditor}.
 * @internal
 */
export interface MainSlideAreaHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    /** Editor root element. */
    readonly element: HTMLElement;
    /** Current EJ2 locale used for slide area text. */
    readonly locale?: string;
    /** Zoom level in percent (10–400). */
    zoom: number;
    /** When false, Copy Text is disabled. */
    enableCopy: boolean;
    /** When false, text selection is suppressed on the slide surface. */
    enableTextSelection: boolean;
    /** Optional watermark label; empty/undefined hides the overlay. */
    watermarkText: string | undefined;
    /** Intrinsic slide width in points. */
    slideWidthPt: number;
    /** Intrinsic slide height in points. */
    slideHeightPt: number;
    /**
     * Sets zoom percent (clamped) and switches the main slide to percent mode.
     *
     * @param percent - Target zoom percent
     */
    setZoom(percent: number): void;
    /**
     * Syncs the ribbon zoom display from a fit-mode layout without forcing percent mode.
     *
     * @param percent - Computed fit zoom percent
     */
    syncZoomDisplay(percent: number): void;
    /**
     * Announces a status message (editor live region).
     *
     * @param message - Status text
     */
    announce(message: string): void;
    /**
     * Copies the current text selection only (no share-link fallback).
     */
    copySelectedText(): void;
    /* Shared application font resolver used for both measurement and DOM text. */
    getFontProvider?(): FontProvider;
}

/**
 * Orchestrates the main slide viewport, fit/zoom layout, watermark,
 * text-selection policy, and Copy Text context menu.
 * @internal
 */
export class MainSlideArea {
    private readonly host: MainSlideAreaHost;
    private container: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private viewport: HTMLElement | null = null;
    private center: HTMLElement | null = null;
    private frame: HTMLElement | null = null;
    private content: HTMLElement | null = null;
    private slideFrameRenderer: SlideFrameEmitter | null = null;
    private textMeasurer: TextMeasurer | null = null;
    private watermark: HTMLElement | null = null;
    private contextMenuElement: HTMLUListElement | null = null;
    /** Touch (coarse pointer) media query; the Copy Text menu follows it live. */
    private pointerQuery: MediaQueryList | null = null;
    private readonly onPointerQueryChangeBound: () => void = (): void => {
        this.syncContextMenuToPointer();
    };
    private contextMenu: ContextMenu | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private resizeFrame: number | null = null;
    private zoomMode: ZoomMode = 'fit-to-window';
    private initialized: boolean = false;
    /** Guards re-entrant layout when host.setZoom triggers property refresh. */
    private applyingLayout: boolean = false;
    /** Last computed layout (for tests and diagnostics). */
    private lastLayout: DisplayLayout | null = null;

    /**
     * @param {MainSlideAreaHost} host - Editor host providing zoom, selection, and copy APIs
     */
    public constructor(host: MainSlideAreaHost) {
        this.host = host;
    }

    /**
     * Builds main-slide DOM inside the shell `.ej2-pptx-slide-area` mount.
     *
     * @param {HTMLElement} container - `.ej2-pptx-slide-area` element
     * @returns {void}
     */
    public initialize(container: HTMLElement): void {
        if (this.initialized) {
            this.refresh();
            return;
        }

        this.container = container;
        container.innerHTML = '';

        const root: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide',
            attrs: {
                role: 'region',
                'aria-label': 'Slide'
            }
        });
        this.root = root;

        const viewport: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide__viewport'
        });
        this.viewport = viewport;

        const center: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide__center'
        });
        this.center = center;

        const frame: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide__frame'
        });
        this.frame = frame;

        const content: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide__content',
            attrs: {
                'data-slide-content': 'true'
            }
        });
        this.content = content;
        this.slideFrameRenderer = new SlideFrameEmitter(content);
        this.textMeasurer = createTextMeasurer({
            fontProvider: this.host.getFontProvider ? this.host.getFontProvider() : createFontProvider(),
            // Harness-only: document FontFace registrations are not visible to a
            // DedicatedWorker's FontFaceSet, so oracle runs deliberately measure on
            // the document canvas using the exact same loaded bytes as HTML text.
            forceMainThread: this.host.element.hasAttribute('data-fidelity-main-thread-text')
        });

        const watermark: HTMLElement = createElement('div', {
            className: 'ej2-pptx-main-slide__watermark',
            attrs: {
                'aria-hidden': 'true'
            }
        });
        this.watermark = watermark;

        frame.appendChild(content);
        frame.appendChild(watermark);
        center.appendChild(frame);
        viewport.appendChild(center);
        root.appendChild(viewport);
        const semanticLiveRegion: HTMLElement = createElement('div', {
            className: 'ej2-pptx-semantic-live-region',
            attrs: { 'aria-live': 'polite', 'aria-atomic': 'true' }
        });
        semanticLiveRegion.style.position = 'absolute';
        semanticLiveRegion.style.width = '1px';
        semanticLiveRegion.style.height = '1px';
        semanticLiveRegion.style.overflow = 'hidden';
        semanticLiveRegion.style.clipPath = 'inset(50%)';
        root.appendChild(semanticLiveRegion);

        const menuUl: HTMLUListElement = createElement('ul', {
            className: 'ej2-pptx-main-slide__context-menu'
        }) as HTMLUListElement;
        this.contextMenuElement = menuUl;
        root.appendChild(menuUl);

        container.appendChild(root);

        this.applyTextSelectionClass();
        this.applyWatermark();
        this.wireContextMenu();
        this.watchPointerType();
        this.wireResizeObserver();
        this.applyLayout();

        this.initialized = true;
    }

    /**
     * Returns the active zoom mode.
     *
     * @returns {ZoomMode} Current {@link ZoomMode}
     */
    public getZoomMode(): ZoomMode {
        return this.zoomMode;
    }

    /**
     * Sets zoom mode and recomputes layout.
     *
     * @param {ZoomMode} mode - Target zoom mode
     * @returns {void}
     */
    public setZoomMode(mode: ZoomMode): void {
        this.zoomMode = mode;
        this.applyLayout();
    }

    /**
     * Returns the content host where future slide renderers mount HTML/CSS/SVG.
     *
     * @returns {HTMLElement|null} Content element, or null before initialize
     */
    public getContentHost(): HTMLElement | null {
        return this.content;
    }

    /**
     * Returns the last computed display layout (for tests).
     *
     * @returns {DisplayLayout|null} Last layout or null
     */
    public getLastLayout(): DisplayLayout | null {
        return this.lastLayout;
    }

    /*
 * Renders presentation geometry/background into the content host.
 * @param {SlideRenderModel} model - model
 * @param {SlideShapeLevels} levels - levels
 * @param {PictureMediaProvider} pictureMedia - pictureMedia
 * @param {AbortSignal} signal - signal
 * @returns {Promise} result
 */
    public async renderSlideFrame(
        model: SlideRenderModel<SlideShapeSnapshot>,
        levels?: SlideShapeLevels,
        pictureMedia?: PictureMediaProvider,
        signal?: AbortSignal
    ): Promise<void> {
        if (this.slideFrameRenderer !== undefined && this.slideFrameRenderer !== null) {
            this.slideFrameRenderer.render(model);
        }
        this.applyLayout();
        if (pictureMedia && this.slideFrameRenderer) {
            await this.slideFrameRenderer.renderPictures(model, pictureMedia, signal);
        }
        if (levels && this.slideFrameRenderer && this.textMeasurer) {
            try {
                await this.slideFrameRenderer.renderText(
                    model, levels, this.textMeasurer, optionalProperty(pictureMedia, 'activateHyperlink'));
                void ((this.content) !== undefined && (this.content) !== null ? (this.content).removeAttribute('data-text-render-status') : undefined);
            } catch (error) {
                if (!(error instanceof TextMeasureError) || error.code !== 'Unavailable') {
                    throw error;
                }
                // Browser-less hosts can still inspect the slide frame; measurement resumes
                // after the editor is mounted in a browser with Canvas/OffscreenCanvas.
                void ((this.content) !== undefined && (this.content) !== null ? (this.content).setAttribute('data-text-render-status', 'measurement-unavailable') : undefined);
            }
        }
    }

    /**
     * Re-applies selection, watermark, and layout from the current host state.
     *
     * @returns {void}
     */
    public refreshLocale(): void {
        if (!this.initialized || !this.root) {
            return;
        }
        if (this.contextMenu) {
            this.contextMenu.items = [{ id: MAIN_SLIDE_COPY_TEXT_ID, text: localize(this.host.locale, 'CopyText') }];
            this.contextMenu.dataBind();
        }
    }

    /**
     * Refreshes layout, selection class and watermark from host properties.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.initialized) {
            return;
        }
        this.applyTextSelectionClass();
        this.applyWatermark();
        this.applyLayout();
    }

    /**
     * Recomputes layout after host zoom changes from {@link MainSlideAreaHost.setZoom}.
     * Switches to percent mode (user/API zoom). Ignores echoes during fit sync.
     *
     * @returns {void}
     */
    public onHostZoomChanged(): void {
        if (!this.initialized || this.applyingLayout) {
            return;
        }
        // Property-change echo after fit sync: same percent, stay in fit mode.
        if (
            (this.zoomMode === 'fit-to-window' || this.zoomMode === 'fit-width') &&
      this.lastLayout !== null &&
      this.host.zoom === this.lastLayout.zoomPercent
        ) {
            return;
        }
        this.zoomMode = 'percent';
        this.applyLayout();
    }

    /**
     * Destroys observers, context menu, and DOM owned by this module.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.slideFrameRenderer !== undefined && this.slideFrameRenderer !== null) {
            this.slideFrameRenderer.destroy();
        }
        this.slideFrameRenderer = null;
        void ((this.textMeasurer) !== undefined && (this.textMeasurer) !== null ? (this.textMeasurer).close() : undefined);
        this.textMeasurer = null;
        if (this.pointerQuery) {
            if (typeof this.pointerQuery.removeEventListener === 'function') {
                this.pointerQuery.removeEventListener('change', this.onPointerQueryChangeBound);
            } else if (typeof this.pointerQuery.removeListener === 'function') {
                this.pointerQuery.removeListener(this.onPointerQueryChangeBound);
            }
            this.pointerQuery = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.resizeFrame !== null) {
            cancelAnimationFrame(this.resizeFrame);
            this.resizeFrame = null;
        }

        if (this.contextMenu) {
            try {
                this.contextMenu.destroy();
            } catch {
                // Ignore destroy errors during teardown.
            }
            this.contextMenu = null;
        }

        if (this.container) {
            this.container.innerHTML = '';
        }

        this.container = null;
        this.root = null;
        this.viewport = null;
        this.center = null;
        this.frame = null;
        this.content = null;
        this.watermark = null;
        this.contextMenuElement = null;
        this.lastLayout = null;
        this.initialized = false;
    }

    /**
     * Applies fit/percent sizing to frame and content.
     *
     * @returns {void}
     */
    private applyLayout(): void {
        if (!this.viewport || !this.frame || !this.content) {
            return;
        }

        const vp: HTMLElement = this.viewport;
        const widthPx: number =
      vp.clientWidth > 0
          ? vp.clientWidth
          : this.readFallbackSize(vp, 'width');
        const heightPx: number =
      vp.clientHeight > 0
          ? vp.clientHeight
          : this.readFallbackSize(vp, 'height');

        const slideW: number =
      typeof this.host.slideWidthPt === 'number' && this.host.slideWidthPt > 0
          ? this.host.slideWidthPt
          : DEFAULT_SLIDE_WIDTH_PT;
        const slideH: number =
      typeof this.host.slideHeightPt === 'number' && this.host.slideHeightPt > 0
          ? this.host.slideHeightPt
          : DEFAULT_SLIDE_HEIGHT_PT;

        const layout: DisplayLayout = computeDisplayLayout(
            this.zoomMode,
            widthPx,
            heightPx,
            slideW,
            slideH,
            this.host.zoom,
            FIT_PADDING_PX
        );
        const previousLayout: DisplayLayout | null = this.lastLayout;
        this.lastLayout = layout;

        if (!previousLayout || previousLayout.contentWidthPx !== layout.contentWidthPx) {
            this.content.style.width = layout.contentWidthPx + 'px';
        }
        if (!previousLayout || previousLayout.contentHeightPx !== layout.contentHeightPx) {
            this.content.style.height = layout.contentHeightPx + 'px';
        }
        if (!previousLayout) {
            this.content.style.transformOrigin = 'top left';
        }
        if (!previousLayout || previousLayout.scale !== layout.scale) {
            this.content.style.transform = 'scale(' + layout.scale + ')';
        }
        if (!previousLayout || previousLayout.frameWidthPx !== layout.frameWidthPx) {
            this.frame.style.width = layout.frameWidthPx + 'px';
        }
        if (!previousLayout || previousLayout.frameHeightPx !== layout.frameHeightPx) {
            this.frame.style.height = layout.frameHeightPx + 'px';
        }

        // In RTL the viewport scrolls from its right edge; start at the left edge so
        // the (LTR) slide opens exactly as it does in LTR mode.
        if (this.host.enableRtl && vp.scrollWidth > vp.clientWidth) {
            vp.scrollLeft = -(vp.scrollWidth - vp.clientWidth);
        }

        // Keep host.zoom in sync so the ribbon ComboBox reflects fit scale.
        // Use syncZoomDisplay (not setZoom) so percent mode is not forced.
        if (
            this.zoomMode === 'fit-to-window' ||
      this.zoomMode === 'fit-width'
        ) {
            if (this.host.zoom !== layout.zoomPercent) {
                this.applyingLayout = true;
                try {
                    this.host.syncZoomDisplay(layout.zoomPercent);
                } finally {
                    this.applyingLayout = false;
                }
            }
        }
    }

    /**
     * Reads style width/height when client metrics are 0 (common in jsdom).
     *
     * @param {HTMLElement} el - Element
     * @param {string} dimension - width or height
     * @returns {number} Parsed px or a sensible default viewport size
     */
    private readFallbackSize(
        el: HTMLElement,
        dimension: 'width' | 'height'
    ): number {
        const raw: string =
      dimension === 'width' ? el.style.width : el.style.height;
        if (raw) {
            const parsed: number = parseFloat(raw);
            if (Number.isFinite(parsed) && parsed > 0) {
                return parsed;
            }
        }
        // Default test/runtime fallback approximating a typical content pane.
        return dimension === 'width' ? 800 : 450;
    }

    /**
     * Toggles the no-text-select class from host.enableTextSelection.
     *
     * @returns {void}
     */
    private applyTextSelectionClass(): void {
        if (!this.root) {
            return;
        }
        this.root.classList.toggle(
            'ej2-pptx-main-slide--no-text-select',
            this.host.enableTextSelection === false
        );
    }

    /**
     * Shows or hides the watermark overlay from host.watermarkText.
     *
     * @returns {void}
     */
    private applyWatermark(): void {
        if (!this.watermark) {
            return;
        }
        const raw: string | undefined = this.host.watermarkText;
        const text: string =
      typeof raw === 'string' ? raw.trim() : '';
        if (text.length === 0) {
            this.watermark.textContent = '';
            this.watermark.classList.add('ej2-pptx-main-slide__watermark--hidden');
            this.watermark.setAttribute('aria-hidden', 'true');
            return;
        }
        this.watermark.textContent = text;
        this.watermark.classList.remove('ej2-pptx-main-slide__watermark--hidden');
        this.watermark.setAttribute('aria-hidden', 'true');
    }

    /**
     * Follows the primary pointer type so toggling device mode (or docking a tablet) adds or removes
     * the Copy Text menu without a page reload.
     *
     * @returns {void}
     */
    private watchPointerType(): void {
        if (this.pointerQuery || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }
        this.pointerQuery = window.matchMedia('(pointer: coarse)');
        if (typeof this.pointerQuery.addEventListener === 'function') {
            this.pointerQuery.addEventListener('change', this.onPointerQueryChangeBound);
        } else if (typeof this.pointerQuery.addListener === 'function') {
            this.pointerQuery.addListener(this.onPointerQueryChangeBound);
        }
    }

    /**
     * Creates or removes the context menu to match the current pointer type.
     *
     * @returns {void}
     */
    private syncContextMenuToPointer(): void {
        if (!this.root) {
            return;
        }
        const coarse: boolean = !!this.pointerQuery && this.pointerQuery.matches;
        if (coarse && this.contextMenu) {
            try {
                this.contextMenu.destroy();
            } catch {
                // Ignore destroy errors; the menu is progressive enhancement.
            }
            this.contextMenu = null;
        } else if (!coarse && !this.contextMenu) {
            if (this.contextMenuElement && this.contextMenuElement.parentElement) {
                this.contextMenuElement.parentElement.removeChild(this.contextMenuElement);
            }
            const menuUl: HTMLUListElement = createElement('ul', {
                className: 'ej2-pptx-main-slide__context-menu'
            }) as HTMLUListElement;
            this.contextMenuElement = menuUl;
            this.root.appendChild(menuUl);
            this.wireContextMenu();
        }
    }

    /**
     * Creates the EJ2 ContextMenu with a single Copy Text item.
     *
     * @returns {void}
     */
    private wireContextMenu(): void {
        if (!this.root || !this.contextMenuElement) {
            return;
        }
        // On touch devices the EJ2 ContextMenu hooks long-press / `contextmenu` and cancels the
        // browser default, which blocks native text selection (handles and the Copy callout).
        // Native selection already offers Copy there, so the menu is desktop (fine pointer) only.
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const items: MenuItemModel[] = [
            {
                id: MAIN_SLIDE_COPY_TEXT_ID,
                text: localize(this.host.locale, 'CopyText')
            }
        ];

        // Target the module root; id is assigned if missing so selector works.
        if (!this.root.id) {
            this.root.id = 'ej2-pptx-main-slide-' + String(Date.now());
        }
        const targetSelector: string = '#' + this.root.id;

        try {
            this.contextMenu = new ContextMenu(
                {
                    target: targetSelector,
                    items,
                    enableRtl: !!this.host.enableRtl,
                    beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                        this.handleContextMenuBeforeOpen(args);
                    },
                    select: (args: MenuEventArgs): void => {
                        this.handleContextMenuSelect(args);
                    }
                },
                this.contextMenuElement
            );
        } catch {
            // Context menu is progressive enhancement; layout still works without it.
            this.contextMenu = null;
        }
    }

    /**
     * Enables Copy Text only when copy is allowed and selection is non-empty.
     *
     * @param {BeforeOpenCloseMenuEventArgs} _args - beforeOpen event args
     * @returns {void}
     */
    private handleContextMenuBeforeOpen(
        _args: BeforeOpenCloseMenuEventArgs
    ): void {
        if (!this.contextMenu) {
            return;
        }
        const enabled: boolean =
      this.host.enableCopy === true && this.hasNonEmptyTextSelection();
        try {
            this.contextMenu.enableItems(
                [MAIN_SLIDE_COPY_TEXT_ID],
                enabled,
                true
            );
        } catch {
            // enableItems may fail if menu DOM is not ready; ignore.
        }
    }

    /**
     * Routes context menu selection to the host.
     *
     * @param {MenuEventArgs} args - Menu select args
     * @returns {void}
     */
    private handleContextMenuSelect(args: MenuEventArgs): void {
        const item: MenuItemModel | undefined = args.item;
        if (!item || item.id !== MAIN_SLIDE_COPY_TEXT_ID) {
            return;
        }
        this.host.copySelectedText();
    }

    /**
     * Returns true when the window selection has non-whitespace text.
     *
     * @returns {boolean} Whether selection is copyable
     */
    private hasNonEmptyTextSelection(): boolean {
        if (
            typeof window === 'undefined' ||
      typeof window.getSelection !== 'function'
        ) {
            return false;
        }
        const selection: Selection | null = window.getSelection();
        if (!selection) {
            return false;
        }
        return selection.toString().trim().length > 0;
    }

    /**
     * Observes viewport size changes to recompute fit layouts.
     *
     * @returns {void}
     */
    private wireResizeObserver(): void {
        if (!this.viewport || typeof ResizeObserver === 'undefined') {
            return;
        }
        this.resizeObserver = new ResizeObserver((): void => {
            if (this.resizeFrame === null) {
                // Layout writes during observer delivery can resize an auto-height host.
                this.resizeFrame = requestAnimationFrame((): void => {
                    this.resizeFrame = null;
                    this.applyLayout();
                });
            }
        });
        this.resizeObserver.observe(this.viewport);
    }
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
