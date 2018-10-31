import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { Dialog, PositionDataModel, DialogModel } from '@syncfusion/ej2-popups';
import { remove, extend } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { appendChildren } from '../base/util';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class DialogEditRender {
    //Internal variables              

    //Module declarations
    private parent: IGrid;
    private l10n: L10n;
    private isEdit: boolean;
    private serviceLocator: ServiceLocator;
    private dialog: HTMLElement;
    private dialogObj: Dialog;
    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.dialogDestroy, this.destroy, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    private setLocaleObj(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
    }

    public addNew(elements: Element[], args: { primaryKeyValue?: string[] }): void {
        this.isEdit = false;
        this.createDialog(elements, args);
    }

    public update(elements: Element[], args: { primaryKeyValue?: string[] }): void {
        this.isEdit = true;
        this.createDialog(elements, args);
    }

    private createDialog(elements: Element[], args: { primaryKeyValue?: string[], rowData?: Object,
        dialog?: DialogModel }): void {
        let gObj: IGrid = this.parent;
        this.dialog = this.parent.createElement('div', { id: gObj.element.id + '_dialogEdit_wrapper', styles: 'width: auto' });
        gObj.element.appendChild(this.dialog);
        this.setLocaleObj();
        let position: PositionDataModel = this.parent.element.getBoundingClientRect().height < 400 ?
            { X: 'center', Y: 'top' } : { X: 'center', Y: 'center' };
        this.dialogObj = args.dialog = new Dialog({
            header: this.isEdit ? this.l10n.getConstant('EditFormTitle') + args.primaryKeyValue[0] :
                this.l10n.getConstant('AddFormTitle'), isModal: true, visible: true, cssClass: 'e-edit-dialog',
            content: this.getEditElement(elements, args) as HTMLElement,
            showCloseIcon: true,
            allowDragging: true,
            position: position,
            close: this.dialogClose.bind(this),
            closeOnEscape: true, width: gObj.editSettings.template ? 'auto' : '330px',
            target: gObj.element, animationSettings: { effect: 'None' },
            buttons: [{
                click: this.btnClick.bind(this),
                buttonModel: { content: this.l10n.getConstant('SaveButton'), cssClass: 'e-primary', isPrimary: true }
            },
            { click: this.btnClick.bind(this), buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') } }]
        });
        this.dialogObj.appendTo(this.dialog);
    }

    private btnClick(e: MouseEvent): void {
        if (this.l10n.getConstant('CancelButton').toLowerCase() === (e.target as HTMLInputElement).innerText.trim().toLowerCase()) {
            this.dialogClose();
        } else {
            this.parent.endEdit();
        }
    }

    private dialogClose(): void {
        this.parent.closeEdit();
        this.destroy();
    }

    private destroy(args?: { requestType: string }): void {
        this.parent.notify(events.destroyForm, {});
        this.parent.isEdit = false;
        this.parent.notify(events.toolbarRefresh, {});
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }

    private getEditElement(elements: Object, args: {rowData?: Object, form?: Element}): Element {
        let gObj: IGrid = this.parent;
        let div: Element = this.parent.createElement('div', { className: this.isEdit ? 'e-editedrow' : 'e-insertedrow' });
        let form: HTMLFormElement = args.form =
        this.parent.createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        if (this.parent.editSettings.template) {
            let dummyData: Object = extend({}, args.rowData, {isAdd: !this.isEdit}, true);
            appendChildren(form, this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate'));
            div.appendChild(form);
            return div;
        }
        let table: Element = this.parent.createElement('table', { className: 'e-table', attrs: { cellspacing: '6px' } });
        let tbody: Element = this.parent.createElement('tbody');
        let cols: Column[] = gObj.getColumns() as Column[];
        for (let i: number = 0; i < cols.length; i++) {
            if (!cols[i].visible || cols[i].commands || cols[i].commandsTemplate) {
                continue;
            }
            let tr: Element = this.parent.createElement('tr');
            let dataCell: HTMLElement = this.parent.createElement('td', {
                className: 'e-rowcell', attrs: {
                    style: 'text-align:' + (this.parent.enableRtl ? 'right' : 'left') + ';width:190px'
                }
            });
            let label: Element = this.parent.createElement('label', { innerHTML: cols[i].field });
            elements[cols[i].uid].classList.remove('e-input');
            dataCell.appendChild(elements[cols[i].uid]);
            tr.appendChild(dataCell);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        form.appendChild(table);
        div.appendChild(form);
        return div;
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.dialogDestroy, this.destroy);
        this.parent.off(events.destroy, this.destroy);
    }
}

