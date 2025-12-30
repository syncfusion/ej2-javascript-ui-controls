import { Spreadsheet } from '../index';
import { addNote, editNote, deleteNote, showNote, removeNoteContainer, createNoteIndicator, NoteSaveEventArgs, updateNoteContainer, completeAction, setActionData, showHideNote, navigateNextPrevNote, showAllNotes, processSheetNotes, noteUndoRedo } from '../common/index';
import { isNullOrUndefined, EventHandler, closest, detach, getUniqueID } from '@syncfusion/ej2-base';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getCellIndexes, getSortedIndex, getRangeAddress, NoteModel, sheetsDestroyed } from '../../workbook/common/index';
import { CellModel, getCell, updateCell, getSheetName, Workbook, getRowHeight, ExtendedNoteModel } from '../../workbook/index';
import { ExtendedSheet, setCell, importModelUpdate } from '../../workbook/index';
/**
 * `Note` module
 */
export class SpreadsheetNote {
    private parent: Spreadsheet;
    /** @hidden */
    public activeNoteCell: number[] = null;
    /** @hidden */
    public isShowAllNotes: boolean = false;
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
        if (!this.parent.isDestroyed && !(this.parent as unknown as { refreshing?: boolean }).refreshing) {
            const noteIndicators: HTMLCollectionOf<Element> = this.parent.element.getElementsByClassName('e-addNoteIndicator');
            while (noteIndicators.length) {
                const cellEle: Element = closest(noteIndicators[0], '.e-cell');
                if (cellEle) {
                    EventHandler.remove(cellEle, 'mouseover', this.mouseOver);
                    EventHandler.remove(cellEle, 'mouseout', this.mouseOut);
                }
                detach(noteIndicators[0]);
            }
            this.parent.sheets.forEach((sheet: ExtendedSheet) => {
                if (sheet.notes) {
                    sheet.notes.forEach((note: ExtendedNoteModel) => this.removeNoteElement(note));
                }
            });
        }
        this.activeNoteCell = null;
        this.isShowAllNotes = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(addNote, this.addNote, this);
        this.parent.on(editNote, this.editNote, this);
        this.parent.on(deleteNote, this.deleteNote, this);
        this.parent.on(createNoteIndicator, this.createNoteIndicator, this);
        this.parent.on(showNote, this.showNote, this);
        this.parent.on(removeNoteContainer, this.removeNoteContainer, this);
        this.parent.on(updateNoteContainer, this.updateNoteContainer, this);
        this.parent.on(showHideNote, this.showHideNote, this);
        this.parent.on(importModelUpdate, this.updateNotesFromSheet, this);
        this.parent.on(navigateNextPrevNote, this.navigateNextPrevNote, this);
        this.parent.on(showAllNotes, this.showAllNotes, this);
        this.parent.on(processSheetNotes, this.processSheetNotes, this);
        this.parent.on(noteUndoRedo, this.noteUndoRedo, this);
        this.parent.on(sheetsDestroyed, this.sheetDestroyHandler, this);
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
            this.parent.off(showHideNote, this.showHideNote);
            this.parent.off(importModelUpdate, this.updateNotesFromSheet);
            this.parent.off(navigateNextPrevNote, this.navigateNextPrevNote);
            this.parent.off(showAllNotes, this.showAllNotes);
            this.parent.off(processSheetNotes, this.processSheetNotes);
            this.parent.off(noteUndoRedo, this.noteUndoRedo);
            this.parent.off(sheetsDestroyed, this.sheetDestroyHandler);
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

    public getNoteId(note: ExtendedNoteModel): string {
        return `e-note-container-${note.id}`;
    }

    public getNoteConnectorId(note: ExtendedNoteModel): string {
        return `e-note-connector-${note.id}`;
    }

    private getNoteByCellIndex(rowIndex: number, columnIndex: number): ExtendedNoteModel {
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        if (sheet && sheet.notes) {
            return sheet.notes.find((note: ExtendedNoteModel) => note.rowIdx === rowIndex && note.colIdx === columnIndex);
        }
        return undefined;
    }

    private showHideNote(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const idx: number[] = getCellIndexes(sheet.activeCell);
        const note: ExtendedNoteModel = this.getNoteByCellIndex(idx[0], idx[1]);
        if (note) {
            note.isVisible = !note.isVisible;
            updateCell(this.parent, sheet, { rowIdx: note.rowIdx, colIdx: note.colIdx, preventEvt: true,
                cell: { notes: note }});
            if (note.isVisible) {
                this.parent.notify(showNote, { rowIndex: idx[0], columnIndex: idx[1], isNoteEditable: false, isScrollWithNote: true });
            } else {
                this.removeNoteElement(note);
            }
        }
    }

    private addNote(): void {
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const cellIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        const targetElement: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (!isNullOrUndefined(targetElement) && ((targetElement.children.length === 0) || (targetElement.children.length > 0 && targetElement.children[targetElement.childElementCount - 1].className.indexOf('e-addNoteIndicator') === -1) )) {
            const note: ExtendedNoteModel = { id: getUniqueID('e_note'), rowIdx: cellIndexes[0], colIdx: cellIndexes[1], text: '', isVisible: this.isShowAllNotes };
            if (!sheet.notes) {
                sheet.notes = [];
            }
            this.activeNoteCell = [cellIndexes[0], cellIndexes[1]];
            updateCell(
                this.parent, sheet, { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true, cell: { isNoteEditable: true }});
            this.parent.setUsedRange(cellIndexes[0], cellIndexes[1], sheet);
            this.insertNoteSorted(sheet, note);
            this.createNoteIndicator({targetElement: targetElement, rowIndex: cellIndexes[0], columnIndex: cellIndexes[1] });
            this.createNoteContainer(note, targetElement, false, true, false, `${sheet.name}!${sheet.activeCell}`);
        }
    }

    private deleteNote(args? : {rowIndex: number, columnIndex: number, isDeleteFromMenu?: boolean}): void{
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const cellIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        const rowIndex : number = !isNullOrUndefined(args) && !isNullOrUndefined(args.rowIndex) ? args.rowIndex : cellIndexes[0];
        const columnIndex : number = !isNullOrUndefined(args) && !isNullOrUndefined(args.columnIndex) ? args.columnIndex : cellIndexes[1];
        const targetElement: HTMLElement = this.parent.getCell(rowIndex, columnIndex);
        if (targetElement.children.length > 0 && targetElement.children[targetElement.children.length - 1].className.indexOf('e-addNoteIndicator') > -1){
            targetElement.removeChild(targetElement.children[targetElement.children.length - 1]);
            EventHandler.remove(targetElement, 'mouseover', this.mouseOver);
            EventHandler.remove(targetElement, 'mouseout', this.mouseOut);
            const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + this.parent.getActiveSheet().activeCell;
            const note: ExtendedNoteModel = this.getNoteByCellIndex(rowIndex, columnIndex);
            if (!isNullOrUndefined(args) && args.isDeleteFromMenu) {
                this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: address } } });
            }
            if (note) {
                this.removeNoteElement(note);
            }
            this.syncNoteToSheetArray(sheet, rowIndex, columnIndex, null);
            const cell: CellModel = getCell(rowIndex, columnIndex, sheet);
            if (cell && cell.notes) {
                delete cell.notes;
                updateCell(this.parent, sheet, { rowIdx: rowIndex, colIdx: columnIndex, preventEvt: true, cell: cell });
            }
            if (this.activeNoteCell && this.activeNoteCell[0] === rowIndex && this.activeNoteCell[1] === columnIndex) {
                this.activeNoteCell = null;
            }
            if (!isNullOrUndefined(args) && args.isDeleteFromMenu) {
                const eventArgs : NoteSaveEventArgs =  { notes: note, address: address};
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'deleteNote' });
            }
        }
    }

    private editNote(): void {
        const cellIndexes: number[] = !isNullOrUndefined(this.activeNoteCell) ?
            this.activeNoteCell : getCellIndexes(this.parent.getActiveSheet().activeCell);
        const note: ExtendedNoteModel = this.getNoteByCellIndex(cellIndexes[0], cellIndexes[1]);
        if (note) {
            this.showNote({rowIndex: cellIndexes[0], columnIndex: cellIndexes[1], isNoteEditable: true });
            const noteContainerElement: HTMLTextAreaElement = document.getElementById(this.getNoteId(note)) as HTMLTextAreaElement;
            updateCell(
                this.parent, this.parent.getActiveSheet(), { rowIdx: cellIndexes[0], colIdx: cellIndexes[1], preventEvt: true,
                    cell: { isNoteEditable: true }});
            if (noteContainerElement) {
                this.getNoteFocus(noteContainerElement);
            }
        }
    }

    private createNoteIndicator(
        args: { targetElement: HTMLElement, rowIndex: number, columnIndex: number, skipEvent?: boolean, cell?: CellModel }): void {
        const triangleDirection: string = this.parent.enableRtl
            ? 'left: 0; border-right: 8px solid transparent;' : 'right: 0; border-left: 8px solid transparent;';
        const noteIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-addNoteIndicator',
            styles: `position: absolute; top: 0; width: 0; height: 0; border-top: 8px solid red; cursor: pointer; ${triangleDirection}` });
        if (args.targetElement.children.length > 0) {
            const rowHeight: number = getRowHeight(this.parent.getActiveSheet(), args.rowIndex);
            const defaultFilterButtonHeight: number = 20;
            for (let i: number = 0; i < args.targetElement.childElementCount; i++) {
                if (args.targetElement.children[i as number].className.indexOf('e-filter-btn') > -1) {
                    if (this.parent.enableRtl) {
                        noteIndicator.style.left = (rowHeight < (defaultFilterButtonHeight + 10) ?
                            (args.targetElement.children[i as number].getBoundingClientRect().width <= 0 ? defaultFilterButtonHeight :
                                args.targetElement.children[i as number].getBoundingClientRect().width) : 0 + 2) + 'px';
                    } else {
                        noteIndicator.style.right = (rowHeight < (defaultFilterButtonHeight + 10) ?
                            (args.targetElement.children[i as number].getBoundingClientRect().width <= 0 ? defaultFilterButtonHeight :
                                args.targetElement.children[i as number].getBoundingClientRect().width) : 0 + 2) + 'px';
                    }
                }
                if (args.targetElement.children[i as number].className.indexOf('e-validation-list') > -1) {
                    if (this.parent.enableRtl) {
                        noteIndicator.style.left = `${(args.targetElement.children[i as number].getBoundingClientRect().width || 20) + 2}px`;
                    } else {
                        noteIndicator.style.right = `${(args.targetElement.children[i as number].getBoundingClientRect().width || 20) + 2}px`;
                    }
                }
            }
        }
        if (!isNullOrUndefined(args.targetElement) && (args.targetElement.children.length === 0) || (args.targetElement.children.length > 0 && args.targetElement.children[args.targetElement.childElementCount - 1].className.indexOf('e-addNoteIndicator') === -1)) {
            if (args.cell && typeof args.cell.notes === 'string') {
                const note: ExtendedNoteModel = { id: getUniqueID('e_note'), rowIdx: args.rowIndex, colIdx: args.columnIndex,
                    text: args.cell.notes, isVisible: this.isShowAllNotes };
                args.cell.notes = <NoteModel>note;
                const sheet: ExtendedSheet = <ExtendedSheet>this.parent.getActiveSheet();
                updateCell(
                    this.parent, sheet, { rowIdx: args.rowIndex, colIdx: args.columnIndex, preventEvt: true, cell: { notes: note } });
                this.syncNoteToSheetArray(sheet, note.rowIdx, note.colIdx, note);
            }
            if (!args.skipEvent) {
                EventHandler.add(args.targetElement, 'mouseover', this.mouseOver, [this, args.rowIndex, args.columnIndex]);
                EventHandler.add(args.targetElement, 'mouseout', this.mouseOut, this);
            }
            args.targetElement.appendChild(noteIndicator);
        }
    }

    private mouseOver(): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const args: any[] = this as unknown as any[];
        const noteModule: SpreadsheetNote = args[0];
        const rowIndex: number = args[1];
        const columnIndex: number = args[2];
        const note: ExtendedNoteModel = noteModule.getNoteByCellIndex(rowIndex, columnIndex);
        if (!note || note.isVisible) {
            return;
        }
        const sheet: ExtendedSheet = noteModule.parent.getActiveSheet() as ExtendedSheet;
        if (sheet.notes) {
            let isOtherNoteEditState: boolean;
            sheet.notes.forEach((note: ExtendedNoteModel) => {
                if ((note.rowIdx !== rowIndex || note.colIdx !== columnIndex)) {
                    const cell: CellModel = note.rowIdx !== undefined && getCell(note.rowIdx, note.colIdx, sheet, false, true);
                    if (cell && cell.isNoteEditable) {
                        isOtherNoteEditState = true;
                    } else if (!note.isVisible) {
                        noteModule.removeNoteElement(note);
                    }
                }
            });
            if (isOtherNoteEditState) {
                return;
            }
        }
        noteModule.activeNoteCell = [rowIndex, columnIndex];
        if (!note || !noteModule.isNoteElementVisible(note)) {
            noteModule.showNote({ rowIndex: rowIndex, columnIndex: columnIndex, isNoteEditable: false });
        }
    }

    private mouseOut(e: MouseEvent): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const args: any[] = this as unknown as any[];
        const noteModule: SpreadsheetNote = args[0] ? args[0] : this.parent.spreadsheetNoteModule;
        const rowIndex: number = !isNullOrUndefined(args[1]) ? args[1] : (this.activeNoteCell ? this.activeNoteCell[0] : undefined);
        const columnIndex: number = !isNullOrUndefined(args[2]) ? args[2] : (this.activeNoteCell ? this.activeNoteCell[1] : undefined);
        const note: ExtendedNoteModel = noteModule.getNoteByCellIndex(rowIndex, columnIndex);
        if (!note || note.isVisible) {
            return;
        }
        const relatedTarget: HTMLElement = e.relatedTarget as HTMLElement;
        const noteId: string = noteModule.getNoteId(note);
        const noteContainer: HTMLTextAreaElement = noteId && document.getElementById(noteId) as HTMLTextAreaElement;
        const noteConnectorId: string = noteModule.getNoteConnectorId(note);
        const noteConnector: HTMLCanvasElement = noteConnectorId && document.getElementById(noteConnectorId) as HTMLCanvasElement;
        if (noteContainer) {
            if (!(document.activeElement.className.indexOf('e-addNoteContainer') > -1 ||
                (relatedTarget && ((relatedTarget === noteContainer) || (relatedTarget === noteConnector))))) {
                noteModule.removeNoteElement(note);
                this.activeNoteCell = null;
            }
        }
    }

    private isNoteElementVisible(note: ExtendedNoteModel): boolean {
        const noteContainer: HTMLElement = document.getElementById(this.getNoteId(note));
        return noteContainer && noteContainer.style.display !== 'none';
    }

    private containerFocusIn(e: FocusEvent): void {
        (e.target as HTMLTextAreaElement).style.zIndex = '6';
    }

    private containerFocusOut(e: FocusEvent): void {
        (e.target as HTMLTextAreaElement).style.zIndex = '5';
    }

    private createNoteContainer(
        note: ExtendedNoteModel, targetElement: HTMLElement, isShowNote: boolean, isNoteEditable: boolean, isRender?: boolean,
        address?: string): void {
        const cellRect: ClientRect = targetElement.getBoundingClientRect();
        const noteId: string = this.getNoteId(note);
        const connectorId: string = this.getNoteConnectorId(note);
        let noteContainer: HTMLTextAreaElement = document.getElementById(noteId) as HTMLTextAreaElement;
        let connectorLine: HTMLCanvasElement = document.getElementById(connectorId) as HTMLCanvasElement;
        if (noteContainer && connectorLine) {
            this.updateExistingNoteDisplay(noteContainer, connectorLine, note, cellRect, isShowNote, isNoteEditable, isRender);
        } else {
            noteContainer = this.parent.createElement('textarea', { id: noteId, className: 'e-addNoteContainer' }) as HTMLTextAreaElement;
            connectorLine = this.parent.createElement('canvas', { id: connectorId, className: 'e-connectorLine' }) as HTMLCanvasElement;
            this.createContainer(noteContainer, note, cellRect, isShowNote, isRender);
            this.createConnectorLine(connectorLine, noteContainer, cellRect);
            if (address) {
                const eventArgs: object = { notes: note, noteContainer: noteContainer, address: address };
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'addNoteOpen' });
            }
            if (isNoteEditable) {
                this.getNoteFocus(noteContainer);
            }
            EventHandler.add(noteContainer, 'focus', this.containerFocusIn, this);
            EventHandler.add(noteContainer, 'blur', this.containerFocusOut, this);
            EventHandler.add(noteContainer, 'mouseout', this.mouseOut, [this, note.rowIdx, note.colIdx]);
            EventHandler.add(connectorLine, 'mouseout', this.mouseOut, [this, note.rowIdx, note.colIdx]);
        }
        EventHandler.remove(targetElement, 'mouseout', this.mouseOut);
        EventHandler.add(targetElement, 'mouseout', this.mouseOut, [this, note.rowIdx, note.colIdx]);
    }

    private updateExistingNoteDisplay(
        noteContainer: HTMLTextAreaElement, connectorLine: HTMLCanvasElement, note: ExtendedNoteModel, cellRect: ClientRect,
        isShowNote: boolean, isNoteEditable: boolean, isRender?: boolean): void {
        this.createContainer(noteContainer, note, cellRect, isShowNote, isRender);
        this.createConnectorLine(connectorLine, noteContainer, cellRect);
        if (isShowNote && (!noteContainer.value || noteContainer.value !== note.text)) {
            noteContainer.value = note.text || '';
        }
        if (isNoteEditable) {
            this.getNoteFocus(noteContainer);
        }
    }

    private getNoteFocus(noteContainerElement: HTMLTextAreaElement): void {
        noteContainerElement.selectionStart = noteContainerElement.value.length;
        noteContainerElement.focus();
    }

    private createContainer(
        noteContainer: HTMLTextAreaElement, note: ExtendedNoteModel, cellRect: ClientRect, isShowNote: boolean, isRender?: boolean): void {
        let containerTop: number = 5;
        const selectAllCell: HTMLElement = this.parent.element.getElementsByClassName('e-select-all-cell')[0] as HTMLElement;
        const scroller: HTMLElement = this.parent.element.getElementsByClassName('e-scroller')[0] as HTMLElement;
        if (!isNullOrUndefined(selectAllCell) && !isNullOrUndefined(scroller) &&
            cellRect.top >= selectAllCell.getBoundingClientRect().bottom &&
            cellRect.bottom <= scroller.getBoundingClientRect().top) {
            const isViewableArea : boolean = this.parent.enableRtl ?
                cellRect.left <= selectAllCell.getBoundingClientRect().left &&
                cellRect.left >= scroller.getBoundingClientRect().left :
                cellRect.right >= selectAllCell.getBoundingClientRect().right &&
                cellRect.right <= scroller.getBoundingClientRect().right;
            if (isViewableArea) {
                noteContainer.style.display = 'block';
                containerTop = cellRect.top === selectAllCell.getBoundingClientRect().bottom ? 0 : containerTop;
            } else {
                noteContainer.style.display = 'none';
            }
        } else {
            noteContainer.style.display = 'none';
        }
        const elementClientRect: ClientRect = this.parent.element.getBoundingClientRect();
        const elementPosition: string = this.parent.element.style.getPropertyValue('position');
        noteContainer.style.position = 'absolute';
        noteContainer.style.top = (cellRect.top - (elementClientRect.top - (elementPosition === 'absolute' ? 0 :
            this.parent.element.offsetTop)) - containerTop) + 'px';
        let leftPos: number;
        const noteWidth: number = 120;
        const offsetLeft: number = (elementPosition === 'absolute' ? 0 : this.parent.element.offsetLeft);
        if (this.parent.enableRtl) {
            leftPos = cellRect.left - (elementClientRect.left - offsetLeft) - noteWidth - 10;
        } else {
            leftPos = cellRect.left + cellRect.width - (elementClientRect.left - offsetLeft) + 10;
        }
        noteContainer.style.left = `${leftPos}px`;
        noteContainer.style.width = noteContainer.style.width || `${noteWidth}px`;
        noteContainer.style.height = noteContainer.style.height || '120px';
        noteContainer.style.zIndex = '5';
        noteContainer.style.color = 'black';
        noteContainer.style.backgroundColor = 'lightyellow';
        if (isShowNote && !isNullOrUndefined(note) && !isNullOrUndefined(note.text)) {
            noteContainer.innerHTML = note.text;
        } else {
            noteContainer.innerHTML = this.parent.author ? this.parent.author + ':\n' : '';
        }
        const isActiveNote: boolean = isRender && document.activeElement === noteContainer;
        this.parent.element.appendChild(noteContainer);
        if (isActiveNote) {
            this.getNoteFocus(noteContainer);
        }
    }

    private createConnectorLine(connectorLine: HTMLCanvasElement, noteContainer: HTMLElement, cellRect: ClientRect): void {
        const lineWidth: number = 100;
        connectorLine.style.width = `${lineWidth}px`;
        connectorLine.style.position = 'absolute';
        connectorLine.style.zIndex = '1';
        const context: CanvasRenderingContext2D = connectorLine.getContext('2d');
        const elementClientRect: ClientRect = this.parent.element.getBoundingClientRect();
        const elementPosition: string = this.parent.element.style.getPropertyValue('position');
        const offsetLeft: number = (elementPosition === 'absolute' ? 0 : this.parent.element.offsetLeft);
        if (this.parent.enableRtl) {
            connectorLine.style.left = cellRect.left - (elementClientRect.left - offsetLeft) - lineWidth + 'px';
            connectorLine.style.transform = 'scaleX(-1)';
        } else {
            connectorLine.style.left = cellRect.left + cellRect.width - (elementClientRect.left - offsetLeft) + 'px';
        }
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

    private showNote(args: { rowIndex: number, columnIndex: number, isNoteEditable?: boolean, isScrollWithNote?: boolean,
        cellElement?: HTMLElement, isRender?: boolean }): void {
        const note: ExtendedNoteModel = this.getNoteByCellIndex(args.rowIndex, args.columnIndex);
        if (note) {
            const targetElement: HTMLElement = !isNullOrUndefined(this.parent.getCell(args.rowIndex, args.columnIndex)) ?
                this.parent.getCell(args.rowIndex, args.columnIndex) : args.cellElement;
            if (!isNullOrUndefined(targetElement)
                && (args.isScrollWithNote || (targetElement.children !== null && targetElement.children.length > 0 &&
                    targetElement.children[targetElement.children.length - 1].classList.contains('e-addNoteIndicator')))) {
                this.activeNoteCell = [args.rowIndex, args.columnIndex];
                this.createNoteContainer(note, targetElement, true, args.isNoteEditable, args.isRender);
            }
        }
    }

    private removeNoteContainer(args?: { rowIndex: number, columnIndex: number }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (args && !isNullOrUndefined(args.rowIndex) && !isNullOrUndefined(args.columnIndex)) {
            const cell: CellModel = getCell(args.rowIndex, args.columnIndex, sheet, false, true);
            const note: ExtendedNoteModel = cell.notes as ExtendedNoteModel;
            if (note) {
                this.removeNoteElement(note);
            }
        } else if (isNullOrUndefined(args)) {
            if ((sheet as ExtendedSheet).notes) {
                (sheet as ExtendedSheet).notes.forEach((note: ExtendedNoteModel) => {
                    if (!note.isVisible) {
                        this.removeNoteElement(note);
                    }
                });
            }
        }
    }

    private removeNoteElement(note: ExtendedNoteModel): void {
        const noteContainer: HTMLTextAreaElement = document.getElementById(this.getNoteId(note)) as HTMLTextAreaElement;
        const connectorLine: HTMLCanvasElement = document.getElementById(this.getNoteConnectorId(note)) as HTMLCanvasElement;
        if (noteContainer) {
            EventHandler.remove(noteContainer, 'mouseout', this.mouseOut);
            EventHandler.remove(noteContainer, 'focus', this.containerFocusIn);
            EventHandler.remove(noteContainer, 'blur', this.containerFocusOut);
            if (this.parent.element.contains(noteContainer)) {
                this.parent.element.removeChild(noteContainer);
            }
        }
        if (connectorLine) {
            EventHandler.remove(connectorLine, 'mouseout', this.mouseOut);
            if (this.parent.element.contains(connectorLine)) {
                this.parent.element.removeChild(connectorLine);
            }
        }
        const targetElement: HTMLElement = this.parent.getCell(note.rowIdx, note.colIdx);
        if (targetElement) {
            EventHandler.remove(targetElement, 'mouseout', this.mouseOut);
        }
        if (this.activeNoteCell && this.activeNoteCell[0] === note.rowIdx && this.activeNoteCell[1] === note.colIdx) {
            this.activeNoteCell = null;
        }
        const cell: CellModel = note.rowIdx !== undefined && getCell(note.rowIdx, note.colIdx, this.parent.getActiveSheet(), false, true);
        if (cell && cell.notes && cell.isNoteEditable) {
            cell.isNoteEditable = false;
        }
    }

    private updateNoteContainer(): void {
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        this.removeNoteElementsFromOtherSheets();
        if (!sheet.notes || sheet.notes.length === 0) {
            this.parent.selectionModule.isNoteActiveElement = false;
            if (this.activeNoteCell) {
                this.activeNoteCell = null;
            }
            return;
        }
        this.parent.selectionModule.isNoteActiveElement = false;
        let activeNoteFound: boolean = false;
        sheet.notes.forEach((note: ExtendedNoteModel) => {
            const noteContainer: HTMLTextAreaElement = document.getElementById(this.getNoteId(note)) as HTMLTextAreaElement;
            const hasFocus: boolean = noteContainer ? (document.activeElement === noteContainer ||
                (note.rowIdx !== undefined && getCell(note.rowIdx, note.colIdx, sheet, false, true).isNoteEditable)) : false;
            if (hasFocus) {
                activeNoteFound = true;
                this.parent.selectionModule.isNoteActiveElement = true;
                this.activeNoteCell = [note.rowIdx, note.colIdx];
                if ((isNullOrUndefined(note.text) && noteContainer.value) || note.text !== noteContainer.value) {
                    const address: string = getSheetName(this.parent as Workbook, this.parent.activeSheetIndex) + '!' + getRangeAddress([note.rowIdx, note.colIdx]);
                    this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: address } } });
                    const eventAction: string = note.text ? 'editNote' : 'addNote';
                    note.text = noteContainer.value;
                    updateCell(this.parent, sheet, { rowIdx: note.rowIdx, colIdx: note.colIdx, preventEvt: true,
                        cell: { notes: note, isNoteEditable: true } });
                    this.syncNoteToSheetArray(sheet, note.rowIdx, note.colIdx, note);
                    const eventArgs: NoteSaveEventArgs = { notes: note, address: address };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: eventAction });
                }
            }
            if (note.isVisible || hasFocus) {
                this.parent.notify(showNote, { rowIndex: note.rowIdx, columnIndex: note.colIdx, isNoteEditable: hasFocus,
                    isScrollWithNote: true });
            } else {
                this.removeNoteElement(note);
            }
        });
        if (!activeNoteFound) {
            this.activeNoteCell = null;
        }
    }

    private sheetDestroyHandler(args: { sheetIndex?: number }): void {
        const noteContainers: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-addNoteContainer'));
        noteContainers.forEach((noteContainer: Element): void => {
            EventHandler.remove(noteContainer, 'mouseout', this.mouseOut);
            EventHandler.remove(noteContainer, 'focus', this.containerFocusIn);
            EventHandler.remove(noteContainer, 'blur', this.containerFocusOut);
            noteContainer.parentElement.removeChild(noteContainer);
        });
        const connectorLines: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-connectorLine'));
        connectorLines.forEach((connectorLine: Element): void => {
            EventHandler.remove(connectorLine, 'mouseout', this.mouseOut);
            connectorLine.parentElement.removeChild(connectorLine);
        });
        if (isNullOrUndefined(args.sheetIndex)) {
            this.isShowAllNotes = false;
        }
        this.activeNoteCell = null;
    }

    private removeNoteElementsFromOtherSheets(): void {
        const activeSheetIndex: number = this.parent.activeSheetIndex;
        this.parent.sheets.forEach((sheet: ExtendedSheet, index: number) => {
            if (index === activeSheetIndex) {
                return;
            }
            if (sheet.notes) {
                sheet.notes.forEach((note: ExtendedNoteModel) => {
                    this.removeNoteElement(note);
                });
            }
        });
    }

    private insertNoteSorted(sheet: ExtendedSheet, note: ExtendedNoteModel): void {
        if (!sheet.notes) {
            sheet.notes = [];
        }
        const idx: number = getSortedIndex(sheet.notes, [note.rowIdx, note.colIdx], false);
        sheet.notes.splice(idx, 0, note);
    }

    private navigateNextPrevNote(args: { isNext: boolean }): void {
        const sheetCount: number = this.parent.sheets.length;
        const startSheetIdx: number = this.parent.activeSheetIndex;
        const activeSheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        const addr: number[] = getCellIndexes(activeSheet.activeCell);
        const currentColl: ExtendedNoteModel[] = activeSheet.notes ? activeSheet.notes : [];
        if (currentColl.length > 0) {
            const pos: number = getSortedIndex(currentColl, addr, false);
            let exactIdx: number = -1;
            if (pos < currentColl.length) {
                const note: ExtendedNoteModel = currentColl[pos as number];
                if (note.rowIdx === addr[0] && note.colIdx === addr[1]) {
                    exactIdx = pos;
                }
            }
            if (exactIdx === -1 && pos > 0) {
                const prevNote: ExtendedNoteModel = currentColl[pos - 1];
                if (prevNote.rowIdx === addr[0] && prevNote.colIdx === addr[1]) {
                    exactIdx = pos - 1;
                }
            }
            const idx: number = args.isNext ? (exactIdx > -1 ? exactIdx + 1 : pos) : (exactIdx > -1 ? exactIdx - 1 : pos - 1);
            if (idx >= 0 && idx < currentColl.length) {
                this.navigateToNote(currentColl[idx as number], startSheetIdx);
                return;
            }
        }
        for (let i: number = 1; i < sheetCount; i++) {
            const sheetIdx: number = (startSheetIdx + (args.isNext ? i : -i) + sheetCount) % sheetCount;
            const sheet: ExtendedSheet = this.parent.sheets[sheetIdx as number] as ExtendedSheet;
            if (sheet.notes && sheet.notes.length > 0) {
                const note: ExtendedNoteModel = args.isNext ? sheet.notes[0] : sheet.notes[sheet.notes.length - 1];
                this.navigateToNote(note, sheetIdx);
                return;
            }
        }
        if (currentColl.length > 0) {
            const note: ExtendedNoteModel = args.isNext ? currentColl[0] : currentColl[currentColl.length - 1];
            if (note.rowIdx !== addr[0] || note.colIdx !== addr[1]) {
                this.navigateToNote(note, startSheetIdx);
            }
        }
    }

    private navigateToNote(note: ExtendedNoteModel, sheetIndex: number): void {
        const sheetName: string = getSheetName(this.parent as Workbook, sheetIndex);
        const address: string = getRangeAddress([note.rowIdx, note.colIdx]);
        this.parent.goTo(`${sheetName}!${address}`);
        setTimeout(() => {
            this.activeNoteCell = [note.rowIdx, note.colIdx];
            this.parent.notify(editNote, null);
        });
    }

    private showAllNotes(): void {
        this.isShowAllNotes = !this.isShowAllNotes;
        this.parent.sheets.forEach((sheet: ExtendedSheet) => {
            if (sheet.notes) {
                sheet.notes.forEach((note: ExtendedNoteModel) => {
                    note.isVisible = this.isShowAllNotes;
                    updateCell(this.parent, sheet, { rowIdx: note.rowIdx, colIdx: note.colIdx, preventEvt: true,
                        cell: { notes: { ...note, isVisible: this.isShowAllNotes } }});
                });
            }
        });
        const activeSheet: ExtendedSheet = this.parent.getActiveSheet() as ExtendedSheet;
        if (activeSheet && activeSheet.notes) {
            activeSheet.notes.forEach((note: ExtendedNoteModel) => {
                if (this.isShowAllNotes) {
                    this.parent.notify(showNote, { rowIndex: note.rowIdx, columnIndex: note.colIdx, isNoteEditable: false,
                        isScrollWithNote: true });
                } else {
                    this.removeNoteElement(note);
                }
            });
        }
    }

    private updateNotesFromSheet(): void {
        let cell: CellModel;
        this.parent.sheets.forEach((sheet: ExtendedSheet) => {
            if (sheet.notes && sheet.notes.length > 0) {
                sheet.notes.forEach((note: ExtendedNoteModel) => {
                    if (note.address) {
                        note.rowIdx = note.address[0];
                        note.colIdx = note.address[1];
                        delete note.address;
                        note.id = getUniqueID('e_note');
                        cell = getCell(note.rowIdx, note.colIdx, sheet);
                        if (cell) {
                            cell.notes = note;
                        } else {
                            setCell(note.rowIdx, note.colIdx, sheet, { notes: note });
                        }
                    }
                });
            }
        });
    }

    private processSheetNotes(args: { sheet: ExtendedSheet, note?: ExtendedNoteModel, id?: string,
        isDelete: boolean, isRefresh?: boolean, sheetIdx?: number
    }): void {
        const sheet: ExtendedSheet = args.sheet;
        if (!sheet.notes) {
            sheet.notes = [];
        }
        if (args.isDelete) {
            if (args.id) {
                const noteIndex: number = sheet.notes.findIndex((n: ExtendedNoteModel) => n.id === args.id);
                if (noteIndex > -1) {
                    const noteToRemove: ExtendedNoteModel = sheet.notes[noteIndex as number];
                    this.removeNoteElement(noteToRemove);
                    sheet.notes.splice(noteIndex, 1);
                }
            }
        } else if (args.note) {
            const note: ExtendedNoteModel = args.note;
            if (!note.id) {
                note.id = getUniqueID('e_note');
            }
            if (isNullOrUndefined(note.isVisible)) {
                note.isVisible = false;
            }
            this.syncNoteToSheetArray(sheet, note.rowIdx, note.colIdx, note);
            if (args.isRefresh && !isNullOrUndefined(args.sheetIdx) && args.sheetIdx === this.parent.activeSheetIndex) {
                const targetElement: HTMLElement = this.parent.getCell(note.rowIdx, note.colIdx);
                if (targetElement) {
                    if (!targetElement.querySelector('.e-addNoteIndicator')) {
                        this.createNoteIndicator({
                            targetElement: targetElement, rowIndex: note.rowIdx,
                            columnIndex: note.colIdx, skipEvent: false
                        });
                    }
                    if (note.isVisible) {
                        this.showNote({
                            rowIndex: note.rowIdx, columnIndex: note.colIdx, isNoteEditable: false,
                            isScrollWithNote: true, cellElement: targetElement
                        });
                    }
                }
            }
        }
    }

    public syncNoteToSheetArray(sheet: ExtendedSheet, rowIdx: number, colIdx: number, note: ExtendedNoteModel | null): void {
        if (!sheet.notes) {
            sheet.notes = [];
        }
        const existingIdx: number = sheet.notes.findIndex(
            (n: ExtendedNoteModel) => n.rowIdx === rowIdx && n.colIdx === colIdx
        );
        if (note) {
            if (existingIdx > -1) {
                sheet.notes[existingIdx as number] = note;
            } else {
                this.insertNoteSorted(sheet, note);
            }
        } else {
            if (existingIdx > -1) {
                sheet.notes.splice(existingIdx, 1);
            }
        }
    }

    private detachNoteIndicator(rowIdx: number, colIdx: number): void {
        const cellElement: HTMLElement = this.parent.getCell(rowIdx, colIdx);
        if (cellElement) {
            const indicator: HTMLElement = cellElement.querySelector('.e-addNoteIndicator');
            if (indicator) {
                EventHandler.remove(indicator, 'mouseover', this.mouseOver);
                EventHandler.remove(indicator, 'mouseout', this.mouseOut);
                delete indicator.dataset.commentListenersAdded;
                delete indicator.dataset.commentRowIndex;
                delete indicator.dataset.commentColIndex;
                detach(indicator);
            }
        }
    }

    private noteUndoRedo(args: { cellIdx: number[], sheetIdx: number }): void {
        if (args && args.cellIdx && !isNullOrUndefined(args.sheetIdx)) {
            const sheet: ExtendedSheet = this.parent.sheets[args.sheetIdx] as ExtendedSheet;
            const row: number = args.cellIdx[0];
            const col: number = args.cellIdx[1];
            if (!sheet.notes) {
                sheet.notes = [];
            }
            const cell: CellModel = getCell(row, col, sheet);
            const model: ExtendedNoteModel = cell && (cell.notes as ExtendedNoteModel);
            const existing: ExtendedNoteModel = sheet.notes.find((n: ExtendedNoteModel) => n.rowIdx === row && n.colIdx === col);
            if (model) {
                if (existing) {
                    const idxInColl: number = sheet.notes.findIndex((n: ExtendedNoteModel) => n.id === existing.id);
                    if (idxInColl > -1) {
                        if (model.id !== existing.id) {
                            model.id = existing.id;
                        }
                        sheet.notes[idxInColl as number] = model;
                    }
                } else {
                    this.insertNoteSorted(sheet, model);
                }
                if (this.parent.activeSheetIndex === args.sheetIdx) {
                    const td: HTMLElement = this.parent.getCell(row, col);
                    if (td && !td.querySelector('.e-addNoteIndicator')) {
                        this.createNoteIndicator({ targetElement: td, rowIndex: row, columnIndex: col });
                    }
                    if (model.isVisible) {
                        this.parent.notify(showNote, { rowIndex: row, columnIndex: col, isNoteEditable: false, isScrollWithNote: true });
                    }
                }
            } else if (existing) {
                const i: number = sheet.notes.findIndex((n: ExtendedNoteModel) => n.id === existing.id);
                if (i > -1) {
                    sheet.notes.splice(i, 1);
                }
                if (this.parent.activeSheetIndex === args.sheetIdx) {
                    this.detachNoteIndicator(row, col);
                    const cellToUpdate: CellModel = getCell(row, col, sheet);
                    if (cellToUpdate) {
                        delete cellToUpdate.notes;
                        updateCell(this.parent, sheet, { rowIdx: row, colIdx: col, preventEvt: true, cell: cellToUpdate });
                    }
                    const noteContainer: HTMLElement = document.getElementById(this.getNoteId(existing));
                    if (noteContainer) {
                        this.removeNoteElement(existing);
                    }
                }
            }
        }
    }
}
