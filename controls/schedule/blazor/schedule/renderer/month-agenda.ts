import { formatUnit } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import { Month } from './month';
import * as cls from '../base/css-constant';

/**
 * month agenda view
 */
export class MonthAgenda extends Month {
    constructor(parent: SfSchedule) {
        super(parent);
    }

    public renderAppointmentContainer(): void {
        if (this.getContentAreaElement().style.height === 'auto') {
            return;
        }
        this.setEventWrapperHeight();
    }

    private setEventWrapperHeight(): void {
        let headerHeight: number = this.getHeaderBarHeight(true);
        let contentArea: HTMLElement = this.getContentAreaElement().firstElementChild as HTMLElement;
        let dateHeader: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement;
        let availableHeight: number = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight - contentArea.offsetHeight;
        let wrapperContainer: HTMLElement = this.element.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS) as HTMLElement;
        let eventWrapper: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAP_CLASS) as HTMLElement;
        wrapperContainer.style.height = eventWrapper.style.height = formatUnit(availableHeight);
    }
}