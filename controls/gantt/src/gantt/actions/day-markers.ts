import { Gantt } from '../base/gantt';
import { NonWorkingDay } from '../renderer/nonworking-day';
import { EventMarker } from '../renderer/event-marker';
import { getValue } from '@syncfusion/ej2-base';

/**
 * DayMarkers module is used to render event markers, holidays and to highlight the weekend days.
 */
export class DayMarkers {
    private parent: Gantt;
    private nonworkingDayRender: NonWorkingDay;
    private eventMarkerRender: EventMarker;

    constructor(parent: Gantt) {
        this.parent = parent;
        this.nonworkingDayRender = new NonWorkingDay(this.parent);
        this.eventMarkerRender = new EventMarker(this.parent);
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.on('refreshDayMarkers', this.refreshMarkers, this);
        this.parent.on('updateHeight', this.updateHeight, this);
        this.parent.on('ui-update', this.propertyChanged, this);
    }

    private propertyChanged(property: Record<string, unknown>): void {
        const keys: string[] = Object.keys(getValue('properties', property));
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i as number];
            switch (key) {
            case 'eventMarkers':
                this.eventMarkerRender.renderEventMarkers();
                this.updateHeight();
                break;
            case 'highlightWeekends':
                this.nonworkingDayRender.renderWeekends();
                this.updateHeight();
                break;
            case 'holidays':
                this.nonworkingDayRender.renderHolidays();
                this.updateHeight();
                break;
            }
        }
    }

    private refreshMarkers(): void {
        this.nonworkingDayRender.renderWeekends();
        this.nonworkingDayRender.renderHolidays();
        if (this.parent.gridLines === 'Vertical' || this.parent.gridLines === 'Both') {
            this.parent['renderChartVerticalLines']();
        }
        this.eventMarkerRender.renderEventMarkers();
    }

    private updateHeight(): void {
        this.nonworkingDayRender.updateContainerHeight();
        this.eventMarkerRender.updateContainerHeight();
    }
    /**
     * To get module name
     *
     * @returns {string} .
     */
    public getModuleName(): string {
        return 'dayMarkers';
    }
    /**
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.nonworkingDayRender.removeContainers();
        this.eventMarkerRender.removeContainer();
        this.parent.off('refreshDayMarkers', this.refreshMarkers);
        this.parent.off('updateHeight', this.updateHeight);
        this.parent.off('ui-update', this.propertyChanged);
    }
}
