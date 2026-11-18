/**
 * Notes Pane: read-only speaker-notes pane below the slide canvas.
 *
 * @module @syncfusion/ej2-pptxeditor/notes/notes-pane
 *
 * Owns visibility (hidden / expanded / collapsed), layout mounting and the
 * public `editor.notes` API. Content retrieval lives in {@link NotesModel},
 * painting in {@link NotesRenderer}, notifications in {@link NotesEvents}.
 * Presenter View is independent and is never touched by this module.
 */

import { L10n } from '@syncfusion/ej2-base';
import { NotesEvents, NotesEventName } from './notes-events';
import { NotesLoadResult, NotesLoader, NotesModel, NotesPaneState, NotesSnapshot, notesToPlainText } from './notes-model';
import { NotesRenderer } from './notes-renderer';
import { createL10n, formatLocale } from '../localization/localization';

/** Public Notes Pane API exposed as `editor.notes`. * @private
 */
export interface NotesPaneModule {
    /** Shows the pane (expanded). */
    show(): void;
    /** Hides the pane. */
    hide(): void;
    /** Toggles pane visibility. */
    toggle(): void;
    /** Returns true while the pane is expanded or collapsed. */
    isVisible(): boolean;
    /**
     * Returns the plain-text notes of the active slide as currently loaded.
     * Empty when the pane has not loaded them yet; use `loadCurrentSlideNotes()` to force a load.
     */
    getCurrentSlideNotes(): string;
}

/** Host contract implemented by `PptxEditor`. * @private
 */
export interface NotesPaneHost {
    /** Editor root element. */
    readonly element: HTMLElement;
    /** Current EJ2 locale. */
    readonly locale: string;
    /** 0-based active slide index. */
    readonly slideIndex: number;
    /** Number of slides. */
    readonly slideCount: number;
    /** Loads notes for one slide; resolves `undefined` when unavailable. */
    requestSlideNotes: NotesLoader;
    /** Raises a component event. */
    raiseNotesEvent(name: NotesEventName, args: object): void;
    /** Called after visibility/state changes so chrome (status bar) can refresh. */
    onNotesPaneStateChanged(): void;
    /** Announces a status message. */
    announce(message: string): void;
}

const PANE_CLASS: string = 'ej2-pptx-notes-pane';

/**
 * Notes Pane controller.
 *
 * @private
 */
export class NotesPane implements NotesPaneModule {
    private readonly host: NotesPaneHost;
    private readonly model: NotesModel = new NotesModel();
    private readonly renderer: NotesRenderer = new NotesRenderer();
    private readonly events: NotesEvents;
    /** @returns {L10n} Localization for the host's current locale (re-resolved so locale changes apply). */
    private get l10n(): L10n {
        return createL10n(this.host.locale);
    }
    private paneEl: HTMLElement | null = null;
    private bodyEl: HTMLElement | null = null;
    private titleEl: HTMLElement | null = null;
    private lastSlideIndex: number;

    private readonly onKeyDown: (e: KeyboardEvent) => void;

    /**
     * @param {NotesPaneHost} host - Editor host
     */
    public constructor(host: NotesPaneHost) {
        this.host = host;
        this.lastSlideIndex = host.slideIndex;
        this.onKeyDown = this.handleKeyDown.bind(this);
        this.events = new NotesEvents((name: NotesEventName, args: object): void => {
            host.raiseNotesEvent(name, { sender: host, ...args });
        });
    }

    /** @returns {NotesPaneState} Current pane state */
    public getState(): NotesPaneState {
        return this.model.getState();
    }

    /** @returns {string} Localized accessible label for the status-bar Notes button */
    public getButtonLabel(): string {
        return this.l10n.getConstant('Notes');
    }

    /** @returns {void} Shows the pane expanded. */
    public show(): void {
        this.setState('expanded');
    }

    /** @returns {void} Hides the pane. */
    public hide(): void {
        this.setState('hidden');
    }

    /** @returns {void} Toggles the pane between hidden and expanded. */
    public toggle(): void {
        if (this.model.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }

    /** @returns {boolean} True when expanded or collapsed */
    public isVisible(): boolean {
        return this.model.isVisible();
    }

    /** @returns {string} Plain-text notes of the active slide (empty until loaded) */
    public getCurrentSlideNotes(): string {
        return this.model.isLoaded(this.host.slideIndex) ? this.model.getText() : '';
    }

    /**
     * Loads (if needed) and returns the active slide's plain-text notes.
     *
     * @returns {Promise<string>} Notes text, empty when none
     */
    public loadCurrentSlideNotes(): Promise<string> {
        const index: number = this.host.slideIndex;
        if (this.model.isLoaded(index)) {
            return Promise.resolve(this.model.getText());
        }
        return this.refreshNotes(index).then((): string => this.getCurrentSlideNotes());
    }

    /**
     * Called by the host when the active slide changes. Raises
     * `currentSlideChanged` and refreshes notes only while the pane is visible.
     *
     * @param {number} newIndex - New 0-based slide index
     * @returns {void}
     */
    public onSlideChanged(newIndex: number): void {
        if (newIndex === this.lastSlideIndex) {
            return;
        }
        const previousIndex: number = this.lastSlideIndex;
        this.lastSlideIndex = newIndex;
        this.updateTitle();
        this.events.slideChanged({ previousIndex, newIndex, slideCount: this.host.slideCount });
        if (this.model.isVisible()) {
            void this.refreshNotes(newIndex);
        }
    }

    /**
     * Called by the host when a new presentation was loaded or closed.
     *
     * @returns {void}
     */
    public onDocumentChanged(): void {
        this.model.reset();
        this.lastSlideIndex = this.host.slideIndex;
        this.updateTitle();
        if (this.model.isVisible()) {
            void this.refreshNotes(this.host.slideIndex);
        } else if (this.bodyEl) {
            this.renderer.render(this.bodyEl, undefined, this.l10n.getConstant('NoNotes'));
        }
    }

    /**
     * Removes the pane DOM and drops state.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.model.reset();
        this.model.setState('hidden');
        this.removeDom();
    }

    /**
     * Re-applies localized text after the host locale changed.
     *
     * @returns {void}
     */
    public refreshLocale(): void {
        if (!this.paneEl) {
            return;
        }
        this.updateTitle();
        this.applyState();
        this.renderer.invalidate();
        this.paint();
    }

    /**
     * Updates the header text to "Notes · Slide N" (1-based).
     *
     * @returns {void}
     */
    private updateTitle(): void {
        if (this.titleEl) {
            this.titleEl.textContent = formatLocale(this.l10n.getConstant('NotesTitle'), this.host.slideIndex + 1);
        }
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.model.isVisible()) {
            e.stopPropagation();
            this.hide();
            this.focusNotesButton();
        }
    }

    private setState(state: NotesPaneState): void {
        const previous: NotesPaneState = this.model.getState();
        if (previous === state) {
            return;
        }
        this.model.setState(state);
        if (state === 'hidden') {
            this.removeDom();
        } else {
            this.ensureDom();
            this.applyState();
            if (previous === 'hidden') {
                void this.refreshNotes(this.host.slideIndex);
            }
        }
        this.host.onNotesPaneStateChanged();
        if (previous === 'hidden' || state === 'hidden') {
            const args: { slideIndex: number; state: NotesPaneState } = { slideIndex: this.host.slideIndex, state };
            if (state === 'hidden') {
                this.events.paneClosed(args);
            } else {
                this.events.paneOpened(args);
            }
            this.host.announce(this.l10n.getConstant(state === 'hidden' ? 'NotesHidden' : 'NotesShown'));
        }
    }

    private refreshNotes(index: number): Promise<void> {
        if (this.model.isLoaded(index)) {
            this.paint();
            return Promise.resolve();
        }
        const loader: NotesLoader = (slideIndex: number): Promise<NotesSnapshot | undefined> =>
            this.host.requestSlideNotes(slideIndex).catch((error: Error): never => {
                console.warn('[PptxEditor] Failed to load notes for slide ' + String(slideIndex + 1) + ':', error);
                throw error;
            });
        return this.model.load(index, loader).then((result: NotesLoadResult | null): void => {
            if (!result) {
                // Failed or superseded load: never leave the body blank for the active slide.
                if (index === this.host.slideIndex) {
                    this.paint();
                }
                return;
            }
            if (result.index !== this.host.slideIndex) {
                return;
            }
            this.paint();
            const notes: string = notesToPlainText(result.snapshot);
            this.events.notesChanged({ slideIndex: result.index, notes, hasNotes: notes !== '' });
        });
    }

    private paint(): void {
        if (this.bodyEl) {
            const snapshot: NotesSnapshot | undefined = this.model.isLoaded(this.host.slideIndex)
                ? this.model.getSnapshot() : undefined;
            try {
                this.renderer.render(this.bodyEl, snapshot, this.l10n.getConstant('NoNotes'));
            } catch (error) {
                console.warn('[PptxEditor] Failed to render notes:', error);
                this.bodyEl.textContent = notesToPlainText(snapshot) || this.l10n.getConstant('NoNotes');
            }
            this.bodyEl.scrollTop = 0;
        }
    }

    private ensureDom(): void {
        if (this.paneEl && this.paneEl.parentNode) {
            return;
        }
        const area: HTMLElement | null = this.host.element.querySelector('.ej2-pptx-slide-area');
        if (!area) {
            return;
        }
        const id: string = 'ej2-pptx-notes-' + String(Math.floor(Math.random() * 1e9));
        const pane: HTMLElement = document.createElement('div');
        pane.className = PANE_CLASS;
        pane.id = id;
        pane.setAttribute('role', 'region');
        pane.setAttribute('aria-label', 'Notes pane');

        const header: HTMLElement = document.createElement('div');
        header.className = PANE_CLASS + '__header';
        const title: HTMLElement = document.createElement('span');
        title.className = PANE_CLASS + '__title';
        title.id = id + '-title';
        header.appendChild(title);

        const body: HTMLElement = document.createElement('div');
        body.className = PANE_CLASS + '__body';
        body.id = id + '-body';
        body.tabIndex = 0;
        body.setAttribute('role', 'document');
        body.setAttribute('aria-labelledby', id + '-title');
        body.setAttribute('aria-readonly', 'true');

        pane.appendChild(header);
        pane.appendChild(body);
        area.appendChild(pane);
        pane.addEventListener('keydown', this.onKeyDown);
        this.paneEl = pane;
        this.bodyEl = body;
        this.titleEl = title;
        this.updateTitle();
        this.renderer.invalidate();
    }

    private applyState(): void {
        if (!this.paneEl) {
            return;
        }
        const expanded: boolean = this.model.getState() === 'expanded';
        this.paneEl.classList.toggle(PANE_CLASS + '--expanded', expanded);
        this.paneEl.classList.toggle(PANE_CLASS + '--collapsed', !expanded);
        if (this.bodyEl) {
            this.bodyEl.hidden = !expanded;
        }
    }

    private removeDom(): void {
        if (this.paneEl) {
            this.paneEl.removeEventListener('keydown', this.onKeyDown);
            if (this.paneEl.parentNode) {
                this.paneEl.parentNode.removeChild(this.paneEl);
            }
        }
        this.paneEl = this.bodyEl = this.titleEl = null;
    }

    private focusNotesButton(): void {
        const button: HTMLElement | null = this.host.element.querySelector('.ej2-pptx-status-bar__notes');
        if (button) {
            button.focus();
        }
    }
}
