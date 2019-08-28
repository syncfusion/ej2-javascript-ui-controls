/**
 * PivotFieldList component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable

export class PivotFieldListHelper extends TestHelper {
    /**
     * Specifies the ID of the pivot field list.
     */
    public id: string;

    /**
     * Specifies the current helper function of the pivot field list.
     */

    public wrapperFn: Function;

    /**
     * Constructor to create a helper object for the pivot field list component.
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
     * Gets the root element of the pivot field list component. 
     */

    getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the wrapper element of pop-up field list component, which will have node elements and axis elements.
     */

    getFieldListPopupElement() {
        return this.selector('#' + this.id + '_Wrapper');
    }

    /**
     * Gets the filter popup element of field list component. Which will have treeview and search elements.
     */

    getFilterPopupElement() {
        return this.selector('#' + this.id + '_EditorTreeView');
    }

    /**
     * Gets the context menu element of field list component, which will have the aggregation types.
     */

    getAggregationContextMenuElement() {
        return this.selector('#' + this.id + 'valueFieldContextMenu');
    }

    /**
     * Gets the value field settings pop-up of field list component, which will have aggregation options and caption related elements. 
     */

    getValueSettingsDialogElement() {
        return this.selector('#' + this.id + '_Wrapper_ValueDialog');
    }

    /**
     * Gets the calculated field pop-up element of field list component, which will have elements to create a dynamic field.  
     */
    getCalculatedMemberPopupElement() {
        return this.selector('#' + this.id + '_calculateddialog');
    }
}