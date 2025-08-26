/**
 * Interface for handling toolbar/ribbon operations
 * @private
 */
export interface IToolbarHandler {
    /**
     * Initializes the toolbar or ribbon
     * @param {boolean} isToggle - Specifies whether the track changes is toggle or not
     */
    initialize(isToggle?: boolean): void;

    /**
     * Handles content changes in the toolbar/ribbon
     */
    onContentChange(): void;
    /**
     * Handles document changes (like loading a new document)
     */
    onDocumentChange(): void;
    /**
     *
     * @param {boolean} restrictEditing
     */
    restrictEditingToggleHelper(restrictEditing: boolean): void;

    /**
     * @private
     * @param {boolean} enable - Emable/Disable insert comment toolbar item.
     * @returns {void}
     */
    enableDisableInsertComment(enable: boolean): void;
    /**
     *
     * @param isEnabled - Track changes
     */
    toggleTrackChanges(isEnabled: boolean): void;
    /**
     * Destroys the toolbar handler instance
     */
    destroy(): void;
}
