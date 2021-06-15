/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardEvents, KeyboardEventArgs, closest, EventHandler, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { View } from '../base/type';
import { Schedule } from '../base/schedule';
import { CellClickEventArgs, KeyEventArgs, ResizeEdges, SelectEventArgs, InlineClickArgs } from '../base/interface';
import * as event from '../base/constant';
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
        altSeven: 'alt+7',
        altEight: 'alt+8',
        altNine: 'alt+9',
        enter: 'enter',
        escape: 'escape',
        delete: 'delete',
        home: 'home',
        pageUp: 'pageup',
        pageDown: 'pagedown',
        tab: 'tab',
        shiftTab: 'shift+tab',
        ctrlShiftUpArrow: 'ctrl+shift+uparrow',
        ctrlShiftDownArrow: 'ctrl+shift+downarrow',
        ctrlShiftLeftArrow: 'ctrl+shift+leftarrow',
        ctrlShiftRightArrow: 'ctrl+shift+rightarrow'
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
        case 'altSeven':
        case 'altEight':
        case 'altNine':
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
        case 'ctrlShiftUpArrow':
        case 'ctrlShiftDownArrow':
        case 'ctrlShiftLeftArrow':
        case 'ctrlShiftRightArrow':
            this.processCtrlShiftNavigationArrows(e);
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
        if ((e.event.target as HTMLElement).classList.contains(cls.WORK_CELLS_CLASS) && e.event.which !== 3) {
            this.parent.removeSelectedClass();
            EventHandler.add(this.parent.getContentTable(), 'mousemove', this.onMouseSelection, this);
            EventHandler.add(this.parent.getContentTable(), 'mouseup', this.onMoveUp, this);
        }
        if ((e.event.target as HTMLElement).classList.contains(cls.ALLDAY_CELLS_CLASS) && e.event.which !== 3) {
            this.parent.removeSelectedClass();
            const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            EventHandler.add(allDayRow, 'mousemove', this.onMouseSelection, this);
            EventHandler.add(allDayRow, 'mouseup', this.onMoveUp, this);
        }
    }

    public onMouseSelection(e: MouseEvent): void {
        const appointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS)) as Element[];
        addClass(appointments, 'e-allow-select');
        const selectionEdges: ResizeEdges = this.parent.boundaryValidation(e.pageY, e.pageX);
        if (selectionEdges.bottom || selectionEdges.top || selectionEdges.left || selectionEdges.right) {
            const parent: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
            const yInBounds: boolean = parent.offsetHeight <= parent.scrollHeight && parent.scrollTop >= 0 &&
                parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
            const xInBounds: boolean = parent.offsetWidth <= parent.scrollWidth && parent.scrollLeft >= 0 &&
                parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
            if (yInBounds && (selectionEdges.top || selectionEdges.bottom)) {
                parent.scrollTop += selectionEdges.top ? -(e.target as HTMLElement).offsetHeight : (e.target as HTMLElement).offsetHeight;
            }
            if (xInBounds && (selectionEdges.left || selectionEdges.right)) {
                parent.scrollLeft += selectionEdges.left ? -(e.target as HTMLElement).offsetWidth : (e.target as HTMLElement).offsetWidth;
            }
        }
        const target: HTMLTableCellElement = this.getClosestCell(e);
        if (target) {
            this.selectCells(true, target);
        }
    }

    private getClosestCell(e: Event): HTMLTableCellElement {
        return closest(<Element>e.target, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS) as HTMLTableCellElement;
    }
    private onMoveUp(e: Event): void {
        const appointments: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS)) as Element[];
        removeClass(appointments, 'e-allow-select');
        if ((e.target as HTMLElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            EventHandler.remove(this.parent.getContentTable(), 'mousemove', this.onMouseSelection);
            EventHandler.remove(this.parent.getContentTable(), 'mouseup', this.onMoveUp);
        }
        if ((e.target as HTMLElement).classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            EventHandler.remove(allDayRow, 'mousemove', this.onMouseSelection);
            EventHandler.remove(allDayRow, 'mouseup', this.onMoveUp);
        }
        if (this.isPreventAction(e)) {
            return;
        }
        const queryStr: string = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.HEADER_CELLS_CLASS;
        const target: HTMLTableCellElement = closest((e.target as Element), queryStr) as HTMLTableCellElement;
        this.parent.activeCellsData = this.getSelectedElements(target);
        const cellData: Record<string, any> = {};
        if (this.parent.eventWindow) {
            this.parent.eventWindow.convertToEventData(this.parent.activeCellsData as unknown as Record<string, any>, cellData);
        }
        const selectedCells: Element[] = this.parent.getSelectedElements();
        const args: SelectEventArgs = {
            data: cellData, element: this.parent.activeCellsData.element, event: e,
            requestType: 'cellSelect', showQuickPopup: false
        };
        this.parent.trigger(event.select, args, (selectArgs: SelectEventArgs) => {
            const isPopupShow: boolean = selectArgs.showQuickPopup || this.parent.quickInfoOnSelectionEnd;
            if (isPopupShow && selectedCells.length > 1) {
                const cellArgs: CellClickEventArgs =
                    <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
                this.parent.notify(event.cellClick, cellArgs);
            }
        });
    }
    private processEnter(e: Event): void {
        if ((this.parent.activeViewOptions.readonly && !(e.target as Element).classList.contains(cls.APPOINTMENT_CLASS)) || this.isPreventAction(e)) {
            return;
        }
        const target: HTMLTableCellElement = e.target as HTMLTableCellElement;
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
        if (target.classList.contains(cls.RESOURCE_CELLS_CLASS) && target.classList.contains(cls.RESOURCE_PARENT_CLASS)) {
            const resourceIcon: HTMLElement = target.querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS) as HTMLElement;
            if (resourceIcon) {
                resourceIcon.click();
            }
            return;
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) || target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            this.parent.activeCellsData = this.getSelectedElements(target);
            const args: CellClickEventArgs = <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e });
            if (this.parent.allowInline) {
                const inlineArgs: InlineClickArgs = {
                    element: args.element as HTMLElement,
                    groupIndex: args.groupIndex, type: 'Cell'
                };
                this.parent.notify(event.inlineClick, inlineArgs);
            } else {
                this.parent.notify(event.cellClick, args);
            }
            return;
        }
        if (target.classList.contains(cls.INLINE_SUBJECT_CLASS)) {
            this.parent.inlineModule.inlineCrudActions(target);
            return;
        }
        if (target.classList.contains(cls.APPOINTMENT_CLASS) || target.classList.contains(cls.MORE_EVENT_CLOSE_CLASS) ||
            target.classList.contains(cls.ALLDAY_APPOINTMENT_SECTION_CLASS) || target.classList.contains(cls.MORE_INDICATOR_CLASS)) {
            target.click();
            return;
        }
        if (target.classList.contains(cls.MORE_EVENT_HEADER_DATE_CLASS)) {
            this.parent.setProperties({ selectedDate: this.parent.getDateFromElement(target) }, true);
            this.parent.changeView(this.parent.getNavigateView(), e);
            this.processEscape();
            return;
        }
    }
    private getSelectedElements(target: HTMLTableCellElement): CellClickEventArgs {
        let cellDetails: CellClickEventArgs;
        if (this.selectedCells.length > 1 && target.classList.contains(cls.SELECTED_CELL_CLASS)) {
            const start: CellClickEventArgs = this.parent.getCellDetails(this.selectedCells[0]);
            const end: CellClickEventArgs = this.parent.getCellDetails(this.selectedCells.slice(-1)[0]);
            start.endTime = end.endTime;
            start.element = target;
            cellDetails = start;
        } else {
            cellDetails = this.parent.getCellDetails(target);
        }
        return cellDetails;
    }
    private getCells(isInverseTable: boolean, start: HTMLTableCellElement, end: HTMLTableCellElement): HTMLTableCellElement[] {
        const tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
        let cells: HTMLTableCellElement[] = [].slice.call(tableEle.querySelectorAll('td'));
        let maxRow: number = tableEle.rows.length;
        let maxColumn: number = tableEle.rows[0].cells.length;
        if (start && start.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            const allDayRow: HTMLTableRowElement = this.parent.getAllDayRow() as HTMLTableRowElement;
            cells = [].slice.call(allDayRow.cells);
            maxRow = 1;
            maxColumn = allDayRow.cells.length;
        }
        let startIndex: number = cells.indexOf(start);
        let endIndex: number = cells.indexOf(end);
        const inverseCells: HTMLTableCellElement[] = [];
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
            const temp: number = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        const sCells: HTMLTableCellElement[] = isInverseTable ? inverseCells : cells;
        return sCells.slice(startIndex, endIndex + 1);
    }
    private focusFirstCell(): void {
        if (this.parent.currentView === 'Agenda') {
            const focusCell: HTMLElement = this.parent.getContentTable().querySelector('.' + cls.AGENDA_CELLS_CLASS) as HTMLTableCellElement;
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        if (this.parent.activeView.isTimelineView()) {
            const cell: Element = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS +
                ' tr:not(.' + cls.HIDDEN_CLASS + ') .' + cls.WORK_CELLS_CLASS + ':not(.' + cls.RESOURCE_GROUP_CELLS_CLASS + ')');
            this.selectCells(false, cell as HTMLTableCellElement);
        } else {
            this.selectCells(false, this.parent.getWorkCellElements()[0] as HTMLTableCellElement);
        }
    }
    private isInverseTableSelect(): boolean {
        return this.parent.activeView.isInverseTableSelect;
    }
    /**
     * Internal method to select cells
     *
     * @param {boolean} isMultiple Accepts to select multiple cells or not
     * @param {HTMLTableCellElement} targetCell Accepts the target cells
     * @returns {void}
     * @private
     */
    public selectCells(isMultiple: boolean, targetCell: HTMLTableCellElement): void {
        this.parent.removeSelectedClass();
        let target: HTMLTableCellElement = (targetCell instanceof Array) ? targetCell.slice(-1)[0] : targetCell;
        if (isMultiple) {
            let initialId: string;
            const views: string[] = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
            const args: SelectEventArgs = { element: targetCell, requestType: 'mousemove', allowMultipleRow: true };
            this.parent.inlineModule.removeInlineAppointmentElement();
            this.parent.trigger(event.select, args, (selectArgs: SelectEventArgs) => {
                const allowMultipleRow: boolean = (!selectArgs.allowMultipleRow) || (!this.parent.allowMultiRowSelection);
                if (allowMultipleRow && (views.indexOf(this.parent.currentView) > -1)) {
                    target = target.parentElement.children[this.initialTarget.cellIndex] as HTMLTableCellElement;
                }
                let selectedCells: HTMLTableCellElement[] = this.getCells(this.isInverseTableSelect(), this.initialTarget, target);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    initialId = this.initialTarget.getAttribute('data-group-index');
                    const resourceSelectedCells: HTMLTableCellElement[] = [];
                    for (const cell of selectedCells) {
                        if (cell.getAttribute('data-group-index') === initialId) {
                            resourceSelectedCells.push(cell);
                        }
                    }
                    selectedCells = resourceSelectedCells;
                }
                if (!this.parent.allowMultiCellSelection) {
                    selectedCells = [this.initialTarget];
                }
                this.selectedCells = selectedCells;
                if (selectedCells.length > 2 && !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
                    let allDayCells: HTMLTableCellElement[] = this.getAllDayCells(selectedCells);
                    if (this.parent.activeViewOptions.group.resources.length > 0) {
                        const resourceAllDayCells: HTMLTableCellElement[] = [];
                        for (const cell of allDayCells) {
                            if (cell.getAttribute('data-group-index') === initialId) {
                                resourceAllDayCells.push(cell);
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
            });
        } else {
            this.initialTarget = target;
            this.selectedCells = [target];
            this.parent.addSelectedClass([target], target);
        }
    }
    private selectAppointment(isReverse: boolean, target: Element): void {
        const appointments: HTMLElement[] = this.getAppointmentElements();
        if (appointments.length < 0) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        let nextAppEle: HTMLElement;
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            const targetIndex: number = appointments.indexOf(target as HTMLElement);
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
            const appointmentElements: HTMLElement[] = this.getUniqueAppointmentElements();
            const filteredElements: HTMLElement[] = [];
            const selectedDate: number = this.parent.getDateFromElement(target).getTime();
            const selectedSeriesEvents: Record<string, any>[] = this.parent.eventsProcessed.filter((eventObject: Record<string, any>) => {
                return (!isReverse ? ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() >= selectedDate) :
                    ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() <= selectedDate));
            }) as Record<string, any>[];
            selectedSeriesEvents.filter((event: Record<string, any>) => {
                appointmentElements.filter((element: HTMLElement) => {
                    if (JSON.stringify(event.Guid) === JSON.stringify(element.getAttribute('data-guid'))) {
                        filteredElements.push(element);
                    }
                });
            });
            if (filteredElements.length > 0) {
                const selectedElement: Element = isReverse ? filteredElements[filteredElements.length - 1] : filteredElements[0];
                const focusElements: HTMLElement[] = this.getAppointmentElementsByGuid(selectedElement.getAttribute('data-guid'));
                this.parent.eventBase.addSelectedAppointments(focusElements);
                (focusElements[focusElements.length - 1]).focus();
            }
        }
    }
    private getAllDayCells(cells: HTMLTableCellElement[]): HTMLTableCellElement[] {
        const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
        if (!allDayRow) { return []; }
        const startCell: HTMLTableCellElement = cells[0];
        const endCell: HTMLTableCellElement = cells[cells.length - 1];
        const start: CellClickEventArgs = this.parent.getCellDetails(startCell);
        const end: CellClickEventArgs = this.parent.getCellDetails(endCell);
        if (end.endTime.getTime() - start.startTime.getTime() >= util.MS_PER_DAY) {
            const allDayCells: HTMLTableCellElement[] = [].slice.call(allDayRow.cells);
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
        const appointments: HTMLElement[] = this.getAppointmentElements();
        const appointmentElements: HTMLElement[] = [];
        appointments.map((value: HTMLElement) => value.getAttribute('data-guid')).filter((value: string, index: number, self: string[]) => {
            if (self.indexOf(value) === index) {
                appointmentElements.push(appointments[index]);
            }
        });
        return appointmentElements;
    }
    private getWorkCellFromAppointmentElement(target: Element): HTMLTableCellElement {
        const selectedObject: Record<string, any> =
            this.parent.eventBase.getEventByGuid(target.getAttribute('data-guid')) as Record<string, any>;
        return this.parent.eventBase.selectWorkCellByTime([selectedObject]) as HTMLTableCellElement;
    }
    private processViewNavigation(e: KeyboardEventArgs): void {
        const index: number = parseInt(e.key, 10) - 1;
        if (index < this.parent.views.length) {
            const view: View = this.parent.viewCollections[index].option;
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
        const selectedElements: Element[] = this.parent.getSelectedElements();
        const selectedEventElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        const moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        const quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (selectedElements.length > 0 && !(e.target as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            target = selectedElements[selectedElements.length - 1] as HTMLTableCellElement;
        }
        if (selectedEventElements.length > 0 && !moreEventWrapper.classList.contains(cls.POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(cls.POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedEventElements[selectedEventElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        if (!target) { return; }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            const tableRows: HTMLTableRowElement[] = this.parent.getTableRows() as HTMLTableRowElement[];
            const curRowIndex: number = tableRows.indexOf(target.parentElement as HTMLTableRowElement);
            if (curRowIndex > 0 && curRowIndex < tableRows.length) {
                this.selectCells(isMultiple, (tableRows[curRowIndex - 1]).cells[target.cellIndex]);
            }
        } else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(true, target);
        }
    }
    private processDown(e: KeyboardEventArgs, isMultiple: boolean): void {
        if (isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda')) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        const selectedCells: Element[] = this.parent.getSelectedElements();
        const selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        const moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        const quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (selectedCells.length > 0 && !(e.target as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        if (selectedElements.length > 0 && !moreEventWrapper.classList.contains(cls.POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(cls.POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        const tableRows: HTMLTableRowElement[] = this.parent.getTableRows() as HTMLTableRowElement[];
        if (!target) { return; }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + cls.POPUP_OPEN)) {
            const curRowIndex: number = tableRows.indexOf(target.parentElement as HTMLTableRowElement);
            if (curRowIndex >= 0 && curRowIndex < tableRows.length - 1) {
                this.selectCells(isMultiple, (tableRows[curRowIndex + 1]).cells[target.cellIndex]);
            }
        } else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(false, target);
        }
    }
    private processLeftRight(target: HTMLTableCellElement): KeyEventArgs {
        const tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
        const curRowIndex: number = (target.parentNode as HTMLTableRowElement).sectionRowIndex;
        const key: KeyEventArgs = {
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
    private isCancelLeftRightAction(e: KeyboardEventArgs, isMultiple: boolean): boolean {
        if (this.parent.currentView === 'Agenda' || (isMultiple && this.parent.currentView === 'MonthAgenda')) {
            return true;
        }
        if (this.isPreventAction(e) && isMultiple) {
            return true;
        }
        const moreEventWrapper: HTMLElement = <HTMLElement>this.parent.element.querySelector('.' + cls.MORE_POPUP_WRAPPER_CLASS);
        const quickPopupWrapper: HTMLElement = this.getQuickPopupElement();
        if (moreEventWrapper.classList.contains(cls.POPUP_OPEN) || quickPopupWrapper.classList.contains(cls.POPUP_OPEN)) {
            return true;
        }
        return false;
    }
    private processRight(e: KeyboardEventArgs, isMultiple: boolean): void {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        const selectedCells: Element[] = this.parent.getSelectedElements();
        let targetCell: HTMLTableCellElement;
        const selectedAppointments: Element[] = this.parent.eventBase.getSelectedAppointments();
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        if (selectedCells.length > 0 && !target.classList.contains(cls.WORK_CELLS_CLASS) &&
            !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        if (selectedAppointments.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedAppointments[selectedAppointments.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) { return; }
        }
        if (target.classList.contains(cls.WORK_CELLS_CLASS) &&
            ((e.target) as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS)) {
            const key: KeyEventArgs = this.processLeftRight(target);
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
                    const rowIndex: number = this.isInverseTableSelect() ? key.rowIndex : 0;
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                    const tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[0]);
                }
            }
        } else if (target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            const curColIndex: number = target.cellIndex;
            const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            const maxColIndex: number = allDayRow.cells.length;
            if (curColIndex >= 0 && curColIndex < maxColIndex - 1) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex + 1]);
            } else if (curColIndex === maxColIndex - 1 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[0]);
            }
        }
    }
    private processLeft(e: KeyboardEventArgs, isMultiple: boolean): void {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        let target: HTMLTableCellElement = (e.target) as HTMLTableCellElement;
        const selectedCells: Element[] = this.parent.getSelectedElements();
        let targetCell: HTMLTableCellElement;
        if (selectedCells.length > 0 && !target.classList.contains(cls.WORK_CELLS_CLASS) &&
            !target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as HTMLTableCellElement;
        }
        const selectedElements: Element[] = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) { return; }
        }
        if (((e.target) as HTMLTableCellElement).classList.contains(cls.WORK_CELLS_CLASS) &&
            target.classList.contains(cls.WORK_CELLS_CLASS)) {
            const key: KeyEventArgs = this.processLeftRight(target);
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
                    const tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    const rowIndex: number = this.isInverseTableSelect() ? key.rowIndex : tableEle.rows.length - 1;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[key.maxIndex - 1]);
                }
            }
        } else if (target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
            const curColIndex: number = target.cellIndex;
            const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
            const maxColIndex: number = allDayRow.cells.length;
            if (curColIndex > 0 && curColIndex < maxColIndex) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex - 1]);
            } else if (curColIndex === 0 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                const allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[maxColIndex - 1]);
            }
        }
    }
    private calculateNextPrevDate(currentCell: HTMLTableCellElement, target: HTMLTableCellElement, type: string): HTMLTableCellElement {
        const initialId: string = this.initialTarget.getAttribute('data-group-index');
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.currentView === 'Month') {
            if (currentCell && target && target.getAttribute('data-group-index') !== initialId) {
                const currentDate: Date = this.parent.getDateFromElement(currentCell);
                const nextPrevDate: Date = (type === 'right') ? new Date(currentDate.setDate(currentDate.getDate() + 1))
                    : new Date(currentDate.setDate(currentDate.getDate() - 1));
                target = [].slice.call(this.parent.element.querySelectorAll('td[data-date="'
                    + nextPrevDate.getTime().toString() + '"]' + '[data-group-index="' + initialId + '"]'))[0];
            }
        }
        return target;
    }

    private getFocusableElements(container: Element): Element[] {
        const queryString: string = 'a[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),' +
            'textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),' +
            'select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])';
        return [].slice.call(container.querySelectorAll(queryString));
    }

    private processTabOnPopup(e: KeyboardEventArgs, popupElement: Element): void {
        let focusableElements: Element[] = this.getFocusableElements(popupElement);
        focusableElements = focusableElements.filter((element: Element) => {
            const footerEle: HTMLElement = this.parent.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
            if (footerEle && footerEle.offsetParent) {
                return !(element.classList.contains(cls.EDIT_CLASS) || element.classList.contains(cls.DELETE_CLASS));
            } else {
                return !(element.classList.contains(cls.EDIT_EVENT_CLASS) || element.classList.contains(cls.DELETE_EVENT_CLASS));
            }
        });
        const firstEle: Element = focusableElements[0];
        const lastEle: Element = focusableElements[focusableElements.length - 1];
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
        const popupWrapper: Element = closest(target, '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.MORE_POPUP_WRAPPER_CLASS);
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
        if (target.classList.contains(cls.RESOURCE_CELLS_CLASS) && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            const index: number = parseInt(target.getAttribute('data-group-index'), 10);
            const appSelector: string = `.${cls.APPOINTMENT_CLASS}[data-group-index="${isReverse ? index - 1 : index}"]`;
            const appElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(appSelector));
            if (appElements.length > 0) {
                this.parent.eventBase.removeSelectedAppointmentClass();
                const focusAppointment: HTMLElement = isReverse ? appElements.slice(-1)[0] : appElements[0];
                this.parent.eventBase.addSelectedAppointments([focusAppointment]);
                focusAppointment.focus();
                e.preventDefault();
            } else if (index + 1 === this.parent.resourceBase.lastResourceLevel.length) {
                this.parent.element.focus();
                e.preventDefault();
            } else if (this.parent.virtualScrollModule) {
                const virtual: HTMLElement = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS) as HTMLElement;
                const averageRowHeight: number = Math.round(virtual.offsetHeight / this.parent.resourceBase.expandedResources.length);
                this.parent.element.querySelector('.e-content-wrap').scrollTop = ((isReverse ? index - 1 : index + 1) * averageRowHeight);
                this.parent.virtualScrollModule.virtualScrolling();
            } else {
                this.setScrollPosition(index);
            }
            return;
        }
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            let appElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS));
            if (this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0) {
                const index: number = parseInt(target.getAttribute('data-group-index'), 10);
                appElements = [].slice.call(this.parent.element.querySelectorAll(`.${cls.APPOINTMENT_CLASS}[data-group-index="${index}"]`));
                const resCellSelector: string = `.${cls.RESOURCE_CELLS_CLASS}[data-group-index="${isReverse ? index : index + 1}"]`;
                const resourceCell: HTMLElement = this.parent.element.querySelector(resCellSelector) as HTMLElement;
                if (resourceCell && (isReverse && target.getAttribute('data-guid') === appElements[0].getAttribute('data-guid') ||
                    !isReverse && target.getAttribute('data-guid') === appElements.slice(-1)[0].getAttribute('data-guid'))) {
                    this.parent.eventBase.removeSelectedAppointmentClass();
                    if (this.parent.virtualScrollModule) {
                        resourceCell.focus({ preventScroll: true });
                    } else {
                        resourceCell.focus();
                    }
                    if (this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
                        isNullOrUndefined(this.parent.virtualScrollModule)) {
                        this.setScrollPosition(index);
                    }
                    e.preventDefault();
                    return;
                }
            }
            const selectedAppointments: Element[] = this.parent.eventBase.getSelectedAppointments();
            if (selectedAppointments.length > 0) {
                target = selectedAppointments[selectedAppointments.length - 1] as Element;
            }
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!isReverse && target.getAttribute('data-guid') === appElements[appElements.length - 1].getAttribute('data-guid') ||
                isReverse && target.getAttribute('data-guid') === appElements[0].getAttribute('data-guid')) {
                return;
            }
            if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                this.selectAppointment(isReverse, target);
                e.preventDefault();
            }
            return;
        }
        const selectedCells: Element[] = this.parent.getSelectedElements();
        if (selectedCells.length > 0 && !target.classList.contains(cls.APPOINTMENT_CLASS)) {
            target = selectedCells[selectedCells.length - 1] as Element;
            this.selectAppointmentElementFromWorkCell(isReverse, target);
            e.preventDefault();
            return;
        }
        if (target && !target.classList.contains(cls.RESOURCE_CELLS_CLASS) && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            this.processTabOnResourceCells(target, isReverse);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private processDelete(e: KeyboardEventArgs): void {
        let activeEle: Element = document.activeElement;
        if (this.parent.currentView === 'MonthAgenda') {
            const selectedEle: HTMLElement[] = this.parent.eventBase.getSelectedEvents().element as HTMLElement[];
            activeEle = <Element>((selectedEle && isNullOrUndefined(selectedEle.length)) ? selectedEle : selectedEle[0]);
        }
        if (activeEle && activeEle.classList.contains(cls.APPOINTMENT_CLASS)) {
            addClass([activeEle], cls.APPOINTMENT_BORDER);
            this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
            if (this.parent.activeViewOptions.readonly || activeEle.classList.contains(cls.READ_ONLY) || !this.parent.eventSettings.allowDeleting) {
                return;
            }
            this.parent.quickPopup.deleteClick();
        }
    }
    private processCtrlShiftNavigationArrows(e: KeyboardEventArgs): void {
        if (this.parent.activeViewOptions.group.resources.length > 0 && document.activeElement.classList.contains(cls.APPOINTMENT_CLASS)) {
            const groupIndex: number = parseInt(document.activeElement.getAttribute('data-group-index'), 10);
            let index: number = (e.action === 'ctrlShiftLeftArrow' || e.action === 'ctrlShiftUpArrow') ? groupIndex - 1 : groupIndex + 1;
            index = index < 0 ? 0 : index > this.parent.resourceBase.lastResourceLevel.length ?
                this.parent.resourceBase.lastResourceLevel.length : index;
            let eventEle: HTMLElement[] = [];
            while (eventEle.length === 0 && index >= 0 && index <= this.parent.resourceBase.lastResourceLevel.length) {
                eventEle = [].slice.call(this.parent.element.querySelectorAll(`.${cls.APPOINTMENT_CLASS}[data-group-index="${index}"]`));
                index = (e.action === 'ctrlShiftLeftArrow' || e.action === 'ctrlShiftUpArrow') ? index - 1 : index + 1;
            }
            const nextAppEle: HTMLElement = eventEle[0];
            if (nextAppEle) {
                this.parent.eventBase.removeSelectedAppointmentClass();
                this.parent.eventBase.addSelectedAppointments([nextAppEle]);
                nextAppEle.focus();
            }
        } else if (this.parent.activeViewOptions.group.resources.length > 0 &&
            !document.activeElement.classList.contains(cls.APPOINTMENT_CLASS)) {
            const index: number = this.parent.resourceBase.renderedResources[0].groupIndex;
            const appSelector: string = `.${cls.APPOINTMENT_CLASS}[data-group-index="${index}"]`;
            const appElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(appSelector));
            if (appElements.length > 0) {
                this.parent.eventBase.removeSelectedAppointmentClass();
                const focusAppointment: HTMLElement = appElements[0];
                this.parent.eventBase.addSelectedAppointments([focusAppointment]);
                focusAppointment.focus();
                e.preventDefault();
            }
        }
    }
    private processEscape(): void {
        this.parent.quickPopup.onClosePopup();
        this.parent.quickPopup.morePopup.hide();
        if (this.parent.headerModule) {
            this.parent.headerModule.hideHeaderPopup();
        }
        if (this.parent.inlineModule) {
            this.parent.inlineModule.removeInlineAppointmentElement();
        }
    }
    private isPreventAction(e: Event): boolean {
        const target: Element = closest((e.target as Element), '.' + cls.RESOURCE_GROUP_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    }
    private processTabOnResourceCells(target: Element, isReverse: boolean): void {
        const tabElements: Element[] = [].slice.call(this.parent.element.querySelectorAll('[tabIndex="0"]'));
        const currentTabIndex: number = tabElements.indexOf(target);
        const nextTabElement: Element = !isReverse ? tabElements[currentTabIndex + 1] : tabElements[currentTabIndex - 1];
        if (nextTabElement && nextTabElement.classList.contains(cls.RESOURCE_CELLS_CLASS)) {
            const groupIndex: number = parseInt(nextTabElement.getAttribute('data-group-index'), 10);
            if (this.parent.virtualScrollModule) {
                const resColWrap: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
                const resCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_CELLS_CLASS));
                resCells.forEach((element: HTMLElement) => {
                    if (element.getBoundingClientRect().top < resColWrap.getBoundingClientRect().top) {
                        element.setAttribute('tabindex', '-1');
                    }
                });
            } else {
                this.setScrollPosition(groupIndex);
            }
        }
    }
    private setScrollPosition(index: number): void {
        const workCell: HTMLElement =
            this.parent.element.querySelector(`.${cls.WORK_CELLS_CLASS}[data-group-index="${index}"]`) as HTMLElement;
        if (workCell) {
            this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).scrollTop = workCell.offsetTop;
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} Returns the module name.
     */
    protected getModuleName(): string {
        return 'keyboard';
    }
    /**
     * To destroy the keyboard module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
        this.keyboardModule.destroy();
    }

}
