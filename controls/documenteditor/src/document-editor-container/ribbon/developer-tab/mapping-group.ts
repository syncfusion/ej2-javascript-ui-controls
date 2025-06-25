import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor';
import { L10n } from '@syncfusion/ej2-base';

/**
 * Constants for mapping group identification
 */
export const MAPPING_GROUP: string = '_mapping_group';
export const XMLMAPPING_ID: string = '_xmlmapping';

/**
 * MappingGroup module
 * @private
 */
export class MappingGroup {
    private container: DocumentEditorContainer;
    private ribbonId: string;

    /**
     * Constructor for MappingGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + '_ribbon';
    }

    /**
     * Get the DocumentEditor instance
     * @returns {DocumentEditor} The DocumentEditor instance
     */
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the Mapping group model
     * @returns {RibbonGroupModel} The Mapping group model
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: L10n = this.container.localObj;
        const id: string = this.ribbonId + MAPPING_GROUP;

        return {
            id: id,
            header: locale.getConstant('Mapping'),
            orientation: 'Row',
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Mapping'),
            collections: [
                {
                    items: [
                        this.getXmlMappingButtonModel()
                    ]
                }
            ]
        };
    }

    /**
     * Get the XML Mapping button model
     * @returns {RibbonItemModel} The XML Mapping button model
     */
    private getXmlMappingButtonModel(): RibbonItemModel {
        const locale: L10n = this.container.localObj;
        const id: string = this.ribbonId + MAPPING_GROUP;

        return {
            type: 'Button',
            id: id + XMLMAPPING_ID,
            buttonSettings: {
                iconCss: 'e-icons e-de-ctnr-xml-mapping',
                content: locale.getConstant('XML Mapping Pane'),
                clicked: this.onXmlMappingClick.bind(this)
            },
            ribbonTooltipSettings: {
                content: locale.getConstant('XML Mapping Pane')
            }
        };
    }

    /**
     * Handle XML Mapping button click
     * @returns {void}
     */
    private onXmlMappingClick(): void {
        if (!this.documentEditor.isXmlPaneTool) {
            this.documentEditor.showXmlPane();
        }
        this.container.statusBar.toggleWebLayout();

        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }

    /**
     * Update UI based on current selection
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Update UI state based on current selection
        const isReadOnly: boolean = this.documentEditor.isReadOnly;
        const isDocumentProtected: boolean = this.documentEditor.documentHelper.isDocumentProtected;

        // Disable XML mapping in read-only mode or protected document
        const enableXmlMapping: boolean = !isReadOnly && !isDocumentProtected;

        // Implementation to enable/disable XML mapping button
        const xmlMappingElement: HTMLElement = document.getElementById(this.ribbonId + MAPPING_GROUP + XMLMAPPING_ID);
        if (xmlMappingElement) {
            xmlMappingElement.classList.toggle('e-disabled', !enableXmlMapping);
        }
    }

    /**
     * Destroy the MappingGroup instance
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Clear all references
        this.container = undefined;
        this.ribbonId = undefined;
    }
}
