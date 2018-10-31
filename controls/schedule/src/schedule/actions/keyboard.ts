import { KeyboardEvents, KeyboardEventArgs, closest, EventHandler, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, addClass } from '@syncfusion/ej2-base';
import { View } from '../base/type';
import { Schedule } from '../base/schedule';
import * as event from '../base/constant';
import { CellClickEventArgs, KeyEventArgs } from '../base/interface';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * Keyboard interaction
 */
export class KeyboardInteraction {
    /**
     * Constructor
     */
    private parent: Schedule;
    private initialTarget: HTMLTableCellElement;
    private selectedCells: HTMLTableCellElement[] = [];
    private keyConfigs: { [key: string]: string } = {
        downArrow: 'downarrow',
        upArrow: 'uparrow',
        rightArrow: 'rightarrow',
        leftArrow: 'leftarrow',
        shiftDownArrow: 'shift+downarrow',
        shiftUpArrow: 'shift+uparrow',
        shiftRightArrow: 'shift+rightarrow',
        shiftLeftArrow: 'shift+leftarrow',
        ctrlLeftArrow: 'ctrl+leftarrow',
        ctrlRightArrow: 'ctrl+rightarrow',
        altOne: 'alt+1',
        altTwo: 'alt+2',
        altThree: 'alt+3',
        altFour: 'alt+4',
        altFive: 'alt+5',
        altSix: 'alt+6',
        enter: 'enter',
        escape: 'escape',
        delete: 'delete',
        home: 'home',
        pageUp: 'pageup',
        pageDown: 'pagedown',
        tab: 'tab',
        shiftTab: 'shift+tab'
    };
    private keyboardModule: KeyboardEvents;
    constructor(parent: Schedule) {
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        this.addEventListener();
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'downArrow':
            case 'shiftDownArrow':
                this.processDown(e, e.shiftKey);
                break;
            case 'upArrow':
            case 'shiftUpArrow':
                this.processUp(e, e.shiftKey);
                break;
            case 'leftArrow':
            case 'shiftLeftArrow':
                this.processLeft(e, e.shiftKey);
                break;
            case 'rightArrow':
            case 'shiftRightArrow':
                this.processRight(e, e.shiftKey);
                break;
            case 'ctrlLeftArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                if (this.parent.headerModule) {
                    (this.parent.headerModule.element.querySelector('.e-prev button') as HTMLElement).focus();
                }
                break;
            case 'ctrlRightArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                if (this.parent.headerModule) {
                    (this.parent.headerModule.element.querySelector('.e-next button') as HTMLElement).focus();
                }
                break;
            case 'altOne':
            case 'altTwo':
            case 'altThree':
            case 'altFour':
            case 'altFive':
            case 'altSix':
                this.processViewNavigation(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'home':
                this.focusFirstCell();
                break;
            case 'tab':
            case 'shiftTab':
                this.processTab(e, e.shiftKey);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'escape':
                this.processEscape();
        }
    }
    private addEventListener(): void {
        this.parent.on(event.cellMouseDown, this.onCellMouseDown, this);
    }
    private removeEventListener(): void {
        this.parent.off(event.cellMouseDown, this.onCellMouseDown);
    }
    private onCellMouseDown(e: { event: Event & MouseEvent }): void {
        if (e.event.shiftKey) { return; }
        this.initialTarget = this.getClosestCell(e.event);
        if (this.parent.activeViewOptions.readonly || this.parent.currentView === 'MonthAgenda' || !this.initialTarget) { return; }
        if ((e.event.target as HTMLElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            EventHandler.add(this.parent.getContentTable(), 'mousemove', this.onMouseSelection, this);
            EventHandler.add(this.parent.getContentTable(), 'mouseup', this.onMoveup, this);
        }
        if ((e.event.target as HTMLElement).classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            EventHandler.add(allDayRow, 'mousemove', this.onMouseSelection, this);
            EventHandler.add(allDayRow, 'mouseup', this.onMoveup, this);
        }
    }
    public onMouseSelection(e: Event): void {
        let target: HTMLTableCellElement = this.getClosestCell(e);
        if (target) {
            this.selectCells(true, target);
        }
    }
    private getClosestCell(e: Event): HTMLTableCellElement {
        return closest(<Element>e.target, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS) as HTMLTableCellElement;
    }
    public onAppointmentSelection(e: Event): void {
        let target: Element = closest(<Element>e.target, '.' + cls.APPOINTMENT_CLASS) as Element;
        this.parent.eventBase.getSelectedEventElements(target);
    }
    private onMoveup(e: Event): void {
        if ((e.target as HTMLElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            EventHandler.remove(this.parent.getContentTable(), 'mousemove', this.onMouseSelection);
            EventHandler.remove(this.parent.getContentTable(), 'mouseup', this.onMoveup);
        }
        if ((e.target as HTMLElement).classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            EventHandler.remove(allDayRow, 'mousemove', this.onMouseSelection);
            EventHandler.remove(allDayRow, 'mouseup', this.onMoveup);
        }
    }
    private processEnter(e: Event): void {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        if (closest(target, '.' + cls.POPUP_WRAPPER_CLASS)) {
            if (target.classList.contains(cls.QUICK_POPUP_EVENT_DETAILS_CLASS) ||
                target.classList.contains(cls.EVENT_CREATE_CLASS) ||
                target.classList.contains(cls.EDIT_EVENT_CLASS) ||
                target.classList.contains(cls.DELETE_EVENT_CLASS) ||
                target.classList.contains(cls.CLOSE_CLASS)) {
                target.click();
                e.preventDefault();
            } else if (target.classList.contains(cls.SUBJECT_CLASS)) {
                (this.parent.element.querySelector('.' + cls.EVENT_CREATE_CLASS) as HTMLElement).click();
                e.preventDefault();
            }
            return;
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) || target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            if (this.selectedCells.length > 1) {
                let start: CellClickEventArgs = this.parent.getCellDetails(this.selectedCells[0]);
                let end: CellClickEventArgs = this.parent.getCellDetails(this.selectedCells[this.selectedCells.length - 1]);
                start.endTime = end.endTime;
                start.element = target;
                this.parent.activeCellsData = start;
            } else {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
            }
            let args: CellClickEventArgs = <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e });
            this.parent.notify(event.cellClick, args);
            return;
        }
        if (target.classList.contains(cls.APPOINTMENT_CLASS) || target.classList.contains(cls.MORE_EVENT_CLOSE_CLASS) ||
            target.classList.contains(cls.ALLDAY_APPOINTMENT_SECTION_CLASS) || target.classList.contains(cls.MORE_INDICATOR_CLASS)) {
            target.click();
            return;
        }
        if (target.classList.contains(cls.MORE_EVENT_HEADER_DATE_CLASS)) {
            this.parent.setProperties({ selectedDate: new Date(parseInt(target.getAttribute('data-date'), 10)) }, true);
            this.parent.changeView(this.parent.getNavigateView());
            this.processEscape();
            return;
        }
    }
    private getCells(isInverseTable: boolean, start: HTMLTableCellElement, end: HTMLTableCellElement): HTMLTableCellElement[] {
        let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
        let cells: HTMLTableCellElement[] = [].slice.call(tableEle.querySelectorAll('td'));
        let maxRow: number = tableEle.rows.length;
        let maxColumn: number = tableEle.rows[0].cells.length;
        if (start.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let allDayRow: HTMLTableRowElement = this.parent.getAllDayRow() as HTMLTableRowElement;
            cells = [].slice.call(allDayRow.cells);
            maxRow = 1;
            maxColumn = allDayRow.cells.length;
        }
        let startIndex: number = cells.indexOf(start);
        let endIndex: number = cells.indexOf(end);
        let inverseCells: HTMLTableCellElement[] = [];
        if (isInverseTable) {
            for (let i: number = 0; i < maxColumn; i++) {
                for (let j: number = 0; j < maxRow; j++) {
                    inverseCells.push(cells[maxColumn * j + i]);
                }
            }
            startIndex = inverseCells.indexOf(start);
            endIndex = inverseCells.indexOf(end);
        }
        if (startIndex > endIndex) {
            let temp: number = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        let sCells: HTMLTableCellElement[] = isInverseTable ? inverseCells : cells;
        return sCells.slice(startIndex, endIndex + 1);
    }
    private focusFirstCell(): void {
        if (this.parent.currentView === 'Agenda') {
            let focusCell: HTMLElement = this.parent.getContentTable().querySelector('.' + cls.AGENDA_CELLS_CLASS) as HTMLTableCellElement;
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        if (this.parent.activeView.isTimelineView()) {
            let cell: Element = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS +
                ' tr:not(.' + cls.HIDDEN_CLASS + ') .' + cls.WORK_CELLS_CLASS + ':not(.' + cls.RESOURCE_GROUP_CELLS_CLASS + ')');
            this.selectCells(false, cell as HTMLTableCellElement);
        } else {
            this.selectCells(false, this.parent.getWorkCellElements()[0] as HTMLTableCellElement);
        }
    }
    private isInverseTableSelect(): boolean {
        return this.parent.activeView.isInverseTableSelect;
    }
    /** @hidden */
    public selectCells(isMultiple: boolean, target: HTMLTableCellElement): void {
        this.parent.removeSelectedClass();
        if (isMultiple) {
            let initialId: string;
            let selectedCells: HTMLTableCellElement[] = this.getCells(this.isInverseTableSelect(), this.initialTarget, target);
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                initialId = this.initialTarget.getAttribute('data-group-index');
                let resourceSelectedCells: HTMLTableCellElement[] = [];
                for (let i: number = 0; i < selectedCells.length; i++) {
                    if (selectedCells[i].getAttribute('data-group-index') === initialId) {
                        resourceSelectedCells.push(selectedCells[i]);
                    }
                }
                selectedCells = resourceSelectedCells;
            }
            this.selectedCells = selectedCells;
            if (selectedCells.length > 2 && !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
                let allDayCells: HTMLTableCellElement[] = this.getAllDayCells(selectedCells);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    let resourceAllDayCells: HTMLTableCellElement[] = [];
                    for (let i: number = 0; i < allDayCells.length; i++) {
                        if (allDayCells[i].getAttribute('data-group-index') === initialId) {
                            resourceAllDayCells.push(allDayCells[i]);
                        }
                    }
                    allDayCells = resourceAllDayCells;
                }
                selectedCells = selectedCells.concat(allDayCells);
            }
            if ((target.getAttribute('data-group-index') !== initialId) && this.parent.activeViewOptions.group.resources.length > 0) {
                target = this.selectedCells[this.selectedCells.length - 1];
            }
            this.parent.addSelectedClass(selectedCells, target);
        } else {
            this.initialTarget = target;
            this.selectedCells = [target];
            this.parent.addSelectedClass([target], target);
        }
    }
    private selectAppointment(isReverse: boolean, target: Element): void {
        let appointments: HTMLElement[] = this.getAppointmentElements();
        if (appointments.length < 0) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        let nextAppEle: HTMLElement;
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            let targetIndex: number = appointments.indexOf(target as HTMLElement);
            nextAppEle = appointments[(isReverse ? targetIndex - 1 : targetIndex + 1)];
        } else {
            nextAppEle = isReverse ? appointments[appointments.length - 1] : appointments[0];
        }
        if (nextAppEle) {
            this.parent.eventBase.addSelectedAppointments([nextAppEle]);
            nextAppEle.focus();
            addClass([nextAppEle as Element], cls.AGENDA_SELECTED_CELL);
        }
    }
    private selectAppointmentElementFromWorkCell(isReverse: boolean, target: Element): void {
        this.parent.eventBase.removeSelectedAppointmentClass();
        this.parent.removeSelectedClass();
        if (target.classList.contains(cls.WORK_CELLS_CLASS) || target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let appointmentElements: HTMLElement[] = this.getUniqueAppointmentElements();
            let filteredElements: HTMLElement[] = [];
            let selectedDate: number = parseInt(target.getAttribute('data-date'), 10);
            let selectedSeriesEvents: Object[] = this.parent.eventsProcessed.filter((eventObject: { [key: string]: object }) => {
                return (!isReverse ? ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() >= selectedDate) :
                    ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() <= selectedDate));
            });
            selectedSeriesEvents.filter((event: { [key: string]: object }) => {
                appointmentElements.filter((element: HTMLElement) => {
                    if (JSON.stringify(event.Guid) === JSON.stringify(element.getAttribute('data-guid'))) {
                        filteredElements.push(element);
                    }
                });
            });
            if (filteredElements.length > 0) {
                let selectedElement: Element = isReverse ? filteredElements[filteredElements.length - 1] : filteredElements[0];
                let focusElements: HTMLElement[] = this.getAppointmentElementsByGuid(selectedElement.getAttribute('data-guid'));
                this.parent.eventBase.addSelectedAppointments(focusElements);
                (focusElements[focusElements.length - 1]).focus();
            }
        }
    }
    private getAllDayCells(cells: HTMLTableCellElement[]): HTMLTableCellElement[] {
        let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
        if (!allDayRow) { return []; }
        let startCell: HTMLTableCellElement = cells[0];
        let endCell: HTMLTableCellElement = cells[cells.length - 1];
        let start: CellClickEventArgs = this.parent.getCellDetails(startCell);
        let end: CellClickEventArgs = this.parent.getCellDetails(endCell);
        if (end.endTime.getTime() - start.startTime.getTime() >= util.MS_PER_DAY) {
            let allDayCells: HTMLTableCellElement[] = [].slice.call(allDayRow.cells);
            return allDayCells.slice(startCell.cellIndex, endCell.cellIndex + 1);
        }
        return [];
    }
    private getAppointmentElements(): HTMLElement[] {
        return [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
    }
    private getAppointmentElementsByGuid(guid: string): HTMLElement[] {
        return [].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]'));
    }
    private getUniqueAppointmentElements(): HTMLElement[] {
        let appointments: HTMLElement[] = this.getAppointmentElements();
        let appointmentElements: HTMLElement[] = [];
        appointments.map((value: HTMLElement) => {
            return value.getAttribute('data-guid');
        }).filter((value: string, index: number, self: string[]) => {
            if (self.indexOf(value) === index) {
                appointmentElements.push(appointments[index]);
            }
        });
        return appointmentElements;
    }
    private getWorkCellFromAppointmentElement(target: Element): HTMLTableCellElement {
        let selectedObject: Object = this.parent.eventBase.getEventByGuid(target.getAttribute('data-guid'));
        return this.parent.eventBase.selectWorkCellByTime([selectedObject]) as HTMLTableCellElement;
    }
    private processViewNavigation(e: KeyboardEventArgs): void {
        let index: number = parseInt(e.key, 10) - 1;
        if (index < this.parent.views.length) {
            let view: View = this.parent.viewCollections[index].option;
            this.parent.changeView(view, e, undefined, index);
            if (this.parent.headerModule) {
                (this.parent.headerModule.element.querySelector('.e-active-view button') as HTMLElement).focus();
            }
        }
    }
    private processUp(e: KeyboardEventArgs, isMultiple: boolean): void {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        let selectedElements: Element[] = this.parent.getSelectedElements();
        let selectedEventElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        let moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (selectedElements.length > 0 && !(e.target as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            target = selectedElements[selectedElements.length - 1] as HTMLTableCellElement;
        }
        if (selectedEventElements.length > 0 && !moreEventWrapper.classList.contains(cls.POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(cls.POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedEventElements[selectedEventElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            let tableRows: HTMLTableRowElement[] = this.parent.getTableRows() as HTMLTableRowElement[];
            let curRowIndex: number = tableRows.indexOf(target.parentElement as HTMLTableRowElement);
            if (curRowIndex > 0 && curRowIndex < tableRows.length) {
                this.selectCells(isMultiple, (tableRows[curRowIndex - 1]).cells[target.cellIndex]);
            }
        } else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(true, target);
        }
    }
    private processDown(e: KeyboardEventArgs, isMultiple: boolean): void {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        let selectedCells: Element[] = this.parent.getSelectedElements();
        let selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        let moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (selectedCells.length > 0 && !(e.target as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        if (selectedElements.length > 0 && !moreEventWrapper.classList.contains(cls.POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(cls.POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        let tableRows: HTMLTableRowElement[] = this.parent.getTableRows() as HTMLTableRowElement[];
        if (target.classList.contains(cls.WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            let curRowIndex: number = tableRows.indexOf(target.parentElement as HTMLTableRowElement);
            if (curRowIndex >= 0 && curRowIndex < tableRows.length - 1) {
                this.selectCells(isMultiple, (tableRows[curRowIndex + 1]).cells[target.cellIndex]);
            }
        } else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(false, target);
        }
    }
    private processLeftRight(target: HTMLTableCellElement): KeyEventArgs {
        let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
        let curRowIndex: number = (target.parentNode as HTMLTableRowElement).sectionRowIndex;
        let key: KeyEventArgs = {
            element: tableEle,
            rowIndex: curRowIndex,
            columnIndex: target.cellIndex,
            maxIndex: tableEle.rows[curRowIndex].cells.length
        };
        return key;
    }
    private getQuickPopupElement(): HTMLElement {
        return (this.parent.isAdaptive ? document.body : this.parent.element).querySelector('.' + cls.POPUP_WRAPPER_CLASS) as HTMLElement;
    }
    private isCancelLeftRightAction(e: KeyboardEventArgs, isMultiple: Boolean): boolean {
        if (this.parent.currentView === 'Agenda' || (isMultiple && this.parent.currentView === 'MonthAgenda')) {
            return true;
        }
        if ((this.isPreventAction(e) && isMultiple)) {
            return true;
        }
        let moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (moreEventWrapper.classList.contains(cls.POPUP_OPEN) || quickPopupWrapper.classList.contains(cls.POPUP_OPEN)) {
            return true;
        }
        return false;
    }
    private processRight(e: KeyboardEventArgs, isMultiple: boolean): void {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        let selectedCells: Element[] = this.parent.getSelectedElements();
        let targetCell: HTMLTableCellElement;
        let selectedAppointments: Element[] = this.parent.eventBase.getSelectedAppointments();
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        if (selectedCells.length > 0 && !target.classList.contains(cls.WORK_CELLS_CLASS) &&
            !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        if (selectedAppointments.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedAppointments[selectedAppointments.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS)) {
            let key: KeyEventArgs = this.processLeftRight(target);
            if (key.columnIndex >= 0 && key.columnIndex < key.maxIndex - 1) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex + 1], 'right');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            } else if (key.columnIndex === key.maxIndex - 1) {
                if (!this.isInverseTableSelect() && key.rowIndex < key.element.rows.length - 1) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex + 1].cells[0], 'right');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                } else if (!isMultiple) {
                    let rowIndex: number = this.isInverseTableSelect() ? key.rowIndex : 0;
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                    let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[0]);
                }
            }
        } else if (target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let curColIndex: number = target.cellIndex;
            let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            let maxColIndex: number = allDayRow.cells.length;
            if (curColIndex >= 0 && curColIndex < maxColIndex - 1) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex + 1]);
            } else if (curColIndex === maxColIndex - 1 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[0]);
            }
        }
    }
    private processLeft(e: KeyboardEventArgs, isMultiple: boolean): void {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        let selectedCells: Element[] = this.parent.getSelectedElements();
        let targetCell: HTMLTableCellElement;
        if (selectedCells.length > 0 && !target.classList.contains(cls.WORK_CELLS_CLASS) &&
            !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        let selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS)) {
            let key: KeyEventArgs = this.processLeftRight(target);
            if (key.columnIndex > 0 && key.columnIndex < key.maxIndex) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex - 1], 'left');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            } else if (key.columnIndex === 0) {
                if (!this.isInverseTableSelect() && key.rowIndex > 0) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex - 1].cells[key.maxIndex - 1], 'left');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                } else if (!isMultiple) {
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                    let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    let rowIndex: number = this.isInverseTableSelect() ? key.rowIndex : tableEle.rows.length - 1;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[key.maxIndex - 1]);
                }
            }
        } else if (target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            let curColIndex: number = target.cellIndex;
            let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            let maxColIndex: number = allDayRow.cells.length;
            if (curColIndex > 0 && curColIndex < maxColIndex) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex - 1]);
            } else if (curColIndex === 0 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[maxColIndex - 1]);
            }
        }
    }
    private calculateNextPrevDate(currentCell: HTMLTableCellElement, target: HTMLTableCellElement, type: string): HTMLTableCellElement {
        let initialId: string = this.initialTarget.getAttribute('data-group-index');
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.currentView === 'Month') {
            if (target.getAttribute('data-group-index') !== initialId) {
                let currentDate: Date = new Date(parseInt(currentCell.getAttribute('data-date'), 10));
                let nextPrevDate: Date = (type === 'right') ? new Date(currentDate.setDate(currentDate.getDate() + 1))
                    : new Date(currentDate.setDate(currentDate.getDate() - 1));
                target = [].slice.call(this.parent.element.querySelectorAll('td[data-date="'
                    + nextPrevDate.getTime().toString() + '"]' + '[data-group-index="' + initialId + '"]'))[0];
            }
        }
        return target;
    }

    private getFocusableElements(container: Element): Element[] {
        let queryString: string = 'a[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),' +
            'textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),' +
            'select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])';
        return [].slice.call(container.querySelectorAll(queryString));
    }

    private processTabOnPopup(e: KeyboardEventArgs, popupElement: Element): void {
        let focusableElements: Element[] = this.getFocusableElements(popupElement);
        focusableElements = focusableElements.filter((element: Element) => {
            let footerEle: HTMLElement = this.parent.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
            if (footerEle && footerEle.offsetParent) {
                return !(element.classList.contains(cls.EDIT_CLASS) || element.classList.contains(cls.DELETE_CLASS));
            } else {
                return !(element.classList.contains(cls.EDIT_EVENT_CLASS) || element.classList.contains(cls.DELETE_EVENT_CLASS));
            }
        });
        let firstEle: Element = focusableElements[0];
        let lastEle: Element = focusableElements[focusableElements.length - 1];
        if (!isNullOrUndefined(lastEle) && document.activeElement === lastEle && !e.shiftKey) {
            e.preventDefault();
            (firstEle as HTMLElement).focus();
        }
        if (!isNullOrUndefined(firstEle) && document.activeElement === firstEle && e.shiftKey) {
            e.preventDefault();
            (lastEle as HTMLElement).focus();
        }
    }

    private processTab(e: KeyboardEventArgs, isReverse: boolean): void {
        let target: Element = e.target as Element;
        let popupWrapper: Element = closest(target, '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.MORE_POPUP_WRAPPER_CLASS);
        if (popupWrapper && popupWrapper.classList.contains(cls.POPUP_OPEN)) {
            if (popupWrapper.classList.contains(cls.MORE_POPUP_WRAPPER_CLASS)) {
                this.parent.eventBase.removeSelectedAppointmentClass();
            }
            this.processTabOnPopup(e, popupWrapper);
            return;
        }
        if (target.classList.contains(cls.ROOT)) {
            this.parent.eventBase.removeSelectedAppointmentClass();
            return;
        }
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            let appointments: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
            let selectedAppointments: Element[] = this.parent.eventBase.getSelectedAppointments();
            if (selectedAppointments.length > 0) {
                target = selectedAppointments[selectedAppointments.length - 1] as Element;
            }
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!isReverse && target.getAttribute('data-guid') === appointments[appointments.length - 1].getAttribute('data-guid') ||
                isReverse && target.getAttribute('data-guid') === appointments[0].getAttribute('data-guid')) {
                return;
            }
            if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                this.selectAppointment(isReverse, target);
                e.preventDefault();
            }
            return;
        }
        let selectedCells: Element[] = this.parent.getSelectedElements();
        if (selectedCells.length > 0 && !target.classList.contains(cls.APPOINTMENT_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as Element;
            this.selectAppointmentElementFromWorkCell(isReverse, target);
            e.preventDefault();
            return;
        }
    }
    private processDelete(e: KeyboardEventArgs): void {
        if (document.activeElement.classList.contains(cls.APPOINTMENT_CLASS)) {
            addClass([document.activeElement], cls.APPOINTMENT_BORDER);
            this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
            this.parent.quickPopup.deleteClick();
        }
    }
    private processEscape(): void {
        this.parent.quickPopup.onClosePopup();
        this.parent.quickPopup.morePopup.hide();
        if (this.parent.headerModule) {
            this.parent.headerModule.hideHeaderPopup();
        }
    }
    private isPreventAction(e: Event): boolean {
        let target: Element = closest((e.target as Element), '.' + cls.RESOURCE_GROUP_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'keyboard';
    }
    /**
     * To destroy the keyboard module. 
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
        this.keyboardModule.destroy();
    }
}