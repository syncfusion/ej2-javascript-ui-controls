/**
 * To render and update event markers in Gantt
 */
import { Gantt } from '../base/gantt';
import { createElement, formatUnit, remove, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { IEventMarkerInfo } from '../base/interface';
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
        let top: string;
        const eventMarkerCollection: IEventMarkerInfo[] = [];
        for (let i: number = 0; i < this.parent.eventMarkers.length; i++) {
            if (!isNullOrUndefined(this.parent.eventMarkers[i as number].day)) {
                this.parent['isFromEventMarker'] = true;
                left = this.parent.dataOperation.getTaskLeft(
                    this.parent.dateValidationModule.getDateFromFormat(
                        this.parent.eventMarkers[i as number].day, true), false, this.parent.defaultCalendarContext, true
                );
                top = this.parent.eventMarkers[i as number]['properties'].top;
                let heightException: boolean = true;
                if (this.parent.ganttHeight) {
                    heightException = parseFloat(top) <= (this.parent.ganttHeight - 155);
                }
                let markerTop: string = (top && parseFloat(top) >= 0 && heightException && top.includes('px')) ? top : '50px';
                if (!top && document.body.className.includes('e-bigger')) {
                    markerTop = `${parseFloat(markerTop) + 15}px`;
                }
                this.parent['isFromEventMarker'] = false;
                eventMarkerCollection.push({ id: i, left: left, label: this.parent.eventMarkers[i as number].label,
                    date: this.parent.dateValidationModule.getDateFromFormat(this.parent.eventMarkers[i as number].day, true),
                    top: markerTop });
                let align: string;
                if (this.parent.enableRtl) {
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
                    if (this.parent.enableHtmlSanitizer && typeof(spanElement[property as string]) === 'string') {
                        spanElement[property as string] = SanitizeHtmlHelper.sanitize(spanElement[property as string]);
                    }
                    if (this.parent.enableRtl) {
                        spanElement.style.right = '5px';
                    }
                    else {
                        spanElement.style.left = '5px';
                    }
                    spanElement.style.setProperty('top', markerTop, 'important');
                    eventMarkerElement.appendChild(spanElement);
                    rightArrow = createElement('div', {
                        className: 'e-gantt-right-arrow'
                    });
                    const rightArrowTop: number = parseFloat(spanElement.style.top) < 10
                        ? parseFloat(spanElement.style.top) - 1
                        : parseFloat(spanElement.style.top);
                    if (document.body.className.includes('e-bigger')) {
                        rightArrow.style.setProperty('top', `${rightArrowTop + 8}px`, 'important');
                    } else {
                        rightArrow.style.setProperty('top', `${rightArrowTop + 10}px`, 'important');
                    }
                    eventMarkerElement.appendChild(rightArrow);
                }
                if (this.parent.eventMarkers[i as number].cssClass) {
                    eventMarkerElement.classList.add(this.parent.eventMarkers[i as number].cssClass);
                }
                eventMarkerElement.setAttribute('tabindex', '-1');
                eventMarkerElement.setAttribute('aria-label', this.parent.localeObj.getConstant('eventMarkers') + ' '
                    + (typeof this.parent.eventMarkers[i as number].day === 'string' ?
                        this.parent.eventMarkers[i as number].day :
                        this.parent.getFormatedDate(this.parent.eventMarkers[i as number].day as Date))
                    + ' ' + this.parent.eventMarkers[i as number].label);
                container.appendChild(eventMarkerElement);
            }
        }
        this.parent.eventMarkerColloction = eventMarkerCollection;
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
