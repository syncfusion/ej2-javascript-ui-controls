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
     * @returns {void} .
     * @private
     */
    public renderEventMarkers(): void {
        if (this.parent.eventMarkers && this.parent.eventMarkers.length > 0) {
            if (!this.parent.ganttChartModule.chartBodyContent.contains(this.eventMarkersContainer)) {
                this.eventMarkersContainer = createElement('div', {
                    className: cls.eventMarkersContainer
                });
                this.eventMarkersContainer.setAttribute('role', 'term');
                this.parent.ganttChartModule.chartBodyContent.appendChild(this.eventMarkersContainer);
            }
            this.eventMarkersContainer.innerHTML = '';
            this.getEventMarkersElements(this.eventMarkersContainer);
        } else {
            this.removeContainer();
        }
    }
    /**
     * @returns {void} .
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
     *
     * @param {HTMLElement} container .
     * @returns {void} .
     */
    private getEventMarkersElements(container: HTMLElement): void {
        let left: number;
        let eventMarkerElement: HTMLElement;
        let spanElement: HTMLElement;
        let rightArrow: HTMLElement;

        for (let i: number = 0; i < this.parent.eventMarkers.length; i++) {
            left = this.parent.dataOperation.getTaskLeft(
                this.parent.dateValidationModule.getDateFromFormat(this.parent.eventMarkers[i as number].day, true), false);
            let align: string;
            if(this.parent.enableRtl) {
                align = `right:${left}px;`;
            }
            else {
                align = `left:${left}px;`;
            }
            eventMarkerElement = createElement('div', {
                className: cls.eventMarkersChild, styles: `${align}  height:100%;`,
                id: 'stripline' + i
            });
            if (this.parent.eventMarkers[i as number].label) {
                spanElement = createElement('div', {
                    className: cls.eventMarkersSpan
                });
                const property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
                spanElement[property as string] = this.parent.eventMarkers[i as number].label;
                if (this.parent.enableRtl) {
                   spanElement.style.right = '5px';
                }
                else {
                    spanElement.style.left = '5px';
                }
                eventMarkerElement.appendChild(spanElement);
                rightArrow = createElement('div', {
                    className: 'e-gantt-right-arrow'
                });
                eventMarkerElement.appendChild(rightArrow);
            }
            if (this.parent.eventMarkers[i as number].cssClass) {
                eventMarkerElement.classList.add(this.parent.eventMarkers[i as number].cssClass);
            }
            eventMarkerElement.setAttribute('tabindex', '-1');
            if (!isNullOrUndefined(this.parent.eventMarkers[i as number].day)) {
                eventMarkerElement.setAttribute('aria-label', this.parent.localeObj.getConstant('eventMarkers') + ' '
                    + (typeof this.parent.eventMarkers[i as number].day === 'string' ?
                        this.parent.eventMarkers[i as number].day : this.parent.getFormatedDate(this.parent.eventMarkers[i as number].day as Date))
                    + ' ' + this.parent.eventMarkers[i as number].label);
            }
            container.appendChild(eventMarkerElement);
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public updateContainerHeight(): void {
        if (this.eventMarkersContainer) {
            this.eventMarkersContainer.style.height = formatUnit(this.parent.getContentHeight());
        }
    }
}
