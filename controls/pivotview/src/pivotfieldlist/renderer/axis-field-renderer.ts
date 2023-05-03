import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { PivotButtonArgs } from '../../common/base/interface';
import { PivotButton } from '../../common/actions/pivot-button';
import { IDataSet, IFieldOptions } from '../../base/engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Module to render Axis Fields
 */
/** @hidden */
export class AxisFieldRenderer {
    /** @hidden */
    public parent: PivotFieldList;

    /** Constructor for render module */

    constructor(parent: PivotFieldList) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        if (!this.parent.pivotButtonModule || (this.parent.pivotButtonModule && this.parent.pivotButtonModule.isDestroyed)) {
            new PivotButton(this.parent);
        }
        this.createPivotButtons();
    }
    private createPivotButtons(): void {
        if (isNullOrUndefined(this.parent.dataSourceSettings.dataSource) && isNullOrUndefined(this.parent.dataSourceSettings.url)) {
            this.parent.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, true);
        }
        const rows: IFieldOptions[] = this.parent.dataSourceSettings.rows;
        const columns: IFieldOptions[] = this.parent.dataSourceSettings.columns;
        const values: IFieldOptions[] = this.parent.dataSourceSettings.values;
        const filters: IFieldOptions[] = this.parent.dataSourceSettings.filters;
        const fields: IFieldOptions[][] = [rows, columns, values, filters];
        const parentElement: HTMLElement = this.parent.dialogRenderer.parentElement;
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
        if ((this.parent.dataType === 'pivot' && this.parent.dataSourceSettings.dataSource && (this.parent.dataSourceSettings.dataSource as IDataSet[]).length > 0)
        || (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.url && this.parent.dataSourceSettings.url !== '')) {
            const axis: string[] = ['rows', 'columns', 'values', 'filters'];
            for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
                if (fields[len as number]) {
                    const args: PivotButtonArgs = {
                        field: fields[len as number],
                        axis: axis[len as number].toString()
                    };
                    this.parent.notify(events.pivotButtonUpdate, args);
                }
            }
        }
    }
}
