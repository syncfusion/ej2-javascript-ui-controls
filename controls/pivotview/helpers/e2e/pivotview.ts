import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class PivotViewHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    getElement() {
        return this.selector('#' + this.id);
    }

    getGridElement() {
        return this.selector('#' + this.id + '_grid');
    }

    getFilterPopupElement() {
        return this.selector('#' + this.id + '_EditorTreeView');
    }

    getAggregationContextMenuElement() {
        return this.selector('#' + this.id + 'valueFieldContextMenu');
    }

    getValueSettingsDialogElement() {
        return this.selector('#' + this.id + '_ValueDialog');
    }

    getDrillThroughPopupElement() {
        return this.selector('#' + this.id + '_drillthrough');
    }

    getConditionalFormattingPopupElement() {
        return this.selector('#' + this.id + 'conditionalformatting');
    }

    getFieldListIconElement() {
        return this.selector('#' + this.id + '_PivotFieldList');
    }

    getFieldListPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_Wrapper');
    }

    getCalculatedMemberPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldListcalculateddialog');
    }

    getFieldListFilterPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_EditorTreeView');
    }

    getFieldListAggregationContextMenuElement() {
        return this.selector('#' + this.id + '_PivotFieldListvalueFieldContextMenu');
    }

    getFieldListValueSettingsPopupElement() {
        return this.selector('#' + this.id + '_PivotFieldList_Wrapper_ValueDialog');
    }
}