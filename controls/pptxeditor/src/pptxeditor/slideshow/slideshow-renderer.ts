/**
 * Slide rendering for the slideshow: scales slides to fit, keeps the aspect
 * ratio, and preloads the neighbouring slides.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow/slideshow-renderer
 */

/** Editor surface the renderer needs. */
export interface SlideRenderHost {
    readonly slideCount: number;
    readonly slideWidthPt: number;
    readonly slideHeightPt: number;
    /** Paints one slide with the shared HTML/CSS/SVG pipeline; may return a disposer. */
    renderThumbnailSlide(index: number, contentHost: HTMLElement): void | (() => void);
}

const PT_TO_PX: number = 96 / 72;

/** One slide painted into a container, scaled to fit it. */
export class SlideMount {
    /** Element holding the painted slide (slide-sized, scaled by CSS transform). */
    public readonly element: HTMLElement;
    private readonly container: HTMLElement;
    private readonly widthPx: number;
    private readonly heightPx: number;
    private disposer: void | (() => void);

    /**
     * @param {SlideRenderHost} host - Editor
     * @param {number} index - Slide to paint
     * @param {HTMLElement} container - Element the slide is fitted into
     */
    public constructor(host: SlideRenderHost, index: number, container: HTMLElement) {
        this.container = container;
        this.widthPx = Math.max(1, host.slideWidthPt * PT_TO_PX);
        this.heightPx = Math.max(1, host.slideHeightPt * PT_TO_PX);
        const el: HTMLElement = document.createElement('div');
        el.className = 'ej2-pptx-slideshow__slide';
        el.setAttribute('data-slide-index', String(index));
        el.setAttribute('aria-hidden', 'true');
        el.style.width = this.widthPx + 'px';
        el.style.height = this.heightPx + 'px';
        container.appendChild(el);
        this.element = el;
        this.disposer = host.renderThumbnailSlide(index, el);
        // The shared painter pre-scales for thumbnails; this mount scales itself.
        const surface: HTMLElement | null = el.querySelector('.ej2-pptx-thumbnail-panel__surface');
        if (surface) {
            surface.style.transform = 'none';
        }
        this.fit();
    }

    /**
     * Recomputes the scale so the whole slide fits the container.
     *
     * @returns {void}
     */
    public fit(): void {
        const w: number = this.container.clientWidth;
        const h: number = this.container.clientHeight;
        const scale: number = w > 0 && h > 0 ? Math.min(w / this.widthPx, h / this.heightPx) : 1;
        this.element.style.transform = 'translate(-50%, -50%) scale(' + String(scale) + ')';
    }

    /**
     * Shows or hides the mount without destroying it.
     *
     * @param {boolean} visible - Target visibility
     * @returns {void}
     */
    public setVisible(visible: boolean): void {
        this.element.style.visibility = visible ? 'visible' : 'hidden';
    }

    /**
     * Cancels painting and removes the DOM.
     *
     * @returns {void}
     */
    public dispose(): void {
        if (typeof this.disposer === 'function') {
            this.disposer();
        }
        this.disposer = undefined;
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

/**
 * Presentation-stage renderer. Only the current slide and its immediate
 * neighbours are kept alive, so memory stays flat for 1000+ slide decks.
 */
export class SlideShowRenderer {
    private readonly host: SlideRenderHost;
    private readonly stage: HTMLElement;
    private mounts: { [index: number]: SlideMount } = {};
    private current: number = -1;
    private resizeHandler: () => void;

    /**
     * @param {SlideRenderHost} host - Editor
     * @param {HTMLElement} stage - Element the slide fills
     */
    public constructor(host: SlideRenderHost, stage: HTMLElement) {
        this.host = host;
        this.stage = stage;
        this.resizeHandler = (): void => this.fitAll();
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Displays a slide and preloads index-1 and index+1.
     *
     * @param {number} index - 0-based slide index
     * @returns {void}
     */
    public show(index: number): void {
        this.current = index;
        const keep: { [index: number]: boolean } = {};
        const wanted: number[] = [index, index + 1, index - 1];
        wanted.forEach((i: number): void => {
            if (i < 0 || i >= this.host.slideCount) {
                return;
            }
            keep[i] = true;
            if (!this.mounts[i]) {
                this.mounts[i] = new SlideMount(this.host, i, this.stage);
                this.mounts[i].setVisible(false);
            }
        });
        Object.keys(this.mounts).forEach((key: string): void => {
            const i: number = Number(key);
            if (!keep[i]) {
                this.mounts[i].dispose();
                delete this.mounts[i];
            } else {
                this.mounts[i].setVisible(i === index);
            }
        });
        this.fitAll();
    }

    /**
     * Hides every slide (used for the end-of-show screen).
     *
     * @returns {void}
     */
    public hideAll(): void {
        Object.keys(this.mounts).forEach((key: string): void => this.mounts[Number(key)].setVisible(false));
    }

    /**
     * Index of the displayed slide.
     *
     * @returns {number} 0-based index, -1 before the first show
     */
    public getCurrent(): number {
        return this.current;
    }

    /**
     * Creates an independent preview of a slide (presenter view).
     *
     * @param {number} index - Slide index
     * @param {HTMLElement} container - Preview container
     * @returns {SlideMount} The mount; the caller disposes it
     */
    public mount(index: number, container: HTMLElement): SlideMount {
        return new SlideMount(this.host, index, container);
    }

    /**
     * Rescales all live slides.
     *
     * @returns {void}
     */
    public fitAll(): void {
        Object.keys(this.mounts).forEach((key: string): void => this.mounts[Number(key)].fit());
    }

    /**
     * Disposes every slide and listener.
     *
     * @returns {void}
     */
    public destroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        Object.keys(this.mounts).forEach((key: string): void => this.mounts[Number(key)].dispose());
        this.mounts = {};
        this.current = -1;
    }
}
