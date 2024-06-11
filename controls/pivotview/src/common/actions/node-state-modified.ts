import { DragEventArgs, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { OlapEngine } from '../../base/olap/engine';

/**
 * `DialogAction` module is used to handle field list dialog related behaviour.
 *
 */
/** @hidden */
export class NodeStateModified {
    /** @hidden */
    public parent: PivotCommon;
    /**
     * Constructor for the dialog action.
     *
     * @param {PivotCommon} parent - It represent the parent data.
     * @hidden
     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Updates the dataSource by drag and drop the selected field from either field list or axis table with dropped target position.
     *
     * @param {DragAndDropEventArgs} args - Contains both pivot button and field list drag and drop information.
     * @param {string} fieldName - Defines dropped field name to update dataSource.
     * @returns {boolean} true if the node is successfully dropped, otherwise false.
     * @hidden
     */
    public onStateModified(args: DragEventArgs & DragAndDropEventArgs, fieldName: string): boolean {
        let droppedClass: string = '';
        let nodeDropped: boolean = true;
        const target: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        let droppedPosition: number = -1;
        this.parent.dataSourceUpdate.btnElement = args.element ? args.element.parentElement : undefined;
        if (target) {
            droppedClass = target.classList[1] === cls.ROW_AXIS_CLASS ?
                'rows' : target.classList[1] === cls.COLUMN_AXIS_CLASS ? 'columns' : target.classList[1] === cls.VALUE_AXIS_CLASS ?
                    'values' : target.classList[1] === cls.FILTER_AXIS_CLASS ? 'filters' : '';
        }
        if (this.parent.dataType === 'olap' || this.parent.dataType === 'pivot') {
            const actualFieldName: string = (this.parent.dataType === 'olap' && this.parent.engineModule.fieldList[fieldName as string] &&
                this.parent.engineModule.fieldList[fieldName as string].isCalculatedField ?
                (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].tag : fieldName);
            if (args.cancel && droppedClass === '') {
                nodeDropped = false;
                return nodeDropped;
            } else if ((this.parent.dataSourceUpdate.btnElement &&
                (this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'true' &&
                    (droppedClass === 'filters' || droppedClass === 'values'))) ||
                (this.parent.dataSourceUpdate.btnElement &&
                    (this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'false' &&
                        actualFieldName.toLowerCase().indexOf('[measures].') > -1 && this.parent.dataType === 'olap' &&
                        (droppedClass === 'filters' || droppedClass === 'rows' || droppedClass === 'columns'))) ||
                (this.parent.dataSourceUpdate.btnElement &&
                    (this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'false' && this.parent.dataType === 'olap' &&
                        actualFieldName.toLowerCase().indexOf('[measures].') === -1 &&
                        this.parent.engineModule.fieldList[fieldName as string] &&
                        (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].isNamedSets &&
                        (droppedClass === 'filters' || droppedClass === 'values'))) ||
                (this.parent.dataSourceUpdate.btnElement &&
                    (this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'false' && this.parent.dataType === 'olap' &&
                        actualFieldName.toLowerCase().indexOf('[measures].') === -1 && droppedClass === 'values'))) {
                const title: string = this.parent.localeObj.getConstant('warning');
                const description: string = this.parent.localeObj.getConstant('fieldDropErrorAction');
                this.parent.errorDialog.createErrorDialog(title, description);
                nodeDropped = false;
                return nodeDropped;
            }
        } else {
            if ((args.cancel && droppedClass === '') ||
                (this.parent.dataSourceUpdate.btnElement && this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'true' &&
                    ((droppedClass === 'filters' || droppedClass === 'values') ||
                        droppedClass.indexOf(this.parent.dataSourceSettings.valueAxis) > -1))) {
                nodeDropped = false;
                return nodeDropped;
            }
        }
        if (droppedClass !== '') {
            if (this.parent.dataType === 'olap' || this.parent.dataType === 'pivot') {
                const actualFieldName: string = (this.parent.dataType === 'olap' && this.parent.engineModule.fieldList[fieldName as string] &&
                    this.parent.engineModule.fieldList[fieldName as string].isCalculatedField ?
                    (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].tag : fieldName);
                if ((actualFieldName.toLowerCase().indexOf('[measures].') > -1 && this.parent.dataType === 'olap' &&
                    (droppedClass === 'filters' || droppedClass === 'rows' || droppedClass === 'columns')) ||
                    (this.parent.engineModule.fieldList[fieldName as string] &&
                        (this.parent.engineModule as OlapEngine).fieldList[fieldName as string].isNamedSets && droppedClass === 'filters') ||
                    (this.parent.dataType === 'olap' && droppedClass === 'values' &&
                        actualFieldName.toLowerCase().indexOf('[measures].') === -1)) {
                    const title: string = this.parent.localeObj.getConstant('warning');
                    const description: string = this.parent.localeObj.getConstant('fieldDropErrorAction');
                    this.parent.errorDialog.createErrorDialog(title, description);
                    nodeDropped = false;
                    return nodeDropped;
                }
            }
            if (this.parent.dataType === 'pivot' && this.parent.engineModule.fieldList[fieldName as string] &&
                this.parent.engineModule.fieldList[fieldName as string].aggregateType === 'CalculatedField' && droppedClass !== 'values') {
                const title: string = this.parent.localeObj.getConstant('warning');
                const description: string = this.parent.localeObj.getConstant('dropAction');
                this.parent.errorDialog.createErrorDialog(title, description);
                nodeDropped = false;
                return nodeDropped;
            }
            droppedPosition = this.getButtonPosition(args.target, droppedClass);
        } else if (this.parent.engineModule.fieldList[fieldName as string]) {
            this.parent.engineModule.fieldList[fieldName as string].isSelected = false;
            if (this.parent.dataType === 'olap') {
                (this.parent.engineModule as OlapEngine).updateFieldlistData(fieldName);
            }
        }
        nodeDropped = this.parent.dataSourceUpdate.updateDataSource(fieldName, droppedClass, droppedPosition);
        return nodeDropped;
    }

    private getButtonPosition(target: HTMLElement, droppedClass: string): number {
        let droppedPosition: number = -1;
        let targetBtn: Element = closest(target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
        if (!isNullOrUndefined(targetBtn)) {
            targetBtn = targetBtn.querySelector('.' + cls.PIVOT_BUTTON_CLASS);
            const axisPanel: Element = this.parent.element.querySelector('.e-' + droppedClass);
            const pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
            for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i as number].id === targetBtn.id) {
                    droppedPosition = i;
                    break;
                }
            }
        }
        return droppedPosition;
    }
}
