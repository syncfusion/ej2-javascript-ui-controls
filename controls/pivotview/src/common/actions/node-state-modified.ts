import { DragEventArgs, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';

/**
 * `DialogAction` module is used to handle field list dialog related behaviour.
 */
/** @hidden */
export class NodeStateModified {
    public parent: PivotCommon;

    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Updates the dataSource by drag and drop the selected field from either field list or axis table with dropped target position.
     * @method onStateModified
     * @param  {DragEventArgs & DragAndDropEventArgs} args -  Contains both pivot button and field list drag and drop information.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @return {void}
     * @hidden
     */
    public onStateModified(args: DragEventArgs & DragAndDropEventArgs, fieldName: string): boolean {
        let droppedClass: string = '';
        let nodeDropped: boolean = true;
        let target: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        let droppedPosition: number = -1;
        this.parent.dataSourceUpdate.btnElement = args.element ? args.element.parentElement : undefined;
        if (target) {
            droppedClass = target.classList[1] === cls.ROW_AXIS_CLASS ?
                'rows' : target.classList[1] === cls.COLUMN_AXIS_CLASS ? 'columns' : target.classList[1] === cls.VALUE_AXIS_CLASS ?
                    'values' : target.classList[1] === cls.FILTER_AXIS_CLASS ? 'filters' : '';
        }
        if ((args.cancel && droppedClass === '') ||
            (this.parent.dataSourceUpdate.btnElement && this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'true' &&
                ((droppedClass === 'filters' || droppedClass === 'values') ||
                    droppedClass.indexOf(this.parent.dataSource.valueAxis) > -1))) {
            nodeDropped = false;
            return nodeDropped;
        }
        if (droppedClass !== '') {
            if (this.parent.engineModule.fieldList[fieldName] &&
                this.parent.engineModule.fieldList[fieldName].aggregateType === 'CalculatedField' && droppedClass !== 'values') {
                let title: string = this.parent.localeObj.getConstant('warning');
                let description: string = this.parent.localeObj.getConstant('dropAction');
                this.parent.errorDialog.createErrorDialog(title, description);
                nodeDropped = false;
                return nodeDropped;
            }
            droppedPosition = this.getButtonPosition(args.target, droppedClass);
        }
        this.parent.dataSourceUpdate.updateDataSource(fieldName, droppedClass, droppedPosition);
        return nodeDropped;
    }

    private getButtonPosition(target: HTMLElement, droppedClass: string): number {
        let droppedPosition: number = -1;
        let targetBtn: Element = closest(target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
        if (!isNullOrUndefined(targetBtn)) {
            targetBtn = targetBtn.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
            let axisPanel: Element = this.parent.element.querySelector('.e-' + droppedClass);
            let pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === targetBtn.id) {
                    droppedPosition = i;
                    break;
                }
            }
        }
        return droppedPosition;
    }
}