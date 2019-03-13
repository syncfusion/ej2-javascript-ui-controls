import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class PivotFieldListHelper extends TestHelper {
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

    getFieldListPopupElement() {
        return this.selector('#' + this.id + '_Wrapper');
    }

    getFilterPopupElement() {
        return this.selector('#' + this.id + '_EditorTreeView');
    }

    getAggregationContextMenuElement() {
        return this.selector('#' + this.id + 'valueFieldContextMenu');
    }

    getValueSettingsDialogElement() {
        return this.selector('#' + this.id + '_Wrapper_ValueDialog');
    }

    getCalculatedMemberPopupElement() {
        return this.selector('#' + this.id + '_calculateddialog');
    }
}