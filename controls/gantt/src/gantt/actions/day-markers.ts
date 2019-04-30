import { Gantt } from '../base/gantt';
import { NonWorkingDay } from '../renderer/nonworking-day';
import { EventMarker } from '../renderer/event-marker';
import { getValue } from '@syncfusion/ej2-base';

/**
 * 
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

    private propertyChanged(property: object): void {
        let keys: string[] = Object.keys(getValue('properties', property));
        for (let i: number = 0; i < keys.length; i++) {
            let key: string = keys[i];
            switch (key) {
                case 'eventMarkers':
                    this.eventMarkerRender.renderEventMarkers();
                    break;
                case 'highlightWeekends':
                    this.nonworkingDayRender.renderWeekends();
                    break;
                case 'holidays':
                    this.nonworkingDayRender.renderHolidays();
                    break;
            }
        }
    }

    private refreshMarkers(): void {
        this.eventMarkerRender.renderEventMarkers();
        this.nonworkingDayRender.renderWeekends();
        this.nonworkingDayRender.renderHolidays();
    }

    private updateHeight(): void {
        this.nonworkingDayRender.updateContainerHeight();
        this.eventMarkerRender.updateContainerHeight();
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'dayMarkers';
    }
    /**
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