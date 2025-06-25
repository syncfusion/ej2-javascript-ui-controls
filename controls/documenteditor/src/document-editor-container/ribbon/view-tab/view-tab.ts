import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { ViewsGroup } from './views-group';
import { ZoomGroup } from './zoom-group';
import { ShowGroup } from './show-group';
import { RibbonConstants } from '../ribbon-constants';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const VIEW_TAB_ID: string = '_view_tab';

/**
 * View tab implementation
 * @private
 */
export class ViewTab {
    private container: DocumentEditorContainer;
    private viewsGroup: ViewsGroup;
    /**
     * @private
     */
    public zoomGroup: ZoomGroup;
    private showGroup: ShowGroup;

    /**
     * Constructor for ViewTab class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;

        // Initialize groups
        this.viewsGroup = new ViewsGroup(container);
        this.zoomGroup = new ZoomGroup(container);
        this.showGroup = new ShowGroup(container);
    }

    /**
     * Get the View tab configuration
     * @returns {RibbonTabModel} The ribbon tab model
     */
    public getViewTab(): RibbonTabModel {
        return {
            id: this.container.element.id + RIBBON_ID + VIEW_TAB_ID,
            header: this.container.localObj.getConstant('View'),
            keyTip: 'W',
            groups: [
                this.viewsGroup.getGroupModel(),
                this.zoomGroup.getGroupModel(),
                this.showGroup.getGroupModel()
            ]
        };
    }
    /**
     * Handle selection change to update ribbon controls state
     * @returns {void}
     */
    public onSelectionChange(): void {
        this.viewsGroup.updateSelection();
        this.showGroup.updateSelection();
    }

    /**
     * Clean up resources when tab is destroyed
     * This method properly disposes all group components and clears references
     * @returns {void}
     */
    public destroy(): void {
        // Clean up group resources
        if (this.viewsGroup) {
            this.viewsGroup.destroy();
        }

        if (this.zoomGroup) {
            this.zoomGroup.destroy();
        }

        if (this.showGroup) {
            this.showGroup.destroy();
        }

        // Clear references
        this.viewsGroup = undefined;
        this.zoomGroup = undefined;
        this.showGroup = undefined;
        this.container = undefined;
    }
}
