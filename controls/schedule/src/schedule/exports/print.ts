/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';

/**
 * Print Module
 */

export class Print {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public printScheduler(): void {
        const clone: HTMLElement = this.parent.element.cloneNode(true) as HTMLElement;
        clone.id = this.parent.element.id + '_print';
        document.body.appendChild(clone);
        const scrollableEle: Element = this.getScrollableElement(this.parent.element);
        this.print(clone, scrollableEle.scrollTop, scrollableEle.scrollLeft);
    }

    private getScrollableElement(element: Element): Element {
        if (this.parent.currentView === 'MonthAgenda') {
            return element.querySelector('.e-appointment-wrap');
        }
        return element.querySelector('.e-content-wrap');
    }

    private print(clone: HTMLElement, top?: number, left?: number): void {
        const links: Element[] = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
        let reference: string = '';
        for (let i: number = 0, len: number = links.length; i < len; i++) {
            reference += links[i].outerHTML;
        }
        const div: Element = createElement('div');
        clone.style.width = this.parent.element.offsetWidth + 'px';
        const elementWidth: number = Math.round((parseInt(clone.style.width, 10)) / 100) * 100;
        div.appendChild(clone);
        const printWindow: Window = window.open('', 'print', 'height=550,width=' + elementWidth + ',tabbar=no');
        printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
            '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(
            () => {
                if ((printWindow as any).ready) {
                    this.scrolledScheduler(printWindow, top, left);
                    printWindow.print();
                    printWindow.close();
                }
            },
            500);
    }

    private scrolledScheduler(printWindow: Window, top: number, left: number): void {
        const scrollableEle: Element = this.getScrollableElement(printWindow.document.body);
        scrollableEle.scrollLeft = left;
        scrollableEle.scrollTop = top;
        const headerTimeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-date-header-wrap');
        if (this.parent.activeView.isTimelineView()) {
            headerTimeCellsScroll.scrollLeft = left;
        }
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek') {
            const timeCellsScroll: HTMLElement = printWindow.document.querySelector('.e-time-cells-wrap');
            timeCellsScroll.scrollTop = top;
            headerTimeCellsScroll.scrollLeft = left;
        }
        if (this.parent.currentView === 'Month') {
            headerTimeCellsScroll.scrollLeft = left;
        }
    }

    protected getModuleName(): string {
        return 'print';
    }

    public destroy(): void {
        this.parent = null;
    }

}
