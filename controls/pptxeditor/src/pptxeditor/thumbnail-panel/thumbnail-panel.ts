/**
 * Thumbnail Panel (left sidebar) for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/thumbnail-panel
 *
 * Chrome-only strip: list of slide thumbnails with lazy HTML/CSS/SVG content
 * hosts (same surface model as the main slide content host — never canvas).
 * Navigation uses the host `goToSlide` single source of truth.
 */

import { createElement, EventHandler } from '@syncfusion/ej2-base';
import {
    DEFAULT_SLIDE_HEIGHT_PT,
    DEFAULT_SLIDE_WIDTH_PT
} from '../main-slide/layout';
import {
    DEFAULT_PANEL_WIDTH_PX,
    THUMB_LAZY_ROOT_MARGIN,
    clampPanelWidth,
    computeThumbnailFrameSize,
    isDesktopViewport,
    thumbnailContentWidth
} from './layout';
import { localize } from '../localization/localization';
import {
    THUMB_VIRTUALIZATION_OVERSCAN,
    ThumbnailVirtualizationDelegate,
    ThumbnailVirtualizationManager
} from './thumbnail-virtualization-manager';

/**
 * Maximum number of detached thumbnail rows kept for reuse.
 */
const THUMB_POOL_LIMIT: number = 12;

/**
 * Delay (ms) after the last window change before deferred thumbnails paint.
 */
const THUMB_PAINT_IDLE_MS: number = 80;

/**
 * Extra height (CSS px) a row adds around the frame: the 2px button border on
 * both sides. Only an estimate; the real row height is measured once mounted.
 */
const THUMB_ROW_CHROME_PX: number = 4;

/**
 * Host contract implemented by {@link PptxEditor}.
 */
export interface ThumbnailPanelHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    /** Editor root element. */
    readonly element: HTMLElement;
    /** Current EJ2 locale used for panel text. */
    readonly locale?: string;
    /** 0-based current slide index. */
    slideIndex: number;
    /** Number of slides in the presentation (≥ 1 when chrome is shown). */
    slideCount: number;
    /** Intrinsic slide width in points. */
    slideWidthPt: number;
    /** Intrinsic slide height in points. */
    slideHeightPt: number;
    /** Whether the thumbnail panel is expanded. */
    thumbnailPanelVisible: boolean;
    /** Panel width in CSS px (clamped 120–240 when applied). */
    thumbnailPanelWidth: number;
    /**
     * Navigates to a 0-based slide index (single source of truth).
     *
     * @param index - Target slide index
     */
    goToSlide(index: number): void;
    /**
     * Sets panel expanded/collapsed and keeps ribbon chevron in sync.
     *
     * @param visible - True to expand
     */
    setThumbnailPanelVisible(visible: boolean): void;
    /**
     * Sets panel width in CSS px (clamped).
     *
     * @param widthPx - Requested width
     */
    setThumbnailPanelWidth(widthPx: number): void;
    /**
     * Announces a status message (editor live region).
     *
     * @param message - Status text
     */
    announce(message: string): void;
    /**
     * Optional hook to paint slide content into a thumbnail content host using
     * the same HTML/CSS/SVG pipeline as the main editor. When omitted, a stable
     * HTML placeholder surface is used (never canvas).
     *
     * @param index - 0-based slide index
     * @param contentHost - Empty content element ready for HTML/SVG children
     */
    renderThumbnailSlide?(index: number, contentHost: HTMLElement): void | (() => void);
}

/**
 * Item model tracked per thumbnail row.
 */
interface ThumbItem {
    index: number;
    root: HTMLElement;
    button: HTMLButtonElement;
    frame: HTMLElement;
    content: HTMLElement;
    numberEl: HTMLElement;
    placeholder: HTMLElement;
    rendered: boolean;
    /** Disposer returned by the host paint hook (aborts in-flight work). */
    dispose: (() => void) | null;
}

/**
 * Left thumbnail sidebar: list, lazy content, resize, keyboard.
 * Expand/collapse is owned by the View tab, not a panel chevron.
 * @constructor
 */
export class ThumbnailPanel {
    private readonly host: ThumbnailPanelHost;
    private container: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private list: HTMLElement | null = null;
    private resizeHandle: HTMLElement | null = null;
    /** Mounted thumbnail views keyed by 0-based slide index. */
    private views: Map<number, ThumbItem> = new Map();
    /** Detached rows available for reuse. */
    private pool: ThumbItem[] = [];
    /** Total slide count represented by the list (mounted or not). */
    private slideTotal: number = 0;
    private virtualizer: ThumbnailVirtualizationManager | null = null;
    private frameHeightPx: number = 0;
    /** Slide width / height; the frame follows it at whatever width the row actually gets. */
    private frameAspectRatio: number = DEFAULT_SLIDE_WIDTH_PT / DEFAULT_SLIDE_HEIGHT_PT;
    private paintTimer: number | null = null;
    /** True when the last window change was a jump whose paint waits for idle. */
    private paintDeferred: boolean = false;
    private intersectionObserver: IntersectionObserver | null = null;
    private initialized: boolean = false;
    /**
     * Keyboard focus index. Always the active slide: arrow keys navigate
     * immediately, so there is no second selector waiting on Enter.
     */
    private focusIndex: number = 0;
    private resizing: boolean = false;
    private resizeStartX: number = 0;
    private resizeStartWidth: number = 0;
    /**
     * @param {MouseEvent} e - Pointer event
     * @returns {void} result
     */
    private onResizeMoveBound: (e: MouseEvent) => void = (e: MouseEvent): void => {
        this.onResizePointerMove(e);
    };
    private onResizeUpBound: () => void = (): void => {
        this.onResizePointerUp();
    };
    private onViewportChangeBound: () => void = (): void => {
        this.applyResponsiveDefaultIfNeeded();
    };
    private mediaQuery: MediaQueryList | null = null;
    /** When true, user explicitly toggled visibility — skip auto responsive flip. */
    private userVisibilityOverride: boolean = false;

    /**
     * @param {ThumbnailPanelHost} host - Editor host
     */
    public constructor(host: ThumbnailPanelHost) {
        this.host = host;
    }

    /**
     * Builds panel DOM inside `.ej2-pptx-slide-panel`.
     *
     * @param {HTMLElement} container - Shell slide-panel host
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
            className: 'ej2-pptx-thumbnail-panel',
            attrs: {
                role: 'navigation',
                'aria-label': 'Slide thumbnails'
            }
        });
        this.root = root;

        const list: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__list',
            attrs: {
                id: 'ej2-pptx-thumbnail-list',
                role: 'list',
                'aria-label': 'Slide thumbnails'
            }
        });
        this.list = list;

        const resizeHandle: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__resize',
            attrs: {
                role: 'separator',
                'aria-orientation': 'vertical',
                'aria-label': 'Resize thumbnail panel',
                'aria-valuemin': '120',
                'aria-valuemax': '240',
                tabindex: '0'
            }
        });
        this.resizeHandle = resizeHandle;

        root.appendChild(list);
        root.appendChild(resizeHandle);
        container.appendChild(root);

        EventHandler.add(list, 'keydown', this.onListKeyDown, this);
        // One delegated listener per event replaces per-row listeners, so rows
        // can be created/recycled without any handler bookkeeping.
        EventHandler.add(list, 'click', this.onListClick, this);
        EventHandler.add(list, 'focusin', this.onListFocusIn, this);
        EventHandler.add(resizeHandle, 'mousedown', this.onResizePointerDown, this);
        EventHandler.add(resizeHandle, 'keydown', this.onResizeKeyDown, this);

        this.wireMediaQuery();
        this.applyWidth(this.host.thumbnailPanelWidth);
        this.collapseOnMobileAtStartup();
        this.applyVisibility(this.host.thumbnailPanelVisible, false);
        this.rebuildItems();
        this.wireIntersectionObserver();
        this.syncActiveAndFocus(true);

        this.initialized = true;
    }

    /**
     * Rebuilds list when slide count / geometry changes; refreshes active state.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.initialized || !this.list) {
            return;
        }
        this.rebuildItems();
        this.applyWidth(this.host.thumbnailPanelWidth);
        this.applyVisibility(this.host.thumbnailPanelVisible, false);
        this.syncActiveAndFocus(true);
    }

    /**
     * Syncs active highlight and scroll when host `slideIndex` changes.
     *
     * @returns {void}
     */
    public onSlideIndexChanged(): void {
        if (!this.initialized) {
            return;
        }
        this.focusIndex = this.clampIndex(this.host.slideIndex);
        this.syncActiveAndFocus(true);
    }

    /**
     * Applies host visibility (see {@link applyVisibilityFromHost}).
     *
     * @param {boolean} visible - Visibility
     * @returns {void}
     */
    public applyVisibilityFromHost(visible: boolean): void {
        this.applyVisibility(visible, false);
    }

    /**
     * Applies width from host without re-entering setThumbnailPanelWidth.
     *
     * @param {number} widthPx - Width in CSS px
     * @returns {void}
     */
    public applyWidthFromHost(widthPx: number): void {
        this.applyWidth(widthPx);
        this.relayoutThumbFrames();
    }

    /**
     * Marks that visibility was set by the user (chevron / View menu).
     *
     * @returns {void}
     */
    public markUserVisibilityOverride(): void {
        this.userVisibilityOverride = true;
    }

    /**
     * Whether the panel DOM is expanded.
     *
     * @returns {boolean} True when expanded
     */
    public isExpanded(): boolean {
        if (!this.container) {
            return this.host.thumbnailPanelVisible;
        }
        return !this.container.classList.contains('ej2-pptx-slide-panel--collapsed');
    }

    /**
     * Destroys observers, listeners, and DOM.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.resizing) {
            this.onResizePointerUp();
        }
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
        this.cancelPaintTimer();
        this.disposeVirtualizer();
        this.pool = [];
        if (this.list) {
            EventHandler.remove(this.list, 'keydown', this.onListKeyDown);
            EventHandler.remove(this.list, 'click', this.onListClick);
            EventHandler.remove(this.list, 'focusin', this.onListFocusIn);
        }
        if (this.mediaQuery) {
            if (typeof this.mediaQuery.removeEventListener === 'function') {
                this.mediaQuery.removeEventListener('change', this.onViewportChangeBound);
            } else {
                const legacy: MediaQueryList = this.mediaQuery;
                const legacyMq: {
                    removeListener?: (listener: () => void) => void;
                } = legacy as {
                    removeListener?: (listener: () => void) => void;
                };
                if (typeof legacyMq.removeListener === 'function') {
                    legacyMq.removeListener(this.onViewportChangeBound);
                }
            }
            this.mediaQuery = null;
        }
        if (this.resizeHandle) {
            EventHandler.remove(this.resizeHandle, 'mousedown', this.onResizePointerDown);
            EventHandler.remove(this.resizeHandle, 'keydown', this.onResizeKeyDown);
        }
        document.removeEventListener('mousemove', this.onResizeMoveBound);
        document.removeEventListener('mouseup', this.onResizeUpBound);

        this.views.clear();
        this.slideTotal = 0;
        if (this.container) {
            this.container.innerHTML = '';
            this.container.classList.remove(
                'ej2-pptx-slide-panel--collapsed',
                'ej2-pptx-slide-panel--resizing'
            );
            this.container.style.width = '';
            this.container.style.minWidth = '';
            this.container.style.maxWidth = '';
        }
        this.container = null;
        this.root = null;
        this.list = null;
        this.resizeHandle = null;
        this.initialized = false;
    }

    /**
     * Rebuilds the thumbnail list for the current slide count.
     *
     * Only the rows inside the virtualization window are mounted; the spacers
     * keep the scroll height equal to the full slide count.
     *
     * @private
     * @returns {void}
     */
    private rebuildItems(): void {
        if (!this.list) {
            return;
        }
        this.disposeVirtualizer();
        this.cancelPaintTimer();
        this.slideTotal = Math.max(0, Math.floor(this.host.slideCount));
        this.frameHeightPx = this.computeFrameHeight();
        this.wireIntersectionObserver();
        const manager: ThumbnailVirtualizationManager = new ThumbnailVirtualizationManager(
            this.list,
            this.createVirtualizationDelegate(),
            THUMB_VIRTUALIZATION_OVERSCAN
        );
        this.virtualizer = manager;
        manager.reset(this.slideTotal, this.frameHeightPx + THUMB_ROW_CHROME_PX);
        this.measureRowHeight();
    }

    /**
     * Unmounts every view and releases the virtualization manager.
     *
     * @private
     * @returns {void}
     */
    private disposeVirtualizer(): void {
        if (this.virtualizer) {
            this.virtualizer.dispose();
            this.virtualizer = null;
        }
        // Defensive: anything the manager did not report is still released.
        const leftovers: number[] = Array.from(this.views.keys());
        for (let i: number = 0; i < leftovers.length; i++) {
            this.unmountView(leftovers[i]);
        }
    }

    /**
     * Bridges the virtualization manager to this panel's view lifecycle.
     *
     * @private
     * @returns {ThumbnailVirtualizationDelegate} Delegate
     */
    private createVirtualizationDelegate(): ThumbnailVirtualizationDelegate {
        return {
            getViewElement: (index: number): HTMLElement | null => {
                const view: ThumbItem | undefined = this.views.get(index);
                return view ? view.root : null;
            },
            mountView: (index: number, before: Node | null, deferPaint: boolean): void => {
                this.mountView(index, before, deferPaint);
            },
            unmountView: (index: number): void => {
                this.unmountView(index);
            },
            onWindowChanged: (): void => {
                this.onWindowChanged();
            }
        };
    }

    /**
     * Creates (or recycles) the row for a slide entering the window.
     *
     * @private
     * @param {number} index - 0-based slide index
     * @param {Node | null} before - Insertion reference
     * @param {boolean} deferPaint - Paint after scrolling settles
     * @returns {void}
     */
    private mountView(index: number, before: Node | null, deferPaint: boolean): void {
        if (!this.list || this.views.has(index)) {
            return;
        }
        const item: ThumbItem = this.pool.pop() || this.createItem();
        this.bindItem(item, index);
        this.list.insertBefore(item.root, before);
        this.views.set(index, item);
        if (this.virtualizer && this.virtualizer.isVirtual()) {
            // Painting reads layout; doing it here would run while the spacers
            // still describe the previous window and could clamp scrollTop.
            // Painting happens in onWindowChanged, after the spacers are final.
            if (deferPaint) {
                this.paintDeferred = true;
            }
        } else if (this.intersectionObserver) {
            this.intersectionObserver.observe(item.root);
        } else {
            // jsdom / legacy: render immediately with the HTML pipeline
            this.ensureRendered(item);
        }
    }

    /**
     * Releases the row of a slide leaving the window: aborts its paint work,
     * clears its content and returns the row to the reuse pool (or drops it).
     *
     * @private
     * @param {number} index - 0-based slide index
     * @returns {void}
     */
    private unmountView(index: number): void {
        const item: ThumbItem | undefined = this.views.get(index);
        if (!item) {
            return;
        }
        this.views.delete(index);
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(item.root);
        }
        this.releaseFocusFrom(item);
        this.resetItemContent(item);
        item.root.remove();
        if (this.pool.length < THUMB_POOL_LIMIT) {
            this.pool.push(item);
        }
    }

    /**
     * Keeps keyboard navigation alive when the focused thumbnail is about to
     * be removed by moving focus to the list (which owns the key handler).
     *
     * @private
     * @param {ThumbItem} item - Row being removed
     * @returns {void}
     */
    private releaseFocusFrom(item: ThumbItem): void {
        if (!this.list || document.activeElement !== item.button) {
            return;
        }
        if (!this.list.hasAttribute('tabindex')) {
            this.list.setAttribute('tabindex', '-1');
            this.list.style.outline = 'none';
        }
        this.list.focus({ preventScroll: true });
    }

    /**
     * Aborts paint work and empties a row's content host.
     *
     * @private
     * @param {ThumbItem} item - Row
     * @returns {void}
     */
    private resetItemContent(item: ThumbItem): void {
        if (item.dispose) {
            const dispose: () => void = item.dispose;
            item.dispose = null;
            dispose();
        }
        item.content.innerHTML = '';
        item.content.appendChild(item.placeholder);
        item.rendered = false;
        item.root.classList.remove(
            'ej2-pptx-thumbnail-panel__item--rendered',
            'ej2-pptx-thumbnail-panel__item--active'
        );
        item.button.classList.remove('ej2-pptx-thumbnail-panel__thumb--active');
        item.button.removeAttribute('aria-current');
    }

    /**
     * Whether the list has a layout box, so a thumbnail can measure its host.
     * Painting before that (collapsed panel, not yet laid out) would scale the
     * slide against a zero-size host.
     *
     * @private
     * @returns {boolean} True when painting can start
     */
    private canPaintNow(): boolean {
        return !!this.list && !this.list.hidden && this.list.clientHeight > 0;
    }

    /**
     * Runs after the mounted window changed (scroll, resize, jump).
     *
     * @private
     * @returns {void}
     */
    private onWindowChanged(): void {
        this.updateTabStops();
        const deferred: boolean = this.paintDeferred;
        this.paintDeferred = false;
        if (!deferred && this.canPaintNow() && this.virtualizer && this.virtualizer.isVirtual()) {
            this.views.forEach((item: ThumbItem): void => {
                this.ensureRendered(item);
            });
        }
        this.schedulePendingPaint();
    }

    /**
     * Paints rows whose paint was deferred once scrolling has settled.
     *
     * @private
     * @returns {void}
     */
    private schedulePendingPaint(): void {
        if (!this.virtualizer || !this.virtualizer.isVirtual()) {
            return;
        }
        let pending: boolean = false;
        this.views.forEach((item: ThumbItem): void => {
            if (!item.rendered) {
                pending = true;
            }
        });
        this.cancelPaintTimer();
        if (!pending) {
            return;
        }
        this.paintTimer = window.setTimeout((): void => {
            this.paintTimer = null;
            if (!this.canPaintNow()) {
                // The ResizeObserver reschedules once the list has a size.
                return;
            }
            this.views.forEach((item: ThumbItem): void => {
                this.ensureRendered(item);
            });
        }, THUMB_PAINT_IDLE_MS);
    }

    private cancelPaintTimer(): void {
        if (this.paintTimer !== null) {
            window.clearTimeout(this.paintTimer);
            this.paintTimer = null;
        }
    }

    /**
     * Corrects the row-height estimate from a mounted row so the scroll height
     * is exact, keeping the viewport anchored.
     *
     * @private
     * @returns {void}
     */
    private measureRowHeight(): void {
        if (!this.virtualizer) {
            return;
        }
        let measured: number = 0;
        this.views.forEach((item: ThumbItem): void => {
            if (measured === 0) {
                // Fractional height: rounding would drift ~0.5px per row.
                measured = item.root.getBoundingClientRect().height;
            }
        });
        if (measured > 0) {
            this.virtualizer.setItemHeight(measured);
        }
    }

    /**
     * Creates one reusable, unbound thumbnail row. Events are delegated on the
     * list, so the row owns no listeners.
     *
     * @private
     * @returns {ThumbItem} Item record
     */
    private createItem(): ThumbItem {
        const root: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__item',
            attrs: { role: 'listitem' }
        });

        const button: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-thumbnail-panel__thumb',
            attrs: { type: 'button' }
        }) as HTMLButtonElement;

        const frame: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__frame'
        });

        const content: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__content',
            attrs: { 'data-slide-content': 'true' }
        });

        const placeholder: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__placeholder',
            attrs: {
                'aria-hidden': 'true'
            }
        });
        content.appendChild(placeholder);
        frame.appendChild(content);
        button.appendChild(frame);

        const numberEl: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__number',
            attrs: {
                'aria-hidden': 'true'
            }
        });

        // Number sits above-left of the thumbnail card.
        root.appendChild(numberEl);
        root.appendChild(button);

        const item: ThumbItem = {
            index: -1,
            root,
            button,
            frame,
            content,
            numberEl,
            placeholder,
            rendered: false,
            dispose: null
        };
        this.applyFrameStyles(item);
        return item;
    }

    /**
     * Points a (new or recycled) row at a slide.
     *
     * @private
     * @param {ThumbItem} item - Row
     * @param {number} index - 0-based slide index
     * @returns {void}
     */
    private bindItem(item: ThumbItem, index: number): void {
        item.index = index;
        item.root.setAttribute('data-slide-index', String(index));
        item.content.setAttribute('data-thumb-index', String(index));
        item.button.setAttribute('aria-label', 'Slide ' + String(index + 1));
        item.numberEl.textContent = String(index + 1);
        if (this.virtualizer && this.virtualizer.isVirtual()) {
            // The list is windowed: expose the real position in the full set.
            item.root.setAttribute('aria-posinset', String(index + 1));
            item.root.setAttribute('aria-setsize', String(this.slideTotal));
        } else {
            item.root.removeAttribute('aria-posinset');
            item.root.removeAttribute('aria-setsize');
        }
        const active: boolean = index === this.clampIndex(this.host.slideIndex);
        item.root.classList.toggle('ej2-pptx-thumbnail-panel__item--active', active);
        item.button.classList.toggle('ej2-pptx-thumbnail-panel__thumb--active', active);
        if (active) {
            item.button.setAttribute('aria-current', 'true');
        } else {
            item.button.removeAttribute('aria-current');
        }
        item.button.tabIndex = index === this.tabStopIndex() ? 0 : -1;
        this.applyFrameStyles(item);
    }

    /**
     * Delegated click: activates the thumbnail under the pointer.
     *
     * @private
     * @param {MouseEvent} e - Click event
     * @returns {void}
     */
    private onListClick(e: MouseEvent): void {
        const index: number = this.indexFromEventTarget(e.target);
        if (index >= 0) {
            this.onThumbActivate(index);
        }
    }

    /**
     * Delegated focus: tracks the roving tab stop.
     *
     * @private
     * @param {FocusEvent} e - Focus event
     * @returns {void}
     */
    private onListFocusIn(e: FocusEvent): void {
        const index: number = this.indexFromEventTarget(e.target);
        if (index >= 0) {
            this.focusIndex = index;
            this.updateTabStops();
        }
    }

    /**
     * Resolves the slide index of the thumbnail button containing a target.
     *
     * @private
     * @param {EventTarget | null} target - Event target
     * @returns {number} 0-based index or -1
     */
    private indexFromEventTarget(target: EventTarget | null): number {
        if (!(target instanceof Element)) {
            return -1;
        }
        const button: Element | null = target.closest('.ej2-pptx-thumbnail-panel__thumb');
        const row: Element | null = button ? button.parentElement : null;
        const attr: string | null = row ? row.getAttribute('data-slide-index') : null;
        if (attr === null) {
            return -1;
        }
        const index: number = Number(attr);
        return Number.isFinite(index) ? index : -1;
    }

    /**
     * Wires IntersectionObserver for lazy HTML content fill of small decks
     * (virtualized decks paint rows directly as they enter the window).
     *
     * @private
     * @returns {void}
     */
    private wireIntersectionObserver(): void {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
        if (typeof IntersectionObserver === 'undefined' || !this.list) {
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                for (let i: number = 0; i < entries.length; i++) {
                    const entry: IntersectionObserverEntry = entries[i];
                    if (!entry.isIntersecting) {
                        continue;
                    }
                    const el: Element = entry.target;
                    const idxAttr: string | null = el.getAttribute('data-slide-index');
                    if (idxAttr === null) {
                        continue;
                    }
                    const item: ThumbItem | undefined = this.views.get(Number(idxAttr));
                    if (item) {
                        this.ensureRendered(item);
                    }
                }
            },
            {
                root: this.list,
                rootMargin: THUMB_LAZY_ROOT_MARGIN,
                threshold: 0
            }
        );
    }

    /**
     * Fills thumbnail content once via HTML/CSS/SVG pipeline (never canvas).
     *
     * @private
     * @param {ThumbItem} item - Thumbnail item
     * @returns {void}
     */
    private ensureRendered(item: ThumbItem): void {
        if (item.rendered) {
            return;
        }
        item.content.innerHTML = '';
        if (typeof this.host.renderThumbnailSlide === 'function') {
            const disposer: void | (() => void) = this.host.renderThumbnailSlide(item.index, item.content);
            item.dispose = typeof disposer === 'function' ? disposer : null;
        } else {
            // Stable HTML placeholder matching main-slide content host contract.
            // Future slide renderer mounts HTML/CSS/SVG here (same pipeline as main).
            const surface: HTMLElement = createElement('div', {
                className: 'ej2-pptx-thumbnail-panel__surface',
                attrs: {
                    'data-slide-surface': 'true',
                    'aria-hidden': 'true'
                }
            });
            item.content.appendChild(surface);
        }
        item.rendered = true;
        item.root.classList.add('ej2-pptx-thumbnail-panel__item--rendered');
    }

    /**
     * Frame height (CSS px) from panel width and slide aspect ratio.
     *
     * @private
     * @returns {number} Height in CSS px
     */
    private computeFrameHeight(): number {
        const panelW: number = clampPanelWidth(this.host.thumbnailPanelWidth);
        const contentW: number = thumbnailContentWidth(panelW);
        const slideW: number =
      this.host.slideWidthPt > 0
          ? this.host.slideWidthPt
          : DEFAULT_SLIDE_WIDTH_PT;
        const slideH: number =
      this.host.slideHeightPt > 0
          ? this.host.slideHeightPt
          : DEFAULT_SLIDE_HEIGHT_PT;
        this.frameAspectRatio = slideW / slideH;
        let measuredW: number = 0;
        this.views.forEach((item: ThumbItem): void => {
            if (measuredW === 0) {
                measuredW = item.frame.getBoundingClientRect().width;
            }
        });
        // Prefer the laid-out frame width: the row also holds the slide number,
        // list padding and the scrollbar gutter, so the panel-derived width is
        // wider than the frame and would overstate the row height.
        return computeThumbnailFrameSize(measuredW > 0 ? measuredW : contentW, slideW, slideH).heightPx;
    }

    /**
     * Sizes mounted frames from panel width and slide aspect ratio, and
     * re-derives the virtual scroll height from the new row height.
     *
     * @private
     * @returns {void}
     */
    private relayoutThumbFrames(): void {
        this.frameHeightPx = this.computeFrameHeight();
        this.views.forEach((item: ThumbItem): void => {
            this.applyFrameStyles(item);
        });
        this.views.forEach((item: ThumbItem): void => {
            this.rescaleSurface(item);
        });
        if (this.virtualizer) {
            if (this.views.size > 0) {
                // A mounted row gives the exact height; skip the estimate so
                // the scroll anchor is corrected only once.
                this.measureRowHeight();
            } else {
                this.virtualizer.setItemHeight(this.frameHeightPx + THUMB_ROW_CHROME_PX);
            }
        }
    }

    /**
     * Re-fits an already painted slide surface to the current frame size. The
     * surface keeps its intrinsic size and is scaled once at paint time, so a
     * pane resize must recompute the scale or the slide is cropped.
     *
     * @private
     * @param {ThumbItem} item - Row
     * @returns {void}
     */
    private rescaleSurface(item: ThumbItem): void {
        const surface: HTMLElement | null = item.content.querySelector('[data-slide-surface]');
        if (!surface) {
            return;
        }
        const width: number = parseFloat(surface.style.width);
        const height: number = parseFloat(surface.style.height);
        if (!(width > 0) || !(height > 0)) {
            return;
        }
        const hostW: number = item.content.clientWidth;
        const hostH: number = item.content.clientHeight;
        if (hostW > 0 && hostH > 0) {
            surface.style.transform = 'scale(' + String(Math.min(hostW / width, hostH / height)) + ')';
        }
    }

    /**
     * Applies the current frame geometry to one row.
     *
     * @private
     * @param {ThumbItem} item - Row
     * @returns {void}
     */
    private applyFrameStyles(item: ThumbItem): void {
        // Stay inside the button border box (2px border each side, no inner gap).
        // The row width is what is left after the slide number, gaps, list
        // padding and scrollbar gutter, so the height is derived from the
        // frame's real width through the slide aspect ratio. A height computed
        // from the panel width alone overshoots and leaves blank space below
        // the slide.
        item.frame.style.width = '100%';
        item.frame.style.maxWidth = '100%';
        item.frame.style.height = 'auto';
        item.frame.style.setProperty('aspect-ratio', String(this.frameAspectRatio));
        item.frame.style.boxSizing = 'border-box';
        // Absolute fill: a percentage height would not resolve against an
        // aspect-ratio derived frame height.
        item.content.style.position = 'absolute';
        item.content.style.top = '0';
        item.content.style.left = '0';
        item.content.style.width = '100%';
        item.content.style.height = '100%';
        item.content.style.transform = 'scale(1)';
        item.content.style.transformOrigin = 'top left';
    }

    /**
     * Applies panel width styles.
     *
     * @private
     * @param {number} widthPx - Requested width
     * @returns {void}
     */
    private applyWidth(widthPx: number): void {
        if (!this.container || !this.resizeHandle) {
            return;
        }
        const clamped: number = clampPanelWidth(widthPx);
        if (!this.container.classList.contains('ej2-pptx-slide-panel--collapsed')) {
            this.container.style.width = String(clamped) + 'px';
            this.container.style.minWidth = String(clamped) + 'px';
            this.container.style.maxWidth = String(clamped) + 'px';
        }
        this.resizeHandle.setAttribute('aria-valuenow', String(clamped));
    }

    /**
     * Applies expanded/collapsed classes. Expand/collapse is owned by the View tab.
     *
     * @private
     * @param {boolean} visible - Expanded when true
     * @param {boolean} announce - Whether to announce
     * @returns {void}
     */
    private applyVisibility(visible: boolean, announce: boolean): void {
        if (!this.container || !this.root) {
            return;
        }
        if (visible) {
            this.container.classList.remove('ej2-pptx-slide-panel--collapsed');
            this.root.classList.remove('ej2-pptx-thumbnail-panel--collapsed');
            this.applyWidth(this.host.thumbnailPanelWidth);
            if (this.resizeHandle) {
                this.resizeHandle.hidden = false;
            }
            if (this.list) {
                this.list.hidden = false;
            }
            if (this.virtualizer && this.virtualizer.isVirtual()) {
                // The list had no layout box while hidden: re-measure and bring
                // the active slide back into the window.
                this.virtualizer.refreshLayout();
                this.syncActiveAndFocus(true);
            }
        } else {
            this.container.classList.add('ej2-pptx-slide-panel--collapsed');
            this.root.classList.add('ej2-pptx-thumbnail-panel--collapsed');
            this.container.style.width = '0px';
            this.container.style.minWidth = '0px';
            this.container.style.maxWidth = '0px';
            if (this.resizeHandle) {
                this.resizeHandle.hidden = true;
            }
            if (this.list) {
                this.list.hidden = true;
            }
        }
        if (announce) {
            this.host.announce(
                visible ? 'Thumbnail panel expanded' : 'Thumbnail panel collapsed'
            );
        }
    }

    /**
     * Thumbnail activation (click).
     *
     * @private
     * @param {number} index - Slide index
     * @returns {void}
     */
    private onThumbActivate(index: number): void {
        this.focusIndex = index;
        this.host.goToSlide(index);
    }

    /**
     * List keyboard: Up/Down navigate the preview immediately. Home/End jump
     * to the first or last slide. Enter/Space re-select the focused slide.
     *
     * Focus and the active highlight stay on the same thumbnail so arrow keys
     * never leave a second selector on the previously previewed slide.
     *
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {void}
     */
    private onListKeyDown(e: KeyboardEvent): void {
        if (this.slideTotal === 0) {
            return;
        }
        const key: string = e.key;
        if (key === 'ArrowDown' || key === 'ArrowRight') {
            e.preventDefault();
            this.navigateBy(1);
            return;
        }
        if (key === 'ArrowUp' || key === 'ArrowLeft') {
            e.preventDefault();
            this.navigateBy(-1);
            return;
        }
        if (key === 'Home') {
            e.preventDefault();
            this.navigateTo(0);
            return;
        }
        if (key === 'End') {
            e.preventDefault();
            this.navigateTo(this.slideTotal - 1);
            return;
        }
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            this.navigateTo(this.focusIndex);
        }
    }

    /**
     * Navigates the preview by a slide delta and keeps focus on that slide.
     *
     * @private
     * @param {number} delta - +1 / -1
     * @returns {void}
     */
    private navigateBy(delta: number): void {
        this.navigateTo(this.clampIndex(this.host.slideIndex + delta));
    }

    /**
     * Selects a slide for preview and moves the single thumbnail selector.
     *
     * @private
     * @param {number} index - 0-based slide index
     * @returns {void}
     */
    private navigateTo(index: number): void {
        const next: number = this.clampIndex(index);
        this.focusIndex = next;
        this.host.goToSlide(next);
        // Hosts that update slideIndex inside goToSlide also notify
        // onSlideIndexChanged. Sync here so the active highlight cannot lag
        // the focused thumbnail when that notification is deferred.
        this.syncActiveAndFocus(true);
        this.focusCurrent();
    }

    /**
     * Focuses the button for {@link focusIndex}, mounting its row first when
     * it is outside the virtualization window.
     *
     * @private
     * @returns {void}
     */
    private focusCurrent(): void {
        this.revealIndex(this.focusIndex);
        this.updateTabStops();
        const item: ThumbItem | undefined = this.views.get(this.focusIndex);
        if (item) {
            item.button.focus({ preventScroll: true });
            this.scrollItemIntoView(item, false);
        }
    }

    /**
     * Index whose button carries `tabindex="0"`: the focused slide, or the
     * first mounted row when that slide is virtualized away, so the list stays
     * reachable with the Tab key.
     *
     * @private
     * @returns {number} Slide index
     */
    private tabStopIndex(): number {
        if (this.views.has(this.focusIndex) || !this.virtualizer) {
            return this.focusIndex;
        }
        return this.virtualizer.getWindow().start;
    }

    /**
     * Roving tabindex: one tab stop among thumbs.
     *
     * @private
     * @returns {void}
     */
    private updateTabStops(): void {
        const stop: number = this.tabStopIndex();
        this.views.forEach((item: ThumbItem, index: number): void => {
            item.button.tabIndex = index === stop ? 0 : -1;
        });
    }

    /**
     * Applies active classes / aria-current to the mounted rows.
     *
     * @private
     * @returns {void}
     */
    private applyActiveState(): void {
        const active: number = this.clampIndex(this.host.slideIndex);
        this.views.forEach((item: ThumbItem, index: number): void => {
            const isActive: boolean = index === active;
            item.root.classList.toggle(
                'ej2-pptx-thumbnail-panel__item--active',
                isActive
            );
            item.button.classList.toggle(
                'ej2-pptx-thumbnail-panel__thumb--active',
                isActive
            );
            if (isActive) {
                item.button.setAttribute('aria-current', 'true');
            } else {
                item.button.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Active highlight + aria-current + optional scroll.
     *
     * @private
     * @param {boolean} scrollIfNeeded - Scroll active into view when not visible
     * @returns {void}
     */
    private syncActiveAndFocus(scrollIfNeeded: boolean): void {
        const active: number = this.clampIndex(this.host.slideIndex);
        this.focusIndex = this.clampIndex(this.focusIndex);
        if (scrollIfNeeded) {
            // Mount the active row first (virtualized decks) so the highlight
            // and scroll below act on a real element.
            this.revealIndex(active);
        }
        this.applyActiveState();
        this.updateTabStops();
        const item: ThumbItem | undefined = this.views.get(active);
        if (scrollIfNeeded && item) {
            this.scrollItemIntoView(item, true);
            // Ensure active thumb content is prepared even if off-screen briefly
            this.ensureRendered(item);
        }
    }

    /**
     * Brings a slide's row into the mounted window by scrolling the virtual
     * list ("nearest" semantics, so an already visible row never moves).
     * No-op for non-virtualized decks, where every row exists and native
     * scrolling is used.
     *
     * @private
     * @param {number} index - 0-based slide index
     * @returns {void}
     */
    private revealIndex(index: number): void {
        if (this.virtualizer && this.virtualizer.isVirtual()) {
            this.virtualizer.scrollToIndex(index);
        }
    }

    /**
     * Scrolls a row into view when not fully visible.
     *
     * @private
     * @param {ThumbItem} item - Target item
     * @param {boolean} onlyIfNeeded - Skip when already fully visible
     * @returns {void}
     */
    private scrollItemIntoView(item: ThumbItem, onlyIfNeeded: boolean): void {
        if (!this.list) {
            return;
        }
        if (this.virtualizer && this.virtualizer.isVirtual()) {
            // scrollToIndex already positioned the list ("nearest").
            return;
        }
        if (onlyIfNeeded) {
            const listRect: ClientRect | DOMRect = this.list.getBoundingClientRect();
            const itemRect: ClientRect | DOMRect = item.root.getBoundingClientRect();
            const fullyVisible: boolean =
        itemRect.top >= listRect.top && itemRect.bottom <= listRect.bottom;
            if (fullyVisible) {
                return;
            }
        }
        if (typeof item.root.scrollIntoView === 'function') {
            item.root.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }

    /**
     * Clamps index into [0, count-1] or 0 when empty.
     *
     * @private
     * @param {number} index - Raw index
     * @returns {number} Clamped index
     */
    private clampIndex(index: number): number {
        if (this.slideTotal === 0) {
            return 0;
        }
        if (!Number.isFinite(index)) {
            return 0;
        }
        return Math.min(this.slideTotal - 1, Math.max(0, Math.floor(index)));
    }

    /**
     * Resize drag start.
     *
     * @private
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private onResizePointerDown(e: MouseEvent): void {
        if (e.button !== 0) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.resizing = true;
        this.resizeStartX = e.clientX;
        this.resizeStartWidth = clampPanelWidth(this.host.thumbnailPanelWidth);
        if (this.container) {
            this.container.classList.add('ej2-pptx-slide-panel--resizing');
        }
        document.addEventListener('mousemove', this.onResizeMoveBound);
        document.addEventListener('mouseup', this.onResizeUpBound);
    }

    /**
     * Resize drag move.
     *
     * @private
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private onResizePointerMove(e: MouseEvent): void {
        if (!this.resizing) {
            return;
        }
        const delta: number = (this.host.enableRtl ? -1 : 1) * (e.clientX - this.resizeStartX);
        const next: number = clampPanelWidth(this.resizeStartWidth + delta);
        this.host.setThumbnailPanelWidth(next);
    }

    /**
     * Resize drag end.
     *
     * @private
     * @returns {void}
     */
    private onResizePointerUp(): void {
        if (!this.resizing) {
            return;
        }
        this.resizing = false;
        if (this.container) {
            this.container.classList.remove('ej2-pptx-slide-panel--resizing');
        }
        document.removeEventListener('mousemove', this.onResizeMoveBound);
        document.removeEventListener('mouseup', this.onResizeUpBound);
    }

    /**
     * Keyboard resize on separator (Left/Right).
     *
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {void}
     */
    private onResizeKeyDown(e: KeyboardEvent): void {
        const step: number = e.shiftKey ? 20 : 8;
        // In RTL the panel sits on the right, so the arrow directions swap.
        const shrinkKey: string = this.host.enableRtl ? 'ArrowRight' : 'ArrowLeft';
        const growKey: string = this.host.enableRtl ? 'ArrowLeft' : 'ArrowRight';
        if (e.key === shrinkKey) {
            e.preventDefault();
            this.host.setThumbnailPanelWidth(
                clampPanelWidth(this.host.thumbnailPanelWidth - step)
            );
            return;
        }
        if (e.key === growKey) {
            e.preventDefault();
            this.host.setThumbnailPanelWidth(
                clampPanelWidth(this.host.thumbnailPanelWidth + step)
            );
        }
    }

    /**
     * Media query for default visibility when user has not overridden.
     *
     * @private
     * @returns {void}
     */
    private wireMediaQuery(): void {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }
        this.mediaQuery = window.matchMedia(
            '(min-width: ' + String(768) + 'px)'
        );
        if (typeof this.mediaQuery.addEventListener === 'function') {
            this.mediaQuery.addEventListener('change', this.onViewportChangeBound);
        } else {
            const legacyMq: {
                addListener?: (listener: () => void) => void;
            } = this.mediaQuery as {
                addListener?: (listener: () => void) => void;
            };
            if (typeof legacyMq.addListener === 'function') {
                legacyMq.addListener(this.onViewportChangeBound);
            }
        }
    }

    /**
     * Re-evaluates the responsive default after the host element was resized.
     *
     * @returns {void}
     */
    public onHostResized(): void {
        this.applyResponsiveDefaultIfNeeded();
    }

    /**
     * Applies desktop/mobile default when user has not toggled.
     *
     * @private
     * @returns {void}
     */
    private applyResponsiveDefaultIfNeeded(): void {
        if (this.userVisibilityOverride) {
            return;
        }
        const hostWidth: number = this.host.element ? this.host.element.clientWidth : 0;
        const width: number = hostWidth > 0
            ? hostWidth
            : (typeof window !== 'undefined' ? window.innerWidth : 1024);
        const desktop: boolean = isDesktopViewport(width);
        if (desktop !== this.host.thumbnailPanelVisible) {
            // An automatic flip is not a user choice: keep responsive behaviour armed.
            this.host.setThumbnailPanelVisible(desktop);
            this.userVisibilityOverride = false;
        }
    }

    /**
     * Hides the panel by default on mobile-width hosts so the slide gets the full
     * width. Desktop widths and explicit user choices are left untouched.
     *
     * @private
     * @returns {void}
     */
    private collapseOnMobileAtStartup(): void {
        if (this.userVisibilityOverride || !this.host.thumbnailPanelVisible) {
            return;
        }
        const hostWidth: number = this.host.element ? this.host.element.clientWidth : 0;
        const width: number = hostWidth > 0
            ? hostWidth
            : (typeof window !== 'undefined' ? window.innerWidth : 1024);
        if (!isDesktopViewport(width)) {
            this.host.setThumbnailPanelVisible(false);
            this.userVisibilityOverride = false;
        }
    }
}
