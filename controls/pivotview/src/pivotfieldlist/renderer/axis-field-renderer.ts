import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { PivotButtonArgs } from '../../common/base/interface';
import { PivotButton } from '../../common/actions/pivot-button';
import { IFieldOptions } from '../../base/engine';

/**
 * Module to render Axis Fields
 */
/** @hidden */
export class AxisFieldRenderer {
    public parent: PivotFieldList;
    private pivotButton: PivotButton;

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    public render(): void {
        this.pivotButton = new PivotButton(this.parent);
        this.createPivotButtons();
    }
    private createPivotButtons(): void {
        let rows: IFieldOptions[] = this.parent.dataSource.rows;
        let columns: IFieldOptions[] = this.parent.dataSource.columns;
        let values: IFieldOptions[] = this.parent.dataSource.values;
        let filters: IFieldOptions[] = this.parent.dataSource.filters;
        let fields: IFieldOptions[][] = [rows, columns, values, filters];
        let parentElement: HTMLElement = this.parent.dialogRenderer.parentElement;
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-filters')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-filters').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-rows')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-rows').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-columns')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-columns').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-values')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-values').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        let axis: String[] = ['rows', 'columns', 'values', 'filters'];
        for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            if (fields[len]) {
                let args: PivotButtonArgs = {
                    field: fields[len],
                    axis: axis[len].toString()
                };
                this.parent.notify(events.pivotButtonUpdate, args);
            }
        }
    }
}