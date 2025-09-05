import { IGrid, IAction, CustomEditEventArgs } from '../base/interface';
import { initialLoad } from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualContentRenderer, VirtualHeaderRenderer }  from '../renderer/virtual-content-renderer';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { RowRenderer } from '../renderer/row-renderer';
import { extend, getValue, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { Row } from '../models/row';
import { setComplexFieldID, setValidationRuels, getColumnModelByUid } from '../base/util';
import { EditRender } from '../renderer/edit-renderer';

/**
 * Virtual Scrolling class
 */
export class VirtualScroll implements IAction {
    private parent: IGrid;
    private blockSize: number;
    private locator: ServiceLocator;
    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'virtualscroll';
    }

    private instantiateRenderer(): void {
        this.parent.log(['limitation', 'virtual_height'], 'virtualization');
        const renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        if (this.parent.enableColumnVirtualization) {
            renderer.addRenderer(RenderType.Header, new VirtualHeaderRenderer(this.parent, this.locator));
        }
        renderer.addRenderer(RenderType.Content, new VirtualContentRenderer(this.parent, this.locator));
        if (!(!this.parent.enableVirtualization && this.parent.enableColumnVirtualization)) {
            this.ensurePageSize();
        }
    }

    public ensurePageSize(): void {
        const rowHeight: number = this.parent.getRowHeight();
        const vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.parent.height :
            this.parent.element.getBoundingClientRect().height;
        this.blockSize = ~~(parseFloat(vHeight.toString()) / rowHeight);
        const height: number =  this.blockSize * 2;
        const size: number = this.parent.pageSettings.pageSize;
        this.parent.setProperties({ pageSettings: { pageSize: size < height ? height : size }}, true);
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.columnWidthChanged, this.refreshVirtualElement, this);
        this.parent.on(events.createVirtualValidationForm, this.createVirtualValidationForm, this);
        this.parent.on(events.validateVirtualForm, this.virtualEditFormValidation, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(events.columnWidthChanged, this.refreshVirtualElement);
        this.parent.off(events.createVirtualValidationForm, this.createVirtualValidationForm);
        this.parent.off(events.validateVirtualForm, this.virtualEditFormValidation);
        this.parent.off(events.destroy, this.destroy);
    }

    private getCurrentEditedData(prevData: object): object {
        const data: { virtualData: Object, isAdd: boolean, isScroll: boolean, endEdit?: boolean } = {
            virtualData: extend({}, {}, prevData, true), isAdd: false, isScroll: false, endEdit: true
        };
        this.parent.notify(events.getVirtualData, data);
        return data.virtualData;
    }

    private createVirtualValidationForm(e: { uid: string, prevData: object, argsCreator: Function, renderer: EditRender }): void {
        const gObj: IGrid = this.parent;
        if (gObj.enableVirtualization && gObj.editSettings.mode === 'Normal') {
            const cols: Column[] = gObj.columns as Column[];
            const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.locator, null, this.parent);
            const rowObj: Row<Column> = extend({}, {}, gObj.getRowObjectFromUID(e.uid), true) as Row<Column>;
            gObj.notify(events.refreshVirtualEditFormCells, rowObj);
            const args: CustomEditEventArgs = e.argsCreator(this.getCurrentEditedData(e.prevData), {} as Row<Column>, false);
            args.isCustomFormValidation = true;
            args.row = rowRenderer.render(rowObj, cols);
            e.renderer.update(args);
            const rules: Object = {};
            for (let i: number = 0; i < cols.length; i++) {
                if (!cols[parseInt(i.toString(), 10)].visible) {
                    continue;
                }
                if (cols[parseInt(i.toString(), 10)].validationRules) {
                    setValidationRuels(cols[parseInt(i.toString(), 10)], 0, rules, {}, {}, cols.length, true);
                }
            }
            args.form.classList.add('e-virtual-validation');
            gObj.editModule.virtualFormObj = gObj.editModule.createFormObj(args.form, rules);
        }
    }

    private virtualEditFormValidation(args: { prevData: object, isValid: boolean, editIdx: number, addIdx: number }): void {
        const gObj: IGrid = this.parent;
        const error: HTMLElement = gObj.element.querySelector('.e-griderror:not([style*="display: none"])');
        if (gObj.editModule.virtualFormObj) {
            if (error && error.style.display !== 'none') {
                const errorDomRect: DOMRect | ClientRect = error.getBoundingClientRect();
                const forms: NodeListOf<Element> = gObj.element.querySelectorAll('.e-gridform');
                let form: Element = forms[0]; const contentLeft: number = gObj.getContent().getBoundingClientRect().left;
                if (forms.length > 1) {
                    form = forms[1];
                }
                if (errorDomRect.left < contentLeft || errorDomRect.right > gObj.element.offsetWidth) {
                    const tooltip: Element = form.querySelector('.e-tooltip-wrap:not([style*="display: none"])');
                    this.scrollToEdit(tooltip, { editIdx: args.editIdx, addIdx: args.addIdx }, true);
                }
            } else if (gObj.editModule.virtualFormObj && (!error || error.style.display === 'none')) {
                const existingErrors: NodeListOf<Element> = gObj.editModule.virtualFormObj.element.querySelectorAll('.e-tooltip-wrap:not([style*="display: none"])');
                for (let i: number = 0; i < existingErrors.length; i++) {
                    remove(existingErrors[parseInt(i.toString(), 10)]);
                }
                this.setEditedDataToValidationForm(gObj.editModule.virtualFormObj.element, this.getCurrentEditedData(args.prevData));
                args.isValid = gObj.editModule.virtualFormObj.validate();
                if (!args.isValid) {
                    const tooltip: Element = gObj.editModule.virtualFormObj.element.querySelector('.e-tooltip-wrap:not([style*="display: none"])');
                    this.scrollToEdit(tooltip, { editIdx: args.editIdx, addIdx: args.addIdx });
                }
            }
        }
    }

    private scrollToEdit(tooltip: Element, args: { editIdx: number, addIdx: number }, isRenderer?: boolean): void {
        const gObj: IGrid = this.parent;
        if (tooltip) {
            const cols: Column[] = (<{ columnModel?: Column[] }>gObj).columnModel;
            const field: string = setComplexFieldID(tooltip.id).split('_')[0];
            const col: Column = gObj.getColumnByField(field);
            const scrollTop: number = this.parent.getContent().firstElementChild.scrollTop;
            const row: Element = gObj.getRowByIndex(args.editIdx);
            if ((!isNullOrUndefined(args.addIdx) && scrollTop > 0) || (!isNullOrUndefined(args.editIdx) && !row) || isRenderer || !col) {
                let validationCol: Column;
                for (let i: number = 0; i < cols.length && !col; i++) {
                    if (cols[parseInt(i.toString(), 10)].field === field) {
                        validationCol = cols[parseInt(i.toString(), 10)] as Column;
                        break;
                    }
                }
                if (isRenderer) { validationCol = col; }
                this.parent.notify(events.scrollToEdit, validationCol);
            }
        }
    }

    private setEditedDataToValidationForm(form: Element, editedData: object): void {
        const inputs: HTMLInputElement[] = [].slice.call(form.getElementsByClassName('e-field'));
        for (let i: number = 0, len: number = inputs.length; i < len; i++) {
            const col: Column = getColumnModelByUid(this.parent, inputs[parseInt(i.toString(), 10)].getAttribute('data-mappinguid'));
            if (col.field) {
                let value: string = getValue(col.field, editedData);
                value = isNullOrUndefined(value) ? '' : value;
                inputs[parseInt(i.toString(), 10)].value = value;
            }
        }
    }

    private refreshVirtualElement(args: {module: string}): void {
        if (this.parent.enableColumnVirtualization && args.module === 'resize') {
            const renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
            (renderer.getRenderer(RenderType.Content) as VirtualContentRenderer).refreshVirtualElement();
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
