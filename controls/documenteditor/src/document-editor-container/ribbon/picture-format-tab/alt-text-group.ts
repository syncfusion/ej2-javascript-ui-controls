import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonItemModel, RibbonGroupModel } from '@syncfusion/ej2-ribbon';
import { AltTextDialog } from './alt-text-dialog';
import { RibbonGroupBase } from '../ribbon-interfaces';

/**
 * Alt Text Group implementation for Picture Format tab
 * @private
 */
export class AltTextGroup extends RibbonGroupBase {
    private altTextDialog: AltTextDialog;

    // Constants for UI elements
    private readonly ALT_TEXT_BUTTON_ID: string = '_de-alt-text-button';

    /**
     * Constructor for AltTextGroup class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
        this.container = container;
        this.localObj = this.container.localObj;
        this.altTextDialog = new AltTextDialog(container);
    }

    /**
     * Get the Alt Text group configuration
     * @returns {RibbonGroupModel} - Alt Text group configuration
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.ribbonId + '_alt_text_group',
            header: this.localObj.getConstant('Accessibility'),
            orientation: 'Row',
            cssClass: 'alt-text-group',
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Accessibility'),
            collections: [
                {
                    items: [
                        {
                            type: 'Button',
                            id: this.ribbonId + this.ALT_TEXT_BUTTON_ID,
                            buttonSettings: {
                                content: this.localObj.getConstant('Alt Text'),
                                iconCss: 'e-icons e-de-ctnr-text-alternative',
                                clicked: this.altTextButtonClick.bind(this)
                            },
                            tooltipText: this.localObj.getConstant('Add alternative text to the image for accessibility')
                        } as RibbonItemModel
                    ]
                }
            ]
        };
    }

    /**
     * Handle Alt Text button click
     * @returns {void}
     */
    private altTextButtonClick(): void {
        this.altTextDialog.show();
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.altTextDialog) {
            this.altTextDialog.destroy();
            this.altTextDialog = undefined;
        }
    }
}
