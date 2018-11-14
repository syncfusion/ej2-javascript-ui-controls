import { PivotView } from '../../pivotview/base/pivotview';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import * as cls from '../base/css-constant';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { createElement, setStyleAttribute, formatUnit, prepend, addClass, removeClass } from '@syncfusion/ej2-base';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';

PivotFieldList.Inject(CalculatedField);
/**
 * Module for Field List rendering
 */
/** @hidden */
export class FieldList implements IAction {
    /**
     * Module declarations
     */
    private parent: PivotView;
    private element: HTMLElement;
    private handlers: {
        load: Function,
        update: Function
    };
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;

    /** Constructor for Field List module */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'fieldlist';
    }

    private initiateModule(): void {
        this.element = createElement('div', {
            id: this.parent.element.id + '_PivotFieldList',
            styles: 'position:' + (this.parent.enableRtl ? 'static' : 'absolute') + ';height:0;width:' + this.parent.element.style.width
        });
        this.parent.element.parentElement.setAttribute('id', 'ContainerWrapper');
        this.parent.element.parentElement.appendChild(this.element);
        this.parent.element.parentElement.appendChild(this.parent.element);
        this.parent.pivotFieldListModule = new PivotFieldList({
            dataSource: {
                rows: [],
                columns: [],
                values: [],
                filters: []
            },
            renderMode: 'Popup',
            allowCalculatedField: this.parent.allowCalculatedField,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: this.parent.element.parentElement
        });
        this.parent.pivotFieldListModule.appendTo('#' + this.element.id);
    }

    private updateControl(): void {
        if (this.element) {
            prepend([this.element], this.parent.element);
            if (this.parent.grid && this.parent.showGroupingBar && this.parent.groupingBarModule) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(() => {
                    if (this.parent.grid && this.parent.grid.element) {
                        setStyleAttribute(this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement, {
                            left: formatUnit(this.parent.enableRtl ?
                                -Math.abs((this.parent.isAdaptive ? 500 : this.parent.grid.element.offsetWidth) -
                                    (this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth) :
                                (this.parent.isAdaptive ? 500 : this.parent.grid.element.offsetWidth) -
                                (this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth)
                        });
                        if (this.parent.enableRtl) {
                            addClass([this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                        } else {
                            removeClass([this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                        }
                    }
                });
            } else {
                if (this.parent.enableRtl) {
                    removeClass([this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                } else {
                    addClass([this.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                }
            }
            setStyleAttribute(this.element, {
                width: formatUnit(this.parent.element.offsetWidth)
            });
        }
        this.parent.pivotFieldListModule.update(this.parent);
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.initiateModule,
            update: this.updateControl
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initSubComponent, this.handlers.load, this);
        this.parent.on(events.uiUpdate, this.handlers.update, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initSubComponent, this.handlers.load);
        this.parent.off(events.uiUpdate, this.handlers.update);
    }

    /**
     * To destroy the Field List 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pivotFieldListModule) {
            this.parent.pivotFieldListModule.destroy();
        } else {
            return;
        }
    }
}