import { SfPivotView } from '../pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';
import * as cls from '../common/constants';
import { closest, removeClass, isNullOrUndefined, addClass, MouseEventArgs } from '@syncfusion/ej2-base';
import { IFilter, FieldItemInfo, IFieldOptions } from '../../src/base/engine';
import { IOlapField } from '../../src/base/olap/engine';
import { SummaryTypes } from '../../src';
import { CommonKeyboardInteraction } from './keyboard';

/**
 * Module for common action
 */
export class ActionBase {
    public parent: SfPivotView | SfPivotFieldList;
    public keyboardModule: CommonKeyboardInteraction;

    constructor(parent: SfPivotView | SfPivotFieldList) {
        this.parent = parent;
        this.parent.commonActionModule = this;
        this.keyboardModule = new CommonKeyboardInteraction(parent);
        this.getElementInfo();
    }

    public getElementInfo(): void {
        if (this.parent instanceof SfPivotView) {
            let domInfo: ClientRect = this.parent.element.getBoundingClientRect();
            /* tslint:disable-next-line:max-line-length */
            this.parent.dotNetRef.invokeMethodAsync('GetElementInfo', domInfo.width, domInfo.height);
        }
    }

    public updateActiveNode(treeElement: HTMLElement, id: string): void {
        /* tslint:disable-next-line:max-line-length */
        removeClass(treeElement.querySelectorAll('li.' + cls.PREV_ACTIVE_NODE), cls.PREV_ACTIVE_NODE);
        addClass([treeElement.querySelector('li[data-uid=' + '\"' + id + '\"' + ']')], cls.PREV_ACTIVE_NODE);
    }

    public isFullRowElement(top: number, left: number): string {
        return JSON.stringify(document.elementFromPoint(left, top).classList.contains(cls.FULL_ROW));
    }

    public validateInputs(filterInfo: IFilter): void {
        let operand1: string = filterInfo.value1 as string;
        let operand2: string = filterInfo.value2 as string;
        let operator: string = filterInfo.condition;
        let type: string = filterInfo.type;
        if (isNullOrUndefined(operand1) || operand1 === '' ||
            ['Between', 'NotBetween'].indexOf(operator) > -1 && (isNullOrUndefined(operand2) || operand2 === '')) {
            let focusElement: HTMLElement =
                this.parent.parentElement.querySelector('#' + this.parent.element.id + '_' + type.toLowerCase() +
                    (isNullOrUndefined(operand1) || operand1 === '' ? '_input_option_1' : '_input_option_2'));
            addClass([focusElement], cls.EMPTY_FIELD);
            focusElement.focus();
        }
    }

    public updateDropIndicator(e: MouseEventArgs): void {
        /* tslint:disable */
        if (this.parent.isDragging && (e.target as HTMLElement).classList.contains(cls.AXIS_CONTENT_CLASS) && e.type === 'mouseover') {
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
            let element: HTMLElement[] = [].slice.call((e.target as HTMLElement).querySelectorAll('.' + cls.PIVOT_BUTTON_DIV_CLASS));
            if (element.length > 0) {
                addClass([element[element.length - 1].querySelector('.' + cls.DROP_INDICATOR_CLASS + '-last')], cls.INDICATOR_HOVER_CLASS);
            }
        } else if (e.type === 'mouseleave') {
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
        if (this.parent.isDragging && closest((e.target as HTMLElement), '.' + cls.PIVOT_BUTTON_DIV_CLASS) && e.type === 'mouseover') {
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            let element: HTMLElement = closest((e.target as HTMLElement), '.' + cls.PIVOT_BUTTON_DIV_CLASS) as HTMLElement;
            addClass([element.querySelector('.' + cls.DROP_INDICATOR_CLASS)], cls.INDICATOR_HOVER_CLASS);
        }
        /* tslint:enable */
    }

    public getFieldInfo(fieldName: string, isValueField?: boolean): FieldItemInfo {
        let fields: IFieldOptions[][] = [this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.columns,
        this.parent.dataSourceSettings.values, this.parent.dataSourceSettings.filters];
        for (let i: number = 0, len: number = fields.length; i < len; i++) {
            for (let j: number = 0, cnt: number = fields[i] ? fields[i].length : 0; (j < cnt && !isValueField); j++) {
                if (fields[i][j] && fields[i][j].name === fieldName) {
                    return {
                        fieldName: fieldName,
                        fieldItem: fields[i][j],
                        axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters',
                        position: j
                    } as FieldItemInfo;
                }
            }
        }
        let fieldList: IOlapField = this.parent.fieldList[fieldName];
        let fieldItem: IFieldOptions = fieldList || isValueField ? {
            name: fieldName,
            caption: fieldList ? fieldList.caption : fieldName,
            baseField: fieldList ? fieldList.baseField : undefined,
            baseItem: fieldList ? fieldList.baseItem : undefined,
            isCalculatedField: fieldList ? fieldList.isCalculatedField : false,
            isNamedSet: fieldList ? fieldList.isNamedSets : false,
            showNoDataItems: fieldList ? fieldList.showNoDataItems : false,
            showSubTotals: fieldList ? fieldList.showSubTotals : false,
            type: fieldList ? fieldList.aggregateType as SummaryTypes : undefined,
            showFilterIcon: fieldList ? fieldList.showFilterIcon : false,
            showSortIcon: fieldList ? fieldList.showSortIcon : false,
            showRemoveIcon: fieldList ? fieldList.showRemoveIcon : true,
            showValueTypeIcon: fieldList ? fieldList.showValueTypeIcon : false,
            showEditIcon: fieldList ? fieldList.showEditIcon : false,
            allowDragAndDrop: fieldList ? fieldList.allowDragAndDrop : true
        } : undefined;
        return {
            fieldName: fieldName,
            fieldItem: fieldItem,
            axis: isValueField ? (this.parent.dataSourceSettings.valueAxis === 'row' ? 'rows' : 'columns') : 'fieldlist',
            position: -1
        } as FieldItemInfo;
    };

    public getTreeNode(treeElement: HTMLElement, top: number, left: number): string {
        if (treeElement) {
            return JSON.stringify((window as any).sfBlazor.getDomObject('currentNode', closest(document.elementFromPoint(left, top), 'li')));
        }
        return null;
    }

    public destroy(): void {
        this.keyboardModule.destroy();
    }
}