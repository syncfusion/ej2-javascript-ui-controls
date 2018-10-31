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
    private pivotButton: PivotButton;

    /** Constructor for render module */
    constructor(parent: PivotView) {
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
        let pivotButtons: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.GROUP_ROW_CLASS)
            .querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS));
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
            [this.parent.dataSource.rows, this.parent.dataSource.columns, this.parent.dataSource.values, this.parent.dataSource.filters];
        this.parent.element.querySelector('.' + cls.GROUP_ROW_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + cls.GROUP_COLUMN_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + cls.GROUP_VALUE_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + cls.GROUP_FILTER_CLASS).innerHTML = '';
        let axis: String[] = ['rows', 'columns', 'values', 'filters'];
        let count: number = axis.length;
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