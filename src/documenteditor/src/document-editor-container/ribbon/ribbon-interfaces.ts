import { DocumentEditorContainer } from '../document-editor-container';
import { L10n } from '@syncfusion/ej2-base';
import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../document-editor/document-editor';

/**
 * Interface for ribbon group components
 * @private
 */
export interface IRibbonGroup {
    /**
     * Gets the ribbon group model
     */
    getGroupModel(): RibbonGroupModel;

    /**
     * Updates the UI based on selection
     */
    updateSelection?(): void;

    /**
     * Disposes event handlers
     */
    destroy(): void;
}

/**
 * Base class for ribbon groups with common functionality
 * @private
 */
export abstract class RibbonGroupBase implements IRibbonGroup {
    protected container: DocumentEditorContainer;
    protected localObj: L10n;
    protected isRtl: boolean;
    protected ribbonId: string;

    /**
     * Constructor for RibbonGroupBase
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.isRtl = this.container.enableRtl || false;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.ribbonId = this.container.element.id + '_ribbon';
    }

    /**
     * Gets the DocumentEditor from container
     * @returns {DocumentEditor} - DocumentEditor instance
     */
    protected get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Abstract method to get the group model
     */
    abstract getGroupModel(): RibbonGroupModel;

    /**
     * Default implementation for updating selection
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Default implementation - can be overridden by derived classes
    }

    /**
     * Default implementation for wiring events
     * @returns {void}
     * @private
     */
    public wireEvents(): void {
        // Default implementation - can be overridden by derived classes
    }

    /**
     * Default implementation for destroying event handlers
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Default implementation - can be overridden by derived classes
    }
}

