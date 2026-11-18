/**
 * Notes Pane events: argument types and the notifier.
 *
 * @module @syncfusion/ej2-pptxeditor/notes/notes-events
 */

import { NotesPaneState } from './notes-model';

/** Arguments for `notesPaneOpened` / `notesPaneClosed`. * @private
 */
export interface NotesPaneEventArgs {
    /** Component instance. */
    sender?: object;
    /** Event name. */
    name?: string;
    /** 0-based active slide index. */
    slideIndex: number;
    /** Pane state after the change. */
    state: NotesPaneState;
}

/** Arguments for `currentSlideNotesChanged`. * @private
 */
export interface CurrentSlideNotesChangedEventArgs {
    /** Component instance. */
    sender?: object;
    /** Event name. */
    name?: string;
    /** 0-based slide index the notes belong to. */
    slideIndex: number;
    /** Plain-text notes (empty when the slide has none). */
    notes: string;
    /** True when the slide has notes. */
    hasNotes: boolean;
}

/** Arguments for `currentSlideChanged`. * @private
 */
export interface CurrentSlideChangedEventArgs {
    /** Component instance. */
    sender?: object;
    /** Event name. */
    name?: string;
    /** Previous 0-based slide index. */
    previousIndex: number;
    /** New 0-based slide index. */
    newIndex: number;
    /** Total slide count. */
    slideCount: number;
}

/** Names of the events raised by the Notes Pane. * @private
 */
export type NotesEventName =
    'notesPaneOpened' | 'notesPaneClosed' | 'currentSlideNotesChanged' | 'currentSlideChanged';

/** Delivers an event to the owning component. * @private
 */
export type NotesEventTrigger = (name: NotesEventName, args: object) => void;

/**
 * Raises Notes Pane events through the host trigger, filling in `name`.
 * @private
 */
export class NotesEvents {
    private readonly trigger: NotesEventTrigger;

    /**
     * @param {NotesEventTrigger} trigger - Host event trigger
     */
    public constructor(trigger: NotesEventTrigger) {
        this.trigger = trigger;
    }

    /**
     * @param {NotesPaneEventArgs} args - Event arguments
     * @returns {void}
     */
    public paneOpened(args: NotesPaneEventArgs): void {
        this.trigger('notesPaneOpened', { ...args, name: 'notesPaneOpened' });
    }

    /**
     * @param {NotesPaneEventArgs} args - Event arguments
     * @returns {void}
     */
    public paneClosed(args: NotesPaneEventArgs): void {
        this.trigger('notesPaneClosed', { ...args, name: 'notesPaneClosed' });
    }

    /**
     * @param {CurrentSlideNotesChangedEventArgs} args - Event arguments
     * @returns {void}
     */
    public notesChanged(args: CurrentSlideNotesChangedEventArgs): void {
        this.trigger('currentSlideNotesChanged', { ...args, name: 'currentSlideNotesChanged' });
    }

    /**
     * @param {CurrentSlideChangedEventArgs} args - Event arguments
     * @returns {void}
     */
    public slideChanged(args: CurrentSlideChangedEventArgs): void {
        this.trigger('currentSlideChanged', { ...args, name: 'currentSlideChanged' });
    }
}
