import { Spreadsheet } from '../index';
import { addNote, editNote, deleteNote, showNote, removeNoteContainer, createNoteIndicator, NoteSaveEventArgs, updateNoteContainer, completeAction, setActionData } from '../common/index';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getCellIndexes, getRangeAddress } from '../../workbook/common/address';
import { CellModel, getCell, updateCell, getSheetName, Workbook, getRowHeight} from '../../workbook/index';
/**
 * `Note` module
 */
export class SpreadsheetNote {
    private parent: Spreadsheet;
    /** @hidden */
    public isNoteVisible: boolean = false;
    /** @hidden */
    public isShowNote: boolean;
    /** @hidden */
    public isNoteVisibleOnTouch: boolean = false;
    /** @hidden */
    public noteCellIndexes: number[];
    /**
     * Constructor for Note module.
     *
     * @param {Spreadsheet} parent - Constructor for Note module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Note module.
     *
     * @returns {void} - To destroy the Note module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
        this.isNoteVisible = null;
    }

    private addEventListener(): void {
        this.parent.on(addNote, this.addNote, this);
        this.parent.on(editNote, this.editNote, this);
        this.parent.on(deleteNote, this.deleteNote, this);
        this.parent.on(createNoteIndicator, this.createNoteIndicator, this);
        this.parent.on(showNote, this.showNote, this);
        this.parent.on(removeNoteContainer, this.removeNoteContainer, this);
        this.parent.on(updateNoteContainer, this.updateNoteContainer, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(addNote, this.addNote);
            this.parent.off(editNote, this.editNote);
            this.parent.off(showNote, this.showNote);
            this.parent.off(deleteNote, this.deleteNote);
            this.parent.off(createNoteIndicator, this.createNoteIndicator);
            this.parent.off(removeNoteContainer, this.removeNoteContainer);
            this.parent.off(updateNoteContainer, this.updateNoteContainer);
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'spreadsheetNote';
    }

    private addNote(): void {
        const cellIndexes: number[] = !isNullOrUndefined(this.noteCellIndexes) ?
            this.noteCellIndexes : getCellIndexes(this.parent.getActiveSheet().activeCell);
        const targetElement: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (!isNullOrUndefined(targetElement) && ((targetElement.children.length === 0) || (targetElement.children.length > 0 && targetElement.children[targetElement.childElementCount - 1].className.indexOf('e-addNoteIndicator') === -1) )) {
            this.createNoteIndicator({targetElement: targetElement, rowIndex: cellIndexes[0], columnIndex: cellIndexes[1] });
            this.createNoteContainer(targetElement, cellIndexes[0], cellIndexes[1], false, true);
        }
    }

    private deleteNote(args? : {rowIndex: number, columnIndex: number, isDeleteFromMenu?: boolean}): void{
        const cellIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        const rowIndex : number = !isNullOrUndefined(args) && !isNullOrUndefined(args.rowIndex) ? args.rowIndex : cellIndexes[0];
        const columnIndex : number = !isNullOrUndefined(args) && !isNullOrUndefined(args.columnIndex) ? args.columnIndex : cellIndexes[1];
        const targetElement: HTMLElement = this.parent.getCell(rowIndex, columnIndex);
        if (targetElement.children.length > 0 && targetElement.children[targetElement.children.length - 1].className.indexOf('e-addNoteIndicator') > -1){
            targetElement.removeChild(targetElement.children[targetElement.children.length - 1]);
            EventHandler.remove(targetElement, 'mouseover', this.mouseOver);
            EventHandler.remove(targetElement, 'mouseout', this.mouseOut);
            const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + this.parent.getActiveSheet().activeCell;
            const cell: CellModel = getCell(rowIndex, columnIndex, this.parent.getActiveSheet());
            if (!isNullOrUndefined(args) && args.isDeleteFromMenu) {
                this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: address } } });
            }
            if (!isNullOrUndefined(cell) && cell.notes) {
                delete cell.notes;
            }
            if (!isNullOrUndefined(args) && args.isDeleteFromMenu) {
                const eventArgs : NoteSaveEventArgs =  { notes: cell.notes, address: address};
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteNote' });
                this.isShowNote = null;
            }
        }
    }

    private editNote(): void {
        const cellIndexes: number[] = !isNullOrUndefined(this.noteCellIndexes) ?
            this.noteCellIndexes : getCellIndexes(this.parent.getActiveSheet().activeCell);
        this.showNote({rowIndex: cellIndexes[0], columnIndex: cellIndexes[1], isNoteEditable: true});
        const noteContainerElement: HTMLTextAreaElement = document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement;
        updateCell(
            this.parent, this.parent.getActiveSheet(), { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true,
                cell: { isNoteEditable: true }});
        if (noteContainerElement) {
            this.getNoteFocus(noteContainerElement);
        }
    }

    private createNoteIndicator(args : { targetElement: HTMLElement, rowIndex: number, columnIndex: number}): void {
        const noteIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-addNoteIndicator', styles: 'position: absolute;top: 0;right: 0;width: 0;height: 0;border-left: 8px solid transparent;border-top: 8px solid red;cursor: pointer;' });
        if (args.targetElement.children.length > 0) {
            const rowHeight: number = getRowHeight(this.parent.getActiveSheet(), args.rowIndex);
            const defaultFilterButtonHeight: number = 20;
            for (let i: number = 0; i < args.targetElement.childElementCount; i++) {
                if (args.targetElement.children[i as number].className.indexOf('e-filter-btn') > -1) {
                    noteIndicator.style.right = (rowHeight < (defaultFilterButtonHeight + 10) ?
                        (args.targetElement.children[i as number].getBoundingClientRect().width <= 0 ? defaultFilterButtonHeight :
                            args.targetElement.children[i as number].getBoundingClientRect().width) : 0 + 2) + 'px';
                }
                if (args.targetElement.children[i as number].className.indexOf('e-validation-list') > -1) {
                    noteIndicator.style.right = (args.targetElement.children[i as number].getBoundingClientRect().width + 2) + 'px';
                }
            }
        }
        if (!isNullOrUndefined(args.targetElement) && (args.targetElement.children.length === 0) || (args.targetElement.children.length > 0 && args.targetElement.children[args.targetElement.childElementCount - 1].className.indexOf('e-addNoteIndicator') === -1)) {
            EventHandler.add(args.targetElement, 'mouseover', this.mouseOver.bind(this, args.rowIndex, args.columnIndex));
            EventHandler.add(args.targetElement, 'mouseout', this.mouseOut, this);
            args.targetElement.appendChild(noteIndicator);
        }
    }

    private mouseOver(rowIndex: number, columnIndex: number): void {
        if ((this.isNoteVisibleOnTouch && !isNullOrUndefined(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement)) || isNullOrUndefined(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement)) {
            if (!isNullOrUndefined(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement)) {
                this.removeNoteContainer();
            }
            this.showNote({rowIndex: rowIndex, columnIndex: columnIndex, isNoteEditable: false});
            this.isNoteVisible = true;
        }
    }

    private mouseOut(e: MouseEvent): void {
        if (this.isNoteVisible && (!this.isNoteVisibleOnTouch && !isNullOrUndefined(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement))) {
            if (document.activeElement.className.indexOf('e-addNoteContainer') === -1 && !isNullOrUndefined(e.relatedTarget as HTMLElement) && (e.relatedTarget as HTMLElement).className.indexOf('e-connectorLine') === -1 && (e.relatedTarget as HTMLElement).className.indexOf('e-addNoteContainer') === -1) {
                this.removeNoteContainer();
                this.isNoteVisible = false;
            }
        }
    }

    private createNoteContainer(targetElement: HTMLElement, rowIndex: number, columnIndex: number,
                                isShowNote: boolean, isNoteEditable: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cell: CellModel = getCell(rowIndex, columnIndex, sheet);
        const cellRect: ClientRect = targetElement.getBoundingClientRect();
        const noteContainer: HTMLTextAreaElement = this.parent.createElement('textarea', { className: 'e-addNoteContainer' });
        this.createContainer(noteContainer, cell, cellRect, isShowNote);
        this.createConnectorLine(noteContainer, cellRect);
        if (isNoteEditable) {
            this.getNoteFocus(noteContainer);
        }
        EventHandler.add(noteContainer, 'mouseout', this.mouseOut, this);
        EventHandler.add((document.getElementsByClassName('e-connectorLine')[0] as HTMLElement), 'mouseout', this.mouseOut, this);
    }

    private getNoteFocus(noteContainerElement: HTMLTextAreaElement): void {
        noteContainerElement.selectionStart = noteContainerElement.value.length;
        noteContainerElement.focus();
    }

    private createContainer(noteContainer: HTMLElement, cell: CellModel, cellRect: ClientRect, isShowNote: boolean): void {
        let containerTop: number = 5;
        if (cellRect.top >= document.getElementsByClassName('e-select-all-cell')[0].getBoundingClientRect().bottom && cellRect.right >= document.getElementsByClassName('e-select-all-cell')[0].getBoundingClientRect().right &&
            cellRect.bottom <= document.getElementsByClassName('e-scroller')[0].getBoundingClientRect().top && cellRect.right <= document.getElementsByClassName('e-scroller')[0].getBoundingClientRect().width) {
            noteContainer.style.display = 'block';
            containerTop = cellRect.top === document.getElementsByClassName('e-select-all-cell')[0].getBoundingClientRect().bottom ? 0 : containerTop;
        }
        else {
            noteContainer.style.display = 'none';
        }
        const elementClientRect: ClientRect = this.parent.element.getBoundingClientRect();
        const elementPosition: string = this.parent.element.style.getPropertyValue('position');
        noteContainer.style.position = 'absolute';
        noteContainer.style.top = (cellRect.top - (elementClientRect.top - (elementPosition === 'absolute' ? 0 :
            this.parent.element.offsetTop)) - containerTop) + 'px';
        noteContainer.style.left = (cellRect.left + cellRect.width - (elementClientRect.left - (elementPosition === 'absolute' ?
            0 : this.parent.element.offsetLeft)) + 10) + 'px';
        noteContainer.style.width = '120px';
        noteContainer.style.height = '120px';
        noteContainer.style.zIndex = '5';
        noteContainer.style.color = 'black';
        noteContainer.style.backgroundColor = 'lightyellow';
        if (isShowNote && !isNullOrUndefined(cell) && !isNullOrUndefined(cell.notes)) {
            noteContainer.innerHTML = cell.notes;
        } else {
            noteContainer.innerHTML = '';
        }
        this.parent.element.appendChild(noteContainer);
    }

    private createConnectorLine(noteContainer: HTMLElement, cellRect: ClientRect): void {
        const connectorLine: HTMLCanvasElement = this.parent.createElement('canvas', { className: 'e-connectorLine', styles: 'width: 100px; position: absolute;  z-index: 1;' });
        const context: CanvasRenderingContext2D = connectorLine.getContext('2d');
        const elementClientRect: ClientRect = this.parent.element.getBoundingClientRect();
        const elementPosition: string = this.parent.element.style.getPropertyValue('position');
        connectorLine.style.left = cellRect.left + cellRect.width - (elementClientRect.left - (elementPosition === 'absolute' ?
            0 : this.parent.element.offsetLeft)) + 'px';
        connectorLine.style.top = (noteContainer.getBoundingClientRect().top - (elementClientRect.top - (elementPosition === 'absolute' ?
            0 : this.parent.element.offsetTop)) - 5) + 'px';
        context.clearRect(0, 0, connectorLine.width, connectorLine.height);
        context.beginPath();
        if (noteContainer.getBoundingClientRect().top === cellRect.top) {
            context.moveTo(0, 16);
            context.lineTo( 30, 15);
        } else {
            context.moveTo(0, 30);
            context.lineTo( 30, 15);
        }
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        context.stroke();
        this.parent.element.appendChild(connectorLine);
        if (noteContainer.getBoundingClientRect().top > 0) {
            connectorLine.style.display = 'block';
            connectorLine.style.zIndex = '4';
        } else {
            connectorLine.style.display = 'none';
        }
    }

    private showNote(args: { rowIndex: number, columnIndex: number, isNoteEditable?: boolean,
        isScrollWithNote?: boolean, cellElement?: HTMLElement }): void {
        const targetElement: HTMLElement = !isNullOrUndefined(this.parent.getCell(args.rowIndex, args.columnIndex)) ?
            this.parent.getCell(args.rowIndex, args.columnIndex) : args.cellElement;
        const contextMenuElement: HTMLElement = document.getElementById(this.parent.element.id + '_contextmenu');
        const contextMenuDisplayStyle: string = !isNullOrUndefined(contextMenuElement) ? contextMenuElement.style.getPropertyValue('display') : 'none';
        const showNoteOverContextMenu: boolean = args.isNoteEditable ? true : contextMenuDisplayStyle !== 'block';
        if (!isNullOrUndefined(targetElement) && isNullOrUndefined(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement) && showNoteOverContextMenu
            && (args.isScrollWithNote || (targetElement.children !== null && targetElement.children.length > 0 && targetElement.children[targetElement.children.length - 1].classList.contains('e-addNoteIndicator')))) {
            this.createNoteContainer(targetElement, args.rowIndex, args.columnIndex, true, args.isNoteEditable);
            this.noteCellIndexes = [args.rowIndex, args.columnIndex];
        }
    }

    private removeNoteContainer(): void {
        EventHandler.remove(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement, 'mouseout', this.mouseOut);
        EventHandler.remove((document.getElementsByClassName('e-connectorLine')[0] as HTMLElement), 'mouseout', this.mouseOut);
        this.parent.element.removeChild(document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement);
        this.parent.element.removeChild(document.getElementsByClassName('e-connectorLine')[0] as HTMLElement);
        this.noteCellIndexes = null;
        this.isNoteVisible = false;
        this.isNoteVisibleOnTouch = false;
    }

    private updateNoteContainer(): void {
        this.parent.selectionModule.isNoteContainerIsActiveElement = document.activeElement.className.indexOf('e-addNoteContainer') > -1 ? true : this.parent.selectionModule.isNoteContainerIsActiveElement;
        const cellIdxs: number[] = !isNullOrUndefined(this.noteCellIndexes) ?
            this.noteCellIndexes : getCellIndexes(this.parent.getActiveSheet().activeCell);
        const cell: CellModel = getCell(cellIdxs[0], cellIdxs[1], this.parent.getActiveSheet());
        const noteContainer: HTMLTextAreaElement  = document.getElementsByClassName('e-addNoteContainer')[0] as HTMLTextAreaElement;
        if (((isNullOrUndefined(cell) || isNullOrUndefined(cell.notes)) || (cell.notes !== noteContainer.value))
        && this.parent.selectionModule.isNoteContainerIsActiveElement) {
            const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + getRangeAddress(cellIdxs);
            this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: address } } });
            const eventAction: string = !isNullOrUndefined(cell) && cell.notes ? 'editNote' : 'addNote';
            updateCell(
                this.parent, this.parent.getActiveSheet(), { rowIdx: cellIdxs[0], colIdx: cellIdxs[1], preventEvt: true,
                    cell: { notes: noteContainer.value, isNoteEditable: true }});
            const eventArgs : NoteSaveEventArgs =  { notes: noteContainer.value, address: address};
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: eventAction });
            this.isShowNote = null;
        }
        this.isShowNote = isNullOrUndefined(this.isShowNote) ? this.parent.selectionModule.isNoteContainerIsActiveElement : this.isShowNote;
        if (this.isShowNote) {
            const isScrollWithNote : boolean = !isNullOrUndefined(cell) && !isNullOrUndefined(cell.isNoteEditable) ?
                cell.isNoteEditable : false;
            this.parent.notify(removeNoteContainer, '');
            this.parent.notify(showNote,
                               {rowIndex: cellIdxs[0], columnIndex: cellIdxs[1], isNoteEditable: true, isScrollWithNote: isScrollWithNote});
        } else {
            this.parent.notify(removeNoteContainer, '');
            this.isShowNote = null;
        }
    }
}
