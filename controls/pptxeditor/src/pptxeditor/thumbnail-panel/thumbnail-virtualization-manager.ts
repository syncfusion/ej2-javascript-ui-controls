/**
 * Thumbnail virtualization for the EJ2 PowerPoint Editor thumbnail pane.
 *
 * @module @syncfusion/ej2-pptxeditor/thumbnail-panel/thumbnail-virtualization-manager
 *
 * Only the thumbnails inside the scroll viewport plus a small overscan buffer
 * are mounted. Two spacer elements stand in for the unmounted rows above and
 * below the window so the scroll height always represents the full slide count.
 * Slide content is still painted by the existing HTML/CSS/SVG thumbnail
 * pipeline (never canvas); this module only decides *which* rows exist.
 */

/**
 * Number of thumbnails kept mounted above and below the visible range.
 *
 * @internal
 */
export const THUMB_VIRTUALIZATION_OVERSCAN: number = 2;

/**
 * Smallest slide count for which the pane is virtualized. Virtualization is
 * always on: any presentation mounts only the visible window plus overscan.
 *
 * @internal
 */
export const THUMB_VIRTUALIZATION_MIN_SLIDES: number = 1;

/**
 * Viewport height (CSS px) assumed when the list has no layout box yet
 * (collapsed panel, detached host).
 *
 * @internal
 */
export const THUMB_VIRTUALIZATION_FALLBACK_VIEWPORT_PX: number = 600;

/**
 * Inputs of {@link computeThumbnailWindow}.
 *
 * @internal
 */
export interface ThumbnailWindowOptions {
    /** Total number of slides. */
    count: number;
    /** Current `scrollTop` of the list (CSS px). */
    scrollTop: number;
    /** Height of the scroll viewport (CSS px). */
    viewportHeight: number;
    /** Height of one thumbnail row (CSS px). */
    itemHeight: number;
    /** Vertical gap between two rows (CSS px). */
    gap: number;
    /** Space above the first row inside the scroll content (CSS px). */
    leadingOffset: number;
    /** Rows kept above and below the visible range. */
    overscan: number;
}

/**
 * Inclusive range of slide indices that should be mounted.
 * `start > end` denotes an empty window.
 *
 * @internal
 */
export interface ThumbnailWindow {
    /** First mounted slide index (0-based). */
    start: number;
    /** Last mounted slide index (0-based, inclusive). */
    end: number;
}

/**
 * Computes the window of thumbnails to mount from scroll geometry.
 *
 * Row `i` occupies `[leadingOffset + i * pitch, … + itemHeight]` where
 * `pitch = itemHeight + gap`.
 *
 * @param {ThumbnailWindowOptions} options - Scroll geometry
 * @returns {ThumbnailWindow} Inclusive mounted range, empty when there are no slides
 *
 * @internal
 */
export function computeThumbnailWindow(options: ThumbnailWindowOptions): ThumbnailWindow {
    const count: number = Math.max(0, Math.floor(options.count));
    if (count === 0) {
        return { start: 0, end: -1 };
    }
    const pitch: number = options.itemHeight + options.gap;
    if (!(pitch > 0)) {
        return { start: 0, end: count - 1 };
    }
    const overscan: number = Math.max(0, Math.floor(options.overscan));
    const top: number = Math.max(0, options.scrollTop) - options.leadingOffset;
    const bottom: number = top + Math.max(0, options.viewportHeight);
    const firstVisible: number = Math.min(count - 1, Math.max(0, Math.floor(top / pitch)));
    const lastVisible: number = Math.min(count - 1, Math.max(firstVisible, Math.floor(bottom / pitch)));
    return {
        start: Math.max(0, firstVisible - overscan),
        end: Math.min(count - 1, lastVisible + overscan)
    };
}

/**
 * View lifecycle the manager drives; implemented by the thumbnail panel.
 *
 * @internal
 */
export interface ThumbnailVirtualizationDelegate {
    /**
     * Returns the root element of the mounted view for a slide, if any.
     *
     * @param index - 0-based slide index
     */
    getViewElement(index: number): HTMLElement | null;
    /**
     * Creates (or recycles) the view for a slide that entered the window and
     * inserts it before `before` in the list.
     *
     * @param index - 0-based slide index
     * @param before - Node the view must be inserted before
     * @param deferPaint - True when slide content should be painted after scrolling settles
     */
    mountView(index: number, before: Node | null, deferPaint: boolean): void;
    /**
     * Destroys or recycles the view of a slide that left the window.
     *
     * @param index - 0-based slide index
     */
    unmountView(index: number): void;
    /**
     * Called after the mounted window changed, or after the list was resized
     * without a window change (e.g. the hidden panel became visible).
     */
    onWindowChanged(): void;
}

/**
 * Keeps the mounted thumbnail window in sync with the list scroll position.
 *
 * @constructor
 *
 * @internal
 */
export class ThumbnailVirtualizationManager {
    private readonly list: HTMLElement;
    private readonly delegate: ThumbnailVirtualizationDelegate;
    private readonly overscan: number;
    private readonly minSlides: number;
    private readonly topSpacer: HTMLElement;
    private readonly bottomSpacer: HTMLElement;
    private count: number = 0;
    private itemHeight: number = 0;
    private gap: number = 0;
    private leading: number = 0;
    private start: number = 0;
    private end: number = -1;
    private virtual: boolean = false;
    private resizeObserver: ResizeObserver | null = null;
    private disposed: boolean = false;
    private readonly onScrollBound: () => void = (): void => {
        this.update(true);
    };

    /**
     * @param {HTMLElement} list - Scrollable list element that hosts the rows
     * @param {ThumbnailVirtualizationDelegate} delegate - View lifecycle owner
     * @param {number} overscan - Rows kept above/below the visible range
     * @param {number} minSlides - Slide count from which virtualization is active
     *
     * @private
     */
    public constructor(
        list: HTMLElement,
        delegate: ThumbnailVirtualizationDelegate,
        overscan: number = THUMB_VIRTUALIZATION_OVERSCAN,
        minSlides: number = THUMB_VIRTUALIZATION_MIN_SLIDES
    ) {
        this.list = list;
        this.delegate = delegate;
        this.overscan = overscan;
        this.minSlides = minSlides;
        this.topSpacer = this.createSpacer();
        this.bottomSpacer = this.createSpacer();
        list.appendChild(this.topSpacer);
        list.appendChild(this.bottomSpacer);
        list.addEventListener('scroll', this.onScrollBound);
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver((): void => {
                if (!this.update(false)) {
                    this.delegate.onWindowChanged();
                }
            });
            this.resizeObserver.observe(list);
        }
    }

    /**
     * Whether rows are currently being virtualized (any non-empty deck).
     *
     * @returns {boolean} True when only a window of rows is mounted
     *
     * @private
     */
    public isVirtual(): boolean {
        return this.virtual;
    }

    /**
     * Currently mounted inclusive range; `start > end` when empty.
     *
     * @returns {ThumbnailWindow} Mounted range
     *
     * @private
     */
    public getWindow(): ThumbnailWindow {
        return { start: this.start, end: this.end };
    }

    /**
     * Resets the manager for a new slide count: unmounts every view, then
     * mounts the window for the current scroll position.
     *
     * @param {number} count - Total slide count
     * @param {number} itemHeight - Estimated row height (CSS px)
     * @returns {void}
     *
     * @private
     */
    public reset(count: number, itemHeight: number): void {
        this.unmountAll();
        this.count = Math.max(0, Math.floor(count));
        this.itemHeight = itemHeight;
        this.virtual = this.count >= this.minSlides;
        this.measureChrome();
        this.applySpacers();
        this.update(false);
    }

    /**
     * Applies a new row height (panel resized, row measured) while keeping the
     * slide at the top of the viewport anchored.
     *
     * @param {number} itemHeight - Row height (CSS px)
     * @returns {void}
     *
     * @private
     */
    public setItemHeight(itemHeight: number): void {
        if (!(itemHeight > 0) || Math.abs(itemHeight - this.itemHeight) < 0.01) {
            return;
        }
        const oldPitch: number = this.itemHeight + this.gap;
        const anchor: number = this.virtual && oldPitch > 0
            ? (this.list.scrollTop - this.leading) / oldPitch
            : 0;
        this.itemHeight = itemHeight;
        this.measureChrome();
        this.applySpacers();
        if (this.virtual) {
            this.list.scrollTop = Math.max(0, this.leading + anchor * (this.itemHeight + this.gap));
        }
        this.update(false);
    }

    /**
     * Scrolls the list so that a row is fully visible ("nearest" semantics:
     * no movement when it already is) and mounts the resulting window
     * synchronously, so the row exists immediately after the call.
     *
     * @param {number} index - 0-based slide index
     * @returns {void}
     *
     * @private
     */
    public scrollToIndex(index: number): void {
        if (!this.virtual || this.count === 0) {
            return;
        }
        const clamped: number = Math.min(this.count - 1, Math.max(0, Math.floor(index)));
        const top: number = this.leading + clamped * (this.itemHeight + this.gap);
        const bottom: number = top + this.itemHeight;
        const viewTop: number = this.list.scrollTop;
        const viewHeight: number = this.getViewportHeight();
        if (top < viewTop) {
            this.list.scrollTop = top;
        } else if (bottom > viewTop + viewHeight) {
            this.list.scrollTop = bottom - viewHeight;
        }
        this.update(false);
    }

    /**
     * Re-evaluates the window after a layout change (panel shown, resized).
     *
     * @returns {void}
     *
     * @private
     */
    public refreshLayout(): void {
        this.measureChrome();
        this.applySpacers();
        this.update(false);
    }

    /**
     * Mounts/unmounts rows so the mounted range matches the scroll position.
     * Rows already mounted are never touched.
     *
     * @param {boolean} fromScroll - True when triggered by a scroll event
     * @returns {boolean} True when the mounted range changed
     *
     * @private
     */
    public update(fromScroll: boolean): boolean {
        if (this.disposed) {
            return false;
        }
        const next: ThumbnailWindow = this.virtual
            ? computeThumbnailWindow({
                count: this.count,
                scrollTop: this.list.scrollTop,
                viewportHeight: this.getViewportHeight(),
                itemHeight: this.itemHeight,
                gap: this.gap,
                leadingOffset: this.leading,
                overscan: this.overscan
            })
            : { start: 0, end: this.count - 1 };
        if (next.start === this.start && next.end === this.end) {
            return false;
        }
        const prevStart: number = this.start;
        const prevEnd: number = this.end;
        for (let i: number = prevStart; i <= prevEnd; i++) {
            if (i < next.start || i > next.end) {
                this.delegate.unmountView(i);
            }
        }
        this.start = next.start;
        this.end = next.end;
        let entering: number = 0;
        for (let i: number = next.start; i <= next.end; i++) {
            if (i < prevStart || i > prevEnd) {
                entering++;
            }
        }
        // A large jump (fast wheel, scrollbar drag) defers slide painting until
        // scrolling settles; the cheap row shells still mount immediately.
        const deferPaint: boolean = this.virtual && fromScroll && entering > this.overscan * 2;
        // Walk backwards so the next row (or the bottom spacer) is a valid
        // insertion reference for every new row.
        for (let i: number = next.end; i >= next.start; i--) {
            if (i >= prevStart && i <= prevEnd) {
                continue;
            }
            const following: HTMLElement | null = i < next.end ? this.delegate.getViewElement(i + 1) : null;
            this.delegate.mountView(i, following || this.bottomSpacer, deferPaint);
        }
        this.applySpacers();
        this.delegate.onWindowChanged();
        return true;
    }

    /**
     * Unmounts every view and detaches the scroll/resize listeners and
     * spacers. Idempotent.
     *
     * @returns {void}
     *
     * @private
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }
        this.unmountAll();
        this.disposed = true;
        this.list.removeEventListener('scroll', this.onScrollBound);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        this.topSpacer.remove();
        this.bottomSpacer.remove();
    }

    private unmountAll(): void {
        for (let i: number = this.start; i <= this.end; i++) {
            this.delegate.unmountView(i);
        }
        this.start = 0;
        this.end = -1;
    }

    private getViewportHeight(): number {
        return this.list.clientHeight > 0
            ? this.list.clientHeight
            : THUMB_VIRTUALIZATION_FALLBACK_VIEWPORT_PX;
    }

    /**
     * Reads the list padding and row gap from computed style so the spacer
     * math follows whatever theme CSS is loaded.
     *
     * @returns {void}
     */
    private measureChrome(): void {
        if (typeof getComputedStyle !== 'function') {
            return;
        }
        const style: CSSStyleDeclaration = getComputedStyle(this.list);
        const padding: number = parseFloat(style.paddingTop);
        const gap: number = parseFloat(style.rowGap);
        this.leading = Number.isFinite(padding) ? padding : 0;
        this.gap = Number.isFinite(gap) ? gap : 0;
    }

    /**
     * Sizes the spacers so rows + spacers always add up to the full virtual
     * content height. The flex `gap` between a spacer and its neighbour row is
     * subtracted from the spacer height.
     *
     * @returns {void}
     */
    private applySpacers(): void {
        const pitch: number = this.itemHeight + this.gap;
        const above: number = this.end >= this.start ? this.start : 0;
        const below: number = this.end >= this.start ? this.count - 1 - this.end : 0;
        this.setSpacerHeight(this.topSpacer, above > 0 ? above * pitch - this.gap : 0);
        this.setSpacerHeight(this.bottomSpacer, below > 0 ? below * pitch - this.gap : 0);
    }

    private setSpacerHeight(spacer: HTMLElement, height: number): void {
        if (height > 0) {
            spacer.style.display = '';
            spacer.style.height = String(height) + 'px';
        } else {
            spacer.style.display = 'none';
            spacer.style.height = '0px';
        }
    }

    private createSpacer(): HTMLElement {
        const spacer: HTMLElement = document.createElement('div');
        spacer.className = 'ej2-pptx-thumbnail-panel__spacer';
        spacer.setAttribute('aria-hidden', 'true');
        spacer.style.flex = '0 0 auto';
        spacer.style.display = 'none';
        spacer.style.height = '0px';
        spacer.style.width = '100%';
        spacer.style.pointerEvents = 'none';
        return spacer;
    }
}
