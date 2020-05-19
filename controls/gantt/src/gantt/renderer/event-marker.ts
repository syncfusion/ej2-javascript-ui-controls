/**
 * To render and update event markers in Gantt
 */
import { Gantt } from '../base/gantt';
import { createElement, formatUnit, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
export class EventMarker {
    public parent: Gantt;
    public eventMarkersContainer: HTMLElement;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.eventMarkersContainer = null;
    }
    /**
     * @private
     */
    public renderEventMarkers(): void {
        if (this.parent.eventMarkers && this.parent.eventMarkers.length > 0) {
            if (!this.parent.ganttChartModule.chartBodyContent.contains(this.eventMarkersContainer)) {
                this.eventMarkersContainer = createElement('div', {
                    className: cls.eventMarkersContainer
                });
                this.parent.ganttChartModule.chartBodyContent.appendChild(this.eventMarkersContainer);
            }
            this.eventMarkersContainer.innerHTML = '';
            this.getEventMarkersElements(this.eventMarkersContainer);
        } else {
            this.removeContainer();
        }
    }
    /**
     * @private
     */
    public removeContainer(): void {
        if (this.eventMarkersContainer) {
            remove(this.eventMarkersContainer);
            this.eventMarkersContainer = null;
        }
    }
    /**
     * Method to get event markers as html string
     */
    private getEventMarkersElements(container: HTMLElement): void {
        let left: number;
        let eventMarkerElement: HTMLElement;
        let spanElement: HTMLElement;
        let rightArrow: HTMLElement;

        for (let i: number = 0; i < this.parent.eventMarkers.length; i++) {
            left = this.parent.dataOperation.getTaskLeft(
                this.parent.dateValidationModule.getDateFromFormat(this.parent.eventMarkers[i].day, true), false);
            eventMarkerElement = createElement('div', {
                className: cls.eventMarkersChild, styles: `left:${left}px;  height:100%;`,
                id: 'stripline' + i
            });
            if (this.parent.eventMarkers[i].label) {
                spanElement = createElement('div', {
                    className: cls.eventMarkersSpan,
                });
                let property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
                spanElement[property] = this.parent.eventMarkers[i].label;
                eventMarkerElement.appendChild(spanElement);
                rightArrow = createElement('div', {
                    className: 'e-gantt-right-arrow'
                });
                eventMarkerElement.appendChild(rightArrow);
            }
            if (this.parent.eventMarkers[i].cssClass) {
                eventMarkerElement.classList.add(this.parent.eventMarkers[i].cssClass);
            }
            eventMarkerElement.setAttribute('tabindex', '-1');
            if (!isNullOrUndefined(this.parent.eventMarkers[i].day)) {
                eventMarkerElement.setAttribute('aria-label', this.parent.localeObj.getConstant('eventMarkers') + ' '
                    + (typeof this.parent.eventMarkers[i].day === 'string' ?
                        this.parent.eventMarkers[i].day : this.parent.getFormatedDate(this.parent.eventMarkers[i].day as Date))
                    + ' ' + this.parent.eventMarkers[i].label);
            }
            container.appendChild(eventMarkerElement);
        }
    }
    /**
     * @private
     */
    public updateContainerHeight(): void {
        if (this.eventMarkersContainer) {
            this.eventMarkersContainer.style.height = formatUnit(this.parent.contentHeight);
        }
    }
}
