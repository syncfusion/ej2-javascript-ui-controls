import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { isNullOrUndefined, addClass, extend, closest, updateBlazorTemplate, isBlazor } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { appendChildren, alignFrozenEditForm, getMovableTbody, getFrozenRightTbody } from '../base/util';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class InlineEditRender {
    //Internal variables              

    //Module declarations
    private parent: IGrid;
    private isEdit: boolean;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public addNew(elements: Object, args: { row?: Element, rowData?: Object }): void {
        this.isEdit = false;
        let tbody: Element;
        let mTbody: Element = getMovableTbody(this.parent);
        let frTbody: Element = getFrozenRightTbody(this.parent);
        if (this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top') {
            tbody = this.parent.getHeaderTable().querySelector('tbody');
        } else {
            tbody = this.parent.getContentTable().querySelector('tbody');
        }
        args.row = this.parent.createElement('tr', { className: 'e-row e-addedrow' });
        if (tbody.querySelector('.e-emptyrow')) {
            let emptyRow: Element = tbody.querySelector('.e-emptyrow');
            emptyRow.parentNode.removeChild(emptyRow);
            if (this.parent.isFrozenGrid()) {
                let moveTbody: Element = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
                (moveTbody.firstElementChild).parentNode.removeChild(moveTbody.firstElementChild);
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    let frTbody: Element = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('tbody');
                    (frTbody.firstElementChild).parentNode.removeChild(frTbody.firstElementChild);
                }
            }
        }
        this.parent.editSettings.newRowPosition === 'Top' ? tbody.insertBefore(args.row, tbody.firstChild) : tbody.appendChild(args.row);
        args.row.appendChild(this.getEditElement(elements, false, undefined, args, true));
        this.parent.editModule.checkLastRow(args.row, args);
        if (this.parent.isFrozenGrid()) {
            let mEle: Element = this.renderMovableform(args.row, args);
            this.parent.editSettings.newRowPosition === 'Top' ? mTbody.insertBefore(mEle, mTbody.firstChild) : mTbody.appendChild(mEle);
            args.row.querySelector('.e-normaledit').setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
            mEle.setAttribute('colspan', '' + (this.parent.getVisibleColumns().length - this.parent.getVisibleFrozenColumns()));
            if (frTbody) {
                let frEle: Element = this.renderFrozenRightForm(args.row, args);
                this.parent.editSettings.newRowPosition === 'Top' ? frTbody.insertBefore(frEle, frTbody.firstChild)
                    : frTbody.appendChild(frEle);
                let colSpan: number = this.parent.getVisibleFrozenColumns() - this.parent.getFrozenRightColumnsCount();
                args.row.querySelector('.e-normaledit').setAttribute('colspan', colSpan + '');
                frEle.querySelector('.e-normaledit').setAttribute('colspan', '' + this.parent.getFrozenRightColumnsCount());
            }
            if (this.parent.height === 'auto') {
                this.parent.notify(events.frozenHeight, {});
            }
        }
    }

    private renderFrozenRightForm(ele: Element, args: { rowData?: Object, frozenRightForm?: HTMLFormElement }): Element {
        let frEle: Element = ele.cloneNode(true) as Element;
        let form: HTMLFormElement = args.frozenRightForm = frEle.querySelector('form');
        if (this.parent.editSettings.template) {
            form.innerHTML = '';
            this.appendChildren(form, args.rowData, false);
            return frEle;
        }
        this.renderRightFrozen(ele, frEle);
        frEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-frozen-right-header').querySelector('colgroup').innerHTML;
        return frEle;
    }

    private renderMovableform(ele: Element, args: {rowData?: Object, movableForm?: HTMLFormElement }): Element {
        let mEle: Element = ele.cloneNode(true) as Element;
        let form: HTMLFormElement = args.movableForm = mEle.querySelector('form');
        if (this.parent.editSettings.template) {
            form.innerHTML = '';
            this.appendChildren(form, args.rowData, false);
            return mEle;
        }
        this.renderMovable(ele, mEle);
        mEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
        return mEle;
    }

    private updateFreezeEdit(row: Element, td: HTMLElement[]): HTMLElement[] {
        td = td.concat([].slice.call(this.getFreezeRow(row).querySelectorAll('td.e-rowcell')));
        if (this.parent.getFrozenMode() === 'Left-Right') {
            td = td.concat([].slice.call(this.getFreezeRightRow(row).querySelectorAll('td.e-rowcell')));
        }
        return td;
    }

    private getFreezeRightRow(row: Element): Element {
        let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
        let fCont: Element = this.parent.getFrozenLeftContentTbody();
        let fHdr: Element = this.parent.getFrozenHeaderTbody();
        let frHdr: Element = this.parent.getFrozenRightHeaderTbody();
        let frCont: Element = this.parent.getFrozenRightContentTbody();
        if (fCont.contains(row) || fHdr.contains(row)) {
            return this.parent.getFrozenRightRowByIndex(idx);
        } else if (frCont.contains(row) || frHdr.contains(row)) {
            return this.parent.getRowByIndex(idx);
        }
        return row;
    }

    private getFreezeRow(row: Element): Element {
        if (this.parent.isFrozenGrid()) {
            let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
            let fCont: Element = this.parent.getFrozenLeftContentTbody();
            let mCont: Element = this.parent.getMovableContentTbody();
            let fHdr: Element = this.parent.getFrozenHeaderTbody();
            let mHdr: Element = this.parent.getMovableHeaderTbody();
            if (fCont.contains(row) || fHdr.contains(row)) {
                return this.parent.getMovableRowByIndex(idx);
            } else if (mCont.contains(row) || mHdr.contains(row)) {
                return this.parent.getRowByIndex(idx);
            }
        }
        return row;
    }

    public update(elements: Object, args: { row?: Element, rowData?: Object }): void {
        this.isEdit = true;
        let cloneRow: string = 'cloneRow';
        if (closest(args.row, '.e-movablecontent') || closest(args.row, '.e-movableheader')) {
            args.row = this.getFreezeRow(args.row);
            if (isBlazor() && this.parent.isServerRendered) {
                args[cloneRow] = args.row.cloneNode(true);
            }
        }
        if (closest(args.row, '.e-frozen-right-content') || closest(args.row, '.e-frozen-right-header')) {
            args.row = this.getFreezeRightRow(args.row);
        }
        if (isBlazor() && this.parent.isServerRendered) {
            args.row.parentNode.insertBefore(args[cloneRow], args.row);
            args.row.classList.add('e-hiddenrow');
            let tdElement: HTMLElement[] = [].slice.call(args[cloneRow].querySelectorAll('td.e-rowcell'));
            args[cloneRow].innerHTML = '';
            tdElement = this.updateFreezeEdit(args[cloneRow], tdElement);
            args[cloneRow].appendChild(this.getEditElement(elements, true, tdElement, args, true));
            args[cloneRow].classList.add('e-editedrow');
            this.refreshFreezeEdit(args[cloneRow], args);
        } else {
            let tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
            args.row.innerHTML = '';
            tdElement = this.updateFreezeEdit(args.row, tdElement);
            args.row.appendChild(this.getEditElement(elements, true, tdElement, args, true));
            args.row.classList.add('e-editedrow');
            this.parent.editModule.checkLastRow(args.row, args);
            this.refreshFreezeEdit(args.row, args);
        }
    }

    private refreshFreezeEdit(
        row: Element, args: {
            rowData?: Object, form?: HTMLFormElement, movableForm?: HTMLFormElement,
            frozenRightForm?: HTMLFormElement
        }): void {
        let td: Element = row.firstChild as Element;
        if (this.parent.getVisibleFrozenColumns() && this.parent.editSettings.template) {
                td.querySelector('colgroup').innerHTML = this.parent.getHeaderContent().querySelector('.e-frozenheader').
                 querySelector('colgroup').innerHTML;
        }
        let fCls: string;
        let cont: Element;
        let frozen: string = 'frozen';
        let cloneFrozen: string = 'cloneFrozen';
        let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
        if (this.parent.isFrozenGrid()) {
            if (idx < this.parent.frozenRows) {
                cont = this.parent.getHeaderContent();
                fCls = '.e-frozenheader';
            } else {
                cont = this.parent.getContent();
                fCls = '.e-frozencontent';
            }
            let mTd: Element = td.cloneNode(true) as Element;
            let frTd: Element = td.cloneNode(true) as Element;
            let form: HTMLFormElement = args.movableForm  = mTd.querySelector('form');
            if (this.parent.editSettings.template) {
                this.refreshEditForm(form, args.rowData);
            }
            let fRows: Element;
            let frRows: Element;
            if (cont.querySelector(fCls).contains(row)) {
                fRows = this.parent.getMovableRowByIndex(idx);
                if (isBlazor() && this.parent.isServerRendered) {
                    args[frozen] = fRows;
                    args[cloneFrozen] = fRows.cloneNode(true);
                    fRows.classList.add('e-hiddenrow');
                    fRows.parentNode.insertBefore(args[cloneFrozen], fRows);
                    this.updateFrozenCont(args[cloneFrozen], td, mTd);
                } else {
                    this.updateFrozenCont(fRows, td, mTd);
                    if (this.parent.getFrozenMode() === 'Left-Right') {
                        args.frozenRightForm = frTd.querySelector('form');
                        this.refreshEditForm(args.frozenRightForm, args.rowData);
                        frRows = this.parent.getFrozenRightRowByIndex(idx);
                        this.updateFrozenRightCont(frRows, td, frTd);
                    }
                }
            } else {
                fRows = this.parent.getRowByIndex(idx);
                if (isBlazor() && this.parent.isServerRendered) {
                    args[frozen] = fRows;
                    args[cloneFrozen] = fRows.cloneNode(true);
                    fRows.parentNode.insertBefore(args[cloneFrozen], fRows);
                    fRows.classList.add('e-hiddenrow');
                    this.updateFrozenCont(args[cloneFrozen], mTd, td);
                } else {
                    this.updateFrozenCont(fRows, mTd, td);
                    if (this.parent.getFrozenMode() === 'Left-Right') {
                        args.frozenRightForm = frTd.querySelector('form');
                        this.refreshEditForm(args.frozenRightForm, args.rowData);
                        frRows = this.parent.getFrozenRightRowByIndex(idx);
                        this.updateFrozenRightCont(frRows, frTd, td);
                    }
                }
            }
            if (isBlazor() && this.parent.isServerRendered) {
                args[cloneFrozen].appendChild(mTd);
                args[cloneFrozen].classList.add('e-editedrow');
            } else {
                fRows.appendChild(mTd);
                fRows.classList.add('e-editedrow');
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    frRows.appendChild(frTd);
                    frRows.classList.add('e-editedrow');
                    alignFrozenEditForm(args.frozenRightForm.querySelector('td:not(.e-hide)'), args.form.querySelector('td:not(.e-hide)'));
                }
            }
            alignFrozenEditForm(args.movableForm.querySelector('td:not(.e-hide)'), args.form.querySelector('td:not(.e-hide)'));
        }
    }

    private refreshEditForm(form: HTMLFormElement, data: object): void {
        if (this.parent.editSettings.template) {
            form.innerHTML = '';
            this.appendChildren(form, data, false);
        }
    }

    private updateFrozenRightCont(row: Element, ele: Element, frEle: Element): void {
        row.innerHTML = '';
        this.renderRightFrozen(ele, frEle);
        frEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-frozen-right-header').querySelector('colgroup').innerHTML;
        ele.setAttribute('colspan', this.parent.getVisibleFrozenColumns() - this.parent.getFrozenRightColumnsCount() + '');
        frEle.setAttribute('colspan', this.parent.getFrozenRightColumnsCount() + '');
    }

    private updateFrozenCont(row: Element, ele: Element, mEle: Element): void {
        row.innerHTML = '';
        this.renderMovable(ele, mEle);
        mEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
        ele.setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
        mEle.setAttribute('colspan', this.parent.getVisibleColumns().length - this.parent.getVisibleFrozenColumns() + '');
    }

    private renderRightFrozen(ele: Element, frEle: Element): void {
        frEle.querySelector('tr').innerHTML = '';
        let cols: Column[] = this.parent.getColumns();
        let k: number = 0;
        for (let i: number = 0; i < cols.length; i++ , k++) {
            if (cols[i].getFreezeTableName() === 'frozen-right') {
                let index: number = k - this.parent.getMovableColumnsCount();
                frEle.querySelector('tr').appendChild(ele.querySelector('tr').removeChild(ele.querySelector('tr').children[index]));
                k--;
            }
        }
    }

    private renderMovable(ele: Element, mEle: Element): void {
        mEle.querySelector('tr').innerHTML = '';
        let cols: Column[] = this.parent.getColumns();
        let k: number = 0;
        for (let i: number = 0; i < cols.length; i++, k++) {
            if (cols[i].getFreezeTableName() === 'movable') {
                mEle.querySelector('tr').appendChild(ele.querySelector('tr').removeChild(ele.querySelector('tr').children[k]));
                k--;
            }
        }
    }

    private getEditElement(elements?: Object, isEdit?: boolean, tdElement?: HTMLElement[], args?: {rowData?: Object}, isFrozen?: boolean):
    Element {
        let gObj: IGrid = this.parent;
        let gLen: number = 0;
        let isDetail: number = !isNullOrUndefined(gObj.detailTemplate) || !isNullOrUndefined(gObj.childGrid) ? 1 : 0;
        if (gObj.allowGrouping) {
            gLen = gObj.groupSettings.columns.length;
        }
        let td: HTMLTableCellElement = this.parent.createElement('td', {
            className: 'e-editcell e-normaledit',
            attrs: { colspan: (gObj.getVisibleColumns().length - gObj.getVisibleFrozenColumns() + this.parent.getIndentCount()).toString() }
        }) as HTMLTableCellElement;
        let form: HTMLFormElement = (<{form: HTMLFormElement}>args).form =
        this.parent.createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        if (this.parent.editSettings.template) {
            this.appendChildren(form, args.rowData, isFrozen);
            td.appendChild(form);
            return td;
        }
        let table: Element = this.parent.createElement('table', { className: 'e-table e-inline-edit', attrs: { cellspacing: '0.25' } });
        table.appendChild(gObj.getContentTable().querySelector('colgroup').cloneNode(true));
        let tbody: Element = this.parent.createElement('tbody');
        let tr: Element = this.parent.createElement('tr');
        let i: number = 0;
        if (isDetail) {
            tr.insertBefore(this.parent.createElement('td', { className: 'e-detailrowcollapse' }), tr.firstChild);
        }
        if (gObj.isRowDragable()) {
            tr.appendChild(this.parent.createElement('td', { className: 'e-dragindentcell' }));
        }
        while (i < gLen) {
            tr.appendChild(this.parent.createElement('td', { className: 'e-indentcell' }));
            i++;
        }
        let m: number = 0;
        i = 0;
        while ((isEdit && m < tdElement.length && i < gObj.getColumns().length) || i < gObj.getColumns().length) {
            let span: string = isEdit ? tdElement[m].getAttribute('colspan') : null;
            let col: Column = gObj.getColumns()[i] as Column;
            let td: HTMLElement = this.parent.createElement(
                'td',
                {
                    className: 'e-rowcell', attrs:
                        { style: 'text-align:' + (col.textAlign ? col.textAlign : ''), 'colspan': span ? span : '' }
                });
            if (col.visible) {
                td.appendChild(elements[col.uid]);
                if (col.editType === 'booleanedit') {
                    td.classList.add('e-boolcell');
                } else if (col.commands || col.commandsTemplate) {
                    addClass([td], 'e-unboundcell');
                }
            } else {
                td.classList.add('e-hide');
            }
            tr.appendChild(td);
            i = span ? i + parseInt(span, 10) : i + 1;
            m++;
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
        form.appendChild(table);
        td.appendChild(form);
        return td;
    }

    public removeEventListener(): void {
        //To destroy the renderer
    }

    private appendChildren(form: Element, data: Object, isFrozen: boolean): void {
        let dummyData: Object = extend({}, data, {isAdd: !this.isEdit, isFrozen: isFrozen}, true);
        let editTemplateID: string = this.parent.element.id + 'editSettingsTemplate';
        if (this.parent.isReact && typeof (this.parent.editSettings.template) !== 'string') {
            this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID, null, null, form);
            this.parent.renderTemplates();
        } else {
            appendChildren(form, this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID));
        }
        let setRules: Function = () => {
            let cols: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < cols.length; i++) {
                if ((cols[i] as Column).validationRules) {
                    this.parent.editModule.formObj.rules[(cols[i] as Column).field] =
                    (cols[i] as Column).validationRules as {[rule: string]: Object};
                }
            }
        };
        updateBlazorTemplate(editTemplateID, 'Template', this.parent.editSettings, true, setRules);
    }
}
