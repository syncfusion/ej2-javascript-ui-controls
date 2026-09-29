/**
 * Centralized service for querying and caching the editor's formatting state.
 * Used by toolbar and quick-toolbar modules to avoid duplicate state queries.
 */

import { EditorCore } from '../../core/base/editor-core';
import { EditorController } from '../../controller/editor-controller';

/**
 * Snapshot of formatting state at the current selection.
 * Used by toolbar modules to sync UI with the editor's current formatting.
 */
export interface FormattingState {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    superscript: boolean;
    subscript: boolean;
    inlineCode: boolean;
    fontColor: string | null;
    backgroundColor: string | null;
    fontSize: string | null;
    fontFamily: string | null;
    heading: string | null;
    paragraph: boolean;
    codeBlock: boolean;
    blockQuote: boolean;
    orderedList: boolean;
    bulletList: boolean;
    alignLeft: boolean;
    alignCenter: boolean;
    alignRight: boolean;
    alignJustify: boolean;
    uno: boolean;
    redo: boolean;
    orderedListType: string | null;
    bulletListType: string | null;
}

/**
 * Service for querying and caching the editor's formatting state.
 * Ensures formatting state is queried only once per command,
 * and the result is shared to both toolbar and quick-toolbar modules.
 */
export class FormattingStateService {
    /** Cached formatting state from the most recent query. */
    private currentState: FormattingState | null = null;

    /**
     * Returns the most recently cached formatting state.
     *
     * @returns {FormattingState | null} The cached state, or null if not yet queried
     */
    public getCurrentState(): FormattingState | null {
        return this.currentState;
    }

    /**
     * Queries the current formatting state from the editor and caches it.
     * This is the single query point for all toolbar UI updates.
     *
     * @param {EditorCore} editorCore - The editor core instance
     * @returns {FormattingState} The current formatting state
     */
    public refreshFormattingState(editorCore: EditorCore): FormattingState {
        const state: FormattingState = createEmptyFormattingState();

        try {
            // Check if editor is destroyed
            const editor: { isDestroyed?: boolean } = editorCore.editor as unknown as { isDestroyed?: boolean };
            if (editor && editor.isDestroyed) {
                this.currentState = state;
                return state;
            }

            // Create access point to the editor's public API
            const editorAccess: EditorController = new EditorController(editorCore);

            // Query active marks (bold, italic, etc.)
            this.readActiveMarks(state, editorAccess);

            // Query selected block and its attributes
            this.readSelectedBlock(state, editorAccess);

            // Query undo/redo availability
            this.updateUndoRedoState(editorAccess, state);
        } catch (e) {
            // Silently fail if we cannot query state
            // eslint-disable-next-line no-console
            console.debug('FormattingStateService: Could not query formatting state', e);
        }

        // Cache and return
        this.currentState = state;
        return state;
    }

    /**
     * Reads the active marks from the editor and updates the formatting state.
     *
     * @param {FormattingState} state - The state to update
     * @param {EditorController} editorAccess - Access surface for the public API
     * @returns {void}
     * @private
     */
    private readActiveMarks(state: FormattingState, editorAccess: EditorController): void {
        if (!editorAccess) {
            return;
        }

        if (editorAccess.isMarkActive('bold')) {
            state.bold = true;
        }
        if (editorAccess.isMarkActive('italic')) {
            state.italic = true;
        }
        if (editorAccess.isMarkActive('underline')) {
            state.underline = true;
        }
        if (editorAccess.isMarkActive('strikethrough')) {
            state.strikethrough = true;
        }
        if (editorAccess.isMarkActive('superscript')) {
            state.superscript = true;
        }
        if (editorAccess.isMarkActive('subscript')) {
            state.subscript = true;
        }
        if (editorAccess.isMarkActive('code')) {
            state.inlineCode = true;
        }

        // Read attributes of the shared textStyle mark (color, backgroundColor, fontFamily, fontSize)
        const textStyle: Record<string, unknown> | null = editorAccess.getMarkAttributes('textStyle');
        state.fontColor = readStringAttr(textStyle, 'color');
        state.backgroundColor = readStringAttr(textStyle, 'backgroundColor');
        state.fontSize = readStringAttr(textStyle, 'fontSize');
        state.fontFamily = readStringAttr(textStyle, 'fontFamily');
    }

    /**
     * Reads the selected block and updates formatting state.
     *
     * @param {FormattingState} state - The state to update
     * @param {EditorController} editorAccess - Access surface for the public API
     * @returns {void}
     * @private
     */
    private readSelectedBlock(state: FormattingState, editorAccess: EditorController): void {
        const selected: { node: { type: string; attrs: Record<string, unknown> }; source: string } | null = editorAccess.getSelectedBlock();
        if (!selected || !selected.node) {
            return;
        }

        const nodeType: string = selected.node.type;
        const attrs: Record<string, unknown> = selected.node.attrs || {};

        switch (nodeType) {
        case 'heading': {
            const level: string | null = readLevelAttr(attrs);
            if (level) {
                state.heading = 'Heading ' + level;
            }
            break;
        }
        case 'paragraph':
            state.paragraph = true;
            break;
        case 'codeBlock':
            state.codeBlock = true;
            break;
        case 'blockquote':
            state.blockQuote = true;
            break;
        case 'orderedList':
            state.orderedList = true;
            state.orderedListType = readStringAttr(attrs, 'listStyleType');
            break;
        case 'bulletList':
            state.bulletList = true;
            state.bulletListType = readStringAttr(attrs, 'listStyleType');
            break;
        default:
            break;
        }

        // Read text alignment (available on paragraph/heading/blockquote/listItem, etc.)
        const align: string | null = readAlignAttr(attrs);
        switch (align) {
        case 'left':
            state.alignLeft = true;
            break;
        case 'center':
            state.alignCenter = true;
            break;
        case 'right':
            state.alignRight = true;
            break;
        case 'justify':
            state.alignJustify = true;
            break;
        default:
            // No explicit alignment — leave all false
            break;
        }
    }

    /**
     * Updates the undo/redo button enable/disable state.
     *
     * @param {EditorController} editorAccess - Access surface for the editor
     * @param {FormattingState} state - The formatting state to update
     * @returns {void}
     * @private
     */
    private updateUndoRedoState(editorAccess: EditorController, state: FormattingState): void {
        if (!editorAccess) {
            return;
        }
        state.uno = editorAccess.canUndo();
        state.redo = editorAccess.canRedo();
    }
}

/**
 * Read a numeric value from a node's attributes and convert to a level string.
 *
 * @param {Object | null} attrs - The node attributes
 * @returns {string | null} The level string (e.g. '1', '2'), or null
 */
function readLevelAttr(attrs: Record<string, unknown> | null): string | null {
    if (attrs === null || attrs === undefined) {
        return null;
    }
    const value: unknown = attrs.level;
    if (typeof value === 'number' && value > 0) {
        return String(value);
    }
    return null;
}

/**
 * Read the alignment value from a node's attributes.
 *
 * @param {Object | null} attrs - The node attributes
 * @returns {string | null} The alignment value (left/center/right/justify), or null
 */
function readAlignAttr(attrs: Record<string, unknown> | null): string | null {
    if (attrs === null || attrs === undefined) {
        return null;
    }
    const value: unknown = attrs.align;
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }
    return null;
}

/**
 * Reads a string attribute from a record.
 *
 * @param {Object | null} attrs - The record to read from
 * @param {string} key - The key to read
 * @returns {string | null} The string value, or null if not present
 */
function readStringAttr(attrs: Record<string, unknown> | null, key: string): string | null {
    if (attrs === null || attrs === undefined) {
        return null;
    }
    // Safe: `key` is always a known mark attribute literal, not user input.
    // eslint-disable-next-line security/detect-object-injection
    const value: unknown = attrs[key];
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }
    return null;
}

/**
 * Default (empty) formatting state — used as the initial value before
 * querying the editor.
 *
 * @returns {FormattingState} The empty state
 */
function createEmptyFormattingState(): FormattingState {
    return {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        superscript: false,
        subscript: false,
        inlineCode: false,
        fontColor: null,
        backgroundColor: null,
        fontSize: null,
        fontFamily: null,
        heading: null,
        paragraph: false,
        codeBlock: false,
        blockQuote: false,
        orderedList: false,
        bulletList: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        alignJustify: false,
        uno: false,
        redo: false,
        orderedListType: null,
        bulletListType: null
    };
}
