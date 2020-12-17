import { BlazorDotnetObject, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { SfSchedule } from './schedule';
import { BlazorScheduleElement, CellClickEventArgs, IScheduleOptions, ViewsModel } from './schedule/base/interface';
import * as util from './schedule/base/util';
import * as cls from './schedule/base/css-constant';

// tslint:disable
let Schedule: object = {
    initialize(element: BlazorScheduleElement, options: IScheduleOptions, viewOptions: ViewsModel, dotnetRef: BlazorDotnetObject): void {
        if (element) {
            options.selectedDate = new Date(options.selectedDate);
            options.minDate = new Date(options.minDate);
            options.maxDate = new Date(options.maxDate);
            if (isNullOrUndefined(viewOptions.group.resources)) {
                viewOptions.group.resources = [];
            }
            if (element.blazor__instance) {
                element.blazor__instance.options = options;
                element.blazor__instance.activeViewOptions = viewOptions;
                element.blazor__instance.render(true);
                element.blazor__instance.setPersistence();
            } else {
                new SfSchedule(element, options, viewOptions, dotnetRef);
                dotnetRef.invokeMethodAsync('TriggerCreatedEvent');
            }
        }
    },
    createCalendarPopup(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.createCalendarPopup();
        }
    },
    exportSave(fileName: string, fileType: string): void {
        if (navigator.msSaveBlob) {
            //Download document in Edge browser
            let data: string = window.atob(fileType);
            let bytes: Uint8Array = new Uint8Array(data.length);
            for (let i: number = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            let blob: Blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });
            navigator.msSaveBlob(blob, fileName);
        } else {
            let link: HTMLAnchorElement = document.createElement('a');
            link.download = fileName;
            link.href = 'data:application/octet-stream;base64,' + fileType;
            document.body.appendChild(link); // Needed for Firefox
            link.click();
            document.body.removeChild(link);
        }
    },
    exportToICS(icsString: string, fileName: string): void {
        let buffer: Blob = new Blob([icsString], { type: 'data:text/calendar;charset=utf8' });
        fileName = (fileName || 'Calendar') + '.ics';
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(buffer, fileName);
        } else {
            let downloadLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            downloadLink.download = fileName;
            downloadLink.href = URL.createObjectURL(buffer);
            let event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout((): void => {
                URL.revokeObjectURL(downloadLink.href);
                downloadLink.href = undefined;
            });
        }
    },
    scrollTo(element: BlazorScheduleElement, hour: string, scrollDate?: Date): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollTo(hour, scrollDate);
        }
    },
    destroy(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    },
    validation(element: BlazorScheduleElement, fieldName: string, isQuickPopup: boolean) {
        if (element && element.blazor__instance) {
            element.blazor__instance.getTooltipPosition(fieldName, isQuickPopup);
        }
    },
    createQuickPopup(element: BlazorScheduleElement, guid: string): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.createQuickPopup(guid);
        }
    },
    adjustPopupPosition(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.adjustPopupPosition();
        }
    },
    closeQuickInfoPopup(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.onQuickPopupClose();
        }
    },
    createMoreEventPopup(element: BlazorScheduleElement, clsName: string, dataDate: string): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.createMoreEventPopup(clsName, dataDate);
        }
    },
    moreEventPopupClose(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.onMoreEventPopupClose();
        }
    },
    dataReady: function styleAttribute(element: BlazorScheduleElement, groupAdaptive: boolean, count?: number, isScrollTop?: boolean) {
        if (element && element.blazor__instance) {
            element.blazor__instance.uiStateValues.isGroupAdaptive = groupAdaptive;
            element.blazor__instance.dataReady(count, isScrollTop);
        }
    },
    beforeOpenEditor(element: BlazorScheduleElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.beforeOpenEditor();
        }
    },
    scrollContentReady(element: BlazorScheduleElement, updateHeight: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollContentReady(updateHeight);
        }
    },
    scrollToResource(element: BlazorScheduleElement, groupIndex: number, levelIndex: number): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollToResource(groupIndex, levelIndex);
        }
    },
    printSchedule(element: BlazorScheduleElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.print();
        }
    },
    inlineEdit(element: BlazorScheduleElement, clickType: string, isTemplate: boolean, guid: string = null) {
        if (element && element.blazor__instance) {
            element.blazor__instance.inlineEdit(clickType, isTemplate, guid);
        }
    },
    setWorkHours(element: BlazorScheduleElement, dates: Date[], start: string, end: string, groupIndex?: number) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setWorkHours(dates, start, end, groupIndex);
        }
    },
    resetWorkHours(element: BlazorScheduleElement, dates: Date[], start: string, end: string, groupIndex?: number) {
        if (element && element.blazor__instance) {
            element.blazor__instance.resetWorkHours(dates, start, end, groupIndex);
        }
    },
    getSelectedDetails(element: BlazorScheduleElement, isEvent: boolean): string {
        if (element && element.blazor__instance) {
            if (isEvent) {
                let eventGuid: string[];
                let selectedElements: Element[] = [].slice.call(element.querySelectorAll('.' + cls.APPOINTMENT_BORDER)) as Element[];
                selectedElements.forEach((ele: Element) => {
                    eventGuid.push(ele.getAttribute('data-guid'));
                });
                return JSON.stringify(eventGuid);
            }
            else {
                let selectedElements: Element[] = element.blazor__instance.getSelectedElements();
                let clickArgs: CellClickEventArgs = element.blazor__instance.getCellDetails(selectedElements);
                clickArgs.startTime = util.addLocalOffset(clickArgs.startTime);
                clickArgs.endTime = util.addLocalOffset(clickArgs.endTime);
                return JSON.stringify(clickArgs);    
            }
        }
        return null;
    },
    getTargetDetails(element: BlazorScheduleElement, left: number, top: number, targetType: string): string {
        if (element && element.blazor__instance) {
            let target: Element = document.elementFromPoint(left, top);
            let targetElement: Element;
            if (target && targetType == "event") {
                targetElement = closest(target, '.' + cls.APPOINTMENT_CLASS);
                if (targetElement) {
                    return JSON.stringify(targetElement.getAttribute('data-guid'));
                }
            }
            else if (target && targetType == "cell") {
                targetElement = closest(target, '.' + cls.HEADER_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' + cls.WORK_CELLS_CLASS);
                if (targetElement) {
                    let clickArgs: CellClickEventArgs = element.blazor__instance.getCellDetails(targetElement);
                    clickArgs.startTime = util.addLocalOffset(clickArgs.startTime);
                    clickArgs.endTime = util.addLocalOffset(clickArgs.endTime);
                    return JSON.stringify(clickArgs);
                }
            }
            else if (target && targetType == "resource") {
                targetElement = closest(target, '.' + cls.RESOURCE_CELLS_CLASS);
                return JSON.stringify(targetElement.getAttribute('data-group-index'));
            }
            return null;
        }
        return null;
    }
}

export default Schedule;