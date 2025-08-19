import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { HistoryGroup } from './history-group';
import { ClipboardGroup } from './clipboard-group';
import { FontGroup } from './font-group';
import { HomeParagraphGroup } from './home-paragraph-group';
import { FindGroup } from './find-group';
import { StylesGroup } from './styles-group';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { DocumentEditorContainer } from '../../document-editor-container';

// Home tab constants
export const HOME_TAB_ID: string = '_home_tab';
export const HOME_TAB_TEXT: string = 'Home';

/**
 * HomeTab class for Document Editor ribbon
 * Integrates all home tab component groups: History, Clipboard, Font, Paragraph, Find, and Styles
 * @private
 */
export class HomeTab {
    private historyGroup: HistoryGroup;
    private clipboardGroup: ClipboardGroup;
    private fontGroup: FontGroup;
    private paragraphGroup: HomeParagraphGroup;
    private findGroup: FindGroup;
    private stylesGroup: StylesGroup;
    private container: DocumentEditorContainer;

    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.initialize();
    }

    private initialize(): void {

        // Initialize all group components
        this.historyGroup = new HistoryGroup(this.container);
        this.clipboardGroup = new ClipboardGroup(this.container);
        this.fontGroup = new FontGroup(this.container);
        this.paragraphGroup = new HomeParagraphGroup(this.container);
        this.findGroup = new FindGroup(this.container);
        this.stylesGroup = new StylesGroup(this.container);
    }

    /**
     * Get the Ribbon tab model for Home tab
     * @returns {RibbonTabModel} - The ribbon tab model for Home tab
     * @private
     */
    public getHomeTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + HOME_TAB_ID,
            header: this.container.localObj.getConstant(HOME_TAB_TEXT),
            keyTip: 'H',
            groups: [
                this.historyGroup.getGroupModel(),
                this.clipboardGroup.getGroupModel(),
                this.fontGroup.getGroupModel(),
                this.paragraphGroup.getGroupModel(),
                this.stylesGroup.getGroupModel(),
                this.findGroup.getGroupModel()

            ]
        };
    }

    /**
     * Update all groups based on document state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        // Update each group with the current selection

        this.clipboardGroup.updateSelection();
        this.fontGroup.updateSelection();
        this.paragraphGroup.updateSelection();
        this.findGroup.updateSelection();
        this.stylesGroup.updateSelection();
    }
    public updateContentChanged(): void {
        this.historyGroup.updateContentChanged();

    }
    /**
     * Update the style gallery with the document's current styles
     * @returns {void}
     * @private
     */
    public updateStyleGallery(): void {
        if (this.stylesGroup) {
            this.stylesGroup.updateStyleGallery();
        }
    }

    /**
     * Clean up resources when tab is destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Clean up any resources or event listeners
        if (this.historyGroup) {
            this.historyGroup.destroy();
            this.historyGroup = null;
        }
        if (this.clipboardGroup) {
            this.clipboardGroup.destroy();
            this.clipboardGroup = null;
        }
        if (this.fontGroup) {
            this.fontGroup.destroy();
            this.fontGroup = null;
        }
        if (this.paragraphGroup) {
            this.paragraphGroup.destroy();
            this.paragraphGroup = null;
        }
        if (this.findGroup) {
            this.findGroup.destroy();
            this.findGroup = null;
        }
        if (this.stylesGroup) {
            this.stylesGroup.destroy();
            this.stylesGroup = null;
        }
    }
}
