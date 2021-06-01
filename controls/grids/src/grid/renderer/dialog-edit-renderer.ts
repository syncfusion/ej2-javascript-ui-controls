import { IGrid, ResponsiveDialogArgs } from '../base/interface';
import { Column } from '../models/column';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { remove, extend, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { appendChildren, applyBiggerTheme, addBiggerDialog } from '../base/util';
import { ResponsiveDialogRenderer } from './responsive-dialog-renderer';
import { ResponsiveDialogAction } from '../base/enum';
import * as literals from '../base/string-literals';


/**
 * Edit render module is used to render grid edit row.
 *
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
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
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

    private createDialogHeader(args: ResponsiveDialogArgs): Element | string {
        const gObj: IGrid = this.parent;
        let header: Element | string;
        if (this.parent.enableAdaptiveUI) {
            const responsiveDlgRenderer: ResponsiveDialogRenderer = new ResponsiveDialogRenderer(this.parent, this.serviceLocator);
            responsiveDlgRenderer.action = this.isEdit ? ResponsiveDialogAction.isEdit : ResponsiveDialogAction.isAdd;
            return responsiveDlgRenderer.renderResponsiveHeader(undefined, args);
        } else {
            if (gObj.editSettings.headerTemplate) {
                header = this.getDialogEditTemplateElement('HeaderTemplate', args);
            } else if (this.isEdit) {
                header = this.l10n.getConstant('EditFormTitle') + args.primaryKeyValue[0];
            } else {
                header = this.l10n.getConstant('AddFormTitle');
            }
        }
        return header;
    }

    private createDialog(elements: Element[], args: {
        primaryKeyValue?: string[], rowData?: Object,
        dialog?: DialogModel, target?: HTMLElement
    }): void {
        const gObj: IGrid = this.parent;
        this.dialog = this.parent.createElement('div', { id: gObj.element.id + '_dialogEdit_wrapper', styles: 'width: auto' });
        if (gObj.enableAdaptiveUI) {
            this.dialog.classList.add('e-responsive-dialog');
        }
        this.dialog.setAttribute('aria-label', 'Dialog edit');
        gObj.element.appendChild(this.dialog);
        this.setLocaleObj();
        // let position: PositionDataModel = this.parent.element.getBoundingClientRect().height < 400 ?
        //     { X: 'center', Y: 'top' } : { X: 'center', Y: 'center' };
        this.dialogObj = new Dialog(extend(
            {
                header: this.createDialogHeader(args), isModal: true, visible: true, cssClass: 'e-edit-dialog',
                content: this.getEditElement(elements, args) as HTMLElement,
                showCloseIcon: true,
                allowDragging: true,
                // position: position,
                close: this.dialogClose.bind(this),
                created: this.dialogCreated.bind(this),
                closeOnEscape: true, width: gObj.editSettings.template ? 'auto' : '330px',
                target: args.target ? args.target : document.body, animationSettings: { effect: 'None' },
                footerTemplate: gObj.editSettings.footerTemplate ? this.getDialogEditTemplateElement('FooterTemplate', args) : null,
                buttons: [{
                    click: this.btnClick.bind(this),
                    buttonModel: { content: this.l10n.getConstant('SaveButton'), cssClass: 'e-primary', isPrimary: true }
                },
                { click: this.btnClick.bind(this), buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') } }]
            },
            gObj.editSettings.dialog ? (gObj.editSettings.dialog.params || {}) : {}
        ));
        args.dialog = this.dialogObj;
        const isStringTemplate: string = 'isStringTemplate';
        this.dialogObj[isStringTemplate] = true;
        this.renderResponsiveDialog();
        this.dialogObj.appendTo(this.dialog);
        applyBiggerTheme(this.parent.element, this.dialogObj.element.parentElement);
        if (gObj.enableAdaptiveUI) {
            this.dialogObj.show(true);
        }
    }

    private dialogCreated(): void {
        addBiggerDialog(this.parent);
    }

    private renderResponsiveDialog(): void {
        if (this.parent.enableAdaptiveUI) {
            if (this.parent.adaptiveDlgTarget) {
                this.dialogObj.target = this.parent.adaptiveDlgTarget;
            }
            this.dialogObj.buttons = [{}];
            this.dialogObj.showCloseIcon = true;
            this.dialogObj.visible = false;
            this.dialogObj.width = '100%';
            this.dialogObj.open = () => {
                this.dialogObj.element.style.maxHeight = '100%';
            };
        }
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private destroy(args?: { requestType: string }): void {
        const dialogEditTemplates: string[] = ['template', 'headerTemplate', 'footerTemplate'];
        for (let i: number = 0; i < dialogEditTemplates.length; i++) {
            if (this.parent.editSettings[dialogEditTemplates[i]]) {
                const templateName: string = dialogEditTemplates[i].charAt(0).toUpperCase() + dialogEditTemplates[i].slice(1);
                const editTemplateID: string = this.parent.element.id + 'editSettings' + templateName;
                updateBlazorTemplate(editTemplateID, templateName, this.parent.editSettings);
            }
        }
        this.parent.notify(events.destroyForm, {});
        this.parent.isEdit = false;
        this.parent.notify(events.toolbarRefresh, {});
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    }

    private getDialogEditTemplateElement(dialogTemp: string, args: { rowData?: Object, form?: Element }): Element {
        const tempDiv: Element = this.parent.createElement('div', { className: 'e-dialog' + dialogTemp });
        const dummyData: Object = extend({}, args.rowData, { isAdd: !this.isEdit }, true);
        const templateID: string = this.parent.element.id + 'editSettings' + dialogTemp;
        appendChildren(tempDiv, (dialogTemp === 'HeaderTemplate' ?  this.parent.getEditHeaderTemplate() :
            this.parent.getEditFooterTemplate())(dummyData, this.parent, 'editSettings' + dialogTemp, templateID));
        updateBlazorTemplate(templateID, dialogTemp, this.parent.editSettings);
        return tempDiv;
    }

    private getEditElement(elements: Object, args: { rowData?: Object, form?: Element }): Element {
        const gObj: IGrid = this.parent;
        const div: Element = this.parent.createElement('div', { className: this.isEdit ? literals.editedRow : 'e-insertedrow' });
        const form: HTMLFormElement = args.form =
            this.parent.createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        if (this.parent.editSettings.template) {
            const editTemplateID: string = this.parent.element.id + 'editSettingsTemplate';
            const dummyData: Object = extend({}, args.rowData, { isAdd: !this.isEdit }, true);
            const isReactCompiler: boolean = this.parent.isReact && typeof (this.parent.editSettings.template) !== 'string';
            if (isReactCompiler) {
                this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID, null, null, form);
                this.parent.renderTemplates();
            } else {
                appendChildren(form, this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID));
            }
            const setRules: Function = () => {
                const columns: Column[] = this.parent.getColumns();
                for (let i: number = 0; i < columns.length; i++) {
                    if ((columns[i] as Column).validationRules) {
                        this.parent.editModule.formObj.rules[(columns[i] as Column).field] =
                        (columns[i] as Column).validationRules as {[rule: string]: Object};
                    }
                }
            };
            updateBlazorTemplate(editTemplateID, 'Template', this.parent.editSettings, true, setRules);
            div.appendChild(form);
            return div;
        }
        const table: Element = this.parent.createElement('table', { className: literals.table, attrs: { cellspacing: '6px' } });
        const tbody: Element = this.parent.createElement( literals.tbody);
        const cols: Column[] = gObj.getColumns() as Column[];
        for (let i: number = 0; i < cols.length; i++) {
            if (this.parent.editModule.checkColumnIsGrouped(cols[i]) || cols[i].commands || cols[i].commandsTemplate ||
                cols[i].type === 'checkbox') {
                continue;
            }
            const tr: Element = this.parent.createElement('tr');
            const dataCell: HTMLElement = this.parent.createElement('td', {
                className: literals.rowCell, attrs: {
                    style: 'text-align:' + (this.parent.enableRtl ? 'right' : 'left') + ';width:190px'
                }
            });
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

