/**
 * PivotView component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable

export class PivotViewHelper extends TestHelper {
    /**
     * Specifies the ID of the pivot view.
     */

    public id: string;

    /**
     * Specifies the current helper function of the pivot view.
     */

    public wrapperFn: Function;

    /**
     * Constructor to create a helper object for the pivot view component.
     */

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    /**
     * Gets the root element of the pivot view component.
     */

    getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the grid table element of the pivot view component.
     */
    getGridElement() {
        return this.selector('#' + this.id + '_grid');
    }

    /**
     * Gets the filter pop-up element of pivot view component, which will have treeview and search elements.
     */

    getFilterPopupElement() {
        return this.selector('#' + this.id + '_EditorTreeView');
    }

    /**
     * Gets the context menu element of pivot view component, which will have the aggregation types.
     */

    getAggregationContextMenuElement() {
        return this.selector('#' + this.id + 'valueFieldContextMenu');
    }

    /**
     * Gets the value field settings pop-up of the pivot view component.
     */

    getValueSettingsDialogElement() {
        return this.selector('#' + this.id + '_ValueDialog');
    }

    /**
     * Gets the drill-through pop-up element of the pivot view component.
     */

    getDrillThroughPopupElement() {
        return this.selector('#' + this.id + '_drillthrough');
    }

    /**
     * Gets the conditional formatting pop-up element of the pivot view component.
     */

    getConditionalFormattingPopupElement() {
        return this.selector('#' + this.id + 'conditionalformatting');
    }

    /**
     * Gets the field list element from the pivot view component.
     */

    getFieldListIconElement() {
        return this.selector('#' + this.id + '_PivotFieldList');
    }

    /**
     * Gets the field list pop-up element from the pivot view component, which will have node elements and axis elements.
     */

    getFieldListPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_Wrapper');
    }

    /**
     * Gets the fieldlist's calculated field pop-up element from the pivot view component, which will have elements to create a dynamic field.
     */

    getCalculatedMemberPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldListcalculateddialog');
    }

    /**
     * Gets the fieldlist's filter pop-up element from the pivot view component, which will have treeview and search elements.
     */

    getFieldListFilterPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_EditorTreeView');
    }

    /**
     * Gets the fieldlist's context menu element from the pivot view component.
     */

    getFieldListAggregationContextMenuElement() {
        return this.selector('#' + this.id + '_PivotFieldListvalueFieldContextMenu');
    }

    /**
     * Gets the fieldlist's value field settings element from the pivot view component, which will have aggregation options and caption related elements.
     */

    getFieldListValueSettingsPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_Wrapper_ValueDialog');
    }
}