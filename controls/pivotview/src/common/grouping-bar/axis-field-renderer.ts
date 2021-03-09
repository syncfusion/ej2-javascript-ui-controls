import { IFieldOptions } from '../../base/engine';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotButton } from '../actions/pivot-button';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { PivotButtonArgs } from '../base/interface';
import { createElement, prepend } from '@syncfusion/ej2-base';

/**
 * Module to render Axis Fields
 */
/** @hidden */
export class AxisFields {
    public parent: PivotView;

    /** Constructor for render module
     * @param {PivotView} parent - Instance.
     */
    constructor(parent: PivotView) {    /* eslint-disable-line */
        this.parent = parent;
    }
    /**
     * Initialize the grouping bar pivot button rendering
     * @returns {void}
     * @private
     */
    public render(): void {
        /* eslint-disable */
        let pivotButtonModule: PivotButton =
            ((!this.parent.pivotButtonModule || (this.parent.pivotButtonModule && this.parent.pivotButtonModule.isDestroyed)) ?
                new PivotButton(this.parent) : this.parent.pivotButtonModule);
        /* eslint-enable */
        this.createPivotButtons();
        let pivotButtons: HTMLElement[] = [];
        for (let element of this.parent.element.querySelectorAll('.' + cls.GROUP_ROW_CLASS) as any) {   /* eslint-disable-line */
            if (!element.classList.contains(cls.GROUP_CHART_ROW)) {
                pivotButtons = pivotButtons.concat([].slice.call(element.querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS)));
            }
        }
        let vlen: number = pivotButtons.length;
        for (let j: number = 0; j < vlen; j++) {
            let indentWidth: number = 24;
            let indentDiv: Element = createElement('span', {
                className: 'e-indent-div',
                styles: 'width:' + j * indentWidth + 'px'
            });
            prepend([indentDiv], pivotButtons[j]);
        }
    }
    private createPivotButtons(): void {
        let fields: IFieldOptions[][] =
            [this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.columns,
            this.parent.dataSourceSettings.values, this.parent.dataSourceSettings.filters];
        for (let element of this.parent.element.querySelectorAll(
            '.' + cls.GROUP_ROW_CLASS + ',.' + cls.GROUP_COLUMN_CLASS + ',.'
            + cls.GROUP_VALUE_CLASS + ',.' + cls.GROUP_FILTER_CLASS) as any) {  /* eslint-disable-line */
            if ((this.parent.dataSourceSettings.values.length > 0 ? !element.classList.contains(cls.GROUP_CHART_VALUE) : true) ||
                (this.parent.dataSourceSettings.columns.length > 0 ? !element.classList.contains(cls.GROUP_CHART_COLUMN) : true)) {
                element.innerHTML = '';
            }
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        let axis: string[] = ['rows', 'columns', 'values', 'filters'];
        for (let i: number = 0, lnt: number = fields.length; i < lnt; i++) {
            if (fields[i]) {
                let args: PivotButtonArgs = {
                    field: fields[i],
                    axis: axis[i].toString()
                };
                this.parent.notify(events.pivotButtonUpdate, args);
            }
        }
    }
}
