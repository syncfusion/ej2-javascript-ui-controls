import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { isNullOrUndefined, addClass, extend, closest } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { appendChildren, alignFrozenEditForm, getMovableTbody, getFrozenRightTbody, setStyleAndAttributes } from '../base/util';
import * as literals from '../base/string-literals';

/**
 * Edit render module is used to render grid edit row.
 *
 * @hidden
 */
export class InlineEditRender {
    //Internal variables

    //Module declarations
    private parent: IGrid;
    private isEdit: boolean;

    /**
     * Constructor for render module
     *
     * @param {IGrid} parent - returns the IGrid
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public addNew(elements: Object, args: { row?: Element, rowData?: Object, isScroll?: boolean }): void {
        this.isEdit = false;
        let tbody: Element;
        const mTbody: Element = getMovableTbody(this.parent);
        const frTbody: Element = getFrozenRightTbody(this.parent);
        const isFrozenGrid: boolean = this.parent.isFrozenGrid();
        const isVirtualFrozen: boolean = isFrozenGrid && this.parent.enableColumnVirtualization && args.isScroll;
        if (this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top') {
            tbody = isVirtualFrozen ? this.parent.getMovableHeaderTbody() : this.parent.getHeaderTable().querySelector( literals.tbody);
        } else {
            tbody = isVirtualFrozen ? this.parent.getMovableContentTbody() : this.parent.getContentTable().querySelector( literals.tbody);
        }
        args.row = this.parent.createElement('tr', { className: 'e-row e-addedrow' });
        if (tbody.querySelector('.e-emptyrow')) {
            const emptyRow: Element = tbody.querySelector('.e-emptyrow');
            emptyRow.parentNode.removeChild(emptyRow);
            if (isFrozenGrid && !isVirtualFrozen) {
                const moveTbody: Element = this.parent.getContent().querySelector('.' + literals.movableContent).querySelector( literals.tbody);
                (moveTbody.firstElementChild).parentNode.removeChild(moveTbody.firstElementChild);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    const frTbody: Element = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector( literals.tbody);
                    (frTbody.firstElementChild).parentNode.removeChild(frTbody.firstElementChild);
                }
            }
        }
        if (this.parent.editSettings.newRowPosition === 'Top') {
            tbody.insertBefore(args.row, tbody.firstChild);
        } else {
            tbody.appendChild(args.row);
        }
        args.row.appendChild(this.getEditElement(elements, false, undefined, args, true));
        this.parent.editModule.checkLastRow(args.row, args);
        if (isFrozenGrid && !isVirtualFrozen) {
            const mEle: Element = this.renderMovableform(args.row, args);
            if (this.parent.editSettings.newRowPosition === 'Top') {
                mTbody.insertBefore(mEle, mTbody.firstChild);
            } else {
                mTbody.appendChild(mEle);
            }
            args.row.querySelector('.e-normaledit').setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
            mEle.setAttribute('colspan', '' + (this.parent.getVisibleColumns().length - this.parent.getVisibleFrozenColumns()));
            if (frTbody) {
                const frEle: Element = this.renderFrozenRightForm(args.row, args);
                if (this.parent.editSettings.newRowPosition === 'Top') {
                    frTbody.insertBefore(frEle, frTbody.firstChild);
                } else {
                    frTbody.appendChild(frEle);
                }
                const colSpan: number = this.parent.getVisibleFrozenColumns() - this.parent.getFrozenRightColumnsCount();
                args.row.querySelector('.e-normaledit').setAttribute('colspan', colSpan + '');
                frEle.querySelector('.e-normaledit').setAttribute('colspan', '' + this.parent.getFrozenRightColumnsCount());
            }
            if (this.parent.height === 'auto') {
                this.parent.notify(events.frozenHeight, {});
            }
        }
    }

    private renderFrozenRightForm(ele: Element, args: { rowData?: Object, frozenRightForm?: HTMLFormElement }): Element {
        const frEle: Element = ele.cloneNode(true) as Element;
        const form: HTMLFormElement = args.frozenRightForm = frEle.querySelector('form');
        if (this.parent.editSettings.template) {
            form.innerHTML = '';
            this.appendChildren(form, args.rowData, false);
            return frEle;
        }
        this.renderRightFrozen(ele, frEle);
        frEle.querySelector(literals.colGroup).innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-frozen-right-header').querySelector(literals.colGroup).innerHTML;
        return frEle;
    }

    private renderMovableform(ele: Element, args: {rowData?: Object, movableForm?: HTMLFormElement }): Element {
        const mEle: Element = ele.cloneNode(true) as Element;
        const form: HTMLFormElement = args.movableForm = mEle.querySelector('form');
        if (this.parent.editSettings.template) {
            form.innerHTML = '';
            this.appendChildren(form, args.rowData, false);
            return mEle;
        }
        this.renderMovable(ele, mEle);
        mEle.querySelector(literals.colGroup).innerHTML = this.parent.getHeaderContent()
            .querySelector('.' + literals.movableHeader).querySelector(literals.colGroup).innerHTML;
        return mEle;
    }

    private updateFreezeEdit(row: Element, td: HTMLElement[]): HTMLElement[] {
        td = td.concat([].slice.call(this.getFreezeRow(row).querySelectorAll('td.e-rowcell')));
        if (this.parent.getFrozenMode() === literals.leftRight) {
            td = td.concat([].slice.call(this.getFreezeRightRow(row).querySelectorAll('td.e-rowcell')));
        }
        return td;
    }

    private getFreezeRightRow(row: Element): Element {
        const idx: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10);
        const fCont: Element = this.parent.getFrozenLeftContentTbody();
        const fHdr: Element = this.parent.getFrozenHeaderTbody();
        const frHdr: Element = this.parent.getFrozenRightHeaderTbody();
        const frCont: Element = this.parent.getFrozenRightContentTbody();
        if (fCont.contains(row) || fHdr.contains(row)) {
            return this.parent.getFrozenRightRowByIndex(idx);
        } else if (frCont.contains(row) || frHdr.contains(row)) {
            return this.parent.getRowByIndex(idx);
        }
        return row;
    }

    private getFreezeRow(row: Element): Element {
        if (this.parent.isFrozenGrid()) {
            const idx: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10);
            const fCont: Element = this.parent.getFrozenLeftContentTbody();
            const mCont: Element = this.parent.getMovableContentTbody();
            const fHdr: Element = this.parent.getFrozenHeaderTbody();
            const mHdr: Element = this.parent.getMovableHeaderTbody();
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
        const isCustomFormValidation: boolean = (<{ isCustomFormValidation?: boolean }>args).isCustomFormValidation;
        const isScroll: boolean = (<{ isScroll?: boolean }>args).isScroll;
        if (!isScroll && (closest(args.row, '.' + literals.movableContent) || closest(args.row, '.' + literals.movableHeader))) {
            args.row = this.getFreezeRow(args.row);
        }
        if (closest(args.row, '.e-frozen-right-content') || closest(args.row, '.e-frozen-right-header')) {
            args.row = this.getFreezeRightRow(args.row);
        }
        const isVirtualFrozen: boolean = this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization && isScroll;
        let tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        if (!isVirtualFrozen && !isCustomFormValidation) {
            tdElement = this.updateFreezeEdit(args.row, tdElement);
        }
        args.row.appendChild(this.getEditElement(elements, true, tdElement, args, true));
        args.row.classList.add(literals.editedRow);
        this.parent.editModule.checkLastRow(args.row, args);
        if (!isVirtualFrozen && !isCustomFormValidation) {
            this.refreshFreezeEdit(args.row, args);
        }
    }

    private refreshFreezeEdit(
        row: Element, args: {
            rowData?: Object, form?: HTMLFormElement, movableForm?: HTMLFormElement,
            frozenRightForm?: HTMLFormElement
        }): void {
        const td: Element = row.firstChild as Element;
        if (this.parent.getVisibleFrozenColumns() && this.parent.editSettings.template) {
            td.querySelector(literals.colGroup).innerHTML = this.parent.getHeaderContent().querySelector('.' + literals.frozenHeader).
                querySelector(literals.colGroup).innerHTML;
        }
        let fCls: string;
        let cont: Element;
        const idx: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10);
        if (this.parent.isFrozenGrid()) {
            if (idx < this.parent.frozenRows) {
                cont = this.parent.getHeaderContent();
                fCls = '.' + literals.frozenHeader;
            } else {
                cont = this.parent.getContent();
                fCls = '.' + literals.frozenContent;
            }
            const mTd: Element = td.cloneNode(true) as Element;
            const frTd: Element = td.cloneNode(true) as Element;
            const form: HTMLFormElement = args.movableForm  = mTd.querySelector('form');
            if (this.parent.editSettings.template) {
                this.refreshEditForm(form, args.rowData);
            }
            let fRows: Element;
            let frRows: Element;
            if (cont.querySelector(fCls).contains(row)) {
                fRows = this.parent.getMovableRowByIndex(idx);
                this.updateFrozenCont(fRows, td, mTd);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    args.frozenRightForm = frTd.querySelector('form');
                    this.refreshEditForm(args.frozenRightForm, args.rowData);
                    frRows = this.parent.getFrozenRightRowByIndex(idx);
                    this.updateFrozenRightCont(frRows, td, frTd);
                }
            } else {
                fRows = this.parent.getRowByIndex(idx);
                this.updateFrozenCont(fRows, mTd, td);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    args.frozenRightForm = frTd.querySelector('form');
                    this.refreshEditForm(args.frozenRightForm, args.rowData);
                    frRows = this.parent.getFrozenRightRowByIndex(idx);
                    this.updateFrozenRightCont(frRows, frTd, td);
                }
            }
            fRows.appendChild(mTd);
            fRows.classList.add(literals.editedRow);
            if (this.parent.getFrozenMode() === literals.leftRight) {
                frRows.appendChild(frTd);
                frRows.classList.add(literals.editedRow);
                alignFrozenEditForm(args.frozenRightForm.querySelector('td:not(.e-hide)'), args.form.querySelector('td:not(.e-hide)'));
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
        frEle.querySelector(literals.colGroup).innerHTML = this.parent.getHeaderContent()
            .querySelector('.e-frozen-right-header').querySelector(literals.colGroup).innerHTML;
        ele.setAttribute('colspan', this.parent.getVisibleFrozenColumns() - this.parent.getFrozenRightColumnsCount() + '');
        frEle.setAttribute('colspan', this.parent.getFrozenRightColumnsCount() + '');
    }

    private updateFrozenCont(row: Element, ele: Element, mEle: Element): void {
        row.innerHTML = '';
        this.renderMovable(ele, mEle);
        mEle.querySelector(literals.colGroup).innerHTML = this.parent.getHeaderContent()
            .querySelector('.' + literals.movableHeader).querySelector(literals.colGroup).innerHTML;
        ele.setAttribute('colspan', this.parent.getVisibleFrozenColumns() + '');
        mEle.setAttribute('colspan', this.parent.getCurrentVisibleColumns(this.parent.enableColumnVirtualization).length - this.parent.getVisibleFrozenColumns() + '');
    }

    private renderRightFrozen(ele: Element, frEle: Element): void {
        frEle.querySelector('tr').innerHTML = '';
        const cols: Column[] = this.parent.getColumns();
        let k: number = 0;
        for (let i: number = 0; i < cols.length; i++ , k++) {
            if (cols[i].getFreezeTableName() === literals.frozenRight) {
                const index: number = k - this.parent.getMovableColumnsCount();
                frEle.querySelector('tr').appendChild(ele.querySelector('tr').removeChild(ele.querySelector('tr').children[index]));
                k--;
            }
        }
    }

    private renderMovable(ele: Element, mEle: Element): void {
        mEle.querySelector('tr').innerHTML = '';
        const cols: Column[] = this.parent.getColumns();
        let k: number = 0;
        for (let i: number = 0; i < cols.length; i++, k++) {
            if (cols[i].getFreezeTableName() === 'movable') {
                mEle.querySelector('tr').appendChild(ele.querySelector('tr').removeChild(ele.querySelector('tr').children[k]));
                k--;
            }
        }
    }

    // eslint-disable-next-line max-len
    private getEditElement(elements?: Object, isEdit?: boolean, tdElement?: HTMLElement[], args?: {rowData?: Object, isScroll?: boolean, isCustomFormValidation?: boolean}, isFrozen?: boolean):
    Element {
        const gObj: IGrid = this.parent;
        let gLen: number = 0;
        const isDetail: number = !isNullOrUndefined(gObj.detailTemplate) || !isNullOrUndefined(gObj.childGrid) ? 1 : 0;
        if (gObj.allowGrouping) {
            gLen = gObj.groupSettings.columns.length;
        }
        const td: HTMLTableCellElement = this.parent.createElement('td', {
            className: 'e-editcell e-normaledit',
            attrs: {
                colspan: (gObj.getCurrentVisibleColumns(this.parent.enableColumnVirtualization).length - gObj.getVisibleFrozenColumns()
                    + this.parent.getIndentCount()).toString()
            }
        }) as HTMLTableCellElement;
        const form: HTMLFormElement = (<{form: HTMLFormElement}>args).form =
        this.parent.createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        if (this.parent.editSettings.template) {
            this.appendChildren(form, args.rowData, isFrozen);
            td.appendChild(form);
            return td;
        }
        const table: Element = this.parent.createElement('table', { className: 'e-table e-inline-edit', attrs: { cellspacing: '0.25' } });
        table.appendChild(gObj.getContentTable().querySelector(literals.colGroup).cloneNode(true));
        const tbody: Element = this.parent.createElement( literals.tbody);
        const tr: Element = this.parent.createElement('tr');
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
        const isVirtualFrozen: boolean = gObj.isFrozenGrid() && gObj.enableColumnVirtualization && args.isScroll;
        const cols: Column[] = args.isCustomFormValidation ? (<{ columnModel?: Column[] }>this.parent).columnModel : gObj.getColumns();
        while ((isEdit && m < tdElement.length && i < cols.length) || i < cols.length) {
            const span: string = isEdit ? tdElement[m].getAttribute('colspan') : null;
            const col: Column = cols[i] as Column;
            if ((isVirtualFrozen && col.getFreezeTableName() !== 'movable')
                || (args.isCustomFormValidation && (col.commands || col.commandsTemplate || !col.field))) {
                i++;
                continue;
            }
            const td: HTMLElement = this.parent.createElement(
                'td',
                {
                    className: literals.rowCell, attrs:
                        { style: 'text-align:' + (col.textAlign ? col.textAlign : ''), 'colspan': span ? span : '' }
                });
            if (col.visible) {
                td.appendChild(elements[col.uid]);
                if (this.parent.rowRenderingMode === 'Vertical') {
                    setStyleAndAttributes(td, { 'data-cell': col.headerText });
                    if (i === 0) {
                        td.classList.add('e-responsive-editcell');
                    }
                }
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
        const dummyData: Object = extend({}, data, {isAdd: !this.isEdit, isFrozen: isFrozen}, true);
        const editTemplateID: string = this.parent.element.id + 'editSettingsTemplate';
        if (this.parent.isReact && typeof (this.parent.editSettings.template) !== 'string') {
            this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID, null, null, form);
            this.parent.renderTemplates();
        } else {
            appendChildren(form, this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID));
        }
        // eslint-disable-next-line
        const setRules: Function = () => {
            const cols: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < cols.length; i++) {
                if ((cols[i] as Column).validationRules) {
                    this.parent.editModule.formObj.rules[(cols[i] as Column).field] =
                    (cols[i] as Column).validationRules as {[rule: string]: Object};
                }
            }
        };
    }
}
