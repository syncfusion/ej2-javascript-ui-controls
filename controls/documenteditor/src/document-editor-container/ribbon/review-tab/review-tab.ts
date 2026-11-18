import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { ReviewCommentsGroup } from './review-comments-group';
import { TrackingGroup } from './tracking-group';
import { ProtectGroup } from './protect-group';

/**
 * Constants for tab identification
 */
export const REVIEW_TAB_ID: string = '_review_tab';

/**
 * ReviewTab module
 *
 * @private
 */
export class ReviewTab {
    private container: DocumentEditorContainer;
    private ribbonId: string;

    // Group instances
    /**
     * @private
     */
    public reviewCommentsGroup: ReviewCommentsGroup;
    /**
     * @private
     */
    public trackingGroup: TrackingGroup;
    private protectGroup: ProtectGroup;

    /**
     * Constructor for ReviewTab class
     *
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + '_ribbon';

        // Initialize group instances
        this.reviewCommentsGroup = new ReviewCommentsGroup(container);
        this.trackingGroup = new TrackingGroup(container);
        this.protectGroup = new ProtectGroup(container);
    }

    /**
     * Get the Review tab configuration
     *
     * @returns {RibbonTabModel} - Review tab configuration
     * @private
     */
    public getReviewTab(): RibbonTabModel {
        return {
            id: this.ribbonId + REVIEW_TAB_ID,
            keyTip: 'R',
            header: this.container.localObj.getConstant('Review'),
            groups: [
                this.reviewCommentsGroup.getGroupModel(),
                this.trackingGroup.getGroupModel(),
                this.protectGroup.getGroupModel()
            ]
        };
    }

    /**
     * Update UI when selection changes in the document
     *
     * @returns {void}
     * @private
     */
    public updateReviewTabOnSelectionChange(): void {
        // Update all groups based on current selection
        this.reviewCommentsGroup.updateSelection();
        this.trackingGroup.updateSelection();
        this.protectGroup.updateSelection();
    }

    /**
     * Destroy the ReviewTab instance
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Clean up group resources
        if (this.reviewCommentsGroup.destroy) {
            this.reviewCommentsGroup.destroy();
        }
        if (this.trackingGroup.destroy) {
            this.trackingGroup.destroy();
        }
        if (this.protectGroup.destroy) {
            this.protectGroup.destroy();
        }

        // Clear references
        this.reviewCommentsGroup = undefined;
        this.trackingGroup = undefined;
        this.protectGroup = undefined;
    }
}
