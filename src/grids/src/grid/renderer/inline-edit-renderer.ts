import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { isNullOrUndefined, addClass, extend, closest } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { appendChildren } from '../base/util';

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
        let mTbody: Element;
        let tbody: Element;
        if (this.parent.frozenRows) {
            tbody = this.parent.getHeaderContent().querySelector('tbody');
        } else {
            tbody = this.parent.getContentTable().querySelector('tbody');
        }
        args.row = this.parent.createElement('tr', { className: 'e-row e-addedrow' });
        if (tbody.querySelector('.e-emptyrow')) {
            tbody.querySelector('.e-emptyrow').classList.add('e-hide');
        }
        tbody.insertBefore(args.row, tbody.firstChild);
        args.row.appendChild(this.getEditElement(elements, false, undefined, args, true));
        if (this.parent.getFrozenColumns()) {
            let mEle: Element = this.renderMovableform(args.row, args);
            if (this.parent.frozenRows) {
                mTbody = this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            } else {
                mTbody = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
            }
            mTbody.insertBefore(mEle, mTbody.firstChild);
            args.row.querySelector('.e-normaledit').setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
            mEle.setAttribute('colspan', '' + (this.parent.getVisibleColumns().length - this.parent.getVisibleFrozenColumns()));
            if (this.parent.height === 'auto') {
                this.parent.notify(events.frozenHeight, {});
            }
        }
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
        return td;
    }

    private getFreezeRow(row: Element): Element {
        if (this.parent.getFrozenColumns()) {
            let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
            let fCont: Element = this.parent.getContent().querySelector('.e-frozencontent').querySelector('tbody');
            let mCont: Element = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
            let fHdr: Element = this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody');
            let mHdr: Element = this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            if (this.parent.frozenRows && idx >= this.parent.frozenRows) {
                idx -= this.parent.frozenRows;
            }
            if (fCont.contains(row)) {
                return mCont.children[idx];
            } else if (mCont.contains(row)) {
                return fCont.children[idx];
            } else if (fHdr.contains(row)) {
                return mHdr.children[idx];
            } else if (mHdr.contains(row)) {
                return fHdr.children[idx];
            }
        }
        return row;
    }

    public update(elements: Object, args: { row?: Element, rowData?: Object }): void {
        this.isEdit = true;
        if (closest(args.row, '.e-movablecontent')) {
            args.row = this.getFreezeRow(args.row);
        }
        let tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        tdElement = this.updateFreezeEdit(args.row, tdElement);
        args.row.appendChild(this.getEditElement(elements, true, tdElement, args, true));
        args.row.classList.add('e-editedrow');
        this.refreshFreezeEdit(args.row, args);
    }

    private refreshFreezeEdit(row: Element, args: {rowData?: Object, movableForm?: HTMLFormElement }): void {
        let td: Element = row.firstChild as Element;
        let fCls: string;
        let cont: Element;
        let idx: number = parseInt(row.getAttribute('aria-rowindex'), 10);
        if (this.parent.getFrozenColumns()) {
            if (idx < this.parent.frozenRows) {
                cont = this.parent.getHeaderContent();
                fCls = '.e-frozenheader';
            } else {
                cont = this.parent.getContent();
                fCls = '.e-frozencontent';
            }
            let mTd: Element = td.cloneNode(true) as Element;
            let form: HTMLFormElement = args.movableForm  = mTd.querySelector('form');
            if (this.parent.editSettings.template) {
                form.innerHTML = '';
                this.appendChildren(form, args.rowData, false);
            }
            let fRows: Element;
            if (cont.querySelector(fCls).contains(row)) {
                fRows = this.parent.getMovableRowByIndex(idx);
                this.updateFrozenCont(fRows, td, mTd);
            } else {
                fRows = this.parent.getRowByIndex(idx);
                this.updateFrozenCont(fRows, mTd, td);
            }
            fRows.appendChild(mTd);
            fRows.classList.add('e-editedrow');
        }
    }

    private updateFrozenCont(row: Element, ele: Element, mEle: Element): void {
        row.innerHTML = '';
        if (!this.parent.editSettings.template) {
            this.renderMovable(ele, mEle);
            mEle.querySelector('colgroup').innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
        }
        ele.setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
        mEle.setAttribute('colspan', this.parent.getVisibleColumns().length - this.parent.getVisibleFrozenColumns() + '');
    }

    private renderMovable(ele: Element, mEle: Element): void {
        let frzCols: number = this.parent.getFrozenColumns();
        for (let i: number = 0; i < frzCols; i++) {
            mEle.querySelector('tr').removeChild(mEle.querySelector('tr').children[0]);
        }
        for (let i: number = frzCols, len: number = ele.querySelector('tr').childElementCount; i < len; i++) {
            ele.querySelector('tr').removeChild(ele.querySelector('tr').children[ele.querySelector('tr').childElementCount - 1]);
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
            attrs: { colspan: (gObj.getVisibleColumns().length - gObj.getVisibleFrozenColumns() + gLen + isDetail).toString() }
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
        appendChildren(form, this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate'));
    }
}

