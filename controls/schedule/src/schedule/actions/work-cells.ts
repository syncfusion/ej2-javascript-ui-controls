/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend, closest, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { CellClickEventArgs, HoverEventArgs, InlineClickArgs } from '../base/interface';
import { View } from '../base/type';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Work cell interactions
 */
export class WorkCellInteraction {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
        EventHandler.add(this.parent.element, 'mouseover', this.onHover, this);
    }

    public cellMouseDown(e: Event): void {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.notify(event.cellMouseDown, { event: e });
    }

    public cellClick(e: Event & MouseEvent): void {
        if (this.isPreventAction(e)) {
            return;
        }
        const queryStr: string = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.HEADER_CELLS_CLASS;
        const target: HTMLTableCellElement = closest((e.target as Element), queryStr) as HTMLTableCellElement;
        if (isNullOrUndefined(target)) {
            return;
        }
        if (!isNullOrUndefined(closest(e.target as Element, '.' + cls.NEW_EVENT_CLASS))) {
            this.parent.eventWindow.openEditor(this.parent.activeCellsData as unknown as Record<string, any>, 'Add');
            return;
        }
        const isWorkCell: boolean = target.classList.contains(cls.WORK_CELLS_CLASS) ||
            target.classList.contains(cls.ALLDAY_CELLS_CLASS);
        if (this.parent.uiStateValues.isTapHold && !this.parent.uiStateValues.action && isWorkCell) {
            this.parent.uiStateValues.isTapHold = false;
            this.parent.eventBase.removeSelectedAppointmentClass();
            this.parent.selectedElements = [];
        }
        const navigateEle: Element = closest((e.target as Element), '.' + cls.NAVIGATE_CLASS);
        const navigateView: View = this.parent.getNavigateView();
        const sameView: boolean = this.parent.currentView === navigateView;
        if (isNullOrUndefined(navigateEle) || sameView ||
            isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly && this.parent.currentView !== 'MonthAgenda') {
                if (this.parent.quickPopup) {
                    this.parent.quickPopup.quickPopupHide();
                }
                return;
            }
            if (this.parent.isAdaptive && ((e.target as Element).classList.contains(cls.MORE_INDICATOR_CLASS) ||
                closest((e.target as Element), '.' + cls.MORE_INDICATOR_CLASS))) {
                return;
            }
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            const args: CellClickEventArgs =
                <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(event.cellClick, args, (clickArgs: CellClickEventArgs) => {
                if (!clickArgs.cancel) {
                    if (isWorkCell) {
                        this.parent.selectCell(target);
                    }
                    if (this.parent.allowInline) {
                        const inlineArgs: InlineClickArgs = {
                            element: clickArgs.element as HTMLElement,
                            groupIndex: clickArgs.groupIndex, type: 'Cell'
                        };
                        this.parent.notify(event.inlineClick, inlineArgs);
                    } else {
                        this.parent.notify(event.cellClick, clickArgs);
                    }
                } else {
                    if (this.parent.quickPopup) {
                        this.parent.quickPopup.quickPopupHide();
                    }
                }
            });
        } else {
            const date: Date = this.parent.getDateFromElement(target);
            if (!isNullOrUndefined(date) && this.parent.isMinMaxDate(date)) {
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView(), e);
            }
        }
    }

    public cellDblClick(e: Event): void {
        const queryStr: string = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.HEADER_CELLS_CLASS;
        const target: HTMLTableCellElement = closest((e.target as Element), queryStr) as HTMLTableCellElement;
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e) || isNullOrUndefined(target)) {
            return;
        }
        const args: CellClickEventArgs =
            <CellClickEventArgs>extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellDoubleClick' });
        this.parent.trigger(event.cellDoubleClick, args, (clickArgs: CellClickEventArgs) => {
            if (!clickArgs.startTime) { return; }
            const date: Date = new Date(clickArgs.startTime.getTime());
            if (!this.parent.isMinMaxDate(new Date(date.setHours(0, 0, 0, 0)))) {
                return;
            }
            if (!clickArgs.cancel) {
                this.parent.eventWindow.openEditor(this.parent.activeCellsData as unknown as Record<string, any>, 'Add');
            }
        });
    }

    private onHover(e: MouseEvent): void {
        const targetSelector: string = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.TIME_SLOT_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' +
            cls.HEADER_CELLS_CLASS + ',.' + cls.RESOURCE_CELLS_CLASS + ',.' + cls.APPOINTMENT_CLASS + ',.' + cls.WEEK_NUMBER_CLASS +
            ',.' + cls.MONTH_HEADER_CLASS;
        const hoverTarget: HTMLElement = closest((e.target as Element), targetSelector) as HTMLElement;
        if (hoverTarget) {
            const hoverArgs: HoverEventArgs = { element: hoverTarget, event: e };
            this.parent.trigger(event.hover, hoverArgs);
        }
    }

    private isPreventAction(e: Event): boolean {
        if (closest((e.target as Element), '.' + cls.NAVIGATE_CLASS)) {
            return false;
        }
        if (closest((e.target as Element), '.' + cls.APPOINTMENT_WRAPPER_CLASS) &&
            !closest((e.target as Element), '.' + cls.MORE_INDICATOR_CLASS)) {
            return true;
        }
        let target: Element = closest((e.target as Element), '.' + cls.APPOINTMENT_CLASS + ',.' + cls.RESOURCE_GROUP_CELLS_CLASS);
        if (!isNullOrUndefined(target)) {
            return true;
        }
        target = closest((e.target as Element), '.' + cls.HEADER_CELLS_CLASS);
        if (this.parent.activeView && this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    }

    public destroy(): void {
        EventHandler.remove(this.parent.element, 'mouseover', this.onHover);
    }
}
