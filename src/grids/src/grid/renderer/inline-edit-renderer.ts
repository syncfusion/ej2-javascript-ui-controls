import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { isNullOrUndefined, addClass, extend } from '@syncfusion/ej2-base';
import { appendChildren, setStyleAndAttributes, addFixedColumnBorder, addStickyColumnPosition, resetColandRowSpanStickyPosition } from '../base/util';
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
        if ((this.parent.frozenRows || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) &&
            this.parent.editSettings.showAddNewRow)) && this.parent.editSettings.newRowPosition === 'Top') {
            tbody = this.parent.getHeaderTable().querySelector( literals.tbody);
        } else {
            tbody = this.parent.getContentTable().querySelector( literals.tbody);
        }
        args.row = this.parent.createElement('tr', { className: 'e-row e-addedrow' });
        if (this.parent.getContentTable().querySelector('.e-emptyrow') && !this.parent.editSettings.showAddNewRow) {
            const emptyRow: Element = this.parent.getContentTable().querySelector('.e-emptyrow');
            emptyRow.parentNode.removeChild(emptyRow);
            if (this.parent.frozenRows && this.parent.element.querySelector('.e-frozenrow-empty')) {
                this.parent.element.querySelector('.e-frozenrow-empty').classList.remove('e-frozenrow-empty');
            }
        }
        if (this.parent.editSettings.newRowPosition === 'Top') {
            tbody.insertBefore(args.row, tbody.firstChild);
        } else {
            tbody.appendChild(args.row);
        }
        args.row.appendChild(this.getEditElement(elements, false, undefined, args, true));
        this.parent.editModule.checkLastRow(args.row, args);
    }

    public update(elements: Object, args: { row?: Element, rowData?: Object }): void {
        this.isEdit = true;
        const tdElement: HTMLElement[] = [].slice.call(args.row.querySelectorAll('td.e-rowcell'));
        args.row.innerHTML = '';
        args.row.appendChild(this.getEditElement(elements, true, tdElement, args, true));
        args.row.classList.add(literals.editedRow);
        this.parent.editModule.checkLastRow(args.row, args);
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
                colspan: (gObj.getCurrentVisibleColumns(this.parent.enableColumnVirtualization).length +
                this.parent.getIndentCount()).toString()
            }
        }) as HTMLTableCellElement;
        const form: HTMLFormElement = (<{form: HTMLFormElement}>args).form =
        this.parent.createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        if (this.parent.editSettings.template) {
            this.appendChildren(form, args.rowData, isFrozen);
            td.appendChild(form);
            return td;
        }
        const table: Element = this.parent.createElement('table', { className: 'e-table e-inline-edit', attrs: { cellspacing: '0.25', role: 'grid' } });
        table.appendChild(gObj.getContentTable().querySelector(literals.colGroup).cloneNode(true));
        const tbody: Element = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
        const tr: Element = this.parent.createElement('tr');
        if (this.parent.rowHeight) {
            (tr as HTMLElement).style.height = this.parent.rowHeight + 'px';
        }
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
        let inputValue: string;
        let isFirstVisibleCell: boolean = true;
        const cols: Column[] = args.isCustomFormValidation ? (<{ columnModel?: Column[] }>this.parent).columnModel : gObj.getColumns();
        while ((isEdit && m < tdElement.length && i < cols.length) || i < cols.length) {
            const span: string = isEdit && tdElement[parseInt(m.toString(), 10)] ?
                tdElement[parseInt(m.toString(), 10)].getAttribute('colspan') : null;
            const col: Column = cols[parseInt(i.toString(), 10)] as Column;
            inputValue = (elements[col.uid]).value;
            inputValue = !isNullOrUndefined(inputValue) ? inputValue : '';
            const td: HTMLElement = this.parent.createElement(
                'td', { className: literals.rowCell, attrs: { 'colspan': span ? span : '' }});
            td.style.cssText = col.textAlign ? `text-align: ${col.textAlign};` : '';
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
                if (!this.parent.enableRtl && (gObj.gridLines === 'Vertical' || gObj.gridLines === 'Both') &&
                    gLen && isFirstVisibleCell) {
                    td.classList.add('e-grid-group-first-cell');
                    isFirstVisibleCell = false;
                }
            } else {
                td.classList.add('e-hide');
            }
            if (this.parent.isFrozenGrid()) {
                addStickyColumnPosition(this.parent, col, td);
                if (this.parent.isSpan) {
                    const colSpan: number = td.getAttribute('colspan') ? parseInt(td.getAttribute('colspan'), 10) : 1;
                    resetColandRowSpanStickyPosition(this.parent, col, td, colSpan);
                }
                if (this.parent.enableColumnVirtualization) {
                    if (col.freeze === 'Left' && !isNullOrUndefined((<{ valueX?: number }>col).valueX)) {
                        td.style.left = ((<{ valueX?: number }>col).valueX - this.parent.translateX) + 'px';
                    } else if (col.freeze === 'Right' && !isNullOrUndefined((<{ valueX?: number }>col).valueX)) {
                        td.style.right = ((<{ valueX?: number }>col).valueX + this.parent.translateX) + 'px';
                    } else if (col.freeze === 'Fixed') {
                        td.style.left = (this.parent.leftrightColumnWidth('left') - this.parent.translateX) + 'px';
                        td.style.right = (this.parent.leftrightColumnWidth('right') + this.parent.translateX) + 'px';
                    }
                }
            }
            td.setAttribute('aria-label', inputValue + this.parent.localeObj.getConstant('ColumnHeader') + col.headerText);
            tr.appendChild(td);
            i = span ? i + parseInt(span, 10) : i + 1;
            m++;
        }
        addFixedColumnBorder(tr);
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
        if (this.parent.isReact && typeof (this.parent.editSettings.template) !== 'string' &&
            !((this.parent.editSettings.template as Function).prototype &&
            (this.parent.editSettings.template as Function).prototype.CSPTemplate)) {
            this.parent.getEditTemplate()(dummyData, this.parent, 'editSettingsTemplate', editTemplateID, null, null, form);
            this.parent.renderTemplates();
        } else {
            appendChildren(form, this.parent.getEditTemplate()(
                dummyData, this.parent, 'editSettingsTemplate', editTemplateID, null, null, null, this.parent.root));
        }
        // eslint-disable-next-line
        const setRules: Function = () => {
            const cols: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < cols.length; i++) {
                if ((cols[parseInt(i.toString(), 10)] as Column).validationRules) {
                    this.parent.editModule.formObj.rules[(cols[parseInt(i.toString(), 10)] as Column).field] =
                    (cols[parseInt(i.toString(), 10)] as Column).validationRules as {[rule: string]: Object};
                }
            }
        };
    }
}
