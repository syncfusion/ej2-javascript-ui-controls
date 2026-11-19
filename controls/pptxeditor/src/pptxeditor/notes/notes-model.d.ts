/**
 * Notes model: slide-notes retrieval and Notes Pane state.
 *
 * @module @syncfusion/ej2-pptxeditor/notes/notes-model
 *
 * Pure state holder. No DOM access, so it can be reused by a future editable
 * Notes Pane without change. Only the active slide's notes are ever held.
 */
/** One formatted run of speaker-notes text. A run whose text is `"\n"` is a line break. * @internal
 */
export interface NotesRunSnapshot {
    readonly text: string;
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: boolean;
    readonly strike?: boolean;
    /** Text colour as six hex digits (no `#`); theme colours are not resolved. */
    readonly color?: string;
    /** Highlight colour as six hex digits (no `#`). */
    readonly highlight?: string;
    readonly fontFamily?: string;
    readonly fontSizePt?: number;
}
/** Bullet or auto-number marker of a notes paragraph. * @internal
 */
export interface NotesBulletSnapshot {
    readonly kind: 'character' | 'numbered';
    /** Bullet glyph for `character` bullets. */
    readonly character?: string;
    /** `a:buAutoNum/@type` scheme for `numbered` bullets. */
    readonly scheme?: string;
    readonly startAt?: number;
}
/** One paragraph of speaker-notes text. * @internal
 */
export interface NotesParagraphSnapshot {
    readonly runs: NotesRunSnapshot[];
    readonly level?: number;
    readonly alignment?: string;
    readonly leftMarginPt?: number;
    readonly indentPt?: number;
    readonly bullet?: NotesBulletSnapshot;
}
/** Clone-safe notes content for a single slide. * @internal
 */
export interface NotesSnapshot {
    /** 0-based slide index the notes belong to. */
    readonly index: number;
    readonly paragraphs: NotesParagraphSnapshot[];
}
/** Notes Pane visibility state. * @internal
 */
export declare type NotesPaneState = 'hidden' | 'expanded' | 'collapsed';
/** Loads notes for a 0-based slide index; resolves `undefined` when unsupported. * @internal
 */
export declare type NotesLoader = (index: number) => Promise<NotesSnapshot | undefined>;
/** Result of a completed (non-superseded) notes load. * @internal
 */
export interface NotesLoadResult {
    readonly index: number;
    readonly snapshot: NotesSnapshot | undefined;
}
/**
 * Flattens a notes snapshot into plain text (paragraphs separated by `\n`).
 *
 * @param {NotesSnapshot | undefined} snapshot - Notes content
 * @returns {string} Plain text, empty when there are no notes
 * @internal
 */
export declare function notesToPlainText(snapshot: NotesSnapshot | undefined): string;
/**
 * Holds Notes Pane state and the notes of the currently loaded slide.
 * @internal
 */
export declare class NotesModel {
    private state;
    private loadedIndex;
    private snapshot;
    private requestToken;
    /** @returns {NotesPaneState} Current pane state */
    getState(): NotesPaneState;
    /**
     * @param {NotesPaneState} state - New pane state
     * @returns {void}
     */
    setState(state: NotesPaneState): void;
    /** @returns {boolean} True when the pane is expanded or collapsed (not hidden) */
    isVisible(): boolean;
    /**
     * @param {number} index - 0-based slide index
     * @returns {boolean} True when notes for `index` are already loaded
     */
    isLoaded(index: number): boolean;
    /** @returns {number} 0-based index of the loaded slide, `-1` when none */
    getLoadedIndex(): number;
    /** @returns {NotesSnapshot | undefined} Loaded notes content */
    getSnapshot(): NotesSnapshot | undefined;
    /** @returns {string} Plain text of the loaded notes */
    getText(): string;
    /**
     * Loads notes for one slide. Resolves `null` when a newer request, a reset
     * or a loader failure superseded this one, so stale results are never applied.
     *
     * @param {number} index - 0-based slide index
     * @param {NotesLoader} loader - Notes source
     * @returns {Promise<NotesLoadResult | null>} Load result
     */
    load(index: number, loader: NotesLoader): Promise<NotesLoadResult | null>;
    /**
     * Drops loaded notes and invalidates in-flight requests.
     *
     * @returns {void}
     */
    reset(): void;
}
