import { BlazorPivotElement, IPivotOptions } from '../common/interfaces';
import { BlazorDotnetObject, setStyleAttribute, addClass, removeClass, Browser, EventHandler } from '@syncfusion/ej2-base';
import * as cls from '../common/constants';
import { TreeRenderer } from '../pivotfieldlist/tree-renderer';
import { PivotButton } from '../common/pivot-button';
import { CalculatedField } from '../common/calculated-field';
import { closest } from '@syncfusion/ej2-base';
import { ActionBase } from '../common/action-base';
import { IOlapFieldListOptions } from '../../src/base/olap/engine';
import { DataSourceSettingsModel } from '../../src/pivotview/model/datasourcesettings-model';
import { SfPivotView } from '../pivotview/sf-pivotview-fn';

/**
 * SfPivotFieldList client constructor
 */
export class SfPivotFieldList {
    public element: BlazorPivotElement;
    public dotNetRef: BlazorDotnetObject;
    public parentElement: HTMLElement;
    public options: IPivotOptions;
    public dataSourceSettings: DataSourceSettingsModel;
    public pivotButtonModule: PivotButton;
    public calculatedFieldModule: CalculatedField;
    public treeRendererModule: TreeRenderer;
    public commonActionModule: ActionBase;
    public isDragging: boolean;
    public fieldList: IOlapFieldListOptions;
    public isAdaptive: Boolean;

    private pivotGridModule: SfPivotView;

    constructor(element: BlazorPivotElement, options: IPivotOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.getOptions(element, options);
        this.dotNetRef = dotnetRef;
    }

    public getOptions(element: BlazorPivotElement, options: IPivotOptions): void {
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.parentElement = document.getElementById(element.id + '_Dialog_Container');
        this.isAdaptive = Browser.isDevice;
        /* tslint:disable */
        this.pivotGridModule = options.pivotGridModule && options.pivotGridModule.blazor__instance ?
            options.pivotGridModule.blazor__instance : options.pivotGridModule as any;
        /* tslint:enable */
        this.fieldList = options.fieldList;
        this.dataSourceSettings = options.dataSourceSettings;
        if (this.parentElement && this.parentElement.querySelector('#' + this.parentElement.id + '_title')) {
            setStyleAttribute(this.parentElement.querySelector('#' + this.parentElement.id + '_title'), { 'width': '100%' });
        }
    }

    private initModules(): void {
        this.treeRendererModule = new TreeRenderer(this);
        this.commonActionModule = new ActionBase(this);
        this.pivotButtonModule = new PivotButton(this);
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule = new CalculatedField(this);
        }
        this.unWireEvents();
        this.wireEvents();
    }

    public contentReady(): void {
        this.initModules();
        if (this.parentElement && this.parentElement.querySelector('#' + this.parentElement.id + '_title')) {
            setStyleAttribute(this.parentElement.querySelector('#' + this.parentElement.id + '_title'), { 'width': '100%' });
        }
    }

    public onShowFieldList(element: HTMLElement, dialogElement: HTMLElement): void {
        if (element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
            addClass([element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        }
        dialogElement.style.top = parseInt(dialogElement.style.top, 10) < 0 ? '0px' : dialogElement.style.top;
    }

    public removeFieldListIcon(element: HTMLElement): void {
        if (!document.getElementById(element.id + 'calculateddialog') && element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)) {
            removeClass([element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        }
    }

    public updateFieldList(containerElement: HTMLElement): void {
        let footer: HTMLElement = containerElement.querySelector('.' + cls.FOOTER_CONTENT_CLASS);
        if (containerElement.querySelector('#' + containerElement.id + '_dialog-content')) {
            setStyleAttribute(containerElement.querySelector('#' + containerElement.id + '_dialog-content'), {
                'padding': '0'
            });
            addClass([footer], cls.FIELD_LIST_FOOTER_CLASS);
        } else {
            containerElement.querySelector('.' + cls.ADAPTIVE_CONTAINER_CLASS).appendChild(footer);
        }
    }

    public updateSelectedNodes(node: HTMLElement, state: string): void {
        node = closest(node, '.' + cls.TEXT_CONTENT_CLASS) as HTMLElement;
        if (state === 'check') {
            addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        } else {
            removeClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        }
        let li: HTMLElement = closest(node, 'li') as HTMLElement;
        if (li && li.querySelector('ul')) {
            for (let element of [].slice.call(li.querySelectorAll('li'))) {
                if (state === 'check') {
                    addClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                } else {
                    removeClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                }
            }
        }
    }

    private removeFocusedElements(): void {
        if (this.element.querySelectorAll('.' + cls.BUTTON_FOCUSED).length > 0) {
            removeClass(this.element.querySelectorAll('.' + cls.BUTTON_FOCUSED), cls.BUTTON_FOCUSED);
        }
    }

    private wireEvents(): void {
        EventHandler.add(document, 'click', this.removeFocusedElements, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(document, 'click', this.removeFocusedElements);
    }

    public destroy(): void {
        this.unWireEvents();
        this.commonActionModule.destroy();
        this.pivotButtonModule.destroy();
        if (this.pivotGridModule) {
            this.pivotGridModule.destroy();
        }
    }
}