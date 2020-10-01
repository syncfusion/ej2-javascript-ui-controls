import { extend, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import { CellClickEventArgs, View } from '../base/interface';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Work cell interactions
 */
export class WorkCellInteraction {
    private parent: SfSchedule;

    constructor(parent: SfSchedule) {
        this.parent = parent;
    }

    public cellMouseDown(e: Event): void {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.onCellMouseDown(e as Event & MouseEvent);
    }

    public cellClick(e: Event & MouseEvent): void {
        if (this.isPreventAction(e)) {
            return;
        }
        let queryStr: string = '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.HEADER_CELLS_CLASS;
        let target: HTMLTableCellElement = closest((e.target as Element), queryStr) as HTMLTableCellElement;
        if (isNullOrUndefined(target)) {
            return;
        }
        if (!isNullOrUndefined(closest(e.target as Element, '.' + cls.NEW_EVENT_CLASS))) {
            let args: CellClickEventArgs = <CellClickEventArgs>extend({}, this.parent.activeCellsData, null, true);
            args.startTime = util.addLocalOffset(args.startTime);
            args.endTime = util.addLocalOffset(args.endTime);
            this.parent.dotNetRef.invokeMethodAsync('OnOpenEditor', args, 'Add');
            return;
        }
        let navigateEle: Element = closest((e.target as Element), '.' + cls.NAVIGATE_CLASS);
        let navigateView: View = this.parent.getNavigateView();
        let sameView: boolean = this.parent.options.currentView === navigateView;
        if (isNullOrUndefined(navigateEle) || sameView) {
            //isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly && this.parent.options.currentView !== 'MonthAgenda') {
                //this.parent.quickPopup.quickPopupHide();
                return;
            }
            if (this.parent.isAdaptive && ((e.target as Element).classList.contains(cls.MORE_INDICATOR_CLASS) ||
                closest((e.target as Element), '.' + cls.MORE_INDICATOR_CLASS))) {
                return;
            }
            let isWorkCell: boolean = target.classList.contains(cls.WORK_CELLS_CLASS) ||
                target.classList.contains(cls.ALLDAY_CELLS_CLASS);
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            this.parent.currentCell = target;
            let args: CellClickEventArgs =
                <CellClickEventArgs>extend({}, this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' }, true);
            args.startTime = util.addLocalOffset(args.startTime);
            args.endTime = util.addLocalOffset(args.endTime);
            this.parent.dotNetRef.invokeMethodAsync('TriggerCellClick', args);
        } else {
            let date: Date = this.parent.getDateFromElement(target);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                let currentDate: Date = new Date(this.parent.getMsFromDate(date));
                this.parent.dotNetRef.invokeMethodAsync('OnViewNavigate', currentDate, this.parent.getNavigateView());
            }
        }
    }

    public cellDblClick(e: Event): void {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        let args: CellClickEventArgs =
            <CellClickEventArgs>extend({}, this.parent.activeCellsData, { cancel: false, event: e, name: 'OnCellDoubleClick' }, true);
        args.startTime = util.addLocalOffset(args.startTime);
        args.endTime = util.addLocalOffset(args.endTime);
        this.parent.dotNetRef.invokeMethodAsync('OnOpenEditor', args, 'Add');
        // this.parent.trigger(event.cellDoubleClick, args, (clickArgs: CellClickEventArgs) => {
        //     clickArgs = this.serializingData(clickArgs, e);
        //     let date: Date = new Date(clickArgs.startTime.getTime());
        //     if (!this.parent.isMinMaxDate(new Date(date.setHours(0, 0, 0, 0)))) {
        //         return;
        //     }
        //     if (!clickArgs.cancel) {
        //         this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
        //     }
        // });
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
        if (this.parent.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    }
}
