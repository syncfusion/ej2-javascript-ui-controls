/**
 * Injectable SlideShow feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow
 *
 * ```typescript
 * import { PptxEditor, SlideShow } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(SlideShow);
 * const editor = new PptxEditor({ enableSlideShow: true }, '#editor');
 * editor.slideShow.startPresentation(0);
 * ```
 *
 * The module is active only when injected **and** {@link PptxEditor.enableSlideShow}
 * is `true`. It owns a full-screen overlay (black stage, auto-hiding controls,
 * optional Presenter View) and delegates slide painting to the editor's shared
 * HTML/CSS/SVG pipeline. See `docs/slideshow.md`.
 */

import { PptxEditor } from '../pptxeditor';
import { FullscreenManager } from './fullscreen-manager';
import { PresenterView } from './presenter-view';
import { notesToPlainText, NotesSnapshot } from '../notes/notes-model';
import { SlideShowNavigation, SlideShowNavigationHost } from './slideshow-navigation';
import { SlideShowRenderer } from './slideshow-renderer';
import { SlideShowEvents } from './slideshow-events';
import { localize, escapeLocaleHtml } from '../localization/localization';

const CONTROLS_HIDE_MS: number = 3000;
const TOAST_HIDE_MS: number = 3000;
const ICON_PRESENTER: string = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<rect x="1.5" y="2.5" width="13" height="8.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
    '<path d="M5.5 14h5M8 11v3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

/** Supplies speaker notes for a 0-based slide index. */
export type SlideNotesProvider = (index: number) => string;

/**
 * Public slideshow API surface.
 */
export interface SlideShowModule {
    startPresentation(fromSlide?: number): void;
    stopPresentation(): void;
    next(): void;
    previous(): void;
    goToSlide(index: number): void;
    getCurrentSlideIndex(): number;
    isPresentationMode(): boolean;
    openPresenterView(launchedFromDefaultView?: boolean): void;
    closePresenterView(): void;
}

/**
 * Module that owns slideshow playback.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` (`member: 'slideShow'`) and attaches the instance as
 * `slideShowModule` (also exposed as `editor.slideShow`).
 *
 * @constructor
 */
export class SlideShow implements SlideShowModule, SlideShowNavigationHost {
    private readonly parent: PptxEditor;
    private readonly events: SlideShowEvents;
    private readonly navigation: SlideShowNavigation;
    private notesProvider: SlideNotesProvider | null = null;
    /** Plain-text notes loaded from the session for Presenter View, by slide index. */
    private readonly notesCache: Map<number, string> = new Map();
    private readonly notesSnapshots: Map<number, NotesSnapshot> = new Map();
    private readonly notesPending: Set<number> = new Set();
    private root: HTMLElement | null = null;
    private stage: HTMLElement | null = null;
    private controls: HTMLElement | null = null;
    private counterEl: HTMLElement | null = null;
    private endScreen: HTMLElement | null = null;
    private live: HTMLElement | null = null;
    private renderer: SlideShowRenderer | null = null;
    private presenter: PresenterView | null = null;
    /** True when Presenter View was opened straight from the default UI (no slideshow started first). */
    private presenterFromDefaultView: boolean = false;
    private fullscreen: FullscreenManager | null = null;
    private hideTimer: number = 0;
    private toastTimer: number = 0;
    private toastEl: HTMLElement | null = null;
    private active: boolean = false;
    private index: number = 0;
    private returnFocus: Element | null = null;

    /**
     * Creates the SlideShow module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
        this.events = new SlideShowEvents(parent);
        this.navigation = new SlideShowNavigation(this);
    }

    /**
     * Module name used by the EJ2 `ModuleLoader`.
     *
     * @returns {string} `'slideShow'`
     */
    public getModuleName(): string {
        return 'slideShow';
    }

    /**
     * Whether the slideshow feature is enabled on the host editor.
     *
     * @returns {boolean} True while slideshow APIs act on the host
     */
    public isEnabled(): boolean {
        return this.parent.enableSlideShow;
    }

    /**
     * Registers the speaker-notes source used by Presenter View.
     *
     * @param {SlideNotesProvider | null} provider - Returns notes text for a slide index
     * @returns {void}
     */
    public setNotesProvider(provider: SlideNotesProvider | null): void {
        this.notesProvider = provider;
    }

    /**
     * Starts the presentation.
     *
     * @param {number} [fromSlide=0] - 0-based slide to start on (clamped)
     * @returns {void}
     */
    public startPresentation(fromSlide?: number): void {
        const count: number = this.parent.slideCount;
        if (!this.parent.enableSlideShow || this.active) {
            return;
        }
        if (!this.parent.canStartSlideShow || count < 1) {
            this.parent.announce(this.text('CannotStartSlideShow'));
            return;
        }
        const start: number = this.clamp(typeof fromSlide === 'number' && isFinite(fromSlide) ? fromSlide : 0);
        this.returnFocus = document.activeElement;
        this.buildDom();
        this.active = true;
        this.index = start;
        this.navigation.attach(this.root as HTMLElement);
        this.fullscreen = new FullscreenManager(this.root as HTMLElement, (): void => this.stopPresentation());
        this.fullscreen.enter();
        this.renderer = new SlideShowRenderer(this.parent, this.stage as HTMLElement);
        this.renderer.show(start);
        this.refreshControls();
        this.showControls();
        this.showToast();
        (this.root as HTMLElement).focus();
        this.events.raise('presentationStarted', { startIndex: start, slideCount: count });
    }

    /**
     * Stops the presentation and returns to the editor on the last shown slide.
     *
     * @returns {void}
     */
    public stopPresentation(): void {
        if (!this.active) {
            return;
        }
        const last: number = this.index;
        this.notesCache.clear();
        this.notesSnapshots.clear();
        this.notesPending.clear();
        const closedPresenter: boolean = !!(this.presenter && this.presenter.isOpen());
        this.presenterFromDefaultView = false;
        this.active = false;
        window.clearTimeout(this.hideTimer);
        window.clearTimeout(this.toastTimer);
        this.navigation.detach();
        if (this.presenter) {
            this.presenter.close();
            this.presenter = null;
        }
        if (this.renderer) {
            this.renderer.destroy();
            this.renderer = null;
        }
        if (this.fullscreen) {
            this.fullscreen.exit();
            this.fullscreen = null;
        }
        if (this.root && this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
        this.root = this.stage = this.controls = this.counterEl = this.endScreen = this.live = this.toastEl = null;
        this.parent.goToSlide(last);
        const focus: HTMLElement | null = this.returnFocus as HTMLElement | null;
        this.returnFocus = null;
        if (focus && typeof focus.focus === 'function') {
            focus.focus();
        }
        if (closedPresenter) {
            this.events.raise('presenterViewClosed', { currentIndex: last });
        }
        this.events.raise('presentationEnded', { lastIndex: last, slideCount: this.parent.slideCount });
    }

    /**
     * Advances one slide; past the last slide an end-of-show screen is shown
     * and the next advance exits (as PowerPoint does).
     *
     * @returns {void}
     */
    public next(): void {
        if (!this.active) {
            return;
        }
        if (this.endScreen && !this.endScreen.hidden) {
            this.stopPresentation();
        } else if (this.index >= this.parent.slideCount - 1) {
            this.showEndScreen();
            if (this.presenter) {
                this.presenter.update();
            }
        } else {
            this.goToSlide(this.index + 1);
        }
    }

    /**
     * Goes back one slide (clamped at the first).
     *
     * @returns {void}
     */
    public previous(): void {
        if (!this.active) {
            return;
        }
        if (this.endScreen && !this.endScreen.hidden) {
            this.endScreen.hidden = true;
            if (this.renderer) {
                this.renderer.show(this.index);
            }
            this.refreshControls();
            if (this.presenter) {
                this.presenter.update();
            }
            return;
        }
        this.goToSlide(this.index - 1);
    }

    /**
     * Jumps to a 0-based slide (clamped).
     *
     * @param {number} index - Target slide
     * @returns {void}
     */
    public goToSlide(index: number): void {
        if (!this.active || typeof index !== 'number' || !isFinite(index)) {
            return;
        }
        const target: number = this.clamp(index);
        const previous: number = this.index;
        if (this.endScreen) {
            this.endScreen.hidden = true;
        }
        if (target !== previous) {
            this.index = target;
            this.events.raise('slideChanged',
                { previousIndex: previous, newIndex: target, slideCount: this.parent.slideCount });
        }
        (this.renderer as SlideShowRenderer).show(target);
        this.refreshControls();
        if (this.presenter) {
            this.presenter.update();
        }
    }

    /**
     * Current 0-based slide index.
     *
     * @returns {number} Index shown (or last shown)
     */
    public getCurrentSlideIndex(): number {
        return this.active ? this.index : this.parent.slideIndex;
    }

    /**
     * Whether a presentation is running.
     *
     * @returns {boolean} True during playback
     */
    public isPresentationMode(): boolean {
        return this.active;
    }

    /**
     * Returns notes for Presenter View: the custom provider wins, otherwise the
     * session notes are loaded lazily and the panel repaints when they arrive.
     *
     * @param {number} index - 0-based slide index
     * @returns {string} Cached notes text (empty until loaded or when none)
     */
    private resolvePresenterNotes(index: number): string {
        if (this.notesProvider) {
            return this.notesProvider(index) || '';
        }
        const cached: string | undefined = this.notesCache.get(index);
        if (cached !== undefined) {
            return cached;
        }
        if (!this.notesPending.has(index)) {
            this.notesPending.add(index);
            this.parent.requestSlideNotes(index).then((snapshot: NotesSnapshot | undefined): void => {
                this.notesCache.set(index, notesToPlainText(snapshot));
                if (snapshot) {
                    this.notesSnapshots.set(index, snapshot);
                }
            }, (): void => {
                this.notesCache.set(index, '');
            }).then((): void => {
                this.notesPending.delete(index);
                if (this.presenter && this.presenter.isOpen() && this.index === index) {
                    this.presenter.updateNotes();
                }
            });
        }
        return '';
    }

    /**
     * Opens Presenter View over the show.
     *
     * @param {boolean} [launchedFromDefaultView=false] - True when the show was started only to host
     * Presenter View (opened from the default UI); End Show then returns to the default UI instead of the show.
     * @returns {void}
     */
    public openPresenterView(launchedFromDefaultView?: boolean): void {
        if (!this.active || !this.root || (this.presenter && this.presenter.isOpen())) {
            return;
        }
        this.presenterFromDefaultView = !!launchedFromDefaultView;
        this.presenter = new PresenterView({
            enableRtl: this.isRtl(),
            getSlideCount: (): number => this.parent.slideCount,
            getCurrentIndex: (): number => this.index,
            next: (): void => this.next(),
            previous: (): void => this.previous(),
            goTo: (i: number): void => this.goToSlide(i),
            getNotes: (i: number): string => this.resolvePresenterNotes(i),
            getNotesSnapshot: (i: number): NotesSnapshot | undefined => (this.notesProvider ? undefined : this.notesSnapshots.get(i)),
            isEndScreen: (): boolean => !!(this.endScreen && !this.endScreen.hidden),
            close: (): void => this.endPresenterView(),
            getTitle: (): string => this.parent.fileName || this.text('Presentation'),
            getLocale: (): string => this.parent.locale
        }, this.renderer as SlideShowRenderer);
        this.presenter.open(this.root);
        this.root.classList.add('ej2-pptx-slideshow--presenter');
        this.events.raise('presenterViewOpened', { currentIndex: this.index });
    }

    /**
     * Closes Presenter View, keeping the show running.
     *
     * @returns {void}
     */
    public closePresenterView(): void {
        if (!this.presenter || !this.presenter.isOpen()) {
            return;
        }
        this.presenter.close();
        this.presenter = null;
        this.presenterFromDefaultView = false;
        if (this.root) {
            this.root.classList.remove('ej2-pptx-slideshow--presenter');
            this.root.focus();
        }
        this.events.raise('presenterViewClosed', { currentIndex: this.index });
    }

    /**
     * Presenter View "End Show": returns to the default UI when Presenter View was opened
     * without a slideshow, otherwise back to the running full-screen show.
     */
    private endPresenterView(): void {
        if (this.presenterFromDefaultView) {
            this.stopPresentation();
        } else {
            this.closePresenterView();
        }
    }

    /** Legacy ribbon entry: start from slide 1. @returns {void} */
    public startFromBeginning(): void {
        this.startPresentation(0);
    }

    /** Legacy ribbon entry: start from the current slide. @returns {void} */
    public startFromCurrent(): void {
        this.startPresentation(this.parent.slideIndex);
    }

    /** Legacy ribbon entry: exit playback. @returns {void} */
    public exit(): void {
        this.stopPresentation();
    }

    /** @private @returns {void} */
    public first(): void {
        this.goToSlide(0);
    }

    /** @private @returns {void} */
    public last(): void {
        this.goToSlide(this.parent.slideCount - 1);
    }

    /** @private @returns {boolean} True for RTL presentations */
    public isRtl(): boolean {
        return !!this.parent.enableRtl;
    }

    /**
     * Shows the overlay controls and restarts the auto-hide timer.
     *
     * @private
     * @returns {void}
     */
    public showControls(): void {
        if (!this.root || !this.controls) {
            return;
        }
        this.root.classList.remove('ej2-pptx-slideshow--idle');
        window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout((): void => {
            const focused: boolean = !!(this.controls && this.controls.contains(document.activeElement));
            if (this.root && !focused && !(this.presenter && this.presenter.isOpen())) {
                this.root.classList.add('ej2-pptx-slideshow--idle');
            }
        }, CONTROLS_HIDE_MS);
    }

    /**
     * Tears down the module. Idempotent.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.stopPresentation();
    }

    private clamp(i: number): number {
        return Math.min(Math.max(0, Math.floor(i)), Math.max(0, this.parent.slideCount - 1));
    }

    private showEndScreen(): void {
        if (this.endScreen) {
            this.endScreen.hidden = false;
        }
        (this.renderer as SlideShowRenderer).hideAll();
        this.setLive(this.text('SlideShowEndLive'));
    }

    /**
     * Re-applies localized text to a running slide show (no-op when inactive).
     *
     * @returns {void}
     */
    public refreshLocale(): void {
        const root: HTMLElement | null = this.root;
        if (!root || !this.active) {
            return;
        }
        const set: (selector: string, text: string, label: boolean) => void =
            (selector: string, text: string, label: boolean): void => {
                const el: HTMLElement | null = root.querySelector(selector);
                if (!el) {
                    return;
                }
                if (label) {
                    el.setAttribute('aria-label', text);
                    el.setAttribute('title', text);
                } else {
                    el.textContent = text;
                }
            };
        set('.ej2-pptx-slideshow__end', this.text('SlideShowEnd'), false);
        set('.ej2-pptx-slideshow__toast', this.text('SlideShowExitHint'), false);
        set('[data-action="prev"]', this.text('PreviousSlide'), true);
        set('[data-action="next"]', this.text('NextSlide'), true);
        set('[data-action="presenter"]', this.text('PresenterViewLabel'), true);
        set('[data-action="exit"]', this.text('ExitSlideShow'), true);
        if (this.presenter && this.presenter.isOpen()) {
            const fromDefaultView: boolean = this.presenterFromDefaultView;
            this.closePresenterView();
            this.openPresenterView(fromDefaultView);
        }
    }

    private text(key: string, ...args: Array<string | number>): string {
        return localize(this.parent.locale, key, ...args);
    }

    private html(key: string): string {
        return escapeLocaleHtml(this.text(key));
    }

    private refreshControls(): void {
        const label: string = String(this.index + 1) + ' / ' + String(this.parent.slideCount);
        if (this.counterEl) {
            this.counterEl.textContent = label;
        }
        this.setLive(this.text('SlideShowLive', label));
        const prev: HTMLButtonElement | null = this.root ? this.root.querySelector('[data-action="prev"]') : null;
        const nxt: HTMLButtonElement | null = this.root ? this.root.querySelector('[data-action="next"]') : null;
        if (prev) {
            prev.disabled = this.index <= 0;
        }
        if (nxt) {
            nxt.disabled = false;
        }
    }

    private showToast(): void {
        if (!this.toastEl) {
            return;
        }
        this.toastEl.classList.remove('ej2-pptx-slideshow__toast--hidden');
        window.clearTimeout(this.toastTimer);
        this.toastTimer = window.setTimeout((): void => {
            if (this.toastEl) {
                this.toastEl.classList.add('ej2-pptx-slideshow__toast--hidden');
            }
        }, TOAST_HIDE_MS);
    }

    private setLive(text: string): void {
        if (this.live) {
            this.live.textContent = text;
        }
    }

    private buildDom(): void {
        const root: HTMLElement = document.createElement('div');
        root.className = 'ej2-pptx-slideshow';
        root.tabIndex = -1;
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Slide show');
        root.setAttribute('dir', this.isRtl() ? 'rtl' : 'ltr');
        root.classList.toggle('e-rtl', this.isRtl());
        // The overlay lives on document.body, outside the editor element, so it
        // carries the editor's theme mode classes itself.
        const editorElement: HTMLElement = this.parent.element;
        if (editorElement) {
            root.setAttribute('data-theme', editorElement.getAttribute('data-theme') || '');
            root.classList.toggle('e-dark-mode', editorElement.classList.contains('e-dark-mode'));
            root.classList.toggle('e-high-contrast', editorElement.classList.contains('e-high-contrast'));
        }
        root.innerHTML =
            '<div class="ej2-pptx-slideshow__stage"></div>' +
            '<div class="ej2-pptx-slideshow__end" hidden>' + this.html('SlideShowEnd') + '</div>' +
            '<div class="ej2-pptx-slideshow__live" aria-live="polite" role="status"></div>' +
            '<div class="ej2-pptx-slideshow__toast" role="status">' + this.html('SlideShowExitHint') + '</div>' +
            '<div class="ej2-pptx-slideshow__controls" role="toolbar" aria-label="Slide show controls">' +
            '<button type="button" class="ej2-pptx-slideshow__btn" data-action="prev" aria-label="' + this.html('PreviousSlide') + '" title="' + this.html('PreviousSlide') + '">&lsaquo;</button>' +
            '<span class="ej2-pptx-slideshow__counter" aria-hidden="true"></span>' +
            '<button type="button" class="ej2-pptx-slideshow__btn" data-action="next" aria-label="' + this.html('NextSlide') + '" title="' + this.html('NextSlide') + '">&rsaquo;</button>' +
            '<span class="ej2-pptx-slideshow__divider" aria-hidden="true"></span>' +
            '<button type="button" class="ej2-pptx-slideshow__btn" data-action="presenter" aria-label="' + this.html('PresenterViewLabel') + '" title="' + this.html('PresenterViewLabel') + '">' +
            ICON_PRESENTER + '</button>' +
            '<button type="button" class="ej2-pptx-slideshow__btn" data-action="exit" aria-label="' + this.html('ExitSlideShow') + '" title="' + this.html('ExitSlideShow') + '">&#10005;</button>' +
            '</div>';
        root.addEventListener('click', (e: MouseEvent): void => {
            const source: HTMLElement = e.target as HTMLElement;
            if (source.closest('.ej2-pptx-presenter')) {
                return; // Presenter View handles its own buttons.
            }
            const btn: Element | null = source.closest('[data-action]');
            const action: string | null = btn ? btn.getAttribute('data-action') : null;
            if (action === 'prev') {
                this.previous();
            } else if (action === 'next') {
                this.next();
            } else if (action === 'presenter') {
                if (this.presenter && this.presenter.isOpen()) {
                    this.closePresenterView();
                } else {
                    this.openPresenterView();
                }
            } else if (action === 'exit') {
                this.stopPresentation();
            }
        });
        this.stage = root.querySelector('.ej2-pptx-slideshow__stage');
        this.endScreen = root.querySelector('.ej2-pptx-slideshow__end');
        this.live = root.querySelector('.ej2-pptx-slideshow__live');
        this.toastEl = root.querySelector('.ej2-pptx-slideshow__toast');
        this.controls = root.querySelector('.ej2-pptx-slideshow__controls');
        this.counterEl = root.querySelector('.ej2-pptx-slideshow__counter');
        this.root = root;
        document.body.appendChild(root);
    }
}
