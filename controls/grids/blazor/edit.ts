import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { calculateRelativeBasedPosition, OffsetPosition } from '@syncfusion/ej2-popups';
import { SfGrid } from './sf-grid-fn';
import { getScrollBarWidth } from './util';

/**
 * Editing
 */
export class Edit {

    private parent: SfGrid;
    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    public createTooltip(results: object[], isAdd: boolean): void {
        let toolTipPos: object = {};
        let arrowPosition: string;
        for (var i = 0; i < results.length ; i++ ) {
            let gcontent: HTMLElement = this.parent.getContent() as HTMLElement;
            if (this.parent.options.frozenColumns) {
                gcontent = this.parent.getContent().querySelector('.e-movablecontent') as HTMLElement;
            }
            let name: string = results[i]['fieldName']; let message: string = results[i]['message'];
            name = name.replace(/[.]/g, "___");
            let element: HTMLElement = this.parent.element.querySelector(`#${name}`) ||
                document.querySelector(`#${name}`);
            let isScroll: boolean = gcontent.scrollHeight > gcontent.clientHeight || gcontent.scrollWidth > gcontent.clientWidth;
            let isInline: boolean = this.parent.options.editMode !== 'Dialog';
            if (!element) { return; }
            let td: Element = closest(element, '.e-rowcell');
            let row: Element = closest(element, '.e-row');
            let fCont: Element = this.parent.getContent().querySelector('.e-frozencontent');
            let isFHdr: boolean;
            let isFHdrLastRow: boolean = false;
            let validationForBottomRowPos: boolean;
            let isBatchModeLastRow: boolean = false;
           let viewPortRowCount: number = Math.round(this.parent.getContent().clientHeight / this.parent.getRowHeight()) - 1;
           let rows: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
            if (this.parent.options.editMode === 'Batch') {
                if (viewPortRowCount > 1 && rows.length >= viewPortRowCount
                    && rows[rows.length - 1].getAttribute('aria-rowindex') === row.getAttribute('aria-rowindex')) {
                    isBatchModeLastRow = true;
                }
            }
            if (isInline) {
                if (this.parent.options.frozenRows) {
                 // TODO: FrozenRows
                    // let fHeraderRows: HTMLCollection = this.parent.getFrozenColumns() ?
                    //     this.parent.getFrozenVirtualHeader().querySelector('tbody').children
                    //     : this.parent.getHeaderTable().querySelector('tbody').children;
                    // isFHdr = fHeraderRows.length > (parseInt(row.getAttribute('aria-rowindex'), 10) || 0);
                    // isFHdrLastRow = isFHdr && parseInt(row.getAttribute('aria-rowindex'), 10) === fHeraderRows.length - 1;
                }
                if (isFHdrLastRow || (viewPortRowCount > 1 && rows.length >= viewPortRowCount &&
                    (this.parent.options.newRowPosition === 'Bottom' && isAdd || (!isNullOrUndefined(td) 
                    && td.classList.contains('e-lastrowcell') && !row.classList.contains('e-addedrow')))) || isBatchModeLastRow) {
                    validationForBottomRowPos = true;
                }
            }
            let table: Element = isInline ?
                (isFHdr ? this.parent.getHeaderTable() : this.parent.getContentTable()) :
                document.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content');
            let client: ClientRect = table.getBoundingClientRect();
            let left: number = isInline ?
                this.parent.element.getBoundingClientRect().left : client.left;
            let input: HTMLElement = closest(element, 'td') as HTMLElement;
            let inputClient: ClientRect = input ? input.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
            let div: HTMLElement = this.parent.element.querySelector(`#${name}_Error`) ||
                    document.querySelector(`#${name}_Error`);
            div.style.top =  
            ((isFHdr ? inputClient.top + inputClient.height : inputClient.bottom - client.top
                - (this.parent.options.frozenColumns ? fCont.scrollTop : 0)) + table.scrollTop + 9) + 'px'; 
            div.style.left =
            (inputClient.left - left + table.scrollLeft + inputClient.width / 2) + 'px';
            div.style.maxWidth =  inputClient.width + 'px';
            if (isInline && client.left < left) {
                div.style.left = parseInt(div.style.left, 10) - client.left + left + 'px';
            }
            let arrow: Element;
            if (validationForBottomRowPos) {
                arrow = div.querySelector('.e-tip-bottom');
            } else {
                arrow = div.querySelector('.e-tip-top');
            }
            if ((this.parent.options.frozenColumns || this.parent.options.frozenRows) && this.parent.options.editMode !== 'Dialog') {
                let getEditCell: HTMLElement = this.parent.options.editMode === 'Normal' ?
                    closest(element, '.e-editcell') as HTMLElement : closest(element, '.e-table') as HTMLElement;
                    getEditCell.style.position = 'relative';
                    div.style.position = 'absolute';
            }
            div.style.display = "block";
            (div.querySelector(".e-error") as HTMLElement).innerText = message;
            if (!validationForBottomRowPos && isInline && gcontent.getBoundingClientRect().bottom < inputClient.bottom + inputClient.height) {
                gcontent.scrollTop = gcontent.scrollTop + div.offsetHeight + arrow.scrollHeight;
            }
            let lineHeight: number = parseInt(
                document.defaultView.getComputedStyle(div, null).getPropertyValue('font-size'), 10
            );
            if (div.getBoundingClientRect().width < inputClient.width &&
                div.querySelector('label').getBoundingClientRect().height / (lineHeight * 1.2) >= 2) {
                div.style.width = div.style.maxWidth;
            }
            if ((this.parent.options.frozenColumns || this.parent.options.frozenRows)
                && (this.parent.options.editMode === 'Normal' || this.parent.options.editMode === 'Batch')) {
                div.style.left = input.offsetLeft + (input.offsetWidth / 2 - div.offsetWidth / 2) + 'px';
            } else {
                div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
            }
            if (isInline && !isScroll && !this.parent.options.allowPaging || this.parent.options.frozenColumns
                 || this.parent.options.frozenRows) {
                gcontent.style.position = 'static';
                let pos: OffsetPosition = calculateRelativeBasedPosition(input, div);
                div.style.top = pos.top + inputClient.height + 9 + 'px';
            }
            if (validationForBottomRowPos) {
                if (isScroll && !this.parent.options.frozenColumns && this.parent.options.height !== 'auto' && !this.parent.options.frozenRows
                    //&& !this.parent.enableVirtualization
                    ) {
                    let scrollWidth: number = gcontent.scrollWidth > gcontent.offsetWidth ? getScrollBarWidth() : 0;
                    div.style.bottom = (parseInt(this.parent.options.height) - gcontent.querySelector('table').offsetHeight
                        - scrollWidth) + inputClient.height + 9 + 'px';
                } else {
                    div.style.bottom = inputClient.height + 9 + 'px';
                }
                //TODO: NEW LINES ADDED SHOULD CHECK
                // if (rows.length < viewPortRowCount && this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                //     && this.editModule.args.requestType === 'add')) {
                //     let rowsCount: number = this.parent.frozenRows ? this.parent.frozenRows + (rows.length - 1) : rows.length - 1;
                //     let rowsHeight: number = rowsCount * this.parent.getRowHeight();
                //     let position: number = this.parent.getContent().clientHeight - rowsHeight;
                //     div.style.bottom = position + 9 + 'px';
                // }
                div.style.top = null;
            }
            div.style.display = 'none';
            arrowPosition = validationForBottomRowPos ? 'bottom' : 'top';
            toolTipPos[name] = `top: ${div.style.top}; bottom: ${div.style.bottom}; left: ${div.style.left}; 
            max-width: ${div.style.maxWidth}; width: ${div.style.width}; text-align: center; position: ${div.style.position};`;
        }
        this.parent.dotNetRef.invokeMethodAsync("ShowValidationPopup", toolTipPos, arrowPosition);
    }
        

}