import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, Ribbon } from '@syncfusion/ej2-ribbon';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { L10n } from '@syncfusion/ej2-base';

// Constants for UI element IDs
export const TRACKING_GROUP: string = '_tracking_group';
export const TRACK_CHANGES_ID: string = '_track_changes';
export const ACCEPT_ALL_ID: string = '_accept_all';
export const REJECT_ALL_ID: string = '_reject_all';

/**
 * Represents the Tracking Group in Review tab
 * @private
 */
export class TrackingGroup extends RibbonGroupBase {
    /**
     * Constructor for the TrackingGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
    }

    /**
     * Gets the ribbon group model for Tracking
     * @returns {RibbonGroupModel} - Ribbon group model for Tracking
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const locale: L10n = this.localObj;
        return {
            id: this.ribbonId + TRACKING_GROUP,
            header: locale.getConstant('Tracking'),
            enableGroupOverflow: true,
            overflowHeader: locale.getConstant('Tracking'),
            collections: [{
                items: [
                    {
                        id: this.ribbonId + TRACK_CHANGES_ID,
                        type: 'Button',
                        keyTip: 'G',
                        buttonSettings: {
                            content: locale.getConstant('TrackChanges'),
                            iconCss: 'e-icons e-de-cnt-track',
                            isToggle: true,
                            clicked: this.trackChangesHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('TrackChanges')
                        }
                    }]
            }, {
                items: [
                    {
                        id: this.ribbonId + ACCEPT_ALL_ID,
                        type: 'Button',
                        keyTip: 'A2',
                        buttonSettings: {
                            content: locale.getConstant('Accept All'),
                            iconCss: 'e-icons e-de-ctnr-changes-accept',
                            isToggle: false,
                            clicked: this.acceptAllHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Accept all changes in the document')
                        }
                    },
                    {
                        id: this.ribbonId + REJECT_ALL_ID,
                        type: 'Button',
                        keyTip: 'J',
                        buttonSettings: {
                            content: locale.getConstant('Reject All'),
                            iconCss: 'e-icons e-de-ctnr-changes-reject',
                            isToggle: false,
                            clicked: this.rejectAllHandler.bind(this)
                        },
                        ribbonTooltipSettings: {
                            content: locale.getConstant('Reject all changes in the document')
                        }
                    }
                ]
            }]
        };
    }

    /**
     * Handle click on track changes button
     * @returns {void}
     */
    private trackChangesHandler(): void {
        this.container.enableTrackChanges = !this.container.enableTrackChanges;
    }

    /**
     * Handle click on accept all button
     * @returns {void}
     */
    private acceptAllHandler(): void {
        this.documentEditor.revisions.acceptAll();
    }

    /**
     * Handle click on reject all button
     * @returns {void}
     */
    private rejectAllHandler(): void {
        this.documentEditor.revisions.rejectAll();
    }

    /**
     * Update tracking controls based on document state
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const isTrackingEnabled: boolean = this.container.enableTrackChanges &&
            this.documentEditor.revisions.length > 0
            && (!this.container.restrictEditing && !this.documentEditor.documentHelper.isDocumentProtected);
        const ribbon: Ribbon = this.container.ribbon.ribbon;

        // Update track changes button state
        const trackChangesElement: HTMLElement = document.getElementById(this.ribbonId + TRACK_CHANGES_ID);
        if (trackChangesElement) {
            trackChangesElement.classList.toggle('e-active', this.container.enableTrackChanges);
        }

        // Enable/disable accept/reject buttons based on if there are changes to accept/reject
        if (isTrackingEnabled) {
            ribbon.enableItem(this.ribbonId + ACCEPT_ALL_ID);
            ribbon.enableItem(this.ribbonId + REJECT_ALL_ID);
        } else {
            ribbon.disableItem(this.ribbonId + ACCEPT_ALL_ID);
            ribbon.disableItem(this.ribbonId + REJECT_ALL_ID);
        }
    }
}
