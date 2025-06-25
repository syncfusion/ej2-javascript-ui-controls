import { Ribbon, RibbonGroupModel, RibbonItemModel } from '@syncfusion/ej2-ribbon';
import { RibbonGroupBase } from '../ribbon-interfaces';
import { RibbonConstants } from '../ribbon-constants';
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';

/**
 * Show group implementation for View tab
 * @private
 */
export class ShowGroup extends RibbonGroupBase {
    /**
     * Get the Ribbon items for Show group
     *
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            header: this.localObj.getConstant(RibbonConstants.SHOW_GROUP_HEADER),
            // enableGroupOverflow: true,
            id: this.ribbonId + '_showGroup',
            overflowHeader: this.localObj.getConstant(RibbonConstants.SHOW_GROUP_HEADER),
            collections: [
                {
                    items: [
                        {
                            type: 'CheckBox',
                            keyTip: 'R',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Ruler'),
                                checked: false,
                                change: this.rulerChangeHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.RULER_CHECKBOX_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Show or hide the rulers')
                            }
                        },
                        {
                            type: 'CheckBox',
                            keyTip: 'B',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Show Bookmark Markers'),
                                checked: false,
                                change: this.bookmarkMarkersChangeHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.BOOKMARK_MARKERS_CHECKBOX_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Show or hide bookmark markers')
                            }
                        },
                        {
                            type: 'CheckBox',
                            keyTip: 'K',
                            checkBoxSettings: {
                                label: this.localObj.getConstant('Navigation Pane'),
                                checked: false,
                                change: this.navigationPaneChangeHandler.bind(this)
                            },
                            id: this.ribbonId + RibbonConstants.NAVIGATION_PANE_CHECKBOX_ID,
                            ribbonTooltipSettings: {
                                content: this.localObj.getConstant('Show or hide the navigation pane')
                            }
                        }
                    ]
                }
            ]
        };
    }


    private rulerChangeHandler(args: ChangeEventArgs): void {
        this.documentEditor.documentEditorSettings.showRuler = args.checked;
        this.documentEditor.focusIn();
    }

    private bookmarkMarkersChangeHandler(args: ChangeEventArgs): void {
        this.documentEditor.documentEditorSettings.showBookmarks = args.checked;
        this.documentEditor.focusIn();
    }

    private navigationPaneChangeHandler(args: ChangeEventArgs): void {
        this.documentEditor.documentEditorSettings.showNavigationPane = args.checked;
        this.documentEditor.focusIn();
    }

    /**
     * Update selection to reflect current state
     *
     * @returns {void}
     */
    public updateSelection(): void {
        const ribbon: Ribbon = this.container.ribbon.ribbon;
        const rulerCheckBox: RibbonItemModel = this.container.ribbon.ribbon.getItem(this.ribbonId + RibbonConstants.RULER_CHECKBOX_ID);
        if (rulerCheckBox) {
            rulerCheckBox.checkBoxSettings.checked =
                this.documentEditor.documentEditorSettings.showRuler;
            ribbon.updateItem(rulerCheckBox);
        }
        // Bookmark markers checkbox
        const bookmarkCheckBox: RibbonItemModel = ribbon.getItem(this.ribbonId + RibbonConstants.BOOKMARK_MARKERS_CHECKBOX_ID);
        if (bookmarkCheckBox) {
            bookmarkCheckBox.checkBoxSettings.checked = this.documentEditor.documentEditorSettings.showBookmarks;
            ribbon.updateItem(bookmarkCheckBox);
        }

        // Navigation pane checkbox
        const navigationCheckBox: RibbonItemModel = ribbon.getItem(this.ribbonId + RibbonConstants.NAVIGATION_PANE_CHECKBOX_ID);
        if (navigationCheckBox) {
            navigationCheckBox.checkBoxSettings.checked = this.documentEditor.documentEditorSettings.showNavigationPane;
            ribbon.updateItem(navigationCheckBox);
        }
    }
}
