/**
 * Presenter View: current/next previews, speaker notes, pausable timer,
 * counter and navigation.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow/presenter-view
 */

import { SlideMount, SlideShowRenderer } from './slideshow-renderer';
import { NotesSnapshot } from '../notes/notes-model';
import { NotesRenderer } from '../notes/notes-renderer';
import { localize, escapeLocaleHtml } from '../localization/localization';

/** Callbacks the presenter view needs from the slideshow. */
export interface PresenterViewHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    getSlideCount(): number;
    getCurrentIndex(): number;
    next(): void;
    previous(): void;
    goTo(index: number): void;
    /** Speaker notes for a slide (empty string when none). */
    getNotes(index: number): string;
    /** Formatted notes for a slide when loaded (colour, bullets, numbering); falls back to {@link getNotes}. */
    getNotesSnapshot?(index: number): NotesSnapshot | undefined;
    /** Closes presenter view (back to the full-screen show). */
    close(): void;
    /** Presentation title shown in the header (falls back to "Presentation"). */
    getTitle?(): string;
    /** Current EJ2 locale used for presenter text. */
    getLocale?(): string;
}

/** Formats elapsed seconds as zero-padded `HH:MM:SS`. */
export function formatElapsed(totalSeconds: number): string {
    const s: number = Math.max(0, Math.floor(totalSeconds));
    const pad: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + String(n);
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
}

const NOTES_MIN_PX: number = 14;
const NOTES_MAX_PX: number = 32;
const NOTES_STEP_PX: number = 2;
const NOTES_DEFAULT_PX: number = 20;
const ICON_PAUSE: string = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<rect x="4" y="3" width="3" height="10" fill="currentColor"/><rect x="9" y="3" width="3" height="10" fill="currentColor"/></svg>';
const ICON_PLAY: string = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>';
const ICON_RESET: string = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Presenter view panel rendered inside the slideshow overlay. */
export class PresenterView {
    private readonly host: PresenterViewHost;
    private readonly renderer: SlideShowRenderer;
    private root: HTMLElement | null = null;
    private currentBox: HTMLElement | null = null;
    private nextBox: HTMLElement | null = null;
    private notesEl: HTMLElement | null = null;
    private readonly notesRenderer: NotesRenderer = new NotesRenderer();
    private counterEl: HTMLElement | null = null;
    private timerEl: HTMLElement | null = null;
    private titleEl: HTMLElement | null = null;
    private pauseBtn: HTMLElement | null = null;
    private notesSize: number = NOTES_DEFAULT_PX;
    private paused: boolean = false;
    private accumulatedMs: number = 0;
    private currentMount: SlideMount | null = null;
    private nextMount: SlideMount | null = null;
    private timerId: number = 0;
    private startedAt: number = 0;
    private resizeHandler: () => void;

    /**
     * @param {PresenterViewHost} host - Slideshow callbacks
     * @param {SlideShowRenderer} renderer - Used to paint previews
     */
    public constructor(host: PresenterViewHost, renderer: SlideShowRenderer) {
        this.host = host;
        this.renderer = renderer;
        this.resizeHandler = (): void => this.fit();
    }

    /**
     * Whether the panel is open.
     *
     * @returns {boolean} True while open
     */
    public isOpen(): boolean {
        return this.root !== null;
    }

    /**
     * Opens the panel inside the given container.
     *
     * @param {HTMLElement} parent - Slideshow overlay root
     * @returns {void}
     */
    public open(parent: HTMLElement): void {
        if (this.root) {
            return;
        }
        const root: HTMLElement = document.createElement('div');
        root.className = 'ej2-pptx-presenter' + (this.host.enableRtl ? ' e-rtl' : '');
        root.setAttribute('dir', this.host.enableRtl ? 'rtl' : 'ltr');
        root.setAttribute('role', 'region');
        root.setAttribute('aria-label', 'Presenter view');
        root.innerHTML =
            '<div class="ej2-pptx-presenter__header">' +
            '<div class="ej2-pptx-presenter__heading-block">' +
            '<div class="ej2-pptx-presenter__label">' + this.html('PresenterViewLabel') + '</div>' +
            '<div class="ej2-pptx-presenter__title"></div></div>' +
            '<div class="ej2-pptx-presenter__header-actions">' +
            '<div class="ej2-pptx-presenter__elapsed-block">' +
            '<div class="ej2-pptx-presenter__label ej2-pptx-presenter__label--end">' + this.html('Elapsed') + '</div>' +
            '<div class="ej2-pptx-presenter__timer" role="timer" aria-label="Elapsed time">00:00:00</div></div>' +
            '<button type="button" class="ej2-pptx-presenter__icon-btn" data-action="pause" aria-label="' + this.html('PauseTimer') + '" title="' + this.html('PauseTimer') + '">' +
            ICON_PAUSE + '</button>' +
            '<button type="button" class="ej2-pptx-presenter__icon-btn" data-action="reset" aria-label="' + this.html('ResetTimer') + '" title="' + this.html('ResetTimer') + '">' +
            ICON_RESET + '</button>' +
            '<span class="ej2-pptx-presenter__divider" aria-hidden="true"></span>' +
            '<button type="button" class="ej2-pptx-presenter__end-btn" data-action="close" aria-label="' + this.html('EndShow') + '">' +
            '<span aria-hidden="true">&#10005;</span> ' + this.html('EndShow') + '</button>' +
            '</div></div>' +
            '<div class="ej2-pptx-presenter__body">' +
            '<div class="ej2-pptx-presenter__main">' +
            '<div class="ej2-pptx-presenter__row">' +
            '<span class="ej2-pptx-presenter__label">' + this.html('CurrentSlide') + '</span>' +
            '<span class="ej2-pptx-presenter__counter" aria-live="polite"></span></div>' +
            '<div class="ej2-pptx-presenter__current" role="img" aria-label="' + this.html('CurrentSlide') + '"></div>' +
            '<div class="ej2-pptx-presenter__notes-panel">' +
            '<div class="ej2-pptx-presenter__row">' +
            '<span class="ej2-pptx-presenter__label">' + this.html('Notes') + '</span>' +
            '<span class="ej2-pptx-presenter__notes-tools">' +
            '<button type="button" class="ej2-pptx-presenter__square-btn" data-action="notes-smaller" ' +
            'aria-label="' + this.html('DecreaseNotesFontSize') + '" title="' + this.html('DecreaseNotesFontSize') + '">A&minus;</button>' +
            '<button type="button" class="ej2-pptx-presenter__square-btn" data-action="notes-larger" ' +
            'aria-label="' + this.html('IncreaseNotesFontSize') + '" title="' + this.html('IncreaseNotesFontSize') + '">A+</button></span></div>' +
            '<div class="ej2-pptx-presenter__notes" tabindex="0" role="region" aria-label="Speaker notes"></div>' +
            '</div></div>' +
            '<div class="ej2-pptx-presenter__side">' +
            '<div class="ej2-pptx-presenter__label">' + this.html('NextSlide') + '</div>' +
            '<div class="ej2-pptx-presenter__next" role="img" aria-label="' + this.html('NextSlide') + '"></div>' +
            '<div class="ej2-pptx-presenter__nav">' +
            '<button type="button" class="ej2-pptx-presenter__nav-btn" data-action="prev" aria-label="' + this.html('PreviousSlide') + '">&lsaquo; ' + this.html('Previous') + '</button>' +
            '<button type="button" class="ej2-pptx-presenter__nav-btn" data-action="next" aria-label="' + this.html('NextSlide') + '">' + this.html('Next') + ' &rsaquo;</button>' +
            '</div></div></div>';
        parent.appendChild(root);
        this.root = root;
        this.currentBox = root.querySelector('.ej2-pptx-presenter__current');
        this.nextBox = root.querySelector('.ej2-pptx-presenter__next');
        this.notesEl = root.querySelector('.ej2-pptx-presenter__notes');
        this.counterEl = root.querySelector('.ej2-pptx-presenter__counter');
        this.timerEl = root.querySelector('.ej2-pptx-presenter__timer');
        this.titleEl = root.querySelector('.ej2-pptx-presenter__title');
        this.pauseBtn = root.querySelector('[data-action="pause"]');
        if (this.titleEl) {
            this.titleEl.textContent = (this.host.getTitle && this.host.getTitle()) || this.text('Presentation');
        }
        this.notesSize = NOTES_DEFAULT_PX;
        this.paused = false;
        this.accumulatedMs = 0;
        root.addEventListener('click', (e: MouseEvent): void => this.onClick(e));
        window.addEventListener('resize', this.resizeHandler);
        this.startedAt = Date.now();
        this.timerId = window.setInterval((): void => this.tick(), 1000);
        this.update();
    }

    /**
     * Refreshes previews, notes and counter for the current slide.
     *
     * @returns {void}
     */
    public update(): void {
        if (!this.root) {
            return;
        }
        const index: number = this.host.getCurrentIndex();
        const count: number = this.host.getSlideCount();
        if (this.counterEl) {
            this.counterEl.textContent = this.text('SlideCounter', index + 1, count);
        }
        this.disposeMounts();
        if (this.currentBox) {
            this.currentMount = this.renderer.mount(index, this.currentBox);
        }
        if (this.nextBox) {
            this.nextBox.classList.toggle('ej2-pptx-presenter__next--end', index + 1 >= count);
            if (index + 1 < count) {
                this.nextMount = this.renderer.mount(index + 1, this.nextBox);
            }
            this.nextBox.setAttribute('data-end-label', 'End of slide show');
        }
        this.updateNotes();
    }

    /**
     * Repaints only the speaker notes for the current slide (used when async notes arrive).
     *
     * @returns {void}
     */
    public updateNotes(): void {
        if (!this.root || !this.notesEl) {
            return;
        }
        const index: number = this.host.getCurrentIndex();
        const notes: string = this.host.getNotes(index);
        const snapshot: NotesSnapshot | undefined = this.host.getNotesSnapshot ? this.host.getNotesSnapshot(index) : undefined;
        this.notesEl.classList.toggle('ej2-pptx-presenter__notes--empty', !notes);
        if (snapshot && notes) {
            this.notesRenderer.render(this.notesEl, snapshot, 'No notes for this slide.');
        } else {
            this.notesRenderer.invalidate();
            this.notesEl.textContent = notes || 'No notes for this slide.';
        }
        this.notesEl.style.fontSize = String(this.notesSize) + 'px';
    }

    /**
     * Closes the panel and releases timers/listeners. Idempotent.
     *
     * @returns {void}
     */
    public close(): void {
        if (!this.root) {
            return;
        }
        window.clearInterval(this.timerId);
        window.removeEventListener('resize', this.resizeHandler);
        this.disposeMounts();
        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
        this.root = null;
        this.currentBox = this.nextBox = this.notesEl = this.counterEl = this.timerEl = null;
        this.titleEl = this.pauseBtn = null;
    }

    private fit(): void {
        if (this.currentMount) {
            this.currentMount.fit();
        }
        if (this.nextMount) {
            this.nextMount.fit();
        }
    }

    private disposeMounts(): void {
        if (this.currentMount) {
            this.currentMount.dispose();
            this.currentMount = null;
        }
        if (this.nextMount) {
            this.nextMount.dispose();
            this.nextMount = null;
        }
    }

    private elapsedMs(): number {
        return this.accumulatedMs + (this.paused ? 0 : Date.now() - this.startedAt);
    }

    private tick(): void {
        if (this.timerEl) {
            this.timerEl.textContent = formatElapsed(this.elapsedMs() / 1000);
        }
    }

    private text(key: string, ...args: Array<string | number>): string {
        return localize(this.host.getLocale ? this.host.getLocale() : undefined, key, ...args);
    }

    private html(key: string): string {
        return escapeLocaleHtml(this.text(key));
    }

    private togglePause(): void {
        if (this.paused) {
            this.startedAt = Date.now();
        } else {
            this.accumulatedMs += Date.now() - this.startedAt;
        }
        this.paused = !this.paused;
        const label: string = this.text(this.paused ? 'ResumeTimer' : 'PauseTimer');
        if (this.pauseBtn) {
            this.pauseBtn.innerHTML = this.paused ? ICON_PLAY : ICON_PAUSE;
            this.pauseBtn.setAttribute('aria-label', label);
            this.pauseBtn.setAttribute('title', label);
        }
        this.tick();
    }

    private resizeNotes(delta: number): void {
        this.notesSize = Math.min(NOTES_MAX_PX, Math.max(NOTES_MIN_PX, this.notesSize + delta));
        if (this.notesEl) {
            this.notesEl.style.fontSize = String(this.notesSize) + 'px';
        }
    }

    private onClick(e: MouseEvent): void {
        const btn: Element | null = (e.target as HTMLElement).closest('[data-action]');
        const action: string | null = btn ? btn.getAttribute('data-action') : null;
        if (action === 'prev') {
            this.host.previous();
        } else if (action === 'next') {
            this.host.next();
        } else if (action === 'close') {
            this.host.close();
        } else if (action === 'reset') {
            this.startedAt = Date.now();
            this.accumulatedMs = 0;
            this.tick();
        } else if (action === 'pause') {
            this.togglePause();
        } else if (action === 'notes-smaller') {
            this.resizeNotes(-NOTES_STEP_PX);
        } else if (action === 'notes-larger') {
            this.resizeNotes(NOTES_STEP_PX);
        }
    }
}
