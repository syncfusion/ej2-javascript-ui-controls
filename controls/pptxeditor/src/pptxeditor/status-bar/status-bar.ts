/**
 * Status Bar (bottom chrome) for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/status-bar
 *
 * Permanent strip: ‹ Slide N of M › on the left; Notes toggle, slide-show,
 * zoom cluster (− slider + %) and an icon-only Fit button on the right.
 * Host zoom/slide remain single sources of truth.
 */

import { createElement, EventHandler, L10n } from '@syncfusion/ej2-base';
import {
    STATUS_BAR_DESKTOP_MIN_PX,
    STATUS_BAR_ZOOM_SNAPS,
    formatSlideCounter,
    formatStatusZoomLabel,
    isStatusBarDesktop,
    percentForSnapIndex,
    snapIndexForPercent,
    snapZoomPercent,
    stepZoomPercent
} from './layout';
import { createL10n } from '../localization/localization';

/**
 * Host contract implemented by {@link PptxEditor}.
 * @private
 */
export interface StatusBarHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    /** Editor root element. */
    readonly element: HTMLElement;
    /** Current EJ2 locale. */
    readonly locale: string;
    /** 0-based current slide index. */
    slideIndex: number;
    /** Number of slides (≥ 1 when chrome is shown). */
    slideCount: number;
    /** Current zoom percentage (host SoT). */
    zoom: number;
    /**
     * View-mode badge label. Default {@link DEFAULT_VIEW_MODE_LABEL}.
     */
    viewModeLabel: string;
    /**
     * Whether the injectable Magnification module is attached.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * the Fit button, zoom step buttons, and zoom slider are disabled
     * because zoom is inert without the feature.
     */
    hasMagnificationModule?: boolean;
    /**
     * Whether the injectable Navigation module is attached and enabled.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * the previous/next slide buttons stay rendered but disabled, matching
     * the magnification controls.
     */
    hasNavigationModule?: boolean;
    /**
     * Fits the whole slide in the view area.
     */
    fitToWindow(): void;
    /**
     * Sets zoom percentage (host clamps 10–400).
     *
     * @param percent - Requested zoom
     */
    setZoom(percent: number): void;
    /**
     * Announces a status message (editor live region).
     *
     * @param message - Status text
     */
    announce(message: string): void;
    /** Whether the Notes Pane is shown. Optional; absent hosts show an inactive button. */
    readonly notesPaneVisible?: boolean;
    /** Toggles the Notes Pane. Optional; the Notes button is hidden when absent. */
    toggleNotesPane?(): void;
    /** Starts the slide show from the current slide. Optional; the slide-show button is hidden when absent. */
    startSlideShowFromCurrent?(): void;
    /** Navigates to the previous slide. */
    previousSlide(): void;
    /** Navigates to the next slide. */
    nextSlide(): void;
    /** Navigates to a 0-based slide index. */
    goToSlide(index: number): void;
}


/**
 * Bottom status bar chrome module.
 * @constructor
 * @private
 */
export class StatusBar {
    private readonly host: StatusBarHost;
    private container: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private counterEl: HTMLElement | null = null;
    private previousBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private l10n: L10n;
    private slideshowBtn: HTMLButtonElement | null = null;
    private fillEl: HTMLElement | null = null;
    private notesBtn: HTMLButtonElement | null = null;
    private fitBtn: HTMLButtonElement | null = null;
    private zoomOutBtn: HTMLButtonElement | null = null;
    private zoomInBtn: HTMLButtonElement | null = null;
    private sliderEl: HTMLElement | null = null;
    private thumbEl: HTMLElement | null = null;
    private zoomLabelEl: HTMLElement | null = null;
    private initialized: boolean = false;
    private dragging: boolean = false;
    private mediaQuery: MediaQueryList | null = null;

    private onViewportChangeBound: () => void = (): void => {
        this.applyCompactLayout();
    };

    /**
     * @param {MouseEvent} e - Pointer event
     * @returns {void} result
     */
    private onPointerMoveBound: (e: MouseEvent) => void = (e: MouseEvent): void => {
        this.onSliderPointerMove(e);
    };

    private onPointerUpBound: () => void = (): void => {
        this.onSliderPointerUp();
    };

    /**
     * @param {StatusBarHost} host - Editor host
     */
    public constructor(host: StatusBarHost) {
        this.host = host;
        this.l10n = createL10n(host.locale);
    }

    /**
     * Builds status-bar DOM inside `.ej2-pptx-status-bar`.
     *
     * @param {HTMLElement} container - Shell status-bar mount
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
            className: 'ej2-pptx-status-bar__inner',
            attrs: {
                role: 'contentinfo',
                'aria-label': 'Presentation status'
            }
        });
        this.root = root;

        const left: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__left'
        });
        const counter: HTMLElement = createElement('span', {
            className: 'ej2-pptx-status-bar__counter',
            attrs: {
                'aria-live': 'polite'
            }
        });
        this.counterEl = counter;
        const previous: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-status-bar__slide-nav',
            attrs: { type: 'button', 'aria-label': this.l10n.getConstant('PreviousSlide'),
                title: this.l10n.getConstant('PreviousSlide') }
        }) as HTMLButtonElement;
        previous.textContent = '\u2039';
        this.previousBtn = previous;
        const next: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-status-bar__slide-nav',
            attrs: { type: 'button', 'aria-label': this.l10n.getConstant('NextSlide'),
                title: this.l10n.getConstant('NextSlide') }
        }) as HTMLButtonElement;
        next.textContent = '\u203a';
        this.nextBtn = next;
        left.appendChild(previous);
        left.appendChild(counter);
        left.appendChild(next);

        const right: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__right'
        });

        const fitBtn: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-status-bar__fit',
            attrs: {
                type: 'button',
                title: this.l10n.getConstant('FitToWindow'),
                'aria-label': this.l10n.getConstant('FitToWindow')
            }
        }) as HTMLButtonElement;
        fitBtn.appendChild(this.createIcon([
            'M2 6V2h4', 'M10 2h4v4', 'M14 10v4h-4', 'M6 14H2v-4'
        ]));
        this.fitBtn = fitBtn;
        if (this.host.toggleNotesPane) {
            const notesBtn: HTMLButtonElement = createElement('button', {
                className: 'ej2-pptx-status-bar__notes',
                attrs: {
                    type: 'button',
                    title: this.l10n.getConstant('Notes'),
                    'aria-label': this.l10n.getConstant('Notes'),
                    'aria-pressed': 'false'
                }
            }) as HTMLButtonElement;
            const notesIcon: HTMLElement = createElement('span', {
                className: 'ej2-pptx-status-bar__notes-icon',
                attrs: { 'aria-hidden': 'true' }
            });
            notesIcon.appendChild(this.createIcon([
                'M4 1.5h5.5L12.5 4.5V14.5H4Z', 'M9.5 1.5v3h3', 'M6 8h4.5', 'M6 10.5h4.5'
            ]));
            const notesText: HTMLElement = createElement('span', {
                className: 'ej2-pptx-status-bar__notes-label'
            });
            notesText.textContent = this.l10n.getConstant('Notes');
            notesBtn.appendChild(notesIcon);
            notesBtn.appendChild(notesText);
            this.notesBtn = notesBtn;
            right.appendChild(notesBtn);
        }
        if (this.host.startSlideShowFromCurrent) {
            const showBtn: HTMLButtonElement = createElement('button', {
                className: 'ej2-pptx-status-bar__slideshow',
                attrs: {
                    type: 'button',
                    title: this.l10n.getConstant('StartSlideShow'),
                    'aria-label': this.l10n.getConstant('StartSlideShow')
                }
            }) as HTMLButtonElement;
            showBtn.appendChild(this.createIcon([
                'M2 3h12v8.5H2Z', 'M8 11.5V14', 'M5.5 14h5', 'M6.8 5.4v3.7l3.2-1.85Z'
            ]));
            this.slideshowBtn = showBtn;
            right.appendChild(showBtn);
        }
        right.appendChild(createElement('span', {
            className: 'ej2-pptx-status-bar__divider',
            attrs: { 'aria-hidden': 'true' }
        }));

        const zoomOutBtn: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-status-bar__zoom-btn ej2-pptx-status-bar__zoom-out',
            attrs: {
                type: 'button',
                title: this.l10n.getConstant('ZoomOut'),
                'aria-label': this.l10n.getConstant('ZoomOut')
            }
        }) as HTMLButtonElement;
        zoomOutBtn.textContent = '\u2212';
        this.zoomOutBtn = zoomOutBtn;
        right.appendChild(zoomOutBtn);

        const slider: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__slider',
            attrs: {
                role: 'slider',
                tabindex: '0',
                'aria-label': 'Zoom',
                'aria-valuemin': String(STATUS_BAR_ZOOM_SNAPS[0]),
                'aria-valuemax': String(
                    STATUS_BAR_ZOOM_SNAPS[STATUS_BAR_ZOOM_SNAPS.length - 1]
                ),
                'aria-orientation': 'horizontal'
            }
        });
        this.sliderEl = slider;

        const track: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__slider-track',
            attrs: { 'aria-hidden': 'true' }
        });
        const fill: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__slider-fill',
            attrs: { 'aria-hidden': 'true' }
        });
        this.fillEl = fill;
        track.appendChild(fill);
        const thumb: HTMLElement = createElement('div', {
            className: 'ej2-pptx-status-bar__slider-thumb',
            attrs: { 'aria-hidden': 'true' }
        });
        this.thumbEl = thumb;
        track.appendChild(thumb);
        slider.appendChild(track);
        right.appendChild(slider);

        const zoomInBtn: HTMLButtonElement = createElement('button', {
            className: 'ej2-pptx-status-bar__zoom-btn ej2-pptx-status-bar__zoom-in',
            attrs: {
                type: 'button',
                title: this.l10n.getConstant('ZoomIn'),
                'aria-label': this.l10n.getConstant('ZoomIn')
            }
        }) as HTMLButtonElement;
        zoomInBtn.textContent = '+';
        this.zoomInBtn = zoomInBtn;
        right.appendChild(zoomInBtn);

        const zoomLabel: HTMLElement = createElement('span', {
            className: 'ej2-pptx-status-bar__zoom-label',
            attrs: {
                'aria-live': 'polite'
            }
        });
        this.zoomLabelEl = zoomLabel;
        right.appendChild(zoomLabel);
        right.appendChild(fitBtn);

        root.appendChild(left);
        root.appendChild(right);
        container.appendChild(root);

        if (this.notesBtn) {
            EventHandler.add(this.notesBtn, 'click', this.onNotesClick, this);
        }
        EventHandler.add(fitBtn, 'click', this.onFitClick, this);
        EventHandler.add(previous, 'click', this.onPreviousClick, this);
        EventHandler.add(next, 'click', this.onNextClick, this);
        if (this.slideshowBtn) {
            EventHandler.add(this.slideshowBtn, 'click', this.onSlideShowClick, this);
        }
        EventHandler.add(zoomOutBtn, 'click', this.onZoomOutClick, this);
        EventHandler.add(zoomInBtn, 'click', this.onZoomInClick, this);
        EventHandler.add(slider, 'keydown', this.onSliderKeyDown, this);
        EventHandler.add(slider, 'mousedown', this.onSliderPointerDown, this);
        EventHandler.add(slider, 'click', this.onSliderClick, this);

        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            this.mediaQuery = window.matchMedia(
                '(min-width: ' + String(STATUS_BAR_DESKTOP_MIN_PX) + 'px)'
            );
            if (typeof this.mediaQuery.addEventListener === 'function') {
                this.mediaQuery.addEventListener('change', this.onViewportChangeBound);
            } else if (typeof this.mediaQuery.addListener === 'function') {
                this.mediaQuery.addListener(this.onViewportChangeBound);
            }
        }

        this.initialized = true;
        this.refresh();
    }

    /**
     * Rebuilds the status bar so every label uses the host's current locale.
     *
     * @returns {void}
     */
    public refreshLocale(): void {
        const container: HTMLElement | null = this.container;
        if (!container || !this.initialized) {
            return;
        }
        this.l10n = createL10n(this.host.locale);
        this.destroy();
        this.initialize(container);
    }

    /**
     * Full refresh: counter, zoom, compact layout.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.initialized) {
            return;
        }
        this.refreshSlideCounter();
        this.refreshZoom();
        this.refreshNotesState();
        this.applyCompactLayout();
    }

    /**
     * Projects the Notes Pane visibility onto the Notes button (active state).
     *
     * @returns {void}
     */
    public refreshNotesState(): void {
        if (!this.notesBtn) {
            return;
        }
        const active: boolean = this.host.notesPaneVisible === true;
        this.notesBtn.classList.toggle('ej2-pptx-status-bar__notes--active', active);
        this.notesBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }

    /**
     * Creates a small decorative inline SVG icon (16x16 stroked paths).
     *
     * @param {string[]} paths - SVG path data strings
     * @returns {Element} Icon element
     */
    private createIcon(paths: string[]): Element {
        const ns: string = 'http://www.w3.org/2000/svg';
        const svg: Element = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.3');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        for (const d of paths) {
            const path: Element = document.createElementNS(ns, 'path');
            path.setAttribute('d', d);
            svg.appendChild(path);
        }
        return svg;
    }

    private onSlideShowClick(): void {
        if (this.host.startSlideShowFromCurrent) {
            this.host.startSlideShowFromCurrent();
        }
    }

    private onNotesClick(): void {
        if (this.host.toggleNotesPane) {
            this.host.toggleNotesPane();
        }
    }

    /**
     * Updates the left slide counter from the host.
     *
     * @returns {void}
     */
    public refreshSlideCounter(): void {
        if (!this.counterEl) {
            return;
        }
        this.counterEl.textContent = formatSlideCounter(
            this.host.slideIndex,
            this.host.slideCount,
            this.l10n.getConstant('SlideCounter')
        );
        this.applyNavigationAvailability();
    }

    /**
     * Enables or disables the previous/next slide buttons from the host
     * Navigation feature flag.
     *
     * Slide navigation is inert without the injectable Navigation module; the
     * buttons stay rendered (layout stability) but disabled while the feature
     * is absent, and are re-enabled when it attaches. While available, the
     * buttons still disable at the first and last slide.
     *
     * @returns {void}
     */
    /**
     * Re-applies previous/next enabled state from the host Navigation flag.
     *
     * @returns {void}
     */
    public refreshNavigationState(): void {
        this.applyNavigationAvailability();
    }

    private applyNavigationAvailability(): void {
        const available: boolean = this.host.hasNavigationModule !== false;
        if (this.previousBtn) {
            this.previousBtn.disabled = !available || this.host.slideIndex <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = !available || this.host.slideIndex >= this.host.slideCount - 1;
        }
    }

    /**
     * Updates zoom % label and slider position from host.zoom.
     * Does not call setZoom (passive display, including non-snap fit values).
     *
     * @returns {void}
     */
    public refreshZoom(): void {
        const zoom: number = this.host.zoom;
        if (this.zoomLabelEl) {
            this.zoomLabelEl.textContent = formatStatusZoomLabel(zoom);
        }
        this.applyZoomAvailability();
        this.applySliderVisual(snapIndexForPercent(zoom), zoom);
    }

    /**
     * Enables or disables the Fit / zoom step / zoom slider controls from the
     * host `magnificationAvailable` flag.
     *
     * Zoom is inert without the injectable Magnification module; the controls
     * stay rendered (layout stability) but disabled while the feature is
     * absent, and are re-enabled when it attaches.
     *
     * @returns {void}
     */
    private applyZoomAvailability(): void {
        const available: boolean = this.host.hasMagnificationModule !== false;
        if (this.fitBtn) {
            this.fitBtn.disabled = !available;
        }
        if (this.zoomOutBtn) {
            this.zoomOutBtn.disabled = !available;
        }
        if (this.zoomInBtn) {
            this.zoomInBtn.disabled = !available;
        }
        if (this.sliderEl) {
            this.setZoomSliderDisabled(this.sliderEl, !available);
        }
    }

    /**
     * Projects a disabled state onto the zoom slider host.
     *
     * @param {HTMLElement} slider - Slider mount element
     * @param {boolean} disabled - True to disable
     * @returns {void}
     */
    private setZoomSliderDisabled(slider: HTMLElement, disabled: boolean): void {
        slider.classList.toggle('ej2-pptx-status-bar__zoom-disabled', disabled);
        if (disabled) {
            slider.setAttribute('aria-disabled', 'true');
        } else {
            slider.removeAttribute('aria-disabled');
        }
    }

    /**
     * Tears down listeners and clears mount children.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.previousBtn) {
            EventHandler.remove(this.previousBtn, 'click', this.onPreviousClick);
        }
        if (this.nextBtn) {
            EventHandler.remove(this.nextBtn, 'click', this.onNextClick);
        }
        if (this.slideshowBtn) {
            EventHandler.remove(this.slideshowBtn, 'click', this.onSlideShowClick);
        }
        if (this.notesBtn) {
            EventHandler.remove(this.notesBtn, 'click', this.onNotesClick);
        }
        if (this.fitBtn) {
            EventHandler.remove(this.fitBtn, 'click', this.onFitClick);
        }
        if (this.zoomOutBtn) {
            EventHandler.remove(this.zoomOutBtn, 'click', this.onZoomOutClick);
        }
        if (this.zoomInBtn) {
            EventHandler.remove(this.zoomInBtn, 'click', this.onZoomInClick);
        }
        if (this.sliderEl) {
            EventHandler.remove(this.sliderEl, 'keydown', this.onSliderKeyDown);
            EventHandler.remove(this.sliderEl, 'mousedown', this.onSliderPointerDown);
            EventHandler.remove(this.sliderEl, 'click', this.onSliderClick);
        }
        this.detachDragListeners();

        if (this.mediaQuery) {
            if (typeof this.mediaQuery.removeEventListener === 'function') {
                this.mediaQuery.removeEventListener('change', this.onViewportChangeBound);
            } else if (typeof this.mediaQuery.removeListener === 'function') {
                this.mediaQuery.removeListener(this.onViewportChangeBound);
            }
            this.mediaQuery = null;
        }

        if (this.container) {
            this.container.innerHTML = '';
        }

        this.container = null;
        this.root = null;
        this.counterEl = null;
        this.previousBtn = null;
        this.nextBtn = null;
        this.slideshowBtn = null;
        this.fillEl = null;
        this.notesBtn = null;
        this.fitBtn = null;
        this.zoomOutBtn = null;
        this.zoomInBtn = null;
        this.sliderEl = null;
        this.thumbEl = null;
        this.zoomLabelEl = null;
        this.initialized = false;
        this.dragging = false;
    }

    /**
     * Applies compact class when viewport is below desktop min.
     *
     * @private
     * @returns {void}
     */
    private applyCompactLayout(): void {
        if (!this.root) {
            return;
        }
        let width: number = STATUS_BAR_DESKTOP_MIN_PX;
        if (this.host.element && this.host.element.clientWidth > 0) {
            width = this.host.element.clientWidth;
        } else if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
            width = window.innerWidth;
        }
        const desktop: boolean = isStatusBarDesktop(width);
        if (desktop) {
            this.root.classList.remove('ej2-pptx-status-bar__inner--compact');
        } else {
            this.root.classList.add('ej2-pptx-status-bar__inner--compact');
        }
    }

    /**
     * Positions the thumb and updates ARIA from snap index / display zoom.
     *
     * @private
     * @param {number} snapIndex - Index into snap table
     * @param {number} displayZoom - Actual host zoom for aria-valuenow/text
     * @returns {void}
     */
    private applySliderVisual(snapIndex: number, displayZoom: number): void {
        if (!this.sliderEl || !this.thumbEl) {
            return;
        }
        const snaps: number[] = STATUS_BAR_ZOOM_SNAPS;
        const maxIndex: number = snaps.length - 1;
        const idx: number = Math.min(maxIndex, Math.max(0, snapIndex));
        const pct: number = maxIndex > 0 ? (idx / maxIndex) * 100 : 0;
        if (this.host.enableRtl) {
            this.thumbEl.style.left = '';
            this.thumbEl.style.right = String(pct) + '%';
        } else {
            this.thumbEl.style.right = '';
            this.thumbEl.style.left = String(pct) + '%';
        }
        if (this.fillEl) {
            this.fillEl.style.width = String(pct) + '%';
        }

        const snapValue: number = snaps[idx];
        const now: number =
      typeof displayZoom === 'number' && Number.isFinite(displayZoom)
          ? Math.round(displayZoom)
          : snapValue;
        this.sliderEl.setAttribute('aria-valuenow', String(now));
        this.sliderEl.setAttribute(
            'aria-valuetext',
            formatStatusZoomLabel(now)
        );
    }

    /**
     * User Fit to window.
     *
     * @private
     * @returns {void}
     */
    private onFitClick(): void {
        this.host.fitToWindow();
    }

    private onPreviousClick(): void {
        if (this.host.hasNavigationModule === false) {
            return;
        }
        this.host.previousSlide();
    }

    private onNextClick(): void {
        if (this.host.hasNavigationModule === false) {
            return;
        }
        this.host.nextSlide();
    }

    /**
     * Decreases zoom by 10 percentage points (not a slider snap).
     *
     * @private
     * @returns {void}
     */
    private onZoomOutClick(): void {
        this.host.setZoom(stepZoomPercent(this.host.zoom, -1));
        this.refreshZoom();
    }

    /**
     * Increases zoom by 10 percentage points (not a slider snap).
     *
     * @private
     * @returns {void}
     */
    private onZoomInClick(): void {
        this.host.setZoom(stepZoomPercent(this.host.zoom, 1));
        this.refreshZoom();
    }

    /**
     * Slider keyboard: arrows / Home / End.
     *
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {void}
     */
    private onSliderKeyDown(e: KeyboardEvent): void {
        const key: string = e.key;
        let index: number = snapIndexForPercent(this.host.zoom);
        const rtl: boolean = !!this.host.enableRtl;
        const decKey: string = rtl ? 'ArrowRight' : 'ArrowLeft';
        const incKey: string = rtl ? 'ArrowLeft' : 'ArrowRight';
        // Vertical arrows navigate slides (same as the preview and thumbnail
        // list). Only the horizontal pair adjusts zoom, so a focused slider
        // cannot leave slide navigation on Enter.
        if (key === decKey) {
            index = Math.max(0, index - 1);
        } else if (key === incKey) {
            index = Math.min(STATUS_BAR_ZOOM_SNAPS.length - 1, index + 1);
        } else if (key === 'Home') {
            index = 0;
        } else if (key === 'End') {
            index = STATUS_BAR_ZOOM_SNAPS.length - 1;
        } else {
            return;
        }
        e.preventDefault();
        this.commitSnapIndex(index);
    }

    /**
     * Starts drag on the slider track/thumb.
     *
     * @private
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private onSliderPointerDown(e: MouseEvent): void {
        if (e.button !== 0) {
            return;
        }
        e.preventDefault();
        this.dragging = true;
        this.updateSnapFromClientX(e.clientX);
        if (typeof document !== 'undefined') {
            document.addEventListener('mousemove', this.onPointerMoveBound);
            document.addEventListener('mouseup', this.onPointerUpBound);
        }
    }

    /**
     * Click on track (non-drag) also snaps.
     *
     * @private
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private onSliderClick(e: MouseEvent): void {
        if (this.dragging) {
            return;
        }
        this.updateSnapFromClientX(e.clientX);
    }

    /**
     * @private
     * @param {MouseEvent} e - Mouse move
     * @returns {void}
     */
    private onSliderPointerMove(e: MouseEvent): void {
        if (!this.dragging) {
            return;
        }
        this.updateSnapFromClientX(e.clientX);
    }

    /**
     * @private
     * @returns {void}
     */
    private onSliderPointerUp(): void {
        this.dragging = false;
        this.detachDragListeners();
    }

    /**
     * @private
     * @returns {void}
     */
    private detachDragListeners(): void {
        if (typeof document === 'undefined') {
            return;
        }
        document.removeEventListener('mousemove', this.onPointerMoveBound);
        document.removeEventListener('mouseup', this.onPointerUpBound);
    }

    /**
     * Maps client X on the slider to a snap index and commits via setZoom.
     *
     * @private
     * @param {number} clientX - Pointer X
     * @returns {void}
     */
    private updateSnapFromClientX(clientX: number): void {
        if (!this.sliderEl) {
            return;
        }
        const rect: ClientRect | DOMRect = this.sliderEl.getBoundingClientRect();
        const width: number = rect.width > 0 ? rect.width : 1;
        let ratio: number = this.host.enableRtl
            ? (rect.right - clientX) / width
            : (clientX - rect.left) / width;
        if (ratio < 0) {
            ratio = 0;
        } else if (ratio > 1) {
            ratio = 1;
        }
        const maxIndex: number = STATUS_BAR_ZOOM_SNAPS.length - 1;
        const index: number = Math.round(ratio * maxIndex);
        this.commitSnapIndex(index);
    }

    /**
     * Calls host.setZoom with the snap percent and refreshes display.
     *
     * @private
     * @param {number} index - Snap index
     * @returns {void}
     */
    private commitSnapIndex(index: number): void {
        const percent: number = percentForSnapIndex(index);
        const snapped: number = snapZoomPercent(percent);
        this.host.setZoom(snapped);
        // Host may clamp; re-read for label. Visual uses snap index we intended.
        this.refreshZoom();
    }
}
