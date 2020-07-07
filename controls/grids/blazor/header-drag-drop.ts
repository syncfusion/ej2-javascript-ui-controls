import { Draggable, Droppable, DropEventArgs, isNullOrUndefined, createElement, MouseEventArgs } from '@syncfusion/ej2-base';
import { BlazorDragEventArgs, remove, closest as getClosest, classList } from '@syncfusion/ej2-base';
import { SfGrid } from './sf-grid-fn';
import { parentsUntil } from './util';
import { Column } from './interfaces';
/**
 * Header drag and drop handling
 */
export class HeaderDragDrop {
    
    private parent: SfGrid;
    private column: Column;
    constructor(parent: SfGrid) {
        this.parent = parent;

        if (this.parent.options.allowGrouping || this.parent.options.allowReordering) {
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
        }
    }

    public initializeHeaderDrag(): void {
        let gObj: SfGrid = this.parent;
        if (!(this.parent.options.allowReordering || (this.parent.options.allowGrouping && this.parent.options.showDropArea))) {
            return;
        }
        let headerRows: Element[] = [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnheader'));
        for (let i: number = 0, len: number = headerRows.length; i < len; i++) {
            let drag: Draggable = new Draggable(headerRows[i] as HTMLElement, {
                dragTarget: '.e-headercell',
                distance: 5,
                helper: this.helper,
                dragStart: this.dragStart,
                drag: this.drag,
                dragStop: this.dragStop,
                abort: '.e-rhandler'
            });
        }
    }

    public initializeHeaderDrop(): void {
        let gObj: SfGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getHeaderContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }

    private dragStart: Function = (e: { target: HTMLElement, event: MouseEvent } & BlazorDragEventArgs) => {
        let gObj: SfGrid = this.parent;
        let popup: HTMLElement = (gObj.element.querySelector('.e-gridpopup') as HTMLElement);
        if (popup) {
            popup.style.display = 'none';
        }
        this.parent.reorderModule.dragStart({ target: e.target, column: this.column, event: e.event });

        this.parent.groupModule.columnDragStart({ target: e.target, column: this.column});

        e.bindEvents(e.dragElement);
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }): void => {
        let gObj: SfGrid = this.parent;
        let target: Element = e.target;
        if (target) {
            let closest: Element = getClosest(target, '.e-grid');
            let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
            if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                if (gObj.options.allowReordering) {
                    (gObj.element.querySelector('.e-reorderuparrow') as HTMLElement).style.display = 'none';
                    (gObj.element.querySelector('.e-reorderdownarrow') as HTMLElement).style.display = 'none';
                }
                if (!gObj.options.groupReordering) {
                   return;
                }
            }
            if (gObj.options.allowReordering) {
                this.parent.reorderModule.drag({ target: e.target, column: this.column, event: e.event });
            }
            if (gObj.options.allowGrouping) {
                this.parent.groupModule.columnDrag({ target: e.target });
            }
        }
    }
    private dragStop: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        let gObj: SfGrid = this.parent;
        let cancel: boolean;
        let popup: HTMLElement = (gObj.element.querySelector('.e-gridpopup') as HTMLElement);
        if (popup) {
            popup.style.display = 'none';
        }
        if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
            (!gObj.options.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
            (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
            remove(e.helper);
            cancel = true;
        }
        if (gObj.options.allowReordering) {
            this.parent.reorderModule.dragStop({ target: e.target, event: e.event, column: this.column, cancel: cancel });
        }
    }
    private drop: Function = (e: DropEventArgs) => {
        let gObj: SfGrid = this.parent;
        let uid: string = e.droppedElement.getAttribute('e-mappinguid');
        let closest: Element = getClosest(e.target, '.e-grid');
        remove(e.droppedElement);
        if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
            !(gObj.options.allowReordering || gObj.options.allowGrouping)) {
            return;
        }
        if (gObj.options.allowReordering) {
            this.parent.reorderModule.headerDrop({ target: e.target });
        }
        if (gObj.options.allowGrouping) {
            this.parent.groupModule.columnDrop({
                target: e.target, droppedElement: e.droppedElement
            });
        }
        //gObj.notify(events.headerDrop, { target: e.target, uid: uid, droppedElement: e.droppedElement });

    }

    private helper: Function = (e: { sender: MouseEvent }) => {
        let gObj: SfGrid = this.parent;
        let target: Element = (e.sender.target as Element);
        let parentEle: HTMLElement = parentsUntil(target, 'e-headercell') as HTMLElement;
        if (!(gObj.options.allowReordering || gObj.options.allowGrouping) || (!isNullOrUndefined(parentEle)
            && parentEle.querySelectorAll('.e-checkselectall').length > 0)) {
            return false;
        }
        let visualElement: HTMLElement = createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
        let element: HTMLElement = target.classList.contains('e-headercell') ? target as HTMLElement : parentEle;
        if (!element || (!gObj.options.allowReordering && element.classList.contains('e-stackedheadercell'))) {
            return false;
        }
        let height: number = element.offsetHeight;
        let headercelldiv: Element = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
        let col: Column;
        if (headercelldiv) {
            if (element.querySelector('.e-stackedheadercelldiv')) {
                col = gObj.getStackedHeaderColumnByHeaderText(
                    (headercelldiv as HTMLElement).innerText.trim(), <Column[]>gObj.options.columns);
            } else {
                col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
            }
            this.column = col;
            if (this.column.lockColumn) {
                return false;
            }
            visualElement.setAttribute('e-mappinguid', headercelldiv.getAttribute("e-mappinguid"));
        }
        // if (col && !isNullOrUndefined(col.headerTemplate)) {
        //     if (!isNullOrUndefined(col.headerTemplate)) {
        //         let result: Element[];
        //         let colIndex: number = gObj.getColumnIndexByField(col.field);
        //         result = col.getHeaderTemplate()(extend({ 'index': colIndex }, col), gObj, 'headerTemplate');
        //         appendChildren(visualElement, result);
        //     } else {
        //         visualElement.innerHTML = col.headerTemplate;
        //     }
        // } else {
        visualElement.innerHTML = headercelldiv ? col.headerText : element.firstElementChild.innerHTML;
        //}
        visualElement.style.width = element.offsetWidth + 'px';
        visualElement.style.height = element.offsetHeight + 'px';
        visualElement.style.lineHeight = (height - 6).toString() + 'px';
        gObj.element.appendChild(visualElement);
        return visualElement;
    }
}