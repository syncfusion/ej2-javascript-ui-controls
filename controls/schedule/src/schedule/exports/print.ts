/* eslint-disable @typescript-eslint/no-explicit-any */
import { print as basePrint, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { EventSettingsModel } from '../models/models';
import { ScheduleModel } from '../base/schedule-model';
import * as events from '../base/constant';

/**
 * Print Module
 */

export class Print {
    private parent: Schedule;
    private printInstance: Schedule;
    private printWindow: Window;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public print(printOptions?: ScheduleModel): void {
        if (isNullOrUndefined(printOptions)) {
            this.printScheduler();
        } else {
            this.printSchedulerWithModel(printOptions);
        }
    }

    private printScheduler(): void {
        const clone: HTMLElement = this.parent.element.cloneNode(true) as HTMLElement;
        clone.id = this.parent.element.id + '_print';
        document.body.appendChild(clone);
        const className: string = this.parent.currentView === 'MonthAgenda' ? '.e-appointment-wrap' : '.e-content-wrap';
        const scrollableEle: Element = this.parent.element.querySelector(className);
        const links: Element[] = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
        let reference: string = '';
        for (const link of links) {
            reference += link.outerHTML;
        }
        const div: Element = createElement('div');
        clone.style.width = this.parent.element.offsetWidth + 'px';
        const elementWidth: number = Math.round((parseInt(clone.style.width, 10)) / 100) * 100;
        div.appendChild(clone);
        const printWindow: Window = window.open('', 'print', 'height=550,width=' + elementWidth + ',tabbar=no');
        printWindow.document.write('<!DOCTYPE html><html><head>' + reference + '</head><body>' + div.innerHTML +
            '<script>(function() { window.ready = true; })();</script></body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            if ((printWindow as any).ready && scrollableEle) {
                // eslint-disable-next-line no-self-assign
                scrollableEle.scrollLeft = scrollableEle.scrollLeft;
                // eslint-disable-next-line no-self-assign
                scrollableEle.scrollTop = scrollableEle.scrollTop;
                const headerTimeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-date-header-wrap');
                if (headerTimeCellsScroll) {
                    headerTimeCellsScroll.scrollLeft = scrollableEle.scrollLeft;
                }
                const timeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-time-cells-wrap');
                if (timeCellsScroll) {
                    timeCellsScroll.scrollTop = scrollableEle.scrollTop;
                }
                printWindow.print();
                printWindow.close();
            }
        }, 500);
    }

    private printSchedulerWithModel(printOptions: ScheduleModel): void {
        const element: HTMLElement = createElement('div', { id: this.parent.element.id + '_print', className: 'e-print-schedule' });
        document.body.appendChild(element);
        this.printInstance = new Schedule(this.getPrintScheduleModel(printOptions));
        this.printInstance.isPrinting = true;
        this.printInstance.appendTo(element);
        this.printInstance.on(events.print, this.contentReady, this);
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
    }

    private getPrintScheduleModel(printOptions: ScheduleModel): ScheduleModel {
        const printModel: ScheduleModel = {};
        let scheduleProps: string[] = Object.keys((this.parent as any).properties);
        const scheduleEvents: string[] = ['created', 'actionBegin', 'actionComplete', 'renderCell', 'eventRendered', 'dataBinding', 'dataBound'];
        scheduleProps = scheduleProps.concat(scheduleEvents);
        let eventSettings: EventSettingsModel;
        for (const key of scheduleProps) {
            switch (key) {
            case 'eventSettings':
                eventSettings = Object.assign({}, (this.parent.eventSettings as Record<string, any>).properties);
                eventSettings.dataSource = this.parent.eventsData;
                printModel[key] = eventSettings;
                break;
            default:
                (printModel as Record<string, any>)[key] = isNullOrUndefined((printOptions as Record<string, any>)[key]) ?
                    (this.parent as Record<string, any>)[key] : (printOptions as Record<string, any>)[key];
                break;
            }
        }
        return printModel;
    }

    private contentReady(): void {
        this.printWindow = basePrint(this.printInstance.element, this.printWindow);
        this.printWindow.onbeforeunload = () => {
            this.printInstance.off(events.print, this.contentReady);
            this.printInstance.destroy();
            this.printInstance = null;
            this.printWindow = null;
        };
    }

    protected getModuleName(): string {
        return 'print';
    }

    public destroy(): void {
        this.parent = null;
    }

}
