import { createElement, Droppable, EventHandler, removeClass, addClass } from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';

/**
 * Module to render Axis Field Table
 */
/** @hidden */
export class AxisTableRenderer {
    public parent: PivotFieldList;
    /** @hidden */
    public axisTable: Element;

    private leftAxisPanel: HTMLElement;
    private rightAxisPanel: HTMLElement;

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
    }

    /**
     * Initialize the axis table rendering
     * @returns void
     * @private
     */
    public render(): void {
        if (!this.parent.isAdaptive) {
            let axisTable: Element = createElement('div', { className: cls.AXIS_TABLE_CLASS });
            this.leftAxisPanel = createElement('div', { className: cls.LEFT_AXIS_PANEL_CLASS });
            this.rightAxisPanel = createElement('div', { className: cls.RIGHT_AXIS_PANEL_CLASS });
            this.parent.dialogRenderer.parentElement.appendChild(axisTable);
            axisTable.appendChild(this.leftAxisPanel);
            axisTable.appendChild(this.rightAxisPanel);
            this.axisTable = axisTable;
            this.renderAxisTable();
        }
        this.parent.axisFieldModule.render();
    }
    private renderAxisTable(): void {
        let fieldLabels: string[] = ['filters', 'rows', 'columns', 'values'];
        for (let len: number = 0, lnt: number = fieldLabels.length; len < lnt; len++) {
            let axis: HTMLElement = createElement('div', {
                className: cls.FIELD_LIST_CLASS + '-' + fieldLabels[len]
            });
            let axisTitleWrapper: HTMLElement = createElement('div', {
                className: cls.AXIS_ICON_CLASS + '-wrapper'
            });
            let axisTitle: HTMLElement = createElement('div', {
                className: cls.AXIS_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant(fieldLabels[len])
            });
            axisTitleWrapper.appendChild(this.getIconupdate(fieldLabels[len]));
            axisTitleWrapper.appendChild(axisTitle);
            let axisContent: HTMLElement = createElement('div', { className: cls.AXIS_CONTENT_CLASS + ' ' + 'e-' + fieldLabels[len] });
            let localePrompt: string;
            if (fieldLabels[len] === 'rows') {
                localePrompt = this.parent.localeObj.getConstant('dropRowPrompt');
            } else if (fieldLabels[len] === 'columns') {
                localePrompt = this.parent.localeObj.getConstant('dropColPrompt');
            } else if (fieldLabels[len] === 'values') {
                localePrompt = this.parent.localeObj.getConstant('dropValPrompt');
            } else {
                localePrompt = this.parent.localeObj.getConstant('dropFilterPrompt');
            }
            let axisPrompt: HTMLElement = createElement('span', {
                className: cls.AXIS_PROMPT_CLASS,
                innerHTML: localePrompt
            });
            let droppable: Droppable = new Droppable(axisContent, {});
            axis.appendChild(axisTitleWrapper);
            axis.appendChild(axisContent);
            axis.appendChild(axisPrompt);
            if (len <= 1) {
                this.leftAxisPanel.appendChild(axis);
            } else {
                this.rightAxisPanel.appendChild(axis);
            }
            this.unWireEvent(axisContent);
            this.wireEvent(axisContent);
        }
    }
    private getIconupdate(axis: string): HTMLElement {
        let axisWrapper: HTMLElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: cls.AXIS_ICON_CLASS + '-icon-wrapper'
        });
        let axisElement: HTMLElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: cls.ICON + ' ' + cls.AXIS_ICON_CLASS + '-' + axis
        });
        axisWrapper.appendChild(axisElement);
        return axisWrapper;
    }
    private wireEvent(element: Element): void {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        EventHandler.add(element, 'mouseleave', this.updateDropIndicator, this);
    }
    private unWireEvent(element: Element): void {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        EventHandler.remove(element, 'mouseleave', this.updateDropIndicator);
    }
    private updateDropIndicator(e: MouseEvent): void {
        let parentElement: HTMLElement = this.parent.dialogRenderer.parentElement;
        if (this.parent.isDragging && (e.target as HTMLElement).classList.contains(cls.AXIS_CONTENT_CLASS) && e.type === 'mouseover') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
            let element: HTMLElement[] =
                [].slice.call((e.target as HTMLElement).querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS));
            if (element.length > 0) {
                addClass([element[element.length - 1].querySelector('.' + cls.DROP_INDICATOR_CLASS + '-last')], cls.INDICATOR_HOVER_CLASS);
            }
        } else if (e.type === 'mouseleave') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
    }
}