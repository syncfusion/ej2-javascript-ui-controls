import { L10n } from '@syncfusion/ej2-base';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { SizeGroup } from './size-group';
import { AltTextGroup } from './alt-text-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

// Picture Format tab constants
export const PICTURE_FORMAT_TAB_ID: string = '_picture_format_tab';
export const PICTURE_FORMAT_TAB_TEXT: string = 'Picture Format';

/**
 * Picture Format tab implementation
 */
export class PictureFormatTab {
    private container: DocumentEditorContainer;
    private localObj: L10n;
    public sizeGroup: SizeGroup;
    private altTextGroup: AltTextGroup;

    /**
     * Constructor for PictureFormatTab class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.sizeGroup = new SizeGroup(container);
        this.altTextGroup = new AltTextGroup(container);
    }

    /**
     * Get the Picture Format tab configuration
     * @returns {RibbonTabModel} - Picture Format tab configuration
     * @private
     */
    public getPictureFormatTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + PICTURE_FORMAT_TAB_ID,
            keyTip: 'JP',
            header: this.localObj.getConstant(PICTURE_FORMAT_TAB_TEXT),
            groups: [
                this.sizeGroup.getSizeGroup(),
                this.altTextGroup.getGroupModel()
            ]
        };
    }

    /**
     * Updates the property controls with current image properties
     * @returns {void}
     * @private
     */
    public updateImageProperties(): void {
        this.sizeGroup.updateSizeProperties();
    }

    /**
     * Clean up resources when destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.sizeGroup) {
            this.sizeGroup.destroy();
            this.sizeGroup = undefined;
        }

        if (this.altTextGroup) {
            this.altTextGroup.destroy();
            this.altTextGroup = undefined;
        }
    }
}
