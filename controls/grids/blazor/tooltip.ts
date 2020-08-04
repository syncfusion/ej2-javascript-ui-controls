import { attributes, createElement, isNullOrUndefined, getUniqueID, Browser, EventHandler, KeyboardEventArgs } from "@syncfusion/ej2-base";
import { OffsetPosition, calculatePosition } from "@syncfusion/ej2-popups";
import { SfGrid } from "./sf-grid-fn";
import { parentsUntil } from "./util";
import { Column } from "./interfaces";

export class CustomToolTip {

    public content: string;
    private toolTipElement: HTMLElement;
    private ctrlId: string;
    private prevElement: HTMLElement;
    private parent: SfGrid;

    constructor(parent: SfGrid) {
        this.parent = parent;
        this.wireEvents();
    }

    public wireEvents(): void {
        EventHandler.add(this.parent.getContent(), 'scroll', this.scrollHandler, this);
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(this.parent.element, 'mouseout', this.mouseMoveHandler, this);
        EventHandler.add(this.parent.element, 'keydown', this.onKeyPressed, this);
    }

    private unWireevents(): void {
        EventHandler.remove(this.parent.getContent(), 'scroll', this.scrollHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(this.parent.element, 'mouseout', this.mouseMoveHandler);
        EventHandler.remove(this.parent.element, 'keydown', this.onKeyPressed);
    }

    public open(target: HTMLElement): void {
        this.close();
        this.ctrlId = getUniqueID(this.parent.element.getAttribute('id'));
        if (isNullOrUndefined(this.toolTipElement)) {
            this.toolTipElement = createElement('div', {
                className: "e-tooltip-wrap e-popup e-lib e-control e-popup-open",
                styles: 'width: "auto", height: "auto", position: "absolute"',
                attrs: { role: "tooltip", 'aria-hidden': 'false', 'id': this.ctrlId + '_content' }
            });
        }
        attributes(target, { 'aria-describedby': this.ctrlId + "_content", 'data-tooltip-id': this.ctrlId + "_content" });
        this.renderToolTip();
        this.setPosition(target);
    }

    private renderToolTip(): void {
        let content: HTMLElement = createElement('div', { className: "e-tip-content" });
        content.innerHTML = this.content;
        this.toolTipElement.appendChild(content);
        let arrow: HTMLElement = createElement('div', { className: "e-arrow-tip e-tip-bottom", styles: 'top: 99.9%' });
        arrow.appendChild(createElement('div', { className: "e-arrow-tip-outer e-tip-bottom" }));
        arrow.appendChild(createElement('div', { className: "e-arrow-tip-inner e-tip-bottom", styles: 'top: -6px' }));
        this.toolTipElement.appendChild(arrow);
        document.body.appendChild(this.toolTipElement);
    }

    private setPosition(target: HTMLElement): void {
        let tooltipPostion:  {left: number; top: number;}= { top: 0, left: 0 };
        let arrow: HTMLElement = this.toolTipElement.querySelector('.e-arrow-tip');
        let popUpPosition: OffsetPosition = calculatePosition(target, 'Center', 'Top');
        tooltipPostion.top -= this.toolTipElement.offsetHeight + arrow.offsetHeight;
        tooltipPostion.left -= this.toolTipElement.offsetWidth / 2;
        this.toolTipElement.style.top = popUpPosition.top + tooltipPostion.top + 'px';
        this.toolTipElement.style.left = popUpPosition.left + tooltipPostion.left + 'px';
    }

    public close(): void {
        if (this.toolTipElement) {
            let prevTarget: HTMLElement = this.parent.element.querySelector("[aria-describedby=\"" + this.ctrlId + '_content' + "\"]");
            prevTarget.removeAttribute('aria-describedby');
            prevTarget.removeAttribute('data-tooltip-id');
            document.getElementById(this.ctrlId + '_content').remove();
            this.toolTipElement = null;
        }
    }

    private getTooltipStatus(element: HTMLElement): boolean {
        let width: number;
        let headerTable: Element = this.parent.getHeaderTable();
        let contentTable: Element = this.parent.getContentTable();
        let headerDivTag: string = 'e-gridheader';
        let contentDivTag: string = 'e-gridcontent';
        let htable: HTMLDivElement = this.createTable(headerTable, headerDivTag, 'header');
        let ctable: HTMLDivElement = this.createTable(contentTable, contentDivTag, 'content');
        let td: HTMLElement = element;
        let table: HTMLDivElement = element.classList.contains('e-headercell') ? htable : ctable;
        let ele: string = element.classList.contains('e-headercell') ? 'th' : 'tr';
        table.querySelector(ele).className = element.className;
        table.querySelector(ele).innerHTML = element.innerHTML;
        width = table.querySelector(ele).getBoundingClientRect().width;
        document.body.removeChild(htable);
        document.body.removeChild(ctable);
        if (width > element.getBoundingClientRect().width) {
            return true;
        }
        return false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.isEllipsisTooltip()) {
            let element: HTMLElement = parentsUntil((e.target as Element), 'e-ellipsistooltip') as HTMLElement;
            if (this.prevElement !== element || e.type === 'mouseout') {
                this.close();
            }
            let tagName: string = (e.target as Element).tagName;
            let elemNames: string[] = ['A', 'BUTTON', 'INPUT'];
            if (element && e.type !== 'mouseout' && !(Browser.isDevice && elemNames.indexOf(tagName) !== -1)) {
                if (element.getAttribute('aria-describedby')) {
                    return;
                }
                if (this.getTooltipStatus(element)) {
                    if (element.getElementsByClassName('e-headertext').length) {
                        this.content = (element.getElementsByClassName('e-headertext')[0] as HTMLElement).innerText;
                    } else {
                        this.content = element.innerText;
                    }
                    this.prevElement = element;
                    this.open(element);
                }
            }
        }
        this.hoverFrozenRows(e);
    }

    private hoverFrozenRows(e: MouseEvent): void {
        if (this.parent.options.frozenColumns) {
            let row: Element = parentsUntil(e.target as Element, 'e-row');
            let frozenHover: Element[] = [].slice.call(this.parent.element.querySelectorAll('.e-frozenhover'));
            if (frozenHover.length && e.type === 'mouseout') {
                for (let i: number = 0; i < frozenHover.length; i++) {
                    frozenHover[i].classList.remove('e-frozenhover');
                }
            } else if (row) {
                let rows: Element[] = [].slice.call(this.parent.element.querySelectorAll('tr[aria-rowindex="' + row.getAttribute('aria-rowindex') + '"]'));
                rows.splice(rows.indexOf(row), 1);
                if (row.getAttribute('aria-selected') != 'true') {
                    rows[0].classList.add('e-frozenhover');
                } else {
                    rows[0].classList.remove('e-frozenhover');
                }
            }
        }
    }

    private isEllipsisTooltip(): boolean {
        let cols: Column[] = this.parent.getColumns();
        if (this.parent.options.clipMode === 'EllipsisWithTooltip') {
            return true;
        }
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].clipMode === 'EllipsisWithTooltip') {
                return true;
            }
        }
        return false;
    }

    private scrollHandler(): void {
        if (this.isEllipsisTooltip()) {
            this.close();
        }
    }

    /**
     * To create table for ellipsiswithtooltip 
     * @hidden
     */
    private createTable(table: Element, tag: string, type: string): HTMLDivElement {
        let myTableDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        let mySubDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        let myTable: HTMLTableElement = createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        let ele: string = (type === 'header') ? 'th' : 'td';
        let myTr: HTMLTableRowElement = createElement('tr') as HTMLTableRowElement;
        let mytd: HTMLElement = createElement(ele) as HTMLElement;
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    }

    private onKeyPressed(e: KeyboardEventArgs): void {
        if (e.key === 'Tab' || e.key === 'ShiftTab') {
            this.close();
        }
    }

    public destroy(): void {
        this.close();
        this.unWireevents();
    }
}